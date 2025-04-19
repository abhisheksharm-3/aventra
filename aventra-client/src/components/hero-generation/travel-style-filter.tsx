"use client";

import { useState } from "react";
import { Check, X, Palmtree, Mountain, Utensils, Building, Music, BookOpen, Waves, Compass, Heart, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * Interface for Travel Style Filter component props
 * @interface TravelStyleFilterProps
 * @property {string[]} selectedStyles - Array of currently selected travel style values
 * @property {function} setSelectedStyles - Function to update the selected travel styles
 * @property {function} onClose - Function to close the filter dialog
 */
interface TravelStyleFilterProps {
  selectedStyles: string[];
  setSelectedStyles: (styles: string[]) => void;
  onClose: () => void;
}

/**
 * Interface for Travel Style data structure
 * @interface TravelStyle
 * @property {string} value - Unique identifier for the travel style
 * @property {string} label - Display name for the travel style
 * @property {React.ReactNode} icon - Icon component to represent the travel style
 * @property {string} description - Short description of the travel style
 * @property {string} category - Category the travel style belongs to
 */
interface TravelStyle {
  value: string;
  label: string;
  icon: React.ReactNode;
  description: string;
  category: string;
  keywords?: string[];
}

/**
 * TravelStyleFilter component
 * 
 * A filter dialog that allows users to select different travel styles/preferences
 * organized by categories with visual representations and descriptions.
 * 
 * @component
 * @param {TravelStyleFilterProps} props - Component props
 * @returns {JSX.Element} The rendered component
 */
export function TravelStyleFilter({ selectedStyles, setSelectedStyles, onClose }: TravelStyleFilterProps) {
  const [tempSelectedStyles, setTempSelectedStyles] = useState<string[]>(selectedStyles);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  
  /**
   * Collection of travel styles with metadata
   * @constant {TravelStyle[]}
   */
  const travelStyles: TravelStyle[] = [
    { 
      value: "adventure", 
      label: "Adventure", 
      icon: <Compass className="h-4 w-4" />, 
      description: "Thrilling activities and exciting experiences",
      category: "active",
      keywords: ["hiking", "trekking", "rafting", "climbing", "skydiving"]
    },
    { 
      value: "beach", 
      label: "Beach & Relaxation", 
      icon: <Palmtree className="h-4 w-4" />, 
      description: "Coastal getaways and beach destinations",
      category: "relaxation",
      keywords: ["beaches", "sunbathing", "snorkeling", "island", "resort"]
    },
    { 
      value: "culture", 
      label: "Culture & History", 
      icon: <BookOpen className="h-4 w-4" />, 
      description: "Museums, historical sites, and local traditions",
      category: "enrichment",
      keywords: ["museums", "history", "architecture", "art", "traditions"]
    },
    { 
      value: "food", 
      label: "Food & Culinary", 
      icon: <Utensils className="h-4 w-4" />, 
      description: "Gastronomic experiences and cooking classes",
      category: "enrichment",
      keywords: ["gastronomy", "restaurants", "cooking", "wine", "street food"] 
    },
    { 
      value: "nature", 
      label: "Nature & Outdoors", 
      icon: <Mountain className="h-4 w-4" />, 
      description: "Parks, hiking, wildlife, and scenic landscapes",
      category: "active",
      keywords: ["wildlife", "national parks", "forests", "mountains", "flora"]
    },
    { 
      value: "urban", 
      label: "City Exploration", 
      icon: <Building className="h-4 w-4" />, 
      description: "Urban adventures and metropolitan experiences",
      category: "enrichment",
      keywords: ["cities", "shopping", "architecture", "markets", "landmarks"] 
    },
    { 
      value: "wellness", 
      label: "Wellness & Spa", 
      icon: <Heart className="h-4 w-4" />, 
      description: "Rejuvenating retreats and self-care",
      category: "relaxation",
      keywords: ["spa", "yoga", "meditation", "health", "retreats"] 
    },
    { 
      value: "nightlife", 
      label: "Nightlife", 
      icon: <Music className="h-4 w-4" />, 
      description: "Evening entertainment and social experiences",
      category: "active",
      keywords: ["bars", "clubs", "concerts", "entertainment", "parties"] 
    },
    { 
      value: "cruise", 
      label: "Cruise & Sailing", 
      icon: <Waves className="h-4 w-4" />, 
      description: "Ocean adventures and water experiences",
      category: "relaxation",
      keywords: ["sailing", "ships", "ocean", "island hopping", "sea travel"] 
    }
  ];
  
  /**
   * Categories for travel style tabs
   * @constant
   */
  const categories = [
    { id: "all", name: "All Styles", description: "View all travel styles" },
    { id: "active", name: "Active", description: "Adventure and physically engaging experiences" },
    { id: "relaxation", name: "Relaxation", description: "Laid-back and restorative experiences" },
    { id: "enrichment", name: "Enrichment", description: "Cultural and educational experiences" }
  ];
  
  /**
   * Filter styles by active category
   */
  const filteredStyles = travelStyles.filter(
    style => activeCategory === "all" || style.category === activeCategory
  );
  
  /**
   * Toggle selection of a travel style
   * @param {string} value - The value of the style to toggle
   */
  const toggleStyle = (value: string) => {
    setTempSelectedStyles(prev => 
      prev.includes(value)
        ? prev.filter(style => style !== value)
        : [...prev, value]
    );
  };
  
  /**
   * Clear all selected styles
   */
  const clearSelections = () => {
    setTempSelectedStyles([]);
  };
  
  /**
   * Apply selected styles and close the dialog
   */
  const handleApply = () => {
    setSelectedStyles(tempSelectedStyles);
    onClose();
  };
  
  /**
   * Get display names for selected style values
   * @returns {string[]} Array of style display names
   */
  const getSelectedStyleNames = () => {
    return tempSelectedStyles.map(value => {
      const style = travelStyles.find(s => s.value === value);
      return style?.label || value;
    });
  };
  
  /**
   * Get the active category's description
   * @returns {string} Description of the active category
   */
  const getActiveCategoryDescription = () => {
    const category = categories.find(cat => cat.id === activeCategory);
    return category?.description || "";
  };

  return (
      <div className="space-y-4">
        <DialogHeader className="space-y-1 px-1">
          <DialogTitle className="flex items-center gap-2 text-foreground">
            <Compass className="h-4 w-4 text-primary" />
            Travel Style
          </DialogTitle>
        </DialogHeader>
        
        {/* Selected styles summary */}
        <AnimatePresence>
          {tempSelectedStyles.length > 0 && (
            <motion.div 
              className="bg-muted/20 rounded-lg p-3"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-xs text-muted-foreground mb-1.5">Selected styles</div>
                  <div className="flex flex-wrap gap-1.5">
                    {getSelectedStyleNames().map((name, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {name}
                      </Badge>
                    ))}
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-7 w-7 p-0 rounded-full hover:bg-muted/50"
                  onClick={clearSelections}
                  aria-label="Clear all selections"
                >
                  <X className="h-3.5 w-3.5" />
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Category tabs */}
        <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full">
          <TabsList className="grid grid-cols-4 h-9">
            {categories.map(category => (
              <TabsTrigger key={category.id} value={category.id}>
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>
          
          <div className="flex items-center justify-between mt-2 mb-1">
            <p className="text-xs text-muted-foreground flex items-center gap-1.5">
              <Info className="h-3.5 w-3.5" />
              {getActiveCategoryDescription()}
            </p>
            
            {tempSelectedStyles.length > 0 && (
              <Badge variant="outline" className="text-xs">
                {tempSelectedStyles.length} {tempSelectedStyles.length === 1 ? 'style' : 'styles'} selected
              </Badge>
            )}
          </div>
          
          <TabsContent value={activeCategory} className="mt-0 pt-1">
            <ScrollArea className="h-[300px] pr-4">
              <div className="space-y-1.5">
                {filteredStyles.map((style) => (
                  <motion.div
                    key={style.value}
                    initial={{ opacity: 0.8 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                    className={cn(
                      "flex items-start p-2.5 rounded-lg border cursor-pointer",
                      tempSelectedStyles.includes(style.value) 
                        ? "bg-primary/5 border-primary/30" 
                        : "hover:bg-accent/50 border-transparent hover:border-accent"
                    )}
                    onClick={() => toggleStyle(style.value)}
                  >
                    <Checkbox 
                      id={`style-${style.value}`} 
                      checked={tempSelectedStyles.includes(style.value)}
                      className="mt-0.5"
                      onCheckedChange={() => toggleStyle(style.value)}
                    />
                    
                    <div className="ml-3 flex-1">
                      <Label 
                        htmlFor={`style-${style.value}`}
                        className="flex gap-2 items-center cursor-pointer"
                      >
                        <div className={cn(
                          "p-1 rounded-md",
                          tempSelectedStyles.includes(style.value) ? "bg-primary/20" : "bg-muted/30"
                        )}>
                          {style.icon}
                        </div>
                        <span className={cn(
                          "font-medium",
                          tempSelectedStyles.includes(style.value) && "text-primary"
                        )}>
                          {style.label}
                        </span>
                      </Label>
                      <div className="text-xs mt-1 ml-8">
                        <p className="text-muted-foreground">
                          {style.description}
                        </p>
                        {style.keywords && (
                          <div className="flex flex-wrap gap-1 mt-1.5">
                            {style.keywords.map((keyword, idx) => (
                              <Badge 
                                key={idx} 
                                variant="outline" 
                                className="px-1.5 py-0 text-[10px] bg-background/50"
                              >
                                {keyword}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {tempSelectedStyles.includes(style.value) && (
                      <Check className="h-4 w-4 text-primary ml-2 shrink-0" />
                    )}
                  </motion.div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
        
        {/* Helper text */}
        <div className="text-xs text-muted-foreground mt-2">
          {tempSelectedStyles.length === 0 
            ? "Select travel styles to find experiences that match your interests" 
            : `Click Apply to confirm your selection of ${tempSelectedStyles.length} ${tempSelectedStyles.length === 1 ? 'style' : 'styles'}`}
        </div>
        
        <DialogFooter className="flex justify-between gap-4 pt-3 border-t">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={clearSelections}
            disabled={tempSelectedStyles.length === 0}
          >
            Clear all
          </Button>
          <Button 
            size="sm"
            className="gap-1.5 px-5"
            onClick={handleApply}
          >
            <Check className="h-3.5 w-3.5" />
            Apply
          </Button>
        </DialogFooter>
      </div>
  );
}