import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const Headline: React.FC = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.7 }}
    className="text-center"
  >
    <h1 className={cn(
      "font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-medium tracking-tight",
      "bg-clip-text text-transparent bg-gradient-to-br from-foreground via-foreground/90 to-foreground/80",
      "leading-[1.1] mb-6"
    )}>
      Discover{" "}
      <span className="relative text-primary/60">
        Extraordinary
        <motion.span 
          className="absolute bottom-1 left-0 w-full h-[0.15em] bg-primary/60 rounded-full" 
          initial={{ scaleX: 0, originX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.8, duration: 0.7 }}
        />
      </span>
      {" "}Experiences
    </h1>
    <motion.p 
      className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-8 sm:mb-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.7, delay: 0.3 }}
    >
      Expertly curated travel itineraries with transportation, accommodations, 
      dining, and activities for your perfect adventure.
    </motion.p>
  </motion.div>
);