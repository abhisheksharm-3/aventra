"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { useOnboardingStore } from "@/stores/useOnboardingStore";
import { travelStyles } from "@/lib/constants/onboarding";

/**
 * Travel Style Selection Step
 * 
 * Allows users to select their preferred travel styles during onboarding.
 * Displays a grid of options with icons and descriptions using a modern, clean UI.
 * Features include:
 * - Visual selection indicators
 * - Interactive hover states
 * - Multi-selection capability
 * - Motion animations for smooth transitions
 * 
 * @component
 * @returns {JSX.Element} The rendered travel style selection component
 */
export function StepTravelStyle() {
  const { preferences, toggleTravelStyle } = useOnboardingStore();
  
  return (
    <motion.div
      key="travel-style"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Header section */}
      <div className="text-center mb-4">
        <h2 className="text-2xl font-medium mb-2">
          Your travel style
        </h2>
        <p className="text-muted-foreground text-sm">
          Select the experiences that match your preferences
        </p>
      </div>
      
      {/* Travel styles grid */}
      <div className="grid grid-cols-2 gap-3">
        {travelStyles.map((style) => (
          <button
            key={style.id}
            type="button"
            onClick={() => toggleTravelStyle(style.id)}
            className={`
              relative flex flex-col items-center text-center p-4 rounded-md border transition-colors
              ${preferences.travelStyle.includes(style.id)
                ? "border-primary bg-primary/5"
                : "border-border hover:border-muted-foreground/30 hover:bg-muted/30"
              }
            `}
          >
            {/* Icon */}
            <div className={`
              h-10 w-10 flex items-center justify-center mb-2
              ${preferences.travelStyle.includes(style.id) 
                ? "text-primary" 
                : "text-muted-foreground"
              }
            `}>
              {style.icon}
            </div>
            
            {/* Content */}
            <span className="font-medium text-sm mb-1">
              {style.name}
            </span>
            
            <p className="text-xs text-muted-foreground line-clamp-2">
              {style.description}
            </p>
            
            {/* Selection indicator */}
            {preferences.travelStyle.includes(style.id) && (
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
          Select all that apply to personalize your recommendations
        </p>
      </div>
    </motion.div>
  );
}