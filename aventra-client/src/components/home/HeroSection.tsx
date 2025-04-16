"use client";

import { useState, useRef, useEffect, FormEvent } from "react";
import { Search, MapPin, Calendar, Users, Globe, Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { FilterOptions } from "@/types/hero";
import { Background, WaveDecoration } from "../common/hero-bg";
import { Headline } from "../hero/headline";
import { SearchSuggestion } from "../hero/search-suggestion";
import { LocationFilter } from "../hero/location-filter";
import { DateFilter } from "../hero/date-filter";
import { GroupSizeFilter } from "../hero/group-size-filter";
import { GlobalFilter } from "../hero/global-filter";
import { featuredDestinations, trendingExperiences } from "@/lib/constants/hero";
import { TrendingItem } from "../hero/trending-item";
import { DestinationCard } from "../hero/destination-card";

export default function HeroSection() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  
  // Filter states
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    location: null,
    dateRange: null,
    groupSize: 2,
    regions: []
  });
  
  // Popover open states
  const [openPopover, setOpenPopover] = useState<string | null>(null);
  
  const suggestions: string[] = searchQuery ? [
    `${searchQuery} in Europe`,
    `Best ${searchQuery} adventures`,
    `${searchQuery} for beginners`,
    `Affordable ${searchQuery} experiences`
  ] : [];

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    console.log("Search submitted:", searchQuery, "Filters:", filterOptions);
  };

  // Function to toggle popovers
  const togglePopover = (name: string) => {
    if (openPopover === name) {
      setOpenPopover(null);
    } else {
      setOpenPopover(name);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | Event) => {
      if (inputRef.current && event.target instanceof Node && !inputRef.current.contains(event.target)) {
        setIsFocused(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Format date to display in button
  const formatDateRange = (range: { from: Date; to: Date; } | null) => {
    if (!range || !range.from) return null;
    
    const fromDate = format(range.from, "MMM d");
    const toDate = range.to ? format(range.to, "MMM d") : "";
    
    return toDate ? `${fromDate} - ${toDate}` : fromDate;
  };

  return (
    <section className="relative w-full min-h-[90vh] flex flex-col items-center justify-center pt-16 pb-24 overflow-hidden">
      <Background />

      <div className="container px-4 sm:px-6 mx-auto flex flex-col items-center max-w-4xl">
        <Headline />

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="w-full max-w-3xl relative"
        >
          <form 
            onSubmit={handleSearch}
            className="relative group"
            aria-label="Search experiences"
          >
            <div className="relative flex items-center rounded-xl overflow-hidden shadow-lg">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-background to-background/90 backdrop-blur-md" />
              <div className="relative w-full flex bg-transparent">
                <div className="p-4 pl-5 text-muted-foreground">
                  <Search className="h-5 w-5" />
                </div>
                <Input
                  ref={inputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  placeholder="Where would you like to go?"
                  className="flex-1 h-14 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-base"
                  aria-label="Search destinations"
                  aria-expanded={isFocused}
                />
                <div className="flex items-center">
                  <div className="h-6 w-px bg-border/40 mx-1 hidden sm:block"></div>
                  <Button 
                    type="submit" 
                    size="sm"
                    className="m-1.5 h-11 px-3 sm:px-4 rounded-lg text-sm font-medium gap-1.5 group-hover:bg-primary/90 transition-all"
                  >
                    <Sparkles className="h-3.5 w-3.5 opacity-70" />
                    <span className="hidden xs:inline">Explore</span>
                  </Button>
                </div>
              </div>
            </div>
          </form>

          <AnimatePresence>
            {isFocused && suggestions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute z-20 w-full mt-2 rounded-xl overflow-hidden shadow-lg border border-border/30 bg-background/95 backdrop-blur-md"
              >
                <div className="p-1">
                  {suggestions.map((suggestion, index) => (
                    <SearchSuggestion
                      key={index}
                      suggestion={suggestion}
                      onClick={() => {
                        setSearchQuery(suggestion);
                        setIsFocused(false);
                      }}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2 mt-4">
            {/* Location Filter */}
            <Popover open={openPopover === "location"} onOpenChange={(open) => {
              if (open) setOpenPopover("location");
              else setOpenPopover(null);
            }}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className={cn(
                    "rounded-full bg-background/80 border-border/40 hover:bg-accent/60 px-3 sm:px-4",
                    (openPopover === "location" || filterOptions.location) && "bg-primary/20 border-primary/30"
                  )}
                  onClick={() => togglePopover("location")}
                >
                  <MapPin className="h-3.5 w-3.5 mr-1" />
                  <span className="hidden xs:inline">
                    {filterOptions.location || "Location"}
                  </span>
                  {filterOptions.location && (
                    <Badge variant="secondary" className="ml-1 h-5 px-1.5">
                      <Check className="h-3 w-3" />
                    </Badge>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="p-0" align="center">
                <LocationFilter 
                  onClose={() => setOpenPopover(null)}
                  selectedLocation={filterOptions.location}
                  setSelectedLocation={(location) => 
                    setFilterOptions(prev => ({ ...prev, location }))
                  }
                />
              </PopoverContent>
            </Popover>

            {/* Dates Filter */}
            <Popover open={openPopover === "dates"} onOpenChange={(open) => {
              if (open) setOpenPopover("dates");
              else setOpenPopover(null);
            }}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className={cn(
                    "rounded-full bg-background/80 border-border/40 hover:bg-accent/60 px-3 sm:px-4",
                    (openPopover === "dates" || filterOptions.dateRange) && "bg-primary/20 border-primary/30"
                  )}
                  onClick={() => togglePopover("dates")}
                >
                  <Calendar className="h-3.5 w-3.5 mr-1" />
                  <span className="hidden xs:inline">
                    {formatDateRange(filterOptions.dateRange) || "Dates"}
                  </span>
                  {filterOptions.dateRange && (
                    <Badge variant="secondary" className="ml-1 h-5 px-1.5">
                      <Check className="h-3 w-3" />
                    </Badge>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="p-0" align="center">
                <DateFilter 
                  onClose={() => setOpenPopover(null)}
                  selectedDate={filterOptions.dateRange}
                  setSelectedDate={(dateRange) => 
                    setFilterOptions(prev => ({ ...prev, dateRange }))
                  }
                />
              </PopoverContent>
            </Popover>

            {/* Group Size Filter */}
            <Popover open={openPopover === "group"} onOpenChange={(open) => {
              if (open) setOpenPopover("group");
              else setOpenPopover(null);
            }}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className={cn(
                    "rounded-full bg-background/80 border-border/40 hover:bg-accent/60 px-3 sm:px-4",
                    (openPopover === "group" || filterOptions.groupSize !== 2) && "bg-primary/20 border-primary/30"
                  )}
                  onClick={() => togglePopover("group")}
                >
                  <Users className="h-3.5 w-3.5 mr-1" />
                  <span className="hidden xs:inline">
                    {filterOptions.groupSize} {filterOptions.groupSize === 1 ? 'Person' : 'People'}
                  </span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="p-0" align="center">
                <GroupSizeFilter 
                  onClose={() => setOpenPopover(null)}
                  groupSize={filterOptions.groupSize}
                  setGroupSize={(groupSize) => 
                    setFilterOptions(prev => ({ ...prev, groupSize }))
                  }
                />
              </PopoverContent>
            </Popover>

            {/* Global Filter */}
            <Popover open={openPopover === "global"} onOpenChange={(open) => {
              if (open) setOpenPopover("global");
              else setOpenPopover(null);
            }}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className={cn(
                    "rounded-full bg-background/80 border-border/40 hover:bg-accent/60 px-3 sm:px-4",
                    (openPopover === "global" || filterOptions.regions.length > 0) && "bg-primary/20 border-primary/30"
                  )}
                  onClick={() => togglePopover("global")}
                >
                  <Globe className="h-3.5 w-3.5 mr-1" />
                  <span className="hidden xs:inline">
                    {filterOptions.regions.length > 0 
                      ? `${filterOptions.regions.length} ${filterOptions.regions.length === 1 ? 'Region' : 'Regions'}`
                      : "Global"}
                  </span>
                  {filterOptions.regions.length > 0 && (
                    <Badge variant="secondary" className="ml-1 h-5 px-1.5">
                      {filterOptions.regions.length}
                    </Badge>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="p-0" align="center">
                <GlobalFilter 
                  onClose={() => setOpenPopover(null)}
                  selectedRegions={filterOptions.regions}
                  setSelectedRegions={(regions) => 
                    setFilterOptions(prev => ({ ...prev, regions }))
                  }
                />
              </PopoverContent>
            </Popover>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-8 sm:mt-12 text-center"
        >
          <div className="text-sm text-muted-foreground mb-3">Trending experiences</div>
          <div className="flex flex-wrap gap-1.5 sm:gap-2 justify-center">
            {trendingExperiences.map((item) => (
              <TrendingItem
                key={item.name}
                icon={item.icon}
                name={item.name}
                onClick={() => setSearchQuery(item.name)}
              />
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="w-full mt-12 sm:mt-16 px-1 sm:px-4 md:px-8"
        >
          <h2 className="text-center text-lg font-medium mb-6">Featured Destinations</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {featuredDestinations.map((destination) => (
              <DestinationCard
                key={destination.name}
                name={destination.name}
                country={destination.country}
                image={destination.image}
              />
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="mt-10 sm:mt-14 flex items-center gap-2 py-2 px-4 rounded-full bg-background/90 border border-border/30 shadow-sm"
        >
          <Sparkles className="h-4 w-4 text-primary" />
          <span className="text-sm">Powered by AI recommendations</span>
        </motion.div>
      </div>

      <WaveDecoration />
    </section>
  );
}