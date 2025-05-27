"use client";

import { useEffect, useState } from 'react';
import { Destination } from '@/types/dashboard';
import { useImages } from './useImages';
import { getRecommendedDestinations, getTrendingDestinations } from '@/lib/services/gemini/recommend-destination-service';

interface DestinationsResponse {
  recommendations: Destination[];
  trending: Destination[];
  loading: boolean;
  error: string | null;
}

// Extend the Destination type to include our loading state
interface DestinationWithLoading extends Destination {
  isLoading?: boolean;
}

/**
 * Simplified hook that fetches personalized destination recommendations and trending destinations
 * Uses imageQuery from Gemini to fetch images with the useImages hook
 * 
 * @param userPreferences Optional user preferences to personalize recommendations
 * @returns Object containing recommendations, trending destinations, loading state and error
 */
export function useRecommendedDestinations(
  userPreferences?: string
): DestinationsResponse {
  // State for processed destinations
  const [recommendations, setRecommendations] = useState<DestinationWithLoading[]>(
    createSkeletonDestinations('rec', 3)
  );
  const [trending, setTrending] = useState<DestinationWithLoading[]>(
    createSkeletonDestinations('trend', 3)
  );
  
  // State for destinations waiting to be processed
  const [recommendationsQueue, setRecommendationsQueue] = useState<Destination[]>([]);
  const [trendingQueue, setTrendingQueue] = useState<Destination[]>([]);
  
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const [initialFetch, setInitialFetch] = useState<boolean>(true);
  
  // Get current destination being processed from each queue
  const currentRecommendation = recommendationsQueue[0];
  const currentTrending = trendingQueue[0];
  
  // Fetch images using the useImages hook for the current items
  const { images: recommendationImages, loading: recImagesLoading } = useImages(
    currentRecommendation?.imageQuery,
    currentRecommendation ? 1 : 0
  );
  
  const { images: trendingImages, loading: trendImagesLoading } = useImages(
    currentTrending?.imageQuery,
    currentTrending ? 1 : 0
  );

  // Fetch destinations from the Gemini API
  useEffect(() => {
    async function fetchDestinations() {
      if (!initialFetch) {
        // If not the initial fetch, show skeletons during refetch
        setRecommendations(createSkeletonDestinations('rec', 3));
        setTrending(createSkeletonDestinations('trend', 3));
      }
      
      setLoading(true);
      setError(null);
      
      try {
        // Fetch both types of destinations in parallel
        const [recommendationsData, trendingData] = await Promise.all([
          getRecommendedDestinations(userPreferences),
          getTrendingDestinations()
        ]);
        
        // We now have the destinations data, but we need images
        // Set up processing queues but keep skeleton loading UI
        if (initialFetch) {
          setInitialFetch(false);
        }
        
        setRecommendationsQueue(recommendationsData);
        setTrendingQueue(trendingData);
      } catch (err) {
        console.error("Error fetching destinations:", err);
        setError("Failed to fetch destination recommendations");
        setLoading(false);
        
        // On error, remove skeleton placeholders
        setRecommendations([]);
        setTrending([]);
      }
    }
    
    fetchDestinations();
  }, [userPreferences, initialFetch]); // Added initialFetch dependency
  
  // Process recommendation images
  useEffect(() => {
    if (!currentRecommendation || recImagesLoading) return;
    
    // If we have an image from useImages, use it
    if (recommendationImages.length > 0) {
      const processedDestination: DestinationWithLoading = {
        ...currentRecommendation,
        image: recommendationImages[0],  // Use the first image from useImages
        isLoading: false
      };
      
      // Add to processed recommendations and remove from queue
      setRecommendations(prev => {
        // Calculate if this is the last item in the queue
        const isLastItem = recommendationsQueue.length === 1;
        
        // Filter out skeleton items when adding the first real item
        const filteredPrev = isLastItem ? prev.filter(d => !d.isLoading) : prev;
          
        // Check for duplicates by ID
        if (filteredPrev.some(dest => dest.id === processedDestination.id)) {
          return filteredPrev;
        }
        return [...filteredPrev, processedDestination];
      });
    } else {
      // If no image was found, use a placeholder
      const processedDestination: DestinationWithLoading = {
        ...currentRecommendation,
        image: 'https://images.unsplash.com/photo-1517760444937-f6397edcbbcd',
        isLoading: false
      };
      
      setRecommendations(prev => {
        // Calculate if this is the last item in the queue
        const isLastItem = recommendationsQueue.length === 1;
        
        // Filter out skeleton items when adding the first real item
        const filteredPrev = isLastItem ? prev.filter(d => !d.isLoading) : prev;
          
        if (filteredPrev.some(dest => dest.id === processedDestination.id)) {
          return filteredPrev;
        }
        return [...filteredPrev, processedDestination];
      });
    }
    
    // Remove processed item from queue
    setRecommendationsQueue(prev => prev.slice(1));
  }, [currentRecommendation, recommendationImages, recImagesLoading, recommendationsQueue.length]);
  
  // Process trending images (same approach as recommendations)
  useEffect(() => {
    if (!currentTrending || trendImagesLoading) return;
    
    // If we have an image from useImages, use it
    if (trendingImages.length > 0) {
      const processedDestination: DestinationWithLoading = {
        ...currentTrending,
        image: trendingImages[0],  // Use the first image from useImages
        isLoading: false
      };
      
      // Add to processed trending destinations
      setTrending(prev => {
        // Calculate if this is the last item in the queue
        const isLastItem = trendingQueue.length === 1;
        
        // Filter out skeleton items when adding the first real item
        const filteredPrev = isLastItem ? prev.filter(d => !d.isLoading) : prev;
          
        // Check for duplicates by ID
        if (filteredPrev.some(dest => dest.id === processedDestination.id)) {
          return filteredPrev;
        }
        return [...filteredPrev, processedDestination];
      });
    } else {
      // If no image was found, use a placeholder
      const processedDestination: DestinationWithLoading = {
        ...currentTrending,
        image: 'https://images.unsplash.com/photo-1517760444937-f6397edcbbcd',
        isLoading: false
      };
      
      setTrending(prev => {
        // Calculate if this is the last item in the queue
        const isLastItem = trendingQueue.length === 1;
        
        // Filter out skeleton items when adding the first real item
        const filteredPrev = isLastItem ? prev.filter(d => !d.isLoading) : prev;
          
        if (filteredPrev.some(dest => dest.id === processedDestination.id)) {
          return filteredPrev;
        }
        return [...filteredPrev, processedDestination];
      });
    }
    
    // Remove processed item from queue
    setTrendingQueue(prev => prev.slice(1));
  }, [currentTrending, trendingImages, trendImagesLoading, trendingQueue.length]);

  // Update loading state based on queues and image loading
  useEffect(() => {
    const isProcessingComplete = 
      recommendationsQueue.length === 0 && 
      trendingQueue.length === 0;
      
    if (isProcessingComplete && !recImagesLoading && !trendImagesLoading) {
      setLoading(false);
    } else {
      setLoading(true);
    }
  }, [
    recommendationsQueue.length, 
    trendingQueue.length, 
    recImagesLoading, 
    trendImagesLoading
  ]);

  return { 
    recommendations, 
    trending, 
    loading, 
    error 
  };
}

/**
 * Creates skeleton destination placeholders for showing during loading
 * 
 * @param prefix Prefix for skeleton IDs ('rec' or 'trend')
 * @param count Number of skeleton items to create
 * @returns Array of skeleton destination objects
 */
function createSkeletonDestinations(prefix: string, count: number): DestinationWithLoading[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `${prefix}-skeleton-${i}`,
    name: '',
    tagline: '',
    match: 0,
    image: '',
    imageQuery: '',
    isLoading: true
  }));
}