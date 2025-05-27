"use client";

import { useState, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { 
  Users, ChevronDown, Baby, User, 
  Check, Plus, Minus, 
  UserPlus, ChevronRight, PersonStanding
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { type TripFormValues } from "@/lib/validations/trip-schema";
import { cn } from "@/lib/utils";

export function TravelersInput() {
  const { setValue, watch } = useFormContext<TripFormValues>();
  const [open, setOpen] = useState(false);
  
  // Watch traveler values
  const adults = watch("travelers.adults") || 1;
  const children = watch("travelers.children") || 0;
  const infants = watch("travelers.infants") || 0;
  
  // Calculate total count directly from watched values
  const totalTravelers = adults + children + infants;
  
  // Sync the total count whenever individual counts change
  useEffect(() => {
    // Only update if the current stored count doesn't match calculated total
    const currentCount = watch("travelers.count");
    if (currentCount !== totalTravelers) {
      setValue("travelers.count", totalTravelers, { shouldValidate: true });
    }
  }, [adults, children, infants, setValue, watch, totalTravelers]);
  
  // Handle updating traveler counts with min/max limits
  const updateCount = (type: 'adults' | 'children' | 'infants', increment: boolean) => {
    const current = watch(`travelers.${type}`) || (type === 'adults' ? 1 : 0);
    
    // Determine the new value
    let newValue: number;
    if (increment) {
      // Maximum 10 travelers of each type (4 for infants)
      const max = type === 'infants' ? 4 : 10;
      newValue = Math.min(max, current + 1);
    } else {
      // Minimum 1 adult, 0 for others
      newValue = Math.max(type === 'adults' ? 1 : 0, current - 1);
    }
    
    // Update individual count
    setValue(`travelers.${type}`, newValue, { shouldValidate: true });
    
    // Directly calculate and update the total - don't rely on updateTotalCount()
    const newAdults = type === 'adults' ? newValue : adults;
    const newChildren = type === 'children' ? newValue : children;
    const newInfants = type === 'infants' ? newValue : infants;
    const newTotal = newAdults + newChildren + newInfants;
    
    setValue("travelers.count", newTotal, { shouldValidate: true });
  };
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="h-10 px-3 font-normal relative overflow-hidden group"
        >
          <div className="absolute inset-0 w-1 bg-gradient-to-b from-primary/30 to-primary/10 group-hover:w-full transition-all duration-300 opacity-20" />
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">
              {totalTravelers} {totalTravelers === 1 ? 'Traveler' : 'Travelers'}
            </span>
            <ChevronDown className="h-3.5 w-3.5 opacity-50 ml-auto" />
          </div>
        </Button>
      </DialogTrigger>
      
      {/* Fixed dialog with proper scrolling */}
      <DialogContent className="sm:max-w-[500px] p-0 max-h-[90vh] flex flex-col">
        <DialogHeader className="p-5 pb-0 flex-shrink-0">
          <DialogTitle className="text-xl flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Travelers
          </DialogTitle>
        </DialogHeader>
        
        {/* Make this div scrollable */}
        <div className="p-5 space-y-6 overflow-y-auto flex-grow">
          {/* Fun illustrated header */}
          <div className="flex items-center justify-center py-3">
            <div className="flex items-end space-x-1">
              {/* Adult icon */}
              {Array.from({ length: Math.min(3, adults) }).map((_, i) => (
                <div 
                  key={`adult-${i}`} 
                  className={cn(
                    "flex flex-col items-center transition-all duration-300",
                    i === 1 ? "-mb-1" : ""
                  )}
                >
                  <div className="h-14 w-10 rounded-full bg-primary/10 flex items-center justify-center mb-1">
                    <User className="h-6 w-6 text-primary" />
                  </div>
                  <div className="h-1 w-8 rounded-full bg-primary/20" />
                </div>
              ))}
              
              {/* Children icon */}
              {Array.from({ length: Math.min(2, children) }).map((_, i) => (
                <div key={`child-${i}`} className="flex flex-col items-center">
                  <div className="h-11 w-8 rounded-full bg-blue-100 flex items-center justify-center mb-1">
                    <PersonStanding className="h-5 w-5 text-blue-500" />
                  </div>
                  <div className="h-1 w-6 rounded-full bg-blue-200" />
                </div>
              ))}
              
              {/* Infant icon */}
              {Array.from({ length: Math.min(1, infants) }).map((_, i) => (
                <div key={`infant-${i}`} className="flex flex-col items-center">
                  <div className="h-8 w-6 rounded-full bg-amber-100 flex items-center justify-center mb-1">
                    <Baby className="h-3.5 w-3.5 text-amber-500" />
                  </div>
                  <div className="h-1 w-4 rounded-full bg-amber-200" />
                </div>
              ))}
              
              {/* Show + icon if there are more travelers than we're showing */}
              {totalTravelers > (Math.min(3, adults) + Math.min(2, children) + Math.min(1, infants)) && (
                <div className="flex flex-col items-center ml-1">
                  <div className="h-10 w-10 rounded-full bg-muted/50 flex items-center justify-center mb-1">
                    <UserPlus className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="h-1 w-6 rounded-full bg-muted" />
                </div>
              )}
            </div>
          </div>
          
          {/* Total travelers summary */}
          <div className="bg-muted/20 rounded-lg p-3 flex items-center justify-between border">
            <div>
              <div className="text-sm font-medium">Travel Group</div>
              <div className="text-xs text-muted-foreground">Total travelers in your party</div>
            </div>
            <Badge className="text-lg px-3 py-1 bg-primary/90">
              {totalTravelers}
            </Badge>
          </div>
          
          {/* Traveler type counters with better aesthetics */}
          <div className="space-y-4">
            {/* Adults */}
            <div className="bg-background border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <PersonStanding className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium">Adults</div>
                    <div className="text-xs text-muted-foreground">Ages 18+</div>
                  </div>
                </div>
                
                <div className="flex items-center h-9 border rounded-md overflow-hidden">
                  <button
                    type="button"
                    className={cn(
                      "h-full px-3 flex items-center justify-center transition-colors",
                      adults <= 1 ? "text-muted-foreground bg-muted/50 cursor-not-allowed" : "hover:bg-muted"
                    )}
                    onClick={() => updateCount('adults', false)}
                    disabled={adults <= 1}
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  
                  <div className="h-full min-w-[40px] flex items-center justify-center text-sm font-medium border-l border-r">
                    {adults}
                  </div>
                  
                  <button
                    type="button"
                    className={cn(
                      "h-full px-3 flex items-center justify-center transition-colors",
                      adults >= 10 ? "text-muted-foreground bg-muted/50 cursor-not-allowed" : "hover:bg-muted"
                    )}
                    onClick={() => updateCount('adults', true)}
                    disabled={adults >= 10}
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
            
            {/* Children */}
            <div className="bg-background border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center">
                    <PersonStanding className="h-5 w-5 text-blue-500" />
                  </div>
                  <div>
                    <div className="font-medium">Children</div>
                    <div className="text-xs text-muted-foreground">Ages 2-17</div>
                  </div>
                </div>
                
                <div className="flex items-center h-9 border rounded-md overflow-hidden">
                  <button
                    type="button"
                    className={cn(
                      "h-full px-3 flex items-center justify-center transition-colors",
                      children <= 0 ? "text-muted-foreground bg-muted/50 cursor-not-allowed" : "hover:bg-muted"
                    )}
                    onClick={() => updateCount('children', false)}
                    disabled={children <= 0}
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  
                  <div className="h-full min-w-[40px] flex items-center justify-center text-sm font-medium border-l border-r">
                    {children}
                  </div>
                  
                  <button
                    type="button"
                    className={cn(
                      "h-full px-3 flex items-center justify-center transition-colors",
                      children >= 10 ? "text-muted-foreground bg-muted/50 cursor-not-allowed" : "hover:bg-muted"
                    )}
                    onClick={() => updateCount('children', true)}
                    disabled={children >= 10}
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
              
              {children > 0 && (
                <div className="mt-3 pt-3 border-t border-dashed text-xs text-muted-foreground">
                  For accurate pricing and recommendations, we&apos;ll ask for children&apos;s ages in the next step
                </div>
              )}
            </div>
            
            {/* Infants */}
            <div className="bg-background border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-amber-50 flex items-center justify-center">
                    <Baby className="h-5 w-5 text-amber-500" />
                  </div>
                  <div>
                    <div className="font-medium">Infants</div>
                    <div className="text-xs text-muted-foreground">Under 2 years</div>
                  </div>
                </div>
                
                <div className="flex items-center h-9 border rounded-md overflow-hidden">
                  <button
                    type="button"
                    className={cn(
                      "h-full px-3 flex items-center justify-center transition-colors",
                      infants <= 0 ? "text-muted-foreground bg-muted/50 cursor-not-allowed" : "hover:bg-muted"
                    )}
                    onClick={() => updateCount('infants', false)}
                    disabled={infants <= 0}
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  
                  <div className="h-full min-w-[40px] flex items-center justify-center text-sm font-medium border-l border-r">
                    {infants}
                  </div>
                  
                  <button
                    type="button"
                    className={cn(
                      "h-full px-3 flex items-center justify-center transition-colors",
                      infants >= 4 ? "text-muted-foreground bg-muted/50 cursor-not-allowed" : "hover:bg-muted"
                    )}
                    onClick={() => updateCount('infants', true)}
                    disabled={infants >= 4}
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
              
              {infants > 0 && (
                <div className="mt-3 pt-3 border-t border-dashed text-xs text-muted-foreground">
                  Infants typically sit on an adult&apos;s lap during transit and may have special accommodation needs
                </div>
              )}
            </div>
          </div>
          
          {/* Travel tips based on group size */}
          {totalTravelers > 5 && (
            <div className="bg-blue-50 text-blue-800 p-3 rounded-md text-sm">
              <div className="font-medium mb-1 flex items-center">
                <ChevronRight className="h-4 w-4 mr-1" />
                Large Group Travel Tip
              </div>
              <p className="text-xs">
                For groups of {totalTravelers} travelers, we recommend booking accommodations well in advance 
                and considering vacation rentals or connecting rooms for more space and value.
              </p>
            </div>
          )}
        </div>
        
        <DialogFooter className="flex justify-end p-4 border-t flex-shrink-0">
          <Button 
            onClick={() => setOpen(false)}
            className="gap-1.5"
          >
            <Check className="h-3.5 w-3.5" />
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}