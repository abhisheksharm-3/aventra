/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";

interface UseTrip {
  trip: any;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  updateTrip: (tripData: any) => Promise<{ success: boolean; message?: string }>;
}

/**
 * Custom hook for fetching and managing trip data
 * @param tripId - The ID of the trip to fetch
 * @returns Trip data, loading state, error state, and helper functions
 */
export function useTrip(tripId: string): UseTrip {
  const [trip, setTrip] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastFetchTime, setLastFetchTime] = useState<number>(0);

  // Fetch trip data
  const fetchTripData = async (skipCache = false) => {
    // Skip fetch if we already fetched recently (within last 30 seconds)
    // and skipCache is false
    const now = Date.now();
    if (!skipCache && now - lastFetchTime < 30000 && trip) {
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      // In production, this would be an actual API call
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      // const response = await fetch(`${apiUrl}/api/trips/${tripId}`, {
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   next: { revalidate: 300 } // Revalidate every 5 minutes
      // });
      
      // if (!response.ok) {
      //   throw new Error(`Failed to fetch trip data: ${response.status}`);
      // }
      
      // const data = await response.json();
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, we'll import mock data
      const mockData = await import("@/lib/mock/trip-data.json");
      const data = mockData.default;
      
      setTrip(data);
      setLastFetchTime(now);
    } catch (err) {
      console.error("Error fetching trip data:", err);
      setError(err instanceof Error ? err.message : "Failed to load trip data");
    } finally {
      setIsLoading(false);
    }
  };

  // Update trip data
  const updateTrip = async (tripData: any) => {
    try {
      setIsLoading(true);
      
      // In production, this would be an API call
      // const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      // const response = await fetch(`${apiUrl}/api/trips/${tripId}`, {
      //   method: 'PUT',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(tripData)
      // });
      
      // if (!response.ok) {
      //   throw new Error(`Failed to update trip: ${response.status}`);
      // }
      
      // const result = await response.json();
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update local state with new data
      setTrip(tripData);
      
      return { success: true, message: "Trip updated successfully" };
    } catch (err) {
      console.error("Error updating trip data:", err);
      const errorMessage = err instanceof Error ? err.message : "Failed to update trip";
      
      return { success: false, message: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch trip data on component mount or when tripId changes
  useEffect(() => {
    if (tripId) {
      fetchTripData();
    }
  }, [tripId]);

  // Expose a refetch function to manually trigger data refresh
  const refetch = async () => {
    await fetchTripData(true);
  };

  return { trip, isLoading, error, refetch, updateTrip };
}