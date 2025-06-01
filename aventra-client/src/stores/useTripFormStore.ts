/* eslint-disable @typescript-eslint/no-unused-vars */
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
  // New method specific for traveler updates
  updateTravelers: (
    adults?: number,
    children?: number,
    infants?: number
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
          set((state) => {
            // If data contains travelers, ensure count is synchronized
            if (data.travelers) {
              const { adults = 0, children = 0, infants = 0 } = {
                ...state.formData.travelers,
                ...data.travelers,
              };
              
              data.travelers = {
                ...data.travelers,
                count: adults + children + infants, // Ensure count is always up-to-date
              };
            }
            
            return {
              formData: {
                ...state.formData,
                ...data,
              },
            };
          }),
          
        updateField: (field, value) =>
          set((state) => ({
            formData: {
              ...state.formData,
              [field]: value,
            },
          })),
        
        // Specialized method for updating travelers that ensures count stays in sync
        updateTravelers: (adults, children, infants) =>
          set((state) => {
            const currentTravelers = state.formData.travelers || {
              count: 1,
              adults: 1,
              children: 0,
              infants: 0,
            };
            
            // Use current values for any undefined parameters
            const newAdults = adults !== undefined ? adults : currentTravelers.adults || 0;
            const newChildren = children !== undefined ? children : currentTravelers.children || 0;
            const newInfants = infants !== undefined ? infants : currentTravelers.infants || 0;
            
            // Calculate the new count
            const newCount = newAdults + newChildren + newInfants;
            
            return {
              formData: {
                ...state.formData,
                travelers: {
                  count: newCount,
                  adults: newAdults,
                  children: newChildren,
                  infants: newInfants,
                }
              }
            };
          }),
          
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
  const { formData, updateFormData, updateTravelers } = useTripFormStore();
  // Flag to prevent circular updates
  const isUpdatingFromStore = useRef(false);
  // Track if form has been initialized from store
  const isFormInitialized = useRef(false);
  
  const form = useForm<TripFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any 
    resolver: zodResolver(tripFormSchema as any),
    defaultValues: {
      ...initialFormData,
      ...formData,
    } as TripFormValues,
    mode: "onChange",
  });
  
  // Initialize form values from store ONLY ONCE on first render
  useEffect(() => {
    if (!isFormInitialized.current && Object.keys(formData).length > 0) {
      isUpdatingFromStore.current = true;
      
      const resetValues = {
        ...initialFormData,
        ...formData,
      } as TripFormValues;
      
      form.reset(resetValues, { 
        keepErrors: false,
        keepDirty: true, 
        keepIsValid: true,
        keepTouched: true,
      });
      
      isFormInitialized.current = true;
      
      // Reset flag after a short delay
      setTimeout(() => {
        isUpdatingFromStore.current = false;
      }, 10);
    }
  }, [formData, form]);
  
  // Special watcher for traveler fields to ensure count stays in sync
  useEffect(() => {
    const subscription = form.watch(({ travelers }) => {
      if (isUpdatingFromStore.current || !travelers) return;
      
      // Extract traveler values
      const { adults, children, infants } = travelers;
      
      // Only update if we have valid numbers
      if (
        typeof adults === 'number' && 
        typeof children === 'number' && 
        typeof infants === 'number'
      ) {
        // Use the dedicated method to update travelers with synchronized count
        updateTravelers(adults, children, infants);
      }
    });
    
    return () => subscription.unsubscribe();
  }, [form, updateTravelers]);
  
  // Sync other form changes back to Zustand store with debounce
  useEffect(() => {
    // Debounce timer
    let debounceTimer: NodeJS.Timeout | null = null;
    
    const subscription = form.watch((value, { name }) => {
      // Skip if update is coming from the store itself
      if (isUpdatingFromStore.current) return;
      
      // Skip traveler updates as they're handled separately
      if (name && name.startsWith('travelers.')) return;
      
      // Clear previous timer
      if (debounceTimer) clearTimeout(debounceTimer);
      
      // Debounce updates to reduce frequency
      debounceTimer = setTimeout(() => {
        if (value && Object.keys(value).length > 0) {
          // Special handling for traveler fields to avoid overwriting the synchronized values
          if (value.travelers) {
            // Remove travelers from immediate update as it's handled separately
            const { travelers, ...rest } = value;
            updateFormData(JSON.parse(JSON.stringify(rest)) as Partial<TripFormValues>);
          } else {
            updateFormData(JSON.parse(JSON.stringify(value)) as Partial<TripFormValues>);
          }
        }
      }, 300); // Increased debounce to 300ms for better typing experience
    });
    
    return () => {
      subscription.unsubscribe();
      if (debounceTimer) clearTimeout(debounceTimer);
    };
  }, [form, updateFormData]);
  
  // Add utility method to manually sync travelers
  const syncTravelers = () => {
    const travelers = form.getValues('travelers');
    if (travelers) {
      const { adults = 0, children = 0, infants = 0 } = travelers;
      updateTravelers(adults, children, infants);
    }
  };
  
  // Return the form with the added utility
  return {
    ...form,
    syncTravelers,
  };
}