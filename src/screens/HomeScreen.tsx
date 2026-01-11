// Home Screen - Main URL input and platform selection

import React, { useState, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    StatusBar,
    Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Input, Button, Card, VideoThumbnail, QualitySelector } from '../components';
import { useDownloadStore, useSettingsStore } from '../store';
import { fetchVideoMetadata, getDownloadUrl } from '../services';
import { VideoMetadata, VideoQuality, MediaFormat, MainTabScreenProps } from '../types';
import { PLATFORMS, getPlatformInfo } from '../constants';
import { colors, spacing, textStyles, borderRadius, iconSize } from '../theme';

type Props = MainTabScreenProps<'Home'>;

export const HomeScreen: React.FC<Props> = () => {
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();

    const [url, setUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [metadata, setMetadata] = useState<VideoMetadata | null>(null);
    const [showQualitySelector, setShowQualitySelector] = useState(false);
    const [selectedQuality, setSelectedQuality] = useState<VideoQuality>('720p');
    const [selectedFormat, setSelectedFormat] = useState<MediaFormat>('mp4');

    const { addTask, startDownload, getCompletedDownloads } = useDownloadStore();
    const { defaultQuality, defaultFormat } = useSettingsStore();

    const handlePaste = useCallback((text: string) => {
        setUrl(text);
        setError(null);
    }, []);

    const handleSearch = useCallback(async () => {
        if (!url.trim()) {
            setError('Please enter a video URL');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const data = await fetchVideoMetadata(url.trim());
            setMetadata(data);
            setSelectedQuality(defaultQuality);
            setSelectedFormat(defaultFormat);
            setShowQualitySelector(true);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch video info');
        } finally {
            setLoading(false);
        }
    }, [url, defaultQuality, defaultFormat]);

    const handleDownload = useCallback(async () => {
        if (!metadata) return;

        try {
            setShowQualitySelector(false);

            const task = addTask(
                metadata.url,
                metadata.title,
                metadata.thumbnail,
                selectedQuality,
                selectedFormat
            );

            const downloadUrl = await getDownloadUrl(metadata.url, selectedQuality, selectedFormat);
            await startDownload(task.id, downloadUrl);

            setUrl('');
            setMetadata(null);

            Alert.alert(
                'Download Started',
                `"${metadata.title}" is now downloading`,
                [
                    { text: 'View Downloads', onPress: () => navigation.navigate('Downloads' as never) },
                    { text: 'OK', style: 'cancel' },
                ]
            );
        } catch (err) {
            Alert.alert('Error', err instanceof Error ? err.message : 'Failed to start download');
        }
    }, [metadata, selectedQuality, selectedFormat, addTask, startDownload, navigation]);

    const recentDownloads = getCompletedDownloads().slice(0, 3);

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={colors.background} />

            <LinearGradient
                colors={[colors.gradientStart, colors.gradientMid, colors.background]}
                style={[styles.header, { paddingTop: insets.top + spacing.base }]}
            >
                <Text style={styles.logo}>Swift<Text style={styles.logoAccent}>Saver</Text></Text>
                <Text style={styles.tagline}>Download videos from anywhere</Text>
            </LinearGradient>

            <ScrollView
                style={styles.content}
                contentContainerStyle={styles.contentContainer}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                {/* URL Input */}
                <Card variant="elevated" style={styles.inputCard}>
                    <Input
                        placeholder="Paste video URL here..."
                        value={url}
                        onChangeText={(text) => {
                            setUrl(text);
                            setError(null);
                        }}
                        onPaste={handlePaste}
                        showPasteButton
                        leftIcon="link"
                        error={error || undefined}
                        autoCapitalize="none"
                        autoCorrect={false}
                        keyboardType="url"
                    />

                    <Button
                        title={loading ? 'Fetching...' : 'Get Video'}
                        onPress={handleSearch}
                        loading={loading}
                        fullWidth
                        style={styles.searchButton}
                        icon={<Icon name="download" size={iconSize.md} color={colors.background} />}
                    />
                </Card>

                {/* Platform Quick Access */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Supported Platforms</Text>
                    <View style={styles.platformGrid}>
                        {PLATFORMS.filter(p => p.enabled).map((platform) => (
                            <TouchableOpacity
                                key={platform.id}
                                style={styles.platformButton}
                                onPress={() => {
                                    // Opens platform's website for browsing
                                }}
                                activeOpacity={0.7}
                            >
                                <View style={[styles.platformIcon, { backgroundColor: platform.color + '20' }]}>
                                    <Icon name={platform.icon} size={iconSize.lg} color={platform.color} />
                                </View>
                                <Text style={styles.platformName}>{platform.name}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Recent Downloads */}
                {recentDownloads.length > 0 && (
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>Recent Downloads</Text>
                            <TouchableOpacity onPress={() => navigation.navigate('Library' as never)}>
                                <Text style={styles.seeAll}>See All</Text>
                            </TouchableOpacity>
                        </View>

                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            {recentDownloads.map((download) => (
                                <TouchableOpacity key={download.id} style={styles.recentItem}>
                                    <VideoThumbnail
                                        uri={download.thumbnail}
                                        width={140}
                                        height={80}
                                        showPlayButton
                                    />
                                    <Text style={styles.recentTitle} numberOfLines={2}>
                                        {download.title}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                )}

                {/* Tips */}
                <Card variant="outlined" style={styles.tipCard}>
                    <View style={styles.tipHeader}>
                        <Icon name="lightbulb-outline" size={iconSize.md} color={colors.primary} />
                        <Text style={styles.tipTitle}>How to download</Text>
                    </View>
                    <Text style={styles.tipText}>
                        1. Copy a video URL from any supported platform{'\n'}
                        2. Paste it in the input field above{'\n'}
                        3. Select quality and tap Download
                    </Text>
                </Card>
            </ScrollView>

            {/* Quality Selector Modal */}
            {metadata && (
                <QualitySelector
                    visible={showQualitySelector}
                    qualities={metadata.qualities}
                    selectedQuality={selectedQuality}
                    selectedFormat={selectedFormat}
                    onSelectQuality={(quality, format) => {
                        setSelectedQuality(quality);
                        setSelectedFormat(format);
                    }}
                    onClose={() => setShowQualitySelector(false)}
                    onDownload={handleDownload}
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
        paddingHorizontal: spacing.base,
        paddingBottom: spacing.xl,
    },
    logo: {
        ...textStyles.h1,
        color: colors.textPrimary,
    },
    logoAccent: {
        color: colors.primary,
    },
    tagline: {
        ...textStyles.body,
        color: colors.textSecondary,
        marginTop: spacing.xs,
    },
    content: {
        flex: 1,
    },
    contentContainer: {
        padding: spacing.base,
        paddingBottom: spacing['3xl'],
    },
    inputCard: {
        marginBottom: spacing.xl,
    },
    searchButton: {
        marginTop: spacing.md,
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
        marginBottom: spacing.md,
    },
    seeAll: {
        ...textStyles.body,
        color: colors.primary,
    },
    platformGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.md,
    },
    platformButton: {
        alignItems: 'center',
        width: 72,
    },
    platformIcon: {
        width: 56,
        height: 56,
        borderRadius: borderRadius.base,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: spacing.xs,
    },
    platformName: {
        ...textStyles.caption,
        color: colors.textSecondary,
        textAlign: 'center',
    },
    recentItem: {
        width: 140,
        marginRight: spacing.md,
    },
    recentTitle: {
        ...textStyles.bodySmall,
        color: colors.textSecondary,
        marginTop: spacing.xs,
    },
    tipCard: {
        backgroundColor: colors.surfaceElevated,
    },
    tipHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.sm,
        gap: spacing.sm,
    },
    tipTitle: {
        ...textStyles.body,
        color: colors.primary,
        fontWeight: '600',
    },
    tipText: {
        ...textStyles.bodySmall,
        color: colors.textSecondary,
        lineHeight: 22,
    },
});

export default HomeScreen;
