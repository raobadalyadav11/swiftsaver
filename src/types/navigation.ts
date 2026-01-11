// Navigation Types
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { CompositeScreenProps, NavigatorScreenParams } from '@react-navigation/native';
import type { MediaFile } from './video';

// Root Stack - includes auth flow
export type RootStackParamList = {
    Splash: undefined;
    Onboarding: undefined;
    Main: NavigatorScreenParams<MainTabParamList>;
    Player: { mediaFile: MediaFile };
    DownloadPreview: { url: string };
};

// Main Tab Navigator
export type MainTabParamList = {
    Home: undefined;
    Downloads: undefined;
    Library: undefined;
    Settings: undefined;
};

// Screen props types
export type RootStackScreenProps<T extends keyof RootStackParamList> =
    NativeStackScreenProps<RootStackParamList, T>;

export type MainTabScreenProps<T extends keyof MainTabParamList> =
    CompositeScreenProps<
        BottomTabScreenProps<MainTabParamList, T>,
        NativeStackScreenProps<RootStackParamList>
    >;

// Convenience type for navigation prop
declare global {
    namespace ReactNavigation {
        interface RootParamList extends RootStackParamList { }
    }
}
