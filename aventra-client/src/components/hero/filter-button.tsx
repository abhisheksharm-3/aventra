import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FilterButtonProps } from "@/types/hero";

export const FilterButton: React.FC<FilterButtonProps> = ({ icon, label, isSelected, onClick }) => (
  <Button 
    variant="outline" 
    size="sm" 
    className={cn(
      "rounded-full bg-background/80 border-border/40 hover:bg-accent/60 px-3 sm:px-4",
      isSelected && "bg-primary/20 border-primary/30"
    )}
    onClick={onClick}
  >
    <span className="mr-1">{icon}</span>
    <span className="hidden xs:inline">{label}</span>
  </Button>
);