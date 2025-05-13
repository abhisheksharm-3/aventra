import { Calendar, CalendarDays, ChevronRight, Clock } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import Link from "next/link";
import { Button } from "../ui/button";
import Image from "next/image";
import { Badge } from "../ui/badge";
import { TripData } from "@/types/dashboard";

/**
 * Upcoming Trips Card Component
 * 
 * Displays the user's upcoming trips with visual timeline, progress indicators,
 * and action buttons for viewing or editing trip details. Shows a placeholder
 * with call-to-action when no trips are available.
 * 
 * @param {Object} props - Component props
 * @param {TripData[]} props.trips - Array of trip data objects to display
 * @returns React component displaying upcoming trips or empty state
 */
export function UpcomingTripsCard({ trips }: { trips: TripData[] }) {
  return (
    <Card className="overflow-hidden border-border/40 shadow-sm">
      <CardHeader className="bg-muted/30 p-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            <Clock className="h-4 w-4 text-primary" aria-hidden="true" />
            Your Upcoming Journey
          </CardTitle>
          
          <Link href="/dashboard/trips">
            <Button variant="ghost" size="sm" className="gap-1 text-xs h-8">
              <span>View All</span>
              <ChevronRight className="h-3 w-3" aria-hidden="true" />
            </Button>
          </Link>
        </div>
      </CardHeader>
      
      {trips.length > 0 ? (
        <div>
          <div className="relative h-52 md:h-64 w-full">
            <Image
              src={trips[0].image}
              alt={`${trips[0].destination} travel destination`}
              fill
              sizes="(max-width: 768px) 100vw, 66vw"
              priority
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10" aria-hidden="true"></div>
            
            {/* Trip timeline - visual enhancement */}
            <div 
              className="absolute left-4 right-4 bottom-16 h-1 bg-white/30 rounded-full overflow-hidden"
              role="progressbar"
              aria-valuenow={30}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Trip timeline progress"
            >
              <div className="h-full bg-white/80 rounded-full" style={{ width: "30%" }}></div>
              <div className="absolute left-[30%] top-1/2 -translate-y-1/2 h-3 w-3 rounded-full bg-white shadow-glow"></div>
            </div>
            
            <div className="absolute inset-x-0 bottom-0 p-4 text-white">
              <div className="flex items-center gap-1.5 text-white/90 text-sm mb-1">
                <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
                <span>{trips[0].startDate} - {trips[0].endDate}</span>
              </div>
              <h3 className="text-2xl md:text-3xl font-medium">{trips[0].destination}</h3>
            </div>
          </div>
          
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-primary border-primary/30 bg-primary/5">
                  {trips[0].daysRemaining} days remaining
                </Badge>
              </div>
              <span className="text-sm text-muted-foreground">Trip planning progress</span>
            </div>
            
            <div 
              className="h-1.5 bg-muted/50 rounded-full overflow-hidden"
              role="progressbar"
              aria-valuenow={trips[0].progress || 0}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Trip planning progress"
            >
              <div 
                className="h-full bg-primary rounded-full"
                style={{ width: `${trips[0].progress}%` }}
              ></div>
            </div>
          </CardContent>
          
          <CardFooter className="p-4 pt-0 flex justify-between">
            <Link href={`/dashboard/trips/${trips[0].id}`}>
              <Button variant="ghost" size="sm" className="text-primary hover:text-primary/90 gap-1">
                <span>View Itinerary</span>
                <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Button>
            </Link>
            
            <Link href={`/plan?edit=${trips[0].id}`}>
              <Button variant="outline" size="sm">Edit Trip</Button>
            </Link>
          </CardFooter>
        </div>
      ) : (
        <CardContent className="p-8 text-center">
          <div className="h-12 w-12 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="h-6 w-6 text-muted-foreground" aria-hidden="true" />
          </div>
          <CardTitle className="text-lg mb-2">No upcoming trips</CardTitle>
          <CardDescription className="mb-4">
            Start planning your next adventure with our AI-powered tools
          </CardDescription>
          <Link href="/plan">
            <Button>Create Your First Trip</Button>
          </Link>
        </CardContent>
      )}
    </Card>
  );
}