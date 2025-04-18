import { useState, useRef, useEffect } from "react";
import { Search, Sparkles, History, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchStore } from "@/stores/searchStore";
import { useRecentSearches } from "@/hooks/useRecentSearches";
import { SearchSuggestion } from "./search-suggestion";

export const SearchBar = () => {
  const { searchQuery, isGenerating, setSearchQuery } = useSearchStore();
  const { recentSearches, removeSearch } = useRecentSearches();
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [showRecentSearches, setShowRecentSearches] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Dynamic search suggestions
  const suggestions = !searchQuery ? [] : [
    `${searchQuery} in Europe`,
    `Best ${searchQuery} adventures`,
    `${searchQuery} for beginners`,
    `Affordable ${searchQuery} experiences`,
    ...recentSearches
      .filter(recent => 
        recent.toLowerCase().includes(searchQuery.toLowerCase()) &&
        recent.toLowerCase() !== searchQuery.toLowerCase()
      )
      .slice(0, 2)
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | Event) => {
      if (
        inputRef.current &&
        event.target instanceof Node &&
        !inputRef.current.contains(event.target)
      ) {
        setIsFocused(false);
        setShowRecentSearches(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputFocus = () => {
    setIsFocused(true);
    if (!searchQuery) {
      setShowRecentSearches(true);
    } else {
      setShowRecentSearches(false);
    }
  };

  return (
    <div className="relative w-full">
      <div className="relative group">
        <div className="relative flex items-center rounded-xl overflow-hidden shadow-xl">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-background to-background/90 backdrop-blur-md" />
          <div className="relative w-full flex bg-transparent">
            <div className="p-4 pl-5 text-muted-foreground">
              {isFocused ? (
                <motion.div
                  initial={{ scale: 1 }}
                  animate={{ scale: 1.1 }}
                  transition={{ duration: 0.2 }}
                >
                  <Search className="h-5 w-5 text-primary" />
                </motion.div>
              ) : (
                <Search className="h-5 w-5" />
              )}
            </div>
            <Input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowRecentSearches(false);
              }}
              onFocus={handleInputFocus}
              placeholder="Where would you like to go?"
              className="flex-1 h-14 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-base"
              aria-label="Search destinations"
              aria-expanded={isFocused}
            />
            <div className="flex items-center">
              <div className="h-6 w-px bg-border/40 mx-1 hidden sm:block"></div>
              <Button
                type="submit"
                size="sm"
                className="m-1.5 h-11 px-3 sm:px-4 rounded-lg text-sm font-medium gap-1.5 group-hover:bg-primary/90 transition-all"
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="h-3.5 w-3.5 opacity-70" />
                )}
                <span className="hidden xs:inline">
                  {isGenerating ? "Generating..." : "Plan Trip"}
                </span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isFocused && suggestions.length > 0 && !showRecentSearches && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute z-20 w-full mt-2 rounded-xl overflow-hidden shadow-lg border border-border/30 bg-background/95 backdrop-blur-md"
          >
            <div className="p-1">
              {suggestions.map((suggestion, index) => (
                <SearchSuggestion
                  key={index}
                  suggestion={suggestion}
                  onClick={() => {
                    setSearchQuery(suggestion);
                    setIsFocused(false);
                    setShowRecentSearches(false);
                  }}
                  isRecent={recentSearches.includes(suggestion)}
                />
              ))}
            </div>
          </motion.div>
        )}

        {showRecentSearches && recentSearches.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute z-20 w-full mt-2 rounded-xl overflow-hidden shadow-lg border border-border/30 bg-background/95 backdrop-blur-md"
          >
            <div className="p-2">
              <div className="flex items-center justify-between pb-2 mb-1 border-b">
                <div className="flex items-center">
                  <History className="h-3.5 w-3.5 text-muted-foreground mr-2" />
                  <span className="text-sm font-medium">Recent searches</span>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-6 text-xs"
                  onClick={() => useSearchStore.getState().clearRecentSearches()}
                >
                  Clear all
                </Button>
              </div>
              {recentSearches.slice(0, 5).map((search, index) => (
                <div key={index} className="relative group">
                  <SearchSuggestion
                    suggestion={search}
                    onClick={() => {
                      setSearchQuery(search);
                      setIsFocused(false);
                      setShowRecentSearches(false);
                    }}
                    isRecent={true}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 h-6 w-6 p-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeSearch(search);
                    }}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};