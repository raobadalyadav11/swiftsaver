// Video Metadata Service - Mock implementation for MVP

import { VideoMetadata, Platform, ParsedUrl, VideoQualityInfo } from '../types';
import { getPlatformFromUrl } from '../constants';

// Mock video data for MVP testing
const MOCK_VIDEOS: Record<string, Partial<VideoMetadata>> = {
    default: {
        title: 'Sample Video Title',
        description: 'This is a sample video description for testing purposes.',
        thumbnail: 'https://picsum.photos/640/360',
        thumbnailHD: 'https://picsum.photos/1280/720',
        duration: 245, // 4:05
        author: 'Content Creator',
        views: 1250000,
        likes: 45000,
    },
};

// Generate mock quality options
const generateQualities = (platform: Platform): VideoQualityInfo[] => {
    const baseQualities: VideoQualityInfo[] = [
        { quality: '1080p', format: 'mp4', fileSize: 150 * 1024 * 1024, width: 1920, height: 1080, fps: 30, hasAudio: true },
        { quality: '720p', format: 'mp4', fileSize: 80 * 1024 * 1024, width: 1280, height: 720, fps: 30, hasAudio: true },
        { quality: '480p', format: 'mp4', fileSize: 45 * 1024 * 1024, width: 854, height: 480, fps: 30, hasAudio: true },
        { quality: '360p', format: 'mp4', fileSize: 25 * 1024 * 1024, width: 640, height: 360, fps: 30, hasAudio: true },
        { quality: '144p', format: 'mp4', fileSize: 10 * 1024 * 1024, width: 256, height: 144, fps: 30, hasAudio: true },
        { quality: 'audio', format: 'mp3', fileSize: 5 * 1024 * 1024, hasAudio: true },
    ];

    // Add 4K for YouTube
    if (platform === 'youtube') {
        baseQualities.unshift(
            { quality: '2160p', format: 'mp4', fileSize: 500 * 1024 * 1024, width: 3840, height: 2160, fps: 30, hasAudio: true },
            { quality: '1440p', format: 'mp4', fileSize: 300 * 1024 * 1024, width: 2560, height: 1440, fps: 30, hasAudio: true }
        );
    }

    return baseQualities;
};

// Parse URL and detect platform
export const parseVideoUrl = (url: string): ParsedUrl => {
    if (!url || typeof url !== 'string') {
        return {
            isValid: false,
            originalUrl: url || '',
            error: 'Invalid URL provided',
        };
    }

    // Clean and validate URL
    const cleanedUrl = url.trim();

    // Basic URL validation
    const urlPattern = /^(https?:\/\/)?([\w.-]+)\.([a-z]{2,})(\/\S*)?$/i;
    if (!urlPattern.test(cleanedUrl)) {
        return {
            isValid: false,
            originalUrl: url,
            error: 'Please enter a valid URL',
        };
    }

    const platform = getPlatformFromUrl(cleanedUrl);

    if (platform === 'unknown') {
        return {
            isValid: false,
            platform: 'unknown',
            originalUrl: url,
            cleanedUrl,
            error: 'Unsupported platform',
        };
    }

    // Extract video ID based on platform
    let videoId: string | undefined;

    switch (platform) {
        case 'youtube': {
            const match = cleanedUrl.match(/(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([\w-]+)/i);
            videoId = match?.[1];
            break;
        }
        case 'instagram': {
            const match = cleanedUrl.match(/instagram\.com\/(?:p|reel|tv)\/([\w-]+)/i);
            videoId = match?.[1];
            break;
        }
        case 'tiktok': {
            const match = cleanedUrl.match(/video\/(\d+)/i) || cleanedUrl.match(/vm\.tiktok\.com\/([\w]+)/i);
            videoId = match?.[1];
            break;
        }
        case 'twitter': {
            const match = cleanedUrl.match(/status\/(\d+)/i);
            videoId = match?.[1];
            break;
        }
        default:
            videoId = 'unknown';
    }

    return {
        isValid: true,
        platform,
        videoId,
        originalUrl: url,
        cleanedUrl,
    };
};

// Fetch video metadata (mock for MVP)
export const fetchVideoMetadata = async (url: string): Promise<VideoMetadata> => {
    const parsed = parseVideoUrl(url);

    if (!parsed.isValid) {
        throw new Error(parsed.error || 'Invalid URL');
    }

    // Simulate network delay
    await new Promise<void>((resolve) => {
        setTimeout(() => resolve(), 1000 + Math.random() * 1000);
    });

    const mockData = MOCK_VIDEOS.default;

    const metadata: VideoMetadata = {
        id: parsed.videoId || `video_${Date.now()}`,
        url: parsed.cleanedUrl || url,
        platform: parsed.platform!,
        title: `${parsed.platform?.charAt(0).toUpperCase()}${parsed.platform?.slice(1)} Video - ${parsed.videoId?.slice(0, 8) || 'Demo'}`,
        description: mockData.description,
        thumbnail: mockData.thumbnail!,
        thumbnailHD: mockData.thumbnailHD,
        duration: Math.floor(Math.random() * 600) + 30, // 30s - 10min
        author: mockData.author!,
        views: Math.floor(Math.random() * 5000000),
        likes: Math.floor(Math.random() * 100000),
        uploadDate: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000), // Last 90 days
        qualities: generateQualities(parsed.platform!),
    };

    return metadata;
};

// Get download URL for specific quality (mock)
export const getDownloadUrl = async (
    videoUrl: string,
    quality: string,
    format: string
): Promise<string> => {
    // Simulate getting actual download URL
    await new Promise<void>((resolve) => {
        setTimeout(() => resolve(), 500);
    });

    // In production, this would return actual CDN/stream URL
    // For MVP, return a sample video URL
    return `https://sample-videos.com/video/${quality}/${format}/sample.${format}`;
};

export const videoMetadataService = {
    parseUrl: parseVideoUrl,
    fetchMetadata: fetchVideoMetadata,
    getDownloadUrl,
};

export default videoMetadataService;
