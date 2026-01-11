// Card Component - Container for content sections

import React from 'react';
import {
    View,
    StyleSheet,
    ViewStyle,
    TouchableOpacity,
    TouchableOpacityProps,
} from 'react-native';
import { colors, borderRadius, spacing } from '../../theme';

interface CardProps {
    children: React.ReactNode;
    variant?: 'default' | 'elevated' | 'outlined';
    padding?: 'none' | 'small' | 'medium' | 'large';
    style?: ViewStyle;
    onPress?: () => void;
    activeOpacity?: number;
}

export const Card: React.FC<CardProps> = ({
    children,
    variant = 'default',
    padding = 'medium',
    style,
    onPress,
    activeOpacity = 0.8,
}) => {
    const variantKey = `variant_${variant}` as keyof typeof styles;
    const paddingKey = `padding_${padding}` as keyof typeof styles;

    const containerStyle = [
        styles.base,
        styles[variantKey],
        styles[paddingKey],
        ...(style ? [style] : []),
    ];

    if (onPress) {
        return (
            <TouchableOpacity
                style={containerStyle}
                onPress={onPress}
                activeOpacity={activeOpacity}
            >
                {children}
            </TouchableOpacity>
        );
    }

    return <View style={containerStyle}>{children}</View>;
};

const styles = StyleSheet.create({
    base: {
        borderRadius: borderRadius.lg,
        overflow: 'hidden',
    },
    // Variants
    variant_default: {
        backgroundColor: colors.surface,
    },
    variant_elevated: {
        backgroundColor: colors.surfaceElevated,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    variant_outlined: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: colors.border,
    },
    // Padding
    padding_none: {
        padding: 0,
    },
    padding_small: {
        padding: spacing.sm,
    },
    padding_medium: {
        padding: spacing.base,
    },
    padding_large: {
        padding: spacing.xl,
    },
});

export default Card;
