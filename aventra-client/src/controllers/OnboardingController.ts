"use server";

import { z } from "zod";
import { createSessionClient } from "@/lib/services/appwrite/appwrite";
import { OnboardingPreferences, OnboardingResponse } from "@/types/onboarding";

/**
 * Extended onboarding preferences with metadata fields
 * Includes completion status and date fields
 */
interface ExtendedOnboardingPreferences extends OnboardingPreferences {
  onboardingCompleted: boolean;
  onboardingSkipped?: boolean;
  onboardingDate: string | null;
}

/**
 * User preferences schema for validation
 * 
 * Validates all onboarding preferences including the newly added
 * tripPace and accessibilityNeeds fields that were introduced
 * in the updated onboarding flow
 */
const preferencesSchema = z.object({
  interests: z.array(z.string()).min(1, "Select at least one interest"),
  travelStyle: z.array(z.string()),
  dietaryPreferences: z.array(z.string()),
  budget: z.number().min(0).max(100),
  useAI: z.boolean(),
  baseCity: z.string().min(1, "Home city is required"),
  tripPace: z.string().refine(val => ['relaxed', 'moderate', 'fast'].includes(val), {
    message: "Trip pace must be relaxed, moderate, or fast"
  }),
  accessibilityNeeds: z.array(z.string()),
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
 * Now includes support for the new tripPace and accessibilityNeeds fields
 * 
 * @param formData Form data containing all user preferences
 * @returns Object indicating success or failure with optional error message
 */
/**
 * Extract preference data from form data
 * Helper function to parse form fields consistently
 * 
 * @param formData Form data containing user preferences
 * @returns Structured preferences object
 */
function extractPreferencesFromForm(formData: FormData): OnboardingPreferences {
  return {
    interests: JSON.parse(formData.get("interests") as string || "[]"),
    travelStyle: JSON.parse(formData.get("travelStyle") as string || "[]"),
    dietaryPreferences: JSON.parse(formData.get("dietaryPreferences") as string || "[]"),
    budget: parseInt(formData.get("budget") as string || "50"),
    useAI: formData.get("useAI") === "true",
    baseCity: formData.get("baseCity") as string || "",
    tripPace: formData.get("tripPace") as string || "moderate",
    accessibilityNeeds: JSON.parse(formData.get("accessibilityNeeds") as string || "[]"),
  };
}

export async function completeOnboarding(formData: FormData): Promise<OnboardingResponse> {
  try {
    // Extract and validate form data
    const preferences = extractPreferencesFromForm(formData);

    // Validate preferences
    const validationResult = preferencesSchema.safeParse(preferences);
    if (!validationResult.success) {
      const errorMessage = validationResult.error.errors[0]?.message || "Invalid preferences data";
      return { success: false, error: errorMessage };
    }    // Get client with user session
    const { account } = await createSessionClient();
    
    // Update user preferences
    await account.updatePrefs({
      interests: JSON.stringify(preferences.interests),
      travelStyle: JSON.stringify(preferences.travelStyle),
      dietaryPreferences: JSON.stringify(preferences.dietaryPreferences),
      budget: preferences.budget.toString(),
      useAI: preferences.useAI.toString(),
      baseCity: preferences.baseCity,
      tripPace: preferences.tripPace,
      accessibilityNeeds: JSON.stringify(preferences.accessibilityNeeds),
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
 * Now includes default values for the new tripPace and accessibilityNeeds fields
 * 
 * @returns Promise resolving to OnboardingResponse object
 */
export async function skipOnboarding(): Promise<OnboardingResponse> {
  try {
    const { account } = await createSessionClient();
    
    // Set minimal default preferences
    await account.updatePrefs({
      interests: JSON.stringify([]),
      travelStyle: JSON.stringify([]),
      dietaryPreferences: JSON.stringify([]),
      budget: "50", // Default to mid-range
      useAI: "true", // Enable AI by default
      baseCity: "",
      tripPace: "moderate", // Default to moderate pace
      accessibilityNeeds: JSON.stringify([]), // No accessibility needs by default
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

/**
 * Get the user's onboarding preferences
 * Retrieves all preferences including the new tripPace and accessibilityNeeds fields
 * 
 * @returns User preferences or null if not found
 */
export async function getUserPreferences(): Promise<ExtendedOnboardingPreferences | null> {
  try {
    const { account } = await createSessionClient();
    const user = await account.get();
    const prefs = user.prefs;
    
    // Return null if no preferences are set
    if (!prefs) return null;
    
    // Parse JSON strings back to arrays
    return {
      interests: prefs.interests ? JSON.parse(prefs.interests) : [],
      travelStyle: prefs.travelStyle ? JSON.parse(prefs.travelStyle) : [],
      dietaryPreferences: prefs.dietaryPreferences ? JSON.parse(prefs.dietaryPreferences) : [],
      budget: prefs.budget ? parseInt(prefs.budget) : 50,
      useAI: prefs.useAI === "true",
      baseCity: prefs.baseCity || "",
      tripPace: prefs.tripPace || "moderate",
      accessibilityNeeds: prefs.accessibilityNeeds ? JSON.parse(prefs.accessibilityNeeds) : [],
      onboardingCompleted: prefs.onboardingCompleted === "true",
      onboardingSkipped: prefs.onboardingSkipped === "true" || false,
      onboardingDate: prefs.onboardingDate || null,
    };
  } catch (error) {
    console.error("Failed to get user preferences:", error);
    return null;
  }
}