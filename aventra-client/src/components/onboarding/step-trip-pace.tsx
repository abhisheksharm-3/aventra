"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { useOnboardingStore } from "@/stores/useOnboardingStore";

/**
 * Trip pace options with descriptions
 */
const paceOptions = [
  {
    id: "relaxed",
    name: "Relaxed",
    description: "Plenty of downtime, leisurely exploration, minimal daily activities",
    icon: "🌴"
  },
  {
    id: "moderate",
    name: "Moderate",
    description: "Mix of activities with adequate rest periods, moderate daily schedule",
    icon: "⚖️"
  },
  {
    id: "fast",
    name: "Fast",
    description: "Full daily itinerary, energetic exploration, maximizing experiences",
    icon: "🏃"
  },
];

/**
 * Trip Pace Selection Step
 * 
 * Allows users to select their preferred travel pace during onboarding.
 * 
 * @returns {JSX.Element} The rendered trip pace selection component
 */
export function StepTripPace() {
  const { preferences, setTripPace } = useOnboardingStore();

  return (
    <motion.div
      key="tripPace"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Header section */}
      <div className="text-center mb-4">
        <h2 className="text-2xl font-medium mb-2">
          How do you like to travel?
        </h2>
        <p className="text-muted-foreground text-sm">
          Select your preferred pace for exploring destinations
        </p>
      </div>
      
      {/* Pace options */}
      <div className="grid grid-cols-1 gap-3 py-2">
        {paceOptions.map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => setTripPace(option.id)}
            className={`
              flex items-center p-4 rounded-md border transition-colors
              ${preferences.tripPace === option.id
                ? "border-primary bg-primary/5"
                : "border-border hover:border-muted-foreground/30 hover:bg-muted/30"
              }
            `}
          >
            <div className="text-2xl min-w-[40px] mr-3 text-center">
              {option.icon}
            </div>
            
            <div className="text-left">
              <div className="font-medium">{option.name}</div>
              <p className="text-xs text-muted-foreground mt-0.5">{option.description}</p>
            </div>
            
            {preferences.tripPace === option.id && (
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
          This helps us create itineraries that match your energy level.
        </p>
      </div>
    </motion.div>
  );
}