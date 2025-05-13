import { motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { FeatureListProps } from "@/types/landing-page";
import { JSX } from "react";
import { ANIMATION_CONSTANTS } from "@/lib/constants/trips-section";

/**
 * List of feature items with animations
 * @param {FeatureListProps} props - Component properties
 * @returns {JSX.Element} Rendered component
 */
export function FeatureList({ features, disableAnimations }: FeatureListProps): JSX.Element {
  const prefersReducedMotion = useReducedMotion();
  const shouldAnimate = !disableAnimations && !prefersReducedMotion;
  
  return (
    <motion.ul 
      initial={shouldAnimate ? { opacity: 0 } : { opacity: 1 }}
      whileInView={shouldAnimate ? { opacity: 1 } : undefined}
      transition={{ duration: ANIMATION_CONSTANTS.SECTION_ANIMATION_DURATION, delay: 0.4 }}
      viewport={{ once: true }}
      className="space-y-4 sm:space-y-5"
    >
      {features.map((feature, i) => (
        <motion.li 
          key={i} 
          initial={shouldAnimate ? { opacity: 0, x: -10 } : { opacity: 1 }}
          whileInView={shouldAnimate ? { opacity: 1, x: 0 } : undefined}
          transition={{ 
            duration: 0.5, 
            delay: 0.5 + (i * ANIMATION_CONSTANTS.FEATURE_STAGGER_DELAY) 
          }}
          viewport={{ once: true }}
          className="flex items-center gap-3 font-light text-sm sm:text-base text-foreground/80"
        >
          <motion.div 
            whileHover={shouldAnimate ? { scale: 1.3 } : undefined}
            className="h-2 w-2 rounded-full bg-gradient-to-r from-primary to-primary/80 shadow-sm shadow-primary/20" 
          />
          {feature.text}
        </motion.li>
      ))}
    </motion.ul>
  );
}