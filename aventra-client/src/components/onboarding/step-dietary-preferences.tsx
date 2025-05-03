"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { useOnboardingStore } from "@/stores/useOnboardingStore";
import { dietaryPreferences } from "@/lib/constants/onboarding";

/**
 * @component StepDietaryPreferences
 * @description A minimal component for selecting dietary preferences during onboarding.
 * 
 * @returns {JSX.Element} The rendered dietary preferences selection component
 */
export function StepDietaryPreferences() {
  const { preferences, toggleDietaryPreference } = useOnboardingStore();
  
  return (
    <motion.div
      key="dietary"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Header section */}
      <div className="text-center mb-4">
        <h2 className="text-2xl font-medium mb-2">
          Dietary preferences
        </h2>
        <p className="text-muted-foreground text-sm">
          Help us find dining experiences tailored to your needs
        </p>
      </div>
      
      {/* Dietary preferences grid */}
      <div className="grid grid-cols-2 gap-3">
        {dietaryPreferences.map((diet) => (
          <button
            key={diet.id}
            type="button"
            onClick={() => toggleDietaryPreference(diet.id)}
            className={`
              relative flex flex-col items-center text-center p-4 rounded-md border transition-colors
              ${preferences.dietaryPreferences.includes(diet.id)
                ? "border-primary bg-primary/5"
                : "border-border hover:border-muted-foreground/30 hover:bg-muted/30"
              }
            `}
          >
            {/* Icon */}
            <div className={`
              h-10 w-10 flex items-center justify-center mb-2
              ${preferences.dietaryPreferences.includes(diet.id) 
                ? "text-primary" 
                : "text-muted-foreground"
              }
            `}>
              {diet.icon}
            </div>
            
            {/* Content */}
            <span className="font-medium text-sm mb-1">
              {diet.name}
            </span>
            
            <p className="text-xs text-muted-foreground line-clamp-2">
              {diet.description}
            </p>
            
            {/* Selection indicator */}
            {preferences.dietaryPreferences.includes(diet.id) && (
              <div className="absolute top-2 right-2">
                <div className="h-4 w-4 rounded-full bg-primary flex items-center justify-center">
                  <Check className="h-2.5 w-2.5 text-primary-foreground" />
                </div>
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Helper text */}
      <div className="text-center">
        <p className="text-xs text-muted-foreground">
          Select any dietary restrictions that apply
        </p>
      </div>
    </motion.div>
  );
}