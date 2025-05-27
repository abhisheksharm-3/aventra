"use server";
import { TrendingDestination } from "@/types/ai";
import { getGeminiModel, isConfigured } from "./client";
import { getDestinationImages } from "../unsplash/image-service";
import { getWikimediaImages } from "../wikimedia/image-service";

/**
 * Fetches AI-matched trending destinations based on user preferences
 * and selected destination.
 * 
 * @param currentDestination - The user's currently selected destination
 * @param preferences - User's travel preferences (optional)
 * @param tripType - Type of trip user is planning (optional)
 * @returns Array of trending destinations with match percentages
 */
export async function getTrendingDestinations(
  currentDestination?: string,
  preferences?: string[],
  tripType?: string
): Promise<TrendingDestination[]> {
  if (!isConfigured()) {
    return [];
  }

  try {
    const model = getGeminiModel();
    
    // Create structured prompt for Gemini
    const prompt = `
      Suggest 3-4 trending destinations similar to ${currentDestination || "popular destinations"}.
      ${preferences?.length ? `User preferences: ${preferences.join(', ')}.` : ''}
      ${tripType ? `Trip type: ${tripType}.` : ''}
      
      Return only valid JSON array with these fields for each destination:
      [
        {
          "name": "Full destination name with country",
          "tag": "One word category like Cultural, Beach, Adventure, Historical, Scenic, etc.",
          "image": "Leave empty as we'll use our own images",
          "match": "Compatibility score as integer between 75-98",
          "description": "Very brief 2-3 sentence description of why it matches"
        }
      ]
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Process the response to extract JSON
    let destinations: TrendingDestination[] = [];
    
    try {
      destinations = JSON.parse(text);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      // If direct parsing fails, try extracting JSON
      const jsonMatch = text.match(/\[([\s\S]*?)\]/);
      if (jsonMatch) {
        destinations = JSON.parse(`[${jsonMatch[1]}]`);
      } else {
        return [];
      }
    }
    
    // Fetch images for each destination using our multi-source approach
    const destinationsWithImages = await Promise.all(
      destinations.map(async (dest: TrendingDestination, index: number) => {
        try {
          // Try to get image from Unsplash first
          const unsplashImages = await getDestinationImages(dest.name, 1);
          
          // If Unsplash returned an image, use it
          if (unsplashImages && unsplashImages.length > 0) {
            return {
              ...dest,
              image: unsplashImages[0]
            };
          }
          
          // If Unsplash failed or returned no images, try Wikimedia
          const wikimediaImages = await getWikimediaImages(dest.name, 1);
          
          if (wikimediaImages && wikimediaImages.length > 0) {
            return {
              ...dest,
              image: wikimediaImages[0]
            };
          }
          
          // If both APIs failed or returned no images, use fallback
          return {
            ...dest,
            image: getFallbackImage(dest.name, index)
          };
        } catch (error) {
          console.error(`Error fetching image for ${dest.name}:`, error);
          // Use fallback image if APIs fail
          return {
            ...dest,
            image: getFallbackImage(dest.name, index)
          };
        }
      })
    );
    
    return destinationsWithImages;
  } catch (error) {
    console.error("Error fetching trending destinations:", error);
    return [];
  }
}

/**
 * Provides fallback images when both image APIs fail or return no results
 */
function getFallbackImage(destination: string, index: number): string {
  // Sample high-quality travel images
  const images = [
    "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e", // Kyoto
    "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff", // Santorini
    "https://images.unsplash.com/photo-1541849546-b5a5401bae6c", // Prague
    "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9", // Venice
    "https://images.unsplash.com/photo-1528702748617-c64d49f918af", // Bali
    "https://images.unsplash.com/photo-1512453979798-5ea266f8880c", // Dubai
    "https://images.unsplash.com/photo-1514565131-fce0801e5785", // Tokyo
  ];
  
  // First try to match by name (simplified)
  const lowerDest = destination.toLowerCase();
  if (lowerDest.includes('kyoto')) return images[0];
  if (lowerDest.includes('santorini')) return images[1];
  if (lowerDest.includes('prague')) return images[2];
  if (lowerDest.includes('venice')) return images[3];
  if (lowerDest.includes('bali')) return images[4];
  if (lowerDest.includes('dubai')) return images[5];
  if (lowerDest.includes('tokyo')) return images[6];
  
  // If no match, use index to pick an image, or cycle through
  return images[index % images.length];
}