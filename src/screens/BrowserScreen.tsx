// Browser Screen - In-app browser for watching videos

import React, { useState, useRef, useCallback } from 'react';
import {
    View,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    ActivityIndicator,
    BackHandler,
    Share,
    StatusBar,
} from 'react-native';
import { WebView } from 'react-native-webview';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useFocusEffect } from '@react-navigation/native';
import { colors, spacing, borderRadius } from '../theme';
import { PLATFORMS, getPlatformFromUrl } from '../constants';

interface BrowserScreenProps {
    route?: {
        params?: {
            url?: string;
            platform?: string;
        };
    };
    navigation: any;
}

export const BrowserScreen: React.FC<BrowserScreenProps> = ({ route, navigation }) => {
    const initialUrl = route?.params?.url || 'https://www.youtube.com';
    const [currentUrl, setCurrentUrl] = useState(initialUrl);
    const [inputUrl, setInputUrl] = useState(initialUrl);
    const [canGoBack, setCanGoBack] = useState(false);
    const [canGoForward, setCanGoForward] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [pageTitle, setPageTitle] = useState('');
    const webViewRef = useRef<WebView>(null);

    // Handle Android back button
    useFocusEffect(
        useCallback(() => {
            const onBackPress = () => {
                if (canGoBack && webViewRef.current) {
                    webViewRef.current.goBack();
                    return true;
                }
                return false;
            };

            const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
            return () => subscription.remove();
        }, [canGoBack])
    );

    const handleNavigationStateChange = (navState: any) => {
        setCanGoBack(navState.canGoBack);
        setCanGoForward(navState.canGoForward);
        setCurrentUrl(navState.url);
        setInputUrl(navState.url);
        setPageTitle(navState.title || '');
    };

    const handleGoToUrl = () => {
        let url = inputUrl.trim();
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            url = 'https://' + url;
        }
        setCurrentUrl(url);
    };

    const handleRefresh = () => {
        webViewRef.current?.reload();
    };

    const handleShare = async () => {
        try {
            await Share.share({
                message: `${pageTitle}\n${currentUrl}`,
                url: currentUrl,
            });
        } catch (error) {
            console.error('Share error:', error);
        }
    };

    const handleDownload = () => {
        // Navigate to home with the current URL for downloading
        navigation.navigate('Home', { videoUrl: currentUrl });
    };

    // Get platform icon and color if recognized
    const platform = getPlatformFromUrl(currentUrl);
    const platformInfo = PLATFORMS.find(p => p.id === platform);

    // Quick access platforms
    const quickPlatforms = [
        { id: 'youtube', name: 'YouTube', url: 'https://www.youtube.com', icon: 'youtube', color: '#FF0000' },
        { id: 'instagram', name: 'Instagram', url: 'https://www.instagram.com', icon: 'instagram', color: '#E4405F' },
        { id: 'tiktok', name: 'TikTok', url: 'https://www.tiktok.com', icon: 'music-note', color: '#000000' },
        { id: 'twitter', name: 'Twitter', url: 'https://www.twitter.com', icon: 'twitter', color: '#1DA1F2' },
        { id: 'facebook', name: 'Facebook', url: 'https://www.facebook.com', icon: 'facebook', color: '#1877F2' },
    ];

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={colors.background} />

            {/* URL Bar */}
            <View style={styles.urlBar}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={styles.iconButton}
                >
                    <Icon name="arrow-left" size={24} color={colors.textPrimary} />
                </TouchableOpacity>

                <View style={styles.urlInputContainer}>
                    {platformInfo && (
                        <Icon
                            name={platformInfo.icon}
                            size={18}
                            color={platformInfo.color}
                            style={styles.platformIcon}
                        />
                    )}
                    <TextInput
                        style={styles.urlInput}
                        value={inputUrl}
                        onChangeText={setInputUrl}
                        onSubmitEditing={handleGoToUrl}
                        placeholder="Enter URL or search"
                        placeholderTextColor={colors.textMuted}
                        autoCapitalize="none"
                        autoCorrect={false}
                        keyboardType="url"
                        returnKeyType="go"
                        selectTextOnFocus
                    />
                    {isLoading ? (
                        <ActivityIndicator size="small" color={colors.primary} />
                    ) : (
                        <TouchableOpacity onPress={handleRefresh}>
                            <Icon name="refresh" size={20} color={colors.textSecondary} />
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            {/* Quick Platform Access */}
            <View style={styles.quickAccess}>
                {quickPlatforms.map((p) => (
                    <TouchableOpacity
                        key={p.id}
                        style={[styles.quickButton, currentUrl.includes(p.id) && styles.quickButtonActive]}
                        onPress={() => setCurrentUrl(p.url)}
                    >
                        <Icon name={p.icon} size={20} color={p.color} />
                    </TouchableOpacity>
                ))}
            </View>

            {/* WebView */}
            <WebView
                ref={webViewRef}
                source={{ uri: currentUrl }}
                style={styles.webView}
                onNavigationStateChange={handleNavigationStateChange}
                onLoadStart={() => setIsLoading(true)}
                onLoadEnd={() => setIsLoading(false)}
                javaScriptEnabled
                domStorageEnabled
                allowsInlineMediaPlayback
                mediaPlaybackRequiresUserAction={false}
                allowsFullscreenVideo
                userAgent="Mozilla/5.0 (Linux; Android 12; SM-G991B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36"
            />

            {/* Bottom Navigation */}
            <View style={styles.bottomBar}>
                <TouchableOpacity
                    style={[styles.navButton, !canGoBack && styles.navButtonDisabled]}
                    onPress={() => webViewRef.current?.goBack()}
                    disabled={!canGoBack}
                >
                    <Icon name="chevron-left" size={28} color={canGoBack ? colors.textPrimary : colors.textMuted} />
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.navButton, !canGoForward && styles.navButtonDisabled]}
                    onPress={() => webViewRef.current?.goForward()}
                    disabled={!canGoForward}
                >
                    <Icon name="chevron-right" size={28} color={canGoForward ? colors.textPrimary : colors.textMuted} />
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.downloadButton}
                    onPress={handleDownload}
                >
                    <Icon name="download" size={24} color={colors.background} />
                </TouchableOpacity>

                <TouchableOpacity style={styles.navButton} onPress={handleShare}>
                    <Icon name="share-variant" size={24} color={colors.textPrimary} />
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.navButton}
                    onPress={() => navigation.navigate('Home')}
                >
                    <Icon name="home" size={24} color={colors.textPrimary} />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    urlBar: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.sm,
        backgroundColor: colors.surface,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    iconButton: {
        padding: spacing.sm,
    },
    urlInputContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.surfaceElevated,
        borderRadius: borderRadius.full,
        paddingHorizontal: spacing.md,
        marginLeft: spacing.sm,
        height: 40,
    },
    platformIcon: {
        marginRight: spacing.sm,
    },
    urlInput: {
        flex: 1,
        color: colors.textPrimary,
        fontSize: 14,
    },
    quickAccess: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: spacing.md,
        paddingVertical: spacing.sm,
        backgroundColor: colors.surface,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    quickButton: {
        width: 40,
        height: 40,
        borderRadius: borderRadius.full,
        backgroundColor: colors.surfaceElevated,
        alignItems: 'center',
        justifyContent: 'center',
    },
    quickButtonActive: {
        backgroundColor: colors.primaryLight,
    },
    webView: {
        flex: 1,
    },
    bottomBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        paddingVertical: spacing.sm,
        backgroundColor: colors.surface,
        borderTopWidth: 1,
        borderTopColor: colors.border,
    },
    navButton: {
        padding: spacing.sm,
    },
    navButtonDisabled: {
        opacity: 0.4,
    },
    downloadButton: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
        elevation: 8,
    },
});

export default BrowserScreen;
