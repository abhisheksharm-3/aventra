import { useState, useEffect, useRef, useCallback } from 'react';
import { getDestinationImages } from '@/lib/services/unsplash/image-service';
import { getWikimediaImages } from '@/lib/services/wikimedia/image-service';

/**
 * Response interface for the useImages hook
 */
interface UseImagesReturn {
  /** Array of verified working image URLs */
  images: string[];
  /** Loading state indicator */
  loading: boolean;
  /** Error object if any error occurred, null otherwise */
  error: Error | null;
}

// Cache for storing previously fetched and verified images
const imageCache = new Map<string, string[]>();

// Cache for storing URL validation results to avoid repeated checks
const validationCache = new Map<string, boolean>();

/**
 * Checks if an image URL is valid and accessible
 * 
 * @param url - Image URL to validate
 * @returns Promise that resolves to boolean indicating if URL is valid
 */
export async function isImageUrlValid(url: string): Promise<boolean> {
  // Return cached result if available
  if (validationCache.has(url)) {
    return validationCache.get(url) as boolean;
  }
  
  try {
    // Use fetch with HEAD method to check if URL is accessible
    // This is more efficient than loading the entire image
    const response = await fetch(url, { 
      method: 'HEAD',
      // Short timeout to avoid long waits for inaccessible images
      signal: AbortSignal.timeout(3000)
    });
    
    const isValid = response.ok;
    // Cache the validation result
    validationCache.set(url, isValid);
    return isValid;
  } catch (err) {
    console.error(`Error validating image URL "${url}":`, err);
    // Cache negative result
    validationCache.set(url, false);
    return false;
  }
}

/**
 * Filters an array of image URLs to only include valid, accessible images
 * 
 * @param urls - Array of image URLs to validate
 * @returns Promise resolving to array of valid image URLs
 */
async function filterValidImageUrls(urls: string[]): Promise<string[]> {
  if (!urls.length) return [];
  
  // Check all URLs in parallel
  const validationResults = await Promise.allSettled(
    urls.map(url => isImageUrlValid(url))
  );
  
  // Filter the original URLs to include only those that passed validation
  return urls.filter((url, index) => {
    const result = validationResults[index];
    return result.status === 'fulfilled' && result.value === true;
  });
}

/**
 * React hook that fetches destination images from multiple sources.
 * Uses a fallback strategy and validates all image URLs before returning.
 *
 * @param location - The destination location name to fetch images for
 * @param count - Number of images to return (default: 1)
 * @returns Object containing verified images array, loading state, and any error
 */
export function useImages(location: string | undefined, count: number = 1): UseImagesReturn {
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  
  // Use ref to track component mounting state
  const isMounted = useRef(true);
  
  // Track the current request
  const abortControllerRef = useRef<AbortController | null>(null);

  // Generate a cache key based on location and count
  const cacheKey = `${location}:${count}`;

  /**
   * Fetch and validate images from multiple sources with fallback strategy
   */
  const fetchImages = useCallback(async () => {
    if (!location) return;
    
    // Check cache first
    if (imageCache.has(cacheKey)) {
      setImages(imageCache.get(cacheKey) || []);
      return;
    }
    
    // Create new abort controller for this request
    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;
    
    setLoading(true);
    
    try {
      // Try Unsplash first
      const unsplashImages = await getDestinationImages(location, Math.max(count * 2, 5));
      
      if (!isMounted.current || signal.aborted) return;
      
      // Validate Unsplash images and keep only working ones
      const validUnsplashImages = await filterValidImageUrls(unsplashImages);
      
      if (!isMounted.current || signal.aborted) return;
      
      if (validUnsplashImages.length >= count) {
        // We have enough valid images from Unsplash
        const finalImages = validUnsplashImages.slice(0, count);
        setImages(finalImages);
        imageCache.set(cacheKey, finalImages);
      } else {
        // Try Wikimedia as we don't have enough valid images
        const wikimediaImages = await getWikimediaImages(location, Math.max(count * 2, 5));
        
        if (!isMounted.current || signal.aborted) return;
        
        // Validate Wikimedia images
        const validWikimediaImages = await filterValidImageUrls(wikimediaImages);
        
        if (!isMounted.current || signal.aborted) return;
        
        // Combine valid images from both sources
        const combinedImages = [...validUnsplashImages, ...validWikimediaImages];
        
        if (combinedImages.length > 0) {
          const finalImages = combinedImages.slice(0, count);
          setImages(finalImages);
          imageCache.set(cacheKey, finalImages);
        } else {
          // If no valid images from either API, use placeholders
          const placeholders = getPlaceholderImages(location, count);
          // Validate placeholders too - they might be externally hosted
          const validPlaceholders = await filterValidImageUrls(placeholders);
          
          if (!isMounted.current || signal.aborted) return;
          
          setImages(validPlaceholders.length > 0 ? validPlaceholders : placeholders);
        }
      }
    } catch (err) {
      if (!isMounted.current || signal.aborted) return;
      
      setError(err instanceof Error ? err : new Error('Failed to fetch images'));
      
      // Use validated fallback images on error
      const placeholders = getPlaceholderImages(location, count);
      const validPlaceholders = await filterValidImageUrls(placeholders);
      
      if (!isMounted.current || signal.aborted) return;
      
      setImages(validPlaceholders.length > 0 ? validPlaceholders : placeholders);
    } finally {
      if (isMounted.current && !signal.aborted) {
        setLoading(false);
      }
    }
  }, [location, count, cacheKey]);

  useEffect(() => {
    // Reset states when location changes
    setImages([]);
    setError(null);
    
    if (!location) return;
    
    // Abort any in-flight request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    // Start fetching
    fetchImages();
    
    // Cleanup function
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [location, count, fetchImages]);

  // Reset the isMounted ref when component mounts
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);
  
  return { images, loading, error };
}

/**
 * Map of high-quality placeholder images for popular destinations
 */
const destinationPlaceholders: Record<string, string> = {
  'kyoto': 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e',
  'tokyo': 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26',
  'paris': 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34',
  'santorini': 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff',
  'rome': 'https://images.unsplash.com/photo-1552832230-c0197dd311b5',
  'new york': 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9',
  'prague': 'https://images.unsplash.com/photo-1541849546-b5a5401bae6c',
};

/**
 * Default generic travel images when no specific destination match is found
 */
const defaultImages = [
  'https://images.unsplash.com/photo-1528702748617-c64d49f918af', // Bali
  'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9', // Venice
  'https://images.unsplash.com/photo-1530841377377-3ff06c0ca713', // Generic destination
  'https://images.unsplash.com/photo-1500835556837-99ac94a94552', // Generic travel
  'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1', // Mountains
];

/**
 * Provides fallback placeholder images when all APIs fail
 * 
 * @param destination - Location name to find matching images for
 * @param count - Number of images to return
 * @returns Array of image URLs
 */
function getPlaceholderImages(destination: string, count: number): string[] {
  const lowerDest = destination.toLowerCase();
  
  const matchedKey = Object.keys(destinationPlaceholders).find(key => 
    lowerDest.includes(key)
  );
  
  if (matchedKey) {
    return [destinationPlaceholders[matchedKey], ...defaultImages].slice(0, count);
  }
  
  return defaultImages.slice(0, count);
}