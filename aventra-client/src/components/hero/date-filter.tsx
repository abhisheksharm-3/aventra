"use client";

import React, { useState, useMemo, useEffect } from "react";
import { 
  addDays, format, startOfMonth, endOfMonth, isSameMonth, 
  isSameDay, isAfter, isBefore, startOfDay 
} from "date-fns";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";
import { motion } from "framer-motion";

interface DateFilterProps {
  onClose: () => void;
  selectedDate: { from: Date; to: Date } | null;
  setSelectedDate: (dateRange: { from: Date; to: Date }) => void;
}

const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

export function DateFilter({ onClose, selectedDate, setSelectedDate }: DateFilterProps) {
  // Current date is 2025-04-18
  const today = useMemo(() => startOfDay(new Date(2025, 3, 18)), []);
  
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
  const calendarDays = useMemo(() => {
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
  }, [activeMonth, range, today, hoveredDate, selectionMode]);
  
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
  const dateRangeText = useMemo(() => {
    if (isSameMonth(range.from, range.to)) {
      return `${format(range.from, "MMM d")} - ${format(range.to, "d, yyyy")}`;
    }
    return `${format(range.from, "MMM d")} - ${format(range.to, "MMM d, yyyy")}`;
  }, [range]);
  
  return (
    <div className="w-full max-w-[310px] mx-auto space-y-3">
      {/* Header with selected dates */}
      <div className="bg-muted/20 rounded-lg p-3">
        <div className="flex justify-between items-center">
          <div className="overflow-hidden">
            <div className="text-xs text-muted-foreground">Selected dates</div>
            <div className="text-base font-medium truncate">
              {dateRangeText}
            </div>
          </div>
          <div className="bg-primary/10 text-primary px-2 py-0.5 rounded-full text-xs font-medium shrink-0 ml-2">
            {dayCount} days
          </div>
        </div>
      </div>
      
      {/* Quick select options */}
      <div>
        <div className="text-xs font-medium mb-1.5">Quick select</div>
        <div className="grid grid-cols-3 gap-1.5">
          <button 
            onClick={() => handleQuickSelect(3)} 
            className="py-1 px-1 text-xs bg-muted/20 hover:bg-muted/40 rounded-md transition-colors"
          >
            Weekend (3 days)
          </button>
          <button 
            onClick={() => handleQuickSelect(7)} 
            className="py-1 px-1 text-xs bg-muted/20 hover:bg-muted/40 rounded-md transition-colors"
          >
            Week (7 days)
          </button>
          <button 
            onClick={() => handleQuickSelect(14)} 
            className="py-1 px-1 text-xs bg-muted/20 hover:bg-muted/40 rounded-md transition-colors"
          >
            Two Weeks
          </button>
        </div>
      </div>
      
      {/* Calendar */}
      <div className="border rounded-md overflow-hidden">
        {/* Month navigation */}
        <div className="flex items-center justify-between border-b px-2 py-1.5">
          <button 
            onClick={prevMonth}
            disabled={isSameMonth(activeMonth, today)}
            className="p-1 hover:bg-muted/20 rounded-md disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="Previous month"
          >
            <ChevronLeft size={16} />
          </button>
          <div className="font-medium text-sm">
            {format(activeMonth, "MMMM yyyy")}
          </div>
          <button 
            onClick={nextMonth}
            className="p-1 hover:bg-muted/20 rounded-md"
            aria-label="Next month"
          >
            <ChevronRight size={16} />
          </button>
        </div>
        
        {/* Days of week */}
        <div className="grid grid-cols-7 text-center py-1 border-b">
          {DAYS.map(day => (
            <div key={day} className="text-xs text-muted-foreground">
              {day}
            </div>
          ))}
        </div>
        
        {/* Calendar grid */}
        <div className="grid grid-cols-7">
          {calendarDays.map((day, i) => {
            // Base classes for day cell
            const baseClasses = "aspect-square flex items-center justify-center text-xs font-medium";
            
            // Classes for current month vs other months
            const monthClasses = day.isCurrentMonth 
              ? "" 
              : "text-muted-foreground/40";
            
            // Classes for today
            const todayClasses = day.isToday
              ? "ring-1 ring-inset ring-primary/40"
              : "";
            
            // Classes for selected state
            const selectedClasses = day.isSelected && !day.isRangeStart && !day.isRangeEnd
              ? "bg-primary/20"
              : "";
            
            // Classes for range start and end
            const rangeStartClasses = day.isRangeStart
              ? "bg-primary text-primary-foreground rounded-l-sm"
              : "";
              
            const rangeEndClasses = day.isRangeEnd
              ? "bg-primary text-primary-foreground rounded-r-sm"
              : "";
              
            // Classes for hovering (preview)
            const hoverClasses = day.isHovering && !day.isRangeStart && !day.isRangeEnd
              ? "bg-primary/30"
              : "";
            
            // Classes for disabled state
            const disabledClasses = day.isDisabled
              ? "cursor-not-allowed opacity-40"
              : "cursor-pointer hover:bg-muted/30";
            
            return (
              <motion.button
                key={i}
                disabled={day.isDisabled}
                onClick={() => day.isCurrentMonth && !day.isDisabled && handleDateClick(day.date)}
                onMouseEnter={() => day.isCurrentMonth && !day.isDisabled && handleDateHover(day.date)}
                className={`${baseClasses} ${monthClasses} ${todayClasses} ${selectedClasses} 
                  ${rangeStartClasses} ${rangeEndClasses} ${hoverClasses} ${disabledClasses}`}
                whileTap={{ scale: day.isDisabled ? 1 : 0.95 }}
                transition={{ duration: 0.1 }}
              >
                {day.date.getDate()}
              </motion.button>
            );
          })}
        </div>
        
        {/* Legend */}
        <div className="border-t px-2 py-1 flex items-center text-xs text-muted-foreground">
          <div className="w-2 h-2 bg-primary/30 rounded-full mr-1"></div>
          <span>Today</span>
        </div>
      </div>
      
      {/* Helper text */}
      <div className="text-xs text-muted-foreground">
        {selectionMode === 'end' 
          ? "Now select your end date" 
          : "Select a date range for your trip"}
      </div>
      
      {/* Action buttons */}
      <div className="flex justify-end space-x-2 pt-2">
        <button
          onClick={onClose}
          className="px-3 py-1 text-xs border rounded-md hover:bg-muted/20 transition"
        >
          Cancel
        </button>
        <button
          onClick={() => {
            setSelectedDate(range);
            onClose();
          }}
          className="px-3 py-1 text-xs bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition flex items-center gap-1"
        >
          <Check size={12} />
          Apply Dates
        </button>
      </div>
    </div>
  );
}