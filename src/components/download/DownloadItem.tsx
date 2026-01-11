// Download Item Component - Single download in list

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { VideoThumbnail, ProgressBar, Card } from '../common';
import { DownloadTask } from '../../types';
import { colors, spacing, textStyles, iconSize, borderRadius } from '../../theme';

interface DownloadItemProps {
    task: DownloadTask;
    onPause?: () => void;
    onResume?: () => void;
    onCancel?: () => void;
    onRetry?: () => void;
    onRemove?: () => void;
    onPress?: () => void;
}

export const DownloadItem: React.FC<DownloadItemProps> = ({
    task,
    onPause,
    onResume,
    onCancel,
    onRetry,
    onRemove,
    onPress,
}) => {
    const formatSpeed = (bytesPerSecond: number): string => {
        if (!bytesPerSecond || bytesPerSecond <= 0) return '';
        const k = 1024;
        if (bytesPerSecond < k) return `${bytesPerSecond.toFixed(0)} B/s`;
        if (bytesPerSecond < k * k) return `${(bytesPerSecond / k).toFixed(1)} KB/s`;
        return `${(bytesPerSecond / (k * k)).toFixed(1)} MB/s`;
    };

    const getStatusIcon = (): { name: string; color: string } => {
        switch (task.status) {
            case 'downloading':
                return { name: 'download', color: colors.downloading };
            case 'paused':
                return { name: 'pause-circle', color: colors.paused };
            case 'completed':
                return { name: 'check-circle', color: colors.completed };
            case 'failed':
                return { name: 'alert-circle', color: colors.failed };
            case 'pending':
                return { name: 'clock-outline', color: colors.pending };
            default:
                return { name: 'download', color: colors.textMuted };
        }
    };

    const statusIcon = getStatusIcon();

    return (
        <Card variant="elevated" padding="small" style={styles.container}>
            <TouchableOpacity
                style={styles.content}
                onPress={onPress}
                activeOpacity={0.8}
                disabled={!onPress}
            >
                <VideoThumbnail
                    uri={task.thumbnail}
                    width={80}
                    height={60}
                    quality={task.quality}
                    showPlayButton={task.status === 'completed'}
                />

                <View style={styles.info}>
                    <Text style={styles.title} numberOfLines={2}>
                        {task.title}
                    </Text>

                    <View style={styles.meta}>
                        <Icon name={statusIcon.name} size={iconSize.sm} color={statusIcon.color} />
                        <Text style={[styles.status, { color: statusIcon.color }]}>
                            {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                        </Text>
                        {task.status === 'downloading' && task.speed && (
                            <Text style={styles.speed}>{formatSpeed(task.speed)}</Text>
                        )}
                    </View>

                    {(task.status === 'downloading' || task.status === 'paused') && (
                        <ProgressBar
                            progress={task.progress}
                            height={4}
                            showPercentage
                            showSize
                            downloadedSize={task.downloadedSize}
                            totalSize={task.totalSize}
                            style={styles.progressBar}
                        />
                    )}

                    {task.status === 'failed' && task.error && (
                        <Text style={styles.errorText} numberOfLines={1}>
                            {task.error}
                        </Text>
                    )}
                </View>

                <View style={styles.actions}>
                    {task.status === 'downloading' && onPause && (
                        <TouchableOpacity style={styles.actionButton} onPress={onPause}>
                            <Icon name="pause" size={iconSize.base} color={colors.textSecondary} />
                        </TouchableOpacity>
                    )}

                    {task.status === 'paused' && onResume && (
                        <TouchableOpacity style={styles.actionButton} onPress={onResume}>
                            <Icon name="play" size={iconSize.base} color={colors.primary} />
                        </TouchableOpacity>
                    )}

                    {task.status === 'failed' && onRetry && (
                        <TouchableOpacity style={styles.actionButton} onPress={onRetry}>
                            <Icon name="refresh" size={iconSize.base} color={colors.warning} />
                        </TouchableOpacity>
                    )}

                    {(task.status === 'downloading' || task.status === 'pending' || task.status === 'paused') && onCancel && (
                        <TouchableOpacity style={styles.actionButton} onPress={onCancel}>
                            <Icon name="close" size={iconSize.base} color={colors.error} />
                        </TouchableOpacity>
                    )}

                    {(task.status === 'completed' || task.status === 'failed' || task.status === 'cancelled') && onRemove && (
                        <TouchableOpacity style={styles.actionButton} onPress={onRemove}>
                            <Icon name="delete-outline" size={iconSize.base} color={colors.textMuted} />
                        </TouchableOpacity>
                    )}
                </View>
            </TouchableOpacity>
        </Card>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: spacing.sm,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    info: {
        flex: 1,
        marginLeft: spacing.md,
        marginRight: spacing.sm,
    },
    title: {
        ...textStyles.body,
        color: colors.textPrimary,
        fontWeight: '500',
    },
    meta: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: spacing.xs,
        gap: spacing.xs,
    },
    status: {
        ...textStyles.caption,
    },
    speed: {
        ...textStyles.caption,
        color: colors.textMuted,
        marginLeft: spacing.xs,
    },
    progressBar: {
        marginTop: spacing.sm,
    },
    errorText: {
        ...textStyles.caption,
        color: colors.error,
        marginTop: spacing.xs,
    },
    actions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.xs,
    },
    actionButton: {
        padding: spacing.sm,
        borderRadius: borderRadius.full,
        backgroundColor: colors.surfaceHighlight,
    },
});

export default DownloadItem;
