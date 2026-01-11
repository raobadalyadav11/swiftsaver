// Button Component - Snaptube-styled buttons

import React from 'react';
import {
    TouchableOpacity,
    Text,
    StyleSheet,
    ActivityIndicator,
    ViewStyle,
    TextStyle,
    TouchableOpacityProps,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { colors, borderRadius, spacing, textStyles } from '../../theme';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonProps extends TouchableOpacityProps {
    title: string;
    variant?: ButtonVariant;
    size?: ButtonSize;
    loading?: boolean;
    icon?: React.ReactNode;
    iconPosition?: 'left' | 'right';
    fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
    title,
    variant = 'primary',
    size = 'medium',
    loading = false,
    icon,
    iconPosition = 'left',
    fullWidth = false,
    disabled,
    style,
    ...props
}) => {
    const isDisabled = disabled || loading;

    const containerStyle: ViewStyle[] = [
        styles.base,
        styles[`size_${size}` as keyof typeof styles] as ViewStyle,
        fullWidth ? styles.fullWidth : undefined,
        isDisabled ? styles.disabled : undefined,
        style as ViewStyle,
    ].filter(Boolean) as ViewStyle[];

    const textColor = getTextColor(variant, isDisabled);

    const content = (
        <>
            {loading ? (
                <ActivityIndicator size="small" color={textColor} />
            ) : (
                <>
                    {icon && iconPosition === 'left' && <>{icon}</>}
                    <Text style={[styles.text, styles[`text_${size}` as keyof typeof styles] as TextStyle, { color: textColor }]}>
                        {title}
                    </Text>
                    {icon && iconPosition === 'right' && <>{icon}</>}
                </>
            )}
        </>
    );

    if (variant === 'primary' && !isDisabled) {
        return (
            <TouchableOpacity
                activeOpacity={0.8}
                disabled={isDisabled}
                {...props}
            >
                <LinearGradient
                    colors={[colors.primary, colors.primaryDark]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={[containerStyle, styles.gradient]}
                >
                    {content}
                </LinearGradient>
            </TouchableOpacity>
        );
    }

    return (
        <TouchableOpacity
            activeOpacity={0.7}
            disabled={isDisabled}
            style={[containerStyle, getVariantStyle(variant, isDisabled)]}
            {...props}
        >
            {content}
        </TouchableOpacity>
    );
};

const getTextColor = (variant: ButtonVariant, disabled?: boolean): string => {
    if (disabled) return colors.textMuted;

    switch (variant) {
        case 'primary':
            return colors.background;
        case 'secondary':
            return colors.textPrimary;
        case 'outline':
            return colors.primary;
        case 'ghost':
            return colors.textSecondary;
        case 'danger':
            return colors.textPrimary;
        default:
            return colors.textPrimary;
    }
};

const getVariantStyle = (variant: ButtonVariant, disabled?: boolean): ViewStyle => {
    if (disabled) {
        return { backgroundColor: colors.surfaceHighlight };
    }

    switch (variant) {
        case 'secondary':
            return { backgroundColor: colors.surfaceElevated };
        case 'outline':
            return {
                backgroundColor: 'transparent',
                borderWidth: 1.5,
                borderColor: colors.primary,
            };
        case 'ghost':
            return { backgroundColor: 'transparent' };
        case 'danger':
            return { backgroundColor: colors.error };
        default:
            return {};
    }
};

const styles = StyleSheet.create({
    base: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: borderRadius.base,
        gap: spacing.sm,
    },
    gradient: {
        borderRadius: borderRadius.base,
    },
    fullWidth: {
        width: '100%',
    },
    disabled: {
        opacity: 0.6,
    },
    text: {
        ...textStyles.button,
    },
    // Sizes
    size_small: {
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.md,
        minHeight: 36,
    },
    size_medium: {
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.lg,
        minHeight: 48,
    },
    size_large: {
        paddingVertical: spacing.base,
        paddingHorizontal: spacing.xl,
        minHeight: 56,
    },
    text_small: {
        ...textStyles.buttonSmall,
    },
    text_medium: {
        ...textStyles.button,
    },
    text_large: {
        ...textStyles.button,
        fontSize: 18,
    },
});

export default Button;
