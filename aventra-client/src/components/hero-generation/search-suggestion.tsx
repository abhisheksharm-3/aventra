import { SearchSuggestionProps } from "@/types/hero";
import { Search, History, Sparkles } from "lucide-react";

export const SearchSuggestion = ({
  suggestion,
  onClick,
  isRecent,
  isAutocomplete
}: SearchSuggestionProps) => {
  return (
    <div
      className="flex items-center px-3 py-1.5 hover:bg-accent/60 rounded-md cursor-pointer"
      onClick={onClick}
    >
      {isRecent && <History className="h-3.5 w-3.5 mr-2 text-muted-foreground" />}
      {isAutocomplete && <Sparkles className="h-3.5 w-3.5 mr-2 text-primary" />}
      {!isRecent && !isAutocomplete && <Search className="h-3.5 w-3.5 mr-2 text-muted-foreground" />}
      <span className="text-sm">{suggestion}</span>
    </div>
  );
};