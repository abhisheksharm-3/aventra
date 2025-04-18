"use client";

import { useState, useRef, useEffect, FormEvent, useMemo } from "react";
import {
  Search,
  MapPin,
  Calendar,
  Users,
  Check,
  Sparkles,
  Compass,
  IndianRupee,
  History,
  Plane,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { format, addDays } from "date-fns";
import { FilterOptions } from "@/types/hero";
import { Background, WaveDecoration } from "../common/hero-bg";
import { Headline } from "../hero/headline";
import { SearchSuggestion } from "../hero/search-suggestion";
import { LocationFilter } from "../hero/location-filter";
import { DateFilter } from "../hero/date-filter";
import { GroupSizeFilter } from "../hero/group-size-filter";
import { BudgetFilter } from "../hero/budget-filter";
import { TravelStyleFilter } from "../hero/travel-style-filter";
import {
  featuredDestinations,
  trendingExperiences,
  recentSearches,
} from "@/lib/constants/hero";
import { TrendingItem } from "../hero/trending-item";
import { DestinationCard } from "../hero/destination-card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export default function HeroSection() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [showRecentSearches, setShowRecentSearches] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Default the dateRange to today + 7 days
  const defaultDateRange = {
    from: new Date(2025, 3, 18), // Apr 18, 2025
    to: addDays(new Date(2025, 3, 18), 7), // Apr 25, 2025
  };

  // Filter states with improved defaults
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    location: null,
    dateRange: null,
    groupSize: 2,
    regions: [],
    budget: null,
    travelStyle: [],
  });

  // Dialog open states
  const [openDialog, setOpenDialog] = useState<string | null>(null);

  // Dynamic search suggestions that combine common phrases and recent searches
  const suggestions = useMemo(() => {
    if (!searchQuery) return [];
    
    const queryBasedSuggestions = [
      `${searchQuery} in Europe`,
      `Best ${searchQuery} adventures`,
      `${searchQuery} for beginners`,
      `Affordable ${searchQuery} experiences`,
    ];
    
    // If search query matches any part of previous searches, include them
    const matchingRecentSearches = recentSearches
      .filter(recent => 
        recent.toLowerCase().includes(searchQuery.toLowerCase()) &&
        recent.toLowerCase() !== searchQuery.toLowerCase()
      )
      .slice(0, 2);
      
    return [...queryBasedSuggestions, ...matchingRecentSearches];
  }, [searchQuery]);

  const handleSearch = async (e: FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);

    // Prepare data for API
    const itineraryRequest = {
      location: filterOptions.location || "Popular destinations",
      dates: filterOptions.dateRange || defaultDateRange,
      budget: filterOptions.budget,
      groupSize: filterOptions.groupSize,
      travelStyle: filterOptions.travelStyle,
      regions: filterOptions.regions,
      searchQuery: searchQuery || undefined,
    };

    console.log("Generating itinerary:", itineraryRequest);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Call your API endpoint here
      // const response = await generateItinerary(itineraryRequest);
      
      // Redirect to results page or show results
      // router.push('/itinerary/results');
      
    } finally {
      setIsGenerating(false);
    }
  };

  // Function to toggle dialogs
  const toggleDialog = (name: string) => {
    if (openDialog === name) {
      setOpenDialog(null);
    } else {
      setOpenDialog(name);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | Event) => {
      if (
        inputRef.current &&
        event.target instanceof Node &&
        !inputRef.current.contains(event.target)
      ) {
        setIsFocused(false);
        setShowRecentSearches(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Format date to display in button
  const formatDateRange = (range: { from: Date; to: Date } | null) => {
    if (!range || !range.from) return null;

    const fromDate = format(range.from, "MMM d");
    const toDate = range.to ? format(range.to, "MMM d") : "";

    return toDate ? `${fromDate} - ${toDate}` : fromDate;
  };

  const handleInputFocus = () => {
    setIsFocused(true);
    // Show recent searches when focusing on empty input
    if (!searchQuery) {
      setShowRecentSearches(true);
    } else {
      setShowRecentSearches(false);
    }
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
          className="w-full max-w-3xl relative z-10"
        >
          <form
            onSubmit={handleSearch}
            className="relative group"
            aria-label="Generate travel itinerary"
          >
            <div className="relative flex items-center rounded-xl overflow-hidden shadow-xl">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-background to-background/90 backdrop-blur-md" />
              <div className="relative w-full flex bg-transparent">
                <div className="p-4 pl-5 text-muted-foreground">
                  {isFocused ? (
                    <motion.div
                      initial={{ scale: 1 }}
                      animate={{ scale: 1.1 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Search className="h-5 w-5 text-primary" />
                    </motion.div>
                  ) : (
                    <Search className="h-5 w-5" />
                  )}
                </div>
                <Input
                  ref={inputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowRecentSearches(false);
                  }}
                  onFocus={handleInputFocus}
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
                    disabled={isGenerating}
                  >
                    {isGenerating ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Sparkles className="h-3.5 w-3.5 opacity-70" />
                    )}
                    <span className="hidden xs:inline">
                      {isGenerating ? "Generating..." : "Plan Trip"}
                    </span>
                  </Button>
                </div>
              </div>
            </div>
          </form>

          <AnimatePresence>
            {isFocused && suggestions.length > 0 && !showRecentSearches && (
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
                        setShowRecentSearches(false);
                      }}
                      isRecent={recentSearches.includes(suggestion)}
                    />
                  ))}
                </div>
              </motion.div>
            )}

            {showRecentSearches && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute z-20 w-full mt-2 rounded-xl overflow-hidden shadow-lg border border-border/30 bg-background/95 backdrop-blur-md"
              >
                <div className="p-2">
                  <div className="flex items-center pb-2 mb-1 border-b">
                    <History className="h-3.5 w-3.5 text-muted-foreground mr-2" />
                    <span className="text-sm font-medium">Recent searches</span>
                  </div>
                  {recentSearches.slice(0, 4).map((search, index) => (
                    <SearchSuggestion
                      key={index}
                      suggestion={search}
                      onClick={() => {
                        setSearchQuery(search);
                        setIsFocused(false);
                        setShowRecentSearches(false);
                      }}
                      isRecent={true}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2 mt-4">
            <TooltipProvider delayDuration={300}>
              {/* Location Filter */}
              <Dialog open={openDialog === "location"} onOpenChange={(open) => {
                setOpenDialog(open ? "location" : null);
              }}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className={cn(
                          "rounded-full bg-background/80 border-border/40 hover:bg-accent/60 px-3 sm:px-4",
                          (openDialog === "location" || filterOptions.location) &&
                            "bg-primary/20 border-primary/30"
                        )}
                        onClick={() => toggleDialog("location")}
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
                    </DialogTrigger>
                  </TooltipTrigger>
                  <TooltipContent>{filterOptions.location || "Select location"}</TooltipContent>
                </Tooltip>
                <DialogContent className="sm:max-w-[425px]">
                  <LocationFilter
                    onClose={() => setOpenDialog(null)}
                    selectedLocation={filterOptions.location}
                    setSelectedLocation={(location) =>
                      setFilterOptions((prev) => ({ ...prev, location }))
                    }
                  />
                </DialogContent>
              </Dialog>

              {/* Dates Filter */}
              <Dialog open={openDialog === "dates"} onOpenChange={(open) => {
                setOpenDialog(open ? "dates" : null);
              }}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className={cn(
                          "rounded-full bg-background/80 border-border/40 hover:bg-accent/60 px-3 sm:px-4",
                          (openDialog === "dates" || filterOptions.dateRange) &&
                            "bg-primary/20 border-primary/30"
                        )}
                        onClick={() => toggleDialog("dates")}
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
                    </DialogTrigger>
                  </TooltipTrigger>
                  <TooltipContent>{formatDateRange(filterOptions.dateRange) || "Select dates"}</TooltipContent>
                </Tooltip>
                <DialogContent className="sm:max-w-[425px]">
                  <DateFilter
                    onClose={() => setOpenDialog(null)}
                    selectedDate={filterOptions.dateRange}
                    setSelectedDate={(dateRange) =>
                      setFilterOptions((prev) => ({ ...prev, dateRange }))
                    }
                  />
                </DialogContent>
              </Dialog>

              {/* Group Size Filter */}
              <Dialog open={openDialog === "group"} onOpenChange={(open) => {
                setOpenDialog(open ? "group" : null);
              }}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className={cn(
                          "rounded-full bg-background/80 border-border/40 hover:bg-accent/60 px-3 sm:px-4",
                          (openDialog === "group" || filterOptions.groupSize !== 2) &&
                            "bg-primary/20 border-primary/30"
                        )}
                        onClick={() => toggleDialog("group")}
                      >
                        <Users className="h-3.5 w-3.5 mr-1" />
                        <span className="hidden xs:inline">
                          {filterOptions.groupSize}{" "}
                          {filterOptions.groupSize === 1 ? "Person" : "People"}
                        </span>
                      </Button>
                    </DialogTrigger>
                  </TooltipTrigger>
                  <TooltipContent>{filterOptions.groupSize} {filterOptions.groupSize === 1 ? "Person" : "People"}</TooltipContent>
                </Tooltip>
                <DialogContent className="sm:max-w-[425px]">
                  <GroupSizeFilter
                    onClose={() => setOpenDialog(null)}
                    groupSize={filterOptions.groupSize}
                    setGroupSize={(groupSize) =>
                      setFilterOptions((prev) => ({ ...prev, groupSize }))
                    }
                  />
                </DialogContent>
              </Dialog>

              {/* Budget Filter */}
              <Dialog open={openDialog === "budget"} onOpenChange={(open) => {
                setOpenDialog(open ? "budget" : null);
              }}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className={cn(
                          "rounded-full bg-background/80 border-border/40 hover:bg-accent/60 px-3 sm:px-4",
                          (openDialog === "budget" || filterOptions.budget) &&
                            "bg-primary/20 border-primary/30"
                        )}
                        onClick={() => toggleDialog("budget")}
                      >
                        <IndianRupee className="h-3.5 w-3.5 mr-1" />
                        <span className="hidden xs:inline">
                          {filterOptions.budget
                            ? filterOptions.budget.label
                            : "Budget"}
                        </span>
                        {filterOptions.budget && (
                          <Badge variant="secondary" className="ml-1 h-5 px-1.5">
                            <Check className="h-3 w-3" />
                          </Badge>
                        )}
                      </Button>
                    </DialogTrigger>
                  </TooltipTrigger>
                  <TooltipContent>{filterOptions.budget ? filterOptions.budget.label : "Select budget"}</TooltipContent>
                </Tooltip>
                <DialogContent className="sm:max-w-[425px]">
                  <BudgetFilter
                    onClose={() => setOpenDialog(null)}
                    selectedBudget={filterOptions.budget}
                    setSelectedBudget={(budget) =>
                      setFilterOptions((prev) => ({ ...prev, budget }))
                    }
                  />
                </DialogContent>
              </Dialog>

              {/* Travel Style Filter */}
              <Dialog open={openDialog === "style"} onOpenChange={(open) => {
                setOpenDialog(open ? "style" : null);
              }}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className={cn(
                          "rounded-full bg-background/80 border-border/40 hover:bg-accent/60 px-3 sm:px-4",
                          (openDialog === "style" ||
                            filterOptions.travelStyle.length > 0) &&
                            "bg-primary/20 border-primary/30"
                        )}
                        onClick={() => toggleDialog("style")}
                      >
                        <Compass className="h-3.5 w-3.5 mr-1" />
                        <span className="hidden xs:inline">
                          {filterOptions.travelStyle.length > 0
                            ? `${filterOptions.travelStyle.length} ${
                                filterOptions.travelStyle.length === 1
                                  ? "Style"
                                  : "Styles"
                              }`
                            : "Travel Style"}
                        </span>
                        {filterOptions.travelStyle.length > 0 && (
                          <Badge variant="secondary" className="ml-1 h-5 px-1.5">
                            {filterOptions.travelStyle.length}
                          </Badge>
                        )}
                      </Button>
                    </DialogTrigger>
                  </TooltipTrigger>
                  <TooltipContent>
                    {filterOptions.travelStyle.length 
                      ? `${filterOptions.travelStyle.length} travel ${filterOptions.travelStyle.length === 1 ? "style" : "styles"} selected`
                      : "Select travel styles"}
                  </TooltipContent>
                </Tooltip>
                <DialogContent className="sm:max-w-[425px]">
                  <TravelStyleFilter
                    onClose={() => setOpenDialog(null)}
                    selectedStyles={filterOptions.travelStyle}
                    setSelectedStyles={(styles) =>
                      setFilterOptions((prev) => ({
                        ...prev,
                        travelStyle: styles,
                      }))
                    }
                  />
                </DialogContent>
              </Dialog>
            </TooltipProvider>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-8 sm:mt-12 text-center"
        >
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-3">
            <Plane className="h-3.5 w-3.5 text-primary" />
            <span>Trending experiences</span>
          </div>
          <div className="flex flex-wrap gap-1.5 sm:gap-2 justify-center">
            {trendingExperiences.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.7 + index * 0.05 }}
              >
                <TrendingItem
                  icon={item.icon}
                  name={item.name}
                  onClick={() => setSearchQuery(item.name)}
                />
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="w-full mt-12 sm:mt-16 px-1 sm:px-4 md:px-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-medium">Featured Destinations</h2>
            <Button variant="ghost" size="sm" className="text-xs gap-1">
              <span>View all</span>
              <ArrowRight className="h-3 w-3" />
            </Button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {featuredDestinations.map((destination, index) => (
              <motion.div
                key={destination.name}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.9 + index * 0.1 }}
              >
                <DestinationCard
                  name={destination.name}
                  country={destination.country}
                  image={destination.image}
                  onClick={() => {
                    setSearchQuery(`${destination.name}, ${destination.country}`);
                    setFilterOptions(prev => ({
                      ...prev,
                      location: `${destination.name}, ${destination.country}`
                    }));
                    // Scroll to top
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                />
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="mt-10 sm:mt-14 flex items-center gap-2 py-2 px-4 rounded-full bg-background/90 border border-border/30 shadow-sm hover:bg-background/100 hover:shadow-md transition-all duration-300 cursor-pointer"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
        >
          <Sparkles className="h-4 w-4 text-primary" />
          <span className="text-sm">Powered by AI recommendations</span>
        </motion.div>
      </div>

      <WaveDecoration />
    </section>
  );
}