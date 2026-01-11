// App Configuration Constants

export const APP_CONFIG = {
    name: 'SwiftSaver',
    version: '1.0.0',
    bundleId: 'com.swiftsaver.app',

    // API Configuration
    api: {
        timeout: 30000, // 30 seconds
        retryAttempts: 3,
    },

    // Download Configuration
    download: {
        maxConcurrent: 2,
        defaultQuality: '720p' as const,
        defaultFormat: 'mp4' as const,
        chunkSize: 1024 * 1024, // 1MB chunks
    },

    // Storage
    storage: {
        downloadFolder: 'SwiftSaver',
        maxCacheSize: 100 * 1024 * 1024, // 100MB
    },

    // UI Configuration
    ui: {
        animationDuration: 300,
        toastDuration: 3000,
    },
} as const;

// Supabase Configuration
// In production, configure these via react-native-config or similar
export const SUPABASE_CONFIG = {
    url: 'https://uxagutmugvqiorcmjzao.supabase.co',
    anonKey: 'sb_publishable_2uqrKsl4p-FPykMVg7ZKAw_SVkeFppi',
} as const;

// Storage Keys
export const STORAGE_KEYS = {
    AUTH_TOKEN: '@swiftsaver/auth_token',
    USER_SETTINGS: '@swiftsaver/user_settings',
    DOWNLOAD_HISTORY: '@swiftsaver/download_history',
    ONBOARDING_COMPLETE: '@swiftsaver/onboarding_complete',
    THEME_PREFERENCE: '@swiftsaver/theme_preference',
} as const;

// Error Messages
export const ERROR_MESSAGES = {
    NETWORK_ERROR: 'Network connection error. Please check your internet.',
    INVALID_URL: 'Invalid URL. Please enter a valid video link.',
    DOWNLOAD_FAILED: 'Download failed. Please try again.',
    STORAGE_FULL: 'Not enough storage space available.',
    UNSUPPORTED_PLATFORM: 'This platform is not supported yet.',
    VIDEO_NOT_FOUND: 'Video not found or is private.',
    RATE_LIMITED: 'Too many requests. Please wait a moment.',
} as const;

export default APP_CONFIG;
