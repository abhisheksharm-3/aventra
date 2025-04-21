"use client";

import { motion } from "framer-motion";
import { Sparkles, BadgeCheck, CircleDollarSign } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { useOnboardingStore } from "@/stores/useOnboardingStore";

/**
 * @component StepBudgetAndAI
 * @description A premium component for setting budget preferences and showcasing
 * the AI-powered recommendation system during onboarding.
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="relative space-y-8 max-w-3xl mx-auto px-4"
    >
      {/* Decorative background elements */}
      <div className="absolute -z-10 top-0 left-0 w-full h-full overflow-hidden">
        <div className="absolute top-1/4 -left-32 w-64 h-64 bg-gradient-to-r from-primary/10 to-primary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 right-10 w-48 h-48 bg-gradient-to-l from-secondary/10 to-secondary/5 rounded-full blur-3xl" />
      </div>

      {/* Header section */}
      <div className="text-center pt-3">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <h2 className="text-3xl font-bold mb-3 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Final Preferences
          </h2>
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="text-muted-foreground text-lg max-w-md mx-auto leading-relaxed"
        >
          Almost there! Let&apos;s finalize your experience settings
        </motion.p>
      </div>
      
      {/* Budget section */}
      <motion.div 
        className="space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <div className="space-y-6 p-6 rounded-xl border backdrop-blur-sm bg-card/40">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 rounded-full bg-primary/15 flex items-center justify-center">
              <CircleDollarSign className="h-5 w-5 text-primary" />
            </div>
            <Label htmlFor="budget-slider" className="text-lg font-medium">
              Budget Preference
            </Label>
          </div>
          
          {/* Interactive budget slider with enhanced UI */}
          <div className="py-4">
            <Slider
              id="budget-slider"
              min={0}
              max={100}
              step={1}
              value={[preferences.budget]}
              onValueChange={(values) => setBudget(values[0])}
              className="my-6"
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Budget-conscious</span>
              <span>Mid-range</span>
              <span>Premium</span>
              <span>Luxury</span>
            </div>
          </div>
          
          {/* Budget label indicator */}
          <div className="flex justify-center mt-4">
            <motion.div 
              className="relative"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ 
                delay: 0.6,
                duration: 0.4, 
                type: "spring",
                stiffness: 300, 
                damping: 15 
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary/40 to-secondary/40 rounded-full blur-md" />
              <div className="relative px-5 py-2 rounded-full bg-gradient-to-r from-primary to-secondary">
                <span className="font-medium text-white">
                  {getBudgetLabel(budgetPercentage)}
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
      
      {/* AI Feature Showcase (made mandatory) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="p-6 rounded-xl border-2 border-primary/30 bg-primary/5 backdrop-blur-md"
      >
        <div className="flex items-start">
          <div className="h-12 w-12 rounded-full bg-primary/20 flex-shrink-0 flex items-center justify-center mr-4">
            <Sparkles className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold flex items-center gap-2">
              AI-Powered Recommendations
              <BadgeCheck className="h-5 w-5 text-primary" />
            </h3>
            <p className="text-muted-foreground mt-2 leading-relaxed">
              Aventra&apos;s core experience is powered by our proprietary AI technology. 
              Our system analyzes your preferences to curate experiences tailored 
              specifically to you, ensuring every adventure perfectly matches your style.
            </p>
            
            <div className="mt-4 flex flex-wrap gap-2">
              {["Personalized", "Smart", "Adaptive", "Curated"].map((feature, index) => (
                <motion.span
                  key={feature}
                  className="px-3 py-1 text-xs rounded-full bg-primary/10 text-primary"
                  initial={{ opacity: 0, x: -5 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + (index * 0.1), duration: 0.3 }}
                >
                  {feature}
                </motion.span>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
      
      {/* Progress indicator dots */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9, duration: 0.4 }}
        className="text-center mt-4"
      >
        <div className="mt-6 inline-flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-muted/40 inline-block" />
          <span className="w-1.5 h-1.5 rounded-full bg-muted/40 inline-block" />
          <span className="w-1.5 h-1.5 rounded-full bg-muted/40 inline-block" />
          <span className="w-1.5 h-1.5 rounded-full bg-muted/40 inline-block" />
          <span className="w-1.5 h-1.5 rounded-full bg-primary/60 inline-block" />
        </div>
      </motion.div>
    </motion.div>
  );
}