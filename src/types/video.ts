// Video & Media Types

export type Platform =
    | 'youtube'
    | 'instagram'
    | 'tiktok'
    | 'facebook'
    | 'twitter'
    | 'vimeo'
    | 'dailymotion'
    | 'unknown';

export interface VideoMetadata {
    id: string;
    url: string;
    platform: Platform;
    title: string;
    description?: string;
    thumbnail: string;
    thumbnailHD?: string;
    duration: number; // seconds
    author: string;
    authorAvatar?: string;
    views?: number;
    likes?: number;
    uploadDate?: Date;
    qualities: VideoQualityInfo[];
}

export interface VideoQualityInfo {
    quality: string;
    format: string;
    fileSize?: number;
    width?: number;
    height?: number;
    fps?: number;
    hasAudio: boolean;
    downloadUrl?: string;
}

export interface MediaFile {
    id: string;
    fileName: string;
    filePath: string;
    title: string;
    thumbnail?: string;
    duration?: number;
    size: number; // bytes
    format: string;
    mediaType: 'video' | 'audio';
    resolution?: string;
    createdAt: Date;
    lastPlayedAt?: Date;
    isFavorite?: boolean;
}

// Search/URL input result
export interface ParsedUrl {
    isValid: boolean;
    platform?: Platform;
    videoId?: string;
    originalUrl: string;
    cleanedUrl?: string;
    error?: string;
}
