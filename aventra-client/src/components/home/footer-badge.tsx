import { motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { FooterBadgeProps } from "@/types/landing-page";
import { JSX } from "react";
import { ANIMATION_CONSTANTS } from "@/lib/constants/testimonials";

/**
 * Animated footer badge with star icon
 * @param {FooterBadgeProps} props - Component properties
 * @returns {JSX.Element} Rendered component
 */
export function FooterBadge({ 
  text,
  disableAnimations 
}: FooterBadgeProps): JSX.Element {
  const prefersReducedMotion = useReducedMotion();
  const shouldAnimate = !disableAnimations && !prefersReducedMotion;
  
  return (
    <motion.div
      initial={shouldAnimate ? { opacity: 0, y: 10 } : { opacity: 1 }}
      whileInView={shouldAnimate ? { opacity: 1, y: 0 } : undefined}
      transition={{ 
        duration: 0.5, 
        delay: ANIMATION_CONSTANTS.FOOTER_ANIMATION_DELAY 
      }}
      viewport={{ once: true }}
      className="mt-14 sm:mt-16 flex justify-center"
    >
      <div className="inline-flex items-center gap-2.5 py-2.5 px-5 rounded-full bg-gradient-to-r from-primary/10 to-secondary/10 backdrop-blur-md border border-border shadow-lg">
        <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-primary/20 flex items-center justify-center text-primary">
          <motion.span 
            animate={shouldAnimate ? { 
              scale: [1, 1.2],
              rotate: [0, 10]
            } : undefined}
            transition={{ 
              duration: 2, 
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut"
            }}
            className="text-base sm:text-lg"
          >
            ★
          </motion.span>
        </div>
        <span className="text-xs sm:text-sm text-foreground/80">{text}</span>
      </div>
    </motion.div>
  );
}