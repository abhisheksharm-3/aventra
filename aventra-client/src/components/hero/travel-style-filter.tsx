"use client";

import { useState } from "react";
import { Check, X, Palmtree, Mountain, Utensils, Building, Music, BookOpen, Waves, Compass, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface TravelStyleFilterProps {
  selectedStyles: string[];
  setSelectedStyles: (styles: string[]) => void;
  onClose: () => void;
}

interface TravelStyle {
  value: string;
  label: string;
  icon: React.ReactNode;
  description: string;
  category: string;
}

export function TravelStyleFilter({ selectedStyles, setSelectedStyles, onClose }: TravelStyleFilterProps) {
  const [tempSelectedStyles, setTempSelectedStyles] = useState<string[]>(selectedStyles);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  
  // Define travel styles with icons and descriptions
  const travelStyles: TravelStyle[] = [
    { 
      value: "adventure", 
      label: "Adventure", 
      icon: <Compass className="h-4 w-4" />, 
      description: "Thrilling activities and exciting experiences",
      category: "active"
    },
    { 
      value: "beach", 
      label: "Beach & Relaxation", 
      icon: <Palmtree className="h-4 w-4" />, 
      description: "Coastal getaways and beach destinations",
      category: "relaxation"
    },
    { 
      value: "culture", 
      label: "Culture & History", 
      icon: <BookOpen className="h-4 w-4" />, 
      description: "Museums, historical sites, and local traditions",
      category: "enrichment"
    },
    { 
      value: "food", 
      label: "Food & Culinary", 
      icon: <Utensils className="h-4 w-4" />, 
      description: "Gastronomic experiences and cooking classes",
      category: "enrichment" 
    },
    { 
      value: "nature", 
      label: "Nature & Outdoors", 
      icon: <Mountain className="h-4 w-4" />, 
      description: "Parks, hiking, wildlife, and scenic landscapes",
      category: "active"
    },
    { 
      value: "urban", 
      label: "City Exploration", 
      icon: <Building className="h-4 w-4" />, 
      description: "Urban adventures and metropolitan experiences",
      category: "enrichment" 
    },
    { 
      value: "wellness", 
      label: "Wellness & Spa", 
      icon: <Heart className="h-4 w-4" />, 
      description: "Rejuvenating retreats and self-care",
      category: "relaxation" 
    },
    { 
      value: "nightlife", 
      label: "Nightlife", 
      icon: <Music className="h-4 w-4" />, 
      description: "Evening entertainment and social experiences",
      category: "active" 
    },
    { 
      value: "cruise", 
      label: "Cruise & Sailing", 
      icon: <Waves className="h-4 w-4" />, 
      description: "Ocean adventures and water experiences",
      category: "relaxation" 
    }
  ];
  
  // Categories for tabs
  const categories = [
    { id: "all", name: "All Styles" },
    { id: "active", name: "Active" },
    { id: "relaxation", name: "Relaxation" },
    { id: "enrichment", name: "Enrichment" }
  ];
  
  // Filter styles by active category
  const filteredStyles = travelStyles.filter(
    style => activeCategory === "all" || style.category === activeCategory
  );
  
  // Toggle selection of a style
  const toggleStyle = (value: string) => {
    setTempSelectedStyles(prev => 
      prev.includes(value)
        ? prev.filter(style => style !== value)
        : [...prev, value]
    );
  };
  
  // Clear all selections
  const clearSelections = () => {
    setTempSelectedStyles([]);
  };
  
  // Apply selections and close
  const handleApply = () => {
    setSelectedStyles(tempSelectedStyles);
    onClose();
  };
  
  // Get style names for selected values
  const getSelectedStyleNames = () => {
    return tempSelectedStyles.map(value => {
      const style = travelStyles.find(s => s.value === value);
      return style?.label || value;
    });
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
      {tempSelectedStyles.length > 0 && (
        <div className="bg-muted/20 rounded-lg p-3">
          <div className="flex justify-between items-start">
            <div>
              <div className="text-xs text-muted-foreground mb-1">Selected styles</div>
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
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      )}
      
      {/* Category tabs */}
      <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full">
        <TabsList className="grid grid-cols-4 h-9">
          {categories.map(category => (
            <TabsTrigger key={category.id} value={category.id}>
              {category.name}
            </TabsTrigger>
          ))}
        </TabsList>
        
        <TabsContent value={activeCategory} className="mt-2">
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
                    <p className="text-xs text-muted-foreground mt-1 ml-8">
                      {style.description}
                    </p>
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
          : `${tempSelectedStyles.length} ${tempSelectedStyles.length === 1 ? 'style' : 'styles'} selected`}
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