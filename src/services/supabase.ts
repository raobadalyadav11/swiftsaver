// Supabase Service

import { createClient, SupabaseClient, User, Session } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SUPABASE_CONFIG } from '../constants';

// Custom storage adapter for React Native
const ExpoSecureStoreAdapter = {
    getItem: async (key: string) => {
        return await AsyncStorage.getItem(key);
    },
    setItem: async (key: string, value: string) => {
        await AsyncStorage.setItem(key, value);
    },
    removeItem: async (key: string) => {
        await AsyncStorage.removeItem(key);
    },
};

// Initialize Supabase client
export const supabase: SupabaseClient = createClient(
    SUPABASE_CONFIG.url,
    SUPABASE_CONFIG.anonKey,
    {
        auth: {
            storage: ExpoSecureStoreAdapter,
            autoRefreshToken: true,
            persistSession: true,
            detectSessionInUrl: false,
        },
    }
);

// Auth Service
export const authService = {
    // Get current session
    getSession: async (): Promise<Session | null> => {
        const { data: { session } } = await supabase.auth.getSession();
        return session;
    },

    // Get current user
    getUser: async (): Promise<User | null> => {
        const { data: { user } } = await supabase.auth.getUser();
        return user;
    },

    // Sign up with email
    signUp: async (email: string, password: string) => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
        });
        if (error) throw error;
        return data;
    },

    // Sign in with email
    signIn: async (email: string, password: string) => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        if (error) throw error;
        return data;
    },

    // Sign out
    signOut: async () => {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
    },

    // Listen to auth changes
    onAuthStateChange: (callback: (event: string, session: Session | null) => void) => {
        return supabase.auth.onAuthStateChange(callback);
    },
};

// Analytics Service
export const analyticsService = {
    // Track events
    trackEvent: async (eventName: string, properties?: Record<string, unknown>) => {
        try {
            // In production, send to Supabase analytics table
            console.log('Analytics Event:', eventName, properties);

            const { error } = await supabase
                .from('analytics_events')
                .insert({
                    event_name: eventName,
                    properties,
                    created_at: new Date().toISOString(),
                });

            if (error) {
                // Silently fail for analytics
                console.warn('Analytics error:', error);
            }
        } catch (err) {
            console.warn('Analytics tracking failed:', err);
        }
    },

    // Track page view
    trackPageView: async (pageName: string) => {
        await analyticsService.trackEvent('page_view', { page: pageName });
    },

    // Track download
    trackDownload: async (platform: string, quality: string, format: string) => {
        await analyticsService.trackEvent('download_started', {
            platform,
            quality,
            format,
        });
    },

    // Track download completion
    trackDownloadComplete: async (platform: string, fileSize: number) => {
        await analyticsService.trackEvent('download_completed', {
            platform,
            file_size: fileSize,
        });
    },
};

// User Preferences Sync
export const preferencesService = {
    // Save preferences to cloud
    savePreferences: async (userId: string, preferences: Record<string, unknown>) => {
        const { error } = await supabase
            .from('user_preferences')
            .upsert({
                user_id: userId,
                preferences,
                updated_at: new Date().toISOString(),
            });

        if (error) throw error;
    },

    // Fetch preferences from cloud
    fetchPreferences: async (userId: string) => {
        const { data, error } = await supabase
            .from('user_preferences')
            .select('preferences')
            .eq('user_id', userId)
            .single();

        if (error) throw error;
        return data?.preferences;
    },
};

export default supabase;
