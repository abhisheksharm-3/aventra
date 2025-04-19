"use client";

import { useState, useCallback, useMemo } from "react";
import { Check, Users, Minus, Plus, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GroupSizeFilterProps } from "@/types/hero";
import { DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import * as Slider from "@radix-ui/react-slider";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

/**
 * Group Size Filter Component
 * 
 * A sophisticated filter for selecting the number of travelers in a group
 * with visual feedback, animations, and category-based selection options.
 */
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
  
  // Categories for the tabs - memoized to prevent recreation on every render
  const categories = useMemo(() => [
    { id: "solo", name: "Solo", range: [1, 1], description: "Travel alone with maximum flexibility" },
    { id: "couple", name: "Couple", range: [2, 2], description: "Perfect for romantic getaways" },
    { id: "small", name: "Small", range: [3, 5], description: "Intimate groups and small families" },
    { id: "medium", name: "Medium", range: [6, 10], description: "Friends and extended families" },
    { id: "large", name: "Large", range: [11, 16], description: "Large gatherings and events" }
  ], []);
  
  // Get active category based on current size
  const getCurrentCategory = useCallback((size: number) => {
    for (const cat of categories) {
      if (size >= cat.range[0] && size <= cat.range[1]) {
        return cat.id;
      }
    }
    return "couple"; // Default
  }, [categories]);
  
  const [activeCategory, setActiveCategory] = useState(getCurrentCategory(localGroupSize));
  const activeCategoryObject = categories.find(cat => cat.id === activeCategory);
  
  // Color palette - vibrant colors with better accessibility
  const getColor = (size: number) => {
    if (size === 1) return "#4F46E5"; // Solo - indigo
    if (size === 2) return "#8B5CF6"; // Couple - violet
    if (size <= 5) return "#E11D48";  // Small - rose
    if (size <= 10) return "#EA580C"; // Medium - orange
    return "#DC2626";                 // Large - red
  };

  // Description based on group size
  const getSizeDescription = (size: number) => {
    if (size === 1) return "Individual adventure";
    if (size === 2) return "Perfect for couples";
    if (size === 3) return "Small group dynamic";
    if (size === 4) return "Small family size";
    if (size === 5) return "Friend group";
    if (size <= 8) return "Large family trip";
    if (size <= 12) return "Extended group";
    return "Event-sized gathering";
  };
  
  // Travel recommendations based on group size
  const getTravelRecommendation = (size: number) => {
    if (size === 1) return "City breaks, solo adventures, wellness retreats";
    if (size === 2) return "Romantic getaways, luxury stays, adventure trips";
    if (size <= 5) return "Villa rentals, guided tours, road trips";
    if (size <= 10) return "Large vacation homes, private tours, resort stays";
    return "Resort buyouts, cruise packages, group tours";
  };
  
  // Handle category tab selection
  const handleCategoryChange = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    if (category) {
      setActiveCategory(categoryId);
      // Set to middle value in range for a more natural feel
      const midValue = Math.round((category.range[0] + category.range[1]) / 2);
      setLocalGroupSize(midValue);
    }
  };
  
  // Increment/decrement helpers with boundaries
  const incrementSize = () => setLocalGroupSize(prev => Math.min(MAX_SIZE, prev + 1));
  const decrementSize = () => setLocalGroupSize(prev => Math.max(MIN_SIZE, prev - 1));
  
  // Handle slider change
  const handleSliderChange = (values: number[]) => {
    setLocalGroupSize(values[0]);
    setActiveCategory(getCurrentCategory(values[0]));
  };
  
  // Handle quick selection
  const handleQuickSelect = (size: number) => {
    setLocalGroupSize(size);
    setActiveCategory(getCurrentCategory(size));
  };
  
  // Apply changes and close dialog
  const handleApply = () => {
    setGroupSize(localGroupSize);
    onClose();
  };
  
  return (
    <TooltipProvider delayDuration={300}>
      <div className="flex flex-col max-h-[calc(100vh-100px)] overflow-hidden">
        <DialogHeader className="pb-2 border-b shrink-0">
          <DialogTitle className="flex items-center gap-2 text-base font-semibold">
            <Users className="h-4 w-4" style={{ color: getColor(localGroupSize) }} />
            Group Size
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-3 mt-2">
          {/* Categories */}
          <div className="px-1">
            <Tabs 
              value={activeCategory} 
              onValueChange={handleCategoryChange}
              className="w-full"
            >
              <TabsList className="w-full grid grid-cols-5 h-8 rounded-xl bg-muted/30">
                {categories.map(cat => (
                  <TabsTrigger
                    key={cat.id}
                    value={cat.id}
                    className={cn(
                      "rounded-lg text-xs transition-all",
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
            
            {activeCategoryObject && (
              <motion.div 
                className="mt-2 text-xs text-center text-muted-foreground"
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                key={activeCategory}
                transition={{ duration: 0.2 }}
              >
                {activeCategoryObject.description}
              </motion.div>
            )}
          </div>
        
          <ScrollArea className="flex-1 overflow-y-auto pr-3 -mr-3">
            <div className="space-y-4 pb-2">
              {/* Main size indicator */}
              <div className="flex flex-col items-center justify-center space-y-2">
                <motion.div 
                  className="w-20 h-20 rounded-full flex items-center justify-center"
                  style={{
                    backgroundColor: `${getColor(localGroupSize)}15`,
                    boxShadow: `inset 0 0 0 1px ${getColor(localGroupSize)}30`
                  }}
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
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
                        className="text-4xl font-semibold"
                        style={{ color: getColor(localGroupSize) }}
                      >
                        {localGroupSize}
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        {localGroupSize === 1 ? 'Person' : 'People'}
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </motion.div>
                
                {/* Description badge */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`desc-${localGroupSize}`}
                    className="text-center px-3 py-0.5 rounded-full text-xs"
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
              <div className="px-2">
                <div className="relative h-12 flex items-center">
                  {/* Minus button */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 rounded-full border-muted shrink-0"
                        onClick={decrementSize}
                        disabled={localGroupSize <= MIN_SIZE}
                        aria-label="Decrease group size"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="text-xs">
                      Decrease group size
                    </TooltipContent>
                  </Tooltip>
                  
                  {/* Slider component using Radix UI for better accessibility */}
                  <div className="px-3 flex-1">
                    <Slider.Root
                      className="relative flex items-center select-none touch-none w-full h-8"
                      min={MIN_SIZE}
                      max={MAX_SIZE}
                      step={1}
                      value={[localGroupSize]}
                      onValueChange={handleSliderChange}
                      aria-label="Group size"
                    >
                      <Slider.Track className="bg-muted/40 relative grow rounded-full h-1">
                        <Slider.Range 
                          className="absolute rounded-full h-full" 
                          style={{ backgroundColor: getColor(localGroupSize) }}
                        />
                      </Slider.Track>
                      <Slider.Thumb 
                        className="block w-6 h-6 rounded-full bg-white focus:outline-none focus-visible:ring focus-visible:ring-offset-2 cursor-grab active:cursor-grabbing shadow-md"
                        style={{ 
                          boxShadow: `0 0 0 2px ${getColor(localGroupSize)}40`,
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
                          <span className="text-[10px] text-muted-foreground">
                            {mark === MAX_SIZE ? `${mark}+` : mark}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Plus button */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 rounded-full border-muted shrink-0"
                        onClick={incrementSize}
                        disabled={localGroupSize >= MAX_SIZE}
                        aria-label="Increase group size"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="text-xs">
                      Increase group size
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
              
              {/* Visual representation of group */}
              <div className="px-2">
                <div
                  className="rounded-xl p-3 flex flex-col items-center justify-center"
                  style={{
                    backgroundColor: `${getColor(localGroupSize)}05`,
                    border: `1px solid ${getColor(localGroupSize)}20`
                  }}
                >
                  <div className="flex flex-wrap justify-center gap-1 py-1">
                    {Array.from({ length: 16 }).map((_, i) => {
                      const isActive = i < localGroupSize;
                      
                      return (
                        <Tooltip key={i}>
                          <TooltipTrigger asChild>
                            <motion.button
                              type="button"
                              className="focus:outline-none focus-visible:ring-1 focus-visible:ring-offset-1 rounded-full"
                              onClick={() => handleQuickSelect(i + 1)}
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
                          </TooltipTrigger>
                          <TooltipContent side="top" className="text-xs">
                            {i + 1} {i === 0 ? 'person' : 'people'}
                          </TooltipContent>
                        </Tooltip>
                      );
                    })}
                  </div>
                  
                  {/* Add ideal trip recommendations */}
                  <motion.div
                    key={`rec-${localGroupSize}`}
                    className="text-xs text-center mt-2 text-muted-foreground flex items-start gap-1.5"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                  >
                    <Info className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                    <span className="text-left">
                      <span className="font-medium" style={{ color: getColor(localGroupSize) }}>
                        Ideal for:
                      </span> {getTravelRecommendation(localGroupSize)}
                    </span>
                  </motion.div>
                </div>
              </div>
              
              {/* Quick selection buttons */}
              <div className="px-2 pt-1">
                <p className="text-xs text-muted-foreground mb-1.5 font-medium">Quick select:</p>
                <div className="grid grid-cols-4 gap-1.5">
                  {[1, 2, 3, 4, 6, 8, 10, 12].map((size) => (
                    <motion.button
                      key={size}
                      type="button"
                      className={cn(
                        "py-1.5 rounded-lg text-xs font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1",
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
            </div>
          </ScrollArea>
        </div>
        
        {/* Footer with action buttons */}
        <DialogFooter className="pt-3 border-t mt-3 flex justify-between gap-4 shrink-0">
          <Button 
            variant="ghost" 
            onClick={onClose}
            className="h-8 text-sm font-normal"
            aria-label="Cancel and close dialog"
          >
            Cancel
          </Button>
          <Button
            onClick={handleApply}
            className="h-8 gap-1.5 px-5"
            style={{
              backgroundColor: getColor(localGroupSize),
            }}
            aria-label={`Apply group size of ${localGroupSize}`}
          >
            <Check className="h-3.5 w-3.5" />
            Apply
          </Button>
        </DialogFooter>
      </div>
    </TooltipProvider>
  );
};