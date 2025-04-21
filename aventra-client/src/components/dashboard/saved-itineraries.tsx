"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Clock, Sparkles, ChevronRight, ChevronLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { SavedItineraryCardProps } from "@/types/dashboard";

const mockSavedItineraries = [
  {
    id: 1,
    name: "Weekend in Rome",
    destination: "Rome, Italy",
    duration: "3 days",
    image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&auto=format&fit=crop",
    aiGenerated: true
  },
  {
    id: 2,
    name: "Romantic Paris Evening",
    destination: "Paris, France",
    duration: "1 night",
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&auto=format&fit=crop",
    aiGenerated: false
  },
  {
    id: 3,
    name: "Family Fun in Disney",
    destination: "Orlando, FL",
    duration: "5 days",
    image: "https://images.unsplash.com/photo-1605490573792-f29b0583106a?w=800&auto=format&fit=crop",
    aiGenerated: true
  },
  {
    id: 4,
    name: "NYC Fine Dining Tour",
    destination: "New York, NY",
    duration: "2 days",
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop",
    aiGenerated: false
  },
  {
    id: 5,
    name: "Tokyo Adventure",
    destination: "Tokyo, Japan",
    duration: "7 days",
    image: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=800&auto=format&fit=crop",
    aiGenerated: true
  }
];

function SavedItineraryCard({ itinerary }: SavedItineraryCardProps) {
  return (
    <div className="w-[280px] flex-shrink-0">
      <Card className="overflow-hidden h-full group transition-all duration-300 hover:shadow-lg">
        <div className="relative h-40 overflow-hidden">
          <Image
            src={itinerary.image}
            alt={itinerary.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-70" />
          {itinerary.aiGenerated && (
            <Badge className="absolute top-3 right-3 font-medium bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600">
              <Sparkles className="h-3 w-3 mr-1" /> AI Generated
            </Badge>
          )}
        </div>
        <CardContent className="p-5">
          <h3 className="font-bold">{itinerary.name}</h3>
          <div className="flex items-center mt-2 text-sm text-muted-foreground">
            <MapPin className="h-3.5 w-3.5 mr-1" />
            <span>{itinerary.destination}</span>
          </div>
          <div className="flex items-center mt-1 text-sm text-muted-foreground">
            <Clock className="h-3.5 w-3.5 mr-1" />
            <span>{itinerary.duration}</span>
          </div>
          <Button variant="default" size="sm" className="w-full mt-4">
            View Details
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default function SavedItineraries() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  return (
    <div className="mb-10">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Saved Itineraries</h2>
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex gap-2">
            <Button variant="outline" size="icon" onClick={scrollLeft} className="rounded-full">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={scrollRight} className="rounded-full">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard/itineraries">
              View all <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
      
      <div className="relative">
        <ScrollArea className="pb-4">
          <div 
            ref={scrollContainerRef}
            className="flex space-x-4 pb-4 px-1"
          >
            {mockSavedItineraries.map((itinerary) => (
              <SavedItineraryCard key={itinerary.id} itinerary={itinerary} />
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </div>
  );
}