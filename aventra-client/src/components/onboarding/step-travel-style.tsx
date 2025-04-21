"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { useOnboardingStore } from "@/stores/useOnboardingStore";
import { travelStyles } from "@/lib/constants/onboarding";

/**
 * @component StepTravelStyle
 * @description A premium component for selecting travel style preferences during onboarding.
 * Users can select multiple travel styles that match their preferences.
 * Features animated transitions, hover effects, and responsive design.
 * 
 * @returns {JSX.Element} The rendered travel style selection component
 */
export function StepTravelStyle() {
  const { preferences, toggleTravelStyle } = useOnboardingStore();
  
  return (
    <motion.div
      key="travel-style"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="relative space-y-8 max-w-4xl mx-auto px-4"
    >
      {/* Decorative background elements */}
      <div className="absolute -z-10 top-0 left-0 w-full h-full overflow-hidden">
        <div className="absolute bottom-1/4 -left-32 w-64 h-64 bg-gradient-to-r from-primary/10 to-primary/5 rounded-full blur-3xl" />
        <div className="absolute top-1/4 -right-20 w-48 h-48 bg-gradient-to-l from-secondary/10 to-secondary/5 rounded-full blur-3xl" />
      </div>

      {/* Header section */}
      <div className="text-center pt-3">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <h2 className="text-3xl font-bold mb-3 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            What&apos;s Your Travel Style?
          </h2>
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="text-muted-foreground text-lg max-w-md mx-auto leading-relaxed"
        >
          Select the experiences that match your preferences
        </motion.p>
      </div>
      
      {/* Travel styles grid with staggered animation */}
      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 py-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        {travelStyles.map((style, index) => (
          <motion.button
            key={style.id}
            type="button"
            onClick={() => toggleTravelStyle(style.id)}
            className={`${
              preferences.travelStyle.includes(style.id)
                ? "bg-primary/8 border-primary shadow-md shadow-primary/10"
                : "bg-card/60 hover:bg-accent/30 border-border/60 hover:border-border"
            } group relative flex flex-col items-center text-left p-6 rounded-xl backdrop-blur-sm border transition-all duration-300`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index, duration: 0.4 }}
            whileHover={{ translateY: -4 }}
            whileTap={{ scale: 0.98 }}
          >
            {/* Icon container */}
            <div className={`h-16 w-16 rounded-full flex items-center justify-center mb-4 ${
              preferences.travelStyle.includes(style.id) 
                ? "bg-primary/15 text-primary" 
                : "bg-background/80 text-foreground group-hover:bg-primary/10 group-hover:text-primary"
            } transition-colors duration-300`}>
              {style.icon}
            </div>
            
            {/* Content */}
            <div className="flex flex-col items-center text-center">
              <span className="font-medium text-lg mb-1">{style.name}</span>
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                {style.description}
              </p>
            </div>
            
            {/* Selection indicator */}
            {preferences.travelStyle.includes(style.id) && (
              <motion.div 
                className="absolute top-3 right-3 h-6 w-6 bg-primary rounded-full flex items-center justify-center"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 15 }}
              >
                <Check className="h-4 w-4 text-white" />
              </motion.div>
            )}

            {/* Selection ring animation */}
            {preferences.travelStyle.includes(style.id) && (
              <motion.div 
                className="absolute inset-0 rounded-xl border-2 border-primary"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              />
            )}
          </motion.button>
        ))}
      </motion.div>

      {/* Helper text */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.4 }}
        className="text-center mt-2"
      >
        <p className="text-muted-foreground text-sm italic">
          Select all that apply to personalize your adventure recommendations
        </p>
        
        {/* Progress indicator dots */}
        <div className="mt-6 inline-flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-muted/40 inline-block" />
          <span className="w-1.5 h-1.5 rounded-full bg-muted/40 inline-block" />
          <span className="w-1.5 h-1.5 rounded-full bg-primary/60 inline-block" />
          <span className="w-1.5 h-1.5 rounded-full bg-muted/40 inline-block" />
        </div>
      </motion.div>
    </motion.div>
  );
}