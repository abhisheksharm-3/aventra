import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { SearchState } from '@/types/searchStore';


// Max number of recent searches to store
const MAX_RECENT_SEARCHES = 10;

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
      
      setSearchQuery: (query) => set({ searchQuery: query }),
      setFilterOptions: (options) => set((state) => ({ 
        filterOptions: { ...state.filterOptions, ...options } 
      })),
      setIsGenerating: (isGenerating) => set({ isGenerating }),
      setOpenDialog: (dialog) => set({ openDialog: dialog }),
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      resetFilters: () => set((state) => ({ 
        filterOptions: {
          location: null,
          dateRange: null,
          groupSize: 2,
          regions: [],
          budget: null,
          travelStyle: [],
        }
      })),
      
      // Recent searches management
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
        recentSearches: state.recentSearches.filter(
          (item) => item !== query
        )
      })),
      
      clearRecentSearches: () => set({ recentSearches: [] }),
    }),
    {
      name: 'travel-search-storage',
      partialize: (state) => ({ 
        recentSearches: state.recentSearches 
      }),
    }
  )
);