import { X, MapPin, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { LocationFilterProps } from "@/types/hero";
import { popularLocations } from "@/lib/constants/hero";

export const LocationFilter: React.FC<LocationFilterProps> = ({ onClose, selectedLocation, setSelectedLocation }) => {
  const [searchValue, setSearchValue] = useState("");
  
  const filteredLocations = popularLocations.filter(
    location => location.toLowerCase().includes(searchValue.toLowerCase())
  );
  
  return (
    <div className="w-[280px] p-0">
      <div className="border-b p-3">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-medium">Location</h3>
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <Command className="rounded-lg border">
          <CommandInput 
            placeholder="Search cities..." 
            value={searchValue}
            onValueChange={setSearchValue}
            className="h-9"
          />
          <CommandList>
            <CommandEmpty>No locations found</CommandEmpty>
            <CommandGroup heading="Popular destinations">
              {filteredLocations.map(location => (
                <CommandItem 
                  key={location}
                  onSelect={() => {
                    setSelectedLocation(location);
                    onClose();
                  }}
                  className="flex items-center gap-2 py-2"
                >
                  <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>{location}</span>
                  {selectedLocation === location && (
                    <Check className="h-4 w-4 ml-auto text-primary" />
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </div>
      
      <div className="p-3">
        <h4 className="text-sm text-muted-foreground mb-2">Recent searches</h4>
        <div className="flex flex-wrap gap-1">
          {["Bali, Indonesia", "Kyoto, Japan"].map(loc => (
            <Badge 
              key={loc} 
              variant="outline"
              className="cursor-pointer hover:bg-accent"
              onClick={() => {
                setSelectedLocation(loc);
                onClose();
              }}
            >
              {loc}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
};