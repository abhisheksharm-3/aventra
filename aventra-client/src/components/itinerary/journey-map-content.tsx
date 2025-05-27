import React from "react";
import { JourneyPath } from "@/types/itinerary";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Map } from "lucide-react";

interface JourneyMapContentProps {
  journeyPath: JourneyPath;
}

const JourneyMapContent: React.FC<JourneyMapContentProps> = ({ journeyPath }) => {
  return (
    <Card className="border-primary/10 shadow-sm overflow-hidden">
      <div className="bg-muted/30 p-4 border-b">
        <h3 className="text-lg font-medium">Journey Path</h3>
        <p className="text-sm text-muted-foreground">
          {journeyPath.distance_km}km total distance with elevation changes
        </p>
      </div>
      
      <div className="p-4">
        <div className="bg-muted/30 rounded-lg p-4 mb-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Total Distance</p>
              <p className="text-2xl font-semibold">{journeyPath.distance_km} km</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Peak Elevation</p>
              <p className="text-2xl font-semibold">
                {Math.max(...journeyPath.elevation_profile.map(p => p.elevation))} m
              </p>
            </div>
          </div>
        </div>
        
        {/* Elevation Profile Visualization */}
        <div className="bg-muted/20 rounded-lg p-4">
          <h4 className="text-sm font-medium mb-2">Elevation Profile</h4>
          <div className="h-32 relative mb-1">
            <div className="absolute left-0 right-0 bottom-0 h-px bg-muted-foreground/20"></div>
            <div className="absolute left-0 bottom-0 top-0 w-px bg-muted-foreground/20"></div>
            
            {/* Elevation Bars */}
            <div className="flex items-end h-full gap-[2px]">
              {journeyPath.elevation_profile.map((point, idx) => {
                const maxElevation = Math.max(...journeyPath.elevation_profile.map(p => p.elevation));
                const heightPercent = (point.elevation / maxElevation * 100);
                
                return (
                  <div 
                    key={idx}
                    className="flex-1 bg-primary/70 hover:bg-primary transition-colors rounded-t"
                    style={{ height: `${heightPercent}%` }}
                    title={`${point.distance}km - Elevation: ${point.elevation}m`}
                  ></div>
                );
              })}
            </div>
          </div>
          <div className="flex justify-between text-xs text-muted-foreground mt-2">
            <div>Start (0 km)</div>
            <div>End ({journeyPath.distance_km} km)</div>
          </div>
        </div>
        
        <div className="mt-6">
          <h4 className="text-sm font-medium mb-3">Route Overview</h4>
          <div className="h-64 rounded-lg overflow-hidden bg-muted/20 flex items-center justify-center">
            <div className="text-center p-4">
              <Map className="h-8 w-8 text-muted-foreground/50 mx-auto mb-2" />
              <p className="text-muted-foreground">Interactive map would be displayed here</p>
              <Button variant="outline" size="sm" className="mt-3 gap-1.5">
                <ExternalLink className="h-3.5 w-3.5" />
                <a 
                  href={`https://www.google.com/maps/dir/?api=1&origin=${journeyPath.overview[0].lat},${journeyPath.overview[0].lng}&destination=${journeyPath.overview[journeyPath.overview.length-1].lat},${journeyPath.overview[journeyPath.overview.length-1].lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View on Google Maps
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default JourneyMapContent;