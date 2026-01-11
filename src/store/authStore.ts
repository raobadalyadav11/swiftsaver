// Auth Store - Authentication state management

import { create } from 'zustand';
import { User, Session } from '@supabase/supabase-js';
import { authService } from '../services';

interface AuthState {
    user: User | null;
    session: Session | null;
    isLoading: boolean;
    error: string | null;

    // Actions
    initialize: () => Promise<void>;
    signIn: (email: string, password: string) => Promise<void>;
    signUp: (email: string, password: string) => Promise<void>;
    signOut: () => Promise<void>;
    clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    session: null,
    isLoading: true,
    error: null,

    initialize: async () => {
        try {
            set({ isLoading: true, error: null });
            const session = await authService.getSession();
            const user = await authService.getUser();
            set({ session, user, isLoading: false });

            // Listen for auth changes
            authService.onAuthStateChange((event, session) => {
                set({ session, user: session?.user ?? null });
            });
        } catch (error) {
            set({
                isLoading: false,
                error: error instanceof Error ? error.message : 'Failed to initialize auth',
            });
        }
    },

    signIn: async (email, password) => {
        try {
            set({ isLoading: true, error: null });
            const data = await authService.signIn(email, password);
            set({
                session: data.session,
                user: data.user,
                isLoading: false,
            });
        } catch (error) {
            set({
                isLoading: false,
                error: error instanceof Error ? error.message : 'Sign in failed',
            });
            throw error;
        }
    },

    signUp: async (email, password) => {
        try {
            set({ isLoading: true, error: null });
            const data = await authService.signUp(email, password);
            set({
                session: data.session,
                user: data.user,
                isLoading: false,
            });
        } catch (error) {
            set({
                isLoading: false,
                error: error instanceof Error ? error.message : 'Sign up failed',
            });
            throw error;
        }
    },

    signOut: async () => {
        try {
            set({ isLoading: true, error: null });
            await authService.signOut();
            set({ session: null, user: null, isLoading: false });
        } catch (error) {
            set({
                isLoading: false,
                error: error instanceof Error ? error.message : 'Sign out failed',
            });
        }
    },

    clearError: () => set({ error: null }),
}));

export default useAuthStore;
