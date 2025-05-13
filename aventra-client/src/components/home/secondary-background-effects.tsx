import { motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { SecondaryBackgroundEffectsProps } from "@/types/landing-page";
import { JSX } from "react";
import { ANIMATION_CONSTANTS } from "@/lib/constants/trips-section";

/**
 * Animated background effects for the trip section
 * @param {SecondaryBackgroundEffectsProps} props - Component properties
 * @returns {JSX.Element} Rendered component
 */
export function SecondaryBackgroundEffects({ disableAnimations }: SecondaryBackgroundEffectsProps): JSX.Element {
  const prefersReducedMotion = useReducedMotion();
  const shouldAnimate = !disableAnimations && !prefersReducedMotion;
  
  return (
    <div className="absolute inset-0 -z-10">
      <div className="absolute inset-0 bg-gradient-to-b from-background/95 to-background" />
      
      {/* Animated gradient blobs */}
      <motion.div 
        animate={shouldAnimate ? { 
          opacity: [0.6, 0.7],
          scale: [1, 1.05],
        } : undefined}
        transition={shouldAnimate ? { 
          duration: ANIMATION_CONSTANTS.BACKGROUND_ANIMATION_DURATION, 
          repeat: Infinity, 
          repeatType: "reverse",
          type: "tween"
        } : undefined}
        className="absolute top-20 -left-40 md:-left-20 h-[600px] w-[600px] bg-primary/5 rounded-full blur-[120px]" 
      />
      
      <motion.div 
        animate={shouldAnimate ? { 
          opacity: [0.5, 0.7],
          scale: [1, 1.05],
        } : undefined}
        transition={shouldAnimate ? { 
          duration: ANIMATION_CONSTANTS.BACKGROUND_ANIMATION_DURATION + 4, 
          repeat: Infinity, 
          repeatType: "reverse",
          type: "tween",
          delay: 2
        } : undefined}
        className="absolute bottom-0 -right-40 md:-right-20 h-[600px] w-[600px] bg-blue-700/5 rounded-full blur-[120px]" 
      />
      
      {/* Subtle grain texture for depth - matching hero */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-[url('/noise.png')] bg-repeat opacity-20"></div>
      </div>
    </div>
  );
}