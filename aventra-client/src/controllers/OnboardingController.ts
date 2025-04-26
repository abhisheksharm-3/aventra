"use server";

import { z } from "zod";
import { createSessionClient } from "@/lib/services/appwrite/appwrite";

/**
 * User preferences schema for validation
 */
const preferencesSchema = z.object({
  interests: z.array(z.string()).min(1, "Select at least one interest"),
  travelStyle: z.array(z.string()),
  dietaryPreferences: z.array(z.string()),
  budget: z.number().min(0).max(100),
  useAI: z.boolean(),
  baseCity: z.string().min(1, "Home city is required"),
});

/**
 * Check if the current user has completed onboarding
 * @returns Boolean indicating if onboarding is complete
 */
export async function checkOnboardingStatus(): Promise<boolean> {
  try {
    const { account } = await createSessionClient();
    const user = await account.get();
    
    // Check if onboarding was completed in user preferences
    const prefs = user.prefs;
    return prefs?.onboardingCompleted === "true";
  } catch (error) {
    console.error("Failed to check onboarding status:", error);
    return false;
  }
}

/**
 * Saves user preferences and marks onboarding as completed
 * @param preferences User preferences from onboarding form
 */
export async function completeOnboarding(formData: FormData) {
  try {
    // Extract and validate form data
    const preferences = {
      interests: JSON.parse(formData.get("interests") as string || "[]"),
      travelStyle: JSON.parse(formData.get("travelStyle") as string || "[]"),
      dietaryPreferences: JSON.parse(formData.get("dietaryPreferences") as string || "[]"),
      budget: parseInt(formData.get("budget") as string || "50"),
      useAI: formData.get("useAI") === "true",
      baseCity: formData.get("baseCity") as string || "", // Added baseCity extraction
    };

    // Validate preferences
    const validationResult = preferencesSchema.safeParse(preferences);
    if (!validationResult.success) {
      const errorMessage = validationResult.error.errors[0]?.message || "Invalid preferences data";
      return { success: false, error: errorMessage };
    }

    // Get client with user session
    const { account } = await createSessionClient();

    // Update user preferences
    await account.updatePrefs({
      interests: JSON.stringify(preferences.interests),
      travelStyle: JSON.stringify(preferences.travelStyle),
      dietaryPreferences: JSON.stringify(preferences.dietaryPreferences),
      budget: preferences.budget.toString(),
      useAI: preferences.useAI.toString(),
      baseCity: preferences.baseCity, // Added baseCity to account preferences
      onboardingCompleted: "true",
      onboardingDate: new Date().toISOString(),
    });

    return { success: true };
  } catch (error) {
    console.error("Failed to complete onboarding:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to save preferences";
    return { success: false, error: errorMessage };
  }
}

/**
 * Skip onboarding and mark it as completed with default preferences
 */
export async function skipOnboarding() {
  try {
    const { account } = await createSessionClient();
    
    // Set minimal default preferences
    await account.updatePrefs({
      onboardingCompleted: "true",
      onboardingSkipped: "true",
      onboardingDate: new Date().toISOString(),
    });
    
    return { success: true };
  } catch (error) {
    console.error("Failed to skip onboarding:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to skip onboarding";
    return { success: false, error: errorMessage };
  }
}