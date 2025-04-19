import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { SearchState } from '@/types/searchStore';

// Max number of recent searches to store
const MAX_RECENT_SEARCHES = 10;
const MAX_LOCATION_SEARCHES = 8;

export const useSearchStore = create<SearchState>()(
  persist(
    (set) => ({
      searchQuery: '',
      filterOptions: {
        location: null,
        dateRange: null,
        groupSize: 2,
        regions: [],
        budget: null,
        travelStyle: [],
      },
      isGenerating: false,
      openDialog: null,
      recentSearches: [],
      recentLocationSearches: [], // New field for location searches
      
      setSearchQuery: (query) => set({ searchQuery: query }),
      setFilterOptions: (options) => set((state) => ({ 
        filterOptions: { ...state.filterOptions, ...options } 
      })),
      setIsGenerating: (isGenerating) => set({ isGenerating }),
      setOpenDialog: (dialog) => set({ openDialog: dialog }),
      resetFilters: () => set(() => ({ 
        filterOptions: {
          location: null,
          dateRange: null,
          groupSize: 2,
          regions: [],
          budget: null,
          travelStyle: [],
        }
      })),
      
      // General recent searches management
      addRecentSearch: (query) => set((state) => {
        // Don't add empty queries
        if (!query.trim()) return state;
        
        // Create a new array without the current query (to avoid duplicates)
        const filteredSearches = state.recentSearches.filter(
          (item) => item.toLowerCase() !== query.toLowerCase()
        );
        
        // Add the new query to the beginning and limit the array size
        return {
          recentSearches: [query, ...filteredSearches].slice(0, MAX_RECENT_SEARCHES)
        };
      }),
      
      removeRecentSearch: (query) => set((state) => ({
        recentSearches: state.recentSearches.filter(item => item !== query)
      })),
      
      clearRecentSearches: () => set({ recentSearches: [] }),
      
      // Location-specific recent searches management
      addRecentLocationSearch: (location) => set((state) => {
        // Don't add empty locations
        if (!location.trim()) return state;
        
        // Create a new array without the current location (to avoid duplicates)
        const filteredLocations = state.recentLocationSearches.filter(
          (item) => item.toLowerCase() !== location.toLowerCase()
        );
        
        // Add the new location to the beginning and limit the array size
        return {
          recentLocationSearches: [location, ...filteredLocations].slice(0, MAX_LOCATION_SEARCHES)
        };
      }),
      
      removeRecentLocationSearch: (location) => set((state) => ({
        recentLocationSearches: state.recentLocationSearches.filter(item => item !== location)
      })),
      
      clearRecentLocationSearches: () => set({ recentLocationSearches: [] }),
    }),
    {
      name: 'travel-search-storage',
      partialize: (state) => ({ 
        recentSearches: state.recentSearches,
        recentLocationSearches: state.recentLocationSearches // Add to persistence
      }),
    }
  )
);