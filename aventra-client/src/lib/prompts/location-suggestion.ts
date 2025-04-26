import { LocationSuggestionOptions } from "../services/gemini/location-service";

/**
 * Generates a prompt specifically for location suggestions
 * Enhanced to handle both residential and tourist locations
 */
export function getLocationSuggestionsPrompt(query: string, options: LocationSuggestionOptions): string {
    const temperature = options.temperature !== undefined ? options.temperature : 0.2;
    const locationType = options.locationType || "all"; // Default to all types
    
    let locationTypePrompt = "";
    
    switch (locationType) {
        case "residential":
            locationTypePrompt = `
            Focus on residential cities, towns, and regions where people live.
            Prioritize major population centers and important residential locations.
            Include smaller cities and towns if they match the query closely.
            Avoid tourist-specific locations like landmarks or attractions unless it is very likely that query matches that.
            `;
            break;
            
        case "tourist":
            locationTypePrompt = `
            Focus on popular travel destinations, tourist attractions, and vacation spots.
            Prioritize locations known for tourism and places people commonly visit for leisure.
            Include scenic destinations, cultural sites, and recreational areas.
            `;
            break;
            
        case "all":
        default:
            locationTypePrompt = `
            Include both residential locations (cities, towns) and tourist destinations.
            Balance your suggestions between major population centers and popular travel spots.
            Prioritize locations that best match the user's query regardless of type.
            `;
            break;
    }
    
    return `
    You are a location assistant that helps users find places around the world.
    
    Please generate a list of locations based on the user's input: "${query}"
    
    ${locationTypePrompt}
    
    Rules:
    - Provide ONLY real locations that exist
    - Include specific places with proper formatting (City, State/Province, Country where appropriate)
    - Format as a valid JSON array of strings
    - Return ONLY the JSON array, nothing else
    - Include 5-7 suggestions maximum
    - Ensure suggestions are diverse but relevant to the query
    - For ambiguous inputs, provide a mix of interpretations
    - Include population centers of all sizes that match the query
    
    Example response format:
    ["Paris, France", "Barcelona, Spain", "Prague, Czech Republic"]
    
    Temperature: ${temperature}
    `;
}