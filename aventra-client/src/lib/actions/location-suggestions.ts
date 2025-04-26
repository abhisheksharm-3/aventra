"use server";

import { generateLocationSuggestions, LocationSuggestionOptions } from "@/lib/services/gemini/location-service";

interface LocationSuggestionsActionResult {
  suggestions: string[];
  error: string | null;
}

export async function getLocationSuggestionsAction(
  query: string,
  options: LocationSuggestionOptions = {}
): Promise<LocationSuggestionsActionResult> {
  if (!query || query.length < 2) {
    return { suggestions: [], error: null };
  }

  try {
    const suggestions = await generateLocationSuggestions(query, options);
    return { suggestions, error: null };
  } catch (error) {
    console.error("Location suggestions action error:", error);
    return { 
      suggestions: [], 
      error: error instanceof Error ? error.message : "Failed to get location suggestions" 
    };
  }
}