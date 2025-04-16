import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { addDays } from "date-fns";
import { DateFilterProps } from "@/types/hero";

export const DateFilter: React.FC<DateFilterProps> = ({ onClose, selectedDate, setSelectedDate }) => {
  const [dateRange, setDateRange] = useState({
    from: selectedDate?.from || new Date(),
    to: selectedDate?.to || addDays(new Date(), 7)
  });

  return (
    <div className="w-auto p-3">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-medium">Select Dates</h3>
        <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <CalendarComponent
        mode="range"
        defaultMonth={dateRange.from}
        selected={dateRange}
        onSelect={(range) => {
          if (range?.from && range?.to) {
            setDateRange({ from: range.from, to: range.to });
          }
        }}
        numberOfMonths={1}
        className="rounded-md border"
      />
      
      <div className="flex justify-between mt-4">
        <Button variant="ghost" size="sm" onClick={onClose}>
          Cancel
        </Button>
        <Button 
          size="sm" 
          onClick={() => {
            // Ensure both from and to are defined before passing to setSelectedDate
            if (dateRange.from && dateRange.to) {
              setSelectedDate(dateRange);
              onClose();
            }
          }}
        >
          Apply
        </Button>
      </div>
    </div>
  );
};