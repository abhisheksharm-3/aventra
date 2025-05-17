/* eslint-disable @typescript-eslint/no-explicit-any */
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
  Globe,
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
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { ApiResponse } from "@/types/itinerary";

// Define types based on the schema
interface TripItineraryProps {
  tripData: ApiResponse;
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

export default function TripItineraryDisplay({ tripData, currentDateTime, currentUser }: TripItineraryProps) {
  const [activeDay, setActiveDay] = useState(1);
  const [showHotelInfo, setShowHotelInfo] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  // Format date helper
  const formatDateFull = (dateString: string) => {
    const date = parseISO(dateString);
    return format(date, "EEEE, MMMM d, yyyy");
  };

  // Format time helper
  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(":");
    return `${hours}:${minutes}`;
  };

  // Calculate budget spent vs remaining
  const calculateBudgetProgress = () => {
    // This would normally be calculated from actual spending
    // Here we assume we've spent 40% of the budget
    return 40;
  };

  // Get weather icon
  const getWeatherIcon = (condition: string) => {
    return weatherIcons[condition] || <Cloud className="h-4 w-4" />;
  };

  // Handle copy trip ID
  const handleCopyTripId = () => {
    // In a real app, this would copy the actual trip ID
    const tripId = "TRIP-" + Math.random().toString(36).substring(2, 8).toUpperCase();
    navigator.clipboard.writeText(tripId);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // Get destination name
  const getDestinationName = () => {
    // Find the first activity with a location
    for (const day of tripData.itinerary) {
      for (const block of day.time_blocks) {
        if (block.activity?.location?.name) {
          return block.activity.location.name.split(",")[0];
        }
      }
    }
    return "Your Destination";
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Banner Section */}
      <div className="relative h-64 md:h-80 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/60 z-10"></div>
        {tripData.itinerary[0]?.time_blocks[0]?.activity?.images?.[0] && (
          <Image
            src={tripData.itinerary[0].time_blocks[0].activity.images[0]}
            alt="Trip destination cover image"
            fill
            className="object-cover"
          />
        )}
        
        {/* Trip Header Overlay */}
        <div className="absolute inset-0 z-20 flex flex-col justify-end p-6 md:p-8">
          <div className="max-w-7xl mx-auto w-full">
            <Badge className="bg-primary/20 text-primary mb-3">{tripData.metadata.duration_days}-Day Trip</Badge>
            
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                  {getDestinationName()} Adventure
                </h1>
                <div className="flex flex-col md:flex-row gap-2 md:items-center">
                  <div className="flex items-center text-white/90">
                    <MapPin className="h-4 w-4 mr-1 inline" />
                    <span>
                      {tripData.itinerary[0].time_blocks[0].activity?.location?.name || "Tokyo, Japan"}
                    </span>
                  </div>
                  <span className="hidden md:block text-white/50">•</span>
                  <div className="flex items-center text-white/90">
                    <Calendar className="h-4 w-4 mr-1 inline" />
                    <span>
                      {format(parseISO(tripData.itinerary[0].date), "MMM d")} - 
                      {format(parseISO(tripData.itinerary[tripData.itinerary.length - 1].date), "MMM d, yyyy")}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button size="sm" variant="secondary" className="gap-1 text-xs md:text-sm h-9">
                        <Download className="h-3.5 w-3.5" />
                        <span>Download</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs">Download itinerary as PDF</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        size="sm" 
                        className="gap-1 text-xs md:text-sm h-9"
                        onClick={() => setShowShareOptions(!showShareOptions)}
                      >
                        <Share2 className="h-3.5 w-3.5" />
                        <span>Share Trip</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs">Share this itinerary with others</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Itinerary */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="itinerary" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="itinerary" className="gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>Itinerary</span>
                </TabsTrigger>
                <TabsTrigger value="map" className="gap-2">
                  <Map className="h-4 w-4" />
                  <span>Journey Map</span>
                </TabsTrigger>
                <TabsTrigger value="info" className="gap-2">
                  <FileText className="h-4 w-4" />
                  <span>Essential Info</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="itinerary" className="focus-visible:outline-none focus-visible:ring-0">
                {/* Day Pills */}
                <ScrollArea className="w-full whitespace-nowrap pb-4">
                  <div className="flex gap-2">
                    {tripData.itinerary.map((day) => {
                      const date = parseISO(day.date);
                      const formattedDate = format(date, "MMM d");
                      const isActive = day.day_number === activeDay;
                      
                      return (
                        <button
                          key={day.day_number}
                          onClick={() => setActiveDay(day.day_number)}
                          className={`inline-flex flex-col items-center px-4 py-2 rounded-full transition-colors ${
                            isActive
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted hover:bg-muted/80"
                          }`}
                        >
                          <span className="text-xs font-medium">Day {day.day_number}</span>
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
                        <Card className="mb-6 overflow-hidden">
                          <div className="bg-muted p-4 flex justify-between items-center border-b">
                            <div>
                              <h3 className="text-lg font-medium">
                                Day {day.day_number}: {formatDateFull(day.date)}
                              </h3>
                              <p className="text-muted-foreground text-sm">
                                {day.time_blocks.length} planned activities
                              </p>
                            </div>
                            <div className="flex items-center gap-3 bg-background/50 px-3 py-2 rounded-md border">
                              <div className="flex items-center">
                                {getWeatherIcon(day.weather.conditions)}
                                <span className="text-sm ml-1.5">{day.weather.conditions}</span>
                              </div>
                              <div className="text-sm">
                                <span className="text-blue-500">{day.weather.temperature.min}°</span>
                                <span className="mx-1">-</span>
                                <span className="text-red-500">{day.weather.temperature.max}°C</span>
                              </div>
                            </div>
                          </div>
                          
                          {/* Timeline View */}
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
                                      {/* Timeline Dot */}
                                      <div className={`relative px-1 ${isActivity ? "bg-primary-50" : ""}`}>
                                        <div className={`h-10 w-10 rounded-full flex items-center justify-center border-2 ${
                                            block.type === "fixed" 
                                              ? "border-primary bg-primary/10" 
                                              : "border-muted-foreground/30 bg-muted"
                                          }`}
                                        >
                                          {isActivity ? (
                                            <Camera className="h-5 w-5 text-primary" />
                                          ) : (
                                            <Clock className="h-5 w-5 text-muted-foreground" />
                                          )}
                                        </div>
                                      </div>
                                      
                                      {/* Timeline Content */}
                                      <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                          <span className="bg-muted text-xs px-2 py-0.5 rounded font-medium">
                                            {formatTime(block.start_time)} - {formatTime(block.end_time)}
                                          </span>
                                          <span className="text-xs text-muted-foreground">
                                            ({Math.round(block.duration_minutes / 60)} hours)
                                          </span>
                                          {block.type === "flexible" && (
                                            <Badge variant="outline" className="text-[10px]">Flexible</Badge>
                                          )}
                                        </div>
                                        
                                        {/* Activity or Travel Card */}
                                        <Card className={`overflow-hidden ${isActivity ? "border-l-2 border-l-primary" : ""}`}>
                                          {isActivity && block.activity?.images && block.activity.images.length > 0 && (
                                            <div className="relative h-48 w-full">
                                              <Image
                                                src={block.activity.images[0]}
                                                alt={block.activity.title}
                                                fill
                                                className="object-cover"
                                              />
                                              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                                                <Badge className="mb-2 capitalize">
                                                  {block.activity.type}
                                                </Badge>
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
                                                <div className="flex items-center text-xs gap-1 bg-muted px-2 py-1 rounded-md">
                                                  <MapPin className="h-3 w-3" />
                                                  <span>{block.activity.location.name}</span>
                                                </div>
                                              )}
                                              
                                              {/* Cost */}
                                              {isActivity && block.activity?.cost && (
                                                <div className="flex items-center text-xs gap-1 bg-muted px-2 py-1 rounded-md">
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
                                            
                                            {/* Warnings */}
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
                                            <CardFooter className="px-4 py-3 bg-muted/20 flex justify-between border-t">
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
                                                  onClick={() => {}}
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
                <Card>
                  <div className="p-4 border-b">
                    <h3 className="text-lg font-medium">Journey Map</h3>
                    <p className="text-sm text-muted-foreground">
                      Your complete trip visualization with all destinations
                    </p>
                  </div>
                  
                  <div className="p-4">
                    <div className="aspect-[16/9] bg-muted rounded-md overflow-hidden relative">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center p-6">
                          <Map className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                          <p className="text-muted-foreground">
                            Interactive map would be displayed here
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Total distance: {tripData.journey_path.distance_km} km
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <h4 className="text-sm font-medium mb-2">Elevation Profile</h4>
                      <div className="h-24 bg-muted/30 rounded-md p-3 border">
                        <div className="relative h-full">
                          {/* Simplified elevation chart visualization */}
                          <div className="absolute bottom-0 left-0 right-0 h-1/2 border-t border-primary/30"></div>
                          <div className="absolute bottom-0 left-1/4 right-0 h-1/4 border-t border-primary/30"></div>
                          <div className="absolute bottom-0 left-1/2 right-0 h-3/4 border-t border-primary/30"></div>
                          <div className="absolute bottom-0 left-3/4 right-0 h-1/3 border-t border-primary/30"></div>
                        </div>
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>Start: {tripData.journey_path.elevation_profile[0]?.elevation}m</span>
                        <span>Highest: {Math.max(...tripData.journey_path.elevation_profile.map(p => p.elevation))}m</span>
                        <span>End: {tripData.journey_path.elevation_profile[tripData.journey_path.elevation_profile.length-1]?.elevation}m</span>
                      </div>
                    </div>
                  </div>
                </Card>
              </TabsContent>
              
              <TabsContent value="info" className="focus-visible:outline-none focus-visible:ring-0">
                <Card>
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
                            {tripData.essential_info.documents.map((doc, idx) => (
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
                            {tripData.essential_info.emergency_contacts.map((contact, idx) => (
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
                      
                      <AccordionItem value="language">
                        <AccordionTrigger className="hover:no-underline">
                          <div className="flex items-center gap-2">
                            <Globe className="h-4 w-4 text-primary" />
                            <span>Language & Tips</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-3 text-sm">
                            <p>
                              The official language is Japanese. English is somewhat common in Tokyo, 
                              especially in tourist areas, hotels, and restaurants.
                            </p>
                            
                            <div>
                              <h4 className="font-medium mb-1">Useful Phrases:</h4>
                              <ul className="space-y-1">
                                <li>Hello: Konnichiwa</li>
                                <li>Thank you: Arigatou gozaimasu</li>
                                <li>Excuse me: Sumimasen</li>
                                <li>Yes/No: Hai/Iie</li>
                              </ul>
                            </div>
                            
                            <div>
                              <h4 className="font-medium mb-1">Etiquette Tips:</h4>
                              <ul className="space-y-1">
                                <li>Bow when greeting people</li>
                                <li>Remove shoes before entering homes and some restaurants</li>
                                <li>Tipping is not customary in Japan</li>
                                <li>Avoid eating while walking</li>
                              </ul>
                            </div>
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
            <Card className="overflow-hidden">
              <div className="p-4 border-b">
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
                    {tripData.metadata.total_budget.total} {tripData.metadata.total_budget.currency}
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
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <DollarSign className="h-4 w-4 text-primary" />
                      </div>
                      <span className="text-sm">Budget Breakdown</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2 mt-3">
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
                </div>
                
                <Separator />
                
                {/* Preferences */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <Heart className="h-4 w-4 text-primary" />
                      </div>
                      <span className="text-sm">Preferences</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-1">
                    <Badge variant="outline" className="bg-muted/30">
                      {tripData.metadata.preferences.pace} pace
                    </Badge>
                    
                    {tripData.metadata.preferences.dietary_restrictions.map((diet, idx) => (
                      <Badge key={idx} variant="outline" className="bg-muted/30">
                        {diet}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="bg-muted/20 p-3 rounded-md text-xs text-muted-foreground border">
                    <div className="font-medium mb-1">Your Trip Context:</div>
                    <p>{tripData.metadata.preferences.context}</p>
                  </div>
                </div>
              </div>

              <div className="bg-muted/20 p-3 border-t text-xs text-muted-foreground">
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

            {/* Accommodations Section */}
            <Card>
              <div className="p-4 border-b">
                <h3 className="text-lg font-medium">Recommended Accommodations</h3>
              </div>
              
              <div className="p-4">
                <div className="space-y-4">
                  {tripData.recommendations.accommodations.map((hotel, idx) => (
                    <div key={idx} className="group cursor-pointer" onClick={() => setShowHotelInfo(!showHotelInfo)}>
                      <div className="relative h-40 w-full rounded-md overflow-hidden">
                        <Image
                          src={hotel.images[0]}
                          alt={hotel.name}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="absolute bottom-0 p-3 w-full">
                          <div className="flex justify-between items-end w-full">
                            <div>
                              <Badge className="mb-1 bg-primary/80">
                                {hotel.type}
                              </Badge>
                              <h4 className="text-white font-medium">{hotel.name}</h4>
                              <div className="flex items-center gap-1">
                                <MapPin className="h-3 w-3 text-white/70" />
                                <span className="text-xs text-white/90">{hotel.location.name}</span>
                              </div>
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
                                  {Array.from({ length: hotel.price_range.length }).map((_, i) => (
                                    <DollarSign key={i} className="h-3.5 w-3.5 text-muted-foreground" />
                                  ))}
                                </div>
                                <a 
                                  href={hotel.link} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-xs text-primary hover:underline flex items-center gap-1"
                                >
                                  <ExternalLink className="h-3 w-3" />
                                  <span>View Details</span>
                                </a>
                              </div>
                              
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
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-1">
                      <PencilLine className="h-3.5 w-3.5" />
                      <span>Edit Trip</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">Make changes to your itinerary</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-1">
                      <Printer className="h-3.5 w-3.5" />
                      <span>Print Itinerary</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">Print a copy of your itinerary</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="gap-1"
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
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">Copy the unique ID for this trip</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}