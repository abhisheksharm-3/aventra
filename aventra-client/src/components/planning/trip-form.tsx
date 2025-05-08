"use client";

import { useTripForm } from "@/hooks/useTripForm";
import { useTripSubmission } from "@/hooks/useTripSubmission";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
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
  AlertCircle 
} from "lucide-react";
import { TripFormValues } from "@/lib/validations/trip-schema";

export function TripForm() {
  const form = useTripForm();
  const { submitTrip, isSubmitting, isSuccess, isError, error, data } = useTripSubmission();
  const [expanded, setExpanded] = useState(false);
  
  // Track form completion for visual progress indicator
  const { watch } = form;
  const destination = watch("location.destination");
  const startDate = watch("dates.startDate");
  const endDate = watch("dates.endDate");
  const budget = watch("budget.ceiling");
  
  // Calculate basic completion percentage
  const requiredFields = [destination, startDate, endDate, budget];
  const filledRequiredFields = requiredFields.filter(Boolean).length;
  const completionPercentage = Math.round((filledRequiredFields / requiredFields.length) * 100);
  
  // Fixed type conversion error by using unknown as intermediate type
  const handleSubmit = form.handleSubmit((formData) => {
    submitTrip(formData as unknown as TripFormValues);
  });
  
  return (
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
          {/* Form progress indicator */}
          <div className="relative h-1 w-full bg-muted/50">
            <motion.div
              className="absolute left-0 top-0 h-full bg-primary"
              initial={{ width: "0%" }}
              animate={{ width: `${completionPercentage}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          
          <div className="p-6 md:p-8">
            {/* Header section with title and subtitle */}
            <div className="mb-6 text-center md:text-left">
              <h2 className="text-2xl font-bold">Plan Your Perfect Trip</h2>
              <p className="text-muted-foreground mt-1">Fill in the details below to create your personalized travel itinerary</p>
            </div>
            
            {/* Main Search Bar with enhanced styling */}
            <div className="bg-muted/20 p-5 rounded-lg border mb-6">
              <h3 className="flex items-center gap-2 text-lg font-medium mb-4">
                <MapPin className="h-4 w-4 text-primary" />
                Destination
              </h3>
              <LocationInput />
            </div>
            
            {/* Filter Bar with improved layout */}
            <div className="bg-muted/20 p-5 rounded-lg border">
              <h3 className="flex items-center gap-2 text-lg font-medium mb-4">
                <Calendar className="h-4 w-4 text-primary" />
                Trip Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="w-full">
                  <label className="block text-sm font-medium mb-2 text-muted-foreground">When</label>
                  <DateRangeInput />
                </div>
                <div className="w-full">
                  <label className="block text-sm font-medium mb-2 text-muted-foreground">Who</label>
                  <TravelersInput />
                </div>
                <div className="w-full">
                  <label className="block text-sm font-medium mb-2 text-muted-foreground">Budget</label>
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
                  <div className="bg-muted/20 p-5 rounded-lg border">
                    <TripStyleSelector />
                  </div>
                  
                  <div className="bg-muted/20 p-5 rounded-lg border">
                    <PreferencesInput />
                  </div>
                  
                  <div className="bg-muted/20 p-5 rounded-lg border">
                    <AdditionalContextInput />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Enhanced action bar with better styling */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-6 pt-5 border-t">
              {/* Left side with toggle and completion status */}
              <div className="flex items-center">
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
                
                {filledRequiredFields > 0 && (
                  <div className="ml-4 text-xs font-medium text-muted-foreground">
                    <span className="text-primary">{filledRequiredFields}</span>/{requiredFields.length} required fields completed
                  </div>
                )}
              </div>
              
              {/* Right side with submit button */}
              <Button 
                type="submit" 
                size="lg"
                className="relative overflow-hidden group shadow-md"
                disabled={isSubmitting || filledRequiredFields < 2}
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
                  <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <Check className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-green-800">Trip Plan Request Submitted!</h3>
                    <p className="text-sm text-green-700 mt-1">{data?.message || "Your personalized trip itinerary is being created and will be ready soon."}</p>
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
                  <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-red-800">Unable to Process Request</h3>
                    <p className="text-sm text-red-700 mt-1">{error?.message || "There was an error with your trip request. Please check your details and try again."}</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.form>
      </motion.div>
    </FormProvider>
  );
}