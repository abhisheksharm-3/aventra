"use client";

import { motion } from "framer-motion";
import { Search, Loader2 } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useOnboardingStore } from "@/stores/useOnboardingStore";
//TODO: Implement it again
function useLocationSuggestions(
  inputValue: string,
  { locationType, maxResults }: { locationType: string; maxResults: number }
) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Don't fetch suggestions for short inputs
    if (!inputValue || inputValue.length < 2) {
      setSuggestions([]);
      setLoading(false);
      setError(null);
      return;
    }

    const controller = new AbortController();
    const signal = controller.signal;

    const fetchSuggestions = async () => {
      setLoading(true);
      setError(null);

      try {
        // Simulate API call to a location service
        // In a real app, replace this with actual API call to Google Places, Mapbox, etc.
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Mock data based on input
        const mockCities = [
          "New York",
          "London",
          "Tokyo",
          "Paris",
          "Sydney",
          "Berlin",
          "Mumbai",
          "Singapore",
          "Los Angeles",
          "Toronto",
          "Barcelona",
          "Dubai",
          "Hong Kong",
          "San Francisco",
          "Seattle",
          "Chicago",
          "Amsterdam",
          "Melbourne",
          "Rome",
          "Madrid",
          "Lisbon",
        ];

        const filteredCities = mockCities
          .filter((city) =>
            city.toLowerCase().includes(inputValue.toLowerCase())
          )
          .slice(0, maxResults);

        if (!signal.aborted) {
          setSuggestions(filteredCities);
          setLoading(false);
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        if (!signal.aborted) {
          setError("Failed to fetch location suggestions");
          setLoading(false);
        }
      }
    };

    fetchSuggestions();

    return () => {
      controller.abort();
    };
  }, [inputValue, locationType, maxResults]);

  return { suggestions, loading, error };
}
/**
 * @component StepBaseCity
 * @description Minimal component for collecting user's home city during onboarding
 * with enhanced location suggestion functionality for residential locations
 *
 * @returns {JSX.Element} The rendered base city component
 */
export function StepBaseCity() {
  const { preferences, setBaseCity } = useOnboardingStore();
  const [inputValue, setInputValue] = useState(preferences.baseCity || "");
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  // Add a ref to track suggestion selection to prevent race conditions
  const selectionMadeRef = useRef(false);

  // Get location suggestions using the enhanced hook with residential type
  const { suggestions, loading, error } = useLocationSuggestions(inputValue, {
    locationType: "residential", // Focus on cities people live in
    maxResults: 6,
  });

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    selectionMadeRef.current = false; // Reset selection flag when typing
  };

  // Handle suggestion selection
  const handleSelectSuggestion = (city: string) => {
    setInputValue(city);
    setBaseCity(city);
    selectionMadeRef.current = true; // Set the flag to prevent onBlur overriding
    setIsFocused(false);
    inputRef.current?.blur();
  };

  // Popular cities for quick selection
  const popularCities = [
    "New York",
    "London",
    "Tokyo",
    "Paris",
    "Sydney",
    "Berlin",
    "Mumbai",
    "Singapore",
  ];

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsFocused(false);
        // Only update if a suggestion wasn't just selected
        if (!selectionMadeRef.current) {
          setBaseCity(inputValue);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [inputValue, setBaseCity]);

  // Update input value when preferences change (e.g., coming back to this step)
  useEffect(() => {
    if (preferences.baseCity && preferences.baseCity !== inputValue) {
      setInputValue(preferences.baseCity);
    }
  }, [preferences.baseCity]);

  return (
    <motion.div
      key="base-city"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-5"
    >
      {/* Header section */}
      <div className="text-center mb-4">
        <h2 className="text-2xl font-medium mb-2">Where are you based?</h2>
        <p className="text-muted-foreground text-sm">
          Enter your home city to help us suggest relevant destinations
        </p>
      </div>

      {/* City input section */}
      <div className="space-y-4">
        <div>
          <Label
            htmlFor="city-input"
            className="text-sm font-medium mb-1.5 block"
          >
            Your home city
          </Label>

          {/* City search input with suggestions */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="city-input"
              ref={inputRef}
              value={inputValue}
              onChange={handleInputChange}
              onFocus={() => setIsFocused(true)}
              onBlur={() => {
                // Small delay to allow click on suggestion
                setTimeout(() => {
                  if (inputRef.current !== document.activeElement) {
                    // Only update if a suggestion wasn't just selected
                    if (!selectionMadeRef.current) {
                      setBaseCity(inputValue);
                    }
                    // Reset the flag after handling the blur
                    selectionMadeRef.current = false;
                  }
                }, 150);
              }}
              placeholder="Enter your city"
              className="pl-10"
            />

            {/* Loading indicator */}
            {loading && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              </div>
            )}

            {/* Location suggestions dropdown */}
            {isFocused && inputValue.length >= 2 && (
              <motion.div
                ref={suggestionsRef}
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="absolute z-10 mt-1 w-full bg-card border border-border rounded-md shadow-sm overflow-hidden"
              >
                {loading ? (
                  <div className="p-2 text-center text-sm text-muted-foreground">
                    Loading suggestions...
                  </div>
                ) : error ? (
                  <div className="p-2 text-center text-sm text-destructive">
                    {error}
                  </div>
                ) : suggestions.length > 0 ? (
                  <div className="max-h-60 overflow-auto py-1">
                    {suggestions.map((city) => (
                      <button
                        key={city}
                        type="button"
                        onClick={() => handleSelectSuggestion(city)}
                        className="w-full text-left px-3 py-2 text-sm hover:bg-muted/50 focus:bg-muted/50 focus:outline-none transition-colors"
                      >
                        {city}
                      </button>
                    ))}
                  </div>
                ) : inputValue.length >= 2 ? (
                  <div className="p-2 text-center text-sm text-muted-foreground">
                    No matches found
                  </div>
                ) : null}
              </motion.div>
            )}
          </div>
        </div>

        {/* Popular cities */}
        <div>
          <div className="text-xs text-muted-foreground mb-2">
            Popular cities:
          </div>
          <div className="flex flex-wrap gap-2">
            {popularCities.map((city) => (
              <button
                key={city}
                type="button"
                onClick={() => {
                  setInputValue(city);
                  setBaseCity(city);
                  selectionMadeRef.current = true; // Mark as selected to prevent overriding
                }}
                className={`px-3 py-1 text-xs rounded-md transition-colors ${
                  inputValue === city
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted hover:bg-muted-foreground/10"
                }`}
              >
                {city}
              </button>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
