"use client";

import React, { useState, useEffect } from "react";
import { Check, Users, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GroupSizeFilterProps } from "@/types/hero";
import { DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import * as Slider from "@radix-ui/react-slider";

export const GroupSizeFilter: React.FC<GroupSizeFilterProps> = ({ 
  onClose, 
  groupSize = 2, 
  setGroupSize 
}) => {
  // Core state
  const [localGroupSize, setLocalGroupSize] = useState(groupSize);
  
  // Constants
  const MIN_SIZE = 1;
  const MAX_SIZE = 16;
  
  // Categories for the tabs
  const categories = [
    { id: "solo", name: "Solo", range: [1, 1] },
    { id: "couple", name: "Couple", range: [2, 2] },
    { id: "small", name: "Small", range: [3, 5] },
    { id: "medium", name: "Medium", range: [6, 10] },
    { id: "large", name: "Large", range: [11, 16] }
  ];
  
  // Get active category based on current size
  const getCurrentCategory = (size: number) => {
    for (const cat of categories) {
      if (size >= cat.range[0] && size <= cat.range[1]) {
        return cat.id;
      }
    }
    return "couple"; // Default
  };
  
  const [activeCategory, setActiveCategory] = useState(getCurrentCategory(localGroupSize));
  
  // Update category when size changes
  useEffect(() => {
    setActiveCategory(getCurrentCategory(localGroupSize));
  }, [localGroupSize]);
  
  // Color palette
  const getColor = (size: number) => {
    if (size === 1) return "#4F46E5"; // Solo - indigo
    if (size === 2) return "#8B5CF6"; // Couple - violet
    if (size <= 5) return "#EC4899";  // Small - pink
    if (size <= 10) return "#F59E0B"; // Medium - amber
    return "#EF4444";                 // Large - red
  };

  // Description based on group size
  const getSizeDescription = (size: number) => {
    if (size === 1) return "Individual experience";
    if (size === 2) return "Perfect for couples";
    if (size === 3) return "Trio adventure";
    if (size === 4) return "Small family size";
    if (size === 5) return "Small group dynamics";
    if (size <= 8) return "Medium group experience";
    if (size <= 12) return "Large group gathering";
    return "Event-sized group";
  };
  
  // Handle category tab selection
  const handleCategoryChange = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    if (category) {
      setActiveCategory(categoryId);
      // Set to first value in range, feels more natural
      setLocalGroupSize(category.range[0]);
    }
  };
  
  // Increment/decrement helpers with boundaries
  const incrementSize = () => setLocalGroupSize(prev => Math.min(MAX_SIZE, prev + 1));
  const decrementSize = () => setLocalGroupSize(prev => Math.max(MIN_SIZE, prev - 1));
  
  // Handle slider change
  const handleSliderChange = (values: number[]) => {
    setLocalGroupSize(values[0]);
  };
  
  // Handle quick selection
  const handleQuickSelect = (size: number) => {
    setLocalGroupSize(size);
  };
  
  // Apply changes and close dialog
  const handleApply = () => {
    setGroupSize(localGroupSize);
    onClose();
  };
  
  return (
    <div className="space-y-6 max-w-md mx-auto">
      <DialogHeader className="pb-2 border-b">
        <DialogTitle className="flex items-center gap-2 text-lg font-semibold">
          <Users className="h-5 w-5" style={{ color: getColor(localGroupSize) }} />
          Group Size
        </DialogTitle>
      </DialogHeader>
      
      {/* Categories */}
      <div className="px-1">
        <Tabs 
          value={activeCategory} 
          onValueChange={handleCategoryChange}
          className="w-full"
        >
          <TabsList className="w-full grid grid-cols-5 h-10 rounded-xl bg-muted/30">
            {categories.map(cat => (
              <TabsTrigger
                key={cat.id}
                value={cat.id}
                className={cn(
                  "rounded-lg text-xs sm:text-sm transition-all",
                  activeCategory === cat.id 
                    ? "font-medium shadow-sm" 
                    : "text-muted-foreground"
                )}
                style={{
                  backgroundColor: activeCategory === cat.id ? "white" : "transparent",
                  color: activeCategory === cat.id 
                    ? getColor(cat.range[0]) 
                    : undefined
                }}
              >
                {cat.name}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>
      
      {/* Main size indicator */}
      <div className="flex flex-col items-center justify-center py-2 space-y-3">
        <div 
          className="w-28 h-28 rounded-full flex items-center justify-center"
          style={{
            backgroundColor: `${getColor(localGroupSize)}15`,
            boxShadow: `inset 0 0 0 1px ${getColor(localGroupSize)}30`
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={localGroupSize}
              className="flex flex-col items-center justify-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <div 
                className="text-5xl font-semibold"
                style={{ color: getColor(localGroupSize) }}
              >
                {localGroupSize}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {localGroupSize === 1 ? 'Person' : 'People'}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
        
        {/* Description badge */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`desc-${localGroupSize}`}
            className="text-center px-4 py-1 rounded-full text-xs"
            style={{ 
              backgroundColor: `${getColor(localGroupSize)}15`,
              color: getColor(localGroupSize)
            }}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
          >
            {getSizeDescription(localGroupSize)}
          </motion.div>
        </AnimatePresence>
      </div>
      
      {/* Custom Slider with Radix UI */}
      <div className="px-4 sm:px-6 pt-2">
        <div className="relative h-16 flex items-center">
          {/* Minus button */}
          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9 rounded-full border-muted shrink-0"
            onClick={decrementSize}
            disabled={localGroupSize <= MIN_SIZE}
            aria-label="Decrease group size"
          >
            <Minus className="h-4 w-4" />
          </Button>
          
          {/* Slider component using Radix UI for better accessibility */}
          <div className="px-4 flex-1">
            <Slider.Root
              className="relative flex items-center select-none touch-none w-full h-10"
              min={MIN_SIZE}
              max={MAX_SIZE}
              step={1}
              value={[localGroupSize]}
              onValueChange={handleSliderChange}
              aria-label="Group size"
            >
              <Slider.Track className="bg-muted/40 relative grow rounded-full h-1.5">
                <Slider.Range 
                  className="absolute rounded-full h-full" 
                  style={{ backgroundColor: getColor(localGroupSize) }}
                />
              </Slider.Track>
              <Slider.Thumb 
                className="block w-8 h-8 rounded-full bg-white focus:outline-none focus-visible:ring focus-visible:ring-offset-2 cursor-grab active:cursor-grabbing shadow-md"
                style={{ 
                  boxShadow: `0 0 0 3px ${getColor(localGroupSize)}40`,
                  outline: `2px solid ${getColor(localGroupSize)}` 
                }}
                aria-label="Group size slider thumb"
              >
                <div 
                  className="flex items-center justify-center h-full w-full"
                  style={{ color: getColor(localGroupSize) }}
                >
                  <span className="text-xs font-medium">{localGroupSize}</span>
                </div>
              </Slider.Thumb>
            </Slider.Root>
            
            {/* Markers */}
            <div className="flex justify-between px-1.5 mt-1">
              {[MIN_SIZE, 6, 11, MAX_SIZE].map(mark => (
                <div key={mark} className="flex flex-col items-center">
                  <span className="text-xs text-muted-foreground">
                    {mark === MAX_SIZE ? `${mark}+` : mark}
                  </span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Plus button */}
          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9 rounded-full border-muted shrink-0"
            onClick={incrementSize}
            disabled={localGroupSize >= MAX_SIZE}
            aria-label="Increase group size"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {/* Visual representation of group */}
      <div className="px-4 sm:px-6">
        <div
          className="rounded-xl p-3 flex items-center justify-center"
          style={{
            backgroundColor: `${getColor(localGroupSize)}05`,
            border: `1px solid ${getColor(localGroupSize)}20`
          }}
        >
          <div className="flex flex-wrap justify-center gap-1.5 py-2">
            {Array.from({ length: 16 }).map((_, i) => {
              const isActive = i < localGroupSize;
              
              return (
                <motion.button
                  key={i}
                  type="button"
                  className="focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 rounded-full"
                  onClick={() => setLocalGroupSize(i + 1)}
                  initial={false}
                  animate={{
                    opacity: isActive ? 1 : 0.2,
                    scale: isActive ? 1 : 0.85,
                  }}
                  transition={{ duration: 0.2 }}
                  whileHover={{ scale: isActive ? 1.1 : 0.95 }}
                  aria-label={`Set group size to ${i + 1}`}
                  style={{ transformOrigin: "center" }}
                >
                  <svg 
                    width="16" 
                    height="20" 
                    viewBox="0 0 24 30" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle 
                      cx="12" 
                      cy="8" 
                      r="6" 
                      fill={getColor(isActive ? localGroupSize : 1)}
                      opacity={isActive ? 1 : 0.3}
                    />
                    <path 
                      d="M24 28C24 21.373 18.627 16 12 16C5.373 16 0 21.373 0 28" 
                      stroke={getColor(isActive ? localGroupSize : 1)}
                      strokeWidth="4"
                      strokeLinecap="round"
                      opacity={isActive ? 1 : 0.3}
                    />
                  </svg>
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>
      
      {/* Quick selection buttons */}
      <div className="px-4 sm:px-6 pt-1">
        <p className="text-xs text-muted-foreground mb-2 font-medium">Quick select:</p>
        <div className="grid grid-cols-5 gap-2">
          {[1, 2, 4, 6, 8, 10, 12, 14, 16].map((size) => (
            <motion.button
              key={size}
              type="button"
              className={cn(
                "py-2 rounded-lg text-xs font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1",
                localGroupSize === size ? "text-white" : "bg-muted/30 text-muted-foreground"
              )}
              style={{
                backgroundColor: localGroupSize === size ? getColor(size) : undefined
              }}
              onClick={() => handleQuickSelect(size)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              aria-label={`Set group size to ${size}`}
              aria-pressed={localGroupSize === size}
            >
              {size}
            </motion.button>
          ))}
        </div>
      </div>
      
      {/* Footer with action buttons */}
      <DialogFooter className="pt-4 border-t mt-4 flex justify-between gap-4">
        <Button 
          variant="ghost" 
          onClick={onClose}
          className="text-sm font-normal"
          aria-label="Cancel and close dialog"
        >
          Cancel
        </Button>
        <Button
          onClick={handleApply}
          className="gap-1.5 px-5"
          style={{
            backgroundColor: getColor(localGroupSize),
          }}
          aria-label={`Apply group size of ${localGroupSize}`}
        >
          <Check className="h-4 w-4" />
          Apply
        </Button>
      </DialogFooter>
    </div>
  );
};