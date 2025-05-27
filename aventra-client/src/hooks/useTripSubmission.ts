"use client";

/**
 * @module hooks/useTripSubmission
 * @description Hook for submitting trip form data and managing the API request lifecycle
 */

import { TripFormValues } from "@/lib/validations/trip-schema";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useItineraryStore } from "@/stores/useItineraryStore";
import { toast } from "sonner";
import { ID } from "node-appwrite";
import { GeneratedItineraryResponse } from "@/types/itinerary";

/**
 * API configuration for backend requests
 */
const API_CONFIG = {
  baseUrl: process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000/api',
  endpoints: {
    generate: '/generate'
  }
};

/**
 * Submit trip plan data to the backend API
 * 
 * @param {TripFormValues} data - The validated trip form data
 * @returns {Promise<GeneratedItineraryResponse>} Response containing the generated itinerary
 * @throws {Error} When the API request fails
 */
const submitTripPlan = async (data: TripFormValues): Promise<GeneratedItineraryResponse> => {
  try {
    const response = await fetch(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.generate}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Request failed with status ${response.status}`);
    }

    const responseData = await response.json();
    
    // Generate a unique ID for this itinerary
    const itineraryId = ID.unique();
    
    // Enrich the response with metadata
    return {
      ...responseData,
      isSuccess: true,
      id: itineraryId
    };
  } catch (error) {
    console.error("Trip submission error:", error);
    throw error instanceof Error 
      ? error 
      : new Error("An unknown error occurred while submitting your trip plan");
  }
};

/**
 * Hook for handling trip plan submission with loading, success, and error states
 * 
 * @returns {Object} Methods and state for trip submission
 * @property {Function} submitTrip - Function to submit trip data
 * @property {boolean} isSubmitting - Whether a submission is in progress
 * @property {boolean} isSuccess - Whether the submission was successful
 * @property {boolean} isError - Whether the submission resulted in an error
 * @property {Error|null} error - Error object if submission failed
 * @property {ApiResponse|undefined} data - The response data if submission succeeded
 */
export function useTripSubmission() {
  const router = useRouter();
  const { setItineraryData, setActiveItinerary } = useItineraryStore();
  
  const mutation = useMutation<GeneratedItineraryResponse, Error, TripFormValues>({
    mutationFn: submitTripPlan,
    onSuccess: (data) => {
      // Make sure the itinerary has an ID
      if (!data.id) {
        console.error("Generated itinerary has no ID");
        toast.error("Failed to generate trip: Missing itinerary ID");
        return;
      }
      
      // Store the generated itinerary data in the global store
      // The new store handles storing by ID and setting as active
      setItineraryData(data, data.id);
      
      // Explicitly set as active itinerary
      setActiveItinerary(data.id);
      
      // Show success message
      toast.success("Your trip has been generated successfully!");
      
      // Redirect to the generated itinerary page with the ID
      router.push(`/plan/generated/${data.id}`);
    },
    onError: (error) => {
      toast.error(`Failed to generate trip: ${error.message}`);
    }
  });

  return {
    /**
     * Submit trip data to generate an itinerary
     * 
     * @param {TripFormValues} data - The trip form data to submit
     * @throws {Error} If data is invalid or missing required fields
     */
    submitTrip: (data?: TripFormValues) => {
      if (!data) {
        toast.error("No trip data provided");
        return;
      }

      console.log("Trip submission initiated with data:", data);
      mutation.mutate(data);
    },
    isSubmitting: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    error: mutation.error,
    data: mutation.data,
  };
}