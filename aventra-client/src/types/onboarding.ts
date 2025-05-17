/**
 * User onboarding preferences data structure
 * 
 * Contains all the personalization options collected from users during
 * the onboarding process, including interests, travel style, and accessibility needs.
 * 
 * @interface OnboardingPreferences
 */
export interface OnboardingPreferences {
  /** User's selected interest categories */
  interests: string[];
  
  /** User's travel style preferences */
  travelStyle: string[];
  
  /** User's dietary requirements and preferences */
  dietaryPreferences: string[];
  
  /** Preferred budget level (0-100 scale) */
  budget: number;
  
  /** Whether user wants AI-powered recommendations */
  useAI: boolean;
  
  /** User's preferred home/base city for travel */
  baseCity: string;
  
  /** Preferred travel pace (relaxed, moderate, fast) */
  tripPace: string;
  
  /** User's accessibility requirements */
  accessibilityNeeds: string[];
}

/**
 * Onboarding state management interface
 * 
 * Manages the state of the multi-step onboarding flow, user preferences,
 * and provides actions to update the state throughout the onboarding process.
 * 
 * @interface OnboardingState
 */
export interface OnboardingState {
  /** Current onboarding step (1-based index) */
  step: number;
  
  /** Collection of user preferences */
  preferences: OnboardingPreferences;
  
  /** Loading state for async operations */
  isSubmitting: boolean;
  
  /** Error message if any operation fails */
  error: string | null;
  
  // Actions
  
  /** Set the current step directly */
  setStep: (step: number) => void;
  
  /** Move to the next step */
  nextStep: () => void;
  
  /** Move to the previous step */
  prevStep: () => void;
  
  /** Toggle an interest selection */
  toggleInterest: (interest: string) => void;
  
  /** Toggle a travel style selection */
  toggleTravelStyle: (style: string) => void;
  
  /** Toggle a dietary preference selection */
  toggleDietaryPreference: (diet: string) => void;
  
  /** Set the budget preference value */
  setBudget: (value: number) => void;
  
  /** Toggle AI recommendation preference */
  toggleAI: () => void;
  
  /** Set the base city preference */
  setBaseCity: (city: string) => void;
  
  /** Set the trip pace preference */
  setTripPace: (pace: string) => void;
  
  /** Toggle an accessibility need selection */
  toggleAccessibilityNeed: (need: string) => void;
  
  /** Set the submitting state for async operations */
  setIsSubmitting: (value: boolean) => void;
  
  /** Set an error message */
  setError: (error: string | null) => void;
    /** Reset the onboarding process */
  resetOnboarding: () => void;
  
  /** Check if the current user has completed onboarding */
  checkOnboardingStatus: () => Promise<boolean>;
  
  /** Complete the onboarding process with current preferences */
  submitOnboarding: () => Promise<OnboardingResponse>;
  
  /** Skip the onboarding process */
  skipOnboarding: () => Promise<OnboardingResponse>;
  
  /** Load user preferences from the server */
  loadUserPreferences: () => Promise<void>;
}
  
  /**
 * Response interface for onboarding API operations
 * 
 * Defines the structure of responses returned by onboarding-related API endpoints,
 * such as saving preferences or completing the onboarding process.
 * 
 * @interface OnboardingResponse
 */
export interface OnboardingResponse {
    /** Whether the operation was successful */
    success: boolean;
    
    /** Error message if operation failed */
    error?: string;
  }