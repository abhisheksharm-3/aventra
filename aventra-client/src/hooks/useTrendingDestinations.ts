import { useState, useEffect } from 'react';
import { useTripFormStore } from '../stores/useTripFormStore';
import { TrendingDestination } from '@/types/ai';
import { getTrendingDestinations } from '@/lib/services/gemini/trending-service';

/**
 * React hook that provides AI-matched trending destinations based on
 * the user's current trip preferences and selected destination
 */
export function useTrendingDestinations() {
  const [destinations, setDestinations] = useState<TrendingDestination[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const formData = useTripFormStore((state) => state.formData);
  const currentDestination = formData.location?.destination;
  const tripType = formData.preferences?.pace;
  
  // Extract user preferences from form data
  const extractPreferences = (): string[] => {
    const preferences: string[] = [];
    
    if (formData.preferences?.interests) {
      preferences.push(...formData.preferences.interests);
    }
    
    return preferences;
  };
  
  useEffect(() => {
    async function fetchTrendingDestinations() {
      setLoading(true);
      setError(null);
      
      try {
        // Add small delay to prevent excessive API calls while typing
        const data = await getTrendingDestinations(
          currentDestination, 
          extractPreferences(), 
          tripType
        );
        setDestinations(data);
      } catch (err) {
        setError('Failed to load trending destinations');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    
    // Fetch destinations with a slight delay
    const timer = setTimeout(() => {
      fetchTrendingDestinations();
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [currentDestination, tripType]);
  
  return { destinations, loading, error };
}