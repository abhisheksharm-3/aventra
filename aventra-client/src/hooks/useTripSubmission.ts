"use client";

import { TripFormValues } from "@/lib/validations/trip-schema";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useItineraryStore, ApiResponse } from "@/stores/useItineraryStore";
import { toast } from "sonner";

// This would normally call your API endpoint
const submitTripPlan = async (data: TripFormValues): Promise<ApiResponse> => {
  // Simulate API request to backend
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000/api';
  const response = await fetch(`${backendUrl}/generate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to submit trip plan');
  }

  const responseData = await response.json();
  // Store the generated itinerary in the global store right after receiving it
  const { setItineraryData } = useItineraryStore.getState();
  setItineraryData(responseData);
  return {
    ...responseData,
    isSuccess: true,
    id: crypto.randomUUID()
  };
};

// Imports are now at the top of the file

export function useTripSubmission() {
  const router = useRouter();
  const { setItineraryData } = useItineraryStore();
    const mutation = useMutation({
    mutationFn: submitTripPlan,
    onSuccess: (data) => {
      // Store the generated itinerary data in the global store
      setItineraryData(data);
      
      // Show success message
      toast.success("Your trip has been generated successfully!");
      
      // Redirect to the generated itinerary page
      router.push("/plan/generated");
    },
    onError: (error) => {
      toast.error(`Failed to generate trip: ${error.message}`);
    }
  });

  return {
    submitTrip: (data?: TripFormValues) => {
      console.log("Trip submission called with data:", data);
      mutation.mutate(data as TripFormValues);
    },
    isSubmitting: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    error: mutation.error,
    data: mutation.data,
  };
}