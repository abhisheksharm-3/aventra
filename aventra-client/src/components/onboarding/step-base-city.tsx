"use client";

import { motion } from "framer-motion";
import { MapPin, Search } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useOnboardingStore } from "@/stores/useOnboardingStore";

/**
 * @component StepBaseCity
 * @description Component for collecting user's home/base city during onboarding
 * 
 * @returns {JSX.Element} The rendered base city component
 */
export function StepBaseCity() {
  const { preferences, setBaseCity } = useOnboardingStore();
  const [inputValue, setInputValue] = useState(preferences.baseCity || "");
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setBaseCity(e.target.value);
  };
  
  // Popular cities for quick selection
  const popularCities = [
    "New York", "London", "Tokyo", "Paris", 
    "Sydney", "Berlin", "Mumbai", "Singapore"
  ];
  
  return (
    <motion.div
      key="base-city"
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
            Where Are You Based?
          </h2>
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="text-muted-foreground text-lg max-w-md mx-auto leading-relaxed"
        >
          Let us know your home city so we can recommend trips starting from there
        </motion.p>
      </div>
      
      {/* City input section */}
      <motion.div 
        className="space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <div className="space-y-6 p-6 rounded-xl border backdrop-blur-sm bg-card/40">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 rounded-full bg-primary/15 flex items-center justify-center">
              <MapPin className="h-5 w-5 text-primary" />
            </div>
            <Label htmlFor="city-input" className="text-lg font-medium">
              Your Home City
            </Label>
          </div>
          
          {/* City search input with enhanced UI */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="city-input"
              value={inputValue}
              onChange={handleInputChange}
              placeholder="Enter your city (e.g. New York, London)"
              className="pl-10 h-12"
            />
          </div>
          
          {/* Popular cities */}
          <div className="pt-4">
            <p className="text-sm text-muted-foreground mb-3">Popular cities:</p>
            <div className="flex flex-wrap gap-2">
              {popularCities.map((city, index) => (
                <motion.button
                  key={city}
                  type="button"
                  onClick={() => {
                    setInputValue(city);
                    setBaseCity(city);
                  }}
                  className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
                    inputValue === city 
                      ? "bg-primary text-primary-foreground" 
                      : "bg-secondary/20 hover:bg-secondary/30 text-foreground"
                  }`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + index * 0.05, duration: 0.3 }}
                >
                  {city}
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
      
      {/* Progress indicator dots - adjust based on where this step appears in sequence */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9, duration: 0.4 }}
        className="text-center mt-4"
      >
        <div className="mt-6 inline-flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-muted/40 inline-block" />
          <span className="w-1.5 h-1.5 rounded-full bg-muted/40 inline-block" />
          <span className="w-1.5 h-1.5 rounded-full bg-primary/60 inline-block" />
          <span className="w-1.5 h-1.5 rounded-full bg-muted/40 inline-block" />
          <span className="w-1.5 h-1.5 rounded-full bg-muted/40 inline-block" />
          <span className="w-1.5 h-1.5 rounded-full bg-muted/40 inline-block" />
        </div>
      </motion.div>
    </motion.div>
  );
}