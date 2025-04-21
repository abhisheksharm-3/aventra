"use client";

import { motion } from "framer-motion";
import Image from "next/image";

/**
 * @component StepWelcome
 * @description A premium welcome screen component for the Aventra onboarding process.
 * This component displays an animated welcome message, illustration, and onboarding progress indicator.
 * It uses motion animations for a polished experience and responsive design for different screen sizes.
 * 
 * @returns {JSX.Element} The rendered welcome step component
 */
export function StepWelcome() {
  return (
    <motion.div
      key="welcome"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="relative space-y-8 max-w-3xl mx-auto px-4"
    >
      {/* Decorative background elements */}
      <div className="absolute -z-10 top-0 left-0 w-full h-full overflow-hidden">
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-gradient-to-r from-primary/20 to-primary/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -right-20 w-60 h-60 bg-gradient-to-l from-secondary/20 to-secondary/5 rounded-full blur-3xl" />
      </div>

      {/* Title section with staggered animation */}
      <div className="text-center pt-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <h2 className="text-3xl font-bold mb-3 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Welcome to Aventra
          </h2>
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.4 }}
          className="text-muted-foreground text-lg max-w-md mx-auto leading-relaxed"
        >
          Let&apos;s personalize your experience to help you discover the perfect adventures
        </motion.p>
      </div>
      
      {/* Main illustration with premium effects */}
      <motion.div 
        className="flex justify-center my-12"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6, ease: "easeOut" }}
      >
        <div className="relative w-64 h-64 md:w-80 md:h-80 lg:w-[400px] lg:h-[400px] drop-shadow-xl">
          <div className="absolute inset-0 bg-gradient-to-b from-background to-transparent z-10 opacity-20 rounded-full" />
          <Image 
            src="/images/illustrations/onboarding.svg" 
            alt="Welcome to Aventra" 
            fill
            priority
            className="object-cover filter backdrop-blur-sm z-0"
          />
          <div className="absolute -inset-0.5 bg-gradient-to-br from-primary/30 to-secondary/30 rounded-full blur opacity-30 -z-10" />
        </div>
      </motion.div>
      
      {/* Footer text and progress indicator */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.4 }}
        className="text-center"
      >
        <p className="text-muted-foreground max-w-md mx-auto text-sm italic font-light border-t border-muted/20 pt-4 mt-2">
          This will only take a minute to complete and help us provide you with personalized recommendations.
        </p>
        
        {/* Progress indicator dots */}
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.4 }}
          className="mt-6"
        >
          <div className="inline-flex items-center gap-1 text-xs text-muted-foreground/80">
            <span className="w-1.5 h-1.5 rounded-full bg-primary/60 inline-block" />
            <span className="w-1.5 h-1.5 rounded-full bg-muted/40 inline-block" />
            <span className="w-1.5 h-1.5 rounded-full bg-muted/40 inline-block" />
            <span className="w-1.5 h-1.5 rounded-full bg-muted/40 inline-block" />
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}