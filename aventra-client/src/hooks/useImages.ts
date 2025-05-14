import { useState, useEffect } from 'react';
import { getDestinationImages } from '@/lib/services/unsplash/image-service';
import { getWikimediaImages } from '@/lib/services/wikimedia/image-service';

interface UseImagesReturn {
  images: string[];
  loading: boolean;
  error: Error | null;
}

/**
 * Hook to fetch images from multiple sources
 * First tries Unsplash, then falls back to Wikimedia if needed
 * 
 * @param location - The location to find images for (city or destination name)
 * @param count - Number of images to return
 */
export function useImages(location: string | undefined, count: number = 1): UseImagesReturn {
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Reset states when location changes
    setImages([]);
    setError(null);
    
    // Don't fetch if no location provided
    if (!location) {
      return;
    }
    
    let isMounted = true;
    
    async function fetchImages() {
      setLoading(true);
      
      try {
        // First try Unsplash
        const unsplashImages = await getDestinationImages(location as string, count);
        
        if (isMounted) {
          if (unsplashImages && unsplashImages.length > 0) {
            // If Unsplash returns images, use them
            setImages(unsplashImages);
          } else {
            // If Unsplash doesn't return images, try Wikimedia
            const wikimediaImages = await getWikimediaImages(location as string, count);
            
            if (isMounted) {
              if (wikimediaImages && wikimediaImages.length > 0) {
                // Use Wikimedia images if available
                setImages(wikimediaImages);
              } else {
                // If neither service returns images, use default placeholders
                const placeholders = getPlaceholderImages(location as string, count);
                setImages(placeholders);
              }
            }
          }
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error('Failed to fetch images'));
          // Use fallback images on error
          const placeholders = getPlaceholderImages(location as string, count);
          setImages(placeholders);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }
    
    fetchImages();
    
    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, [location, count]);
  
  return { images, loading, error };
}

/**
 * Provides fallback placeholder images when all APIs fail
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