/**
 * Options for the useAutocomplete hook
 */
export interface AutocompleteOptions {
  /** Minimum length of input before suggestions are fetched */
  minLength?: number;
  /** Debounce time in milliseconds */
  debounceMs?: number;
  /** Maximum number of cached queries */
  cacheSize?: number;
  /** Whether to enable caching */
  enableCache?: boolean;
  /** Custom filter function for suggestions */
  filterFn?: (suggestions: string[]) => string[];
  /** Sort suggestions alphabetically */
  sortAlphabetically?: boolean;
  /** Remove duplicates from suggestions */
  removeDuplicates?: boolean;
}

/**
 * Result from the useAutocomplete hook
 */
export interface AutocompleteResult {
  /** Array of suggestion strings */
  suggestions: string[];
  /** Whether suggestions are currently being loaded */
  loading: boolean;
  /** Error message if something went wrong */
  error: string | null;
  /** Clear current suggestions */
  clearSuggestions: () => void;
  /** Refresh suggestions (bypassing debounce) */
  refresh: () => Promise<void>;
  /** Last successful query string */
  lastSuccessfulQuery: string | null;
}

/**
 * Cache entry type
 */
export interface CacheEntry {
  timestamp: number;
  suggestions: string[];
}

/**
 * Interface for location suggestion item
 * Can be extended if location suggestions have more properties in the future
 */
export interface LocationSuggestion {
  name: string;
  id?: string;
  type?: string;
  region?: string;
  country?: string;
}

/**
 * Options for the useLocationSuggestions hook
 */
export interface LocationSuggestionsOptions {
  /** Minimum length of input before suggestions are fetched */
  minLength?: number;
  /** Debounce time in milliseconds */
  debounceMs?: number;
  /** Maximum number of cached queries */
  cacheSize?: number;
  /** Cache expiration in minutes */
  cacheExpiration?: number;
  /** Whether to enable caching */
  enableCache?: boolean;
  /** Sort suggestions by relevance */
  sortByRelevance?: boolean;
  /** Filter function for suggestions */
  filter?: (suggestions: string[]) => string[];
}

/**
 * Result from the useLocationSuggestions hook
 */
export interface LocationSuggestionsResult {
  /** Array of location suggestion strings */
  suggestions: string[];
  /** Whether suggestions are currently being loaded */
  loading: boolean;
  /** Error message if something went wrong */
  error: string | null;
  /** Clear current suggestions */
  clearSuggestions: () => void;
  /** Manually refresh suggestions (bypasses debounce) */
  refresh: () => Promise<void>;
}