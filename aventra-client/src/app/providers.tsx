"use client";

import { Toaster } from "@/components/ui/sonner";
import { useUserStore } from "@/stores/userStore";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, useEffect } from "react";

interface ProvidersProps {
  children: React.ReactNode;
}

// Storage key constant to avoid typos and enable easy changes
const USER_STORAGE_KEY = 'aventra-user-storage';

/**
 * Global providers component
 * Sets up React Query and initializes the user store
 */
export function Providers({ children }: ProvidersProps) {
  // Initialize React Query client with consistent settings
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000, // 5 minutes
        refetchOnWindowFocus: false,
      },
    },
  }));

  const fetchUser = useUserStore(state => state.fetchUser);
  const [storeInitialized, setStoreInitialized] = useState(false);
  
  // Check if user data exists in localStorage
  const checkStoredUserData = (): boolean => {
    try {
      const storedData = localStorage.getItem(USER_STORAGE_KEY);
      if (!storedData) return false;
      
      const parsedData = JSON.parse(storedData);
      return !!(parsedData && parsedData.state && parsedData.state.user);
    } catch (error) {
      console.error('Error checking stored user data:', error);
      return false;
    }
  };
  
  // Initialize user store on mount
  useEffect(() => {
    if (storeInitialized) return;
    
    const initializeStore = async () => {
      try {
        const hasStoredUser = checkStoredUserData();
        
        // If no stored user, try to fetch from session
        if (!hasStoredUser) {
          await fetchUser();
        }
      } catch (error) {
        console.error('Failed to initialize user store:', error);
      } finally {
        setStoreInitialized(true);
      }
    };
    
    initializeStore();
  }, [fetchUser, storeInitialized]);

  // Don't render children until store is initialized to prevent auth flicker
  // You could also add a loading state here if initialization takes too long
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster richColors />
    </QueryClientProvider>
  );
}