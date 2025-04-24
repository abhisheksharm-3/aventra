"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { 
  signUpWithEmail, 
  loginWithEmail, 
  logout, 
  loginWithGoogle, 
  loginWithGithub, 
  verifySession 
} from "@/controllers/AuthController";
import { useUser } from "@/hooks/useUser";
import { AuthResult } from "@/types/auth";

interface UseAuthProps {
  redirectAfterLogin?: string;
  redirectAfterLogout?: string;
}

export const useAuth = ({
  redirectAfterLogin = "/dashboard",
  redirectAfterLogout = "/login",
}: UseAuthProps = {}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [lastError, setLastError] = useState<string | null>(null);
  const router = useRouter();
  const { refreshUser } = useUser();

  // Clear error when component unmounts or on cleanup
  useEffect(() => {
    return () => {
      setLastError(null);
    };
  }, []);

  /**
   * Register a new user with email, password, and username
   */
  const register = useCallback(
    async (formData: FormData): Promise<AuthResult> => {
      setIsLoading(true);
      setLastError(null);
      
      try {
        const result = await signUpWithEmail(formData);
        
        if (result.success) {
          await refreshUser();
          router.push(redirectAfterLogin);
        } else {
          setLastError(result.error || "Registration failed");
        }
        
        return result;
      } catch (error) {
        const errorMessage = error instanceof Error 
          ? error.message 
          : "An unexpected error occurred during registration";
        
        setLastError(errorMessage);
        return { success: false, error: errorMessage };
      } finally {
        setIsLoading(false);
      }
    },
    [router, refreshUser, redirectAfterLogin]
  );

  /**
   * Login with email and password
   */
  const login = useCallback(
    async (formData: FormData): Promise<AuthResult> => {
      setIsLoading(true);
      setLastError(null);
      
      try {
        const result = await loginWithEmail(formData);
        
        if (result.success) {
          await refreshUser();
          router.push(redirectAfterLogin);
        } else {
          setLastError(result.error || "Login failed");
        }
        
        return result;
      } catch (error) {
        const errorMessage = error instanceof Error 
          ? error.message 
          : "An unexpected error occurred during login";
        
        setLastError(errorMessage);
        return { success: false, error: errorMessage };
      } finally {
        setIsLoading(false);
      }
    },
    [router, refreshUser, redirectAfterLogin]
  );

  /**
   * Logout the current user
   */
  const signOut = useCallback(async (): Promise<AuthResult> => {
    setIsLoading(true);
    setLastError(null);
    
    try {
      const result = await logout();
      
      if (result.success) {
        await refreshUser();
        router.push(redirectAfterLogout);
      } else {
        setLastError(result.error || "Logout failed");
      }
      
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : "An unexpected error occurred during logout";
      
      setLastError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, [router, refreshUser, redirectAfterLogout]);

  /**
   * Initiate Google OAuth login
   */
  const loginWithGoogleOAuth = useCallback(async () => {
    setIsLoading(true);
    setLastError(null);
    
    try {
      const result = await loginWithGoogle();
      
      if (typeof result === 'string') {
        // Redirect to OAuth provider
        window.location.href = result;
        return { success: true };
      }
      
      if (!result.success) {
        setLastError(result.error || "Google login failed");
      }
      
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : "An unexpected error occurred with Google login";
      
      setLastError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Initiate GitHub OAuth login
   */
  const loginWithGithubOAuth = useCallback(async () => {
    setIsLoading(true);
    setLastError(null);
    
    try {
      const result = await loginWithGithub();
      
      if (typeof result === 'string') {
        // Redirect to OAuth provider
        window.location.href = result;
        return { success: true };
      }
      
      if (!result.success) {
        setLastError(result.error || "GitHub login failed");
      }
      
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : "An unexpected error occurred with GitHub login";
      
      setLastError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Check if the user is logged in
   */
  const checkSession = useCallback(async (): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      const isValid = await verifySession();
      if (!isValid) {
        await refreshUser();
      }
      return isValid;
    } catch (error) {
      console.error("Session verification failed:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [refreshUser]);

  /**
   * Clear any authentication errors
   */
  const clearError = useCallback(() => {
    setLastError(null);
  }, []);

  return {
    register,
    login,
    signOut,
    loginWithGoogle: loginWithGoogleOAuth,
    loginWithGithub: loginWithGithubOAuth,
    checkSession,
    clearError,
    isLoading,
    error: lastError,
  };
};

export default useAuth;