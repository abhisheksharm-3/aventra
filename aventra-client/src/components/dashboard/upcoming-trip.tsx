import Link from "next/link";
import { format } from "date-fns";
import { Calendar, MapPin, CheckCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface UpcomingTripProps {
  name: string;
  location: string;
  image: string;
  startDate: string;
  endDate: string;
  completed: number;
}

export function UpcomingTrip({
  name,
  location,
  image,
  startDate,
  endDate,
  completed,
}: UpcomingTripProps) {
  const formattedStartDate = format(new Date(startDate), "MMM d");
  const formattedEndDate = format(new Date(endDate), "MMM d, yyyy");
  
  return (
    <Link href={`/dashboard/trips/${name.toLowerCase().replace(/\s+/g, '-')}`}>
      <Card className="overflow-hidden h-full hover:shadow-md transition-shadow">
        <div 
          className="h-32 bg-cover bg-center"
          style={{ backgroundImage: `url(${image})` }}
        />
        <CardContent className="p-4">
          <h3 className="font-medium text-lg">{name}</h3>
          <div className="flex items-center mt-1 text-sm text-muted-foreground">
            <MapPin className="h-3.5 w-3.5 mr-1" />
            {location}
          </div>
          <div className="flex items-center mt-3 text-sm">
            <Calendar className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
            <span>{formattedStartDate} - {formattedEndDate}</span>
          </div>
          <div className="mt-4 flex justify-between items-center">
            <div className="flex-1 mr-2">
              <div className="flex justify-between text-xs mb-1">
                <span>Planning progress</span>
                <span>{completed}%</span>
              </div>
              <Progress value={completed} className="h-1.5" />
            </div>
            {completed === 100 ? (
              <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                <CheckCircle className="h-3 w-3 mr-1" /> Ready
              </Badge>
            ) : (
              <Badge variant="outline">In progress</Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}