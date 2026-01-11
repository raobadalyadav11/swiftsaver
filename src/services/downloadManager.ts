// Download Manager Service

import RNFS from 'react-native-fs';
import { DownloadTask, DownloadStatus, DownloadProgress, VideoQuality, MediaFormat } from '../types';
import { APP_CONFIG } from '../constants';

type DownloadListener = (tasks: DownloadTask[]) => void;
type ProgressListener = (progress: DownloadProgress) => void;

class DownloadManagerService {
    private tasks: Map<string, DownloadTask> = new Map();
    private activeDownloads: Map<string, { jobId: number }> = new Map();
    private listeners: Set<DownloadListener> = new Set();
    private progressListeners: Set<ProgressListener> = new Set();

    constructor() {
        this.initializeStorage();
    }

    private async initializeStorage(): Promise<void> {
        try {
            const downloadDir = `${RNFS.DocumentDirectoryPath}/${APP_CONFIG.storage.downloadFolder}`;
            const exists = await RNFS.exists(downloadDir);
            if (!exists) {
                await RNFS.mkdir(downloadDir);
            }
        } catch (error) {
            console.error('Failed to initialize download storage:', error);
        }
    }

    // Subscribe to task updates
    subscribe(listener: DownloadListener): () => void {
        this.listeners.add(listener);
        listener(this.getAllTasks());
        return () => this.listeners.delete(listener);
    }

    // Subscribe to progress updates
    subscribeToProgress(listener: ProgressListener): () => void {
        this.progressListeners.add(listener);
        return () => this.progressListeners.delete(listener);
    }

    private notifyListeners(): void {
        const tasks = this.getAllTasks();
        this.listeners.forEach(listener => listener(tasks));
    }

    private notifyProgress(progress: DownloadProgress): void {
        this.progressListeners.forEach(listener => listener(progress));
    }

    // Create a new download task
    createTask(
        url: string,
        title: string,
        thumbnail: string | undefined,
        quality: VideoQuality,
        format: MediaFormat
    ): DownloadTask {
        const id = `download_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const fileName = `${title.replace(/[^a-z0-9]/gi, '_').slice(0, 50)}_${quality}.${format}`;

        const task: DownloadTask = {
            id,
            url,
            fileName,
            title,
            thumbnail,
            quality,
            format,
            status: 'pending',
            progress: 0,
            totalSize: 0,
            downloadedSize: 0,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        this.tasks.set(id, task);
        this.notifyListeners();
        return task;
    }

    // Start download
    async startDownload(taskId: string, downloadUrl: string): Promise<void> {
        const task = this.tasks.get(taskId);
        if (!task) throw new Error('Task not found');

        // Check concurrent download limit
        if (this.activeDownloads.size >= APP_CONFIG.download.maxConcurrent) {
            task.status = 'pending';
            task.updatedAt = new Date();
            this.notifyListeners();
            return;
        }

        try {
            task.status = 'downloading';
            task.updatedAt = new Date();
            this.notifyListeners();

            const filePath = `${RNFS.DocumentDirectoryPath}/${APP_CONFIG.storage.downloadFolder}/${task.fileName}`;

            // Start download with progress tracking
            const { jobId, promise } = RNFS.downloadFile({
                fromUrl: downloadUrl,
                toFile: filePath,
                progress: (res) => {
                    const progress = Math.round((res.bytesWritten / res.contentLength) * 100);
                    task.progress = progress;
                    task.downloadedSize = res.bytesWritten;
                    task.totalSize = res.contentLength;
                    task.speed = res.bytesWritten; // Simplified - would need timing for accurate speed
                    task.updatedAt = new Date();

                    this.notifyProgress({
                        taskId,
                        progress,
                        downloadedSize: res.bytesWritten,
                        totalSize: res.contentLength,
                        speed: res.bytesWritten,
                        eta: (res.contentLength - res.bytesWritten) / (res.bytesWritten || 1),
                    });
                    this.notifyListeners();
                },
                progressInterval: 250,
                progressDivider: 1,
            });

            this.activeDownloads.set(taskId, { jobId });

            const result = await promise;

            if (result.statusCode === 200) {
                task.status = 'completed';
                task.progress = 100;
                task.filePath = filePath;
                task.completedAt = new Date();
            } else {
                throw new Error(`Download failed with status ${result.statusCode}`);
            }
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            task.status = 'failed';
            task.error = errorMessage;
        } finally {
            this.activeDownloads.delete(taskId);
            task.updatedAt = new Date();
            this.notifyListeners();

            // Start next pending download
            this.processQueue();
        }
    }

    // Pause download
    async pauseDownload(taskId: string): Promise<void> {
        const activeDownload = this.activeDownloads.get(taskId);
        const task = this.tasks.get(taskId);

        if (activeDownload && task) {
            RNFS.stopDownload(activeDownload.jobId);
            task.status = 'paused';
            task.updatedAt = new Date();
            this.activeDownloads.delete(taskId);
            this.notifyListeners();
        }
    }

    // Resume download
    async resumeDownload(taskId: string, downloadUrl: string): Promise<void> {
        const task = this.tasks.get(taskId);
        if (!task || task.status !== 'paused') return;

        // For simplicity, restart download (proper resume would need range requests)
        await this.startDownload(taskId, downloadUrl);
    }

    // Cancel download
    async cancelDownload(taskId: string): Promise<void> {
        const activeDownload = this.activeDownloads.get(taskId);
        const task = this.tasks.get(taskId);

        if (activeDownload) {
            RNFS.stopDownload(activeDownload.jobId);
            this.activeDownloads.delete(taskId);
        }

        if (task) {
            task.status = 'cancelled';
            task.updatedAt = new Date();

            // Delete partial file if exists
            if (task.filePath) {
                try {
                    await RNFS.unlink(task.filePath);
                } catch {
                    // Ignore if file doesn't exist
                }
            }

            this.notifyListeners();
        }
    }

    // Retry failed download
    async retryDownload(taskId: string, downloadUrl: string): Promise<void> {
        const task = this.tasks.get(taskId);
        if (!task || task.status !== 'failed') return;

        task.status = 'pending';
        task.progress = 0;
        task.downloadedSize = 0;
        task.error = undefined;
        task.updatedAt = new Date();
        this.notifyListeners();

        await this.startDownload(taskId, downloadUrl);
    }

    // Process download queue
    private processQueue(): void {
        if (this.activeDownloads.size >= APP_CONFIG.download.maxConcurrent) return;

        const pendingTasks = Array.from(this.tasks.values())
            .filter(t => t.status === 'pending')
            .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());

        // Note: Queue processing would need download URLs, handled by caller
    }

    // Remove completed download
    removeTask(taskId: string): void {
        const task = this.tasks.get(taskId);
        if (task && (task.status === 'completed' || task.status === 'cancelled' || task.status === 'failed')) {
            this.tasks.delete(taskId);
            this.notifyListeners();
        }
    }

    // Clear all completed downloads
    clearCompleted(): void {
        for (const [id, task] of this.tasks) {
            if (task.status === 'completed') {
                this.tasks.delete(id);
            }
        }
        this.notifyListeners();
    }

    // Get all tasks
    getAllTasks(): DownloadTask[] {
        return Array.from(this.tasks.values()).sort(
            (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
        );
    }

    // Get tasks by status
    getTasksByStatus(status: DownloadStatus): DownloadTask[] {
        return this.getAllTasks().filter(t => t.status === status);
    }

    // Get download directory path
    getDownloadDirectory(): string {
        return `${RNFS.DocumentDirectoryPath}/${APP_CONFIG.storage.downloadFolder}`;
    }
}

// Singleton instance
export const downloadManager = new DownloadManagerService();
export default downloadManager;
