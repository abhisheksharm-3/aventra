import { Calendar, ChevronRight, MapPin, Plane } from "lucide-react";
import { Card, CardHeader, CardTitle } from "../ui/card";
import Link from "next/link";
import { Button } from "../ui/button";
import Image from "next/image";
import { TripData } from "@/types/dashboard";
import { cn } from "@/lib/utils";
import { useState } from "react";

/**
 * Upcoming Trips Card Component
 * 
 * Displays the user's upcoming trips with visual timeline and progress indicators.
 * Shows a placeholder with call-to-action when no trips are available.
 * 
 * @param {Object} props - Component props
 * @param {TripData[]} props.trips - Array of trip data objects to display
 * @returns React component displaying upcoming trips or empty state
 */
export function UpcomingTripsCard({ trips }: { trips: TripData[] }) {
  const hasTrips = trips.length > 0;
  const [activeIndex, setActiveIndex] = useState(0);
  
  const currentTrip = hasTrips ? trips[activeIndex] : null;
  // Default image to handle undefined case
  const tripImage = currentTrip?.image || "/placeholder-trip.jpg";
  
  return (
    <Card className="overflow-hidden border-border/40 shadow-sm py-0">
      <CardHeader className="bg-muted/30 p-4 flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-medium flex items-center gap-2">
          <Plane className="h-4 w-4 text-primary" aria-hidden="true" />
          Upcoming Journey
        </CardTitle>
        
        {hasTrips && (
          <Link href="/dashboard/trips" className="text-sm text-primary hover:text-primary/80 font-medium cursor-pointer">
            View all
          </Link>
        )}
      </CardHeader>
      
      {hasTrips ? (
        <div className="grid md:grid-cols-[1.3fr_1fr] overflow-hidden">
          {/* Left side - Trip image and destination */}
          <div className="relative aspect-[16/9] md:aspect-auto md:h-full">
            <Image
              src={tripImage}
              alt={`${currentTrip?.destination} travel destination`}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
              className="object-cover rounded-bl-xl rounded-tr-xl"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" aria-hidden="true"></div>
            
            {/* Destination overlay */}
            <div className="absolute inset-x-0 bottom-0 p-5 text-white">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="h-4 w-4 text-primary" />
                <h3 className="text-2xl font-medium">
                  {currentTrip?.destination}
                </h3>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-sm text-white/90 text-xs">
                  <span>{currentTrip?.startDate} - {currentTrip?.endDate}</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right side - Trip details and actions */}
          <div className="p-5 flex flex-col">
            {/* Countdown section */}
            <div className="mb-6">
              <div className="text-sm text-muted-foreground mb-1">Trip Countdown</div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold">{currentTrip?.daysRemaining || 0}</span>
                <span className="text-muted-foreground">days remaining</span>
              </div>
              
              {/* Trip timeline visualization */}
              <div className="mt-5 mb-3">
                <div className="flex justify-between text-xs text-muted-foreground mb-2">
                  <span>Trip Planning Progress</span>
                  <span>{currentTrip?.progress}%</span>
                </div>
                <div className="h-2 bg-muted/30 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary rounded-full"
                    style={{ width: `${currentTrip?.progress}%` }}
                  ></div>
                </div>
              </div>
            </div>
            
            {/* Action buttons */}
            <div className="mt-6 grid grid-cols-2 gap-3">
              <Link href={`/dashboard/trips/${currentTrip?.id}`} className="w-full">
                <Button variant="outline" className="w-full cursor-pointer">
                  View Details
                </Button>
              </Link>
              
              <Link href={`/plan?edit=${currentTrip?.id}`} className="w-full">
                <Button className="w-full cursor-pointer">
                  Edit Trip
                </Button>
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="py-12 px-6 flex flex-col items-center text-center">
          {/* Minimal empty state */}
          <div className="bg-muted/30 h-16 w-16 rounded-full flex items-center justify-center mb-6">
            <Calendar className="h-6 w-6 text-muted-foreground" aria-hidden="true" />
          </div>
          
          <h3 className="text-lg font-medium mb-2">No upcoming trips</h3>
          <p className="text-muted-foreground max-w-xs mx-auto mb-6">
            Start planning your next adventure with our tools
          </p>
          
          <Link href="/plan">
            <Button className="cursor-pointer">
              Create Trip
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </Link>
        </div>
      )}
      
      {/* Trip carousel indicators (only if multiple trips) */}
      {hasTrips && trips.length > 1 && (
        <div className="flex justify-center gap-1 py-3 border-t border-border/20">
          {trips.map((_, idx) => (
            <button 
              key={idx} 
              className={cn(
                "w-2 h-2 rounded-full transition-all cursor-pointer",
                activeIndex === idx ? "bg-primary" : "bg-muted-foreground/30"
              )}
              onClick={() => setActiveIndex(idx)}
              aria-label={`View trip ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </Card>
  );
}