import { OnboardingPreferences, OnboardingState } from '@/types/onboarding';
import { create } from 'zustand';
import { 
  checkOnboardingStatus,
  completeOnboarding,
  getUserPreferences,
  skipOnboarding as skipOnboardingAction
} from '@/controllers/OnboardingController';

/**
 * Default initial preferences for new users
 * These values represent the starting state of the onboarding flow
 */
const initialPreferences: OnboardingPreferences = {
  interests: [],
  travelStyle: [],
  dietaryPreferences: [],
  budget: 50, // Default to mid-range budget
  useAI: true, // Enable AI recommendations by default
  baseCity: '',
  tripPace: 'moderate', // Default to balanced pace
  accessibilityNeeds: [], // Initialize with empty array
};

/**
 * Custom Zustand store for managing the onboarding flow
 * 
 * Handles user preference selections, navigation between steps, and state management
 * for the multi-step onboarding process.
 */
export const useOnboardingStore = create<OnboardingState>((set) => ({
  // Initial state
  step: 1, // Start with the first step
  preferences: initialPreferences,
  isSubmitting: false,
  error: null,
  
  /**
   * Set the current step directly
   * @param {number} step - The step to navigate to
   */
  setStep: (step) => set({ step }),
  
  /**
   * Move to the next onboarding step
   * Enforces upper bound to prevent navigating past the last step
   */
  nextStep: () => set((state) => ({ 
    step: Math.min(state.step + 1, 8) // Limit to 8 steps total
  })),
  
  /**
   * Move to the previous onboarding step
   * Enforces lower bound to prevent navigating before the first step
   */
  prevStep: () => set((state) => ({ 
    step: Math.max(state.step - 1, 1) 
  })),
    /**
   * Toggle an interest selection on/off
   * If interest is already selected, it will be removed; otherwise, it will be added
   * 
   * @param {string} interest - The interest ID to toggle
   */
  toggleInterest: (interest) => set((state) => {
    const interests = state.preferences.interests.includes(interest)
      ? state.preferences.interests.filter(i => i !== interest)
      : [...state.preferences.interests, interest];
    
    return {
      preferences: {
        ...state.preferences,
        interests
      }
    };
  }),
  
  /**
   * Toggle a travel style selection on/off
   * If style is already selected, it will be removed; otherwise, it will be added
   * 
   * @param {string} style - The travel style ID to toggle
   */
  toggleTravelStyle: (style) => set((state) => {
    const travelStyle = state.preferences.travelStyle.includes(style)
      ? state.preferences.travelStyle.filter(s => s !== style)
      : [...state.preferences.travelStyle, style];
    
    return {
      preferences: {
        ...state.preferences,
        travelStyle
      }
    };
  }),
    /**
   * Toggle a dietary preference selection on/off
   * If diet preference is already selected, it will be removed; otherwise, it will be added
   * 
   * @param {string} diet - The dietary preference ID to toggle
   */
  toggleDietaryPreference: (diet) => set((state) => {
    const dietaryPreferences = state.preferences.dietaryPreferences.includes(diet)
      ? state.preferences.dietaryPreferences.filter(d => d !== diet)
      : [...state.preferences.dietaryPreferences, diet];
    
    return {
      preferences: {
        ...state.preferences,
        dietaryPreferences
      }
    };
  }),
  
  /**
   * Set the budget preference level
   * 
   * @param {number} budget - The budget level (0-100 scale)
   */
  setBudget: (budget) => set((state) => ({
    preferences: {
      ...state.preferences,
      budget
    }
  })),
  
  /**
   * Toggle AI-powered recommendations preference on/off
   */
  toggleAI: () => set((state) => ({
    preferences: {
      ...state.preferences,
      useAI: !state.preferences.useAI
    }
  })),
  
  /**
   * Set the user's preferred base city for travel
   * 
   * @param {string} baseCity - The name of the base city
   */
  setBaseCity: (baseCity) => set((state) => ({
    preferences: {
      ...state.preferences,
      baseCity
    }
  })),
    /**
   * Set the user's preferred travel pace
   * 
   * @param {string} tripPace - The travel pace preference (relaxed, moderate, fast)
   */
  setTripPace: (tripPace) => set((state) => ({
    preferences: {
      ...state.preferences,
      tripPace
    }
  })),
  
  /**
   * Toggle an accessibility need selection on/off with special handling
   * 
   * Special logic:
   * - If "none" is selected, all other options are removed
   * - If any specific need is selected, "none" option is removed
   * 
   * @param {string} need - The accessibility need ID to toggle
   */
  toggleAccessibilityNeed: (need) => set((state) => {
    // Handle special case: if "none" is selected, clear all other options
    if (need === "none") {
      return {
        preferences: {
          ...state.preferences,
          accessibilityNeeds: state.preferences.accessibilityNeeds.includes("none") ? [] : ["none"]
        }
      };
    }
    
    // If selecting a specific need, remove "none" option
    let accessibilityNeeds = state.preferences.accessibilityNeeds.filter(n => n !== "none");
    
    // Toggle the selected need
    if (accessibilityNeeds.includes(need)) {
      accessibilityNeeds = accessibilityNeeds.filter(n => n !== need);
    } else {
      accessibilityNeeds = [...accessibilityNeeds, need];
    }
    
    return {
      preferences: {
        ...state.preferences,
        accessibilityNeeds
      }
    };
  }),
    /**
   * Set the submitting state for async operations
   * 
   * @param {boolean} isSubmitting - Whether the form is currently submitting
   */
  setIsSubmitting: (isSubmitting) => set({ isSubmitting }),
  
  /**
   * Set an error message
   * 
   * @param {string|null} error - Error message or null to clear errors
   */
  setError: (error) => set({ error }),
  
  /**
   * Reset the onboarding process to its initial state
   * Clears all user selections and returns to step 1
   */  resetOnboarding: () => set({
    step: 1,
    preferences: initialPreferences,
    error: null
  }),

  /**
   * Check if the current user has completed onboarding
   * @returns Promise resolving to boolean indicating completion status
   */
  checkOnboardingStatus: async () => {
    try {
      return await checkOnboardingStatus();
    } catch (error) {
      console.error("Failed to check onboarding status:", error);
      return false;
    }
  },

  /**
   * Submit the current preferences to complete the onboarding process
   * @returns Promise resolving to OnboardingResponse
   */
  submitOnboarding: async () => {
    try {
      const state = useOnboardingStore.getState();
      state.setIsSubmitting(true);
      
      // Create FormData and append preferences
      const formData = new FormData();
      formData.append("interests", JSON.stringify(state.preferences.interests));
      formData.append("travelStyle", JSON.stringify(state.preferences.travelStyle));
      formData.append("dietaryPreferences", JSON.stringify(state.preferences.dietaryPreferences));
      formData.append("budget", state.preferences.budget.toString());
      formData.append("useAI", state.preferences.useAI.toString());
      formData.append("baseCity", state.preferences.baseCity);
      formData.append("tripPace", state.preferences.tripPace);
      formData.append("accessibilityNeeds", JSON.stringify(state.preferences.accessibilityNeeds));
      
      const result = await completeOnboarding(formData);
      
      if (!result.success) {
        state.setError(result.error || "Something went wrong. Please try again.");
      }
      
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      useOnboardingStore.getState().setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      useOnboardingStore.getState().setIsSubmitting(false);
    }
  },

  /**
   * Skip the onboarding process
   * @returns Promise resolving to OnboardingResponse
   */
  skipOnboarding: async () => {
    try {
      useOnboardingStore.getState().setIsSubmitting(true);
      return await skipOnboardingAction();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      return { success: false, error: errorMessage };
    } finally {
      useOnboardingStore.getState().setIsSubmitting(false);
    }
  },
  
  /**
   * Load user preferences from the server
   */
  loadUserPreferences: async () => {
    try {
      useOnboardingStore.getState().setIsSubmitting(true);
      const prefs = await getUserPreferences();
      
      if (prefs) {
        // Only update preferences that match our store structure
        // and skip metadata fields like onboardingCompleted
        set({
          preferences: {
            interests: prefs.interests,
            travelStyle: prefs.travelStyle,
            dietaryPreferences: prefs.dietaryPreferences,
            budget: prefs.budget,
            useAI: prefs.useAI,
            baseCity: prefs.baseCity,
            tripPace: prefs.tripPace,
            accessibilityNeeds: prefs.accessibilityNeeds,
          }
        });
      }
    } catch (error) {
      console.error("Failed to load user preferences:", error);
      useOnboardingStore.getState().setError("Failed to load preferences");
    } finally {
      useOnboardingStore.getState().setIsSubmitting(false);
    }
  },
}));