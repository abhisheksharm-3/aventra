import React from "react";
import { motion } from "framer-motion";
import { format, parseISO } from "date-fns";
import { DayItinerary } from "@/types/itinerary";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDateFull, getWeatherIcon } from "@/lib/utils/itinerary-utils";
import DayTimeline from "./day-timeline";


interface DailyItineraryContentProps {
  itinerary: DayItinerary[];
  activeDay: number;
  setActiveDay: (day: number) => void;
}

const DailyItineraryContent: React.FC<DailyItineraryContentProps> = ({
  itinerary,
  activeDay,
  setActiveDay
}) => {
  return (
    <>
      {/* Day Pills with improved scrolling */}
      <ScrollArea className="w-full pb-4">
        <div className="flex gap-2 p-1">
          {itinerary.map((day) => {
            const date = parseISO(day.date);
            const formattedDate = format(date, "MMM d");
            const isActive = day.day_number === activeDay;
            
            return (
              <button
                key={day.day_number}
                onClick={() => setActiveDay(day.day_number)}
                className={`inline-flex flex-col items-center px-4 py-2 rounded-full transition-all ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "bg-muted hover:bg-muted/80"
                }`}
              >
                <span className={`text-xs ${isActive ? "font-medium" : ""}`}>Day {day.day_number}</span>
                <span className="text-xs">{formattedDate}</span>
              </button>
            );
          })}
        </div>
      </ScrollArea>

      {/* Active Day Itinerary */}
      {itinerary.map((day) => {
        if (day.day_number === activeDay) {
          return (
            <motion.div
              key={day.day_number}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-4"
            >
              {/* Day Header with Date and Weather */}
              <Card className="mb-6 overflow-hidden border-primary/10 shadow-sm">
                <div className="bg-muted/30 p-4 flex justify-between items-center border-b">
                  <div>
                    <h3 className="text-lg font-medium">
                      Day {day.day_number}: {formatDateFull(day.date)}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      {day.time_blocks.length} planned activities
                    </p>
                  </div>
                  {day.weather && (
                    <div className="flex items-center gap-3 bg-background/80 px-3 py-2 rounded-md border">
                      <div className="flex items-center">
                        {getWeatherIcon(day.weather.conditions)}
                        <span className="text-sm ml-1.5">{day.weather.conditions}</span>
                      </div>
                      <div className="text-sm">
                        <span className="text-blue-500">{day.weather.temperature?.min}°</span>
                        <span className="mx-1">-</span>
                        <span className="text-red-500">{day.weather.temperature?.max}°C</span>
                      </div>
                    </div>
                  )}
                </div>
                
                <DayTimeline timeBlocks={day.time_blocks} />
              </Card>
            </motion.div>
          );
        }
        return null;
      })}
    </>
  );
};

export default DailyItineraryContent;