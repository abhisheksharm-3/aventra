"use client";

import { useFormContext } from "react-hook-form";
import { MapPin, Plane, Search, X, Globe, Navigation } from "lucide-react";
import { Input } from "@/components/ui/input";
import { type TripFormValues } from "@/lib/validations/trip-schema";
import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function LocationInput() {
  const { register, setValue, watch, formState: { errors } } = useFormContext<TripFormValues>();
  const [showDestinationSuggestions, setShowDestinationSuggestions] = useState(false);
  const [showOriginSuggestions, setShowOriginSuggestions] = useState(false);
  const [focusedField, setFocusedField] = useState<"destination" | "origin" | null>(null);
  
  const destination = watch("location.destination") || "";
  const origin = watch("location.baseCity") || "";
  
  const destinationRef = useRef<HTMLDivElement>(null);
  const originRef = useRef<HTMLDivElement>(null);
  
  // Sample popular destinations with country codes
  const popularDestinations = [
    { name: "Paris, France", code: "FR", emoji: "🇫🇷" },
    { name: "Tokyo, Japan", code: "JP", emoji: "🇯🇵" },
    { name: "New York, USA", code: "US", emoji: "🇺🇸" },
    { name: "Rome, Italy", code: "IT", emoji: "🇮🇹" },
    { name: "Barcelona, Spain", code: "ES", emoji: "🇪🇸" },
    { name: "London, UK", code: "GB", emoji: "🇬🇧" },
    { name: "Sydney, Australia", code: "AU", emoji: "🇦🇺" },
    { name: "Dubai, UAE", code: "AE", emoji: "🇦🇪" },
  ];
  
  // Sample popular origin cities
  const popularOrigins = [
    { name: "New York, USA", code: "US", emoji: "🇺🇸" },
    { name: "London, UK", code: "GB", emoji: "🇬🇧" },
    { name: "Tokyo, Japan", code: "JP", emoji: "🇯🇵" },
    { name: "Los Angeles, USA", code: "US", emoji: "🇺🇸" },
    { name: "Toronto, Canada", code: "CA", emoji: "🇨🇦" },
    { name: "Singapore", code: "SG", emoji: "🇸🇬" },
  ];
  
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
  
  // Handle location selection
  const selectLocation = (location: string, field: "destination" | "origin") => {
    setValue(`location.${field === "destination" ? "destination" : "baseCity"}`, location);
    if (field === "destination") {
      setShowDestinationSuggestions(false);
    } else {
      setShowOriginSuggestions(false);
    }
  };
  
  // Clear input fields
  const clearField = (field: "destination" | "origin") => {
    setValue(`location.${field === "destination" ? "destination" : "baseCity"}`, "");
    if (field === "destination") {
      const input = document.querySelector<HTMLInputElement>('input[name="location.destination"]');
      if (input) input.focus();
    } else {
      const input = document.querySelector<HTMLInputElement>('input[name="location.baseCity"]');
      if (input) input.focus();
    }
  };
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {/* Destination Input */}
      <div className="relative" ref={destinationRef}>
        <div className={`absolute left-3 top-3.5 transition-colors duration-200 ${focusedField === "destination" ? "text-primary" : "text-muted-foreground"}`}>
          <MapPin className="h-5 w-5" />
        </div>
        <Input
          placeholder="Where to?"
          className={`pl-10 pr-8 h-12 bg-background text-lg border transition-all duration-200 ${
            focusedField === "destination" ? "border-primary/50 shadow-sm" : "border-input"
          } ${errors.location?.destination ? "border-destructive" : ""}`}
          {...register("location.destination")}
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
          >
            <X className="h-4 w-4" />
          </button>
        )}
        
        {errors.location?.destination && (
          <p className="text-xs text-destructive mt-1">{errors.location.destination.message}</p>
        )}
        
        {showDestinationSuggestions && (
          <Card className="absolute left-0 right-0 mt-2 overflow-hidden border border-border/60 rounded-md shadow-md z-20 animate-in fade-in">
            <div className="max-h-[280px] overflow-y-auto">
              <div className="p-3 border-b border-border/40 bg-muted/30">
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">Popular Destinations</span>
                </div>
              </div>
              
              {popularDestinations.map((dest) => (
                <div
                  key={dest.name}
                  className="flex items-center px-3 py-2.5 hover:bg-muted transition-colors cursor-pointer border-b border-border/10 last:border-0"
                  onClick={() => selectLocation(dest.name, "destination")}
                >
                  <div className="h-7 w-7 rounded-full bg-muted/70 flex items-center justify-center mr-2 text-sm">
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
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>

      {/* Origin Input */}
      <div className="relative" ref={originRef}>
        <div className={`absolute left-3 top-3.5 transition-colors duration-200 ${focusedField === "origin" ? "text-primary" : "text-muted-foreground"}`}>
          <Plane className="h-5 w-5" />
        </div>
        <Input
          placeholder="Where from?"
          className={`pl-10 pr-8 h-12 bg-background text-lg border transition-all duration-200 ${
            focusedField === "origin" ? "border-primary/50 shadow-sm" : "border-input"
          } ${errors.location?.baseCity ? "border-destructive" : ""}`}
          {...register("location.baseCity")}
          onFocus={() => {
            setShowOriginSuggestions(true);
            setFocusedField("origin");
          }}
          onBlur={() => {
            setFocusedField(null);
          }}
        />
        
        {origin && (
          <button 
            type="button"
            className="absolute right-3.5 top-3.5 text-muted-foreground hover:text-foreground transition-colors"
            onClick={() => clearField("origin")}
          >
            <X className="h-4 w-4" />
          </button>
        )}
        
        {errors.location?.baseCity && (
          <p className="text-xs text-destructive mt-1">{errors.location.baseCity.message}</p>
        )}
        
        {showOriginSuggestions && (
          <Card className="absolute left-0 right-0 mt-2 overflow-hidden border border-border/60 rounded-md shadow-md z-20 animate-in fade-in">
            <div className="max-h-[280px] overflow-y-auto">
              <div className="p-3 border-b border-border/40 bg-muted/30">
                <div className="flex items-center gap-2">
                  <Navigation className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">Popular Departure Cities</span>
                </div>
              </div>
              
              <div className="p-2.5 border-b border-border/40 bg-muted/10">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search for a city..." 
                    className="pl-9 h-9 text-sm"
                    autoComplete="off"
                  />
                </div>
              </div>
              
              {popularOrigins.map((origin) => (
                <div
                  key={origin.name}
                  className="flex items-center px-3 py-2.5 hover:bg-muted transition-colors cursor-pointer border-b border-border/10 last:border-0"
                  onClick={() => selectLocation(origin.name, "origin")}
                >
                  <div className="h-7 w-7 rounded-full bg-muted/70 flex items-center justify-center mr-2 text-sm">
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
              ))}
              
              <div className="p-2 bg-muted/20">
                <div className="text-center text-xs text-muted-foreground">
                  Can&apos;t find your city? Type it directly in the field above.
                </div>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}