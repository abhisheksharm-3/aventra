/* eslint-disable @typescript-eslint/no-unused-vars */
"use server"

import { Destination } from "@/types/dashboard";
import { getGeminiModel, isConfigured } from "./client";

/**
 * Interface for raw destination data returned from Gemini API
 */
interface RawDestinationData {
  id?: string;
  name: string;
  tagline: string;
  match?: number;
  imageQuery: string;
  [key: string]: unknown; // Allow for additional properties
}

/**
 * Fetches AI-recommended destinations based on user preferences
 * 
 * @param userPreferences - Optional string describing user preferences
 * @returns Array of destination recommendations
 */
export async function getRecommendedDestinations(
  userPreferences?: string
): Promise<Destination[]> {
  if (!isConfigured()) {
    console.warn("Gemini API not configured");
    return getSampleDestinations("recommendations");
  }

  try {
    const model = getGeminiModel();
    const preferences = userPreferences || "general travel destinations";

    const prompt = `You are a JSON API. Return ONLY valid JSON, no explanations, no markdown, no code blocks.

Based on these user preferences: ${preferences}, provide 3 personalized travel destination recommendations.

Return exactly this JSON structure:
[
  {
    "id": "unique-id-1",
    "name": "Destination Name, Country",
    "tagline": "Short catchy description of the destination (under 60 chars)",
    "match": 95,
    "imageQuery": "specific and detailed search query for this destination that will return high-quality images"
  },
  {
    "id": "unique-id-2",
    "name": "Destination Name, Country",
    "tagline": "Short catchy description of the destination (under 60 chars)",
    "match": 88,
    "imageQuery": "specific and detailed search query for this destination that will return high-quality images"
  },
  {
    "id": "unique-id-3",
    "name": "Destination Name, Country",
    "tagline": "Short catchy description of the destination (under 60 chars)",
    "match": 92,
    "imageQuery": "specific and detailed search query for this destination that will return high-quality images"
  }
]

IMPORTANT: Return ONLY the JSON array above. No text before or after. No markdown formatting. No code blocks.`;

    // Configure Gemini for JSON-only output
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.1, // Lower temperature for more consistent output
        topK: 1, // Most deterministic
        topP: 0.8,
        maxOutputTokens: 1024,
        responseMimeType: "application/json", // Force JSON response
      },
    });

    const response = result.response;
    const text = response.text().trim();
    
    // Parse and process the JSON response
    const destinations = parseGeminiResponse(text);
    
    // Validate we got valid destinations
    if (!destinations || destinations.length === 0) {
      throw new Error("No valid destinations returned from Gemini");
    }
    
    // Process the destinations
    return destinations.map((dest, index) => ({
      id: dest.id || `rec-${Date.now()}-${index}`,
      name: dest.name,
      tagline: dest.tagline,
      match: Math.min(Math.max(dest.match || 85, 70), 98), // Clamp between 70-98
      image: "", // Empty string - images will be fetched on client using useImages
      imageQuery: dest.imageQuery || `${dest.name} travel destination landmark`
    }));
  } catch (error) {
    console.error("Error fetching recommended destinations:", error);
    return getSampleDestinations("recommendations");
  }
}

/**
 * Fetches trending destinations according to current travel trends
 * 
 * @returns Array of trending destinations
 */
export async function getTrendingDestinations(): Promise<Destination[]> {
  if (!isConfigured()) {
    console.warn("Gemini API not configured");
    return getSampleDestinations("trending");
  }

  try {
    const model = getGeminiModel();

    const prompt = `You are a JSON API. Return ONLY valid JSON, no explanations, no markdown, no code blocks.

Provide 3 currently trending travel destinations worldwide.

Return exactly this JSON structure:
[
  {
    "id": "unique-id-1",
    "name": "Destination Name, Country",
    "tagline": "Short catchy description of why it's trending (under 60 chars)",
    "match": 85,
    "imageQuery": "specific and detailed search query for this destination that will return high-quality images"
  },
  {
    "id": "unique-id-2",
    "name": "Destination Name, Country",
    "tagline": "Short catchy description of why it's trending (under 60 chars)",
    "match": 78,
    "imageQuery": "specific and detailed search query for this destination that will return high-quality images"
  },
  {
    "id": "unique-id-3",
    "name": "Destination Name, Country",
    "tagline": "Short catchy description of why it's trending (under 60 chars)",
    "match": 91,
    "imageQuery": "specific and detailed search query for this destination that will return high-quality images"
  }
]

IMPORTANT: Return ONLY the JSON array above. No text before or after. No markdown formatting. No code blocks.`;

    // Configure Gemini for JSON-only output
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.1, // Lower temperature for more consistent output
        topK: 1, // Most deterministic
        topP: 0.8,
        maxOutputTokens: 1024,
        responseMimeType: "application/json", // Force JSON response
      },
    });

    const response = result.response;
    const text = response.text().trim();
    
    // Parse and process the JSON response
    const destinations = parseGeminiResponse(text);
    
    // Validate we got valid destinations
    if (!destinations || destinations.length === 0) {
      throw new Error("No valid destinations returned from Gemini");
    }
    
    // Process the destinations
    return destinations.map((dest, index) => ({
      id: dest.id || `trend-${Date.now()}-${index}`,
      name: dest.name,
      tagline: dest.tagline,
      match: Math.min(Math.max(dest.match || 85, 70), 95), // Clamp between 70-95
      image: "", // Empty string - images will be fetched on client using useImages
      imageQuery: dest.imageQuery || `${dest.name} travel destination landmark`
    }));
  } catch (error) {
    console.error("Error fetching trending destinations:", error);
    return getSampleDestinations("trending");
  }
}

/**
 * Parses the Gemini API response text to extract valid JSON
 * Enhanced with better error handling and fallback parsing
 */
function parseGeminiResponse(text: string): RawDestinationData[] {
  if (!text || text.trim().length === 0) {
    throw new Error("Empty response from Gemini");
  }

  const cleanText = text.trim();
  
  try {
    // Try direct parsing first
    const parsed = JSON.parse(cleanText);
    
    // Validate the structure
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    } else {
      throw new Error("Invalid JSON structure - not an array or empty");
    }
  } catch (err) {
    console.warn("Direct JSON parsing failed, attempting fallback methods");
    
    // Method 1: Try to extract JSON from markdown code blocks
    const jsonMatch = cleanText.match(/```(?:json)?\s*\n?([\s\S]*?)\n?```/);
    if (jsonMatch && jsonMatch[1]) {
      try {
        const parsed = JSON.parse(jsonMatch[1].trim());
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch (innerErr) {
        console.warn("Markdown extraction failed");
      }
    }
    
    // Method 2: Try to find JSON array in the text
    const arrayMatch = cleanText.match(/\[\s*\{[\s\S]*\}\s*\]/);
    if (arrayMatch) {
      try {
        const parsed = JSON.parse(arrayMatch[0]);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch (innerErr) {
        console.warn("Array extraction failed");
      }
    }
    
    // Method 3: Clean common formatting issues
    const cleanedText = cleanText
      .replace(/^[^[{]*/, '') // Remove text before JSON starts
      .replace(/[^}\]]*$/, '') // Remove text after JSON ends
      .replace(/,\s*}/g, '}') // Remove trailing commas
      .replace(/,\s*]/g, ']'); // Remove trailing commas in arrays
      
    try {
      const parsed = JSON.parse(cleanedText);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    } catch (finalErr) {
      console.error("All parsing methods failed:", {
        originalText: text,
        cleanedText: cleanedText,
        error: finalErr
      });
    }
    
    // If all else fails, throw an error
    throw new Error(`Failed to parse JSON from Gemini response: ${text.substring(0, 200)}...`);
  }
}

/**
 * Provides sample destinations in case of API failure
 */
function getSampleDestinations(type: 'recommendations' | 'trending'): Destination[] {
  if (type === 'recommendations') {
    return [
      {
        id: 'rec-1',
        name: 'Kyoto, Japan',
        tagline: 'Ancient temples amid spectacular seasonal colors',
        match: 96,
        image: '',
        imageQuery: 'Kyoto Japan temples autumn'
      },
      {
        id: 'rec-2',
        name: 'Santorini, Greece',
        tagline: 'Breathtaking sunsets over white-washed buildings',
        match: 91,
        image: '',
        imageQuery: 'Santorini Greece sunset white buildings'
      },
      {
        id: 'rec-3',
        name: 'Prague, Czech Republic',
        tagline: 'Fairy tale architecture and rich cultural experiences',
        match: 88,
        image: '',
        imageQuery: 'Prague Czech Republic Old Town architecture'
      },
      {
        id: 'rec-4',
        name: 'Reykjavik, Iceland',
        tagline: 'Northern lights and otherworldly landscapes',
        match: 84,
        image: '',
        imageQuery: 'Reykjavik Iceland northern lights'
      }
    ];
  } else {
    return [
      {
        id: 'trend-1',
        name: 'Lisbon, Portugal',
        tagline: 'Europe\'s hottest food and culture destination',
        match: 93,
        image: '',
        imageQuery: 'Lisbon Portugal viewpoint street'
      },
      {
        id: 'trend-2',
        name: 'Mexico City, Mexico',
        tagline: 'Vibrant street life and renowned culinary scene',
        match: 87,
        image: '',
        imageQuery: 'Mexico City historic center colorful'
      },
      {
        id: 'trend-3',
        name: 'Bali, Indonesia',
        tagline: 'Digital nomad paradise with stunning beaches',
        match: 90,
        image: '',
        imageQuery: 'Bali Indonesia rice terraces temple'
      },
      {
        id: 'trend-4',
        name: 'Dubai, UAE',
        tagline: 'Futuristic luxury meets traditional culture',
        match: 82,
        image: '',
        imageQuery: 'Dubai UAE skyline modern architecture'
      }
    ];
  }
}