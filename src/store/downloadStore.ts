// Download Store - Zustand state management for downloads

import { create } from 'zustand';
import { DownloadTask, DownloadStatus, VideoQuality, MediaFormat } from '../types';
import { downloadManager } from '../services';

interface DownloadState {
    tasks: DownloadTask[];
    isInitialized: boolean;

    // Actions
    addTask: (
        url: string,
        title: string,
        thumbnail: string | undefined,
        quality: VideoQuality,
        format: MediaFormat
    ) => DownloadTask;
    startDownload: (taskId: string, downloadUrl: string) => Promise<void>;
    pauseDownload: (taskId: string) => Promise<void>;
    resumeDownload: (taskId: string, downloadUrl: string) => Promise<void>;
    cancelDownload: (taskId: string) => Promise<void>;
    retryDownload: (taskId: string, downloadUrl: string) => Promise<void>;
    removeTask: (taskId: string) => void;
    clearCompleted: () => void;

    // Selectors
    getActiveDownloads: () => DownloadTask[];
    getPendingDownloads: () => DownloadTask[];
    getCompletedDownloads: () => DownloadTask[];
    getFailedDownloads: () => DownloadTask[];
    getTaskById: (taskId: string) => DownloadTask | undefined;
}

export const useDownloadStore = create<DownloadState>((set, get) => {
    // Subscribe to download manager updates
    downloadManager.subscribe((tasks) => {
        set({ tasks, isInitialized: true });
    });

    return {
        tasks: [],
        isInitialized: false,

        addTask: (url, title, thumbnail, quality, format) => {
            return downloadManager.createTask(url, title, thumbnail, quality, format);
        },

        startDownload: async (taskId, downloadUrl) => {
            await downloadManager.startDownload(taskId, downloadUrl);
        },

        pauseDownload: async (taskId) => {
            await downloadManager.pauseDownload(taskId);
        },

        resumeDownload: async (taskId, downloadUrl) => {
            await downloadManager.resumeDownload(taskId, downloadUrl);
        },

        cancelDownload: async (taskId) => {
            await downloadManager.cancelDownload(taskId);
        },

        retryDownload: async (taskId, downloadUrl) => {
            await downloadManager.retryDownload(taskId, downloadUrl);
        },

        removeTask: (taskId) => {
            downloadManager.removeTask(taskId);
        },

        clearCompleted: () => {
            downloadManager.clearCompleted();
        },

        getActiveDownloads: () => {
            return get().tasks.filter(t => t.status === 'downloading');
        },

        getPendingDownloads: () => {
            return get().tasks.filter(t => t.status === 'pending');
        },

        getCompletedDownloads: () => {
            return get().tasks.filter(t => t.status === 'completed');
        },

        getFailedDownloads: () => {
            return get().tasks.filter(t => t.status === 'failed');
        },

        getTaskById: (taskId) => {
            return get().tasks.find(t => t.id === taskId);
        },
    };
});

export default useDownloadStore;
