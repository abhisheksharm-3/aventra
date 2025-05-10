"use client";

import { useTripForm } from "@/hooks/useTripForm";
import { useTripSubmission } from "@/hooks/useTripSubmission";
import { motion, AnimatePresence } from "framer-motion";
import React, { useState, useEffect } from "react";
import { FormProvider } from "react-hook-form";
import { LocationInput } from "./location-input";
import { DateRangeInput } from "./date-range-input";
import { TravelersInput } from "./travelers-input";
import { BudgetInput } from "./budget-input";
import { TripStyleSelector } from "./trip-style-selector";
import { PreferencesInput } from "./prefrences-input";
import { AdditionalContextInput } from "./additional-context";
import { Button } from "../ui/button";
import { 
  ChevronDown, 
  ChevronUp, 
  Loader2, 
  Sparkles, 
  MapPin, 
  Calendar, 
  Check, 
  AlertCircle,
  Users,
  Wallet,
  Heart,
  Clock,
  BookMarked,
  Copy,
  ThumbsUp,
  Star,
  PanelLeft
} from "lucide-react";
import { TripFormValues } from "@/lib/validations/trip-schema";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { Badge } from "../ui/badge";
import { cn } from "@/lib/utils";

// Animated progress step component
const ProgressStep = ({ 
  completed, 
  active, 
  text, 
  index 
}: { 
  completed: boolean; 
  active: boolean; 
  text: string; 
  index: number 
}) => (
  <motion.div 
    className={cn(
      "flex flex-col items-center relative",
      active && "scale-110"
    )}
    animate={{ scale: active ? 1.05 : 1 }}
    transition={{ duration: 0.2 }}
  >
    <motion.div 
      className={cn(
        "h-8 w-8 rounded-full flex items-center justify-center text-xs font-medium border-2",
        completed ? "bg-primary border-primary text-primary-foreground" : 
        active ? "bg-primary/10 border-primary text-primary" : 
        "bg-muted border-muted-foreground/30 text-muted-foreground"
      )}
      animate={{ 
        scale: completed ? [1, 1.1, 1] : 1,
        backgroundColor: completed ? "#0070f3" : active ? "rgba(0, 112, 243, 0.1)" : "#f5f5f5",
        borderColor: completed || active ? "#0070f3" : "rgba(0,0,0,0.2)" 
      }}
      transition={{ duration: 0.3 }}
    >
      {completed ? <Check className="h-4 w-4" /> : index}
    </motion.div>
    <span className={cn(
      "text-xs mt-1.5 whitespace-nowrap",
      completed && "text-primary font-medium",
      active && "text-primary"
    )}>
      {text}
    </span>
  </motion.div>
);

// Smart suggestions based on partial form data
const SmartSuggestions = ({ 
  destination, 
  onSelectSuggestion 
}: { 
  destination: string | undefined; 
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSelectSuggestion: (suggestion: any) => void 
}) => {
  const suggestions = [
    {
      title: "Popular Choice",
      description: `3 days in ${destination || 'Tokyo'} with cultural experiences`,
      icon: Star,
      values: {
        dates: { startDate: "2025-06-15", endDate: "2025-06-18" },
        tripStyle: ["cultural", "relaxation"],
        budget: { ceiling: 1500, currency: "USD" }
      }
    },
    {
      title: "Budget-Friendly",
      description: `5 days in ${destination || 'Bangkok'} for backpackers`,
      icon: Wallet,
      values: {
        dates: { startDate: "2025-07-10", endDate: "2025-07-15" },
        tripStyle: ["adventure", "budget"],
        budget: { ceiling: 800, currency: "USD" }
      }
    },
    {
      title: "Luxury Getaway",
      description: `7 days in ${destination || 'Paris'} with premium amenities`,
      icon: Sparkles,
      values: {
        dates: { startDate: "2025-09-05", endDate: "2025-09-12" },
        tripStyle: ["luxury", "romance"],
        budget: { ceiling: 5000, currency: "USD" }
      }
    }
  ];
  
  return (
    <div className="mt-6 space-y-4">
      <h4 className="text-sm font-medium flex items-center gap-2">
        <PanelLeft className="h-3.5 w-3.5 text-primary" />
        <span>Smart Suggestions</span>
        <Badge variant="outline" className="ml-2 text-[10px] bg-primary/5 text-primary">New</Badge>
      </h4>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {suggestions.map((suggestion, i) => (
          <div 
            key={i} 
            onClick={() => onSelectSuggestion(suggestion.values)}
            className="p-3 rounded-lg border border-border/60 bg-card hover:border-primary/30 hover:bg-primary/5 transition-all cursor-pointer relative group"
          >
            <div className="flex items-start gap-3">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                <suggestion.icon className="h-4 w-4 text-primary/70" />
              </div>
              <div className="space-y-1 flex-1">
                <h5 className="font-medium text-sm">{suggestion.title}</h5>
                <p className="text-xs text-muted-foreground">{suggestion.description}</p>
              </div>
            </div>
            <div className="absolute right-3 top-3 opacity-0 group-hover:opacity-100 transition-opacity">
              <Badge variant="secondary" className="text-[10px]">Use This</Badge>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export function TripForm() {
  const form = useTripForm();
  const { submitTrip, isSubmitting, isSuccess, isError, error, data } = useTripSubmission();
  const [expanded, setExpanded] = useState(false);
  const [showSmartSuggestions, setShowSmartSuggestions] = useState(false);
  const [showSaveConfirmation, setShowSaveConfirmation] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  

  
  // Track form completion for visual progress indicator
  const { watch, setValue } = form;
  const destination = watch("location.destination");
  const startDate = watch("dates.startDate");
  const endDate = watch("dates.endDate");
  const budget = watch("budget.ceiling");
  const travelers = watch("travelers");
  const tripStyle = watch("tripStyle");
  const preferences = watch("preferences");
  
  // Calculate basic completion percentage and determine active step
  const steps = [
    { name: "Destination", completed: Boolean(destination), icon: MapPin },
    { name: "Dates", completed: Boolean(startDate && endDate), icon: Calendar },
    { name: "Travelers", completed: Boolean(travelers?.count), icon: Users },
    { name: "Budget", completed: Boolean(budget), icon: Wallet },
    { name: "Style", completed: Boolean(tripStyle?.length), icon: Heart },
    { name: "Details", completed: Boolean(preferences?.pace), icon: Clock }
  ];
  
  const completedSteps = steps.filter(s => s.completed).length;
  const completionPercentage = Math.round((completedSteps / steps.length) * 100);
  
  // Handle automatic form data loading and restoration
  useEffect(() => {
    // Show smart suggestions when user fills destination but not much else
    if (destination && !startDate && !endDate && !budget) {
      // Only show suggestions after a small delay to avoid flickering
      const timer = setTimeout(() => setShowSmartSuggestions(true), 500);
      return () => clearTimeout(timer);
    } else {
      setShowSmartSuggestions(false);
    }
    
    // Update the active step based on form completion
    const firstIncompleteIndex = steps.findIndex(s => !s.completed);
    setActiveStep(firstIncompleteIndex !== -1 ? firstIncompleteIndex : completedSteps - 1);
  }, [destination, startDate, endDate, budget, travelers?.count, tripStyle, preferences?.pace]);
  
  // Apply smart suggestion to form
  const applySmartSuggestion = (suggestionValues: Partial<TripFormValues>) => {
    Object.entries(suggestionValues).forEach(([key, value]) => {
      const path = key as keyof TripFormValues;
      setValue(path, value);
    });
    setShowSmartSuggestions(false);
  };
  
  // Fixed type conversion error by using unknown as intermediate type
  const handleSubmit = form.handleSubmit((formData) => {
    submitTrip(formData as unknown as TripFormValues);
  });
  
  // Save draft handler
  const handleSaveDraft = () => {
    // In a real app, this would save to localStorage or backend
    setShowSaveConfirmation(true);
    setTimeout(() => setShowSaveConfirmation(false), 3000);
  };
  
  return (
    <TooltipProvider delayDuration={300}>
      <FormProvider {...form}>
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="max-w-4xl mx-auto"
        >
          <motion.form 
            onSubmit={handleSubmit} 
            className="bg-background/95 backdrop-blur-xl rounded-xl shadow-lg border border-border/40 overflow-hidden transition-all duration-300"
          >
            {/* Enhanced form progress indicator */}
            <div className="relative h-1.5 w-full bg-muted/50 overflow-hidden">
              <motion.div
                className="absolute left-0 top-0 h-full bg-primary"
                initial={{ width: "0%" }}
                animate={{ 
                  width: `${completionPercentage}%`,
                  opacity: completionPercentage > 0 ? 1 : 0.5
                }}
                transition={{ duration: 0.5 }}
              />
            </div>
            
            <div className="p-6 md:p-8">
              {/* Header section with title and subtitle */}
              <div className="mb-6 text-center md:text-left">
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
                  <div>
                    <h2 className="text-2xl font-bold">Plan Your Perfect Trip</h2>
                    <p className="text-muted-foreground mt-1">Fill in the details below to create your personalized travel itinerary</p>
                  </div>
                  
                </div>
              </div>
              
              {/* Visual progress steps */}
              <div className="flex items-center justify-between mb-8 px-4">
                {steps.map((step, i) => (
                  <React.Fragment key={i}>
                    <ProgressStep
                      completed={step.completed}
                      active={i === activeStep}
                      text={step.name}
                      index={i + 1}
                    />
                    {i < steps.length - 1 && (
                      <div className="flex-grow h-0.5 mx-1.5 bg-muted-foreground/20">
                        <div 
                          className="h-full bg-primary transition-all" 
                          style={{width: `${i < activeStep ? '100%' : '0%'}`}}
                        />
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </div>
              
              {/* Main Search Bar with enhanced styling */}
              <div className="bg-muted/20 p-5 rounded-lg border mb-6 hover:border-primary/20 hover:bg-muted/30 transition-colors">
                <h3 className="flex items-center gap-2 text-lg font-medium mb-4">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span>Destination</span>
                  {destination && (
                    <Badge variant="secondary" className="ml-auto font-normal">
                      Step 1 of 6
                    </Badge>
                  )}
                </h3>
                <LocationInput />
                
                {/* Smart suggestions that appear after destination is filled */}
                <AnimatePresence>
                  {showSmartSuggestions && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <SmartSuggestions 
                        destination={destination} 
                        onSelectSuggestion={applySmartSuggestion}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              {/* Filter Bar with improved layout */}
              <div className="bg-muted/20 p-5 rounded-lg border hover:border-primary/20 hover:bg-muted/30 transition-colors">
                <h3 className="flex items-center gap-2 text-lg font-medium mb-4">
                  <Calendar className="h-4 w-4 text-primary" />
                  Trip Details
                  {startDate && endDate && travelers?.count && budget && (
                    <Badge variant="secondary" className="ml-auto font-normal">
                      Steps 2-4 of 6
                    </Badge>
                  )}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="w-full">
                    <label className="block text-sm font-medium mb-2 text-muted-foreground flex items-center gap-1.5">
                      <Calendar className="h-3 w-3" />
                      When
                    </label>
                    <DateRangeInput />
                  </div>
                  <div className="w-full">
                    <label className="block text-sm font-medium mb-2 text-muted-foreground flex items-center gap-1.5">
                      <Users className="h-3 w-3" />
                      Who
                    </label>
                    <TravelersInput />
                  </div>
                  <div className="w-full">
                    <label className="block text-sm font-medium mb-2 text-muted-foreground flex items-center gap-1.5">
                      <Wallet className="h-3 w-3" />
                      Budget
                    </label>
                    <BudgetInput />
                  </div>
                </div>
              </div>
              
              {/* Trip Style and Additional Details with smooth animation */}
              <AnimatePresence>
                {expanded && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="space-y-6 overflow-hidden pt-6"
                  >
                    <div className="bg-muted/20 p-5 rounded-lg border hover:border-primary/20 hover:bg-muted/30 transition-colors">
                      <h3 className="flex items-center gap-2 text-lg font-medium mb-4">
                        <Heart className="h-4 w-4 text-primary" />
                        Trip Style
                        {tripStyle?.length && (
                          <Badge variant="secondary" className="ml-auto font-normal">
                            Step 5 of 6
                          </Badge>
                        )}
                      </h3>
                      <TripStyleSelector />
                    </div>
                    
                    <div className="bg-muted/20 p-5 rounded-lg border hover:border-primary/20 hover:bg-muted/30 transition-colors">
                      <h3 className="flex items-center gap-2 text-lg font-medium mb-4">
                        <Heart className="h-4 w-4 text-primary" />
                        Preferences
                      </h3>
                      <PreferencesInput />
                    </div>
                    
                    <div className="bg-muted/20 p-5 rounded-lg border hover:border-primary/20 hover:bg-muted/30 transition-colors">
                      <h3 className="flex items-center gap-2 text-lg font-medium mb-4">
                        <Clock className="h-4 w-4 text-primary" />
                        Additional Details
                        {preferences?.pace && (
                          <Badge variant="secondary" className="ml-auto font-normal">
                            Step 6 of 6
                          </Badge>
                        )}
                      </h3>
                      <AdditionalContextInput />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              
              {/* Enhanced action bar with better styling */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-6 pt-5 border-t">
                {/* Left side with toggle and completion status */}
                <div className="flex items-center space-x-4">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setExpanded(!expanded)}
                    className={`flex items-center gap-1.5 transition-colors ${expanded ? "bg-muted" : ""}`}
                  >
                    {expanded ? (
                      <>
                        <ChevronUp className="h-3.5 w-3.5" />
                        Fewer options
                      </>
                    ) : (
                      <>
                        <ChevronDown className="h-3.5 w-3.5" />
                        More options
                      </>
                    )}
                  </Button>
                  
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={handleSaveDraft} 
                        className="flex items-center gap-1.5"
                      >
                        <BookMarked className="h-3.5 w-3.5" />
                        <span>Save Draft</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Save your progress to finish later</TooltipContent>
                  </Tooltip>
                  
                  <AnimatePresence>
                    {showSaveConfirmation && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="hidden sm:flex items-center gap-1.5 text-xs text-green-600"
                      >
                        <Check className="h-3.5 w-3.5" />
                        Draft saved
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                
                {/* Right side with completion indicator and submit button */}
                <div className="flex items-center gap-4">
                  <div className="text-xs text-muted-foreground">
                    <span className="font-medium text-primary">{completedSteps}</span>/{steps.length} completed
                  </div>
                  
                  <Button 
                    type="submit" 
                    size="lg"
                    className="relative overflow-hidden group shadow-md"
                    disabled={isSubmitting || completedSteps < 2}
                  >
                    <div className="absolute inset-0 w-3 bg-white/20 skew-x-[20deg] group-hover:w-full -translate-x-10 group-hover:translate-x-0 transition-all duration-300 ease-out opacity-0 group-hover:opacity-20" />
                    
                    {isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Creating Your Trip Plan...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Sparkles className="h-4 w-4" />
                        Plan My Adventure
                      </div>
                    )}
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Enhanced Success/Error Messages */}
            <AnimatePresence>
              {isSuccess && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-green-50 border-t border-green-100 p-4 sm:p-6"
                >
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                      <Check className="h-5 w-5 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-green-800 text-lg">Trip Plan Request Submitted!</h3>
                      <p className="text-sm text-green-700 mt-1">{data?.message || "Your personalized trip itinerary is being created and will be ready soon."}</p>
                      
                      <div className="flex gap-3 mt-4">
                        <Button size="sm" variant="outline" className="gap-1.5">
                          <Copy className="h-3.5 w-3.5" />
                          Copy Trip ID
                        </Button>
                        <Button size="sm" variant="outline" className="gap-1.5">
                          <ThumbsUp className="h-3.5 w-3.5" />
                          Send Feedback
                        </Button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
              
              {isError && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-red-50 border-t border-red-100 p-4 sm:p-6"
                >
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                      <AlertCircle className="h-5 w-5 text-red-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-red-800 text-lg">Unable to Process Request</h3>
                      <p className="text-sm text-red-700 mt-1">{error?.message || "There was an error with your trip request. Please check your details and try again."}</p>
                      
                      <Button size="sm" variant="outline" className="mt-4 border-red-200 text-red-700 hover:bg-red-50">
                        Try Again
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.form>
        </motion.div>
      </FormProvider>
    </TooltipProvider>
  );
}