"use server";

import { type TripFormValues } from "../validations/trip-schema";

export async function submitTripRequest(data: TripFormValues): Promise<{ success: boolean; message: string }> {
  try {
    const response = await fetch("https://api.tripplanner.com/trips", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    return {
      success: true,
      message: "Your trip is being planned! We'll send you details soon.",
    };
  } catch (error) {
    console.error("Error submitting trip request:", error);
    return {
      success: false,
      message: "There was an error submitting your trip request. Please try again.",
    };
  }
}