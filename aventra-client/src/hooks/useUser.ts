"use client";

import { useState, useEffect, useCallback } from 'react';
import { 
  getCurrentUser, 
  updateUserProfile, 
  updateUserPreferences, 
  updateUserEmail,
  updateUserPassword,
  deleteUserAccount,
  uploadAvatar
} from '@/controllers/UserController';
import { User, UserUpdateResult, UserPreferences } from '@/types/appwrite';

export const useUser = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [lastActionResult, setLastActionResult] = useState<UserUpdateResult | null>(null);

  // Fetch user data
  const fetchUser = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const userData = await getCurrentUser();
      
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
          // Cast prefs to UserPreferences
          prefs: (userData.prefs || {}) as UserPreferences,
          // Get avatar URL from preferences if available
          avatarUrl: userData.prefs?.avatarUrl
        };
        
        setUser(formattedUser);
        setIsLoggedIn(true);
      } else {
        setUser(null);
        setIsLoggedIn(false);
      }
    } catch (err) {
      console.error('Error fetching user:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch user'));
      setUser(null);
      setIsLoggedIn(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Refresh user data
  const refreshUser = useCallback(async () => {
    await fetchUser();
  }, [fetchUser]);

  // Update user profile
  const updateProfile = useCallback(async (formData: FormData): Promise<UserUpdateResult> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await updateUserProfile(formData);
      setLastActionResult(result);
      
      if (result.success) {
        await refreshUser();
      } else {
        setError(new Error(result.error || 'Failed to update profile'));
      }
      
      return result;
    } catch (err) {
      console.error('Error updating profile:', err);
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(new Error(errorMessage));
      
      const result = { success: false, error: errorMessage };
      setLastActionResult(result);
      return result;
    } finally {
      setIsLoading(false);
    }
  }, [refreshUser]);

  // Update user preferences
  const updatePreferences = useCallback(async (formData: FormData): Promise<UserUpdateResult> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await updateUserPreferences(formData);
      setLastActionResult(result);
      
      if (result.success) {
        await refreshUser();
      } else {
        setError(new Error(result.error || 'Failed to update preferences'));
      }
      
      return result;
    } catch (err) {
      console.error('Error updating preferences:', err);
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(new Error(errorMessage));
      
      const result = { success: false, error: errorMessage };
      setLastActionResult(result);
      return result;
    } finally {
      setIsLoading(false);
    }
  }, [refreshUser]);

  // Update user email
  const updateEmail = useCallback(async (formData: FormData): Promise<UserUpdateResult> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await updateUserEmail(formData);
      setLastActionResult(result);
      
      if (result.success) {
        await refreshUser();
      } else {
        setError(new Error(result.error || 'Failed to update email'));
      }
      
      return result;
    } catch (err) {
      console.error('Error updating email:', err);
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(new Error(errorMessage));
      
      const result = { success: false, error: errorMessage };
      setLastActionResult(result);
      return result;
    } finally {
      setIsLoading(false);
    }
  }, [refreshUser]);

  // Update user password
  const updatePassword = useCallback(async (formData: FormData): Promise<UserUpdateResult> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await updateUserPassword(formData);
      setLastActionResult(result);
      
      if (!result.success) {
        setError(new Error(result.error || 'Failed to update password'));
      }
      
      return result;
    } catch (err) {
      console.error('Error updating password:', err);
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(new Error(errorMessage));
      
      const result = { success: false, error: errorMessage };
      setLastActionResult(result);
      return result;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Delete user account
  const deleteAccount = useCallback(async (formData: FormData): Promise<UserUpdateResult> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await deleteUserAccount(formData);
      setLastActionResult(result);
      
      if (result.success) {
        setUser(null);
        setIsLoggedIn(false);
      } else {
        setError(new Error(result.error || 'Failed to delete account'));
      }
      
      return result;
    } catch (err) {
      console.error('Error deleting account:', err);
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(new Error(errorMessage));
      
      const result = { success: false, error: errorMessage };
      setLastActionResult(result);
      return result;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Upload avatar
  const uploadUserAvatar = useCallback(async (formData: FormData): Promise<UserUpdateResult & { avatarUrl?: string }> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await uploadAvatar(formData);
      setLastActionResult(result);
      
      if (result.success) {
        await refreshUser();
      } else {
        setError(new Error(result.error || 'Failed to upload avatar'));
      }
      
      return result;
    } catch (err) {
      console.error('Error uploading avatar:', err);
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(new Error(errorMessage));
      
      const result = { success: false, error: errorMessage };
      setLastActionResult(result);
      return result;
    } finally {
      setIsLoading(false);
    }
  }, [refreshUser]);

  // Clear the last action result
  const clearLastActionResult = useCallback(() => {
    setLastActionResult(null);
  }, []);

  // Check if user has specific role
  const hasRole = useCallback((role: string): boolean => {
    if (!user || !user.prefs) return false;
    const prefs = user.prefs as UserPreferences;
    return prefs.role === role;
  }, [user]);

  // Convenience function to check if user is admin
  const isAdmin = useCallback((): boolean => {
    return hasRole('admin');
  }, [hasRole]);
  
  // Get user preference with optional default value
  const getPreference = useCallback(<T>(key: keyof UserPreferences, defaultValue?: T): T | undefined => {
    if (!user || !user.prefs) return defaultValue;
    const prefs = user.prefs as UserPreferences;
    return (prefs[key] as unknown as T) ?? defaultValue;
  }, [user]);

  // Fetch user data on initial load
  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return {
    user,
    isLoading,
    error,
    isLoggedIn,
    lastActionResult,
    refreshUser,
    updateProfile,
    updatePreferences,
    updateEmail,
    updatePassword,
    deleteAccount,
    uploadAvatar: uploadUserAvatar,
    clearLastActionResult,
    hasRole,
    isAdmin,
    getPreference
  };
};