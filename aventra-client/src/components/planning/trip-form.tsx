"use client";

import { useRouter } from "next/navigation";
import { useTripSubmission } from "@/hooks/useTripSubmission";
import { motion, AnimatePresence } from "framer-motion";
import React, { useState, useEffect, useMemo } from "react";
import { FormProvider } from "react-hook-form";
import { LocationInput } from "./location-input";
import { DateRangeInput } from "./date-range-input";
import { TravelersInput } from "./travelers-input";
import { BudgetInput } from "./budget-input";
import { TripStyleSelector } from "./trip-style-selector";
import { PreferencesInput } from "./prefrences-input";
import { AdditionalContextInput } from "./additional-context";
import { Button } from "../ui/button";
import { MultiStepLoader } from "../ui/multi-step-loader";
import { 
  ChevronDown, 
  ChevronUp, 
  Loader2, 
  Sparkles, 
  MapPin, 
  Calendar, 
  Check, 
  Users,
  Wallet,
  Heart,
  Clock,
  Star,
  Palmtree,
  Gift,
  Settings,
  Map
} from "lucide-react";
import { TripFormValues } from "@/lib/validations/trip-schema";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { Badge } from "../ui/badge";
import { cn } from "@/lib/utils";
import { Separator } from "../ui/separator";
import { useTripForm } from "@/stores/useTripFormStore";

/**
 * Interface for suggested trip template values
 * @interface SuggestionValues
 */
interface SuggestionValues {
  dates?: {
    startDate: string;
    endDate: string;
    isFlexible: boolean;
  };
  tripStyle?: string[];
  budget?: {
    ceiling: number;
    currency: string;
  };
}

/**
 * Props for the ProgressStep component
 * @interface ProgressStepProps
 */
interface ProgressStepProps {
  completed: boolean;
  active: boolean;
  text: string;
  index?: number;
  icon: React.ComponentType<{ className?: string }>;
}

/**
 * Animated progress step component with enhanced visuals
 * @param {ProgressStepProps} props - Component props
 * @returns {React.ReactElement} The ProgressStep component
 */
const ProgressStep: React.FC<ProgressStepProps> = ({ 
  completed, 
  active, 
  text, 
  icon: Icon
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
        "h-10 w-10 rounded-full flex items-center justify-center text-xs font-medium border-2",
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
      {completed ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
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

/**
 * Props for the SmartSuggestions component
 * @interface SmartSuggestionsProps
 */
interface SmartSuggestionsProps {
  destination: string | undefined;
  onSelectSuggestion: (suggestion: SuggestionValues) => void;
}

/**
 * Enhanced smart suggestions with visual improvements
 * @param {SmartSuggestionsProps} props - Component props
 * @returns {React.ReactElement} The SmartSuggestions component
 */
const SmartSuggestions: React.FC<SmartSuggestionsProps> = ({ 
  destination, 
  onSelectSuggestion 
}) => {
  // Using useMemo to prevent recreation on every render
  const suggestions = useMemo(() => [
    {
      title: "Weekend Getaway",
      description: `3 days in ${destination || 'Tokyo'} with cultural experiences`,
      icon: Palmtree,
      color: "from-amber-500/20 to-amber-500/5 text-amber-600",
      values: {
        dates: { 
          startDate: "2025-06-15", 
          endDate: "2025-06-18", 
          isFlexible: true 
        },
        tripStyle: ["cultural", "relaxation"],
        budget: { ceiling: 30000, currency: "INR" }
      }
    },
    {
      title: "Budget Explorer",
      description: `5 days in ${destination || 'Bangkok'} for adventurous travelers`,
      icon: Map,
      color: "from-blue-500/20 to-blue-500/5 text-blue-600",
      values: {
        dates: { 
          startDate: "2025-07-10", 
          endDate: "2025-07-15", 
          isFlexible: true 
        },
        tripStyle: ["adventure", "budget"],
        budget: { ceiling: 50000, currency: "INR" }
      }
    },
    {
      title: "Luxury Escape",
      description: `7 days in ${destination || 'Paris'} with premium experiences`,
      icon: Gift,
      color: "from-purple-500/20 to-purple-500/5 text-purple-600",
      values: {
        dates: { 
          startDate: "2025-09-05", 
          endDate: "2025-09-12", 
          isFlexible: true 
        },
        tripStyle: ["luxury", "romance"],
        budget: { ceiling: 150000, currency: "INR" }
      }
    }
  ], [destination]);
  
  return (
    <div className="mt-6 space-y-4">
      <h4 className="text-sm font-medium flex items-center gap-2">
        <div className="bg-primary/10 p-1.5 rounded-full">
          <Star className="h-3 w-3 text-primary" />
        </div>
        <span>AI Trip Templates</span>
        <Badge variant="outline" className="ml-2 text-[10px] bg-primary/5 text-primary">NEW</Badge>
      </h4>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {suggestions.map((suggestion, i) => (
          <motion.div 
            key={i} 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
            onClick={() => onSelectSuggestion(suggestion.values)}
            className="p-4 rounded-xl border border-border/60 bg-gradient-to-br hover:shadow-md hover:border-primary/40 transition-all cursor-pointer relative group"
          >
            <div className="flex items-start gap-3">
              <div className={`h-10 w-10 rounded-full bg-gradient-to-br ${suggestion.color} flex items-center justify-center`}>
                <suggestion.icon className="h-4 w-4" />
              </div>
              <div className="space-y-1.5 flex-1">
                <h5 className="font-medium">{suggestion.title}</h5>
                <p className="text-xs text-muted-foreground leading-relaxed">{suggestion.description}</p>
              </div>
            </div>
            <div className="absolute right-3 top-3 opacity-0 group-hover:opacity-100 transition-opacity">
              <Badge variant="secondary" className="text-[10px] bg-primary/20 text-primary border-primary/20">
                Use Template
              </Badge>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

/**
 * Main Trip Form component for creating personalized travel itineraries
 * @returns {React.ReactElement} The TripForm component
 */
export function TripForm() {
  const router = useRouter();
  const methods = useTripForm(); // Use the form hook that connects to the store
  const { submitTrip, isSubmitting, isSuccess, data } = useTripSubmission();
  const [expanded, setExpanded] = useState(false);
  const [showSmartSuggestions, setShowSmartSuggestions] = useState(false);
  const [showSaveConfirmation, setShowSaveConfirmation] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [showLoader, setShowLoader] = useState(false);
  
  // Custom loading states for trip planning with engaging messages
  const loadingStates = useMemo(() => [
    { text: "Analyzing your travel preferences..." },
    { text: "Exploring destination insights..." },
    { text: "Finding the best attractions for you..." },
    { text: "Designing your personalized itinerary..." },
    { text: "Optimizing your travel route..." },
    { text: "Checking for seasonal events and activities..." },
    { text: "Tailoring recommendations to your interests..." },
    { text: "Finalizing your perfect trip plan..." },
  ], []);
  
  // Extract form methods
  const { watch, setValue } = methods;
  
  // FIX: Selectively watch fields instead of the entire form
  const destination = watch("location.destination");
  const startDate = watch("dates.startDate");
  const endDate = watch("dates.endDate");
  const budgetCeiling = watch("budget.ceiling");
  const travelersCount = watch("travelers.count");
  const tripStyleArray = watch("tripStyle");
  const preferencesPace = watch("preferences.pace");
  
  // Calculate steps and their completion status
  const steps = useMemo(() => [
    { name: "Destination", completed: Boolean(destination), icon: MapPin },
    { name: "Dates", completed: Boolean(startDate && endDate), icon: Calendar },
    { name: "Travelers", completed: Boolean(travelersCount), icon: Users },
    { name: "Budget", completed: Boolean(budgetCeiling), icon: Wallet },
    { name: "Style", completed: Boolean(tripStyleArray?.length), icon: Heart },
    { name: "Details", completed: Boolean(preferencesPace), icon: Settings }
  ], [destination, startDate, endDate, budgetCeiling, travelersCount, tripStyleArray?.length, preferencesPace]);
  
  // Calculate completion metrics
  const { completedSteps, completionPercentage } = useMemo(() => {
    const completed = steps.filter(s => s.completed).length;
    return {
      completedSteps: completed,
      completionPercentage: Math.round((completed / steps.length) * 100)
    };
  }, [steps]);
  
  useEffect(() => {
    setActiveStep(prevActiveStep => {
      const firstIncompleteIndex = steps.findIndex(s => !s.completed);
      const newActiveStep = firstIncompleteIndex !== -1 ? firstIncompleteIndex : completedSteps - 1;
      return newActiveStep !== prevActiveStep ? newActiveStep : prevActiveStep;
    });
  }, [steps, completedSteps]);
  
  // Handle smart suggestions display
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    
    if (destination && !startDate && !endDate && !budgetCeiling) {
      timer = setTimeout(() => setShowSmartSuggestions(true), 500);
    } else {
      setShowSmartSuggestions(false);
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [destination, startDate, endDate, budgetCeiling]);
  
  // Handle redirection after successful submission
  useEffect(() => {
    if (isSuccess && data?.id) {
      setShowLoader(false);
      
      const redirectTimer = setTimeout(() => {
        router.push(`/plan/generated/${data.id}`);
      }, 500);
      
      return () => clearTimeout(redirectTimer);
    }
  }, [isSuccess, data, router]);
  
  /**
   * Save the current form state as a draft
   */
  const saveFormAsDraft = () => {
    setShowSaveConfirmation(true);
    setTimeout(() => setShowSaveConfirmation(false), 3000);
  };
  
  /**
   * Apply smart suggestion to form
   * @param {SuggestionValues} suggestionValues - The values to apply to the form
   */
  const applySmartSuggestion = (suggestionValues: SuggestionValues) => {
    Object.entries(suggestionValues).forEach(([key, value]) => {
      // Type assertion with proper typing to avoid 'any'
      const path = key as keyof TripFormValues;
      setValue(path, value as TripFormValues[keyof TripFormValues]);
    });
    setShowSmartSuggestions(false);
  };
  
  /**
   * Handle form submission
   */
  const handleSubmit = methods.handleSubmit((formData: TripFormValues) => {
    setShowLoader(true);
    submitTrip(formData);
  });
  
  return (
    <TooltipProvider delayDuration={300}>
      {/* Multi-step loader */}
      <MultiStepLoader 
        loadingStates={loadingStates} 
        loading={showLoader} 
        duration={2000} 
      />
      
      <FormProvider {...methods}>
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <motion.form 
            onSubmit={handleSubmit} 
            className="bg-background/95 backdrop-blur-xl rounded-xl shadow-lg border border-border/40 overflow-hidden transition-all duration-300"
          >
            
            <div className="p-6 md:p-8">
              {/* Header section with title and subtitle */}
              <div className="mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-3">
                <div className="text-center md:text-left">
                  <motion.h2 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600"
                  >
                    Plan Your Perfect Trip
                  </motion.h2>
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="text-muted-foreground mt-1"
                  >
                    Fill in the details below to create your personalized travel itinerary
                  </motion.p>
                </div>
                
                {/* Completion meter */}
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="hidden md:flex items-center gap-3"
                >
                  <div className="text-sm text-muted-foreground">
                    {completedSteps}/{steps.length} completed
                  </div>
                  <div className="relative h-2.5 w-24 bg-muted/50 rounded-full overflow-hidden">
                    <div 
                      className="absolute left-0 top-0 h-full bg-gradient-to-r from-primary to-blue-500 rounded-full" 
                      style={{width: `${completionPercentage}%`}}
                    />
                  </div>
                </motion.div>
              </div>
              
              {/* Visual progress steps - beautified */}
              <div className="flex items-center justify-between mb-8 px-4 py-2 overflow-x-auto hide-scrollbar">
                {steps.map((step, i) => (
                  <React.Fragment key={i}>
                    <ProgressStep
                      completed={step.completed}
                      active={i === activeStep}
                      text={step.name}
                      icon={step.icon}
                    />
                    {i < steps.length - 1 && (
                      <div className="flex-grow h-0.5 mx-2 bg-muted-foreground/20 min-w-[1rem]">
                        <motion.div 
                          className="h-full bg-primary transition-all duration-500" 
                          initial={false}
                          animate={{
                            width: i < activeStep ? '100%' : '0%'
                          }}
                        />
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </div>
              
              {/* Main Search Bar with enhanced styling */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
                className="bg-muted/20 p-6 rounded-xl border shadow-sm mb-6 hover:border-primary/20 hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <MapPin className="h-4 w-4 text-primary" />
                    </div>
                    <h3 className="text-lg font-medium">Where are you going?</h3>
                  </div>
                  {destination && (
                    <Badge variant="secondary" className="font-normal">
                      Step 1 of 6
                    </Badge>
                  )}
                </div>
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
                      <Separator className="my-6" />
                      <SmartSuggestions 
                        destination={destination} 
                        onSelectSuggestion={applySmartSuggestion}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
              
              {/* Filter Bar with improved layout */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.4 }}
                className="bg-muted/20 p-6 rounded-xl border shadow-sm hover:border-primary/20 hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="bg-blue-500/10 p-2 rounded-full">
                      <Calendar className="h-4 w-4 text-blue-500" />
                    </div>
                    <h3 className="text-lg font-medium">Trip Details</h3>
                  </div>
                  {startDate && endDate && travelersCount && budgetCeiling && (
                    <Badge variant="secondary" className="font-normal bg-blue-500/10 text-blue-500 border-blue-500/20">
                      Steps 2-4 of 6
                    </Badge>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div className="w-full">
                    <label className="text-sm font-medium mb-2 text-muted-foreground flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5" />
                      When are you traveling?
                    </label>
                    <DateRangeInput />
                  </div>
                  <div className="w-full">
                    <label className="text-sm font-medium mb-2 text-muted-foreground flex items-center gap-1.5">
                      <Users className="h-3.5 w-3.5" />
                      Who&apos;s coming along?
                    </label>
                    <TravelersInput />
                  </div>
                  <div className="w-full">
                    <label className="text-sm font-medium mb-2 text-muted-foreground flex items-center gap-1.5">
                      <Wallet className="h-3.5 w-3.5" />
                      What&apos;s your budget?
                    </label>
                    <BudgetInput />
                  </div>
                </div>
              </motion.div>
              
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
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.2 }}
                      className="bg-muted/20 p-6 rounded-xl border shadow-sm hover:border-primary/20 hover:bg-muted/30 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <div className="bg-amber-500/10 p-2 rounded-full">
                            <Heart className="h-4 w-4 text-amber-500" />
                          </div>
                          <h3 className="text-lg font-medium">Trip Style</h3>
                        </div>
                        {tripStyleArray?.length && (
                          <Badge variant="secondary" className="font-normal bg-amber-500/10 text-amber-500 border-amber-500/20">
                            Step 5 of 6
                          </Badge>
                        )}
                      </div>
                      <TripStyleSelector />
                    </motion.div>
                    
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.3 }}
                      className="bg-muted/20 p-6 rounded-xl border shadow-sm hover:border-primary/20 hover:bg-muted/30 transition-colors"
                    >
                      <div className="flex items-center gap-2 mb-4">
                        <div className="bg-purple-500/10 p-2 rounded-full">
                          <Settings className="h-4 w-4 text-purple-500" />
                        </div>
                        <h3 className="text-lg font-medium">Preferences</h3>
                      </div>
                      <PreferencesInput />
                    </motion.div>
                    
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.4 }}
                      className="bg-muted/20 p-6 rounded-xl border shadow-sm hover:border-primary/20 hover:bg-muted/30 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <div className="bg-green-500/10 p-2 rounded-full">
                            <Clock className="h-4 w-4 text-green-500" />
                          </div>
                          <h3 className="text-lg font-medium">Additional Details</h3>
                        </div>
                        {preferencesPace && (
                          <Badge variant="secondary" className="font-normal bg-green-500/10 text-green-500 border-green-500/20">
                            Step 6 of 6
                          </Badge>
                        )}
                      </div>
                      <AdditionalContextInput />
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
              
              {/* Enhanced action bar with better styling */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-8 pt-5 border-t">
                {/* Left side with toggle and save draft option */}
                <div className="flex items-center space-x-4">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setExpanded(!expanded)}
                        className={cn(
                          "flex items-center gap-1.5 transition-all duration-300", 
                          expanded ? "bg-muted shadow-inner" : ""
                        )}
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
                    </TooltipTrigger>
                    <TooltipContent>{expanded ? "Hide advanced options" : "Show advanced options"}</TooltipContent>
                  </Tooltip>
                  
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={saveFormAsDraft}
                        className="hidden sm:flex items-center gap-1.5"
                        disabled={!destination}
                      >
                        <Star className="h-3.5 w-3.5" />
                        Save as draft
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Save your progress to continue later</TooltipContent>
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
                        Draft saved successfully
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                
                {/* Right side with completion indicator and submit button */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground sm:hidden">
                    <div className="relative h-2 w-16 bg-muted/50 rounded-full overflow-hidden">
                      <div 
                        className="absolute left-0 top-0 h-full bg-gradient-to-r from-primary to-blue-500 rounded-full" 
                        style={{width: `${completionPercentage}%`}}
                      />
                    </div>
                    <span className="font-medium">{completionPercentage}%</span>
                  </div>
                  
                  <Button 
                    type="submit" 
                    size="lg"
                    className={cn(
                      "relative overflow-hidden group shadow-md transition-all duration-300",
                      completedSteps < 2 ? "opacity-80" : "hover:shadow-lg"
                    )}
                    disabled={isSubmitting || completedSteps < 2}
                  >
                    {/* Animated overlay effect */}
                    <div className="absolute inset-0 w-0 bg-white/20 skew-x-[20deg] group-hover:w-full -translate-x-10 group-hover:translate-x-32 transition-all duration-700 ease-out" />
                    
                    {isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="relative z-10">Creating Your Trip...</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Sparkles className="h-4 w-4" />
                        <span className="relative z-10">Create My Itinerary</span>
                      </div>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </motion.form>
        </motion.div>
      </FormProvider>
    </TooltipProvider>
  );
}