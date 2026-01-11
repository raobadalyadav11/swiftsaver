// Quality Selector Component - Bottom sheet for quality/format selection

import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Modal,
    ScrollView,
    Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Button } from '../common';
import { VideoQuality, MediaFormat, VideoQualityInfo } from '../../types';
import { colors, spacing, textStyles, borderRadius, iconSize } from '../../theme';

interface QualitySelectorProps {
    visible: boolean;
    qualities: VideoQualityInfo[];
    selectedQuality: VideoQuality;
    selectedFormat: MediaFormat;
    onSelectQuality: (quality: VideoQuality, format: MediaFormat) => void;
    onClose: () => void;
    onDownload: () => void;
}

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export const QualitySelector: React.FC<QualitySelectorProps> = ({
    visible,
    qualities,
    selectedQuality,
    selectedFormat,
    onSelectQuality,
    onClose,
    onDownload,
}) => {
    const [activeTab, setActiveTab] = useState<'video' | 'audio'>('video');

    const formatBytes = (bytes?: number): string => {
        if (!bytes || bytes === 0) return 'Unknown size';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
    };

    const videoQualities = qualities.filter(q =>
        ['mp4', 'webm', 'mkv'].includes(q.format.toLowerCase())
    );
    const audioQualities = qualities.filter(q =>
        ['mp3', 'm4a', 'aac', 'wav'].includes(q.format.toLowerCase()) || q.quality === 'audio'
    );

    const displayQualities = activeTab === 'video' ? videoQualities : audioQualities;

    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <TouchableOpacity style={styles.backdrop} onPress={onClose} />

                <View style={styles.sheet}>
                    {/* Handle */}
                    <View style={styles.handle} />

                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.title}>Download Options</Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <Icon name="close" size={iconSize.base} color={colors.textSecondary} />
                        </TouchableOpacity>
                    </View>

                    {/* Tabs */}
                    <View style={styles.tabs}>
                        <TouchableOpacity
                            style={[styles.tab, activeTab === 'video' && styles.tabActive]}
                            onPress={() => setActiveTab('video')}
                        >
                            <Icon
                                name="video"
                                size={iconSize.md}
                                color={activeTab === 'video' ? colors.primary : colors.textMuted}
                            />
                            <Text style={[styles.tabText, activeTab === 'video' && styles.tabTextActive]}>
                                Video
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.tab, activeTab === 'audio' && styles.tabActive]}
                            onPress={() => setActiveTab('audio')}
                        >
                            <Icon
                                name="music"
                                size={iconSize.md}
                                color={activeTab === 'audio' ? colors.primary : colors.textMuted}
                            />
                            <Text style={[styles.tabText, activeTab === 'audio' && styles.tabTextActive]}>
                                Audio Only
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* Quality Options */}
                    <ScrollView style={styles.optionsList} showsVerticalScrollIndicator={false}>
                        {displayQualities.map((quality, index) => {
                            const isSelected =
                                quality.quality === selectedQuality &&
                                quality.format.toLowerCase() === selectedFormat.toLowerCase();

                            return (
                                <TouchableOpacity
                                    key={`${quality.quality}-${quality.format}-${index}`}
                                    style={[styles.option, isSelected && styles.optionSelected]}
                                    onPress={() => onSelectQuality(
                                        quality.quality as VideoQuality,
                                        quality.format.toLowerCase() as MediaFormat
                                    )}
                                >
                                    <View style={styles.optionLeft}>
                                        <View style={[styles.radio, isSelected && styles.radioSelected]}>
                                            {isSelected && <View style={styles.radioInner} />}
                                        </View>

                                        <View style={styles.optionInfo}>
                                            <Text style={[styles.optionQuality, isSelected && styles.optionTextSelected]}>
                                                {quality.quality}
                                            </Text>
                                            {quality.width && quality.height && (
                                                <Text style={styles.optionResolution}>
                                                    {quality.width}x{quality.height} • {quality.format.toUpperCase()}
                                                </Text>
                                            )}
                                        </View>
                                    </View>

                                    <View style={styles.optionRight}>
                                        <Text style={styles.optionSize}>
                                            {formatBytes(quality.fileSize)}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            );
                        })}
                    </ScrollView>

                    {/* Download Button */}
                    <View style={styles.footer}>
                        <Button
                            title={`Download ${selectedQuality.toUpperCase()} ${selectedFormat.toUpperCase()}`}
                            onPress={onDownload}
                            fullWidth
                            size="large"
                        />
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: colors.overlay,
    },
    sheet: {
        backgroundColor: colors.surface,
        borderTopLeftRadius: borderRadius.xl,
        borderTopRightRadius: borderRadius.xl,
        maxHeight: SCREEN_HEIGHT * 0.75,
        paddingBottom: spacing['2xl'],
    },
    handle: {
        width: 40,
        height: 4,
        backgroundColor: colors.surfaceHighlight,
        borderRadius: borderRadius.full,
        alignSelf: 'center',
        marginTop: spacing.md,
        marginBottom: spacing.base,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spacing.base,
        marginBottom: spacing.base,
    },
    title: {
        ...textStyles.h4,
        color: colors.textPrimary,
    },
    closeButton: {
        padding: spacing.sm,
        borderRadius: borderRadius.full,
        backgroundColor: colors.surfaceElevated,
    },
    tabs: {
        flexDirection: 'row',
        marginHorizontal: spacing.base,
        backgroundColor: colors.surfaceElevated,
        borderRadius: borderRadius.base,
        padding: spacing.xs,
    },
    tab: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: spacing.sm,
        borderRadius: borderRadius.md,
        gap: spacing.xs,
    },
    tabActive: {
        backgroundColor: colors.surfaceHighlight,
    },
    tabText: {
        ...textStyles.button,
        color: colors.textMuted,
    },
    tabTextActive: {
        color: colors.primary,
    },
    optionsList: {
        maxHeight: SCREEN_HEIGHT * 0.4,
        marginTop: spacing.base,
        paddingHorizontal: spacing.base,
    },
    option: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.base,
        backgroundColor: colors.surfaceElevated,
        borderRadius: borderRadius.base,
        marginBottom: spacing.sm,
        borderWidth: 1,
        borderColor: 'transparent',
    },
    optionSelected: {
        borderColor: colors.primary,
        backgroundColor: 'rgba(255, 215, 0, 0.1)',
    },
    optionLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    radio: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: colors.border,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: spacing.md,
    },
    radioSelected: {
        borderColor: colors.primary,
    },
    radioInner: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: colors.primary,
    },
    optionInfo: {},
    optionQuality: {
        ...textStyles.body,
        color: colors.textPrimary,
        fontWeight: '600',
    },
    optionTextSelected: {
        color: colors.primary,
    },
    optionResolution: {
        ...textStyles.caption,
        color: colors.textMuted,
        marginTop: 2,
    },
    optionRight: {},
    optionSize: {
        ...textStyles.bodySmall,
        color: colors.textSecondary,
    },
    footer: {
        paddingHorizontal: spacing.base,
        paddingTop: spacing.base,
    },
});

export default QualitySelector;
