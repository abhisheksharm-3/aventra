import { getGeminiModel, isConfigured } from "./client";
import { getAutocompletePrompt } from "@/lib/prompts/autocomplete";

export interface AutocompleteOptions {
    maxResults?: number;
    temperature?: number;
}

export async function generateAutocompleteSuggestions(
    query: string,
    options: AutocompleteOptions = {}
): Promise<string[]> {
    if (!isConfigured()) {
        throw new Error("Gemini API key is not configured");
    }
    
    if (!query?.trim() || query.trim().length < 2) {
        return [];
    }
    
    try {
        const model = getGeminiModel();
        const prompt = getAutocompletePrompt(query, options);
        
        const result = await model.generateContent(prompt);
        const text = (await result.response).text();
        
        const completionsMatch = text.match(/\[([\s\S]*)\]/);
        if (!completionsMatch) return [];
        
        try {
            const completionsArray = JSON.parse(completionsMatch[0]);
            const maxResults = options.maxResults || 4;
            
            return completionsArray
                .filter((item: string) => item && typeof item === 'string')
                .map((item: string) => 
                    item.toLowerCase().startsWith(query.toLowerCase()) 
                        ? item 
                        : `${query} ${item}`
                )
                .slice(0, maxResults);
        } catch (e) {
            console.error("Failed to parse Gemini completions:", e);
            return [];
        }
    } catch (error) {
        console.error("Error generating autocomplete suggestions:", error);
        throw error;
    }
}
