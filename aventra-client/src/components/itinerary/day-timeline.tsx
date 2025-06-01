import React from "react";
import { TimeBlock } from "@/types/itinerary";
import ActivityTimelineItem from "./activity-timeline";

interface DayTimelineProps {
  timeBlocks: TimeBlock[];
}

const DayTimeline: React.FC<DayTimelineProps> = ({ timeBlocks }) => {
  return (
    <div className="p-4">
      <div className="relative">
        {timeBlocks.map((block, idx) => {
          const isLastItem = idx === timeBlocks.length - 1;
          
          return (
            <ActivityTimelineItem 
              key={idx} 
              timeBlock={block} 
              isLastItem={isLastItem}
            />
          );
        })}
      </div>
    </div>
  );
};

export default DayTimeline;