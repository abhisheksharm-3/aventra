/**
 * Service to fetch destination images from Unsplash API
 */
"use server";
// Unsplash API access key should be set in your environment variables
const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;

// Define interfaces for Unsplash API response
interface UnsplashPhotoUrls {
  regular: string;
}

interface UnsplashPhoto {
  urls: UnsplashPhotoUrls;
}

interface UnsplashSearchResponse {
  results: UnsplashPhoto[];
}

/**
 * Fetches destination images from Unsplash
 * 
 * @param destination - The location to find images for
 * @param count - Number of images to return
 * @returns Array of image URLs
 */
export async function getDestinationImages(
  destination: string, 
  count: number = 1
): Promise<string[]> {
  if (!UNSPLASH_ACCESS_KEY) {
    console.warn('Unsplash API key not configured');
    return getPlaceholderImages(destination, count);
  }
  
  const searchQuery = `${destination} travel landmark tourism`;
  const apiUrl = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(searchQuery)}&per_page=${count}&orientation=landscape`;
  
  try {
    const response = await fetch(apiUrl, {
      headers: {
        'Authorization': `Client-ID ${UNSPLASH_ACCESS_KEY}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`Unsplash API error: ${response.status}`);
    }
    
    const data = await response.json() as UnsplashSearchResponse;
    return data.results.map((photo: UnsplashPhoto) => photo.urls.regular);
  } catch (error) {
    console.error('Error fetching Unsplash images:', error);
    return getPlaceholderImages(destination, count);
  }
}

/**
 * Provides fallback images when Unsplash API is unavailable
 */
function getPlaceholderImages(destination: string, count: number): string[] {
  // High-quality travel destination images
  const destinationMap: Record<string, string> = {
    'kyoto': 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e',
    'tokyo': 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26',
    'paris': 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34',
    'santorini': 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff',
    'rome': 'https://images.unsplash.com/photo-1552832230-c0197dd311b5',
    'new york': 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9',
    'prague': 'https://images.unsplash.com/photo-1541849546-b5a5401bae6c',
  };
  
  const defaultImages = [
    'https://images.unsplash.com/photo-1528702748617-c64d49f918af', // Bali
    'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9', // Venice
    'https://images.unsplash.com/photo-1530841377377-3ff06c0ca713', // Generic destination
    'https://images.unsplash.com/photo-1500835556837-99ac94a94552', // Generic travel
    'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1', // Mountains
  ];
  
  // Try to find matching destination images
  const lowerDest = destination.toLowerCase();
  const matchedImage = Object.keys(destinationMap).find(key => 
    lowerDest.includes(key)
  );
  
  if (matchedImage) {
    return [destinationMap[matchedImage], ...defaultImages].slice(0, count);
  }
  
  return defaultImages.slice(0, count);
}