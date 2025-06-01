import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plane, Bus, Car, Clock, DollarSign, ExternalLink } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

interface TransportationOption {
  mode: string;
  details: string;
  duration_minutes: number | null;
  cost: {
    currency: string;
    range: string;
    per_unit?: string;
  };
  link?: string | null;
  operator?: string;
}

interface TransportationListProps {
  transportation: TransportationOption[];
}

export default function TransportationList({ transportation }: TransportationListProps) {
  // Helper function to render appropriate icon based on transport mode
  const getTransportIcon = (mode: string) => {
    switch (mode.toLowerCase()) {
      case "flight":
        return <Plane className="h-5 w-5" />;
      case "bus":
      case "overnight bus":
        return <Bus className="h-5 w-5" />;
      default:
        return <Car className="h-5 w-5" />;
    }
  };

  // Helper function to format duration
  const formatDuration = (minutes: number | null) => {
    if (!minutes) return "Variable";
    
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours > 0) {
      return `${hours}h${mins > 0 ? ` ${mins}m` : ''}`;
    }
    return `${mins}m`;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">Transportation Options</h3>
      </div>
      
      <div className="grid gap-4">
        {transportation.map((option, index) => (
          <Card key={index} className="overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <div className="bg-primary/10 p-2 rounded-full">
                  {getTransportIcon(option.mode)}
                </div>
                <div>
                  <CardTitle className="text-lg">{option.mode}</CardTitle>
                  <CardDescription className="text-sm">{option.operator}</CardDescription>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="pb-3">
              <p className="text-sm text-muted-foreground mb-3">{option.details}</p>
              
              <div className="grid grid-cols-2 gap-2">
                {option.duration_minutes && (
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{formatDuration(option.duration_minutes)}</span>
                  </div>
                )}
                
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    {option.cost.range} {option.cost.per_unit && `(${option.cost.per_unit})`}
                  </span>
                </div>
              </div>
              
              {option.link && (
                <div className="mt-3">
                  <Button variant="outline" size="sm" className="w-full" asChild>
                    <a href={option.link} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-3.5 w-3.5 mr-1" />
                      Book Now
                    </a>
                  </Button>
                </div>
              )}
            </CardContent>
            
            {index < transportation.length - 1 && <Separator />}
          </Card>
        ))}
      </div>
    </div>
  );
}