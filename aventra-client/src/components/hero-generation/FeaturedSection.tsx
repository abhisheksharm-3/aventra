import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DestinationCard } from "./destination-card";
import { featuredDestinations } from "@/lib/constants/hero";
import { useSearchStore } from "@/stores/searchStore";

export const FeaturedSection = () => {
  const { setSearchQuery, setFilterOptions } = useSearchStore();

  const handleDestinationClick = (name: string, country: string) => {
    setSearchQuery(`${name}, ${country}`);
    setFilterOptions({
      location: `${name}, ${country}`
    });
    // Scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.8 }}
      className="w-full mt-12 sm:mt-16 px-1 sm:px-4 md:px-8"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-medium">Featured Destinations</h2>
        <Button variant="ghost" size="sm" className="text-xs gap-1">
          <span>View all</span>
          <ArrowRight className="h-3 w-3" />
        </Button>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {featuredDestinations.map((destination, index) => (
          <motion.div
            key={destination.name}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.9 + index * 0.1 }}
          >
            <DestinationCard
              name={destination.name}
              country={destination.country}
              image={destination.image}
              onClick={() => handleDestinationClick(destination.name, destination.country)}
            />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};