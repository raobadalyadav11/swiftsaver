// ProgressBar Component - Download progress indicator

import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, ViewStyle } from 'react-native';
import { colors, borderRadius, spacing, textStyles } from '../../theme';

interface ProgressBarProps {
    progress: number; // 0-100
    height?: number;
    showPercentage?: boolean;
    showSize?: boolean;
    downloadedSize?: number;
    totalSize?: number;
    animated?: boolean;
    variant?: 'default' | 'gradient' | 'striped';
    style?: ViewStyle;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
    progress,
    height = 4,
    showPercentage = false,
    showSize = false,
    downloadedSize = 0,
    totalSize = 0,
    animated = true,
    variant = 'default',
    style,
}) => {
    const animatedWidth = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (animated) {
            Animated.spring(animatedWidth, {
                toValue: progress,
                useNativeDriver: false,
                friction: 10,
                tension: 40,
            }).start();
        } else {
            animatedWidth.setValue(progress);
        }
    }, [progress, animated, animatedWidth]);

    const formatBytes = (bytes: number): string => {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
    };

    const getProgressColor = (): string => {
        if (progress >= 100) return colors.success;
        if (progress >= 50) return colors.primary;
        return colors.downloading;
    };

    return (
        <View style={[styles.container, style]}>
            <View style={[styles.track, { height }]}>
                <Animated.View
                    style={[
                        styles.fill,
                        {
                            height,
                            backgroundColor: getProgressColor(),
                            width: animatedWidth.interpolate({
                                inputRange: [0, 100],
                                outputRange: ['0%', '100%'],
                            }),
                        },
                        variant === 'gradient' && styles.gradient,
                    ]}
                />
            </View>

            {(showPercentage || showSize) && (
                <View style={styles.infoRow}>
                    {showSize && totalSize > 0 && (
                        <Text style={styles.sizeText}>
                            {formatBytes(downloadedSize)} / {formatBytes(totalSize)}
                        </Text>
                    )}
                    {showPercentage && (
                        <Text style={styles.percentageText}>{Math.round(progress)}%</Text>
                    )}
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    track: {
        backgroundColor: colors.surfaceHighlight,
        borderRadius: borderRadius.full,
        overflow: 'hidden',
    },
    fill: {
        borderRadius: borderRadius.full,
    },
    gradient: {
        // Could add gradient effect here if needed
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: spacing.xs,
    },
    sizeText: {
        ...textStyles.caption,
        color: colors.textMuted,
    },
    percentageText: {
        ...textStyles.caption,
        color: colors.textSecondary,
        fontWeight: '600',
    },
});

export default ProgressBar;
