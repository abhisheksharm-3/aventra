import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DestinationCard } from "./destination-card";
import { featuredDestinations } from "@/lib/constants/hero";
import { useSearchStore } from "@/stores/searchStore";
import { useCallback, useState } from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { FeaturedSectionProps } from "@/types/hero";

/**
 * FeaturedSection Component
 * 
 * Displays a section of featured travel destinations with animations and interactive cards.
 * Users can click on cards to search for the selected destination.
 * 
 * @component
 * @param {FeaturedSectionProps} props - Component props
 * @returns {JSX.Element} The rendered component
 */
export const FeaturedSection = ({ 
  className,
  maxItems = 6,
  viewAllLink = "/featured/destinations"
}: FeaturedSectionProps) => {
  const { setSearchQuery, setFilterOptions } = useSearchStore();
  const [isHovering, setIsHovering] = useState<string | null>(null);
  const [isGridView, setIsGridView] = useState(true);
  
  // Display limited items or all based on maxItems
  const displayDestinations = featuredDestinations.slice(0, maxItems);
  const hasMoreDestinations = featuredDestinations.length > maxItems;
  
  /**
   * Handle clicking on a destination card
   * @param {string} name - Destination name
   * @param {string} country - Destination country
   */
  const handleDestinationClick = useCallback((name: string, country: string) => {
    setSearchQuery(`${name}, ${country}`);
    setFilterOptions({
      location: `${name}, ${country}`
    });
    // Scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [setSearchQuery, setFilterOptions]);

  /**
   * Handle View All button click
   */
  const handleViewAllClick = useCallback(() => {
    window.location.href = viewAllLink;
  }, [viewAllLink]);

  /**
   * Toggle between grid and list view
   */
  const toggleViewMode = useCallback(() => {
    setIsGridView(prev => !prev);
  }, []);

  // Animation variants for container
  const containerVariants = {
    hidden: { opacity: 0 },
    show: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };

  // Animation variants for items
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.8 }}
      className={cn(
        "w-full mt-12 sm:mt-16 px-1 sm:px-4 md:px-8",
        className
      )}
      aria-labelledby="featured-destinations-heading"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 
          id="featured-destinations-heading" 
          className="text-lg font-medium flex items-center gap-2"
        >
          <MapPin className="h-4 w-4 text-primary" aria-hidden="true" />
          Featured Destinations
          <Badge 
            variant="outline" 
            className="ml-2 text-xs font-normal text-muted-foreground"
          >
            {featuredDestinations.length}
          </Badge>
        </h2>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="outline"
            size="icon"
            className="h-8 w-8 rounded-full hidden sm:flex"
            onClick={toggleViewMode}
            aria-label={isGridView ? "Switch to list view" : "Switch to grid view"}
            title={isGridView ? "Switch to list view" : "Switch to grid view"}
          >
            {isGridView ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7"></rect>
                <rect x="14" y="3" width="7" height="7"></rect>
                <rect x="3" y="14" width="7" height="7"></rect>
                <rect x="14" y="14" width="7" height="7"></rect>
              </svg>
            )}
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-xs gap-1 text-primary hover:text-primary"
            onClick={handleViewAllClick}
            onMouseEnter={() => setIsHovering('viewAll')}
            onMouseLeave={() => setIsHovering(null)}
            aria-label="View all destinations"
          >
            <span>View all</span>
            <motion.span
              animate={{ x: isHovering === 'viewAll' ? 3 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ArrowRight className="h-3.5 w-3.5" />
            </motion.span>
          </Button>
        </div>
      </div>
      
      <AnimatePresence mode="wait">
        <motion.div 
          key={isGridView ? 'grid' : 'list'}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          variants={containerVariants}
          className={cn(
            isGridView ? 
              "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4" : 
              "flex flex-col space-y-3"
          )}
        >
          {displayDestinations.map((destination) => (
            <motion.div
              key={destination.name}
              variants={itemVariants}
              className={cn(
                !isGridView && "border rounded-lg overflow-hidden"
              )}
              onMouseEnter={() => setIsHovering(destination.name)}
              onMouseLeave={() => setIsHovering(null)}
            >
              <DestinationCard
                name={destination.name}
                country={destination.country}
                image={destination.image}
                onClick={() => handleDestinationClick(destination.name, destination.country)}
                aria-label={`Visit ${destination.name}, ${destination.country}`}
              />
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
      
      {hasMoreDestinations && (
        <motion.div 
          className="mt-6 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
        >
          <Button 
            variant="outline" 
            onClick={handleViewAllClick}
            className="rounded-full text-sm"
          >
            Explore all {featuredDestinations.length} destinations
          </Button>
          <p className="text-xs text-muted-foreground mt-2">
            Find the perfect destination for your next adventure
          </p>
        </motion.div>
      )}
    </motion.section>
  );
};