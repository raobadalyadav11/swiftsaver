// Video Thumbnail Component

import React, { useState } from 'react';
import {
    View,
    Image,
    StyleSheet,
    Text,
    ActivityIndicator,
    ImageStyle,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors, borderRadius, spacing, textStyles, iconSize } from '../../theme';

interface VideoThumbnailProps {
    uri?: string;
    width?: number;
    height?: number;
    duration?: number;
    showPlayButton?: boolean;
    quality?: string;
    style?: ImageStyle;
}

export const VideoThumbnail: React.FC<VideoThumbnailProps> = ({
    uri,
    width = 120,
    height = 68,
    duration,
    showPlayButton = true,
    quality,
    style,
}) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const formatDuration = (seconds: number): string => {
        if (!seconds || seconds <= 0) return '0:00';
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = Math.floor(seconds % 60);

        if (hrs > 0) {
            return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <View style={[styles.container, { width, height }, style]}>
            {uri && !error ? (
                <Image
                    source={{ uri }}
                    style={styles.image}
                    resizeMode="cover"
                    onLoadStart={() => setLoading(true)}
                    onLoadEnd={() => setLoading(false)}
                    onError={() => {
                        setLoading(false);
                        setError(true);
                    }}
                />
            ) : (
                <View style={styles.placeholder}>
                    <Icon name="video-outline" size={iconSize.lg} color={colors.textMuted} />
                </View>
            )}

            {loading && (
                <View style={styles.loadingOverlay}>
                    <ActivityIndicator size="small" color={colors.primary} />
                </View>
            )}

            {showPlayButton && !loading && !error && (
                <View style={styles.playButton}>
                    <Icon name="play" size={iconSize.md} color={colors.textPrimary} />
                </View>
            )}

            {duration !== undefined && duration > 0 && (
                <View style={styles.durationBadge}>
                    <Text style={styles.durationText}>{formatDuration(duration)}</Text>
                </View>
            )}

            {quality && (
                <View style={styles.qualityBadge}>
                    <Text style={styles.qualityText}>{quality}</Text>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        borderRadius: borderRadius.md,
        overflow: 'hidden',
        backgroundColor: colors.surfaceElevated,
    },
    image: {
        width: '100%',
        height: '100%',
    },
    placeholder: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.surface,
    },
    loadingOverlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.overlay,
    },
    playButton: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: [{ translateX: -16 }, { translateY: -16 }],
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: colors.overlay,
        justifyContent: 'center',
        alignItems: 'center',
    },
    durationBadge: {
        position: 'absolute',
        bottom: spacing.xs,
        right: spacing.xs,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        paddingHorizontal: spacing.xs,
        paddingVertical: 2,
        borderRadius: borderRadius.sm,
    },
    durationText: {
        ...textStyles.caption,
        color: colors.textPrimary,
        fontWeight: '600',
    },
    qualityBadge: {
        position: 'absolute',
        top: spacing.xs,
        left: spacing.xs,
        backgroundColor: colors.primary,
        paddingHorizontal: spacing.xs,
        paddingVertical: 2,
        borderRadius: borderRadius.sm,
    },
    qualityText: {
        ...textStyles.badge,
        color: colors.background,
    },
});

export default VideoThumbnail;
