"use client";

import { useState, useEffect } from "react";
import { getLocationSuggestionsAction } from "@/lib/actions/location-suggestions";
//TODO: This code requires a refactor to use the new action pattern
export function useLocationSuggestions(input: string, debounceMs = 300) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Reset if input is too short
    if (!input || input.length < 2) {
      setSuggestions([]);
      setError(null);
      return;
    }

    const timeoutId = setTimeout(async () => {
      try {
        setLoading(true);
        setError(null);

        const { suggestions: newSuggestions, error: actionError } = 
          await getLocationSuggestionsAction(input);
        
        if (actionError) {
          setError(actionError);
        } else {
          setSuggestions(newSuggestions);
        }
      } catch (e) {
        console.error("Failed to fetch location suggestions:", e);
        setError("Something went wrong with location suggestions");
      } finally {
        setLoading(false);
      }
    }, debounceMs);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [input, debounceMs]);

  return { suggestions, loading, error };
}