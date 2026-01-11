// Platform Constants

import { Platform } from '../types';
import { colors } from '../theme';

export interface PlatformInfo {
    id: Platform;
    name: string;
    icon: string;
    color: string;
    urlPatterns: RegExp[];
    enabled: boolean;
}

export const PLATFORMS: PlatformInfo[] = [
    {
        id: 'youtube',
        name: 'YouTube',
        icon: 'youtube',
        color: colors.youtube,
        urlPatterns: [
            /(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([\w-]+)/i,
        ],
        enabled: true,
    },
    {
        id: 'instagram',
        name: 'Instagram',
        icon: 'instagram',
        color: colors.instagram,
        urlPatterns: [
            /instagram\.com\/(?:p|reel|tv)\/([\w-]+)/i,
        ],
        enabled: true,
    },
    {
        id: 'tiktok',
        name: 'TikTok',
        icon: 'music-note',
        color: colors.tiktok,
        urlPatterns: [
            /tiktok\.com\/@[\w.-]+\/video\/(\d+)/i,
            /vm\.tiktok\.com\/([\w]+)/i,
        ],
        enabled: true,
    },
    {
        id: 'facebook',
        name: 'Facebook',
        icon: 'facebook',
        color: colors.facebook,
        urlPatterns: [
            /facebook\.com\/(?:watch\/?\?v=|[\w.]+\/videos\/)(\d+)/i,
            /fb\.watch\/([\w]+)/i,
        ],
        enabled: true,
    },
    {
        id: 'twitter',
        name: 'Twitter/X',
        icon: 'twitter',
        color: colors.twitter,
        urlPatterns: [
            /(?:twitter|x)\.com\/[\w]+\/status\/(\d+)/i,
        ],
        enabled: true,
    },
    {
        id: 'vimeo',
        name: 'Vimeo',
        icon: 'vimeo',
        color: '#1AB7EA',
        urlPatterns: [
            /vimeo\.com\/(\d+)/i,
        ],
        enabled: true,
    },
];

export const QUALITY_OPTIONS = [
    { quality: '2160p', label: '4K Ultra HD', format: 'mp4' },
    { quality: '1440p', label: '2K QHD', format: 'mp4' },
    { quality: '1080p', label: 'Full HD', format: 'mp4', isRecommended: true },
    { quality: '720p', label: 'HD', format: 'mp4' },
    { quality: '480p', label: 'SD', format: 'mp4' },
    { quality: '360p', label: 'Low', format: 'mp4' },
    { quality: '144p', label: 'Very Low', format: 'mp4' },
] as const;

export const FORMAT_OPTIONS = [
    { format: 'mp4', label: 'MP4 Video', icon: 'video', mimeType: 'video/mp4' },
    { format: 'mp3', label: 'MP3 Audio', icon: 'music', mimeType: 'audio/mpeg' },
    { format: 'webm', label: 'WebM Video', icon: 'video', mimeType: 'video/webm' },
    { format: 'm4a', label: 'M4A Audio', icon: 'music', mimeType: 'audio/m4a' },
] as const;

export const getPlatformFromUrl = (url: string): Platform => {
    for (const platform of PLATFORMS) {
        for (const pattern of platform.urlPatterns) {
            if (pattern.test(url)) {
                return platform.id;
            }
        }
    }
    return 'unknown';
};

export const getPlatformInfo = (platformId: Platform): PlatformInfo | undefined => {
    return PLATFORMS.find(p => p.id === platformId);
};
