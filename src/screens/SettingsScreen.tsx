// Settings Screen - App preferences

import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    StatusBar,
    Switch,
    Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Card } from '../components';
import { useSettingsStore } from '../store';
import { fileSystemService } from '../services';
import { MainTabScreenProps } from '../types';
import { QUALITY_OPTIONS, FORMAT_OPTIONS, APP_CONFIG } from '../constants';
import { colors, spacing, textStyles, iconSize, borderRadius } from '../theme';

type Props = MainTabScreenProps<'Settings'>;

interface SettingItemProps {
    icon: string;
    title: string;
    subtitle?: string;
    value?: string;
    onPress?: () => void;
    rightComponent?: React.ReactNode;
}

const SettingItem: React.FC<SettingItemProps> = ({
    icon,
    title,
    subtitle,
    value,
    onPress,
    rightComponent,
}) => (
    <TouchableOpacity
        style={styles.settingItem}
        onPress={onPress}
        disabled={!onPress && !rightComponent}
        activeOpacity={onPress ? 0.7 : 1}
    >
        <View style={styles.settingLeft}>
            <View style={styles.settingIcon}>
                <Icon name={icon} size={iconSize.md} color={colors.primary} />
            </View>
            <View style={styles.settingText}>
                <Text style={styles.settingTitle}>{title}</Text>
                {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
            </View>
        </View>
        <View style={styles.settingRight}>
            {value && <Text style={styles.settingValue}>{value}</Text>}
            {rightComponent}
            {onPress && !rightComponent && (
                <Icon name="chevron-right" size={iconSize.md} color={colors.textMuted} />
            )}
        </View>
    </TouchableOpacity>
);

export const SettingsScreen: React.FC<Props> = () => {
    const insets = useSafeAreaInsets();
    const [storageInfo, setStorageInfo] = useState({ used: 0, available: 0 });

    const {
        theme,
        setTheme,
        defaultQuality,
        setDefaultQuality,
        defaultFormat,
        setDefaultFormat,
        wifiOnlyDownload,
        setWifiOnlyDownload,
        downloadCompleteNotification,
        setDownloadCompleteNotification,
        maxConcurrentDownloads,
    } = useSettingsStore();

    useEffect(() => {
        loadStorageInfo();
    }, []);

    const loadStorageInfo = async () => {
        const info = await fileSystemService.getStorageInfo();
        setStorageInfo(info);
    };

    const formatBytes = (bytes: number): string => {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
    };

    const showQualityPicker = () => {
        Alert.alert(
            'Default Quality',
            'Select the default video quality',
            QUALITY_OPTIONS.map(opt => ({
                text: `${opt.quality} - ${opt.label}`,
                onPress: () => setDefaultQuality(opt.quality as any),
            })),
        );
    };

    const showFormatPicker = () => {
        Alert.alert(
            'Default Format',
            'Select the default download format',
            FORMAT_OPTIONS.map(opt => ({
                text: `${opt.format.toUpperCase()} - ${opt.label}`,
                onPress: () => setDefaultFormat(opt.format as any),
            })),
        );
    };

    const handleClearCache = () => {
        Alert.alert(
            'Clear Downloads',
            'This will delete all downloaded files. This action cannot be undone.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Clear All',
                    style: 'destructive',
                    onPress: async () => {
                        const success = await fileSystemService.clearAllDownloads();
                        if (success) {
                            Alert.alert('Success', 'All downloads have been cleared');
                            loadStorageInfo();
                        } else {
                            Alert.alert('Error', 'Failed to clear downloads');
                        }
                    },
                },
            ]
        );
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={colors.background} />

            {/* Header */}
            <View style={[styles.header, { paddingTop: insets.top + spacing.base }]}>
                <Text style={styles.title}>Settings</Text>
            </View>

            <ScrollView
                style={styles.content}
                contentContainerStyle={styles.contentContainer}
                showsVerticalScrollIndicator={false}
            >
                {/* Download Settings */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Downloads</Text>
                    <Card variant="elevated" padding="none">
                        <SettingItem
                            icon="quality-high"
                            title="Default Quality"
                            subtitle="Preferred video resolution"
                            value={defaultQuality.toUpperCase()}
                            onPress={showQualityPicker}
                        />
                        <View style={styles.divider} />
                        <SettingItem
                            icon="file-video"
                            title="Default Format"
                            subtitle="Preferred file format"
                            value={defaultFormat.toUpperCase()}
                            onPress={showFormatPicker}
                        />
                        <View style={styles.divider} />
                        <SettingItem
                            icon="wifi"
                            title="Wi-Fi Only"
                            subtitle="Download only on Wi-Fi"
                            rightComponent={
                                <Switch
                                    value={wifiOnlyDownload}
                                    onValueChange={setWifiOnlyDownload}
                                    trackColor={{ false: colors.surfaceHighlight, true: colors.primaryDark }}
                                    thumbColor={wifiOnlyDownload ? colors.primary : colors.textMuted}
                                />
                            }
                        />
                    </Card>
                </View>

                {/* Notifications */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Notifications</Text>
                    <Card variant="elevated" padding="none">
                        <SettingItem
                            icon="bell-check"
                            title="Download Complete"
                            subtitle="Notify when download finishes"
                            rightComponent={
                                <Switch
                                    value={downloadCompleteNotification}
                                    onValueChange={setDownloadCompleteNotification}
                                    trackColor={{ false: colors.surfaceHighlight, true: colors.primaryDark }}
                                    thumbColor={downloadCompleteNotification ? colors.primary : colors.textMuted}
                                />
                            }
                        />
                    </Card>
                </View>

                {/* Storage */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Storage</Text>
                    <Card variant="elevated" padding="none">
                        <SettingItem
                            icon="folder"
                            title="Download Location"
                            subtitle={fileSystemService.getDownloadPath()}
                        />
                        <View style={styles.divider} />
                        <SettingItem
                            icon="chart-donut"
                            title="Storage Used"
                            value={formatBytes(storageInfo.used)}
                        />
                        <View style={styles.divider} />
                        <SettingItem
                            icon="delete-sweep"
                            title="Clear All Downloads"
                            subtitle="Delete all downloaded files"
                            onPress={handleClearCache}
                        />
                    </Card>
                </View>

                {/* About */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>About</Text>
                    <Card variant="elevated" padding="none">
                        <SettingItem
                            icon="information"
                            title="Version"
                            value={APP_CONFIG.version}
                        />
                        <View style={styles.divider} />
                        <SettingItem
                            icon="file-document"
                            title="Terms of Service"
                            onPress={() => { }}
                        />
                        <View style={styles.divider} />
                        <SettingItem
                            icon="shield-check"
                            title="Privacy Policy"
                            onPress={() => { }}
                        />
                    </Card>
                </View>

                {/* App Info */}
                <View style={styles.appInfo}>
                    <Text style={styles.appName}>SwiftSaver</Text>
                    <Text style={styles.appVersion}>Version {APP_CONFIG.version}</Text>
                    <Text style={styles.appCopyright}>© 2026 SwiftSaver. All rights reserved.</Text>
                </View>
            </ScrollView>
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
    content: {
        flex: 1,
    },
    contentContainer: {
        padding: spacing.base,
        paddingBottom: spacing['3xl'],
    },
    section: {
        marginBottom: spacing.xl,
    },
    sectionTitle: {
        ...textStyles.label,
        color: colors.textMuted,
        marginBottom: spacing.sm,
        marginLeft: spacing.xs,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: spacing.base,
    },
    settingLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    settingIcon: {
        width: 40,
        height: 40,
        borderRadius: borderRadius.md,
        backgroundColor: colors.surfaceHighlight,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: spacing.md,
    },
    settingText: {
        flex: 1,
    },
    settingTitle: {
        ...textStyles.body,
        color: colors.textPrimary,
    },
    settingSubtitle: {
        ...textStyles.caption,
        color: colors.textMuted,
        marginTop: 2,
    },
    settingRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
    },
    settingValue: {
        ...textStyles.body,
        color: colors.textSecondary,
    },
    divider: {
        height: 1,
        backgroundColor: colors.border,
        marginLeft: 64,
    },
    appInfo: {
        alignItems: 'center',
        paddingVertical: spacing.xl,
    },
    appName: {
        ...textStyles.h3,
        color: colors.primary,
    },
    appVersion: {
        ...textStyles.body,
        color: colors.textSecondary,
        marginTop: spacing.xs,
    },
    appCopyright: {
        ...textStyles.caption,
        color: colors.textMuted,
        marginTop: spacing.sm,
    },
});

export default SettingsScreen;
