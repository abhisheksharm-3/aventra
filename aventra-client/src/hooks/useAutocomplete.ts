"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { getAutocompleteAction } from "@/lib/actions/autocomplete";
import { AutocompleteOptions, AutocompleteResult, CacheEntry } from "@/types/hooks";

/**
 * React hook for fetching autocomplete suggestions based on user input
 * 
 * @param input - The current input string to get suggestions for
 * @param options - Configuration options
 * @returns AutocompleteResult object with suggestions and status
 * 
 * @example
 * ```tsx
 * const { suggestions, loading, error } = useAutocomplete(searchQuery, {
 *   minLength: 2,
 *   debounceMs: 300
 * });
 * ```
 */
export function useAutocomplete(
  input: string, 
  options: AutocompleteOptions = {}
): AutocompleteResult {
  const {
    minLength = 2,
    debounceMs = 300,
    cacheSize = 30,
    enableCache = true,
    filterFn,
    sortAlphabetically = false,
    removeDuplicates = true,
  } = options;

  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastSuccessfulQuery, setLastSuccessfulQuery] = useState<string | null>(null);

  // Use refs for values that shouldn't trigger re-renders
  const cache = useRef<Map<string, CacheEntry>>(new Map());
  const abortControllerRef = useRef<AbortController | null>(null);
  const isMounted = useRef(true);

  // Clear suggestions
  const clearSuggestions = useCallback(() => {
    setSuggestions([]);
    setError(null);
  }, []);

  // Process suggestions through filters
  const processSuggestions = useCallback((items: string[]): string[] => {
    let processed = [...items];
    
    // Apply custom filter if provided
    if (filterFn) {
      processed = filterFn(processed);
    }
    
    // Remove duplicates
    if (removeDuplicates) {
      processed = [...new Set(processed)];
    }
    
    // Sort alphabetically
    if (sortAlphabetically) {
      processed.sort((a, b) => a.localeCompare(b));
    }
    
    return processed;
  }, [filterFn, removeDuplicates, sortAlphabetically]);

  // Fetch suggestions (can be called to bypass debounce)
  const fetchSuggestions = useCallback(async (query: string) => {
    if (!query || query.length < minLength) {
      clearSuggestions();
      return;
    }
    
    // Check cache first
    if (enableCache) {
      const cachedResult = cache.current.get(query);
      if (cachedResult) {
        setSuggestions(processSuggestions(cachedResult.suggestions));
        return;
      }
    }
    
    try {
      setLoading(true);
      setError(null);
      
      // Cancel previous request if exists
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      
      // Create new abort controller
      abortControllerRef.current = new AbortController();
      
      // Add signal to options if server action supports it
      const { suggestions: newSuggestions, error: actionError } = 
        await getAutocompleteAction(query);
      
      // Check if component is still mounted
      if (!isMounted.current) return;
      
      if (actionError) {
        setError(actionError);
        setSuggestions([]);
      } else {
        const processedSuggestions = processSuggestions(newSuggestions);
        setSuggestions(processedSuggestions);
        setLastSuccessfulQuery(query);
        
        // Update cache
        if (enableCache) {
          // Manage cache size
          if (cache.current.size >= cacheSize) {
            const oldestKey = cache.current.keys().next().value;
            if (oldestKey !== undefined) {
              cache.current.delete(oldestKey);
            }
          }
          
          cache.current.set(query, {
            timestamp: Date.now(),
            suggestions: newSuggestions
          });
        }
      }
    } catch (e) {
      // Check if this is an abort error, if so we can ignore it
      if (e instanceof DOMException && e.name === 'AbortError') {
        return;
      }
      
      if (!isMounted.current) return;
      
      console.error("Failed to fetch autocomplete suggestions:", e);
      setError("Failed to load suggestions. Please try again.");
      setSuggestions([]);
    } finally {
      if (isMounted.current) {
        setLoading(false);
        abortControllerRef.current = null;
      }
    }
  }, [minLength, enableCache, cacheSize, processSuggestions, clearSuggestions]);

  // Public refresh method (bypasses debounce)
  const refresh = useCallback(async () => {
    if (input && input.length >= minLength) {
      await fetchSuggestions(input);
    }
  }, [input, minLength, fetchSuggestions]);

  // Main effect for handling input changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchSuggestions(input);
    }, debounceMs);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [input, debounceMs, fetchSuggestions]);

  // Cleanup effect
  useEffect(() => {
    return () => {
      isMounted.current = false;
      
      // Abort any in-flight requests
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return { 
    suggestions, 
    loading, 
    error, 
    clearSuggestions, 
    refresh,
    lastSuccessfulQuery 
  };
}