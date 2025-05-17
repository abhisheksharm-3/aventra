import { motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { JSX } from "react";
import { COLOR_CONSTANTS } from "@/lib/constants/dashboard-preview";

/**
 * Animated info badge for additional information
 * @param {object} props - Component properties
 * @param {string} props.text - Text to display
 * @param {boolean} [props.disableAnimations] - Whether animations should be disabled
 * @returns {JSX.Element} Rendered component
 */
export function InfoBadge({ 
  text,
  disableAnimations 
}: { 
  text: string;
  disableAnimations?: boolean;
}): JSX.Element {
  const prefersReducedMotion = useReducedMotion();
  const shouldAnimate = !disableAnimations && !prefersReducedMotion;
  
  const { GRADIENT_FROM, GRADIENT_TO } = COLOR_CONSTANTS;
  
  return (
    <motion.div
      initial={shouldAnimate ? { opacity: 0 } : { opacity: 1 }}
      whileInView={shouldAnimate ? { opacity: 1 } : undefined}
      transition={{ duration: 0.6, delay: 1 }}
      viewport={{ once: true }}
      className="mt-8 flex justify-center"
    >
      <div className={`inline-flex items-center gap-2.5 py-2.5 px-5 rounded-full bg-gradient-to-r from-${GRADIENT_FROM}/10 to-${GRADIENT_TO}/10 backdrop-blur-md border border-border shadow-lg`}>
        <div className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-${GRADIENT_FROM}/20 flex items-center justify-center text-${GRADIENT_FROM}`}>
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
            ✦
          </motion.span>
        </div>
        <span className="text-xs sm:text-sm text-foreground/80">{text}</span>
      </div>
    </motion.div>
  );
}