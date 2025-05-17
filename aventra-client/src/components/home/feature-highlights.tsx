import { motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { FeatureHighlightsProps } from "@/types/landing-page";
import { JSX } from "react";
import { ANIMATION_CONSTANTS } from "@/lib/constants/dashboard-preview";

/**
 * Feature highlights grid for dashboard capabilities
 * @param {FeatureHighlightsProps} props - Component properties
 * @returns {JSX.Element} Rendered component
 */
export function FeatureHighlights({ 
  features,
  disableAnimations
}: FeatureHighlightsProps): JSX.Element {
  const prefersReducedMotion = useReducedMotion();
  const shouldAnimate = !disableAnimations && !prefersReducedMotion;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 mt-8 max-w-4xl mx-auto">
      {features.map((feature, i) => (
        <motion.div 
          key={i}
          initial={shouldAnimate ? { opacity: 0, y: 20 } : { opacity: 1 }}
          whileInView={shouldAnimate ? { opacity: 1, y: 0 } : undefined}
          transition={{ 
            duration: 0.5, 
            delay: 0.4 + (i * ANIMATION_CONSTANTS.FEATURE_STAGGER_DELAY) 
          }}
          viewport={{ once: true }}
          className="bg-background/60 backdrop-blur-sm rounded-xl p-4 border border-border/30 hover:border-blue-600/30 hover:shadow-md transition-all duration-300"
        >
          <h3 className="font-medium text-base mb-1 group-hover:text-blue-600">{feature.title}</h3>
          <p className="text-sm text-muted-foreground">{feature.description}</p>
        </motion.div>
      ))}
    </div>
  );
}