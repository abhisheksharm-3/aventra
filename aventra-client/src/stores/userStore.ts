"use client";

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { 
  getCurrentUser, 
  updateUserProfile, 
  updateUserPreferences, 
  updateUserEmail,
  updateUserPassword,
  deleteUserAccount,
  uploadAvatar
} from '@/controllers/UserController';

import { 
  signUpWithEmail, 
  loginWithEmail, 
  logout, 
  loginWithGoogle, 
  loginWithGithub, 
  verifySession 
} from "@/controllers/AuthController";

import { User, UserUpdateResult, UserPreferences } from '@/types/appwrite';
import { AuthResult } from '@/types/auth';

/**
 * User Store State Interface
 * Centralizes both user data and authentication state
 */
interface UserState {
  // User data
  user: User | null;
  isLoggedIn: boolean;
  
  // Status indicators
  isLoading: boolean;
  error: Error | null;
  lastActionResult: UserUpdateResult | null;
  
  // User data actions
  fetchUser: () => Promise<User | null>;
  updateProfile: (formData: FormData) => Promise<UserUpdateResult>;
  updatePreferences: (formData: FormData) => Promise<UserUpdateResult>;
  updateEmail: (formData: FormData) => Promise<UserUpdateResult>;
  updatePassword: (formData: FormData) => Promise<UserUpdateResult>;
  deleteAccount: (formData: FormData) => Promise<UserUpdateResult>;
  uploadAvatar: (formData: FormData) => Promise<UserUpdateResult & { avatarUrl?: string }>;
  clearLastActionResult: () => void;
  
  // Helper methods
  hasRole: (role: string) => boolean;
  isAdmin: () => boolean;
  getPreference: <T>(key: keyof UserPreferences, defaultValue?: T) => T | undefined;
  
  // Authentication actions
  register: (formData: FormData, redirectUrl?: string) => Promise<AuthResult>;
  login: (formData: FormData, redirectUrl?: string) => Promise<AuthResult>;
  logout: (redirectUrl?: string) => Promise<AuthResult>;
  loginWithGoogle: () => Promise<AuthResult | string>;
  loginWithGithub: () => Promise<AuthResult | string>;
  checkSession: () => Promise<boolean>;
  clearError: () => void;
  
  // Last timestamp for tracking
  lastUpdated: string;
}

/**
 * Centralized user store using Zustand
 * Handles both authentication and user profile data
 */
export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      isLoggedIn: false,
      isLoading: false,
      error: null,
      lastActionResult: null,
      lastUpdated: new Date().toISOString(),

      // User data methods
      fetchUser: async () => {
        set({ isLoading: true, error: null });
        try {
          const userData = await getCurrentUser();
          console.log("Fetched user data:", userData);
          
          if (userData) {
            const formattedUser: User = {
              $id: userData.$id,
              $createdAt: userData.$createdAt || "",
              $updatedAt: userData.$updatedAt || "",
              name: userData.name,
              email: userData.email,
              emailVerification: userData.emailVerification,
              registration: userData.registration || "",
              status: userData.status ?? true,
              labels: userData.labels || [],
              passwordUpdate: userData.passwordUpdate || "",
              phoneVerification: userData.phoneVerification ?? false,
              mfa: userData.mfa ?? false,
              accessedAt: userData.accessedAt || "",
              prefs: (userData.prefs || {}) as UserPreferences,
              avatarUrl: userData.prefs?.avatarUrl
            };
            
            set({ 
              user: formattedUser, 
              isLoggedIn: true, 
              isLoading: false,
              lastUpdated: new Date().toISOString()
            });
            
            return formattedUser;
          } else {
            set({ user: null, isLoggedIn: false, isLoading: false });
            return null;
          }
        } catch (err) {
          console.error('Error fetching user:', err);
          set({ 
            error: err instanceof Error ? err : new Error('Failed to fetch user'),
            user: null, 
            isLoggedIn: false, 
            isLoading: false 
          });
          return null;
        }
      },
      
      updateProfile: async (formData: FormData) => {
        set({ isLoading: true, error: null });
        
        try {
          const result = await updateUserProfile(formData);
          set({ lastActionResult: result });
          
          if (result.success) {
            await get().fetchUser();
          } else {
            set({ error: new Error(result.error || 'Failed to update profile') });
          }
          
          return result;
        } catch (err) {
          console.error('Error updating profile:', err);
          const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
          
          const result = { success: false, error: errorMessage };
          set({ 
            error: new Error(errorMessage), 
            lastActionResult: result,
            isLoading: false 
          });
          return result;
        } finally {
          set({ isLoading: false });
        }
      },
      
      updatePreferences: async (formData: FormData) => {
        set({ isLoading: true, error: null });
        
        try {
          const result = await updateUserPreferences(formData);
          set({ lastActionResult: result });
          
          if (result.success) {
            await get().fetchUser();
          } else {
            set({ error: new Error(result.error || 'Failed to update preferences') });
          }
          
          return result;
        } catch (err) {
          console.error('Error updating preferences:', err);
          const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
          
          const result = { success: false, error: errorMessage };
          set({ 
            error: new Error(errorMessage), 
            lastActionResult: result,
            isLoading: false 
          });
          return result;
        } finally {
          set({ isLoading: false });
        }
      },
      
      updateEmail: async (formData: FormData) => {
        set({ isLoading: true, error: null });
        
        try {
          const result = await updateUserEmail(formData);
          set({ lastActionResult: result });
          
          if (result.success) {
            await get().fetchUser();
          } else {
            set({ error: new Error(result.error || 'Failed to update email') });
          }
          
          return result;
        } catch (err) {
          console.error('Error updating email:', err);
          const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
          
          const result = { success: false, error: errorMessage };
          set({ 
            error: new Error(errorMessage), 
            lastActionResult: result,
            isLoading: false 
          });
          return result;
        } finally {
          set({ isLoading: false });
        }
      },
      
      updatePassword: async (formData: FormData) => {
        set({ isLoading: true, error: null });
        
        try {
          const result = await updateUserPassword(formData);
          set({ lastActionResult: result });
          
          if (!result.success) {
            set({ error: new Error(result.error || 'Failed to update password') });
          }
          
          return result;
        } catch (err) {
          console.error('Error updating password:', err);
          const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
          
          const result = { success: false, error: errorMessage };
          set({ 
            error: new Error(errorMessage), 
            lastActionResult: result,
            isLoading: false 
          });
          return result;
        } finally {
          set({ isLoading: false });
        }
      },
      
      deleteAccount: async (formData: FormData) => {
        set({ isLoading: true, error: null });
        
        try {
          const result = await deleteUserAccount(formData);
          set({ lastActionResult: result });
          
          if (result.success) {
            set({ user: null, isLoggedIn: false });
          } else {
            set({ error: new Error(result.error || 'Failed to delete account') });
          }
          
          return result;
        } catch (err) {
          console.error('Error deleting account:', err);
          const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
          
          const result = { success: false, error: errorMessage };
          set({ 
            error: new Error(errorMessage), 
            lastActionResult: result,
            isLoading: false 
          });
          return result;
        } finally {
          set({ isLoading: false });
        }
      },
      
      uploadAvatar: async (formData: FormData) => {
        set({ isLoading: true, error: null });
        
        try {
          const result = await uploadAvatar(formData);
          set({ lastActionResult: result });
          
          if (result.success) {
            await get().fetchUser();
          } else {
            set({ error: new Error(result.error || 'Failed to upload avatar') });
          }
          
          return result;
        } catch (err) {
          console.error('Error uploading avatar:', err);
          const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
          
          const result = { success: false, error: errorMessage };
          set({ 
            error: new Error(errorMessage), 
            lastActionResult: result,
            isLoading: false 
          });
          return result;
        } finally {
          set({ isLoading: false });
        }
      },
      
      clearLastActionResult: () => {
        set({ lastActionResult: null });
      },
      
      hasRole: (role: string) => {
        const { user } = get();
        if (!user || !user.prefs) return false;
        const prefs = user.prefs as UserPreferences;
        return prefs.role === role;
      },
      
      isAdmin: () => {
        return get().hasRole('admin');
      },
      
      getPreference: <T>(key: keyof UserPreferences, defaultValue?: T): T | undefined => {
        const { user } = get();
        if (!user || !user.prefs) return defaultValue;
        const prefs = user.prefs as UserPreferences;
        return (prefs[key] as unknown as T) ?? defaultValue;
      },
      
      // Authentication methods
      register: async (formData: FormData, redirectUrl?: string) => {
        set({ isLoading: true, error: null });
        
        try {
          const result = await signUpWithEmail(formData);
          
          if (result.success) {
            await get().fetchUser();
            
            if (redirectUrl && typeof window !== 'undefined') {
              window.location.href = redirectUrl;
            }
          } else {
            set({ error: new Error(result.error || 'Registration failed') });
          }
          
          return result;
        } catch (err) {
          const errorMessage = err instanceof Error 
            ? err.message 
            : 'An unexpected error occurred during registration';
          
          set({ error: new Error(errorMessage) });
          return { success: false, error: errorMessage };
        } finally {
          set({ isLoading: false });
        }
      },
      
      login: async (formData: FormData, redirectUrl?: string) => {
        set({ isLoading: true, error: null });
        
        try {
          const result = await loginWithEmail(formData);
          
          if (result.success) {
            await get().fetchUser();
            
            if (redirectUrl && typeof window !== 'undefined') {
              window.location.href = redirectUrl;
            }
          } else {
            set({ error: new Error(result.error || 'Login failed') });
          }
          
          return result;
        } catch (err) {
          const errorMessage = err instanceof Error 
            ? err.message 
            : 'An unexpected error occurred during login';
          
          set({ error: new Error(errorMessage) });
          return { success: false, error: errorMessage };
        } finally {
          set({ isLoading: false });
        }
      },
      
      logout: async (redirectUrl?: string) => {
        set({ isLoading: true, error: null });
        
        try {
          const result = await logout();
          
          if (result.success) {
            set({ user: null, isLoggedIn: false });
            
            if (redirectUrl && typeof window !== 'undefined') {
              window.location.href = redirectUrl;
            }
          } else {
            set({ error: new Error(result.error || 'Logout failed') });
          }
          
          return result;
        } catch (err) {
          const errorMessage = err instanceof Error 
            ? err.message 
            : 'An unexpected error occurred during logout';
          
          set({ error: new Error(errorMessage) });
          return { success: false, error: errorMessage };
        } finally {
          set({ isLoading: false });
        }
      },
      
      loginWithGoogle: async () => {
        set({ isLoading: true, error: null });
        
        try {
          const result = await loginWithGoogle();
          
          if (typeof result === 'string') {
            // Don't update any state as we're redirecting
            return result;
          }
          
          if (!result.success) {
            set({ error: new Error(result.error || 'Google login failed') });
          }
          
          return result;
        } catch (err) {
          const errorMessage = err instanceof Error 
            ? err.message 
            : 'An unexpected error occurred with Google login';
          
          set({ error: new Error(errorMessage) });
          return { success: false, error: errorMessage };
        } finally {
          set({ isLoading: false });
        }
      },
      
      loginWithGithub: async () => {
        set({ isLoading: true, error: null });
        
        try {
          const result = await loginWithGithub();
          
          if (typeof result === 'string') {
            // Don't update any state as we're redirecting
            return result;
          }
          
          if (!result.success) {
            set({ error: new Error(result.error || 'GitHub login failed') });
          }
          
          return result;
        } catch (err) {
          const errorMessage = err instanceof Error 
            ? err.message 
            : 'An unexpected error occurred with GitHub login';
          
          set({ error: new Error(errorMessage) });
          return { success: false, error: errorMessage };
        } finally {
          set({ isLoading: false });
        }
      },
      
      checkSession: async () => {
        set({ isLoading: true });
        
        try {
          const isValid = await verifySession();
          if (!isValid) {
            await get().fetchUser();
          }
          return isValid;
        } catch (error) {
          console.error("Session verification failed:", error);
          return false;
        } finally {
          set({ isLoading: false });
        }
      },
      
      clearError: () => {
        set({ error: null });
      }
    }),
    {
      name: 'aventra-user-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        isLoggedIn: state.isLoggedIn,
        // Don't persist these states
        isLoading: false,
        error: null,
        lastActionResult: null
      })
    }
  )
);