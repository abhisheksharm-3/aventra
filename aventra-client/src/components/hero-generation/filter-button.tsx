import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FilterButtonProps } from "@/types/hero";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";

export const FilterButton: React.FC<FilterButtonProps> = ({ 
  icon, 
  label, 
  isSelected, 
  onClick,
  isLoading,
  count,
  badge,
  disabled,
  tooltipContent,
  className
}) => {
  const buttonContent = (
    <Button 
      variant="outline" 
      size="sm" 
      disabled={disabled || isLoading}
      className={cn(
        "rounded-full bg-background border-border/40 hover:bg-accent/80 hover:border-border/60 px-3 sm:px-4 h-9 transition-all duration-200",
        "active:scale-95",
        isSelected && "bg-primary/10 border-primary/30 hover:bg-primary/20 text-primary-foreground",
        disabled && "opacity-50 pointer-events-none",
        className
      )}
      onClick={onClick}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 mr-0 xs:mr-2 animate-spin" />
      ) : (
        <span className={cn("mr-0 xs:mr-1.5", badge && "relative")}>
          {icon}
          {badge && (
            <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground font-semibold">
              {badge}
            </span>
          )}
        </span>
      )}
      
      <span className={cn("hidden xs:inline", isLoading && "opacity-80")}>{label}</span>
      
      {count !== undefined && (
        <Badge 
          variant={isSelected ? "secondary" : "outline"} 
          className={cn(
            "ml-1.5 h-5 min-w-5 px-1 text-xs font-normal",
            isSelected && "bg-primary/20 text-primary"
          )}
        >
          {count}
        </Badge>
      )}
    </Button>
  );
  
  // If tooltip content is provided, wrap with tooltip
  if (tooltipContent && !disabled) {
    return (
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>
          {buttonContent}
        </TooltipTrigger>
        <TooltipContent className="text-xs">
          {tooltipContent || label}
        </TooltipContent>
      </Tooltip>
    );
  }
  
  return buttonContent;
};