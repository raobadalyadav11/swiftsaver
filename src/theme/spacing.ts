// SwiftSaver Spacing System

export const spacing = {
    // Base spacing values
    xs: 4,
    sm: 8,
    md: 12,
    base: 16,
    lg: 20,
    xl: 24,
    '2xl': 32,
    '3xl': 40,
    '4xl': 48,
    '5xl': 64,
} as const;

export const borderRadius = {
    none: 0,
    sm: 4,
    md: 8,
    base: 12,
    lg: 16,
    xl: 20,
    '2xl': 24,
    full: 9999,
} as const;

export const iconSize = {
    xs: 12,
    sm: 16,
    md: 20,
    base: 24,
    lg: 28,
    xl: 32,
    '2xl': 40,
    '3xl': 48,
} as const;

export const hitSlop = {
    small: { top: 8, bottom: 8, left: 8, right: 8 },
    medium: { top: 12, bottom: 12, left: 12, right: 12 },
    large: { top: 16, bottom: 16, left: 16, right: 16 },
} as const;

// Common component dimensions
export const dimensions = {
    // Navigation
    tabBarHeight: 64,
    headerHeight: 56,

    // Cards
    downloadItemHeight: 80,
    libraryItemHeight: 200,
    platformButtonSize: 64,

    // Inputs
    inputHeight: 48,
    buttonHeight: 48,
    buttonHeightSmall: 36,

    // Progress
    progressBarHeight: 4,
    progressBarHeightLarge: 8,

    // Thumbnails
    thumbnailSmall: 48,
    thumbnailMedium: 80,
    thumbnailLarge: 120,
} as const;

export default {
    spacing,
    borderRadius,
    iconSize,
    hitSlop,
    dimensions,
};
