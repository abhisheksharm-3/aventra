"use client";

import { TripFormValues } from "@/lib/validations/trip-schema";
import { useMutation } from "@tanstack/react-query";

// This would normally call your API endpoint
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const submitTripPlan = async (data: TripFormValues) => {
  // Log the data being submitted to the API
  console.log("Submitting trip data:", data);
  
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1500));
  
  return {
    id: "12345",
    success: true,
    message: "Your trip is being planned! We'll send you details soon.",
  };
};

export function useTripSubmission() {
  const mutation = useMutation({
    mutationFn: submitTripPlan,
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