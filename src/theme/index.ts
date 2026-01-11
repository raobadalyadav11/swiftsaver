// SwiftSaver Theme - Main Export

import colors from './colors';
import typography from './typography';
import spacingSystem from './spacing';

export { colors, typography };
export { spacing, borderRadius, iconSize, hitSlop, dimensions } from './spacing';
export { textStyles, fontSize, fontWeight, lineHeight } from './typography';

// Color type - allows any color value
type Colors = Record<keyof typeof colors, string>;

// Theme context types
export interface Theme {
    colors: Colors;
    typography: typeof typography;
    spacing: typeof spacingSystem.spacing;
    borderRadius: typeof spacingSystem.borderRadius;
    iconSize: typeof spacingSystem.iconSize;
    dimensions: typeof spacingSystem.dimensions;
    isDark: boolean;
}

// Default dark theme
export const darkTheme: Theme = {
    colors: colors as Colors,
    typography,
    spacing: spacingSystem.spacing,
    borderRadius: spacingSystem.borderRadius,
    iconSize: spacingSystem.iconSize,
    dimensions: spacingSystem.dimensions,
    isDark: true,
};

// Light theme
export const lightTheme: Theme = {
    ...darkTheme,
    colors: {
        ...colors,
        background: '#FFFFFF',
        surface: '#F5F5F5',
        surfaceElevated: '#EBEBEB',
        surfaceHighlight: '#E0E0E0',
        textPrimary: '#1A1A1A',
        textSecondary: '#666666',
        textMuted: '#999999',
        textDisabled: '#CCCCCC',
        border: '#E0E0E0',
        borderLight: '#EBEBEB',
    },
    isDark: false,
};

export type ColorKey = keyof typeof colors;
export default { colors, typography, ...spacingSystem };

