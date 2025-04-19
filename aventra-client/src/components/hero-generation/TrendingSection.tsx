import { motion } from "framer-motion";
import { Plane, ArrowRight } from "lucide-react";
import { TrendingItem } from "./trending-item";
import { trendingExperiences } from "@/lib/constants/hero";
import { useSearchStore } from "@/stores/searchStore";
import { useCallback, memo } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { TrendingSectionProps } from "@/types/hero";

/**
 * Interface for Trending Section component props
 * @interface TrendingSectionProps
 * @property {string} [className] - Optional CSS class to apply to the component
 * @property {boolean} [compact=false] - Whether to display in compact mode
 * @property {number} [maxItems] - Maximum number of items to display
 */

/**
 * TrendingSection component
 * 
 * Displays a section of trending travel experiences with animation effects.
 * Each experience can be clicked to set it as the search query.
 * 
 * @component
 * @param {TrendingSectionProps} props - Component props
 * @returns {JSX.Element} The rendered component
 */
export const TrendingSection = memo(({ 
  className,
  compact = false,
  maxItems = trendingExperiences.length 
}: TrendingSectionProps) => {
  const { setSearchQuery, addRecentSearch } = useSearchStore();

  // Display only up to maxItems
  const displayedExperiences = trendingExperiences.slice(0, maxItems);
  const hasMoreItems = trendingExperiences.length > maxItems;

  /**
   * Handle clicking on a trending experience
   * @param {string} query - The search query to set
   */
  const handleExperienceClick = useCallback((query: string) => {
    setSearchQuery(query);
    addRecentSearch(query);
  }, [setSearchQuery, addRecentSearch]);

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.6 }}
      className={cn(
        "mt-8 sm:mt-12 text-center",
        compact && "mt-6 sm:mt-8",
        className
      )}
      aria-labelledby="trending-section-title"
    >
      <h2 id="trending-section-title" className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-3">
        <Plane className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
        <span>Trending experiences</span>
      </h2>

      <div className="flex flex-wrap gap-1.5 sm:gap-2 justify-center">
        {displayedExperiences.map((item, index) => (
          <motion.div
            key={item.name}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.7 + index * 0.05 }}
          >
            <TrendingItem
              icon={item.icon}
              name={item.name}
              onClick={() => handleExperienceClick(item.name)}
              tabIndex={0}
              onKeyDown={(e: { key: string; preventDefault: () => void; }) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleExperienceClick(item.name);
                }
              }}
              aria-label={`Search for ${item.name}`}
            />
          </motion.div>
        ))}

        {hasMoreItems && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.7 + displayedExperiences.length * 0.05 }}
          >
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 text-xs font-medium text-primary hover:text-primary/80"
              onClick={() => {
                // You could implement showing more trends or navigating to a dedicated page
                window.location.href = "/explore/trends";
              }}
            >
              See all
              <ArrowRight className="ml-1 h-3 w-3" />
            </Button>
          </motion.div>
        )}
      </div>

      {/* Preview hint for better user understanding */}
      <motion.p 
        className="mt-2 text-xs text-muted-foreground"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 1.2 }}
      >
        Click any trend to explore popular experiences
      </motion.p>
    </motion.section>
  );
});

TrendingSection.displayName = "TrendingSection";