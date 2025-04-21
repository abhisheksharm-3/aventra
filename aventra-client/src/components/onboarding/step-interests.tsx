"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { useOnboardingStore } from "@/stores/useOnboardingStore";
import { preferenceTypes } from "@/lib/constants/onboarding";

/**
 * @component StepInterests
 * @description A premium component for selecting user preferences during onboarding.
 * Users can select their aesthetic preferences and experience types they're interested in.
 * The component features animated transitions and a responsive grid layout.
 * 
 * @returns {JSX.Element} The rendered interests selection component
 */
export function StepInterests() {
  const { preferences, toggleInterest } = useOnboardingStore();
  

  return (
    <motion.div
      key="interests"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="relative space-y-8 max-w-4xl mx-auto px-4"
    >
      {/* Decorative background elements */}
      <div className="absolute -z-10 top-0 left-0 w-full h-full overflow-hidden">
        <div className="absolute top-1/3 -left-20 w-60 h-60 bg-gradient-to-r from-primary/10 to-primary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 right-10 w-40 h-40 bg-gradient-to-l from-secondary/10 to-secondary/5 rounded-full blur-3xl" />
      </div>

      {/* Header section */}
      <div className="text-center pt-3">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <h2 className="text-3xl font-bold mb-3 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            What&apos;s Your Vibe?
          </h2>
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="text-muted-foreground text-lg max-w-md mx-auto leading-relaxed"
        >
          Select the experiences and aesthetics that resonate with you
        </motion.p>
      </div>
      
      {/* Preferences grid with staggered animation */}
      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 py-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        {preferenceTypes.map((type, index) => (
          <motion.button
            key={type.id}
            type="button"
            onClick={() => toggleInterest(type.id)}
            className={`${
              preferences.interests.includes(type.id)
                ? "bg-primary/8 border-primary shadow-md shadow-primary/10"
                : "bg-card/60 hover:bg-accent/30 border-border/60 hover:border-border"
            } group relative flex flex-col items-center text-left p-6 rounded-xl backdrop-blur-sm border transition-all duration-300`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index, duration: 0.4 }}
            whileHover={{ translateY: -4 }}
          >
            <div className={`h-14 w-14 rounded-full flex items-center justify-center mb-4 ${
              preferences.interests.includes(type.id) 
                ? "bg-primary/15 text-primary" 
                : "bg-background/80 text-foreground group-hover:bg-primary/10 group-hover:text-primary"
            } transition-colors duration-300`}>
              {type.icon}
            </div>
            
            <span className="font-medium text-lg">{type.name}</span>
            <p className="text-xs text-muted-foreground mt-1.5">{type.description}</p>
            
            {preferences.interests.includes(type.id) && (
              <motion.div 
                className="absolute top-3 right-3 h-6 w-6 bg-primary rounded-full flex items-center justify-center"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 15 }}
              >
                <Check className="h-4 w-4 text-white" />
              </motion.div>
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
        <p className="text-muted-foreground text-sm font-light italic">
          Select all that apply. You can always change these preferences later.
        </p>
      </motion.div>
    </motion.div>
  );
}