import { FilterOptions } from "./hero";


export interface SearchState {
  searchQuery: string;
  filterOptions: FilterOptions;
  isGenerating: boolean;
  openDialog: string | null;
  recentSearches: string[];
  recentLocationSearches: string[]; // New field for location searches
  
  setSearchQuery: (query: string) => void;
  setFilterOptions: (options: Partial<FilterOptions>) => void;
  setIsGenerating: (isGenerating: boolean) => void;
  setOpenDialog: (dialog: string | null) => void;
  resetFilters: () => void;
  
  // General search history management
  addRecentSearch: (query: string) => void;
  removeRecentSearch: (query: string) => void;
  clearRecentSearches: () => void;
  
  // Location-specific search history management
  addRecentLocationSearch: (location: string) => void;
  removeRecentLocationSearch: (location: string) => void;
  clearRecentLocationSearches: () => void;
}