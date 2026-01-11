// File System Service

import RNFS from 'react-native-fs';
import { MediaFile } from '../types';
import { APP_CONFIG } from '../constants';

class FileSystemService {
    private downloadDir: string;

    constructor() {
        this.downloadDir = `${RNFS.DocumentDirectoryPath}/${APP_CONFIG.storage.downloadFolder}`;
    }

    // Initialize download directory
    async initialize(): Promise<void> {
        try {
            const exists = await RNFS.exists(this.downloadDir);
            if (!exists) {
                await RNFS.mkdir(this.downloadDir);
            }
        } catch (error) {
            console.error('Failed to initialize file system:', error);
        }
    }

    // Get all downloaded files
    async getDownloadedFiles(): Promise<MediaFile[]> {
        try {
            const files = await RNFS.readDir(this.downloadDir);

            const mediaFiles: (MediaFile | null)[] = await Promise.all(
                files
                    .filter(file => !file.isDirectory())
                    .map(async (file): Promise<MediaFile | null> => {
                        const extension = file.name.split('.').pop()?.toLowerCase() || '';
                        const isVideo = ['mp4', 'webm', 'mkv', 'avi', 'mov'].includes(extension);
                        const isAudio = ['mp3', 'm4a', 'wav', 'aac', 'flac'].includes(extension);

                        if (!isVideo && !isAudio) return null;

                        return {
                            id: file.name,
                            fileName: file.name,
                            filePath: file.path,
                            title: file.name.replace(/_/g, ' ').replace(/\.[^/.]+$/, ''),
                            size: file.size,
                            format: extension,
                            mediaType: isVideo ? 'video' : 'audio',
                            createdAt: file.mtime ? new Date(file.mtime) : new Date(),
                        } as MediaFile;
                    })
            );

            return mediaFiles.filter((f): f is MediaFile => f !== null)
                .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        } catch (error) {
            console.error('Failed to get downloaded files:', error);
            return [];
        }
    }

    // Delete file
    async deleteFile(filePath: string): Promise<boolean> {
        try {
            await RNFS.unlink(filePath);
            return true;
        } catch (error) {
            console.error('Failed to delete file:', error);
            return false;
        }
    }

    // Get storage info
    async getStorageInfo(): Promise<{ used: number; available: number }> {
        try {
            const info = await RNFS.getFSInfo();
            const files = await RNFS.readDir(this.downloadDir);
            const usedSpace = files.reduce((total, file) => total + (file.size || 0), 0);

            return {
                used: usedSpace,
                available: info.freeSpace,
            };
        } catch (error) {
            console.error('Failed to get storage info:', error);
            return { used: 0, available: 0 };
        }
    }

    // Check if file exists
    async fileExists(filePath: string): Promise<boolean> {
        try {
            return await RNFS.exists(filePath);
        } catch {
            return false;
        }
    }

    // Get file size
    async getFileSize(filePath: string): Promise<number> {
        try {
            const stat = await RNFS.stat(filePath);
            return stat.size;
        } catch {
            return 0;
        }
    }

    // Rename file
    async renameFile(oldPath: string, newName: string): Promise<string | null> {
        try {
            const directory = oldPath.substring(0, oldPath.lastIndexOf('/'));
            const extension = oldPath.split('.').pop();
            const newPath = `${directory}/${newName}.${extension}`;

            await RNFS.moveFile(oldPath, newPath);
            return newPath;
        } catch (error) {
            console.error('Failed to rename file:', error);
            return null;
        }
    }

    // Copy file to external storage (for sharing)
    async copyToExternal(filePath: string, fileName: string): Promise<string | null> {
        try {
            const externalPath = `${RNFS.ExternalStorageDirectoryPath}/Download/${fileName}`;
            await RNFS.copyFile(filePath, externalPath);
            return externalPath;
        } catch (error) {
            console.error('Failed to copy to external:', error);
            return null;
        }
    }

    // Clear all downloads
    async clearAllDownloads(): Promise<boolean> {
        try {
            const files = await RNFS.readDir(this.downloadDir);
            await Promise.all(
                files.filter(f => !f.isDirectory()).map(f => RNFS.unlink(f.path))
            );
            return true;
        } catch (error) {
            console.error('Failed to clear downloads:', error);
            return false;
        }
    }

    // Get download directory path
    getDownloadPath(): string {
        return this.downloadDir;
    }
}

export const fileSystemService = new FileSystemService();
export default fileSystemService;
