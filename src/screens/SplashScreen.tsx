// Splash Screen

import React, { useEffect } from 'react';
import { View, Text, StyleSheet, StatusBar, ActivityIndicator } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { useSettingsStore } from '../store';
import { RootStackScreenProps } from '../types';
import { colors, spacing, textStyles, iconSize } from '../theme';

type Props = RootStackScreenProps<'Splash'>;

export const SplashScreen: React.FC<Props> = () => {
    const navigation = useNavigation();
    const { hasCompletedOnboarding } = useSettingsStore();

    useEffect(() => {
        const timer = setTimeout(() => {
            if (hasCompletedOnboarding) {
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'Main' as never }],
                });
            } else {
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'Onboarding' as never }],
                });
            }
        }, 2000);

        return () => clearTimeout(timer);
    }, [navigation, hasCompletedOnboarding]);

    return (
        <LinearGradient
            colors={[colors.gradientStart, colors.gradientMid, colors.gradientEnd]}
            style={styles.container}
        >
            <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

            <View style={styles.content}>
                <View style={styles.logoContainer}>
                    <Icon name="download-circle" size={80} color={colors.primary} />
                </View>

                <Text style={styles.title}>
                    Swift<Text style={styles.titleAccent}>Saver</Text>
                </Text>
                <Text style={styles.tagline}>Download videos from anywhere</Text>
            </View>

            <View style={styles.footer}>
                <ActivityIndicator size="small" color={colors.primary} />
                <Text style={styles.loadingText}>Loading...</Text>
            </View>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoContainer: {
        marginBottom: spacing.lg,
    },
    title: {
        ...textStyles.h1,
        color: colors.textPrimary,
        fontSize: 40,
    },
    titleAccent: {
        color: colors.primary,
    },
    tagline: {
        ...textStyles.body,
        color: colors.textSecondary,
        marginTop: spacing.sm,
    },
    footer: {
        alignItems: 'center',
        paddingBottom: spacing['3xl'],
        gap: spacing.sm,
    },
    loadingText: {
        ...textStyles.caption,
        color: colors.textMuted,
    },
});

export default SplashScreen;
