"use client";

import { useState, useMemo } from "react";
import { useFormContext } from "react-hook-form";
import { 
  Calendar as CalendarIcon, 
  ChevronDown, 
  ChevronLeft, 
  ChevronRight, 
  Check, 
  X, 
  CalendarClock
} from "lucide-react";
import { format, addDays, differenceInDays } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
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
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { type TripFormValues } from "@/lib/validations/trip-schema";

export function DateRangeInput() {
  const { setValue, watch } = useFormContext<TripFormValues>();
  const [open, setOpen] = useState(false);
  
  // Watch form values
  const startDateStr = watch("dates.startDate");
  const endDateStr = watch("dates.endDate");
  const isFlexible = watch("dates.isFlexible") || false;
  
  // Convert string dates to Date objects for the calendar
  const dateRange = useMemo(() => {
    return {
      from: startDateStr ? new Date(startDateStr) : undefined,
      to: endDateStr ? new Date(endDateStr) : undefined,
    };
  }, [startDateStr, endDateStr]);
  
  // Calculate trip duration
  const tripDuration = useMemo(() => {
    if (dateRange.from && dateRange.to) {
      return differenceInDays(dateRange.to, dateRange.from);
    }
    return null;
  }, [dateRange]);
  
  // Preset options for quick selection
  const presets = [
    { label: "Weekend", days: 2 },
    { label: "Week", days: 7 },
    { label: "Two Weeks", days: 14 },
  ];
  
  // Apply a preset to set date range
  const applyPreset = (days: number) => {
    const startDate = new Date();
    const endDate = addDays(startDate, days);
    
    setDateRange({
      from: startDate,
      to: endDate,
    });
    
    setValue("dates.startDate", format(startDate, "yyyy-MM-dd"));
    setValue("dates.endDate", format(endDate, "yyyy-MM-dd"));
  };
  
  // Update the local state and form values
  const setDateRange = (range: { from: Date | undefined; to: Date | undefined }) => {
    if (range.from) {
      setValue("dates.startDate", format(range.from, "yyyy-MM-dd"));
    }
    if (range.to) {
      setValue("dates.endDate", format(range.to, "yyyy-MM-dd"));
    }
  };
  
  // Handle clear dates
  const handleClear = () => {
    setValue("dates.startDate", "");
    setValue("dates.endDate", "");
    setValue("dates.isFlexible", false);
  };
  
  // Handle apply button
  const handleApply = () => {
    setOpen(false);
  };
  
  // Get display value for the trigger button
  const getDisplayValue = () => {
    if (!dateRange.from) return 'Select dates';
    
    if (dateRange.to) {
      const nights = differenceInDays(dateRange.to, dateRange.from);
      
      return (
        <div className="flex items-center gap-1.5">
          <span className="font-medium">
            {format(dateRange.from, "MMM")} {format(dateRange.from, "d")} - {format(dateRange.to, "MMM d, yyyy")}
          </span>
          {nights > 0 && (
            <Badge variant="secondary" className="ml-1 font-medium text-xs">
              {nights} {nights === 1 ? 'night' : 'nights'}
            </Badge>
          )}
          {isFlexible && (
            <Badge variant="outline" className="text-xs font-normal ml-1 border-dashed">
              Flexible
            </Badge>
          )}
        </div>
      );
    }
    
    return <span>{format(dateRange.from, "MMM d, yyyy")}</span>;
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
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
            {dateRange.from ? (
              getDisplayValue()
            ) : (
              <span className="text-sm">Select dates</span>
            )}
            <ChevronDown className="h-3.5 w-3.5 opacity-50 ml-auto" />
          </div>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] p-0">
        <DialogHeader className="p-4 pb-2">
          <DialogTitle className="flex items-center gap-2 text-foreground">
            <CalendarIcon className="h-4 w-4 text-primary" />
            Select Trip Dates
          </DialogTitle>
        </DialogHeader>
        
        <div className="max-h-[70vh] overflow-auto space-y-4 p-4 pt-0">
          {/* Trip summary moved to top */}
          {dateRange.from && dateRange.to && (
            <div className="p-3 bg-muted/30 rounded-md mb-4 mt-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">Check-in</p>
                    <p className="font-medium">{format(dateRange.from, "EEE, MMM d")}</p>
                  </div>
                  <span className="text-muted-foreground">→</span>
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">Check-out</p>
                    <p className="font-medium">{format(dateRange.to, "EEE, MMM d")}</p>
                  </div>
                </div>
                {tripDuration !== null && (
                  <Badge variant="secondary" className="ml-auto">
                    {tripDuration} {tripDuration === 1 ? 'night' : 'nights'}
                  </Badge>
                )}
              </div>
            </div>
          )}
          
          {/* Quick presets for common trip durations */}
          <div className="space-y-2">
            <Label className="text-sm font-medium block">
              Quick Select
            </Label>
            
            <div className="flex flex-wrap gap-2">
              {presets.map((preset) => (
                <Button
                  key={preset.label}
                  variant="outline"
                  size="sm"
                  className="h-8 px-3"
                  onClick={() => applyPreset(preset.days)}
                  type="button"
                >
                  {preset.label}
                </Button>
              ))}
            </div>
          </div>
          
          {/* Enhanced calendar with fixed navigation */}
          <div className="rounded-md border shadow-sm overflow-hidden">
            <div className="bg-muted/40 p-3 flex items-center">
              <h3 className="font-medium text-sm">Choose Dates</h3>
            </div>
            
            {/* Fixed calendar with proper navigation and styling */}
            <div className="p-3">
              <Calendar
                mode="range"
                selected={dateRange}
                onSelect={(range) => {
                  if (range) {
                    setDateRange({ 
                      from: range.from, 
                      to: range.to || (range.from ? addDays(range.from, 1) : undefined)
                    });
                  }
                }}
                initialFocus
                numberOfMonths={2}
                fixedWeeks
                styles={{
                  caption_start: { position: 'relative' },
                  caption_end: { position: 'relative' },
                  nav_button_previous: { position: 'absolute', left: 0 },
                  nav_button_next: { position: 'absolute', right: 0 },
                  caption_label: { fontSize: '15px' }
                }}
                classNames={{
                  months: "grid grid-cols-1 md:grid-cols-2 gap-8", // Wider gap
                  month: "space-y-4",
                  caption: "flex justify-center pt-1 relative items-center mb-4", // More space below
                  caption_label: "text-sm font-medium", 
                  table: "w-full border-collapse space-y-1",
                  head_row: "flex",
                  head_cell: "text-muted-foreground rounded-md w-9 font-medium text-xs flex-1",
                  row: "flex w-full mt-2",
                  cell: "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 flex-1",
                  day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100 mx-auto rounded-md",
                  day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                  day_today: "border border-primary/20 bg-primary/10",
                  day_outside: "text-muted-foreground opacity-50",
                  day_disabled: "text-muted-foreground opacity-50",
                  day_range_middle: "aria-selected:bg-primary/20 aria-selected:text-primary-foreground rounded-none",
                  day_hidden: "invisible",
                }}
                components={{
                  IconLeft: () => <ChevronLeft className="h-4 w-4" />,
                  IconRight: () => <ChevronRight className="h-4 w-4" />,
                }}
              />
            </div>
          </div>
          
          {/* Trip notes and options */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between space-x-2">
              <div className="space-y-0.5">
                <Label htmlFor="flexible-dates" className="font-medium">Flexible Dates</Label>
                <p className="text-xs text-muted-foreground">Allow ±3 days from your selected dates</p>
              </div>
              <Switch 
                id="flexible-dates" 
                checked={isFlexible}
                onCheckedChange={(checked) => setValue("dates.isFlexible", checked)}
              />
            </div>
            
            {isFlexible && (
              <div className="p-3 bg-primary/5 border border-primary/10 rounded-md flex items-center gap-2 text-xs">
                <CalendarClock className="h-3.5 w-3.5 text-primary" />
                <span>Your trip planner will suggest optimal dates within this range</span>
              </div>
            )}
          </div>
        </div>
        
        <DialogFooter className="flex justify-between gap-4 p-4 pt-3 border-t">
          <Button 
            type="button"
            variant="outline" 
            onClick={handleClear}
            size="sm"
            className="gap-1.5"
          >
            <X className="h-3.5 w-3.5" />
            Clear
          </Button>
          <Button 
            type="button"
            onClick={handleApply}
            size="sm"
            className="gap-1.5 px-5"
            disabled={!dateRange.from || !dateRange.to}
          >
            <Check className="h-3.5 w-3.5" />
            Apply
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}