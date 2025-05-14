import { useState, useEffect } from 'react';
import { useTripFormStore } from '../stores/useTripFormStore';
import { DestinationInsight } from '@/types/ai';
import { getDestinationTips } from '@/lib/services/gemini/tips-service';

export function useDestinationInsights() {
  const [insights, setInsights] = useState<DestinationInsight | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const formData = useTripFormStore((state) => state.formData);
  const destination = formData.location?.destination;
  const tripType = formData.preferences?.pace; //Trip type can be 'relaxing', 'fast' or 'moderate'.
  const budget = formData.budget?.ceiling
    ? `${formData.budget.currency || 'INR'} ${formData.budget.ceiling}`
    : undefined;
  
  useEffect(() => {
    async function fetchInsights() {
      if (!destination) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const data = await getDestinationTips(destination, tripType, budget);
        setInsights(data);
      } catch (err) {
        setError('Failed to load destination insights');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    
    // Only fetch if we have a destination and it's at least 3 characters
    if (destination && destination.length >= 3) {
      // Add a small delay to prevent too many API calls while typing
      const timer = setTimeout(() => {
        fetchInsights();
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [destination, tripType, budget]);
  
  return { insights, loading, error };
}