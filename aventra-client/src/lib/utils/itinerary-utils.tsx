/* eslint-disable @typescript-eslint/no-unused-vars */
import { format, parseISO } from "date-fns";
import { GeneratedItineraryResponse } from "@/types/itinerary";
import { 
  Sun, 
  Cloud, 
  Umbrella, 
  Utensils, 
  Camera, 
  Mountain, 
  Landmark, 
  Building, 
  Tent, 
  Car, 
  Bike, 
  Bus, 
  User 
} from "lucide-react";
import React from "react";

// Default image for fallbacks
export const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1606922108307-bfb7c3655f5d?q=80&w=1000";
export const DEFAULT_HOTEL_IMAGE = "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?q=80&w=1000";
export const KAZA_IMAGE = "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?q=80&w=1000";

// Weather icons mapping
const weatherIcons: Record<string, React.ReactNode> = {
  "Sunny": <Sun className="h-4 w-4 text-amber-500" />,
  "Partly Cloudy": <Cloud className="h-4 w-4 text-blue-400" />,
  "Partly cloudy": <Cloud className="h-4 w-4 text-blue-400" />,
  "Cloudy": <Cloud className="h-4 w-4 text-gray-400" />,
  "Rain": <Umbrella className="h-4 w-4 text-blue-500" />,
  "Sunny with occasional clouds": <Sun className="h-4 w-4 text-amber-500" />,
};

// Activity type icons
const activityTypeIcons: Record<string, React.ReactNode> = {
  "dining": <Utensils className="h-5 w-5 text-primary" />,
  "sightseeing": <Camera className="h-5 w-5 text-primary" />,
  "trekking": <Mountain className="h-5 w-5 text-primary" />,
  "monastery": <Landmark className="h-5 w-5 text-primary" />,
  "village": <Building className="h-5 w-5 text-primary" />,
  "market": <Tent className="h-5 w-5 text-primary" />,
  "festival": <Tent className="h-5 w-5 text-primary" />,
  "landmark": <Landmark className="h-5 w-5 text-primary" />,
};

// Travel mode icons
const travelModeIcons: Record<string, React.ReactNode> = {
  "taxi": <Car className="h-5 w-5 text-muted-foreground" />,
  "car": <Car className="h-5 w-5 text-muted-foreground" />,
  "bike": <Bike className="h-5 w-5 text-muted-foreground" />,
  "motorbike": <Bike className="h-5 w-5 text-muted-foreground" />,
  "bus": <Bus className="h-5 w-5 text-muted-foreground" />,
  "walking": <User className="h-5 w-5 text-muted-foreground" />
};

// Format date helper
export const formatDateFull = (dateString: string) => {
  try {
    const date = parseISO(dateString);
    return format(date, "EEEE, MMMM d, yyyy");
  } catch (error) {
    return dateString;
  }
};

// Format time helper
export const formatTime = (timeString: string) => {
  if (!timeString) return "";
  const [hours, minutes] = timeString.split(":");
  return `${hours}:${minutes}`;
};

// Get weather icon
export const getWeatherIcon = (condition: string) => {
  return weatherIcons[condition] || <Cloud className="h-4 w-4" />;
};

// Get activity icon
export const getActivityIcon = (activityType: string) => {
  const lowerType = activityType.toLowerCase();
  return activityTypeIcons[lowerType] || <Camera className="h-5 w-5 text-primary" />;
};

// Get travel icon
export const getTravelIcon = (travelMode: string) => {
  const lowerMode = travelMode.toLowerCase();
  return travelModeIcons[lowerMode] || <Car className="h-5 w-5 text-muted-foreground" />;
};

// Get first available image for cover
export const getCoverImage = (tripData: GeneratedItineraryResponse) => {
  for (const day of tripData.itinerary) {
    for (const block of day.time_blocks) {
      if (block.activity && block.activity.images && block.activity.images.length > 0) {
        return block.activity.images[0];
      }
    }
  }
  return KAZA_IMAGE;
};