// Input Component - URL input and search field

import React, { useState, forwardRef } from 'react';
import {
    View,
    TextInput,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInputProps,
    Clipboard,
    ViewStyle,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors, borderRadius, spacing, textStyles, iconSize } from '../../theme';

interface InputProps extends TextInputProps {
    label?: string;
    error?: string;
    hint?: string;
    leftIcon?: string;
    rightIcon?: string;
    onRightIconPress?: () => void;
    showPasteButton?: boolean;
    onPaste?: (text: string) => void;
    containerStyle?: ViewStyle;
}

export const Input = forwardRef<TextInput, InputProps>(({
    label,
    error,
    hint,
    leftIcon,
    rightIcon,
    onRightIconPress,
    showPasteButton,
    onPaste,
    containerStyle,
    style,
    onFocus,
    onBlur,
    ...props
}, ref) => {
    const [isFocused, setIsFocused] = useState(false);

    const handleFocus = (e: any) => {
        setIsFocused(true);
        onFocus?.(e);
    };

    const handleBlur = (e: any) => {
        setIsFocused(false);
        onBlur?.(e);
    };

    const handlePaste = async () => {
        try {
            const text = await Clipboard.getString();
            if (text && onPaste) {
                onPaste(text);
            }
        } catch (e) {
            console.warn('Failed to paste from clipboard:', e);
        }
    };

    return (
        <View style={[styles.container, containerStyle]}>
            {label && <Text style={styles.label}>{label}</Text>}

            <View
                style={[
                    styles.inputContainer,
                    isFocused && styles.inputFocused,
                    error && styles.inputError,
                ]}
            >
                {leftIcon && (
                    <Icon
                        name={leftIcon}
                        size={iconSize.base}
                        color={isFocused ? colors.primary : colors.textMuted}
                        style={styles.leftIcon}
                    />
                )}

                <TextInput
                    ref={ref}
                    style={[styles.input, style]}
                    placeholderTextColor={colors.textMuted}
                    selectionColor={colors.primary}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    {...props}
                />

                {showPasteButton && (
                    <TouchableOpacity onPress={handlePaste} style={styles.pasteButton}>
                        <Icon name="content-paste" size={iconSize.md} color={colors.primary} />
                        <Text style={styles.pasteText}>Paste</Text>
                    </TouchableOpacity>
                )}

                {rightIcon && (
                    <TouchableOpacity onPress={onRightIconPress} style={styles.rightIcon}>
                        <Icon
                            name={rightIcon}
                            size={iconSize.base}
                            color={colors.textMuted}
                        />
                    </TouchableOpacity>
                )}
            </View>

            {error && (
                <View style={styles.errorContainer}>
                    <Icon name="alert-circle" size={iconSize.sm} color={colors.error} />
                    <Text style={styles.errorText}>{error}</Text>
                </View>
            )}

            {hint && !error && <Text style={styles.hintText}>{hint}</Text>}
        </View>
    );
});

Input.displayName = 'Input';

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    label: {
        ...textStyles.label,
        color: colors.textSecondary,
        marginBottom: spacing.sm,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.surface,
        borderRadius: borderRadius.base,
        borderWidth: 1.5,
        borderColor: colors.border,
        paddingHorizontal: spacing.md,
        minHeight: 52,
    },
    inputFocused: {
        borderColor: colors.primary,
        backgroundColor: colors.surfaceElevated,
    },
    inputError: {
        borderColor: colors.error,
    },
    leftIcon: {
        marginRight: spacing.sm,
    },
    input: {
        flex: 1,
        ...textStyles.body,
        color: colors.textPrimary,
        paddingVertical: spacing.md,
    },
    pasteButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.xs,
        backgroundColor: colors.surfaceHighlight,
        borderRadius: borderRadius.sm,
        gap: 4,
    },
    pasteText: {
        ...textStyles.caption,
        color: colors.primary,
        fontWeight: '600',
    },
    rightIcon: {
        padding: spacing.xs,
    },
    errorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: spacing.xs,
        gap: 4,
    },
    errorText: {
        ...textStyles.caption,
        color: colors.error,
    },
    hintText: {
        ...textStyles.caption,
        color: colors.textMuted,
        marginTop: spacing.xs,
    },
});

export default Input;
