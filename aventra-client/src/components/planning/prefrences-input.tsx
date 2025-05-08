"use client";

import { useFormContext } from "react-hook-form";
import { type TripFormValues } from "@/lib/validations/trip-schema";
import { cn } from "@/lib/utils";
import { Settings, Utensils, AccessibilityIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

// Define the type for pace options to fix the TypeScript error
type PaceOption = "relaxed" | "moderate" | "fast";

// Define the interface for accessibility options
interface AccessibilityOptions {
  mobilityNeeds?: boolean;
  hearingNeeds?: boolean;
  visionNeeds?: boolean;
  dietaryRestrictions?: boolean;
}

export function PreferencesInput() {
  const { watch, setValue } = useFormContext<TripFormValues>();
  
  const pace = watch("preferences.pace") as PaceOption || "moderate";
  const accessibility = watch("preferences.accessibility") as AccessibilityOptions || {};
  const dietaryPreferences = watch("preferences.dietaryPreferences") as string[] || [];
  
  // Convert pace to numeric value for the slider
  const paceValue = pace === "relaxed" ? 0 : pace === "moderate" ? 1 : 2;
  
  const paceOptions = [
    { 
      value: "relaxed" as PaceOption, 
      label: "Relaxed", 
      description: "A relaxed pace with plenty of free time to explore on your own.",
      color: "bg-emerald-500"
    },
    { 
      value: "moderate" as PaceOption, 
      label: "Moderate", 
      description: "A balanced pace with scheduled activities and some free time.",
      color: "bg-blue-500"
    },
    { 
      value: "fast" as PaceOption, 
      label: "Fast", 
      description: "A fast-paced trip packed with activities to maximize your experience.",
      color: "bg-purple-500"
    },
  ];

  const dietaryOptions = [
    { value: "vegetarian", label: "Vegetarian", icon: "🥗" },
    { value: "vegan", label: "Vegan", icon: "🌱" },
    { value: "pescatarian", label: "Pescatarian", icon: "🐟" },
    { value: "gluten-free", label: "Gluten-Free", icon: "🌾" },
    { value: "halal", label: "Halal", icon: "☪️" },
    { value: "kosher", label: "Kosher", icon: "✡️" },
    { value: "dairy-free", label: "Dairy-Free", icon: "🥛" },
    { value: "nut-free", label: "Nut-Free", icon: "🥜" }
  ];

  // Handle setting pace from slider
  const handlePaceChange = (value: number[]) => {
    const newPace = value[0] === 0 ? "relaxed" : value[0] === 1 ? "moderate" : "fast";
    setValue("preferences.pace", newPace as PaceOption);
  };

  // Handle toggling accessibility option
  const handleToggleAccessibility = (option: keyof AccessibilityOptions, checked: boolean) => {
    setValue(`preferences.accessibility.${option}`, checked);
  };

  // Handle toggling dietary preference
  const toggleDietaryPreference = (value: string) => {
    const currentPreferences = [...(dietaryPreferences || [])];
    
    if (currentPreferences.includes(value)) {
      setValue(
        "preferences.dietaryPreferences", 
        currentPreferences.filter(pref => pref !== value)
      );
    } else {
      setValue("preferences.dietaryPreferences", [...currentPreferences, value]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Trip Pace Section - Proper Slider */}
      <Card className="border-border/40 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Settings className="h-4 w-4 text-primary" /> 
            Trip Pace
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Slider labels */}
            <div className="flex items-center justify-between px-2">
              <div className="text-center flex flex-col items-center">
                <div className="h-2 w-2 rounded-full bg-emerald-500 mb-1.5"></div>
                <span className="text-sm font-medium">Relaxed</span>
                <p className="text-xs text-muted-foreground mt-0.5">More free time</p>
              </div>
              <div className="text-center flex flex-col items-center">
                <div className="h-2 w-2 rounded-full bg-blue-500 mb-1.5"></div>
                <span className="text-sm font-medium">Moderate</span>
                <p className="text-xs text-muted-foreground mt-0.5">Balanced</p>
              </div>
              <div className="text-center flex flex-col items-center">
                <div className="h-2 w-2 rounded-full bg-purple-500 mb-1.5"></div>
                <span className="text-sm font-medium">Fast</span>
                <p className="text-xs text-muted-foreground mt-0.5">Action packed</p>
              </div>
            </div>
            
            {/* Actual slider */}
            <div className="px-2">
              <Slider
                value={[paceValue]}
                min={0}
                max={2}
                step={1}
                onValueChange={handlePaceChange}
                className={cn(
                  "h-1.5",
                  "bg-gradient-to-r from-emerald-300 via-blue-300 to-purple-300",
                  pace === "relaxed" ? "[&_[role=slider]]:bg-emerald-500 [&_[role=slider]]:border-emerald-500/50" : 
                  pace === "moderate" ? "[&_[role=slider]]:bg-blue-500 [&_[role=slider]]:border-blue-500/50" : 
                  "[&_[role=slider]]:bg-purple-500 [&_[role=slider]]:border-purple-500/50"
                )}
              />
            </div>
            
            {/* Selected pace description */}
            <div className={cn(
              "p-4 rounded-md text-center border bg-muted/20 space-y-1",
              pace === "relaxed" ? "border-emerald-200" : 
              pace === "moderate" ? "border-blue-200" : 
              "border-purple-200"
            )}>
              <div className="flex items-center justify-center gap-1.5">
                <span className="font-medium">
                  {pace === "relaxed" ? "Relaxed Pace" : 
                   pace === "moderate" ? "Moderate Pace" : 
                   "Fast Pace"}
                </span>
                <Badge 
                  className={
                    pace === "relaxed" ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100" : 
                    pace === "moderate" ? "bg-blue-100 text-blue-700 hover:bg-blue-100" : 
                    "bg-purple-100 text-purple-700 hover:bg-purple-100"
                  }
                >
                  Selected
                </Badge>
              </div>
              <p className="text-sm">
                {paceOptions.find(option => option.value === pace)?.description}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Accessibility Needs Section */}
      <Card className="border-border/40 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <AccessibilityIcon className="h-4 w-4 text-primary" /> 
            Accessibility Needs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className={cn(
                "flex items-center justify-between p-3 rounded-md border",
                accessibility.mobilityNeeds ? "border-primary/50 bg-primary/5" : "border-border"
              )}>
                <div className="flex items-center">
                  <span className="text-xl mr-3">♿</span>
                  <Label htmlFor="mobility-needs" className="font-medium">Mobility Assistance</Label>
                </div>
                <Switch 
                  id="mobility-needs"
                  checked={accessibility.mobilityNeeds || false}
                  onCheckedChange={(checked) => handleToggleAccessibility("mobilityNeeds", checked)}
                />
              </div>
              
              <div className={cn(
                "flex items-center justify-between p-3 rounded-md border",
                accessibility.hearingNeeds ? "border-primary/50 bg-primary/5" : "border-border"
              )}>
                <div className="flex items-center">
                  <span className="text-xl mr-3">👂</span>
                  <Label htmlFor="hearing-needs" className="font-medium">Hearing Assistance</Label>
                </div>
                <Switch 
                  id="hearing-needs"
                  checked={accessibility.hearingNeeds || false}
                  onCheckedChange={(checked) => handleToggleAccessibility("hearingNeeds", checked)}
                />
              </div>
              
              <div className={cn(
                "flex items-center justify-between p-3 rounded-md border",
                accessibility.visionNeeds ? "border-primary/50 bg-primary/5" : "border-border"
              )}>
                <div className="flex items-center">
                  <span className="text-xl mr-3">👁️</span>
                  <Label htmlFor="vision-needs" className="font-medium">Vision Assistance</Label>
                </div>
                <Switch 
                  id="vision-needs"
                  checked={accessibility.visionNeeds || false}
                  onCheckedChange={(checked) => handleToggleAccessibility("visionNeeds", checked)}
                />
              </div>
              
              <div className={cn(
                "flex items-center justify-between p-3 rounded-md border",
                accessibility.dietaryRestrictions ? "border-primary/50 bg-primary/5" : "border-border"
              )}>
                <div className="flex items-center">
                  <span className="text-xl mr-3">🍽️</span>
                  <Label htmlFor="dietary-restrictions" className="font-medium">Dietary Restrictions</Label>
                </div>
                <Switch 
                  id="dietary-restrictions"
                  checked={accessibility.dietaryRestrictions || false}
                  onCheckedChange={(checked) => handleToggleAccessibility("dietaryRestrictions", checked)}
                />
              </div>
            </div>
            
            <p className="text-xs text-muted-foreground italic mt-1">
              Selecting these options will help us plan a trip that accommodates your specific needs.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Dietary Preferences Section */}
      <Card className="border-border/40 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Utensils className="h-4 w-4 text-primary" /> 
            Dietary Preferences
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {dietaryOptions.map(option => (
                <Badge
                  key={option.value}
                  variant={dietaryPreferences?.includes(option.value) ? "default" : "outline"}
                  className={cn(
                    "cursor-pointer px-3 py-1.5 text-sm transition-all duration-200",
                    dietaryPreferences?.includes(option.value) 
                      ? "bg-primary/90 hover:bg-primary/80" 
                      : "hover:bg-primary/10 hover:text-primary hover:border-primary/30"
                  )}
                  onClick={() => toggleDietaryPreference(option.value)}
                >
                  <span className="mr-1.5">{option.icon}</span>
                  {option.label}
                </Badge>
              ))}
            </div>
            
            <p className="text-xs text-muted-foreground mt-3">
              Click on the options above to select your dietary preferences. We&apos;ll ensure your trip accommodates these needs.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}