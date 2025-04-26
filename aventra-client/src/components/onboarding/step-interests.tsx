"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { useOnboardingStore } from "@/stores/useOnboardingStore";
import { preferenceTypes } from "@/lib/constants/onboarding";

/**
 * @component StepInterests
 * @description A minimal component for selecting user interests during onboarding.
 * Users can select their preferences from a clean, focused grid.
 * 
 * @returns {JSX.Element} The rendered interests selection component
 */
export function StepInterests() {
  const { preferences, toggleInterest } = useOnboardingStore();

  return (
    <motion.div
      key="interests"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Header section */}
      <div className="text-center mb-4">
        <h2 className="text-2xl font-medium mb-2">
          What interests you?
        </h2>
        <p className="text-muted-foreground text-sm">
          Select the experiences that resonate with you
        </p>
      </div>
      
      {/* Preferences grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 py-2">
        {preferenceTypes.map((type) => (
          <button
            key={type.id}
            type="button"
            onClick={() => toggleInterest(type.id)}
            className={`
              flex items-center p-4 rounded-md border transition-colors
              ${preferences.interests.includes(type.id)
                ? "border-primary bg-primary/5"
                : "border-border hover:border-muted-foreground/30 hover:bg-muted/30"
              }
            `}
          >
            <div className={`
              h-10 w-10 flex items-center justify-center mr-3
              ${preferences.interests.includes(type.id) 
                ? "text-primary" 
                : "text-muted-foreground"
              }
            `}>
              {type.icon}
            </div>
            
            <div className="text-left">
              <div className="font-medium">{type.name}</div>
              <p className="text-xs text-muted-foreground mt-0.5">{type.description}</p>
            </div>
            
            {preferences.interests.includes(type.id) && (
              <div className="ml-auto">
                <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                  <Check className="h-3 w-3 text-primary-foreground" />
                </div>
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Helper text */}
      <div className="text-center mt-2">
        <p className="text-xs text-muted-foreground">
          Select all that apply. You can change these preferences later.
        </p>
      </div>
    </motion.div>
  );
}