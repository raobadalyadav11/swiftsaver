// SwiftSaver Typography System

import { TextStyle } from 'react-native';

export const fontFamily = {
    regular: 'System',
    medium: 'System',
    semiBold: 'System',
    bold: 'System',
} as const;

export const fontSize = {
    xs: 10,
    sm: 12,
    base: 14,
    md: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
} as const;

export const lineHeight = {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
} as const;

export const fontWeight = {
    regular: '400' as TextStyle['fontWeight'],
    medium: '500' as TextStyle['fontWeight'],
    semiBold: '600' as TextStyle['fontWeight'],
    bold: '700' as TextStyle['fontWeight'],
} as const;

// Pre-defined text styles
export const textStyles = {
    // Headings
    h1: {
        fontSize: fontSize['3xl'],
        fontWeight: fontWeight.bold,
        lineHeight: fontSize['3xl'] * lineHeight.tight,
    } as TextStyle,

    h2: {
        fontSize: fontSize['2xl'],
        fontWeight: fontWeight.bold,
        lineHeight: fontSize['2xl'] * lineHeight.tight,
    } as TextStyle,

    h3: {
        fontSize: fontSize.xl,
        fontWeight: fontWeight.semiBold,
        lineHeight: fontSize.xl * lineHeight.tight,
    } as TextStyle,

    h4: {
        fontSize: fontSize.lg,
        fontWeight: fontWeight.semiBold,
        lineHeight: fontSize.lg * lineHeight.normal,
    } as TextStyle,

    // Body text
    bodyLarge: {
        fontSize: fontSize.md,
        fontWeight: fontWeight.regular,
        lineHeight: fontSize.md * lineHeight.relaxed,
    } as TextStyle,

    body: {
        fontSize: fontSize.base,
        fontWeight: fontWeight.regular,
        lineHeight: fontSize.base * lineHeight.relaxed,
    } as TextStyle,

    bodySmall: {
        fontSize: fontSize.sm,
        fontWeight: fontWeight.regular,
        lineHeight: fontSize.sm * lineHeight.relaxed,
    } as TextStyle,

    // UI elements
    button: {
        fontSize: fontSize.md,
        fontWeight: fontWeight.semiBold,
        lineHeight: fontSize.md * lineHeight.normal,
    } as TextStyle,

    buttonSmall: {
        fontSize: fontSize.sm,
        fontWeight: fontWeight.semiBold,
        lineHeight: fontSize.sm * lineHeight.normal,
    } as TextStyle,

    caption: {
        fontSize: fontSize.xs,
        fontWeight: fontWeight.regular,
        lineHeight: fontSize.xs * lineHeight.normal,
    } as TextStyle,

    label: {
        fontSize: fontSize.sm,
        fontWeight: fontWeight.medium,
        lineHeight: fontSize.sm * lineHeight.normal,
    } as TextStyle,

    // Special
    tabLabel: {
        fontSize: fontSize.xs,
        fontWeight: fontWeight.medium,
        lineHeight: fontSize.xs * lineHeight.normal,
    } as TextStyle,

    badge: {
        fontSize: fontSize.xs,
        fontWeight: fontWeight.bold,
        lineHeight: fontSize.xs * lineHeight.tight,
    } as TextStyle,
} as const;

export default {
    fontFamily,
    fontSize,
    lineHeight,
    fontWeight,
    textStyles,
};
