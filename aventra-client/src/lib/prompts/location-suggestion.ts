import { LocationSuggestionOptions } from "../services/gemini/location-service";

/**
 * Generates a prompt specifically for location suggestions
 */
export function getLocationSuggestionsPrompt(query: string, options: LocationSuggestionOptions): string {
    const temperature = options.temperature !== undefined ? options.temperature : 0.2;
    
    return `
    You are a travel assistant that helps users find destinations for their trips.
    
    Please generate a list of travel destinations (cities, countries, regions, or tourist spots) 
    that would be relevant based on the user's input: "${query}"
    
    If the input appears to be the start of a location name, complete it and suggest similar alternatives.
    If it's a descriptive request (like "beach destinations"), suggest specific locations matching that criteria.
    
    Rules:
    - Provide ONLY real locations that exist as travel destinations
    - Include specific places, not generic terms
    - Format as a valid JSON array of strings
    - Return ONLY the JSON array, nothing else
    - Include 5-7 suggestions maximum
    - Ensure suggestions are diverse but relevant to the query
    - For ambiguous inputs, provide a mix of interpretations
    
    Example response format:
    ["Paris, France", "Barcelona, Spain", "Prague, Czech Republic"]
    
    Temperature: ${temperature}
    `;
}