"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import { CheckCircle, Loader2 } from "lucide-react";
import Image from "next/image";

// UI Components
import { Button } from "@/components/ui/button";
import Layout from "@/components/layout/Layout";

// Store
import { useOnboardingStore } from "@/stores/useOnboardingStore";

// Onboarding Step Components
import { StepWelcome } from "@/components/onboarding/step-welcome";
import { StepInterests } from "@/components/onboarding/step-interests";
import { StepBaseCity } from "@/components/onboarding/step-base-city";
import { StepTravelStyle } from "@/components/onboarding/step-travel-style";
import { StepDietaryPreferences } from "@/components/onboarding/step-dietary-preferences";
import { StepBudgetAndAI } from "@/components/onboarding/step-budget-ai";
import { StepTripPace } from "@/components/onboarding/step-trip-pace";
import { StepAccessibility } from "@/components/onboarding/step-accessibility-needs";

// Animation variants
const pageVariants = {
  initial: (direction: 'forward' | 'backward') => ({
    opacity: 0,
    x: direction === 'forward' ? 10 : -10,
  }),
  animate: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.3 }
  },
  exit: (direction: 'forward' | 'backward') => ({
    opacity: 0,
    x: direction === 'forward' ? -10 : 10,
    transition: { duration: 0.2 }
  })
};

/**
 * Onboarding Page Component
 * 
 * Multi-step onboarding flow to collect user preferences and settings
 * 
 * @returns {JSX.Element} The onboarding page
 */
export default function OnboardingPage() {
  const router = useRouter();
  const { 
    step, 
    nextStep, 
    prevStep, 
    preferences,
    isSubmitting,
    setIsSubmitting,
    error,
    setError
  } = useOnboardingStore();
  
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward');
  const [showCompletionAnimation, setShowCompletionAnimation] = useState(false);
  
  const totalSteps = 8;
  
  // Initialize onboarding - check status and load preferences
  useEffect(() => {
    const initOnboarding = async () => {
      try {
        // Safely access store methods
        const store = useOnboardingStore.getState();
        
        // Check if checkOnboardingStatus exists before calling it
        if (typeof store.checkOnboardingStatus === 'function') {
          const completed = await store.checkOnboardingStatus();
          
          if (completed) {
            router.push('/dashboard');
            return;
          }
        }
        
        // Check if loadUserPreferences exists before calling it
        if (typeof store.loadUserPreferences === 'function') {
          await store.loadUserPreferences();
        }
      } catch (error) {
        console.error('Error initializing onboarding:', error);
      }
    };
    
    initOnboarding();
  }, [router]);
  
  // Check if current step allows proceeding
  const canProceed = useCallback((): boolean => {
    if (step === 2 && preferences.interests.length === 0) return false;
    if (step === 3 && !preferences.baseCity.trim()) return false;
    return true;
  }, [step, preferences.interests, preferences.baseCity]);
  
  // Handle advancing to next step
  const handleNext = useCallback(() => {
    if (!canProceed()) {
      if (step === 2) toast.error("Please select at least one interest");
      if (step === 3) toast.error("Please enter your home city");
      return;
    }
    
    setDirection('forward');
    nextStep();
  }, [canProceed, step, nextStep]);
  
  // Handle going back to previous step  
  const handlePrev = useCallback(() => {
    setDirection('backward');
    prevStep();
  }, [prevStep]);
  
  // Handle keyboard navigation  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isSubmitting) return;
      
      if (e.key === "ArrowRight" && canProceed()) {
        e.preventDefault();
        handleNext();
      } else if (e.key === "ArrowLeft" && step > 1) {
        e.preventDefault();
        handlePrev();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [step, isSubmitting, canProceed, handleNext, handlePrev]);
  
  // Get step title for display
  const getStepTitle = (stepNum: number): string => {
    switch (stepNum) {
      case 1: return "Welcome";
      case 2: return "Interests";
      case 3: return "Location";
      case 4: return "Travel Style";
      case 5: return "Trip Pace";
      case 6: return "Dietary Preferences";
      case 7: return "Accessibility";
      case 8: return "Budget & Settings";
      default: return "";
    }
  };
  
  // Handle form submission
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    // If not on the last step, advance to next step
    if (step < totalSteps) {
      handleNext();
      return;
    }
    
    // Submit preferences to server
    try {
      setIsSubmitting(true);
      setShowCompletionAnimation(true);
      
      // Get store instance
      const store = useOnboardingStore.getState();
      // Initialize result with default values
      let result: { success: boolean; error?: string } = { success: false };
      
      // Check if submitOnboarding exists before calling it
      if (typeof store.submitOnboarding === 'function') {
        result = await store.submitOnboarding();
      }
      
      if (result.success) {
        // Delay redirect to show completion animation
        setTimeout(() => {
          router.push("/dashboard");
          toast.success("Preferences saved");
        }, 1000);
      } else {
        setShowCompletionAnimation(false);
        setError(result.error || "Failed to save preferences");
        toast.error(result.error || "Failed to save preferences");
      }
    } catch (err) {
      setShowCompletionAnimation(false);
      console.error("Onboarding submission error:", err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      if (!showCompletionAnimation) {
        setIsSubmitting(false);
      }
    }
  };
  
  // Handle skip onboarding
  const handleSkip = async () => {
    try {
      setIsSubmitting(true);
      toast.info("Setting up with default preferences");
      
      // Get store instance
      const store = useOnboardingStore.getState();
      // Initialize result with default values
      let result: { success: boolean; error?: string } = { success: false };
      
      // Check if skipOnboarding exists before calling it
      if (typeof store.skipOnboarding === 'function') {
        result = await store.skipOnboarding();
      }
      
      if (result.success) {
        router.push("/dashboard");
      } else {
        toast.error("Failed to skip onboarding");
      }
    } catch (err) {
      console.error("Skip onboarding error:", err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show error toast when error state changes
  useEffect(() => {
    if (error) {
      toast.error(error);
      setError(null);
    }
  }, [error, setError]);

  // Render the step component based on current step
  const renderStepComponent = () => {
    switch (step) {
      case 1: return <StepWelcome />;
      case 2: return <StepInterests />;
      case 3: return <StepBaseCity />;
      case 4: return <StepTravelStyle />;
      case 5: return <StepTripPace />;
      case 6: return <StepDietaryPreferences />;
      case 7: return <StepAccessibility />;
      case 8: return <StepBudgetAndAI />;
      default: return null;
    }
  };

  return (
    <Layout className="min-h-screen flex items-center justify-center bg-background">
      <div className="relative z-10 w-full max-w-xl mx-auto px-4 py-8">
        {/* Success animation modal */}
        <AnimatePresence>
          {showCompletionAnimation && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-background/60 backdrop-blur-sm"
            >
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex flex-col items-center"
              >
                <div className="bg-primary/10 rounded-full p-4">
                  <CheckCircle className="h-8 w-8 text-primary" />
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Header with logo */}
        <div className="flex flex-col items-center mb-8">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-10"
          >
            <Image
              src="/logo.png"
              alt="Logo"
              width={100}
              height={26}
              className="w-auto h-7"
              priority
            />
          </motion.div>
          
          {/* Progress indicator */}
          <div className="w-full space-y-3">
            <div className="flex justify-between mb-1 px-1">
              <span className="text-sm font-medium">
                {getStepTitle(step)}
              </span>
              <span className="text-sm text-muted-foreground">
                {step} / {totalSteps}
              </span>
            </div>
            
            <div className="relative h-0.5 w-full bg-muted">
              <motion.div
                className="absolute top-0 left-0 h-full bg-primary"
                initial={{ width: `${((step - 1) / totalSteps) * 100}%` }}
                animate={{ width: `${(step / totalSteps) * 100}%` }}
                transition={{ duration: 0.3 }}
                aria-hidden="true"
              />
            </div>
          </div>
        </div>

        {/* Main form */}
        <form onSubmit={handleSubmit}>
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="bg-card border border-border rounded-lg p-6 shadow-sm overflow-hidden"
          >
            {/* Step content */}
            <div className="min-h-[340px]">
              <AnimatePresence initial={false} custom={direction} mode="wait">
                <motion.div
                  key={step}
                  custom={direction}
                  variants={pageVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                >
                  {renderStepComponent()}
                </motion.div>
              </AnimatePresence>
            </div>
            
            {/* Navigation buttons */}
            <div className="flex justify-between items-center mt-8">
              {step > 1 ? (
                <Button 
                  type="button" 
                  variant="ghost" 
                  onClick={handlePrev} 
                  disabled={isSubmitting}
                  className="text-muted-foreground hover:text-foreground"
                >
                  Back
                </Button>
              ) : (
                <div />
              )}
              
              <Button 
                type="submit"
                disabled={isSubmitting || 
                  (step === 2 && preferences.interests.length === 0) ||
                  (step === 3 && !preferences.baseCity.trim())
                }
                className="min-w-[100px]"
              >
                {isSubmitting 
                  ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Working</>
                  : step < totalSteps 
                    ? <span>Continue</span>
                    : "Complete"
                }
              </Button>
            </div>
          </motion.div>
        </form>
        
        {/* Skip link */}
        {step > 1 && (
          <div className="text-center mt-6">
            <Button 
              variant="link" 
              size="sm" 
              onClick={handleSkip}
              disabled={isSubmitting}
              className="text-muted-foreground"
            >
              Skip personalization
            </Button>
          </div>
        )}
        
        {/* Keyboard navigation hint */}
        <div className="text-center mt-2">
          <p className="text-xs text-muted-foreground">
            Use arrow keys to navigate
          </p>
        </div>
      </div>
    </Layout>
  );
}