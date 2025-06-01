import React from "react";
import { TimeBlock } from "@/types/itinerary";
import { Badge } from "@/components/ui/badge";
import ActivityCard from "./activity-card";
import { formatTime, getActivityIcon, getTravelIcon } from "@/lib/utils/itinerary-utils";

interface ActivityTimelineItemProps {
  timeBlock: TimeBlock;
  isLastItem: boolean;
}

const ActivityTimelineItem: React.FC<ActivityTimelineItemProps> = ({ 
  timeBlock, 
  isLastItem 
}) => {
  const isActivity = timeBlock.activity && timeBlock.activity.type !== "travel";
  const activityType = timeBlock.activity?.type || "";
  
  return (
    <div className="relative pb-8">
      {!isLastItem && (
        <span 
          className="absolute top-5 left-5 -ml-px h-full w-0.5 bg-border" 
          aria-hidden="true"
        />
      )}
      
      <div className="relative flex items-start space-x-4">
        {/* Timeline Dot */}
        <div className="relative px-1">
          <div className={`h-10 w-10 rounded-full flex items-center justify-center border-2 ${
              timeBlock.type === "fixed" 
                ? "border-primary bg-primary/10" 
                : "border-muted-foreground/30 bg-muted/60"
            }`}
          >
            {isActivity ? (
              getActivityIcon(activityType)
            ) : (
              getTravelIcon(timeBlock.travel?.mode || "car")
            )}
          </div>
        </div>
        
        {/* Timeline Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="bg-muted/60 text-xs px-2 py-0.5 rounded font-medium">
              {formatTime(timeBlock.start_time)} - {formatTime(timeBlock.end_time)}
            </span>
            <span className="text-xs text-muted-foreground">
              ({timeBlock.duration_minutes / 60} hrs)
            </span>
            {timeBlock.type === "flexible" && (
              <Badge variant="outline" className="text-[10px] bg-blue-50 text-blue-600 border-blue-200">
                Flexible
              </Badge>
            )}
          </div>
          
          <ActivityCard timeBlock={timeBlock} />
        </div>
      </div>
    </div>
  );
};

export default ActivityTimelineItem;