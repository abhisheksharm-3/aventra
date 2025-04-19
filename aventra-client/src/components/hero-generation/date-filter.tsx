"use client";

import { useState, useCallback } from "react";
import { 
  addDays, format, startOfMonth, endOfMonth, isSameMonth, 
  isSameDay, isAfter, isBefore, startOfDay, differenceInDays, isSunday,
} from "date-fns";
import { 
  ChevronLeft, ChevronRight, Check, Calendar,
  CalendarDays, Clock, ChevronsLeft, ChevronsRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface DateFilterProps {
  onClose: () => void;
  selectedDate: { from: Date; to: Date } | null;
  setSelectedDate: (dateRange: { from: Date; to: Date } | null) => void;
}

const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const POPULAR_DURATIONS = [
  { label: "Weekend (3d)", days: 3 },
  { label: "Week (7d)", days: 7 },
  { label: "Two Weeks (14d)", days: 14 },
  { label: "Month (30d)", days: 30 }
];
const MONTHS = [
  "January", "February", "March", "April", "May", "June", 
  "July", "August", "September", "October", "November", "December"
];

/**
 * @component DateFilter
 * @description A sophisticated date range picker component that allows users to
 * select start and end dates with visual feedback, quick-select options, and
 * intuitive month navigation.
 */
export function DateFilter({ onClose, selectedDate, setSelectedDate }: DateFilterProps) {
  // Use actual current date
  const today = startOfDay(new Date());
  
  // Initialize state from props or defaults
  const [range, setRange] = useState<{from: Date; to: Date}>({
    from: selectedDate?.from || today,
    to: selectedDate?.to || addDays(today, 7)
  });
  
  const [activeMonth, setActiveMonth] = useState<Date>(range.from);
  const [selectionMode, setSelectionMode] = useState<'start' | 'end'>('start');
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);
  const [showMonthSelector, setShowMonthSelector] = useState(false);
  
  /**
   * Generate the calendar days for the current month view
   */
  const generateCalendarDays = useCallback(() => {
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
          !isSameDay(date, range.from),
        isWeekend: isSunday(date) || date.getDay() === 6 // Saturday or Sunday
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
  }, [activeMonth, range.from, range.to, today, hoveredDate, selectionMode]);
  
  const calendarDays = generateCalendarDays();
  
  /**
   * Check if date is in the selected range
   */
  function isInRange(date: Date, start: Date, end: Date) {
    const startDate = start < end ? start : end;
    const endDate = end > start ? end : start;
    
    return (
      (isAfter(date, startDate) && isBefore(date, endDate)) ||
      isSameDay(date, startDate) ||
      isSameDay(date, endDate)
    );
  }
  
  /**
   * Handle date click to select range
   */
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
  
  /**
   * Handle date hover for range preview
   */
  function handleDateHover(date: Date) {
    if (selectionMode === 'end') {
      setHoveredDate(date);
    }
  }
  
  /**
   * Handle quick selection of predefined date ranges
   */
  function handleQuickSelect(days: number) {
    const start = new Date(today);
    const end = addDays(start, days - 1);
    setRange({ from: start, to: end });
    setSelectionMode('start');
    
    // Update active month to show selection
    setActiveMonth(start);
  }
  
  /**
   * Handle custom duration selection
   */
  function handleCustomDuration(days: number) {
    // Use either the existing from date or today
    const start = range.from && !isBefore(range.from, today) ? range.from : today;
    const end = addDays(start, days - 1);
    
    setRange({ from: start, to: end });
    setSelectionMode('start');
  }
  
  /**
   * Month navigation functions
   */
  function prevMonth() {
    setActiveMonth(new Date(activeMonth.getFullYear(), activeMonth.getMonth() - 1, 1));
  }
  
  function nextMonth() {
    setActiveMonth(new Date(activeMonth.getFullYear(), activeMonth.getMonth() + 1, 1));
  }
  
  function jumpToPrevYear() {
    setActiveMonth(new Date(activeMonth.getFullYear() - 1, activeMonth.getMonth(), 1));
  }
  
  function jumpToNextYear() {
    setActiveMonth(new Date(activeMonth.getFullYear() + 1, activeMonth.getMonth(), 1));
  }
  
  /**
   * Handle month selection from dropdown
   */
  function handleMonthChange(monthIndex: string) {
    setActiveMonth(new Date(activeMonth.getFullYear(), parseInt(monthIndex), 1));
  }
  
  /**
   * Handle year selection from dropdown
   */
  function handleYearChange(year: string) {
    setActiveMonth(new Date(parseInt(year), activeMonth.getMonth(), 1));
  }
  
  // Calculate days between dates
  const dayCount = differenceInDays(range.to, range.from) + 1;
  
  // Format date range for display
  const dateRangeText = (() => {
    if (isSameDay(range.from, range.to)) {
      return format(range.from, "MMM d, yyyy");
    } else if (isSameMonth(range.from, range.to)) {
      return `${format(range.from, "MMM d")} - ${format(range.to, "d, yyyy")}`;
    }
    return `${format(range.from, "MMM d")} - ${format(range.to, "MMM d, yyyy")}`;
  })();
  
  // Generate years for dropdown (5 years back, 10 years forward)
  const years = Array.from({ length: 16 }, (_, i) => today.getFullYear() - 5 + i);
  
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
            {dayCount} {dayCount === 1 ? 'day' : 'days'}
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
            <div className="grid grid-cols-2 gap-1.5 mb-2">
              {POPULAR_DURATIONS.map((duration) => (
                <Button 
                  key={duration.days}
                  onClick={() => handleQuickSelect(duration.days)} 
                  variant="outline"
                  size="sm"
                  className={`h-7 text-xs font-normal hover:bg-primary/10 hover:text-primary transition-colors ${
                    dayCount === duration.days ? 'border-primary/40 bg-primary/5 text-primary' : ''
                  }`}
                >
                  {duration.label}
                </Button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <div className="text-xs text-muted-foreground">Custom:</div>
              <Select onValueChange={(value) => handleCustomDuration(Number(value))}>
                <SelectTrigger className="h-7 text-xs w-24">
                  <SelectValue placeholder="Select..." />
                </SelectTrigger>
                <SelectContent>
                  {[2, 3, 4, 5, 7, 10, 14, 21, 30, 60, 90].map((days) => (
                    <SelectItem key={days} value={days.toString()}>
                      {days} {days === 1 ? 'day' : 'days'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* Calendar */}
          <div className="border rounded-md overflow-hidden shadow-sm bg-card">
            {/* Month navigation */}
            <div className="flex items-center justify-between border-b px-2 py-1.5 bg-muted/10">
              <div className="flex items-center gap-1">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={jumpToPrevYear}
                      className="h-6 w-6 rounded-full"
                    >
                      <ChevronsLeft size={14} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="text-xs">Previous year</TooltipContent>
                </Tooltip>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={prevMonth}
                      disabled={isSameMonth(activeMonth, today)}
                      className="h-6 w-6 rounded-full disabled:opacity-30"
                    >
                      <ChevronLeft size={14} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="text-xs">Previous month</TooltipContent>
                </Tooltip>
              </div>
              
              <button 
                className="font-medium text-sm tracking-tight hover:bg-muted/50 py-1 px-2 rounded transition-colors"
                onClick={() => setShowMonthSelector(!showMonthSelector)}
              >
                {format(activeMonth, "MMMM yyyy")}
              </button>
              
              <div className="flex items-center gap-1">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={nextMonth}
                      className="h-6 w-6 rounded-full"
                    >
                      <ChevronRight size={14} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="text-xs">Next month</TooltipContent>
                </Tooltip>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={jumpToNextYear}
                      className="h-6 w-6 rounded-full"
                    >
                      <ChevronsRight size={14} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="text-xs">Next year</TooltipContent>
                </Tooltip>
              </div>
            </div>
            
            {/* Month/Year selector dropdown */}
            <AnimatePresence>
              {showMonthSelector && (
                <motion.div 
                  className="border-b px-2 py-1.5 bg-muted/10 flex items-center justify-between gap-2"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Select 
                    defaultValue={activeMonth.getMonth().toString()} 
                    onValueChange={handleMonthChange}
                  >
                    <SelectTrigger className="h-7 w-[110px] text-xs">
                      <SelectValue placeholder="Month" />
                    </SelectTrigger>
                    <SelectContent>
                      {MONTHS.map((month, index) => (
                        <SelectItem 
                          key={month} 
                          value={index.toString()}
                          disabled={
                            index < today.getMonth() && 
                            activeMonth.getFullYear() === today.getFullYear()
                          }
                        >
                          {month}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Select 
                    defaultValue={activeMonth.getFullYear().toString()} 
                    onValueChange={handleYearChange}
                  >
                    <SelectTrigger className="h-7 w-[90px] text-xs">
                      <SelectValue placeholder="Year" />
                    </SelectTrigger>
                    <SelectContent>
                      {years.map(year => (
                        <SelectItem key={year} value={year.toString()}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={() => setActiveMonth(today)}
                    className="h-7 text-xs"
                  >
                    Today
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
            
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
                      relative h-7 w-7 flex items-center justify-center text-xs font-medium rounded-full
                      transition-all duration-150
                      ${!day.isCurrentMonth ? 'text-muted-foreground/30' : ''}
                      ${day.isWeekend && day.isCurrentMonth && !day.isSelected ? 'text-primary/70' : ''}
                      ${day.isToday ? 'ring-1 ring-inset ring-primary/40' : ''}
                      ${day.isSelected && !day.isRangeStart && !day.isRangeEnd ? 'bg-primary/15 z-10' : ''}
                      ${day.isRangeStart ? 'bg-primary text-primary-foreground rounded-l-full z-20' : ''}
                      ${day.isRangeEnd ? 'bg-primary text-primary-foreground rounded-r-full z-20' : ''}
                      ${day.isHovering && !day.isRangeStart && !day.isRangeEnd ? 'bg-primary/25 z-10' : ''}
                      ${day.isDisabled ? 'cursor-not-allowed opacity-40' : 'cursor-pointer hover:bg-accent'}
                    `}
                    whileTap={{ scale: day.isDisabled ? 1 : 0.9 }}
                    transition={{ duration: 0.1 }}
                    aria-selected={day.isSelected}
                    aria-disabled={day.isDisabled}
                    aria-label={day.isCurrentMonth ? format(day.date, "MMMM d, yyyy") : undefined}
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
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-primary/30 rounded-full"></div>
                <span className="text-muted-foreground">Weekend</span>
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
                <span>Click and drag to select multiple days quickly</span>
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
          className="h-8"
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