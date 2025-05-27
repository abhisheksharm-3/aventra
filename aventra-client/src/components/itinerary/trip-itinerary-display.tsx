"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Calendar,
  Clock,
  DollarSign,
  Compass,
  AlertTriangle,
  Phone,
  FileText,
  Star,
  ExternalLink,
  Download,
  Share2,
  Map,
  Sun,
  Cloud,
  Umbrella,
  Camera,
  Heart,
  PencilLine,
  Printer,
  Copy,
  CalendarClock,
  User,
  Check,
} from "lucide-react";
import Image from "next/image";
import { format, parseISO } from "date-fns";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { GeneratedItineraryResponse } from "@/types/itinerary";
import JourneyMap from "./journey-map";

// Define types based on the schema
interface TripItineraryProps {
  tripData: GeneratedItineraryResponse;
  currentDateTime: string;
  currentUser: string;
}

// Weather icons mapping
const weatherIcons: Record<string, React.ReactNode> = {
  "Sunny": <Sun className="h-4 w-4 text-amber-500" />,
  "Partly cloudy": <Cloud className="h-4 w-4 text-blue-400" />,
  "Cloudy": <Cloud className="h-4 w-4 text-gray-400" />,
  "Rain": <Umbrella className="h-4 w-4 text-blue-500" />,
  "Sunny with occasional clouds": <Sun className="h-4 w-4 text-amber-500" />,
};

// Default image for fallbacks
const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1532339142463-fd0a8979791a";
const DEFAULT_HOTEL_IMAGE = "https://images.unsplash.com/photo-1445019980597-93fa8acb246c";

export default function TripItineraryDisplay({ tripData, currentDateTime, currentUser }: TripItineraryProps) {
  const [activeDay, setActiveDay] = useState(1);
  const [showHotelInfo, setShowHotelInfo] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  // Format date helper
  const formatDateFull = (dateString: string) => {
    try {
      const date = parseISO(dateString);
      return format(date, "EEEE, MMMM d, yyyy");
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return dateString;
    }
  };

  // Format time helper
  const formatTime = (timeString: string) => {
    if (!timeString) return "";
    const [hours, minutes] = timeString.split(":");
    return `${hours}:${minutes}`;
  };

  // Calculate budget spent vs remaining
  const calculateBudgetProgress = () => {
    return 40; // This would normally be calculated from actual spending data
  };

  // Get weather icon
  const getWeatherIcon = (condition: string) => {
    return weatherIcons[condition] || <Cloud className="h-4 w-4" />;
  };

  // Handle copy trip ID
  const handleCopyTripId = () => {
    const tripId = "TRIP-" + Math.random().toString(36).substring(2, 8).toUpperCase();
    navigator.clipboard.writeText(tripId);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // Get first available image for cover
  const getCoverImage = () => {
    for (const day of tripData.itinerary) {
      for (const block of day.time_blocks) {
        if (block.activity?.images?.[0]) {
          return block.activity.images[0];
        }
      }
    }
    return DEFAULT_IMAGE;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Banner Section with improved contrast and accessibility */}
      <div className="relative h-72 md:h-80 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/70 z-10"></div>
        <Image
          src={getCoverImage()}
          alt="Trip destination cover image"
          fill
          className="object-cover"
          priority
        />
        
        {/* Trip Header Overlay */}
        <div className="absolute inset-0 z-20 flex flex-col justify-end p-6 md:p-8">
          <div className="max-w-7xl mx-auto w-full">
            <Badge className="bg-primary/90 text-primary-foreground mb-3 font-medium">
              {tripData.metadata.duration_days}-Day Trip
            </Badge>
            
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                  {tripData.name}
                </h1>
                <div className="flex flex-wrap gap-3 md:items-center text-white/90">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1 inline" />
                    <span>
                      {tripData.itinerary[0] && format(parseISO(tripData.itinerary[0].date), "MMM d")} - 
                      {tripData.itinerary[tripData.itinerary.length - 1] && 
                        format(parseISO(tripData.itinerary[tripData.itinerary.length - 1].date), "MMM d, yyyy")}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button size="sm" variant="secondary" className="gap-1 text-xs md:text-sm h-9">
                  <Download className="h-3.5 w-3.5" />
                  <span>Download</span>
                </Button>
                
                <Button 
                  size="sm" 
                  className="gap-1 text-xs md:text-sm h-9"
                >
                  <Share2 className="h-3.5 w-3.5" />
                  <span>Share Trip</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Itinerary */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="itinerary" className="w-full">
              <TabsList className="mb-4 bg-muted/70">
                <TabsTrigger value="itinerary" className="gap-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Itinerary</span>
                </TabsTrigger>
                <TabsTrigger value="map" className="gap-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <Map className="h-4 w-4" />
                  <span>Journey Map</span>
                </TabsTrigger>
                <TabsTrigger value="info" className="gap-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <FileText className="h-4 w-4" />
                  <span>Essential Info</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="itinerary" className="focus-visible:outline-none focus-visible:ring-0">
                {/* Day Pills with improved scrolling */}
                <ScrollArea className="w-full pb-4">
                  <div className="flex gap-2 p-1">
                    {tripData.itinerary.map((day) => {
                      const date = parseISO(day.date);
                      const formattedDate = format(date, "MMM d");
                      const isActive = day.day_number === activeDay;
                      
                      return (
                        <button
                          key={day.day_number}
                          onClick={() => setActiveDay(day.day_number)}
                          className={`inline-flex flex-col items-center px-4 py-2 rounded-full transition-all ${
                            isActive
                              ? "bg-primary text-primary-foreground shadow-md"
                              : "bg-muted hover:bg-muted/80"
                          }`}
                        >
                          <span className={`text-xs ${isActive ? "font-medium" : ""}`}>Day {day.day_number}</span>
                          <span className="text-xs">{formattedDate}</span>
                        </button>
                      );
                    })}
                  </div>
                </ScrollArea>

                {/* Active Day Itinerary */}
                {tripData.itinerary.map((day) => {
                  if (day.day_number === activeDay) {
                    return (
                      <motion.div
                        key={day.day_number}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mt-4"
                      >
                        {/* Day Header with Date and Weather */}
                        <Card className="mb-6 overflow-hidden border-primary/10 shadow-sm">
                          <div className="bg-muted/30 p-4 flex justify-between items-center border-b">
                            <div>
                              <h3 className="text-lg font-medium">
                                Day {day.day_number}: {formatDateFull(day.date)}
                              </h3>
                              <p className="text-muted-foreground text-sm">
                                {day.time_blocks.length} planned activities
                              </p>
                            </div>
                            {day.weather && (
                              <div className="flex items-center gap-3 bg-background/80 px-3 py-2 rounded-md border">
                                <div className="flex items-center">
                                  {getWeatherIcon(day.weather.conditions)}
                                  <span className="text-sm ml-1.5">{day.weather.conditions}</span>
                                </div>
                                <div className="text-sm">
                                  <span className="text-blue-500">{day.weather.temperature?.min}°</span>
                                  <span className="mx-1">-</span>
                                  <span className="text-red-500">{day.weather.temperature?.max}°C</span>
                                </div>
                              </div>
                            )}
                          </div>
                          
                          {/* Timeline View with improved visual hierarchy */}
                          <div className="p-4">
                            <div className="relative">
                              {day.time_blocks.map((block, idx) => {
                                const isActivity = !!block.activity;
                                const isLastItem = idx === day.time_blocks.length - 1;
                                
                                return (
                                  <div key={idx} className="relative pb-8">
                                    {!isLastItem && (
                                      <span 
                                        className="absolute top-5 left-5 -ml-px h-full w-0.5 bg-border" 
                                        aria-hidden="true"
                                      />
                                    )}
                                    
                                    <div className="relative flex items-start space-x-4">
                                      {/* Timeline Dot with improved contrast */}
                                      <div className={`relative px-1`}>
                                        <div className={`h-10 w-10 rounded-full flex items-center justify-center border-2 ${
                                            block.type === "fixed" 
                                              ? "border-primary bg-primary/10" 
                                              : "border-muted-foreground/30 bg-muted/60"
                                          }`}
                                        >
                                          {isActivity ? (
                                            <Camera className="h-5 w-5 text-primary" />
                                          ) : (
                                            <Clock className="h-5 w-5 text-muted-foreground" />
                                          )}
                                        </div>
                                      </div>
                                      
                                      {/* Timeline Content with improved visual hierarchy */}
                                      <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1.5">
                                          <span className="bg-muted/60 text-xs px-2 py-0.5 rounded font-medium">
                                            {formatTime(block.start_time)} - {formatTime(block.end_time)}
                                          </span>
                                          <span className="text-xs text-muted-foreground">
                                            ({Math.round((block.duration_minutes || 60) / 60)} hrs)
                                          </span>
                                          {block.type === "flexible" && (
                                            <Badge variant="outline" className="text-[10px] bg-blue-50 text-blue-600 border-blue-200">
                                              Flexible
                                            </Badge>
                                          )}
                                        </div>
                                        
                                        {/* Activity or Travel Card with improved visuals */}
                                        <Card 
                                          className={`overflow-hidden shadow-sm hover:shadow-md transition-shadow
                                            ${isActivity ? "border-l-2 border-l-primary" : ""}`}
                                        >
                                          {isActivity && block.activity?.images && block.activity.images.length > 0 && (
                                            <div className="relative h-48 w-full">
                                              <Image
                                                src={block.activity.images[0]}
                                                alt={block.activity.title || "Activity image"}
                                                fill
                                                className="object-cover"
                                              />
                                              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                                                {block.activity.type && (
                                                  <Badge className="mb-2 capitalize">
                                                    {block.activity.type}
                                                  </Badge>
                                                )}
                                              </div>
                                            </div>
                                          )}
                                          
                                          <CardContent className={`p-4 ${!isActivity ? "bg-muted/30" : ""}`}>
                                            <div className="flex justify-between items-start mb-2">
                                              <h4 className="text-base font-medium">
                                                {isActivity ? block.activity?.title : block.travel?.mode === "flight" ? "Flight" : `${block.travel?.mode} Journey`}
                                              </h4>
                                              {isActivity && block.activity?.priority && (
                                                <div className="flex items-center">
                                                  {Array.from({ length: block.activity.priority }).map((_, i) => (
                                                    <Star key={i} className="h-3 w-3 text-amber-400 fill-amber-400" />
                                                  ))}
                                                </div>
                                              )}
                                            </div>
                                            
                                            <p className="text-sm text-muted-foreground mb-3">
                                              {isActivity 
                                                ? block.activity?.description 
                                                : block.travel?.details}
                                            </p>
                                            
                                            <div className="flex flex-wrap gap-2 items-center mt-3">
                                              {/* Location */}
                                              {isActivity && block.activity?.location && (
                                                <div className="flex items-center text-xs gap-1 bg-muted/60 px-2 py-1 rounded-md">
                                                  <MapPin className="h-3 w-3" />
                                                  <span>{block.activity.location.name}</span>
                                                </div>
                                              )}
                                              
                                              {/* Cost */}
                                              {isActivity && block.activity?.cost && (
                                                <div className="flex items-center text-xs gap-1 bg-muted/60 px-2 py-1 rounded-md">
                                                  <DollarSign className="h-3 w-3" />
                                                  <span>
                                                    {block.activity.cost.range} {block.activity.cost.currency}
                                                  </span>
                                                </div>
                                              )}
                                              
                                              {/* Travel link */}
                                              {!isActivity && block.travel?.link && (
                                                <a 
                                                  href={block.travel.link} 
                                                  target="_blank" 
                                                  rel="noopener noreferrer"
                                                  className="flex items-center text-xs gap-1 text-primary hover:underline"
                                                >
                                                  <ExternalLink className="h-3 w-3" />
                                                  <span>Booking details</span>
                                                </a>
                                              )}
                                            </div>
                                            
                                            {/* Warnings with improved visibility */}
                                            {block.warnings && block.warnings.length > 0 && (
                                              <div className="mt-3 p-2.5 bg-amber-50 border border-amber-200 rounded-md">
                                                <div className="flex items-center gap-2">
                                                  <AlertTriangle className="h-4 w-4 text-amber-500" />
                                                  <span className="text-sm text-amber-800">
                                                    {block.warnings[0].message}
                                                  </span>
                                                </div>
                                              </div>
                                            )}
                                          </CardContent>
                                          
                                          {/* Activity Actions */}
                                          {isActivity && (
                                            <CardFooter className="px-4 py-3 bg-muted/30 flex justify-between border-t">
                                              <div className="flex items-center text-xs text-muted-foreground">
                                                <Clock className="h-3.5 w-3.5 mr-1" />
                                                <span>{block.duration_minutes} minutes</span>
                                              </div>
                                              
                                              <div className="flex gap-2">
                                                {block.activity?.location?.google_maps_link && (
                                                  <a 
                                                    href={block.activity.location.google_maps_link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-xs text-primary hover:underline flex items-center gap-1"
                                                  >
                                                    <MapPin className="h-3.5 w-3.5" />
                                                    <span>View on Maps</span>
                                                  </a>
                                                )}
                                                <button 
                                                  className="text-xs text-primary hover:underline flex items-center gap-1"
                                                >
                                                  <Heart className="h-3.5 w-3.5" />
                                                  <span>Save</span>
                                                </button>
                                              </div>
                                            </CardFooter>
                                          )}
                                        </Card>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </Card>
                      </motion.div>
                    );
                  }
                  return null;
                })}
              </TabsContent>
              
              <TabsContent value="map" className="focus-visible:outline-none focus-visible:ring-0">
  {tripData.journey_path && (
    <JourneyMap journeyPath={tripData.journey_path} />
  )}
</TabsContent>
              
              <TabsContent value="info" className="focus-visible:outline-none focus-visible:ring-0">
                <Card className="border-primary/10 shadow-sm">
                  <div className="p-4 border-b">
                    <h3 className="text-lg font-medium">Essential Information</h3>
                    <p className="text-sm text-muted-foreground">
                      Important details for your journey
                    </p>
                  </div>
                  
                  <div className="p-4">
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="documents">
                        <AccordionTrigger className="hover:no-underline">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-primary" />
                            <span>Required Documents</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <ul className="space-y-2 text-sm">
                            {tripData.essential_info?.documents?.map((doc, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                                  <span className="text-[10px] font-medium text-primary">
                                    {idx + 1}
                                  </span>
                                </div>
                                <span>{doc}</span>
                              </li>
                            ))}
                          </ul>
                        </AccordionContent>
                      </AccordionItem>
                      
                      <AccordionItem value="emergency">
                        <AccordionTrigger className="hover:no-underline">
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-primary" />
                            <span>Emergency Contacts</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-3">
                            {tripData.essential_info?.emergency_contacts?.map((contact, idx) => (
                              <div key={idx} className="flex justify-between items-center">
                                <span className="text-sm">{contact.type}</span>
                                <Badge variant="outline" className="font-mono">
                                  {contact.number}
                                </Badge>
                              </div>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Column: Trip Summary & Recommendations */}
          <div className="space-y-6">
            {/* Trip Summary Card */}
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
                    {tripData.metadata.trip_type}
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
                  <span className="text-sm font-medium">{tripData.metadata.duration_days} days</span>
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
                    {tripData.metadata.total_budget?.total} {tripData.metadata.total_budget?.currency}
                  </span>
                </div>
                
                {/* Budget Progress */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Budget Progress</span>
                    <span>{calculateBudgetProgress()}%</span>
                  </div>
                  <Progress value={calculateBudgetProgress()} className="h-2" />
                </div>
                
                <Separator />
                
                {/* Budget Breakdown */}
                {tripData.metadata.total_budget?.breakdown && (
                  <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="bg-muted/30 p-2 rounded-md">
                        <div className="text-xs text-muted-foreground">Accommodation</div>
                        <div className="font-medium">
                          {tripData.metadata.total_budget.breakdown.accommodation} {tripData.metadata.total_budget.currency}
                        </div>
                      </div>
                      
                      <div className="bg-muted/30 p-2 rounded-md">
                        <div className="text-xs text-muted-foreground">Transportation</div>
                        <div className="font-medium">
                          {tripData.metadata.total_budget.breakdown.transportation} {tripData.metadata.total_budget.currency}
                        </div>
                      </div>
                      
                      <div className="bg-muted/30 p-2 rounded-md">
                        <div className="text-xs text-muted-foreground">Activities</div>
                        <div className="font-medium">
                          {tripData.metadata.total_budget.breakdown.activities} {tripData.metadata.total_budget.currency}
                        </div>
                      </div>
                      
                      <div className="bg-muted/30 p-2 rounded-md">
                        <div className="text-xs text-muted-foreground">Food</div>
                        <div className="font-medium">
                          {tripData.metadata.total_budget.breakdown.food} {tripData.metadata.total_budget.currency}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                <Separator />
                
                {/* Preferences */}
                {tripData.metadata.preferences && (
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-1">
                      {tripData.metadata.preferences.pace && (
                        <Badge variant="outline" className="bg-muted/30">
                          {tripData.metadata.preferences.pace} pace
                        </Badge>
                      )}
                      
                      {tripData.metadata.preferences.dietary_restrictions?.map((diet, idx) => (
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

            {/* Accommodations Section with fixed image handling */}
            {tripData.recommendations?.accommodations && (
              <Card className="border-primary/10 shadow-sm">
                <div className="p-4 border-b bg-muted/30">
                  <h3 className="text-lg font-medium">Recommended Accommodations</h3>
                </div>
                
                <div className="p-4">
                  <div className="space-y-4">
                    {tripData.recommendations.accommodations.map((hotel, idx) => (
                      <div key={idx} className="group cursor-pointer" onClick={() => setShowHotelInfo(!showHotelInfo)}>
                        <div className="relative h-40 w-full rounded-md overflow-hidden">
                          <Image
                            src={hotel.images && hotel.images.length > 0 ? hotel.images[0] : DEFAULT_HOTEL_IMAGE}
                            alt={hotel.name || "Hotel"}
                            fill
                            className="object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                          <div className="absolute bottom-0 p-3 w-full">
                            <div className="flex justify-between items-end w-full">
                              <div>
                                <Badge className="mb-1 bg-primary/90 text-primary-foreground">
                                  {hotel.type || "Hotel"}
                                </Badge>
                                <h4 className="text-white font-medium">{hotel.name}</h4>
                                {hotel.location && (
                                  <div className="flex items-center gap-1">
                                    <MapPin className="h-3 w-3 text-white/70" />
                                    <span className="text-xs text-white/90">{hotel.location.name}</span>
                                  </div>
                                )}
                              </div>
                              <div className="flex items-center bg-white/20 backdrop-blur-sm rounded px-2 py-1">
                                <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
                                <span className="text-xs text-white ml-1">{hotel.rating}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <AnimatePresence>
                          {showHotelInfo && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden"
                            >
                              <div className="pt-3 pb-1">
                                <div className="flex justify-between items-center mb-2">
                                  <div className="flex gap-1">
                                    {hotel.price_range && Array.from({ length: hotel.price_range.length }).map((_, i) => (
                                      <DollarSign key={i} className="h-3.5 w-3.5 text-muted-foreground" />
                                    ))}
                                  </div>
                                  {hotel.link && (
                                    <a 
                                      href={hotel.link} 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      className="text-xs text-primary hover:underline flex items-center gap-1"
                                    >
                                      <ExternalLink className="h-3 w-3" />
                                      <span>View Details</span>
                                    </a>
                                  )}
                                </div>
                                
                                {hotel.amenities && hotel.amenities.length > 0 && (
                                  <div className="flex flex-wrap gap-1 mb-2">
                                    {hotel.amenities.slice(0, 4).map((amenity, i) => (
                                      <Badge key={i} variant="outline" className="text-[10px] bg-muted/30">
                                        {amenity}
                                      </Badge>
                                    ))}
                                    {hotel.amenities.length > 4 && (
                                      <Badge variant="outline" className="text-[10px] bg-muted/30">
                                        +{hotel.amenities.length - 4} more
                                      </Badge>
                                    )}
                                  </div>
                                )}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            )}

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" className="gap-1.5">
                <PencilLine className="h-3.5 w-3.5" />
                <span>Edit Trip</span>
              </Button>
              
              <Button variant="outline" size="sm" className="gap-1.5">
                <Printer className="h-3.5 w-3.5" />
                <span>Print</span>
              </Button>
              
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-1.5"
                onClick={handleCopyTripId}
              >
                {isCopied ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-green-500" />
                    <span className="text-green-500">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    <span>Copy Trip ID</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}