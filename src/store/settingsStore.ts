// Settings Store - User preferences management

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { VideoQuality, MediaFormat } from '../types';

interface SettingsState {
    // Theme
    theme: 'dark' | 'light' | 'system';

    // Download preferences
    defaultQuality: VideoQuality;
    defaultFormat: MediaFormat;
    wifiOnlyDownload: boolean;
    autoStartDownload: boolean;
    maxConcurrentDownloads: number;

    // Storage
    customDownloadPath: string | null;

    // Notifications
    downloadCompleteNotification: boolean;
    downloadFailedNotification: boolean;

    // Onboarding
    hasCompletedOnboarding: boolean;

    // Actions
    setTheme: (theme: 'dark' | 'light' | 'system') => void;
    setDefaultQuality: (quality: VideoQuality) => void;
    setDefaultFormat: (format: MediaFormat) => void;
    setWifiOnlyDownload: (enabled: boolean) => void;
    setAutoStartDownload: (enabled: boolean) => void;
    setMaxConcurrentDownloads: (count: number) => void;
    setCustomDownloadPath: (path: string | null) => void;
    setDownloadCompleteNotification: (enabled: boolean) => void;
    setDownloadFailedNotification: (enabled: boolean) => void;
    completeOnboarding: () => void;
    resetSettings: () => void;
}

const defaultSettings = {
    theme: 'dark' as const,
    defaultQuality: '720p' as VideoQuality,
    defaultFormat: 'mp4' as MediaFormat,
    wifiOnlyDownload: false,
    autoStartDownload: true,
    maxConcurrentDownloads: 2,
    customDownloadPath: null,
    downloadCompleteNotification: true,
    downloadFailedNotification: true,
    hasCompletedOnboarding: false,
};

export const useSettingsStore = create<SettingsState>()(
    persist(
        (set) => ({
            ...defaultSettings,

            setTheme: (theme) => set({ theme }),
            setDefaultQuality: (defaultQuality) => set({ defaultQuality }),
            setDefaultFormat: (defaultFormat) => set({ defaultFormat }),
            setWifiOnlyDownload: (wifiOnlyDownload) => set({ wifiOnlyDownload }),
            setAutoStartDownload: (autoStartDownload) => set({ autoStartDownload }),
            setMaxConcurrentDownloads: (maxConcurrentDownloads) => set({ maxConcurrentDownloads }),
            setCustomDownloadPath: (customDownloadPath) => set({ customDownloadPath }),
            setDownloadCompleteNotification: (downloadCompleteNotification) => set({ downloadCompleteNotification }),
            setDownloadFailedNotification: (downloadFailedNotification) => set({ downloadFailedNotification }),
            completeOnboarding: () => set({ hasCompletedOnboarding: true }),
            resetSettings: () => set(defaultSettings),
        }),
        {
            name: 'swiftsaver-settings',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);

export default useSettingsStore;
