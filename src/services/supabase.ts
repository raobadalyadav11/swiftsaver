// Supabase Service - MVP Version (Optional)
// Authentication is optional for MVP - app works without valid Supabase credentials

import { createClient, SupabaseClient, User, Session } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SUPABASE_CONFIG } from '../constants';

// Check if Supabase is configured with real credentials
// With real credentials configured, this returns true
const isSupabaseConfigured = (): boolean => {
    return (
        SUPABASE_CONFIG.url.includes('supabase.co') &&
        SUPABASE_CONFIG.anonKey.length > 10
    );
};

// Custom storage adapter for React Native
const AsyncStorageAdapter = {
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

// Lazy Supabase client - only created when needed and configured
let _supabaseClient: SupabaseClient | null = null;

const getSupabaseClient = (): SupabaseClient | null => {
    if (!isSupabaseConfigured()) {
        console.warn('Supabase not configured - running in offline mode');
        return null;
    }

    if (!_supabaseClient) {
        try {
            _supabaseClient = createClient(
                SUPABASE_CONFIG.url,
                SUPABASE_CONFIG.anonKey,
                {
                    auth: {
                        storage: AsyncStorageAdapter,
                        autoRefreshToken: true,
                        persistSession: true,
                        detectSessionInUrl: false,
                    },
                    realtime: {
                        params: {
                            eventsPerSecond: 10,
                        },
                    },
                }
            );
        } catch (error) {
            console.error('Failed to initialize Supabase:', error);
            return null;
        }
    }

    return _supabaseClient;
};

// Export getter for supabase client (can be null)
export const supabase = {
    get client(): SupabaseClient | null {
        return getSupabaseClient();
    },
    get isConfigured(): boolean {
        return isSupabaseConfigured();
    },
};

// Auth Service - gracefully handles unconfigured state
export const authService = {
    // Get current session
    getSession: async (): Promise<Session | null> => {
        const client = getSupabaseClient();
        if (!client) return null;

        try {
            const { data: { session } } = await client.auth.getSession();
            return session;
        } catch {
            return null;
        }
    },

    // Get current user
    getUser: async (): Promise<User | null> => {
        const client = getSupabaseClient();
        if (!client) return null;

        try {
            const { data: { user } } = await client.auth.getUser();
            return user;
        } catch {
            return null;
        }
    },

    // Sign up with email
    signUp: async (email: string, password: string) => {
        const client = getSupabaseClient();
        if (!client) throw new Error('Supabase not configured');

        const { data, error } = await client.auth.signUp({
            email,
            password,
        });
        if (error) throw error;
        return data;
    },

    // Sign in with email
    signIn: async (email: string, password: string) => {
        const client = getSupabaseClient();
        if (!client) throw new Error('Supabase not configured');

        const { data, error } = await client.auth.signInWithPassword({
            email,
            password,
        });
        if (error) throw error;
        return data;
    },

    // Sign out
    signOut: async () => {
        const client = getSupabaseClient();
        if (!client) return;

        const { error } = await client.auth.signOut();
        if (error) throw error;
    },

    // Listen to auth changes
    onAuthStateChange: (callback: (event: string, session: Session | null) => void) => {
        const client = getSupabaseClient();
        if (!client) {
            // Return a no-op unsubscribe function
            return { data: { subscription: { unsubscribe: () => { } } } };
        }
        return client.auth.onAuthStateChange(callback);
    },
};

// Analytics Service - silently handles unconfigured state
export const analyticsService = {
    // Track events
    trackEvent: async (eventName: string, properties?: Record<string, unknown>) => {
        const client = getSupabaseClient();
        if (!client) {
            // Just log locally when not configured
            console.log('[Analytics]', eventName, properties);
            return;
        }

        try {
            await client
                .from('analytics_events')
                .insert({
                    event_name: eventName,
                    properties,
                    created_at: new Date().toISOString(),
                });
        } catch (err) {
            console.warn('Analytics tracking failed:', err);
        }
    },

    trackPageView: async (pageName: string) => {
        await analyticsService.trackEvent('page_view', { page: pageName });
    },

    trackDownload: async (platform: string, quality: string, format: string) => {
        await analyticsService.trackEvent('download_started', {
            platform,
            quality,
            format,
        });
    },

    trackDownloadComplete: async (platform: string, fileSize: number) => {
        await analyticsService.trackEvent('download_completed', {
            platform,
            file_size: fileSize,
        });
    },
};

// User Preferences Sync - gracefully handles unconfigured state
export const preferencesService = {
    savePreferences: async (userId: string, preferences: Record<string, unknown>) => {
        const client = getSupabaseClient();
        if (!client) {
            console.warn('Cannot sync preferences - Supabase not configured');
            return;
        }

        const { error } = await client
            .from('user_preferences')
            .upsert({
                user_id: userId,
                preferences,
                updated_at: new Date().toISOString(),
            });

        if (error) throw error;
    },

    fetchPreferences: async (userId: string) => {
        const client = getSupabaseClient();
        if (!client) return null;

        const { data, error } = await client
            .from('user_preferences')
            .select('preferences')
            .eq('user_id', userId)
            .single();

        if (error) throw error;
        return data?.preferences;
    },
};

export default supabase;
