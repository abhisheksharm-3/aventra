import Link from "next/link";
import { Sparkles, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface SavedItineraryProps {
  id: string;
  name: string;
  destination: string;
  duration: number;
  image: string;
  aiGenerated: boolean;
}

export function SavedItinerary({
  id,
  name,
  destination,
  duration,
  image,
  aiGenerated,
}: SavedItineraryProps) {
  return (
    <Link href={`/dashboard/itineraries/${id}`}>
      <Card className="w-[250px] overflow-hidden hover:shadow-md transition-shadow">
        <div 
          className="h-32 bg-cover bg-center relative"
          style={{ backgroundImage: `url(${image})` }}
        >
          {aiGenerated && (
            <Badge className="absolute top-2 right-2 bg-primary/80 hover:bg-primary">
              <Sparkles className="h-3 w-3 mr-1" /> AI Generated
            </Badge>
          )}
        </div>
        <CardContent className="p-4">
          <h3 className="font-medium">{name}</h3>
          <p className="text-sm text-muted-foreground mb-2">{destination}</p>
          <div className="flex items-center text-xs">
            <Clock className="h-3 w-3 mr-1" />
            <span>{duration} {duration === 1 ? 'day' : 'days'}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}