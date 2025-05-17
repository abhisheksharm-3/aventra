"use server"
import { DestinationInsight } from "@/types/ai";
import { getGeminiModel, isConfigured } from "./client";

export async function getDestinationTips(
  destination: string,
  tripType?: string,
  budget?: string
): Promise<DestinationInsight | null> {
  if (!isConfigured() || !destination) {
    return null;
  }

  try {
    const model = getGeminiModel();
    
    // Create structured prompt for Gemini
    const prompt = `
      Provide travel insights about ${destination} in JSON format.
      ${tripType ? `The trip type is: ${tripType}.` : ''}
      ${budget ? `The budget is approximately: ${budget}.` : ''}
      
      Return only valid JSON with these fields:
      {
        "bestTimeToVisit": "brief information on best seasons to visit",
        "localCuisine": "brief highlight of must-try local food",
        "tips": [
          {
            "title": "short tip title",
            "description": "detailed tip up to 100 characters",
            "category": "one of: local-customs, safety, budget, experience, seasonal"
          }
        ],
        "uniqueExperiences": ["brief experience 1", "brief experience 2", "brief experience 3"]
      }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Extract JSON from the response
    const jsonMatch = text.match(/```json\n?([\s\S]*?)```|(\{[\s\S]*\})/);
    if (jsonMatch) {
      const jsonContent = jsonMatch[1] || jsonMatch[2];
      return JSON.parse(jsonContent);
    }
    
    // If no JSON format was found, try direct parsing
    return JSON.parse(text);
  } catch (error) {
    console.error("Error fetching destination tips:", error);
    return null;
  }
}

export async function getDestinationSuggestions(
  preferences: string,
  budget?: string,
  season?: string
): Promise<string[]> {
  if (!isConfigured()) {
    return [];
  }

  try {
    const model = getGeminiModel();
    
    const prompt = `
      Suggest 5 travel destinations based on these preferences: ${preferences}.
      ${budget ? `The budget is: ${budget}.` : ''}
      ${season ? `The travel season is: ${season}.` : ''}
      
      Return only a JSON array of strings with destination names, no additional explanation.
      Example: ["Paris, France", "Kyoto, Japan", "Cape Town, South Africa", "Banff, Canada", "Santorini, Greece"]
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    try {
      return JSON.parse(text);
    } catch {
      // If direct parsing fails, try extracting JSON
      const jsonMatch = text.match(/\[([\s\S]*?)\]/);
      if (jsonMatch) {
        return JSON.parse(`[${jsonMatch[1]}]`);
      }
      return [];
    }
  } catch (error) {
    console.error("Error fetching destination suggestions:", error);
    return [];
  }
}