import { AutocompleteOptions } from "@/lib/services/gemini/autocomplete-service";

/**
 * Generate a prompt template for autocomplete
 */
export function getAutocompletePrompt(query: string, options: AutocompleteOptions = {}): string {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { maxResults = 4, temperature = 0.2 } = options;
  
  return `
    You are a travel search autocomplete system that helps users plan their vacations.
    
    Given the current user input in a travel search box, predict what the user is trying to search for.
    Complete the following user query with ${maxResults} possible travel search completions.
    
    Enhance the query with interesting and specific travel-related completions.
    Be creative but relevant for travel planning.
    For instance, if the user types "beach", suggest specific beach destinations or activities.
    
    Return ONLY the completions as a JSON array of strings. Do not include any explanation or other text.
    
    Examples:
    - If the user types "mountain", you might return ["mountain retreats in Colorado", "mountain hiking in Switzerland", "mountain view resorts", "mountain towns in Japan"]
    - If the user types "Paris", you might return ["Paris food tour", "Paris landmarks in 2 days", "Paris to Nice train", "Paris luxury hotels"]
    
    Current user input: "${query}"
  `;
}