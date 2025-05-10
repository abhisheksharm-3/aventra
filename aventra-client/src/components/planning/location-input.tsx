"use client";

import { useFormContext } from "react-hook-form";
import { 
  MapPin, Plane, Search, X, Globe, Navigation, 
  Compass, History, Locate, Sparkles, ArrowRight
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { type TripFormValues } from "@/lib/validations/trip-schema";
import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export function LocationInput() {
  // Current time from system
  const currentDateTime = new Date().toISOString().replace('T', ' ').substring(0, 19);

  const { register, setValue, watch, formState: { errors } } = useFormContext<TripFormValues>();
  const [showDestinationSuggestions, setShowDestinationSuggestions] = useState(false);
  const [showOriginSuggestions, setShowOriginSuggestions] = useState(false);
  const [focusedField, setFocusedField] = useState<"destination" | "origin" | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState<"popular" | "recent" | "nearby">("popular");
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  
  const destination = watch("location.destination") || "";
  const origin = watch("location.baseCity") || "";
  
  const destinationRef = useRef<HTMLDivElement>(null);
  const destinationInputRef = useRef<HTMLInputElement>(null);
  const originRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  // Extract register options to avoid ref conflicts
  const { ref: destinationRegisterRef, ...destinationRegisterRest } = register("location.destination");
  const { ref: originRegisterRef, ...originRegisterRest } = register("location.baseCity");

  // Sample popular destinations with country codes
  const popularDestinations = [
    { name: "Paris, France", code: "FR", emoji: "🇫🇷", trending: true },
    { name: "Tokyo, Japan", code: "JP", emoji: "🇯🇵", trending: true },
    { name: "New York, USA", code: "US", emoji: "🇺🇸" },
    { name: "Rome, Italy", code: "IT", emoji: "🇮🇹" },
    { name: "Barcelona, Spain", code: "ES", emoji: "🇪🇸", trending: true },
    { name: "London, UK", code: "GB", emoji: "🇬🇧" },
    { name: "Sydney, Australia", code: "AU", emoji: "🇦🇺" },
    { name: "Dubai, UAE", code: "AE", emoji: "🇦🇪" },
    { name: "Bali, Indonesia", code: "ID", emoji: "🇮🇩", trending: true },
    { name: "Santorini, Greece", code: "GR", emoji: "🇬🇷" },
    { name: "Kyoto, Japan", code: "JP", emoji: "🇯🇵" },
    { name: "Marrakech, Morocco", code: "MA", emoji: "🇲🇦" }
  ];
  
  // Sample popular origin cities
  const popularOrigins = [
    { name: "New York, USA", code: "US", emoji: "🇺🇸" },
    { name: "London, UK", code: "GB", emoji: "🇬🇧" },
    { name: "Tokyo, Japan", code: "JP", emoji: "🇯🇵" },
    { name: "Los Angeles, USA", code: "US", emoji: "🇺🇸" },
    { name: "Toronto, Canada", code: "CA", emoji: "🇨🇦" },
    { name: "Singapore", code: "SG", emoji: "🇸🇬" },
    { name: "Berlin, Germany", code: "DE", emoji: "🇩🇪" },
    { name: "Melbourne, Australia", code: "AU", emoji: "🇦🇺" },
    { name: "Dubai, UAE", code: "AE", emoji: "🇦🇪" },
  ];
  
  // Mock recent searches for the user
  const recentSearches = [
    { name: "Kyoto, Japan", code: "JP", emoji: "🇯🇵", timestamp: "2025-05-09 15:22:10" },
    { name: "Bali, Indonesia", code: "ID", emoji: "🇮🇩", timestamp: "2025-05-08 09:46:32" },
    { name: "Barcelona, Spain", code: "ES", emoji: "🇪🇸", timestamp: "2025-05-06 12:11:44" }
  ];

  // Mock nearby locations based on IP geolocation
  const nearbyLocations = [
    { name: "Mumbai, India", code: "IN", emoji: "🇮🇳", distance: "12km" },
    { name: "Pune, India", code: "IN", emoji: "🇮🇳", distance: "150km" },
    { name: "Delhi, India", code: "IN", emoji: "🇮🇳", distance: "1,380km" },
  ];
  
  // Filter destinations based on search query
  const filteredDestinations = searchQuery.trim() === "" 
    ? popularDestinations
    : popularDestinations.filter(dest => 
        dest.name.toLowerCase().includes(searchQuery.toLowerCase())
      );

  // Filter origins based on search query
  const filteredOrigins = searchQuery.trim() === "" 
    ? popularOrigins
    : popularOrigins.filter(origin => 
        origin.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
  
  // Handle clicks outside the suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (destinationRef.current && !destinationRef.current.contains(event.target as Node)) {
        setShowDestinationSuggestions(false);
      }
      if (originRef.current && !originRef.current.contains(event.target as Node)) {
        setShowOriginSuggestions(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Focus search input when suggestions are shown
  useEffect(() => {
    if (showOriginSuggestions && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }
  }, [showOriginSuggestions]);
  
  // Handle location selection
  const selectLocation = (location: string, field: "destination" | "origin") => {
    setValue(`location.${field === "destination" ? "destination" : "baseCity"}`, location);
    if (field === "destination") {
      setShowDestinationSuggestions(false);
    } else {
      setShowOriginSuggestions(false);
    }
    
    // Save to recent searches (would be implemented with real storage)
    console.log(`Saving to recent searches: ${location} - ${currentDateTime}`);
  };
  
  // Clear input fields
  const clearField = (field: "destination" | "origin") => {
    setValue(`location.${field === "destination" ? "destination" : "baseCity"}`, "");
    
    if (field === "destination") {
      const input = destinationInputRef.current;
      if (input) {
        input.focus();
        setShowDestinationSuggestions(true);
      }
    } else {
      const input = document.querySelector<HTMLInputElement>('input[name="location.baseCity"]');
      if (input) {
        input.focus();
        setShowOriginSuggestions(true);
      }
    }
  };

  // Get user's current location
  const getCurrentLocation = () => {
    setIsGettingLocation(true);
    
    // Simulate geolocation detection
    setTimeout(() => {
      setValue("location.baseCity", "Mumbai, India");
      setIsGettingLocation(false);
      setShowOriginSuggestions(false);
    }, 1500);
  };

  // Swap destination and origin
  const swapLocations = () => {
    const currentDestination = destination;
    const currentOrigin = origin;
    setValue("location.destination", currentOrigin);
    setValue("location.baseCity", currentDestination);
  };
  
  return (
    <div className="grid grid-cols-1 gap-4 md:gap-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Destination Input */}
        <div className="relative" ref={destinationRef}>
          <div className={`absolute left-3 top-3.5 transition-colors duration-200 ${focusedField === "destination" ? "text-primary" : "text-muted-foreground"}`}>
            <MapPin className="h-5 w-5" />
          </div>
          <Input
            ref={(e) => {
              // Handle both refs - react hook form and our local ref
              destinationRegisterRef(e);
              destinationInputRef.current = e;
            }}
            placeholder="Where to?"
            className={`pl-10 pr-8 h-12 bg-background text-lg border transition-all duration-200 ${
              focusedField === "destination" ? "border-primary ring-1 ring-primary/20" : "border-input"
            } ${errors.location?.destination ? "border-destructive" : ""}`}
            {...destinationRegisterRest}
            onFocus={() => {
              setShowDestinationSuggestions(true);
              setFocusedField("destination");
            }}
            onBlur={() => {
              setFocusedField(null);
            }}
          />
          
          {destination && (
            <button 
              type="button"
              className="absolute right-3.5 top-3.5 text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => clearField("destination")}
              aria-label="Clear destination"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          
          {errors.location?.destination && (
            <p className="text-xs text-destructive mt-1">{errors.location.destination.message}</p>
          )}
          
          <AnimatePresence>
            {showDestinationSuggestions && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.15 }}
                className="absolute left-0 right-0 mt-2 z-20"
              >
                <Card className="overflow-hidden border border-border/60 rounded-md shadow-lg">
                  <div className="p-2.5 border-b border-border/40 bg-muted/10">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input 
                        placeholder="Search for a destination..." 
                        className="pl-9 h-9 text-sm"
                        autoComplete="off"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        aria-label="Search destinations"
                      />
                    </div>
                  </div>
                
                  <div className="max-h-[280px] overflow-y-auto">
                    <div className="p-3 border-b border-border/40 bg-muted/30">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Globe className="h-4 w-4 text-primary" />
                          <span className="text-sm font-medium">Popular Destinations</span>
                        </div>
                        {searchQuery.trim() === "" && (
                          <Badge variant="secondary" className="text-[10px] bg-primary/5">
                            <Sparkles className="h-2.5 w-2.5 text-amber-500 mr-1" />
                            Trending
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    {filteredDestinations.length === 0 ? (
                      <div className="p-4 text-center text-sm text-muted-foreground">
                        No destinations found matching &quot;{searchQuery}&quot;
                      </div>
                    ) : (
                      filteredDestinations.map((dest) => (
                        <div
                          key={dest.name}
                          className="flex items-center px-3 py-2.5 hover:bg-muted transition-colors cursor-pointer border-b border-border/10 last:border-0 relative group"
                          onClick={() => selectLocation(dest.name, "destination")}
                        >
                          <div className="h-8 w-8 rounded-full bg-muted/70 flex items-center justify-center mr-2.5 text-sm">
                            {dest.emoji}
                          </div>
                          <div>
                            <div className="text-sm font-medium">{dest.name.split(",")[0]}</div>
                            <div className="text-xs text-muted-foreground">
                              {dest.name.split(",")[1] ? dest.name.split(",")[1].trim() : ""}
                            </div>
                          </div>
                          <Badge variant="outline" className="ml-auto text-xs">
                            {dest.code}
                          </Badge>

                          {dest.trending && searchQuery.trim() === "" && (
                            <div className="absolute right-10 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Badge className="bg-amber-500/20 text-amber-700 border-amber-200 text-[10px]">
                                Trending
                              </Badge>
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Origin Input */}
        <div className="relative" ref={originRef}>
          <div className={`absolute left-3 top-3.5 transition-colors duration-200 ${focusedField === "origin" ? "text-primary" : "text-muted-foreground"}`}>
            <Plane className="h-5 w-5" />
          </div>
          <Input
            ref={originRegisterRef}
            placeholder="Where from?"
            className={`pl-10 pr-16 h-12 bg-background text-lg border transition-all duration-200 ${
              focusedField === "origin" ? "border-primary ring-1 ring-primary/20" : "border-input"
            } ${errors.location?.baseCity ? "border-destructive" : ""}`}
            {...originRegisterRest}
            onFocus={() => {
              setShowOriginSuggestions(true);
              setFocusedField("origin");
            }}
            onBlur={() => {
              setFocusedField(null);
            }}
          />
          
          <div className="absolute right-3.5 top-3 flex items-center gap-1.5">
            {origin && (
              <button 
                type="button"
                className="text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => clearField("origin")}
                aria-label="Clear origin"
              >
                <X className="h-4 w-4" />
              </button>
            )}
            
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  className="ml-1 text-muted-foreground hover:text-primary transition-colors disabled:opacity-50"
                  onClick={getCurrentLocation}
                  disabled={isGettingLocation}
                  aria-label="Use current location"
                >
                  <Locate className={cn("h-4.5 w-4.5", isGettingLocation && "animate-pulse text-primary")} />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">Use current location</p>
              </TooltipContent>
            </Tooltip>
          </div>
          
          {errors.location?.baseCity && (
            <p className="text-xs text-destructive mt-1">{errors.location.baseCity.message}</p>
          )}
          
          <AnimatePresence>
            {showOriginSuggestions && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.15 }}
                className="absolute left-0 right-0 mt-2 z-20"
              >
                <Card className="overflow-hidden border border-border/60 rounded-md shadow-lg">
                  <div className="flex border-b border-border/40">
                    <button
                      type="button"
                      className={`flex-1 py-2 px-3 text-sm font-medium ${
                        selectedTab === "popular" 
                          ? "bg-muted/30 text-foreground" 
                          : "bg-transparent text-muted-foreground hover:bg-muted/10"
                      } transition-colors`}
                      onClick={() => setSelectedTab("popular")}
                    >
                      <div className="flex items-center justify-center gap-1.5">
                        <Globe className="h-3.5 w-3.5" />
                        <span>Popular</span>
                      </div>
                    </button>
                    <button
                      type="button"
                      className={`flex-1 py-2 px-3 text-sm font-medium ${
                        selectedTab === "recent" 
                          ? "bg-muted/30 text-foreground" 
                          : "bg-transparent text-muted-foreground hover:bg-muted/10"
                      } transition-colors`}
                      onClick={() => setSelectedTab("recent")}
                    >
                      <div className="flex items-center justify-center gap-1.5">
                        <History className="h-3.5 w-3.5" />
                        <span>Recent</span>
                      </div>
                    </button>
                    <button
                      type="button"
                      className={`flex-1 py-2 px-3 text-sm font-medium ${
                        selectedTab === "nearby" 
                          ? "bg-muted/30 text-foreground" 
                          : "bg-transparent text-muted-foreground hover:bg-muted/10"
                      } transition-colors`}
                      onClick={() => setSelectedTab("nearby")}
                    >
                      <div className="flex items-center justify-center gap-1.5">
                        <Compass className="h-3.5 w-3.5" />
                        <span>Nearby</span>
                      </div>
                    </button>
                  </div>
                  
                  <div className="p-2.5 border-b border-border/40 bg-muted/10">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input 
                        ref={searchInputRef}
                        placeholder="Search for a city..." 
                        className="pl-9 h-9 text-sm"
                        autoComplete="off"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        aria-label="Search origins"
                      />
                    </div>
                  </div>
                
                  <div className="max-h-[280px] overflow-y-auto">
                    {selectedTab === "popular" && (
                      <>
                        <div className="p-3 border-b border-border/40 bg-muted/30">
                          <div className="flex items-center gap-2">
                            <Navigation className="h-4 w-4 text-primary" />
                            <span className="text-sm font-medium">Popular Departure Cities</span>
                          </div>
                        </div>
                        
                        {filteredOrigins.length === 0 ? (
                          <div className="p-4 text-center text-sm text-muted-foreground">
                            No cities found matching &quot;{searchQuery}&quot;
                          </div>
                        ) : (
                          filteredOrigins.map((origin) => (
                            <div
                              key={origin.name}
                              className="flex items-center px-3 py-2.5 hover:bg-muted transition-colors cursor-pointer border-b border-border/10 last:border-0"
                              onClick={() => selectLocation(origin.name, "origin")}
                            >
                              <div className="h-8 w-8 rounded-full bg-muted/70 flex items-center justify-center mr-2.5 text-sm">
                                {origin.emoji}
                              </div>
                              <div>
                                <div className="text-sm font-medium">{origin.name.split(",")[0]}</div>
                                <div className="text-xs text-muted-foreground">
                                  {origin.name.split(",")[1] ? origin.name.split(",")[1].trim() : ""}
                                </div>
                              </div>
                              <Badge variant="outline" className="ml-auto text-xs">
                                {origin.code}
                              </Badge>
                            </div>
                          ))
                        )}
                      </>
                    )}
                    
                    {selectedTab === "recent" && (
                      <>
                        <div className="p-3 border-b border-border/40 bg-muted/30">
                          <div className="flex items-center gap-2">
                            <History className="h-4 w-4 text-primary" />
                            <span className="text-sm font-medium">Your Recent Searches</span>
                          </div>
                        </div>
                        
                        {recentSearches.length === 0 ? (
                          <div className="p-6 text-center">
                            <p className="text-sm text-muted-foreground">No recent searches found</p>
                          </div>
                        ) : (
                          recentSearches.map((item) => (
                            <div
                              key={item.name}
                              className="flex items-center px-3 py-2.5 hover:bg-muted transition-colors cursor-pointer border-b border-border/10 last:border-0"
                              onClick={() => selectLocation(item.name, "origin")}
                            >
                              <div className="h-8 w-8 rounded-full bg-muted/70 flex items-center justify-center mr-2.5 text-sm">
                                {item.emoji}
                              </div>
                              <div>
                                <div className="text-sm font-medium">{item.name}</div>
                                <div className="text-xs text-muted-foreground">
                                  Searched {formatTimeAgo(item.timestamp)}
                                </div>
                              </div>
                              <Badge variant="outline" className="ml-auto text-xs">
                                {item.code}
                              </Badge>
                            </div>
                          ))
                        )}
                      </>
                    )}
                    
                    {selectedTab === "nearby" && (
                      <>
                        <div className="p-3 border-b border-border/40 bg-muted/30">
                          <div className="flex items-center gap-2">
                            <Compass className="h-4 w-4 text-primary" />
                            <span className="text-sm font-medium">Nearby Your Location</span>
                          </div>
                        </div>
                        
                        {nearbyLocations.map((item) => (
                          <div
                            key={item.name}
                            className="flex items-center px-3 py-2.5 hover:bg-muted transition-colors cursor-pointer border-b border-border/10 last:border-0"
                            onClick={() => selectLocation(item.name, "origin")}
                          >
                            <div className="h-8 w-8 rounded-full bg-muted/70 flex items-center justify-center mr-2.5 text-sm">
                              {item.emoji}
                            </div>
                            <div>
                              <div className="text-sm font-medium">{item.name}</div>
                              <div className="text-xs text-muted-foreground">
                                {item.distance} from your location
                              </div>
                            </div>
                            <Badge variant="outline" className="ml-auto text-xs">
                              {item.code}
                            </Badge>
                          </div>
                        ))}
                      </>
                    )}
                  </div>
                  
                  <div className="p-2 bg-muted/20 border-t border-border/30">
                    <div className="text-center text-xs text-muted-foreground">
                      Can&apos;t find your city? Type it directly in the field above.
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      
      {/* Swap button that appears when both fields have values */}
      {destination && origin && (
        <div className="flex justify-center -mt-2">
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="gap-2 bg-muted/60 hover:bg-muted"
            onClick={swapLocations}
          >
            <ArrowRight className="h-3.5 w-3.5" />
            <span>Swap Locations</span>
          </Button>
        </div>
      )}
    </div>
  );
}

// Helper function to format time ago - using the current timestamp instead of hardcoding
function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date("2025-05-10 13:54:08"); // Current timestamp from context
  
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 172800) return `yesterday`;
  
  return `${Math.floor(diffInSeconds / 86400)} days ago`;
}