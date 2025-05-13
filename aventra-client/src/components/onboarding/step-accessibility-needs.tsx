"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { useOnboardingStore } from "@/stores/useOnboardingStore";

/**
 * Accessibility needs options
 */
const accessibilityOptions = [
  {
    id: "mobility",
    name: "Mobility Considerations",
    description: "Wheelchair access, minimal stairs, accessible transportation"
  },
  {
    id: "vision",
    name: "Visual Accommodations",
    description: "Audio descriptions, tactile experiences, guided assistance"
  },
  {
    id: "hearing",
    name: "Hearing Accommodations",
    description: "Visual information, captioning, sign language options"
  },
  {
    id: "sensory",
    name: "Sensory Sensitivity",
    description: "Quiet spaces, low-stimulation environments, predictable routines"
  },
  {
    id: "none",
    name: "No Specific Needs",
    description: "No accessibility accommodations required at this time"
  }
];

/**
 * Accessibility Needs Selection Step
 * 
 * Allows users to select their accessibility requirements during onboarding.
 * 
 * @returns {JSX.Element} The rendered accessibility needs component
 */
export function StepAccessibility() {
  const { preferences, toggleAccessibilityNeed } = useOnboardingStore();

  return (
    <motion.div
      key="accessibility"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Header section */}
      <div className="text-center mb-4">
        <h2 className="text-2xl font-medium mb-2">
          Accessibility Needs
        </h2>
        <p className="text-muted-foreground text-sm">
          Select any accessibility considerations for your trips
        </p>
      </div>
      
      {/* Accessibility options grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 py-2">
        {accessibilityOptions.map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => toggleAccessibilityNeed(option.id)}
            className={`
              flex items-center p-4 rounded-md border transition-colors
              ${preferences.accessibilityNeeds.includes(option.id)
                ? "border-primary bg-primary/5"
                : "border-border hover:border-muted-foreground/30 hover:bg-muted/30"
              }
            `}
          >
            <div className="text-left flex-1">
              <div className="font-medium">{option.name}</div>
              <p className="text-xs text-muted-foreground mt-0.5">{option.description}</p>
            </div>
            
            {preferences.accessibilityNeeds.includes(option.id) && (
              <div className="ml-3">
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
          This information helps us recommend suitable destinations and activities.
        </p>
      </div>
    </motion.div>
  );
}