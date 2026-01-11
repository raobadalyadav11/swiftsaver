// Onboarding Screen

import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    FlatList,
    StatusBar,
    ViewToken,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import { Button } from '../components';
import { useSettingsStore } from '../store';
import { RootStackScreenProps } from '../types';
import { colors, spacing, textStyles, borderRadius, iconSize } from '../theme';

type Props = RootStackScreenProps<'Onboarding'>;

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface OnboardingSlide {
    id: string;
    icon: string;
    title: string;
    description: string;
    color: string;
}

const SLIDES: OnboardingSlide[] = [
    {
        id: '1',
        icon: 'download-circle',
        title: 'Download Videos',
        description: 'Download videos from YouTube, Instagram, TikTok, and many more platforms with just one tap.',
        color: colors.primary,
    },
    {
        id: '2',
        icon: 'quality-high',
        title: 'Choose Quality',
        description: 'Select from various quality options including 4K, 1080p, 720p, or extract audio as MP3.',
        color: colors.success,
    },
    {
        id: '3',
        icon: 'folder-play',
        title: 'Manage Library',
        description: 'Access all your downloads in one place. Play, share, or delete files easily.',
        color: colors.secondary,
    },
];

export const OnboardingScreen: React.FC<Props> = () => {
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();
    const { completeOnboarding } = useSettingsStore();

    const [currentIndex, setCurrentIndex] = useState(0);
    const flatListRef = useRef<FlatList>(null);

    const onViewableItemsChanged = useRef(
        ({ viewableItems }: { viewableItems: ViewToken[] }) => {
            if (viewableItems.length > 0 && viewableItems[0].index !== null) {
                setCurrentIndex(viewableItems[0].index);
            }
        }
    ).current;

    const viewabilityConfig = useRef({
        itemVisiblePercentThreshold: 50,
    }).current;

    const handleNext = () => {
        if (currentIndex < SLIDES.length - 1) {
            flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
        } else {
            handleGetStarted();
        }
    };

    const handleSkip = () => {
        handleGetStarted();
    };

    const handleGetStarted = () => {
        completeOnboarding();
        navigation.reset({
            index: 0,
            routes: [{ name: 'Main' as never }],
        });
    };

    const renderSlide = ({ item }: { item: OnboardingSlide }) => (
        <View style={styles.slide}>
            <View style={[styles.iconContainer, { backgroundColor: item.color + '20' }]}>
                <Icon name={item.icon} size={80} color={item.color} />
            </View>
            <Text style={styles.slideTitle}>{item.title}</Text>
            <Text style={styles.slideDescription}>{item.description}</Text>
        </View>
    );

    const isLastSlide = currentIndex === SLIDES.length - 1;

    return (
        <LinearGradient
            colors={[colors.gradientStart, colors.gradientMid, colors.background]}
            style={styles.container}
        >
            <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

            {/* Skip Button */}
            {!isLastSlide && (
                <View style={[styles.skipContainer, { top: insets.top + spacing.base }]}>
                    <Button
                        title="Skip"
                        variant="ghost"
                        size="small"
                        onPress={handleSkip}
                    />
                </View>
            )}

            {/* Slides */}
            <FlatList
                ref={flatListRef}
                data={SLIDES}
                renderItem={renderSlide}
                keyExtractor={item => item.id}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onViewableItemsChanged={onViewableItemsChanged}
                viewabilityConfig={viewabilityConfig}
                style={styles.slideList}
            />

            {/* Footer */}
            <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.xl }]}>
                {/* Pagination Dots */}
                <View style={styles.pagination}>
                    {SLIDES.map((_, index) => (
                        <View
                            key={index}
                            style={[
                                styles.dot,
                                index === currentIndex && styles.dotActive,
                            ]}
                        />
                    ))}
                </View>

                {/* Action Button */}
                <Button
                    title={isLastSlide ? 'Get Started' : 'Next'}
                    onPress={handleNext}
                    size="large"
                    fullWidth
                    icon={
                        <Icon
                            name={isLastSlide ? 'check' : 'arrow-right'}
                            size={iconSize.md}
                            color={colors.background}
                        />
                    }
                    iconPosition="right"
                />
            </View>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    skipContainer: {
        position: 'absolute',
        right: spacing.base,
        zIndex: 10,
    },
    slideList: {
        flex: 1,
    },
    slide: {
        width: SCREEN_WIDTH,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: spacing.xl,
    },
    iconContainer: {
        width: 160,
        height: 160,
        borderRadius: 80,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: spacing['2xl'],
    },
    slideTitle: {
        ...textStyles.h1,
        color: colors.textPrimary,
        textAlign: 'center',
        marginBottom: spacing.base,
    },
    slideDescription: {
        ...textStyles.bodyLarge,
        color: colors.textSecondary,
        textAlign: 'center',
        lineHeight: 26,
    },
    footer: {
        paddingHorizontal: spacing.base,
    },
    pagination: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: spacing.xl,
        gap: spacing.sm,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: colors.surfaceHighlight,
    },
    dotActive: {
        width: 24,
        backgroundColor: colors.primary,
    },
});

export default OnboardingScreen;
