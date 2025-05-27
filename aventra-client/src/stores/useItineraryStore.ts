"use client";

/**
 * @module stores/useItineraryStore
 * @description A global store for managing itinerary data with multi-itinerary support and cloud synchronization
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { GeneratedItineraryResponse } from '@/types/itinerary';
import { saveItinerary, getItinerary as fetchItineraryById } from '@/controllers/ItineraryController';

// Current defaults for new itineraries
const CURRENT_DATETIME = "2025-05-15 14:36:36"; // Updated timestamp
const CURRENT_USER = "abhisheksharm-3"; // Current user

/**
 * Extended store state for managing multiple itineraries
 * @interface ExtendedItineraryState
 */
export interface ExtendedItineraryState {
  /** Map of itineraries indexed by their IDs */
  itineraries: Record<string, GeneratedItineraryResponse>;
  /** Currently active/selected itinerary ID */
  activeItineraryId: string | null;
  /** Status of API requests for itineraries */
  loading: Record<string, boolean>;
  /** Cloud synchronization status */
  cloudSaving: Record<string, boolean>;
  /** Currently selected itinerary data (single itinerary mode) */
  itineraryData: GeneratedItineraryResponse | null;

  /**
   * Set the data for a specific itinerary by ID and sync to cloud
   * @param {GeneratedItineraryResponse} data - The itinerary data to store
   * @param {string} [id] - Optional ID (uses data.id if not provided)
   * @param {boolean} [skipCloudSync] - Whether to skip cloud synchronization
   */
  setItineraryData: (data: GeneratedItineraryResponse, id?: string, skipCloudSync?: boolean) => void;

  /**
   * Save an itinerary to the cloud
   * @param {string} id - The ID of the itinerary to save to cloud
   * @returns {Promise<boolean>} Whether the save was successful
   */
  saveItineraryToCloud: (id: string) => Promise<boolean>;

  /**
   * Set the currently active itinerary
   * @param {string} id - The ID of the itinerary to set as active
   */
  setActiveItinerary: (id: string) => void;

  /**
   * Remove a specific itinerary from the store and cloud if needed
   * @param {string} id - The ID of the itinerary to remove
   * @param {boolean} [removeFromCloud] - Whether to also delete from cloud
   * @returns {Promise<boolean>} Whether the removal was successful
   */
  removeItinerary: (id: string, removeFromCloud?: boolean) => Promise<boolean>;

  /**
   * Clear all itineraries from the store
   */
  clearItineraryData: () => void;

  /**
   * Get an itinerary by ID, fetching from cloud if not in store
   * @param {string} id - The ID of the itinerary to retrieve
   * @returns {Promise<GeneratedItineraryResponse | null>} The requested itinerary or null
   */
  getItinerary: (id: string) => Promise<GeneratedItineraryResponse | null>;

  /**
   * Fetch an itinerary from the cloud by ID
   * @param {string} id - The ID of the itinerary to fetch
   * @returns {Promise<GeneratedItineraryResponse>} The fetched itinerary
   */
  fetchItineraryFromCloud: (id: string) => Promise<GeneratedItineraryResponse>;
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
      cloudSaving: {},
      itineraryData: null,

      /**
       * Set the data for a specific itinerary
       * Also updates the single-itinerary view for backward compatibility
       */
      setItineraryData: (data: GeneratedItineraryResponse, id?: string, skipCloudSync = false) => {
        const itineraryId = id || data.id;
        
        if (!itineraryId) {
          console.error("Cannot set itinerary data without an ID");
          return;
        }
        
        // Include current timestamp and user if not present
        const enrichedData = {
          ...data,
          currentDateTime: data.currentDateTime || CURRENT_DATETIME,
          currentUser: data.currentUser || CURRENT_USER
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

        // Sync to cloud if needed (after local save is complete)
        if (!skipCloudSync) {
          // Use setTimeout to ensure this runs after the state update is committed
          setTimeout(() => {
            get().saveItineraryToCloud(itineraryId);
          }, 0);
        }
      },

      /**
       * Save an itinerary to the cloud
       */
      saveItineraryToCloud: async (id: string) => {
        const { itineraries, cloudSaving } = get();
        const itinerary = itineraries[id];
        
        if (!itinerary) {
          console.error(`Cannot save itinerary ${id} to cloud: not found in store`);
          return false;
        }
        
        // Prevent duplicate saves
        if (cloudSaving[id]) {
          console.log(`Itinerary ${id} is already being saved to the cloud`);
          return false;
        }
        
        // Mark as saving
        set((state) => ({
          cloudSaving: { ...state.cloudSaving, [id]: true }
        }));
        
        try {
          // Call the server action to save to Appwrite
          const result = await saveItinerary(itinerary);
          
          // Update cloud saving state
          set((state) => ({
            cloudSaving: { ...state.cloudSaving, [id]: false }
          }));
          
          if (!result.success) {
            console.error(`Failed to save itinerary ${id} to cloud:`, result.error);
            return false;
          }
          
          // If server generated a new ID, update our local reference
          if (result.tripId && result.tripId !== id) {
            console.log(`Server assigned new ID ${result.tripId} to itinerary ${id}`);
            
            // Fix: Create properly typed updated itinerary
            const updatedItinerary: GeneratedItineraryResponse = {
              ...itinerary,
              id: result.tripId
            };
            
            // Ensure tripId is a string to be used as an object key
            const newId = result.tripId as string;
            
            set((state) => {
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              const { [id]: oldItinerary, ...restItineraries } = state.itineraries;
              
              // Fixed return type to match ExtendedItineraryState's partial structure
              return {
                itineraries: {
                  ...restItineraries,
                  [newId]: updatedItinerary
                },
                activeItineraryId: state.activeItineraryId === id ? newId : state.activeItineraryId,
                itineraryData: state.itineraryData?.id === id ? updatedItinerary : state.itineraryData
              };
            });
          }
          
          return true;
        } catch (error) {
          console.error(`Error saving itinerary ${id} to cloud:`, error);
          
          // Reset cloud saving state
          set((state) => ({
            cloudSaving: { ...state.cloudSaving, [id]: false }
          }));
          
          return false;
        }
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
      removeItinerary: async (id: string, removeFromCloud = false) => {
        const { itineraries } = get();
        
        // Check if itinerary exists
        if (!itineraries[id]) {
          console.warn(`Attempted to remove non-existent itinerary ${id}`);
          return false;
        }
        
        // Delete from cloud if requested
        if (removeFromCloud) {
          try {
            // TODO: Implement cloud deletion API call
            // const result = await deleteItinerary(id);
            // if (!result.success) {
            //   console.error(`Failed to delete itinerary ${id} from cloud:`, result.error);
            //   return false;
            // }
          } catch (error) {
            console.error(`Error deleting itinerary ${id} from cloud:`, error);
            return false;
          }
        }
        
        // Remove from local store
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
        
        return true;
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
       * Fetch an itinerary from the cloud by ID using the server action
       */
      fetchItineraryFromCloud: async (id: string) => {
        try {
          // Call the server action to fetch from Appwrite
          const result = await fetchItineraryById(id);
          
          if (!result.success || !result.itinerary) {
            throw new Error(`Failed to fetch itinerary ${id}: ${result.error || 'Unknown error'}`);
          }
          
          return result.itinerary;
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
 * @returns {GeneratedItineraryResponse | null} The currently active itinerary or null if none is active
 */
export const useActiveItinerary = () => {
  return useItineraryStore((state) => {
    const { activeItineraryId, itineraries } = state;
    return activeItineraryId ? itineraries[activeItineraryId] || null : null;
  });
};

/**
 * Hook to get a list of all stored itineraries
 * @returns {{ id: string, data: GeneratedItineraryResponse }[]} Array of itinerary objects with their IDs
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
export const useCurrentContext = () => {
  return {
    currentDateTime: CURRENT_DATETIME,
    currentUser: CURRENT_USER
  };
};