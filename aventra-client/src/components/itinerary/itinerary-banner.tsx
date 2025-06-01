import React from "react";
import Image from "next/image";
import { format, parseISO } from "date-fns";
import { Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ItineraryBannerProps {
  tripName: string;
  coverImage: string;
  durationDays: number;
  startDate: string;
  endDate: string;
}

const ItineraryBanner: React.FC<ItineraryBannerProps> = ({
  tripName,
  coverImage,
  durationDays,
  startDate,
  endDate
}) => {
  return (
    <div className="relative h-72 md:h-80 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/70 z-10"></div>
      <Image
        src={coverImage}
        alt={tripName}
        fill
        className="object-cover"
        priority
      />
      
      {/* Trip Header Overlay */}
      <div className="absolute inset-0 z-20 flex flex-col justify-end p-6 md:p-8">
        <div className="max-w-7xl mx-auto w-full">
          <Badge className="bg-primary/90 text-primary-foreground mb-3 font-medium">
            {durationDays}-Day Adventure
          </Badge>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                {tripName}
              </h1>
              <div className="flex flex-wrap gap-3 md:items-center text-white/90">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1 inline" />
                  <span>
                    {format(parseISO(startDate), "MMM d")} - {format(parseISO(endDate), "MMM d, yyyy")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItineraryBanner;