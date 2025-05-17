"use client";

import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TripFormValues, tripFormSchema } from "@/lib/validations/trip-schema";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

/**
 * Interface for the trip store state
 */
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

/**
 * Initial form data with default values
 */
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
      sensoryNeeds: false,
    },
  },
  additionalContext: "",
};

/**
 * Zustand store for trip planning state management
 */
export const useTripFormStore = create<TripState>()(
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

/**
 * Custom hook that combines React Hook Form with the trip store
 * Provides form handling with validation and state persistence
 * 
 * @returns React Hook Form methods and handlers for the trip form
 */
export function useTripForm() {
  const { formData, updateFormData } = useTripFormStore();
  // Flag to prevent circular updates
  const isUpdatingFromStore = useRef(false);
  
  const form = useForm<TripFormValues>({
    //FIX: Type assertion here
    // eslint-disable-next-line @typescript-eslint/no-explicit-any 
    resolver: zodResolver(tripFormSchema as any),
    defaultValues: {
      ...initialFormData,
      ...formData,
    } as TripFormValues, // Type assertion here
    mode: "onChange",
  });
  
  // Update form values from store when they change
  useEffect(() => {
    // Set flag to prevent the watch effect from triggering store updates
    isUpdatingFromStore.current = true;
    
    if (Object.keys(formData).length > 0) {
      const resetValues = {
        ...initialFormData,
        ...formData,
      } as TripFormValues; // Type assertion here
      
      form.reset(resetValues, { 
        keepErrors: false,
        keepDirty: true, 
        keepIsValid: true,
        keepTouched: true,
      });
    }
    
    // Reset flag after a short delay to allow form to stabilize
    const timer = setTimeout(() => {
      isUpdatingFromStore.current = false;
    }, 10);
    
    return () => clearTimeout(timer);
  }, [formData, form]);
  
  // Sync form changes back to Zustand store with debounce
  useEffect(() => {
    // Debounce timer
    let debounceTimer: NodeJS.Timeout | null = null;
    
    const subscription = form.watch((value) => {
      // Skip if update is coming from the store itself
      if (isUpdatingFromStore.current) return;
      
      // Clear previous timer
      if (debounceTimer) clearTimeout(debounceTimer);
      
      // Debounce updates to reduce frequency
      debounceTimer = setTimeout(() => {
        if (value && Object.keys(value).length > 0) {
          // FIX: Handle the type conversion properly
          updateFormData(JSON.parse(JSON.stringify(value)) as Partial<TripFormValues>);
        }
      }, 100); // 100ms debounce
    });
    
    return () => {
      subscription.unsubscribe();
      if (debounceTimer) clearTimeout(debounceTimer);
    };
  }, [form, updateFormData]);
  
  return form;
}