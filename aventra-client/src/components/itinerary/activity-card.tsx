import React from "react";
import Image from "next/image";
import { TimeBlock } from "@/types/itinerary";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  MapPin, 
  DollarSign, 
  ExternalLink, 
  AlertTriangle, 
  Clock, 
  Heart, 
  Star 
} from "lucide-react";

interface ActivityCardProps {
  timeBlock: TimeBlock;
}

const ActivityCard: React.FC<ActivityCardProps> = ({ timeBlock }) => {
  const isActivity = timeBlock.activity && timeBlock.activity.type !== "travel";
  
  return (
    <Card 
      className={`overflow-hidden shadow-sm hover:shadow-md transition-shadow
        ${isActivity ? "border-l-2 border-l-primary" : ""}`}
    >
      {isActivity && timeBlock.activity?.images && timeBlock.activity.images.length > 0 && (
        <div className="relative h-48 w-full">
          <Image
            src={timeBlock.activity.images[0]}
            alt={timeBlock.activity.title || "Activity image"}
            fill
            className="object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
            {timeBlock.activity.type && (
              <Badge className="mb-2 capitalize">
                {timeBlock.activity.type}
              </Badge>
            )}
          </div>
        </div>
      )}
      
      <CardContent className={`p-4 ${!isActivity ? "bg-muted/30" : ""}`}>
        <div className="flex justify-between items-start mb-2">
          <h4 className="text-base font-medium">
            {isActivity ? timeBlock.activity?.title : `${timeBlock.travel?.mode} Journey`}
          </h4>
          {isActivity && timeBlock.activity?.priority && (
            <div className="flex items-center">
              {Array.from({ length: Math.min(timeBlock.activity.priority, 5) }).map((_, i) => (
                <Star key={i} className="h-3 w-3 text-amber-400 fill-amber-400" />
              ))}
            </div>
          )}
        </div>
        
        <p className="text-sm text-muted-foreground mb-3">
          {isActivity 
            ? timeBlock.activity?.description 
            : timeBlock.travel?.details}
        </p>
        
        <div className="flex flex-wrap gap-2 items-center mt-3">
          {/* Location */}
          {isActivity && timeBlock.activity?.location && (
            <div className="flex items-center text-xs gap-1 bg-muted/60 px-2 py-1 rounded-md">
              <MapPin className="h-3 w-3" />
              <span>{timeBlock.activity.location.name}</span>
            </div>
          )}
          
          {/* Cost */}
          {isActivity && timeBlock.activity?.cost && (
            <div className="flex items-center text-xs gap-1 bg-muted/60 px-2 py-1 rounded-md">
              <DollarSign className="h-3 w-3" />
              <span>
                {timeBlock.activity.cost.range} {timeBlock.activity.cost.currency}
              </span>
            </div>
          )}
          
          {/* Travel cost */}
          {!isActivity && timeBlock.travel?.cost && (
            <div className="flex items-center text-xs gap-1 bg-muted/60 px-2 py-1 rounded-md">
              <DollarSign className="h-3 w-3" />
              <span>
                {timeBlock.travel.cost.range} {timeBlock.travel.cost.currency}
              </span>
            </div>
          )}
          
          {/* Travel link */}
          {!isActivity && timeBlock.travel?.link && (
            <a 
              href={timeBlock.travel.link} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center text-xs gap-1 text-primary hover:underline"
            >
              <ExternalLink className="h-3 w-3" />
              <span>Booking details</span>
            </a>
          )}
        </div>
        
        {/* Activity highlights */}
        {isActivity && timeBlock.activity?.highlights && timeBlock.activity.highlights.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {timeBlock.activity.highlights.map((highlight, i) => (
              <Badge key={i} variant="outline" className="text-xs bg-primary/5 border-primary/20">
                {highlight}
              </Badge>
            ))}
          </div>
        )}
        
        {/* Warnings */}
        {timeBlock.warnings && timeBlock.warnings.length > 0 && (
          <div className="mt-3 p-2.5 bg-amber-50 border border-amber-200 rounded-md">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              <span className="text-sm text-amber-800">
                {timeBlock.warnings[0].message}
              </span>
            </div>
          </div>
        )}
      </CardContent>
      
      {/* Activity Actions */}
      {isActivity && (
        <CardFooter className="px-4 py-3 bg-muted/30 flex justify-between border-t">
          <div className="flex items-center text-xs text-muted-foreground">
            <Clock className="h-3.5 w-3.5 mr-1" />
            <span>{timeBlock.duration_minutes} minutes</span>
          </div>
          
          <div className="flex gap-2">
            {timeBlock.activity?.location?.google_maps_link && (
              <a 
                href={timeBlock.activity.location.google_maps_link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-primary hover:underline flex items-center gap-1"
              >
                <MapPin className="h-3.5 w-3.5" />
                <span>View on Maps</span>
              </a>
            )}
            {timeBlock.activity?.link && (
              <a
                href={timeBlock.activity.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-primary hover:underline flex items-center gap-1"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                <span>Visit Site</span>
              </a>
            )}
            <button 
              className="text-xs text-primary hover:underline flex items-center gap-1"
            >
              <Heart className="h-3.5 w-3.5" />
              <span>Save</span>
            </button>
          </div>
        </CardFooter>
      )}
    </Card>
  );
};

export default ActivityCard;