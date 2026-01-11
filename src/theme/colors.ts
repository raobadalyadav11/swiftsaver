// SwiftSaver Theme Colors - Snaptube-inspired Dark Theme

export const colors = {
    // Primary - Dark theme base
    background: '#0D0D0D',
    surface: '#1A1A1A',
    surfaceElevated: '#262626',
    surfaceHighlight: '#333333',

    // Accent - Snaptube yellow
    primary: '#FFD700',
    primaryDark: '#E6C200',
    primaryLight: '#FFE44D',

    // Secondary accent
    secondary: '#FF6B35',
    secondaryDark: '#E05A2B',

    // Semantic colors
    success: '#00C853',
    successLight: '#69F0AE',
    error: '#FF5252',
    errorLight: '#FF8A80',
    warning: '#FF9800',
    warningLight: '#FFB74D',
    info: '#2196F3',
    infoLight: '#64B5F6',

    // Text colors
    textPrimary: '#FFFFFF',
    textSecondary: '#B3B3B3',
    textMuted: '#666666',
    textDisabled: '#444444',

    // Border colors
    border: '#333333',
    borderLight: '#444444',
    borderFocus: '#FFD700',

    // Gradient colors
    gradientStart: '#1A1A2E',
    gradientMid: '#16213E',
    gradientEnd: '#0F0F1A',

    // Platform brand colors
    youtube: '#FF0000',
    instagram: '#E4405F',
    tiktok: '#000000',
    facebook: '#1877F2',
    twitter: '#1DA1F2',

    // Overlay colors
    overlay: 'rgba(0, 0, 0, 0.7)',
    overlayLight: 'rgba(0, 0, 0, 0.5)',

    // Status colors for downloads
    downloading: '#2196F3',
    paused: '#FF9800',
    completed: '#00C853',
    failed: '#FF5252',
    pending: '#9E9E9E',
} as const;

export type ColorKey = keyof typeof colors;
export default colors;
