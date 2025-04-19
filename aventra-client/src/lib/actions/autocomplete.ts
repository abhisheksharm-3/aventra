"use server";

import { generateAutocompleteSuggestions } from "../services/gemini/autocomplete-service";

export async function getAutocompleteAction(query: string): Promise<{ 
    suggestions: string[], 
    error?: string 
}> {
    if (!query || query.length < 2) {
        return { suggestions: [] };
    }
    
    try {
        const suggestions = await generateAutocompleteSuggestions(query, {
            maxResults: 5,
            temperature: 0.3,
        });
        
        return { suggestions };
    } catch (error) {
        console.error("Autocomplete action error:", error);
        return { 
            suggestions: [],
            error: "Failed to generate suggestions"
        };
    }
}
