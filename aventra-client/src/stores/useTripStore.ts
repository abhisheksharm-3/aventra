import { TripFormValues } from "@/lib/validations/trip-schema";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface TripState {
  formData: Partial<TripFormValues>;
  isFormComplete: boolean;
  activeStep: number;
  
  // Actions
  updateFormData: (data: Partial<TripFormValues>) => void;
  updateField: <K extends keyof TripFormValues>(
    field: K,
    value: TripFormValues[K]
  ) => void;
  resetForm: () => void;
  setActiveStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
}

const initialFormData: Partial<TripFormValues> = {
  dates: {
      isFlexible: false,
      startDate: "",
      endDate: ""
  },
  travelers: {
    count: 1,
    adults: 1,
    children: 0,
    infants: 0,
  },
  preferences: {
    pace: "moderate",
    accessibility: {
      mobilityNeeds: false,
      hearingNeeds: false,
      visionNeeds: false,
      dietaryRestrictions: false,
    },
  },
};

export const useTripStore = create<TripState>()(
  devtools(
    persist(
      (set) => ({
        formData: initialFormData,
        isFormComplete: false,
        activeStep: 0,
        
        updateFormData: (data) =>
          set((state) => ({
            formData: {
              ...state.formData,
              ...data,
            },
          })),
          
        updateField: (field, value) =>
          set((state) => ({
            formData: {
              ...state.formData,
              [field]: value,
            },
          })),
          
        resetForm: () =>
          set(() => ({
            formData: initialFormData,
            isFormComplete: false,
            activeStep: 0,
          })),
          
        setActiveStep: (step) => set(() => ({ activeStep: step })),
        nextStep: () => set((state) => ({ activeStep: state.activeStep + 1 })),
        prevStep: () => set((state) => ({ activeStep: state.activeStep - 1 })),
      }),
      {
        name: "trip-form-storage",
        partialize: (state) => ({ formData: state.formData }),
      }
    )
  )
);