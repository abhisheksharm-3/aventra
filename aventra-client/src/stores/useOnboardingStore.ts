import { create } from 'zustand';

interface OnboardingPreferences {
  interests: string[];
  travelStyle: string[];
  dietaryPreferences: string[];
  budget: number;
  useAI: boolean;
  baseCity: string; // Add the baseCity field
}

interface OnboardingState {
  step: number;
  preferences: OnboardingPreferences;
  isSubmitting: boolean;
  error: string | null;
  
  // Actions
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  toggleInterest: (interest: string) => void;
  toggleTravelStyle: (style: string) => void;
  toggleDietaryPreference: (diet: string) => void;
  setBudget: (value: number) => void;
  toggleAI: () => void;
  setBaseCity: (city: string) => void; // Add the setBaseCity action
  setIsSubmitting: (value: boolean) => void;
  setError: (error: string | null) => void;
  resetOnboarding: () => void;
}

const initialPreferences: OnboardingPreferences = {
  interests: [],
  travelStyle: [],
  dietaryPreferences: [],
  budget: 50,
  useAI: true,
  baseCity: '', // Initialize with empty string
};

export const useOnboardingStore = create<OnboardingState>((set) => ({
  step: 1,
  preferences: initialPreferences,
  isSubmitting: false,
  error: null,
  
  setStep: (step) => set({ step }),
  
  nextStep: () => set((state) => ({ 
    step: Math.min(state.step + 1, 6) // Update to 6 steps total
  })),
  
  prevStep: () => set((state) => ({ 
    step: Math.max(state.step - 1, 1) 
  })),
  
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
  
  setBudget: (budget) => set((state) => ({
    preferences: {
      ...state.preferences,
      budget
    }
  })),
  
  toggleAI: () => set((state) => ({
    preferences: {
      ...state.preferences,
      useAI: !state.preferences.useAI
    }
  })),
  
  // Add the setBaseCity action
  setBaseCity: (baseCity) => set((state) => ({
    preferences: {
      ...state.preferences,
      baseCity
    }
  })),
  
  setIsSubmitting: (isSubmitting) => set({ isSubmitting }),
  
  setError: (error) => set({ error }),
  
  resetOnboarding: () => set({
    step: 1,
    preferences: initialPreferences,
    error: null
  }),
}));