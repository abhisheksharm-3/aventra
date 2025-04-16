import { useState } from "react";
import { X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { GlobalFilterProps } from "@/types/hero";
import { regions } from "@/lib/constants/hero";

export const GlobalFilter: React.FC<GlobalFilterProps> = ({ onClose, selectedRegions, setSelectedRegions }) => {
  const [localSelectedRegions, setLocalSelectedRegions] = useState(
    selectedRegions || []
  );
  
  const toggleRegion = (id: string) => {
    setLocalSelectedRegions(prev => 
      prev.includes(id) 
        ? prev.filter(r => r !== id) 
        : [...prev, id]
    );
  };
  
  return (
    <div className="w-[240px] p-3">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-medium">Regions</h3>
        <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <RadioGroup 
        className="space-y-2"
        value={localSelectedRegions.length === 0 ? "anywhere" : "specific"}
        onValueChange={(value) => {
          if (value === "anywhere") {
            setLocalSelectedRegions([]);
          }
        }}
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="anywhere" id="anywhere" />
          <Label htmlFor="anywhere">Anywhere</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="specific" id="specific" />
          <Label htmlFor="specific">Specific regions</Label>
        </div>
      </RadioGroup>
      
      <div className={cn(
        "mt-3 space-y-2 transition-opacity",
        localSelectedRegions.length === 0 ? "opacity-50 pointer-events-none" : "opacity-100"
      )}>
        {regions.map(region => (
          <div 
            key={region.id}
            className="flex items-center py-1"
          >
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "justify-start w-full px-2 py-1 h-auto text-sm font-normal rounded-md",
                localSelectedRegions.includes(region.id) && "bg-primary/10 text-primary font-medium"
              )}
              onClick={() => toggleRegion(region.id)}
            >
              {localSelectedRegions.includes(region.id) && (
                <Check className="h-3.5 w-3.5 mr-2" />
              )}
              {region.label}
            </Button>
          </div>
        ))}
      </div>
      
      <div className="flex justify-between mt-4">
        <Button variant="ghost" size="sm" onClick={onClose}>
          Cancel
        </Button>
        <Button 
          size="sm"
          onClick={() => {
            setSelectedRegions(localSelectedRegions);
            onClose();
          }}
        >
          Apply
        </Button>
      </div>
    </div>
  );
};