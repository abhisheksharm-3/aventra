"use client";

import React, { useState, useEffect } from "react";
import { 
  addDays, format, startOfMonth, endOfMonth, isSameMonth, 
  isSameDay, isAfter, isBefore, startOfDay 
} from "date-fns";
import { 
  ChevronLeft, ChevronRight, Check, Calendar,
  CalendarDays, Clock
} from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

interface DateFilterProps {
  onClose: () => void;
  selectedDate: { from: Date; to: Date } | null;
  setSelectedDate: (dateRange: { from: Date; to: Date }) => void;
}

const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

export function DateFilter({ onClose, selectedDate, setSelectedDate }: DateFilterProps) {
  // Current date is 2025-04-18
  const today = startOfDay(new Date(2025, 3, 18));
  
  // Initialize state from props or defaults
  const [range, setRange] = useState<{from: Date; to: Date}>({
    from: selectedDate?.from || today,
    to: selectedDate?.to || addDays(today, 7)
  });
  
  const [activeMonth, setActiveMonth] = useState<Date>(range.from);
  const [selectionMode, setSelectionMode] = useState<'start' | 'end'>('start');
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);
  
  // Reset selection mode when component mounts
  useEffect(() => {
    setSelectionMode('start');
  }, []);
  
  // Calculate calendar days for current month view
  const calendarDays = (() => {
    const firstDay = startOfMonth(activeMonth);
    const lastDay = endOfMonth(activeMonth);
    const days = [];
    
    // Get the day of week for the first day (0 = Sunday)
    const startWeekday = firstDay.getDay();
    
    // Add padding days from previous month
    for (let i = 0; i < startWeekday; i++) {
      days.push({
        date: addDays(firstDay, i - startWeekday),
        isCurrentMonth: false,
        isDisabled: true
      });
    }
    
    // Add days of current month
    for (let d = 0; d < lastDay.getDate(); d++) {
      const date = new Date(activeMonth.getFullYear(), activeMonth.getMonth(), d + 1);
      days.push({
        date,
        isCurrentMonth: true,
        isDisabled: isBefore(date, today) && !isSameDay(date, today),
        isToday: isSameDay(date, today),
        isSelected: isInRange(date, range.from, range.to),
        isRangeStart: isSameDay(date, range.from),
        isRangeEnd: isSameDay(date, range.to),
        isHovering: selectionMode === 'end' && 
          hoveredDate && 
          isInRange(date, range.from, hoveredDate) &&
          !isSameDay(date, range.from)
      });
    }
    
    // Add padding days for next month to complete the grid
    const endWeekday = lastDay.getDay();
    for (let i = 1; i < (7 - endWeekday); i++) {
      days.push({
        date: addDays(lastDay, i),
        isCurrentMonth: false,
        isDisabled: true
      });
    }
    
    return days;
  })();
  
  // Check if date is in selected range
  function isInRange(date: Date, start: Date, end: Date) {
    const startDate = start < end ? start : end;
    const endDate = end > start ? end : start;
    
    return (
      (isAfter(date, startDate) && isBefore(date, endDate)) ||
      isSameDay(date, startDate) ||
      isSameDay(date, endDate)
    );
  }
  
  // Handle date click
  function handleDateClick(date: Date) {
    if (selectionMode === 'start') {
      setRange({ from: date, to: date });
      setSelectionMode('end');
    } else {
      if (isBefore(date, range.from)) {
        setRange({ from: date, to: range.from });
      } else {
        setRange({ from: range.from, to: date });
      }
      setSelectionMode('start');
      setHoveredDate(null);
    }
  }
  
  // Handle date hover for range preview
  function handleDateHover(date: Date) {
    if (selectionMode === 'end') {
      setHoveredDate(date);
    }
  }
  
  // Quick select options
  function handleQuickSelect(days: number) {
    const start = new Date(today);
    const end = addDays(start, days - 1);
    setRange({ from: start, to: end });
    setSelectionMode('start');
    
    // Update active month to show selection
    setActiveMonth(start);
  }
  
  // Navigation
  function prevMonth() {
    setActiveMonth(new Date(activeMonth.getFullYear(), activeMonth.getMonth() - 1, 1));
  }
  
  function nextMonth() {
    setActiveMonth(new Date(activeMonth.getFullYear(), activeMonth.getMonth() + 1, 1));
  }
  
  // Calculate days between dates
  const dayCount = Math.round((range.to.getTime() - range.from.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  
  // Format date range for display
  const dateRangeText = (() => {
    if (isSameMonth(range.from, range.to)) {
      return `${format(range.from, "MMM d")} - ${format(range.to, "d, yyyy")}`;
    }
    return `${format(range.from, "MMM d")} - ${format(range.to, "MMM d, yyyy")}`;
  })();

  return (
    <div className="flex flex-col space-y-3 max-h-[calc(100vh-100px)] overflow-hidden">
      <DialogHeader className="space-y-0.5 px-1">
        <DialogTitle className="flex items-center gap-2 text-foreground">
          <CalendarDays className="h-4 w-4 text-primary" />
          Date Range
        </DialogTitle>
      </DialogHeader>
      
      {/* Date range summary */}
      <div className="bg-muted/20 rounded-lg p-2.5">
        <div className="flex justify-between items-center">
          <div className="overflow-hidden">
            <div className="text-xs text-muted-foreground">Selected dates</div>
            <div className="text-base font-medium truncate flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-primary" />
              {dateRangeText}
            </div>
          </div>
          <Badge 
            className="bg-primary/10 hover:bg-primary/20 text-primary border-0 font-medium px-2.5 py-0 h-5 text-xs transition-colors"
          >
            {dayCount} days
          </Badge>
        </div>
      </div>
      
      <ScrollArea className="flex-1 overflow-y-auto min-h-0 pr-2 -mr-2">
        <div className="space-y-3">
          {/* Quick select options */}
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <Clock className="h-3.5 w-3.5 text-muted-foreground" />
              <h4 className="text-xs font-medium">Quick select</h4>
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              <Button 
                onClick={() => handleQuickSelect(3)} 
                variant="outline"
                size="sm"
                className="h-7 text-xs font-normal hover:bg-primary/10 hover:text-primary transition-colors"
              >
                Weekend (3d)
              </Button>
              <Button 
                onClick={() => handleQuickSelect(7)} 
                variant="outline"
                size="sm"
                className="h-7 text-xs font-normal hover:bg-primary/10 hover:text-primary transition-colors"
              >
                Week (7d)
              </Button>
              <Button 
                onClick={() => handleQuickSelect(14)} 
                variant="outline"
                size="sm"
                className="h-7 text-xs font-normal hover:bg-primary/10 hover:text-primary transition-colors"
              >
                Two Weeks (14d)
              </Button>
              <Button 
                onClick={() => handleQuickSelect(30)} 
                variant="outline"
                size="sm"
                className="h-7 text-xs font-normal hover:bg-primary/10 hover:text-primary transition-colors"
              >
                Month (30d)
              </Button>
            </div>
          </div>
          
          {/* Calendar */}
          <div className="border rounded-md overflow-hidden shadow-sm bg-card">
            {/* Month navigation */}
            <div className="flex items-center justify-between border-b px-2 py-1.5 bg-muted/10">
              <Button
                variant="ghost"
                size="icon"
                onClick={prevMonth}
                disabled={isSameMonth(activeMonth, today)}
                className="h-6 w-6 rounded-full disabled:opacity-30"
              >
                <ChevronLeft size={14} />
              </Button>
              <div className="font-medium text-sm tracking-tight">
                {format(activeMonth, "MMMM yyyy")}
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={nextMonth}
                className="h-6 w-6 rounded-full"
              >
                <ChevronRight size={14} />
              </Button>
            </div>
            
            {/* Days of week */}
            <div className="grid grid-cols-7 text-center py-1 bg-muted/5">
              {DAYS.map(day => (
                <div key={day} className="text-xs font-medium text-muted-foreground">
                  {day}
                </div>
              ))}
            </div>
            
            {/* Calendar grid */}
            <div className="grid grid-cols-7 p-0.5 gap-0.5">
              {calendarDays.map((day, i) => {
                return (
                  <motion.button
                    key={i}
                    disabled={day.isDisabled}
                    onClick={() => day.isCurrentMonth && !day.isDisabled && handleDateClick(day.date)}
                    onMouseEnter={() => day.isCurrentMonth && !day.isDisabled && handleDateHover(day.date)}
                    className={`
                      relative h-6 w-6 flex items-center justify-center text-xs font-medium rounded-full
                      transition-all duration-150
                      ${!day.isCurrentMonth ? 'text-muted-foreground/30' : ''}
                      ${day.isToday ? 'ring-1 ring-inset ring-primary/40' : ''}
                      ${day.isSelected && !day.isRangeStart && !day.isRangeEnd ? 'bg-primary/15 z-10' : ''}
                      ${day.isRangeStart ? 'bg-primary text-primary-foreground rounded-l-full z-20' : ''}
                      ${day.isRangeEnd ? 'bg-primary text-primary-foreground rounded-r-full z-20' : ''}
                      ${day.isHovering && !day.isRangeStart && !day.isRangeEnd ? 'bg-primary/25 z-10' : ''}
                      ${day.isDisabled ? 'cursor-not-allowed opacity-40' : 'cursor-pointer hover:bg-accent'}
                    `}
                    whileTap={{ scale: day.isDisabled ? 1 : 0.9 }}
                    transition={{ duration: 0.1 }}
                  >
                    {day.date.getDate()}
                    
                    {/* Selection indicator */}
                    {day.isSelected && (day.isRangeStart || day.isRangeEnd) && (
                      <motion.span 
                        className="absolute inset-0 z-[-1] rounded-full bg-primary scale-90 opacity-20" 
                        layoutId="dateSelection"
                        transition={{ duration: 0.15, ease: "easeInOut" }}
                      />
                    )}
                  </motion.button>
                );
              })}
            </div>
            
            {/* Legend */}
            <div className="border-t px-2 py-1 flex items-center justify-between text-xs bg-muted/5">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span className="text-muted-foreground">Selected</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 border border-primary/30 rounded-full"></div>
                <span className="text-muted-foreground">Today</span>
              </div>
            </div>
          </div>
          
          {/* Helper text */}
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            {selectionMode === 'end' ? (
              <>
                <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4 font-normal border-primary/30 text-primary">
                  Step 2
                </Badge>
                <span>Select end date</span>
              </>
            ) : (
              <>
                <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4 font-normal border-muted">
                  Tip
                </Badge>
                <span>Select start and end dates</span>
              </>
            )}
          </div>
        </div>
      </ScrollArea>
      
      {/* Action buttons */}
      <DialogFooter className="flex justify-between gap-4 pt-2 mt-0 border-t">
        <Button
          type="button"
          variant="outline" 
          size="sm"
          onClick={onClose}
          className="h-8 border-gray-200"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          size="sm"
          className="h-8 gap-1.5 px-5"
          onClick={() => {
            setSelectedDate(range);
            onClose();
          }}
        >
          <Check className="h-3.5 w-3.5" />
          Apply
        </Button>
      </DialogFooter>
    </div>
  );
}