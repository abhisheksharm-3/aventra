"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import { toast } from "sonner";

// UI Components
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

// Store and Server Actions
import { useOnboardingStore } from "@/stores/useOnboardingStore";
import { completeOnboarding, skipOnboarding } from "@/controllers/OnboardingController";

// Onboarding Step Components
import { StepWelcome } from "@/components/onboarding/step-welcome";
import { StepInterests } from "@/components/onboarding/step-interests";
import { StepBaseCity } from "@/components/onboarding/step-base-city"; // Import the new component
import { StepTravelStyle } from "@/components/onboarding/step-travel-style";
import { StepDietaryPreferences } from "@/components/onboarding/step-dietary-preferences";
import { StepBudgetAndAI } from "@/components/onboarding/step-budget-ai";
import Layout from "@/components/layout/Layout";
import Image from "next/image";

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
  
  const totalSteps = 6; // Update to 6 steps total
  
  // Handle form submission
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    // Validation
    if (step === 2 && preferences.interests.length === 0) {
      toast.error("Please select at least one interest");
      return;
    }
    
    // Base city validation
    if (step === 3 && !preferences.baseCity.trim()) {
      toast.error("Please enter your home city");
      return;
    }
    
    // If not on the last step, go to next step
    if (step < totalSteps) {
      nextStep();
      return;
    }
    
    // Submit preferences to server
    try {
      setIsSubmitting(true);
      
      // Create FormData and append preferences
      const formData = new FormData();
      formData.append("interests", JSON.stringify(preferences.interests));
      formData.append("travelStyle", JSON.stringify(preferences.travelStyle));
      formData.append("dietaryPreferences", JSON.stringify(preferences.dietaryPreferences));
      formData.append("budget", preferences.budget.toString());
      formData.append("useAI", preferences.useAI.toString());
      formData.append("baseCity", preferences.baseCity); // Add baseCity
      
      const result = await completeOnboarding(formData);
      
      if (result.success) {
        router.push("/dashboard");
        toast.success("Onboarding completed successfully!");
      } else {
        setError(result.error || "Something went wrong. Please try again.");
        toast.error(result.error || "Failed to save preferences");
      }
    } catch (err) {
      console.error("Onboarding submission error:", err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handle skip onboarding
  const handleSkip = async () => {
    try {
      setIsSubmitting(true);
      const result = await skipOnboarding();
      
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

  return (
    <Layout className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Glassmorphism background overlay */}
      <div className="absolute inset-0 bg-background/60 backdrop-blur-[2px]" />
      
      {/* Content container */}
      <div className="relative z-10 w-full max-w-3xl mx-auto px-4 py-12">
        {/* Header with logo and progress */}
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center mb-6">
            <Image
              src="/logo.png"
              alt="Logo"
              width={100}
              height={26}
              className="w-auto h-6 md:h-7"
              priority
            />
          </div>
          
          <div className="w-full mb-2">
            <Progress value={(step / totalSteps) * 100} className="h-1" />
          </div>
          <p className="text-sm text-muted-foreground">
            Step {step} of {totalSteps}
          </p>
        </div>

        {/* Main form */}
        <form onSubmit={handleSubmit}>
          {/* Glassmorphism card */}
          <div className="bg-background/70 backdrop-blur-md border border-border/50 rounded-2xl shadow-lg p-8">
            <AnimatePresence mode="wait">
              {/* Step content */}
              {step === 1 && <StepWelcome />}
              {step === 2 && <StepInterests />}
              {step === 3 && <StepBaseCity />} {/* Add the base city step */}
              {step === 4 && <StepTravelStyle />}
              {step === 5 && <StepDietaryPreferences />}
              {step === 6 && <StepBudgetAndAI />}
            </AnimatePresence>
            
            {/* Navigation buttons */}
            <div className="flex justify-between mt-8">
              {step > 1 ? (
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={prevStep} 
                  disabled={isSubmitting}
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
              >
                {isSubmitting 
                  ? "Saving..." 
                  : step < totalSteps 
                    ? "Continue" 
                    : "Complete Setup"
                }
              </Button>
            </div>
          </div>
        </form>
        
        {/* Skip onboarding link */}
        {step > 1 && (
          <div className="text-center mt-4">
            <Button 
              variant="link" 
              size="sm" 
              onClick={handleSkip}
              disabled={isSubmitting}
              className="text-muted-foreground"
            >
              Skip for now
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
}