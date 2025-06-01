import React from "react";
import { TripMetadata } from "@/types/itinerary";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import {
  Compass,
  Calendar,
  DollarSign,
  CalendarClock,
  User
} from "lucide-react";

interface TripSummaryProps {
  metadata: TripMetadata;
  currentUser: string;
  currentDateTime: string;
}

const TripSummary: React.FC<TripSummaryProps> = ({
  metadata,
  currentUser,
  currentDateTime,
}) => {
  return (
    <>
      <Card className="overflow-hidden border-primary/10 shadow-sm">
        <div className="p-4 border-b bg-muted/30">
          <h3 className="text-lg font-medium">Trip Summary</h3>
        </div>
        
        <div className="p-4 space-y-4">
          {/* Trip Type & Duration */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Compass className="h-4 w-4 text-primary" />
              </div>
              <span className="text-sm">Trip Type</span>
            </div>
            <Badge className="capitalize">
              {metadata.trip_type}
            </Badge>
          </div>
          
          <Separator />
          
          {/* Dates */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Calendar className="h-4 w-4 text-primary" />
              </div>
              <span className="text-sm">Duration</span>
            </div>
            <span className="text-sm font-medium">{metadata.duration_days} days</span>
          </div>
          
          <Separator />
          
          {/* Budget */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                <DollarSign className="h-4 w-4 text-primary" />
              </div>
              <span className="text-sm">Budget</span>
            </div>
            <span className="text-sm font-medium">
              {metadata.total_budget?.total} {metadata.total_budget?.currency}
            </span>
          </div>
          
          {/* Budget Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Budget Progress</span>
              <span>40%</span>
            </div>
            <Progress value={40} className="h-2" />
          </div>
          
          <Separator />
          
          {/* Budget Breakdown */}
          {metadata.total_budget?.breakdown && (
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="bg-muted/30 p-2 rounded-md">
                  <div className="text-xs text-muted-foreground">Accommodation</div>
                  <div className="font-medium">
                    {metadata.total_budget.breakdown.accommodation} {metadata.total_budget.currency}
                  </div>
                </div>
                
                <div className="bg-muted/30 p-2 rounded-md">
                  <div className="text-xs text-muted-foreground">Transportation</div>
                  <div className="font-medium">
                    {metadata.total_budget.breakdown.transportation} {metadata.total_budget.currency}
                  </div>
                </div>
                
                <div className="bg-muted/30 p-2 rounded-md">
                  <div className="text-xs text-muted-foreground">Activities</div>
                  <div className="font-medium">
                    {metadata.total_budget.breakdown.activities} {metadata.total_budget.currency}
                  </div>
                </div>
                
                <div className="bg-muted/30 p-2 rounded-md">
                  <div className="text-xs text-muted-foreground">Food</div>
                  <div className="font-medium">
                    {metadata.total_budget.breakdown.food} {metadata.total_budget.currency}
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <Separator />
          
          {/* Preferences */}
          {metadata.preferences && (
            <div className="space-y-3">
              <div className="flex flex-wrap gap-1">
                {metadata.preferences.pace && (
                  <Badge variant="outline" className="bg-muted/30">
                    {metadata.preferences.pace} pace
                  </Badge>
                )}
                
                {metadata.preferences.dietary_restrictions?.map((diet, idx) => (
                  <Badge key={idx} variant="outline" className="bg-muted/30">
                    {diet}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="bg-muted/30 p-3 border-t text-xs text-muted-foreground">
          <div className="flex items-center justify-center gap-2 mb-1">
            <CalendarClock className="h-3 w-3" />
            <span>Last updated: {currentDateTime}</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <User className="h-3 w-3" />
            <span>Created by: {currentUser}</span>
          </div>
        </div>
      </Card>
    </>
  );
};

export default TripSummary;