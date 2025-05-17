"use client";

/**
 * @module stores/useItineraryStore
 * @description A global store for managing itinerary data with multi-itinerary support and cloud synchronization
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ApiResponse } from '@/types/itinerary';

/**
 * Extended store state for managing multiple itineraries
 * @interface ExtendedItineraryState
 */
export interface ExtendedItineraryState {
  /** Map of itineraries indexed by their IDs */
  itineraries: Record<string, ApiResponse>;
  /** Currently active/selected itinerary ID */
  activeItineraryId: string | null;
  /** Status of API requests for itineraries */
  loading: Record<string, boolean>;
  /** Currently selected itinerary data (single itinerary mode) */
  itineraryData: ApiResponse | null;

  /**
   * Set the data for a specific itinerary by ID
   * @param {ApiResponse} data - The itinerary data to store
   * @param {string} [id] - Optional ID (uses data.id if not provided)
   */
  setItineraryData: (data: ApiResponse, id?: string) => void;

  /**
   * Set the currently active itinerary
   * @param {string} id - The ID of the itinerary to set as active
   */
  setActiveItinerary: (id: string) => void;

  /**
   * Remove a specific itinerary from the store
   * @param {string} id - The ID of the itinerary to remove
   */
  removeItinerary: (id: string) => void;

  /**
   * Clear all itineraries from the store
   */
  clearItineraryData: () => void;

  /**
   * Get an itinerary by ID, fetching from cloud if not in store
   * @param {string} id - The ID of the itinerary to retrieve
   * @returns {Promise<ApiResponse | null>} The requested itinerary or null
   */
  getItinerary: (id: string) => Promise<ApiResponse | null>;

  /**
   * Fetch an itinerary from the cloud by ID
   * @param {string} id - The ID of the itinerary to fetch
   * @returns {Promise<ApiResponse>} The fetched itinerary
   */
  fetchItineraryFromCloud: (id: string) => Promise<ApiResponse>;
}

/**
 * Zustand store for managing itineraries with persistence and cloud synchronization
 * 
 * Features:
 * - Stores multiple itineraries indexed by ID
 * - Maintains compatibility with legacy single-itinerary interface
 * - Persists data to localStorage
 * - Supports cloud synchronization for missing itineraries
 * - Tracks loading state to prevent duplicate requests
 */
export const useItineraryStore = create<ExtendedItineraryState>()(
  persist(
    (set, get) => ({
      // Initial state
      itineraries: {},
      activeItineraryId: null,
      loading: {},
      itineraryData: null,

      /**
       * Set the data for a specific itinerary
       * Also updates the single-itinerary view for backward compatibility
       */
      setItineraryData: (data: ApiResponse, id?: string) => {
        const itineraryId = id || data.id;
        
        if (!itineraryId) {
          console.error("Cannot set itinerary data without an ID");
          return;
        }
        
        // Include current timestamp and user if not present
        const enrichedData = {
          ...data,
          currentDateTime: data.currentDateTime || new Date().toISOString(),
          currentUser: data.currentUser || "unknown"
        };
        
        set((state) => {
          const newState = {
            itineraries: {
              ...state.itineraries,
              [itineraryId]: enrichedData
            },
            activeItineraryId: state.activeItineraryId || itineraryId,
            itineraryData: enrichedData // Update single-itinerary view
          };
          return newState;
        });
      },

      /**
       * Set the currently active itinerary and update single-itinerary view
       */
      setActiveItinerary: (id: string) => {
        const { itineraries } = get();
        const itinerary = itineraries[id];
        
        if (!itinerary) {
          console.warn(`Attempted to set active itinerary ${id} which doesn't exist`);
          return;
        }
        
        set({ 
          activeItineraryId: id,
          itineraryData: itinerary // Update single-itinerary view
        });
      },

      /**
       * Remove a specific itinerary from the store
       */
      removeItinerary: (id: string) => {
        set((state) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { [id]: removedItinerary, ...remainingItineraries } = state.itineraries;
          
          // Find next active ID if needed
          const newActiveId = state.activeItineraryId === id ? 
            Object.keys(remainingItineraries)[0] || null : 
            state.activeItineraryId;
            
          // Update single-itinerary view
          const newItineraryData = newActiveId ? remainingItineraries[newActiveId] : null;
            
          return {
            itineraries: remainingItineraries,
            activeItineraryId: newActiveId,
            itineraryData: newItineraryData
          };
        });
      },

      /**
       * Clear all itineraries from the store
       */
      clearItineraryData: () => {
        set({ itineraries: {}, activeItineraryId: null, itineraryData: null });
      },

      /**
       * Get an itinerary by ID, fetching from cloud if not in store
       */
      getItinerary: async (id: string) => {
        const { itineraries, loading, fetchItineraryFromCloud } = get();
        
        // Return from cache if available
        if (itineraries[id]) {
          return itineraries[id];
        }
        
        // Don't fetch if already loading
        if (loading[id]) {
          return null;
        }
        
        // Mark as loading
        set((state) => ({
          loading: { ...state.loading, [id]: true }
        }));
        
        try {
          // Fetch from cloud
          const data = await fetchItineraryFromCloud(id);
          
          // Store in cache and update single-itinerary view if this is the first/only itinerary
          set((state) => {
            const updatedItineraries = { ...state.itineraries, [id]: data };
            const isFirstItinerary = Object.keys(state.itineraries).length === 0;
            
            return {
              itineraries: updatedItineraries,
              loading: { ...state.loading, [id]: false },
              activeItineraryId: isFirstItinerary ? id : state.activeItineraryId,
              itineraryData: isFirstItinerary ? data : state.itineraryData
            };
          });
          
          return data;
        } catch (error) {
          console.error(`Failed to fetch itinerary ${id}:`, error);
          
          // Clear loading state
          set((state) => ({
            loading: { ...state.loading, [id]: false }
          }));
          
          return null;
        }
      },

      /**
       * Fetch an itinerary from the cloud by ID
       * Implementation placeholder - replace with actual API call
       */
      fetchItineraryFromCloud: async (id: string) => {
        try {
          const response = await fetch(`/api/itineraries/${id}`);
          
          if (!response.ok) {
            throw new Error(`Failed to fetch itinerary ${id}: ${response.statusText}`);
          }
          
          return await response.json() as ApiResponse;
        } catch (error) {
          console.error(`Cloud fetch error for itinerary ${id}:`, error);
          throw error;
        }
      }
    }),
    {
      name: 'itinerary-storage', // localStorage key
      partialize: (state) => ({
        itineraries: state.itineraries,
        activeItineraryId: state.activeItineraryId,
        itineraryData: state.itineraryData
      }),
    }
  )
);

/**
 * Hook to get the currently active itinerary
 * @returns {ApiResponse | null} The currently active itinerary or null if none is active
 */
export const useActiveItinerary = () => {
  return useItineraryStore((state) => {
    const { activeItineraryId, itineraries } = state;
    return activeItineraryId ? itineraries[activeItineraryId] || null : null;
  });
};

/**
 * Hook to get a list of all stored itineraries
 * @returns {{ id: string, data: ApiResponse }[]} Array of itinerary objects with their IDs
 */
export const useAllItineraries = () => {
  return useItineraryStore((state) => {
    const { itineraries } = state;
    return Object.entries(itineraries).map(([id, data]) => ({ id, data }));
  });
};

/**
 * Hook to get the current date/time and user information for new itineraries
 * @returns {{ currentDateTime: string, currentUser: string }} Current timestamp and user info
 */
export const useItineraryContext = () => {
  return {
    currentDateTime: "2025-05-14 15:44:57", // Using the provided timestamp
    currentUser: "abhisheksharm-3" // Using the provided user
  };
};