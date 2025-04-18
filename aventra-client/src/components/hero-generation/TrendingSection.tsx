import { motion } from "framer-motion";
import { Plane } from "lucide-react";
import { TrendingItem } from "./trending-item";
import { trendingExperiences } from "@/lib/constants/hero";
import { useSearchStore } from "@/stores/searchStore";

export const TrendingSection = () => {
  const { setSearchQuery } = useSearchStore();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.6 }}
      className="mt-8 sm:mt-12 text-center"
    >
      <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-3">
        <Plane className="h-3.5 w-3.5 text-primary" />
        <span>Trending experiences</span>
      </div>
      <div className="flex flex-wrap gap-1.5 sm:gap-2 justify-center">
        {trendingExperiences.map((item, index) => (
          <motion.div
            key={item.name}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.7 + index * 0.05 }}
          >
            <TrendingItem
              icon={item.icon}
              name={item.name}
              onClick={() => setSearchQuery(item.name)}
            />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};