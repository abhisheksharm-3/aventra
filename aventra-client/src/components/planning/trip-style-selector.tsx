"use client";

import { useFormContext } from "react-hook-form";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type TripFormValues } from "@/lib/validations/trip-schema";
import { cn } from "@/lib/utils";
import { Paintbrush, Check } from "lucide-react";
import { useEffect } from "react";

// Make sure this exactly matches the enum values in your schema
const VALID_TRIP_STYLES = [
  "adventure", "family", "dining", "night-out", 
  "date", "beach", "culture", "food", 
  "nature", "urban", "wellness", "nightlife", 
  "cruise", "history"
] as const;

// Define type using the exact string literals from your schema
type TripStyleOption = typeof VALID_TRIP_STYLES[number];

// Interface for style item
interface TripStyleItem {
  id: TripStyleOption;
  label: string;
  icon: string;
}

// Interface for grouped styles
interface TripStyleGroup {
  category: string;
  styles: TripStyleItem[];
}

export function TripStyleSelector() {
  const { setValue, getValues, watch, formState: { errors } } = useFormContext<TripFormValues>();
  
  // Watch for changes in trip style selection
  const tripStyleValue = watch("tripStyle");
  
  // Set default value on component mount - this runs only once
  useEffect(() => {
    const currentValue = getValues("tripStyle");
    if (!currentValue || currentValue.length === 0) {
      setValue("tripStyle", ["adventure"]);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  // Get the current selected styles
  const selectedStyles: TripStyleOption[] = Array.isArray(tripStyleValue) ? tripStyleValue : [];
  
  // Group trip styles by category for better organization
  const tripStyleGroups: TripStyleGroup[] = [
    {
      category: "Activities",
      styles: [
        { id: "adventure", label: "Adventure", icon: "🏔️" },
        { id: "beach", label: "Beach", icon: "🏖️" },
        { id: "nature", label: "Nature", icon: "🌳" },
        { id: "wellness", label: "Wellness", icon: "🧘" },
      ]
    },
    {
      category: "Interests",
      styles: [
        { id: "culture", label: "Cultural", icon: "🏛️" },
        { id: "history", label: "Historical", icon: "📜" },
        { id: "urban", label: "Urban", icon: "🏙️" },
        { id: "cruise", label: "Cruise", icon: "🛳️" },
      ]
    },
    {
      category: "Experiences",
      styles: [
        { id: "dining", label: "Fine Dining", icon: "🍽️" },
        { id: "food", label: "Foodie", icon: "🍲" },
        { id: "nightlife", label: "Nightlife", icon: "🍸" },
        { id: "night-out", label: "Night Out", icon: "🌃" },
      ]
    },
    {
      category: "With",
      styles: [
        { id: "family", label: "Family", icon: "👨‍👩‍👧‍👦" },
        { id: "date", label: "Romantic", icon: "❤️" },
      ]
    }
  ];
  
  // Validate style id against valid options
  const isValidStyle = (id: string): id is TripStyleOption => {
    return VALID_TRIP_STYLES.includes(id as TripStyleOption);
  };
  
  // Flatten all styles for easy access
  const allTripStyles = tripStyleGroups.flatMap(group => group.styles);
  
  const toggleStyle = (styleId: TripStyleOption) => {
    // Ensure this is a valid style ID
    if (!isValidStyle(styleId)) {
      return;
    }
    
    if (selectedStyles.includes(styleId)) {
      const newStyles = selectedStyles.filter((id) => id !== styleId);
      // If removing would result in an empty array, don't update
      if (newStyles.length > 0) {
        // Ensure only valid enum values are included
        const validStyles = newStyles.filter(isValidStyle);
        setValue("tripStyle", validStyles);
      }
    } else {
      // Create a new array with the added style, ensuring all values are valid
      const updatedStyles = [...selectedStyles, styleId].filter(isValidStyle);
      setValue("tripStyle", updatedStyles);
    }
  };
  
  return (
    <Card className="border-border/40 shadow-sm overflow-hidden">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Paintbrush className="h-4 w-4 text-primary" />
          Trip Style
          {selectedStyles.length > 0 && (
            <Badge className="ml-2 bg-primary/90 hover:bg-primary/80">
              {selectedStyles.length} selected
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <p className="text-sm text-muted-foreground">
          Select the styles that best describe your ideal trip. This helps us tailor activities and recommendations.
        </p>
        
        {tripStyleGroups.map(group => (
          <div key={group.category} className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">{group.category}</h3>
            <div className="flex flex-wrap gap-2">
              {group.styles.map((style) => {
                const isSelected = selectedStyles.includes(style.id);
                return (
                  <div
                    key={style.id}
                    onClick={() => toggleStyle(style.id)}
                    className={cn(
                      "flex items-center gap-2 px-3 py-2 rounded-md border cursor-pointer transition-all duration-200",
                      isSelected 
                        ? "bg-primary text-primary-foreground border-primary shadow-sm" 
                        : "border-muted-foreground/20 hover:border-primary/40 hover:bg-muted/50"
                    )}
                  >
                    <span className="text-lg">{style.icon}</span>
                    <span className={cn(
                      "font-medium text-sm",
                      isSelected ? "text-primary-foreground" : ""
                    )}>
                      {style.label}
                    </span>
                    
                    {isSelected && (
                      <Check className="h-3.5 w-3.5 ml-0.5" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
        
        {errors.tripStyle && (
          <div className="text-xs text-destructive mt-1 p-2 border border-destructive/30 bg-destructive/10 rounded-md">
            {errors.tripStyle.message?.toString()}
          </div>
        )}
        
        {/* Helpful tips based on selection */}
        {selectedStyles.length > 0 && (
          <div className="bg-muted/30 p-3 rounded-md text-sm border">
            <h4 className="font-medium mb-1 text-sm">Your Trip Profile</h4>
            <p className="text-xs text-muted-foreground">
              {selectedStyles.length === 1 && (
                `Your ${allTripStyles.find(s => s.id === selectedStyles[0])?.label} trip will be crafted around this key interest.`
              )}
              {selectedStyles.length > 1 && selectedStyles.length <= 3 && (
                `Your trip will blend ${selectedStyles.slice(0, -1).map(id => 
                  allTripStyles.find(s => s.id === id)?.label).join(", ")} and ${
                  allTripStyles.find(s => s.id === selectedStyles[selectedStyles.length - 1])?.label
                } experiences.`
              )}
              {selectedStyles.length > 3 && (
                `Your diverse trip includes ${selectedStyles.length} different styles, creating a rich, varied experience.`
              )}
            </p>
            
            {/* Show specific combinations */}
            {selectedStyles.includes('adventure') && 
             selectedStyles.includes('nature') && (
              <p className="text-xs mt-1.5 text-emerald-600">
                Perfect combination for an outdoor exploration adventure!
              </p>
            )}
            {selectedStyles.includes('dining') && 
             selectedStyles.includes('food') && (
              <p className="text-xs mt-1.5 text-amber-600">
                Your trip will feature amazing culinary experiences!
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}