"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { tripFormSchema, TripFormValues } from "@/lib/validations/trip-schema";
import { create } from "zustand";

export const useTripStore = create<{
  formData: Partial<TripFormValues>;
  updateFormData: (data: Partial<TripFormValues>) => void;
}>((set) => ({
  formData: {
    travelers: {
      count: 2,
      adults: 2,
      children: 0,
      infants: 0,
    },
    tripStyle: ["adventure"],
    preferences: {
      pace: "moderate",
    },
  },
  updateFormData: (data) =>
    set((state) => ({
      formData: { ...state.formData, ...data },
    })),
}));

export function useTripForm() {
  const { formData, updateFormData } = useTripStore();
  
  const form = useForm<TripFormValues>({
    // @ts-expect-error - Bypass TypeScript error for zodResolver compatibility, will fix
    resolver: zodResolver(tripFormSchema),
    defaultValues: formData as TripFormValues,
    mode: "onChange",
  });
  
  // Sync form data with Zustand store
  useEffect(() => {
    const subscription = form.watch((value) => {
      updateFormData(value as Partial<TripFormValues>);
    });
    
    return () => subscription.unsubscribe();
  }, [form, updateFormData]);
  
  return form;
}