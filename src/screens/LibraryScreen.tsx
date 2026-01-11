// Library Screen - Downloaded files browser

import React, { useEffect, useState, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    StatusBar,
    RefreshControl,
    Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { VideoThumbnail, Card } from '../components';
import { fileSystemService } from '../services';
import { MediaFile, MainTabScreenProps } from '../types';
import { colors, spacing, textStyles, iconSize, borderRadius } from '../theme';

type Props = MainTabScreenProps<'Library'>;
type FilterType = 'all' | 'video' | 'audio';
type ViewMode = 'grid' | 'list';

export const LibraryScreen: React.FC<Props> = () => {
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();

    const [files, setFiles] = useState<MediaFile[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [filter, setFilter] = useState<FilterType>('all');
    const [viewMode, setViewMode] = useState<ViewMode>('grid');

    const loadFiles = useCallback(async () => {
        try {
            const downloadedFiles = await fileSystemService.getDownloadedFiles();
            setFiles(downloadedFiles);
        } catch (error) {
            console.error('Failed to load files:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadFiles();
    }, [loadFiles]);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await loadFiles();
        setRefreshing(false);
    }, [loadFiles]);

    const handleDelete = useCallback((file: MediaFile) => {
        Alert.alert(
            'Delete File',
            `Are you sure you want to delete "${file.title}"?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        const success = await fileSystemService.deleteFile(file.filePath);
                        if (success) {
                            setFiles(prev => prev.filter(f => f.id !== file.id));
                        } else {
                            Alert.alert('Error', 'Failed to delete file');
                        }
                    },
                },
            ]
        );
    }, []);

    const handlePlay = useCallback((file: MediaFile) => {
        // Navigate to player screen
        // navigation.navigate('Player', { mediaFile: file });
        Alert.alert('Play', `Playing: ${file.title}`);
    }, []);

    const formatBytes = (bytes: number): string => {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
    };

    const filteredFiles = files.filter(file => {
        if (filter === 'all') return true;
        return file.mediaType === filter;
    });

    const renderFilterButton = (type: FilterType, label: string) => (
        <TouchableOpacity
            style={[styles.filterButton, filter === type && styles.filterButtonActive]}
            onPress={() => setFilter(type)}
        >
            <Text style={[styles.filterText, filter === type && styles.filterTextActive]}>
                {label}
            </Text>
        </TouchableOpacity>
    );

    const renderGridItem = ({ item }: { item: MediaFile }) => (
        <TouchableOpacity
            style={styles.gridItem}
            onPress={() => handlePlay(item)}
            onLongPress={() => handleDelete(item)}
        >
            <VideoThumbnail
                uri={item.thumbnail}
                width={undefined}
                height={120}
                duration={item.duration}
                style={styles.gridThumbnail}
            />
            <Text style={styles.itemTitle} numberOfLines={2}>
                {item.title}
            </Text>
            <Text style={styles.itemMeta}>
                {formatBytes(item.size)} • {item.format.toUpperCase()}
            </Text>
        </TouchableOpacity>
    );

    const renderListItem = ({ item }: { item: MediaFile }) => (
        <Card
            variant="elevated"
            padding="small"
            style={styles.listItem}
            onPress={() => handlePlay(item)}
        >
            <View style={styles.listItemContent}>
                <VideoThumbnail
                    uri={item.thumbnail}
                    width={80}
                    height={60}
                    duration={item.duration}
                />

                <View style={styles.listItemInfo}>
                    <Text style={styles.itemTitle} numberOfLines={2}>
                        {item.title}
                    </Text>
                    <Text style={styles.itemMeta}>
                        {formatBytes(item.size)} • {item.format.toUpperCase()}
                    </Text>
                </View>

                <View style={styles.listItemActions}>
                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => handlePlay(item)}
                    >
                        <Icon name="play" size={iconSize.md} color={colors.primary} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => handleDelete(item)}
                    >
                        <Icon name="delete-outline" size={iconSize.md} color={colors.textMuted} />
                    </TouchableOpacity>
                </View>
            </View>
        </Card>
    );

    const renderEmptyState = () => (
        <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
                <Icon name="folder-open-outline" size={iconSize['3xl']} color={colors.textMuted} />
            </View>
            <Text style={styles.emptyTitle}>No Files</Text>
            <Text style={styles.emptyText}>
                Downloaded videos and audio files will appear here.
            </Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={colors.background} />

            {/* Header */}
            <View style={[styles.header, { paddingTop: insets.top + spacing.base }]}>
                <Text style={styles.title}>Library</Text>

                <View style={styles.headerActions}>
                    <TouchableOpacity
                        style={styles.viewToggle}
                        onPress={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                    >
                        <Icon
                            name={viewMode === 'grid' ? 'view-list' : 'view-grid'}
                            size={iconSize.base}
                            color={colors.textSecondary}
                        />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Filters */}
            <View style={styles.filters}>
                {renderFilterButton('all', 'All')}
                {renderFilterButton('video', 'Videos')}
                {renderFilterButton('audio', 'Audio')}
            </View>

            {/* File List */}
            {loading ? (
                <View style={styles.loading}>
                    <Text style={styles.loadingText}>Loading files...</Text>
                </View>
            ) : filteredFiles.length === 0 ? (
                renderEmptyState()
            ) : (
                <FlatList
                    data={filteredFiles}
                    renderItem={viewMode === 'grid' ? renderGridItem : renderListItem}
                    keyExtractor={item => item.id}
                    numColumns={viewMode === 'grid' ? 2 : 1}
                    key={viewMode}
                    contentContainerStyle={styles.listContent}
                    columnWrapperStyle={viewMode === 'grid' ? styles.gridRow : undefined}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            tintColor={colors.primary}
                            colors={[colors.primary]}
                        />
                    }
                />
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
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: spacing.base,
        paddingBottom: spacing.base,
        backgroundColor: colors.surface,
    },
    title: {
        ...textStyles.h2,
        color: colors.textPrimary,
    },
    headerActions: {
        flexDirection: 'row',
        gap: spacing.sm,
    },
    viewToggle: {
        padding: spacing.sm,
        borderRadius: borderRadius.md,
        backgroundColor: colors.surfaceElevated,
    },
    filters: {
        flexDirection: 'row',
        paddingHorizontal: spacing.base,
        paddingVertical: spacing.md,
        gap: spacing.sm,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
        backgroundColor: colors.surface,
    },
    filterButton: {
        paddingHorizontal: spacing.base,
        paddingVertical: spacing.sm,
        borderRadius: borderRadius.full,
        backgroundColor: colors.surfaceElevated,
    },
    filterButtonActive: {
        backgroundColor: colors.primary,
    },
    filterText: {
        ...textStyles.buttonSmall,
        color: colors.textSecondary,
    },
    filterTextActive: {
        color: colors.background,
    },
    listContent: {
        padding: spacing.base,
        paddingBottom: spacing['3xl'],
    },
    gridRow: {
        justifyContent: 'space-between',
    },
    gridItem: {
        width: '48%',
        marginBottom: spacing.base,
    },
    gridThumbnail: {
        width: '100%',
        marginBottom: spacing.sm,
    },
    listItem: {
        marginBottom: spacing.sm,
    },
    listItemContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    listItemInfo: {
        flex: 1,
        marginHorizontal: spacing.md,
    },
    listItemActions: {
        flexDirection: 'row',
        gap: spacing.xs,
    },
    itemTitle: {
        ...textStyles.body,
        color: colors.textPrimary,
        fontWeight: '500',
    },
    itemMeta: {
        ...textStyles.caption,
        color: colors.textMuted,
        marginTop: spacing.xs,
    },
    actionButton: {
        padding: spacing.sm,
        borderRadius: borderRadius.full,
        backgroundColor: colors.surfaceHighlight,
    },
    loading: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        ...textStyles.body,
        color: colors.textMuted,
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
    },
});

export default LibraryScreen;
