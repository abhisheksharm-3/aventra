"use client";

import { motion } from "framer-motion";
import { Sparkles, BadgeCheck, CircleDollarSign } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { useOnboardingStore } from "@/stores/useOnboardingStore";

/**
 * @component StepBudgetAndAI
 * @description A minimal component for setting budget preferences during onboarding.
 * 
 * @returns {JSX.Element} The rendered budget & AI component
 */
export function StepBudgetAndAI() {
  const { preferences, setBudget } = useOnboardingStore();
  
  const getBudgetLabel = (value: number) => {
    if (value <= 25) return "Budget-conscious";
    if (value <= 50) return "Mid-range";
    if (value <= 75) return "Premium";
    return "Luxury";
  };

  const budgetPercentage = preferences.budget;
  
  return (
    <motion.div
      key="budget-ai"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-5"
    >
      {/* Header section */}
      <div className="text-center mb-4">
        <h2 className="text-2xl font-medium mb-2">
          Final preferences
        </h2>
        <p className="text-muted-foreground text-sm">
          Almost there! Let&apos;s finalize your experience settings
        </p>
      </div>
      
      {/* Budget section */}
      <div className="space-y-5">
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-1">
            <CircleDollarSign className="h-4 w-4 text-primary" />
            <Label htmlFor="budget-slider" className="font-medium text-sm">
              Budget preference
            </Label>
          </div>
          
          {/* Budget slider with labels */}
          <div>
            <Slider
              id="budget-slider"
              min={0}
              max={100}
              step={1}
              value={[preferences.budget]}
              onValueChange={(values) => setBudget(values[0])}
              className="my-6"
            />
            
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Budget</span>
              <span>Mid-range</span>
              <span>Premium</span>
              <span>Luxury</span>
            </div>
          </div>
          
          {/* Selected budget indicator */}
          <div className="flex justify-center mt-4">
            <div className="px-4 py-1.5 rounded-md bg-primary/10 border border-primary/20">
              <span className="font-medium text-sm text-primary">
                {getBudgetLabel(budgetPercentage)}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      {/* AI Feature Showcase */}
      <div className="mt-6 p-4 rounded-md border border-border bg-muted/30">
        <div className="flex items-start gap-3">
          <div className="mt-0.5">
            <Sparkles className="h-5 w-5 text-primary" />
          </div>
          
          <div>
            <h3 className="text-sm font-medium flex items-center gap-2">
              AI-Powered Recommendations
              <BadgeCheck className="h-4 w-4 text-primary" />
            </h3>
            
            <p className="text-xs text-muted-foreground mt-2">
              Aventra&apos;s AI technology analyzes your preferences to curate experiences 
              tailored specifically to you, ensuring every adventure perfectly 
              matches your style.
            </p>
            
            <div className="mt-3 flex flex-wrap gap-2">
              {["Personalized", "Smart", "Adaptive", "Curated"].map((feature) => (
                <span
                  key={feature}
                  className="px-2 py-0.5 text-xs rounded-md bg-primary/5 text-muted-foreground"
                >
                  {feature}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}