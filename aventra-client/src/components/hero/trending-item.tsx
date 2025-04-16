import { Button } from "@/components/ui/button";
import { TrendingItemProps } from "@/types/hero";

export const TrendingItem: React.FC<TrendingItemProps> = ({ icon, name, onClick }) => (
  <Button 
    variant="ghost" 
    size="sm" 
    className="rounded-full hover:bg-accent/60 text-sm flex items-center gap-1"
    onClick={onClick}
  >
    <span className="text-base mr-0.5">{icon}</span>
    <span className="truncate">{name}</span>
  </Button>
);