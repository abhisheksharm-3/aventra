import { getLocationSuggestionsPrompt } from "@/lib/prompts/location-suggestion";
import { getGeminiModel, isConfigured } from "./client";

export interface LocationSuggestionOptions {
    maxResults?: number;
    temperature?: number;
}

/**
 * Generates location-specific autocomplete suggestions using Gemini
 * Focuses specifically on cities, countries, and tourist destinations
 */
export async function generateLocationSuggestions(
    query: string,
    options: LocationSuggestionOptions = {}
): Promise<string[]> {
    if (!isConfigured()) {
        throw new Error("Gemini API key is not configured");
    }
    
    if (!query?.trim() || query.trim().length < 2) {
        return [];
    }
    
    try {
        const model = getGeminiModel();
        const prompt = getLocationSuggestionsPrompt(query, options);
        
        const result = await model.generateContent(prompt);
        const text = (await result.response).text();
        
        const suggestionsMatch = text.match(/\[([\s\S]*)\]/);
        if (!suggestionsMatch) return [];
        
        try {
            const suggestionsArray = JSON.parse(suggestionsMatch[0]);
            const maxResults = options.maxResults || 5;
            
            return suggestionsArray
                .filter((item: string) => item && typeof item === 'string')
                .slice(0, maxResults);
        } catch (e) {
            console.error("Failed to parse Gemini location suggestions:", e);
            return [];
        }
    } catch (error) {
        console.error("Error generating location suggestions:", error);
        throw error;
    }
}