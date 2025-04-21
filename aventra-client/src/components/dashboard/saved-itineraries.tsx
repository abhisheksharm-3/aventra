"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Clock, Sparkles, ChevronRight, ChevronLeft, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface SavedItineraryProps {
  id: number;
  name: string;
  destination: string;
  duration: string;
  image: string;
  aiGenerated: boolean;
  rating?: number;
}

const mockSavedItineraries: SavedItineraryProps[] = [
  {
    id: 1,
    name: "Weekend in Rome",
    destination: "Rome, Italy",
    duration: "3 days",
    image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&auto=format&fit=crop",
    aiGenerated: true,
    rating: 4.8
  },
  {
    id: 2,
    name: "Romantic Paris Evening",
    destination: "Paris, France",
    duration: "1 night",
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&auto=format&fit=crop",
    aiGenerated: false,
    rating: 4.6
  },
  {
    id: 3,
    name: "Family Fun in Disney",
    destination: "Orlando, FL",
    duration: "5 days",
    image: "https://images.unsplash.com/photo-1605490573792-f29b0583106a?w=800&auto=format&fit=crop",
    aiGenerated: true,
    rating: 4.9
  },
  {
    id: 4,
    name: "NYC Fine Dining Tour",
    destination: "New York, NY",
    duration: "2 days",
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop",
    aiGenerated: false,
    rating: 4.7
  },
  {
    id: 5,
    name: "Tokyo Adventure",
    destination: "Tokyo, Japan",
    duration: "7 days",
    image: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=800&auto=format&fit=crop",
    aiGenerated: true,
    rating: 4.9
  }
];

function SavedItineraryCard({ itinerary, index }: { itinerary: SavedItineraryProps; index: number }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="w-[280px] flex-shrink-0"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Card className="overflow-hidden h-full transition-all duration-300 hover:shadow-md border-border/40">
        <div className="relative h-40 overflow-hidden">
          <Image
            src={itinerary.image}
            alt={itinerary.name}
            fill
            className={cn(
              "object-cover transition-transform duration-700",
              isHovered ? "scale-110" : "scale-100"
            )}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
          
          {/* AI Badge */}
          {itinerary.aiGenerated && (
            <div className="absolute top-3 left-3">
              <Badge className="font-medium bg-background/80 backdrop-blur-sm border-primary/20 text-primary">
                <Sparkles className="h-3 w-3 mr-1" /> AI Generated
              </Badge>
            </div>
          )}
          
          {/* Rating Badge */}
          {itinerary.rating && (
            <div className="absolute top-3 right-3">
              <Badge 
                className="font-medium bg-background/80 backdrop-blur-sm border-0 text-foreground flex items-center gap-1"
              >
                <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                <span>{itinerary.rating}</span>
              </Badge>
            </div>
          )}
          
          {/* Title overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-3">
            <h3 className="font-bold text-base text-white drop-shadow-sm line-clamp-1">
              {itinerary.name}
            </h3>
          </div>
        </div>
        
        <CardContent className="p-4">
          <div className="flex items-center justify-between space-x-2 mb-3">
            <div className="flex items-center text-sm text-muted-foreground truncate">
              <MapPin className="h-3.5 w-3.5 mr-1.5 flex-shrink-0" />
              <span className="truncate">{itinerary.destination}</span>
            </div>
            <div className="flex items-center text-sm text-muted-foreground whitespace-nowrap">
              <Clock className="h-3.5 w-3.5 mr-1.5 flex-shrink-0" />
              <span>{itinerary.duration}</span>
            </div>
          </div>
          
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full bg-primary/5 hover:bg-primary/10 border-primary/20 hover:border-primary/40 text-primary"
          >
            View Itinerary
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function SavedItineraries() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Check scroll position to update button states
  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);
    }
  };

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
    <motion.div 
      className="mb-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold tracking-tight">Saved Itineraries</h2>
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex gap-2">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={scrollLeft} 
              disabled={!canScrollLeft}
              className={cn(
                "rounded-full h-8 w-8 border-border/40",
                !canScrollLeft && "opacity-50 cursor-not-allowed"
              )}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={scrollRight} 
              disabled={!canScrollRight}
              className={cn(
                "rounded-full h-8 w-8 border-border/40",
                !canScrollRight && "opacity-50 cursor-not-allowed"
              )}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <Button variant="ghost" size="sm" asChild className="text-primary hover:text-primary/80">
            <Link href="/dashboard/itineraries">
              View all <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
      
      <ScrollArea className="pb-4" onScroll={handleScroll}>
        <div 
          ref={scrollContainerRef}
          className="flex space-x-4 pb-4 px-1"
        >
          <AnimatePresence>
            {mockSavedItineraries.map((itinerary, index) => (
              <SavedItineraryCard 
                key={itinerary.id} 
                itinerary={itinerary} 
                index={index} 
              />
            ))}
          </AnimatePresence>
          
          {/* Add new itinerary card */}
          <motion.div
            className="w-[280px] flex-shrink-0"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: mockSavedItineraries.length * 0.05 }}
          >
            <Card className="h-full border-dashed border-2 border-border/40 flex flex-col items-center justify-center text-center p-6 hover:border-primary/40 transition-all hover:bg-primary/5 group">
              <div className="h-12 w-12 rounded-full bg-background border border-border/40 flex items-center justify-center mb-3 group-hover:border-primary/20 transition-colors">
                <Sparkles className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
              <p className="font-medium text-foreground mb-1 group-hover:text-primary transition-colors">Generate New Itinerary</p>
              <p className="text-sm text-muted-foreground mb-4">Let AI plan your next adventure</p>
              <Button 
                variant="outline"
                size="sm"
                className="bg-background hover:bg-primary/10 border-primary/20 hover:border-primary/40 text-primary"
              >
                Generate
              </Button>
            </Card>
          </motion.div>
        </div>
        <ScrollBar orientation="horizontal" className="h-2" />
      </ScrollArea>
    </motion.div>
  );
}