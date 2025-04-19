import { Button } from "@/components/ui/button";
import { TrendingItemProps } from "@/types/hero";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

/**
 * TrendingItem Component
 * 
 * A button component that displays a trending search item with an icon.
 * Used primarily within the TrendingSection component.
 * 
 * @component
 * @param {TrendingItemProps} props - Component props
 * @param {React.ReactNode} props.icon - The emoji or icon to display
 * @param {string} props.name - The name of the trending item
 * @param {function} props.onClick - Function to call when the item is clicked
 * @param {React.Ref<HTMLButtonElement>} ref - Forwarded ref
 * @returns {JSX.Element} The rendered component
 */
export const TrendingItem = forwardRef<HTMLButtonElement, TrendingItemProps>(
  ({ icon, name, onClick, className, ...props }, ref) => (
    <Button 
      ref={ref}
      variant="ghost" 
      size="sm" 
      className={cn(
        "rounded-full hover:bg-accent/60 text-sm flex items-center gap-1 transition-all",
        "active:scale-95 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary/50",
        className
      )}
      onClick={onClick}
      {...props}
    >
      <span className="text-base mr-0.5" aria-hidden="true">{icon}</span>
      <span className="truncate">{name}</span>
    </Button>
  )
);

TrendingItem.displayName = "TrendingItem";