"use server";

/**
 * Type definitions for Unsplash API responses
 */
interface UnsplashPhotoUrls {
  regular: string;
  small: string;
}

interface UnsplashPhoto {
  urls: UnsplashPhotoUrls;
  width: number;
  height: number;
}

interface UnsplashSearchResponse {
  results: UnsplashPhoto[];
  total: number;
}

/**
 * Cache for Unsplash API responses to reduce API calls and improve performance
 * Key: destination + count, Value: array of image URLs
 */
const UNSPLASH_CACHE = new Map<string, string[]>();

/**
 * Unsplash API access key from environment variables
 */
const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;

/**
 * Fetches destination images from Unsplash API
 * 
 * @param destination - The location to find images for
 * @param count - Number of images to return (default: 1)
 * @returns Promise resolving to array of image URLs
 */
export async function getDestinationImages(
  destination: string, 
  count: number = 1
): Promise<string[]> {
  // Return early if API key is not configured
  if (!UNSPLASH_ACCESS_KEY) {
    return [];
  }
  
  // Check cache before making API request
  const cacheKey = `${destination}:${count}`;
  if (UNSPLASH_CACHE.has(cacheKey)) {
    return UNSPLASH_CACHE.get(cacheKey) || [];
  }
  
  // Prepare search query with travel-related terms for better results
  const searchQuery = `${destination} travel landmark`;
  
  // Construct API URL
  const apiUrl = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(searchQuery)}&per_page=${Math.min(count * 2, 30)}&orientation=landscape`;
  
  try {
    // Use AbortController for timeout control
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5-second timeout
    
    const response = await fetch(apiUrl, {
      headers: {
        'Authorization': `Client-ID ${UNSPLASH_ACCESS_KEY}`,
        'Accept-Version': 'v1'
      },
      signal: controller.signal,
      next: { revalidate: 86400 } // Cache for 24 hours (Next.js fetch API)
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`Unsplash API error: ${response.status}`);
    }
    
    const data = await response.json() as UnsplashSearchResponse;
    
    // Extract and filter image URLs
    const imageUrls = data.results
      // Filter out very small or low-quality images
      .filter(photo => photo.width >= 800 && photo.height >= 600)
      .map(photo => photo.urls.regular);
    
    // Store in cache
    const result = imageUrls.slice(0, count);
    UNSPLASH_CACHE.set(cacheKey, result);
    
    return result;
  } catch (error) {
    console.error('Error fetching Unsplash images:', error);
    // Return empty array to allow fallback to other image services
    return [];
  }
}

/**
 * Cache management functions
 * Exported for testing and manual cache control
 */
export async function clearUnsplashCache(): Promise<void> {
  UNSPLASH_CACHE.clear();
}

export async function getCacheSize(): Promise<number> {
  return UNSPLASH_CACHE.size;
}