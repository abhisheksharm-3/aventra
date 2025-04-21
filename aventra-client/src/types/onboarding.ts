export interface OnboardingPreferences {
    interests: string[];
    travelStyle: string[];
    dietaryPreferences: string[];
    budget: number;
    useAI: boolean;
    onboardingCompleted?: boolean;
    onboardingDate?: string;
  }
  
  export interface OnboardingResponse {
    success: boolean;
    error?: string;
  }