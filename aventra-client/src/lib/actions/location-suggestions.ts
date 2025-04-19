"use server";

import { generateLocationSuggestions } from "../services/gemini/location-service";

export async function getLocationSuggestionsAction(query: string): Promise<{ 
    suggestions: string[], 
    error?: string 
}> {
    if (!query || query.length < 2) {
        return { suggestions: [] };
    }
    
    try {
        const suggestions = await generateLocationSuggestions(query, {
            maxResults: 5,
            temperature: 0.2,
        });
        
        return { suggestions };
    } catch (error) {
        console.error("Location suggestions action error:", error);
        return { 
            suggestions: [],
            error: "Failed to generate location suggestions"
        };
    }
}