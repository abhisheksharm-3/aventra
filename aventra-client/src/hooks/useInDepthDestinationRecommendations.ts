"use client";

import { useEffect, useState } from 'react';
import { InDepthDestination } from '@/types/dashboard';
import { useImages } from './useImages';
import { getInDepthDestinations } from '@/lib/services/gemini/recommend-destination-service';

interface InDepthDestinationsResponse {
  destinations: InDepthDestination[];
  loading: boolean;
  error: string | null;
}

interface InDepthDestinationWithLoading extends InDepthDestination {
  isLoading?: boolean;
}

/**
 * Hook to fetch in-depth destination information
 * 
 * @param category Optional category filter for destinations
 * @param count Number of destinations to fetch
 * @returns Object containing destinations, loading state and error
 */
export function useInDepthDestinations(
  category?: string,
  count: number = 6
): InDepthDestinationsResponse {
  // State for processed destinations
  const [destinations, setDestinations] = useState<InDepthDestinationWithLoading[]>(
    createSkeletonDestinations(count)
  );
  
  // State for destinations waiting to be processed
  const [destinationsQueue, setDestinationsQueue] = useState<InDepthDestination[]>([]);
  
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Get current destination being processed from the queue
  const currentDestination = destinationsQueue[0];
  
  // Fetch image using the useImages hook for current destination
  const { images: destinationImages, loading: imageLoading } = useImages(
    currentDestination?.imageQuery,
    currentDestination ? 1 : 0
  );

  // Fetch destinations from the API
  useEffect(() => {
    async function fetchDestinations() {
      setLoading(true);
      setError(null);
      
      try {
        // Fetch destinations data
        const destinationsData = await getInDepthDestinations(category, count);
        
        // Setup processing queue
        setDestinationsQueue(destinationsData);
      } catch (err) {
        console.error("Error fetching in-depth destinations:", err);
        setError("Failed to fetch destination information");
        setLoading(false);
        
        // On error, remove skeleton placeholders
        setDestinations([]);
      }
    }
    
    fetchDestinations();
  }, [category, count]);
  
  // Process destination images
  useEffect(() => {
    if (!currentDestination || imageLoading) return;
    
    // If we have an image from useImages, use it
    if (destinationImages.length > 0) {
      const processedDestination: InDepthDestinationWithLoading = {
        ...currentDestination,
        image: destinationImages[0],
        isLoading: false
      };
      
      // Add to processed destinations and remove from queue
      setDestinations(prev => {
        // Calculate if this is the last item in the queue
        const isLastItem = destinationsQueue.length === 1;
        
        // Filter out skeleton items when we have real data
        const filteredPrev = isLastItem ? prev.filter(d => !d.isLoading) : prev;
          
        // Check for duplicates by ID
        if (filteredPrev.some(dest => dest.id === processedDestination.id)) {
          return filteredPrev;
        }
        return [...filteredPrev, processedDestination];
      });
    } else {
      // If no image was found, use a placeholder
      const processedDestination: InDepthDestinationWithLoading = {
        ...currentDestination,
        image: 'https://images.unsplash.com/photo-1517760444937-f6397edcbbcd',
        isLoading: false
      };
      
      setDestinations(prev => {
        // Calculate if this is the last item in the queue
        const isLastItem = destinationsQueue.length === 1;
        
        // Filter out skeleton items when we have real data
        const filteredPrev = isLastItem ? prev.filter(d => !d.isLoading) : prev;
          
        if (filteredPrev.some(dest => dest.id === processedDestination.id)) {
          return filteredPrev;
        }
        return [...filteredPrev, processedDestination];
      });
    }
    
    // Remove processed item from queue
    setDestinationsQueue(prev => prev.slice(1));
  }, [currentDestination, destinationImages, imageLoading, destinationsQueue.length]);
  
  // Update loading state
  useEffect(() => {
    if (destinationsQueue.length === 0 && !imageLoading) {
      setLoading(false);
    } else {
      setLoading(true);
    }
  }, [destinationsQueue.length, imageLoading]);

  return { 
    destinations, 
    loading, 
    error 
  };
}

/**
 * Creates skeleton destination placeholders for showing during loading
 * 
 * @param count Number of skeleton items to create
 * @returns Array of skeleton destination objects
 */
function createSkeletonDestinations(count: number): InDepthDestinationWithLoading[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `skeleton-${i}`,
    name: '',
    tagline: '',
    match: 0,
    image: '',
    imageQuery: '',
    isLoading: true,
    description: '',
    bestTimeToVisit: '',
    highlights: [],
    travelTips: [],
    localCuisine: [],
    culturalNotes: '',
    budget: {
      currency: '',
      hostel: '',
      midRange: '',
      luxury: '',
      averageMeal: '',
      transportDaily: ''
    },
    category: ''
  }));
}