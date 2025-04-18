"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { MapPin, Search, X, Check, Globe, History } from "lucide-react";
import { Command, CommandList, CommandGroup, CommandItem } from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LocationFilterProps } from "@/types/hero";
import { popularLocations, locationsByRegion } from "@/lib/constants/hero";
import { DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

export const LocationFilter: React.FC<LocationFilterProps> = ({ 
  onClose, 
  selectedLocation, 
  setSelectedLocation,
  recentSearches = ["Bali, Indonesia", "Kyoto, Japan"] 
}) => {
  const [searchValue, setSearchValue] = useState("");
  const [localRecents, setLocalRecents] = useState(recentSearches);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("popular");
  const [tempSelection, setTempSelection] = useState<string | null>(selectedLocation);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Focus input on mount for immediate search
  useEffect(() => {
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  }, []);
  
  // Filter locations by search value
  const filteredLocations = useMemo(() => {
    if (!searchValue.trim()) return [];
    
    return popularLocations.filter(
      location => location.toLowerCase().includes(searchValue.toLowerCase())
    );
  }, [searchValue]);
  
  // Handle adding to recent searches
  const handleLocationSelect = (location: string) => {
    setTempSelection(location);
    if (activeTab === "search" && !localRecents.includes(location)) {
      setLocalRecents(prev => [location, ...prev.slice(0, 4)]);
    }
  };
  
  // Clear all recent searches
  const clearRecentSearches = () => {
    setLocalRecents([]);
  };
  
  // Apply selected location
  const handleApply = () => {
    if (tempSelection) {
      setSelectedLocation(tempSelection);
    }
    onClose();
  };
  
  // Get location icon based on region
  const getRegionIcon = (region: string) => {
    switch (region) {
      case "Europe":
        return "🇪🇺";
      case "Asia":
        return "🌏";
      case "Americas":
        return "🌎";
      case "Middle East & Africa":
        return "🌍";
      case "Oceania":
        return "🏝️";
      default:
        return "🌐";
    }
  };

  return (
    <div className="flex flex-col space-y-4">
      <DialogHeader className="space-y-1 px-1">
        <DialogTitle className="flex items-center gap-2 text-foreground">
          <Globe className="h-4 w-4 text-primary" />
          Location
        </DialogTitle>
      </DialogHeader>
      
      {/* Summary view of selected location */}
      {tempSelection && (
        <div className="bg-muted/20 rounded-lg p-3">
          <div className="flex justify-between items-center">
            <div className="overflow-hidden">
              <div className="text-xs text-muted-foreground">Selected destination</div>
              <div className="text-base font-medium truncate flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-primary" />
                {tempSelection}
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-7 w-7 p-0 rounded-full hover:bg-muted/50"
              onClick={() => setTempSelection(null)}
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      )}
      
      {/* Tab navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 h-9">
          <TabsTrigger value="popular">Popular</TabsTrigger>
          <TabsTrigger value="regions">By Region</TabsTrigger>
          <TabsTrigger value="search">Search</TabsTrigger>
        </TabsList>
        
        {/* Popular destinations tab */}
        <TabsContent value="popular" className="mt-2 space-y-4">
          <div className="grid grid-cols-2 gap-2">
            {popularLocations.slice(0, 6).map(location => (
              <Button
                key={location}
                variant={tempSelection === location ? "default" : "outline"}
                className={`w-full justify-start text-sm h-auto py-2 pl-2.5 pr-3 ${
                  tempSelection === location 
                    ? "bg-primary text-primary-foreground" 
                    : "bg-background hover:bg-accent hover:text-accent-foreground"
                }`}
                onClick={() => handleLocationSelect(location)}
              >
                <MapPin className={`h-3.5 w-3.5 mr-2 ${tempSelection === location ? "text-primary-foreground" : "text-muted-foreground"}`} />
                <span className="truncate">{location}</span>
                {tempSelection === location && <Check className="h-4 w-4 ml-auto shrink-0" />}
              </Button>
            ))}
          </div>
          
          <div className="pt-2">
            <h4 className="text-sm font-medium mb-2">More destinations</h4>
            <ScrollArea className="h-[180px]">
              <Command>
                <CommandList>
                  <CommandGroup>
                    {popularLocations.slice(6).map(location => (
                      <CommandItem
                        key={location}
                        onSelect={() => handleLocationSelect(location)}
                        className={`flex items-center gap-2 py-2 ${tempSelection === location ? 'bg-accent text-accent-foreground' : ''}`}
                      >
                        <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                        <span>{location}</span>
                        {tempSelection === location && (
                          <Check className="h-4 w-4 ml-auto text-primary" />
                        )}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </ScrollArea>
          </div>
        </TabsContent>
        
        {/* Regions tab */}
        <TabsContent value="regions" className="mt-2 space-y-1">
          <ScrollArea className="h-[320px] pr-3">
            {Object.entries(locationsByRegion).map(([region, locations]) => (
              <div key={region} className="mb-3">
                <div className="flex items-center gap-2 mb-2">
                  <div className="text-base">{getRegionIcon(region)}</div>
                  <h3 className="font-medium text-sm">{region}</h3>
                </div>
                <div className="pl-6 space-y-1 border-l-2 border-muted">
                  {locations.map(location => (
                    <div
                      key={location}
                      onClick={() => handleLocationSelect(location)}
                      className={`flex items-center gap-2 py-1.5 px-2 rounded-md cursor-pointer text-sm ${
                        tempSelection === location 
                          ? 'bg-primary/10 text-primary font-medium' 
                          : 'hover:bg-accent'
                      }`}
                    >
                      <MapPin className={`h-3.5 w-3.5 ${tempSelection === location ? 'text-primary' : 'text-muted-foreground'}`} />
                      <span>{location}</span>
                      {tempSelection === location && (
                        <Check className="h-4 w-4 ml-auto text-primary" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </ScrollArea>
        </TabsContent>
        
        {/* Search tab */}
        <TabsContent value="search" className="mt-2 space-y-4">
          <div className={`relative rounded-md border ${isSearchFocused ? 'ring-2 ring-ring ring-offset-1' : ''} transition-all duration-200`}>
            <div className="absolute left-2.5 top-2.5 text-muted-foreground">
              <Search className="h-4 w-4" />
            </div>
            
            <Input
              ref={inputRef}
              placeholder="Search destinations..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="h-10 pl-9"
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
            />
          </div>
          
          {searchValue.trim() !== "" && (
            <div className="border rounded-md overflow-hidden">
              <div className="py-1.5 px-3 border-b bg-muted/20 flex items-center justify-between">
                <span className="text-sm font-medium">Search results</span>
                <Badge variant="outline" className="text-xs">
                  {filteredLocations.length} found
                </Badge>
              </div>
              
              <ScrollArea className="h-[200px]">
                {filteredLocations.length === 0 ? (
                  <div className="p-8 text-center">
                    <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-muted mb-3">
                      <MapPin className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <p className="text-sm font-medium text-foreground">No destinations found</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Try a different search term
                    </p>
                  </div>
                ) : (
                  <Command>
                    <CommandList>
                      <CommandGroup>
                        {filteredLocations.map(location => (
                          <CommandItem
                            key={location}
                            onSelect={() => handleLocationSelect(location)}
                            className={`flex items-center gap-2 py-2.5 ${tempSelection === location ? 'bg-accent' : ''}`}
                          >
                            <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                            <span>{location}</span>
                            {tempSelection === location && (
                              <Check className="h-4 w-4 ml-auto text-primary" />
                            )}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                )}
              </ScrollArea>
            </div>
          )}
          
          {/* Recent searches */}
          {localRecents.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <History className="h-3.5 w-3.5 text-muted-foreground" />
                  <h4 className="text-sm font-medium text-muted-foreground">Recent searches</h4>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-6 w-6 p-0" 
                  onClick={clearRecentSearches}
                >
                  <X className="h-3.5 w-3.5 text-muted-foreground" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {localRecents.map(loc => (
                  <Badge 
                    key={loc} 
                    variant={tempSelection === loc ? "default" : "outline"}
                    className="cursor-pointer hover:bg-accent transition-colors py-1.5"
                    onClick={() => handleLocationSelect(loc)}
                  >
                    <MapPin className="h-3 w-3 mr-1 inline-block" />
                    {loc}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          
          <div className="text-xs text-muted-foreground mt-2">
            Can&apos;t find what you&apos;re looking for? Try typing the full name of the city or country.
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Helper text */}
      <div className="text-xs text-muted-foreground mt-2">
        {!tempSelection 
          ? "Select a destination for your trip" 
          : "Click Apply to confirm your selection"}
      </div>
      
      <DialogFooter className="flex justify-between gap-4 pt-3 border-t">
        <Button 
          type="button"
          variant="outline" 
          size="sm"
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button 
          type="submit"
          size="sm"
          className="gap-1.5 px-5"
          disabled={!tempSelection}
          onClick={handleApply}
        >
          <Check className="h-3.5 w-3.5" />
          Apply
        </Button>
      </DialogFooter>
    </div>
  );
};