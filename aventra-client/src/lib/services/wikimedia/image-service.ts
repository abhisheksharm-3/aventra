"use server"

/**
 * Structure of the Wikimedia API response
 */
interface WikimediaResponse {
  query?: {
    pages?: Record<string, {
      title: string;
      imageinfo?: Array<{
        url: string;
      }>;
    }>;
  };
  error?: {
    code: string;
    info: string;
  };
}

/**
 * Cache entry structure
 */
interface CacheEntry {
  images: string[];
  timestamp: number;
}

/**
 * In-memory cache for Wikimedia API responses
 */
const WIKIMEDIA_CACHE: Map<string, CacheEntry> = new Map();

/**
 * Cache expiration time in milliseconds (4 hours)
 */
const CACHE_TTL = 4 * 60 * 60 * 1000;

/**
 * Request timeout in milliseconds (8 seconds)
 */
const REQUEST_TIMEOUT = 8000;

/**
 * Excluded terms for image filtering
 */
const EXCLUDED_TERMS = ['icon', 'logo'];

/**
 * Creates a cache key from destination and count
 * 
 * @param destination - Location name
 * @param count - Number of images requested
 * @returns Unique cache key
 */
const createCacheKey = (destination: string, count: number): string => 
  `${destination}:${count}`;

/**
 * Checks if an image should be filtered out
 * 
 * @param title - Image title
 * @returns True if the image should be excluded
 */
const shouldFilterImage = (title: string): boolean => {
  const lowerTitle = title.toLowerCase();
  return EXCLUDED_TERMS.some(term => lowerTitle.includes(term)) || 
         lowerTitle.endsWith('.svg');
};

/**
 * Creates a Wikimedia API URL with appropriate parameters
 * 
 * @param destination - Location to search for
 * @param count - Number of images requested
 * @returns Configured URL for the API request
 */
const buildApiUrl = (destination: string, count: number): URL => {
  const apiUrl = new URL('https://commons.wikimedia.org/w/api.php');
  const params = new URLSearchParams({
    'action': 'query',
    'generator': 'search',
    'gsrnamespace': '6', // File namespace
    'gsrsearch': `${encodeURIComponent(destination)} hastemplate:"Information"`,
    'gsrlimit': `${count * 3}`, // Request more to have some buffer
    'prop': 'imageinfo',
    'iiprop': 'url|size',
    'iiurlwidth': '800', // Get reasonably sized images
    'format': 'json'
  });

  // Add origin for browser environments
  if (typeof window !== 'undefined') {
    params.append('origin', '*');
  }
  
  apiUrl.search = params.toString();
  return apiUrl;
};

/**
 * Fetches destination images from Wikimedia Commons
 * 
 * @param destination - The location to find images for
 * @param count - Number of images to return (default: 1)
 * @returns Promise resolving to an array of image URLs
 * @throws Error if the API request fails
 */
export async function getWikimediaImages(
  destination: string,
  count: number = 1
): Promise<string[]> {
  if (!destination || count < 1) {
    return [];
  }
  
  const cacheKey = createCacheKey(destination, count);
  const cachedData = WIKIMEDIA_CACHE.get(cacheKey);
  const now = Date.now();
  
  // Return cached data if valid
  if (cachedData && (now - cachedData.timestamp) < CACHE_TTL) {
    return [...cachedData.images];
  }
  
  try {
    const apiUrl = buildApiUrl(destination, count);
    const images = await fetchImagesFromWikimedia(apiUrl, count);
    
    // Cache the results
    WIKIMEDIA_CACHE.set(cacheKey, {
      images: [...images],
      timestamp: now
    });
    
    return images;
  } catch (error) {
    console.error(`Error fetching images from Wikimedia: ${error}`);
    return [];
  }
}

/**
 * Makes the actual API request to Wikimedia and processes the response
 * 
 * @param apiUrl - Configured API URL
 * @param count - Number of images to return
 * @returns Promise resolving to array of image URLs
 */
async function fetchImagesFromWikimedia(apiUrl: URL, count: number): Promise<string[]> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);
  
  try {
    const response = await fetch(apiUrl.toString(), {
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'TravelApp/1.0'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }
    
    const data: WikimediaResponse = await response.json();
    
    if (data.error) {
      throw new Error(`API error: ${data.error.code}`);
    }
    
    if (!data.query?.pages) {
      return [];
    }
    
    return extractAndFilterImages(data, count);
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Extracts and filters image URLs from the API response
 * 
 * @param data - Parsed API response
 * @param count - Maximum number of images to return
 * @returns Array of filtered image URLs
 */
function extractAndFilterImages(data: WikimediaResponse, count: number): string[] {
  const pages = Object.values(data.query?.pages || {});
  
  return pages
    .filter(page => page.imageinfo?.[0]?.url && !shouldFilterImage(page.title))
    .map(page => page.imageinfo![0].url)
    .slice(0, count);
}

/**
 * Clears the Wikimedia image cache
 * 
 * @returns Promise that resolves when the cache is cleared
 */
export async function clearWikimediaCache(): Promise<void> {
  WIKIMEDIA_CACHE.clear();
}