import { SearchSuggestionProps } from "@/types/hero";
import { Search, History } from "lucide-react";

export const SearchSuggestion: React.FC<SearchSuggestionProps> = ({ 
  suggestion, 
  onClick,
  isRecent = false 
}) => (
  <button
    className="flex items-center w-full px-4 py-2.5 text-left rounded-lg hover:bg-primary/10 transition-colors"
    onClick={onClick}
  >
    {isRecent ? (
      <History className="h-4 w-4 mr-2 text-muted-foreground flex-shrink-0" />
    ) : (
      <Search className="h-4 w-4 mr-2 text-muted-foreground flex-shrink-0" />
    )}
    <span className="truncate">{suggestion}</span>
  </button>
);