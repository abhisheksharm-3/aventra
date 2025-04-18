import { FilterOptions } from "./hero";

export interface SearchState {
    searchQuery: string;
    filterOptions: FilterOptions;
    isGenerating: boolean;
    openDialog: string | null;
    recentSearches: string[];
    
    // Actions
    setSearchQuery: (query: string) => void;
    setFilterOptions: (options: Partial<FilterOptions>) => void;
    setIsGenerating: (isGenerating: boolean) => void;
    setOpenDialog: (dialog: string | null) => void;
    resetFilters: () => void;
    
    // Recent searches actions
    addRecentSearch: (query: string) => void;
    removeRecentSearch: (query: string) => void;
    clearRecentSearches: () => void;
  }