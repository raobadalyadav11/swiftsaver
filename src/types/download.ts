// Download Types

export type DownloadStatus =
    | 'pending'
    | 'downloading'
    | 'paused'
    | 'completed'
    | 'failed'
    | 'cancelled';

export type MediaFormat = 'mp4' | 'mp3' | 'webm' | 'm4a';

export type VideoQuality =
    | '144p'
    | '240p'
    | '360p'
    | '480p'
    | '720p'
    | '1080p'
    | '1440p'
    | '2160p'; // 4K

export interface DownloadTask {
    id: string;
    url: string;
    fileName: string;
    title: string;
    thumbnail?: string;
    quality: VideoQuality;
    format: MediaFormat;
    status: DownloadStatus;
    progress: number; // 0-100
    totalSize: number; // bytes
    downloadedSize: number; // bytes
    speed?: number; // bytes per second
    eta?: number; // seconds remaining
    filePath?: string;
    error?: string;
    createdAt: Date;
    updatedAt: Date;
    completedAt?: Date;
}

export interface DownloadOptions {
    quality: VideoQuality;
    format: MediaFormat;
    saveLocation?: string;
}

export interface DownloadProgress {
    taskId: string;
    progress: number;
    downloadedSize: number;
    totalSize: number;
    speed: number;
    eta: number;
}

export interface DownloadQueue {
    active: DownloadTask[];
    pending: DownloadTask[];
    completed: DownloadTask[];
    failed: DownloadTask[];
}

// Quality option for UI display
export interface QualityOption {
    quality: VideoQuality;
    format: MediaFormat;
    fileSize?: number;
    label: string;
    isRecommended?: boolean;
}
