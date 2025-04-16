import { useState } from "react";
import { X, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { GroupSizeFilterProps } from "@/types/hero";

export const GroupSizeFilter: React.FC<GroupSizeFilterProps> = ({ onClose, groupSize, setGroupSize }) => {
  const [localGroupSize, setLocalGroupSize] = useState(groupSize || 2);

  return (
    <div className="w-[250px] p-3">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-medium">Group Size</h3>
        <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="flex items-center justify-between mb-6">
        <Button 
          variant="outline" 
          size="icon" 
          className="h-8 w-8 rounded-full"
          onClick={() => setLocalGroupSize(Math.max(1, localGroupSize - 1))}
          disabled={localGroupSize <= 1}
        >
          <Minus className="h-3.5 w-3.5" />
        </Button>
        <div className="text-center">
          <span className="text-2xl font-medium">{localGroupSize}</span>
          <p className="text-xs text-muted-foreground">Travelers</p>
        </div>
        <Button 
          variant="outline" 
          size="icon" 
          className="h-8 w-8 rounded-full"
          onClick={() => setLocalGroupSize(Math.min(16, localGroupSize + 1))}
          disabled={localGroupSize >= 16}
        >
          <Plus className="h-3.5 w-3.5" />
        </Button>
      </div>
      
      <div className="space-y-4">
        <div>
          <Label className="text-xs text-muted-foreground mb-1 block">
            Group size: {localGroupSize} {localGroupSize === 1 ? 'person' : 'people'}
          </Label>
          <Slider
            value={[localGroupSize]}
            min={1}
            max={16}
            step={1}
            onValueChange={(value) => setLocalGroupSize(value[0])}
            className="py-2"
          />
        </div>
        
        <div className="flex justify-between">
          <Button variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            size="sm"
            onClick={() => {
              setGroupSize(localGroupSize);
              onClose();
            }}
          >
            Apply
          </Button>
        </div>
      </div>
    </div>
  );
};