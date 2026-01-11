// Downloads Screen - Active and completed downloads

import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { DownloadItem } from '../components';
import { useDownloadStore } from '../store';
import { getDownloadUrl } from '../services';
import { DownloadTask, MainTabScreenProps } from '../types';
import { colors, spacing, textStyles, iconSize, borderRadius } from '../theme';

type Props = MainTabScreenProps<'Downloads'>;

export const DownloadsScreen: React.FC<Props> = () => {
    const insets = useSafeAreaInsets();
    const {
        tasks,
        pauseDownload,
        resumeDownload,
        cancelDownload,
        retryDownload,
        removeTask,
        clearCompleted,
        getActiveDownloads,
        getCompletedDownloads,
    } = useDownloadStore();

    const activeDownloads = tasks.filter(t =>
        t.status === 'downloading' || t.status === 'pending' || t.status === 'paused'
    );
    const completedDownloads = getCompletedDownloads();
    const failedDownloads = tasks.filter(t => t.status === 'failed');

    const handlePause = async (taskId: string) => {
        await pauseDownload(taskId);
    };

    const handleResume = async (task: DownloadTask) => {
        const downloadUrl = await getDownloadUrl(task.url, task.quality, task.format);
        await resumeDownload(task.id, downloadUrl);
    };

    const handleCancel = async (taskId: string) => {
        await cancelDownload(taskId);
    };

    const handleRetry = async (task: DownloadTask) => {
        const downloadUrl = await getDownloadUrl(task.url, task.quality, task.format);
        await retryDownload(task.id, downloadUrl);
    };

    const renderDownloadItem = ({ item }: { item: DownloadTask }) => (
        <DownloadItem
            task={item}
            onPause={() => handlePause(item.id)}
            onResume={() => handleResume(item)}
            onCancel={() => handleCancel(item.id)}
            onRetry={() => handleRetry(item)}
            onRemove={() => removeTask(item.id)}
        />
    );

    const renderEmptyState = () => (
        <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
                <Icon name="download-off" size={iconSize['3xl']} color={colors.textMuted} />
            </View>
            <Text style={styles.emptyTitle}>No Downloads</Text>
            <Text style={styles.emptyText}>
                Your downloads will appear here.{'\n'}
                Paste a video URL on the Home tab to start.
            </Text>
        </View>
    );

    const renderSectionHeader = (title: string, count: number, onClear?: () => void) => (
        <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
                {title} <Text style={styles.sectionCount}>({count})</Text>
            </Text>
            {onClear && count > 0 && (
                <TouchableOpacity onPress={onClear}>
                    <Text style={styles.clearButton}>Clear All</Text>
                </TouchableOpacity>
            )}
        </View>
    );

    const hasDownloads = tasks.length > 0;

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={colors.background} />

            {/* Header */}
            <View style={[styles.header, { paddingTop: insets.top + spacing.base }]}>
                <Text style={styles.title}>Downloads</Text>
            </View>

            {hasDownloads ? (
                <FlatList
                    data={[]}
                    renderItem={null}
                    ListHeaderComponent={
                        <>
                            {/* Active Downloads */}
                            {activeDownloads.length > 0 && (
                                <View style={styles.section}>
                                    {renderSectionHeader('Active', activeDownloads.length)}
                                    {activeDownloads.map(task => (
                                        <DownloadItem
                                            key={task.id}
                                            task={task}
                                            onPause={() => handlePause(task.id)}
                                            onResume={() => handleResume(task)}
                                            onCancel={() => handleCancel(task.id)}
                                        />
                                    ))}
                                </View>
                            )}

                            {/* Failed Downloads */}
                            {failedDownloads.length > 0 && (
                                <View style={styles.section}>
                                    {renderSectionHeader('Failed', failedDownloads.length)}
                                    {failedDownloads.map(task => (
                                        <DownloadItem
                                            key={task.id}
                                            task={task}
                                            onRetry={() => handleRetry(task)}
                                            onRemove={() => removeTask(task.id)}
                                        />
                                    ))}
                                </View>
                            )}

                            {/* Completed Downloads */}
                            {completedDownloads.length > 0 && (
                                <View style={styles.section}>
                                    {renderSectionHeader('Completed', completedDownloads.length, clearCompleted)}
                                    {completedDownloads.map(task => (
                                        <DownloadItem
                                            key={task.id}
                                            task={task}
                                            onRemove={() => removeTask(task.id)}
                                        />
                                    ))}
                                </View>
                            )}
                        </>
                    }
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                />
            ) : (
                renderEmptyState()
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    header: {
        paddingHorizontal: spacing.base,
        paddingBottom: spacing.base,
        backgroundColor: colors.surface,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    title: {
        ...textStyles.h2,
        color: colors.textPrimary,
    },
    listContent: {
        padding: spacing.base,
        paddingBottom: spacing['3xl'],
    },
    section: {
        marginBottom: spacing.xl,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.md,
    },
    sectionTitle: {
        ...textStyles.h4,
        color: colors.textPrimary,
    },
    sectionCount: {
        color: colors.textMuted,
        fontWeight: '400',
    },
    clearButton: {
        ...textStyles.body,
        color: colors.primary,
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: spacing.xl,
    },
    emptyIcon: {
        width: 80,
        height: 80,
        borderRadius: borderRadius.xl,
        backgroundColor: colors.surfaceElevated,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: spacing.lg,
    },
    emptyTitle: {
        ...textStyles.h3,
        color: colors.textPrimary,
        marginBottom: spacing.sm,
    },
    emptyText: {
        ...textStyles.body,
        color: colors.textSecondary,
        textAlign: 'center',
        lineHeight: 24,
    },
});

export default DownloadsScreen;
