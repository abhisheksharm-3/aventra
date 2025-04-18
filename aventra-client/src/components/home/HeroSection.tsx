"use client";

import { FormEvent } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { Background, WaveDecoration } from "../common/hero-bg";
import { useSearchStore } from "@/stores/searchStore";
import { useSearchQuery } from "@/hooks/useSearchQuery";
import { Headline } from "../hero-generation/headline";
import { SearchBar } from "../hero-generation/SearchBar";
import { FilterBar } from "../hero-generation/FilterBar";
import { TrendingSection } from "../hero-generation/TrendingSection";
import { FeaturedSection } from "../hero-generation/FeaturedSection";
import { useRecentSearches } from "@/hooks/useRecentSearches";

export default function HeroSection() {
  const { searchQuery, filterOptions, setIsGenerating } = useSearchStore();
  const { saveSearch } = useRecentSearches();
  const { mutate: generateItinerary } = useSearchQuery();

  const handleSearch = async (e: FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);

    // Save the search to recent searches
    saveSearch(searchQuery);

    // Call the mutation with search parameters
    generateItinerary(
      {
        query: searchQuery,
        filters: filterOptions,
      },
      {
        onSettled: () => {
          setIsGenerating(false);
        },
      }
    );
  };

  return (
    <section className="relative w-full min-h-[90vh] flex flex-col items-center justify-center pt-16 pb-24 overflow-hidden">
      <Background />

      <div className="container px-4 sm:px-6 mx-auto flex flex-col items-center max-w-4xl">
        <Headline />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="w-full max-w-3xl relative z-10"
        >
          <form
            onSubmit={handleSearch}
            className="relative group"
            aria-label="Generate travel itinerary"
          >
            <SearchBar />
            <FilterBar />
          </form>
        </motion.div>

        <TrendingSection />
        <FeaturedSection />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="mt-10 sm:mt-14 flex items-center gap-2 py-2 px-4 rounded-full bg-background/90 border border-border/30 shadow-sm hover:bg-background/100 hover:shadow-md transition-all duration-300 cursor-pointer"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
        >
          <Sparkles className="h-4 w-4 text-primary" />
          <span className="text-sm">Powered by AI recommendations</span>
        </motion.div>
      </div>

      <WaveDecoration />
    </section>
  );
}