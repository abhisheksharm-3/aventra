import { motion, useTransform } from "framer-motion";
import { Navigation } from "lucide-react";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { TripContentProps } from "@/types/landing-page";
import { JSX } from "react";
import { ANIMATION_CONSTANTS } from "@/lib/constants/trips-section";
import { FeatureList } from "./trip-features";
import { SecondaryActionButton } from "./secondary-action-button";

/**
 * Content section of the trip component
 * @param {TripContentProps} props - Component properties
 * @returns {JSX.Element} Rendered component
 */
export function TripContent({ 
  title,
  subtitle,
  features,
  buttonText,
  buttonLink,
  scrollYProgress,
  disableAnimations
}: TripContentProps): JSX.Element {
  const prefersReducedMotion = useReducedMotion();
  const shouldAnimate = !disableAnimations && !prefersReducedMotion;
  
  // Split the title to highlight the last word
  const words = title.split(' ');
  const highlightedWord = words.pop() || '';
  const regularTitle = words.join(' ');
  
  // Content parallax effect
  const contentY = useTransform(
    scrollYProgress, 
    [0, 1], 
    [0, shouldAnimate ? 40 : 0]
  );
  
  return (
    <motion.div
      style={shouldAnimate ? { y: contentY } : undefined}
      initial={shouldAnimate ? { opacity: 0, x: -30 } : { opacity: 1 }}
      whileInView={shouldAnimate ? { opacity: 1, x: 0 } : undefined}
      transition={{ 
        duration: ANIMATION_CONSTANTS.SECTION_ANIMATION_DURATION, 
        ease: "easeOut" 
      }}
      viewport={{ once: true, margin: "-100px" }}
      className="order-2 md:order-1"
    >
      {/* Enhanced section label matching hero styles */}
      <motion.div
        initial={shouldAnimate ? { opacity: 0, y: -10 } : { opacity: 1 }}
        whileInView={shouldAnimate ? { opacity: 1, y: 0 } : undefined}
        transition={{ delay: 0.2, duration: 0.6 }}
        viewport={{ once: true }}
        className="mb-7 inline-flex"
      >
        <span className="px-5 py-2 rounded-full bg-gradient-to-r from-purple-500/20 to-blue-600/20 backdrop-blur-md border border-border text-foreground/90 text-sm font-medium shadow-lg flex items-center gap-2">
          <span className="flex items-center justify-center w-5 h-5 rounded-full bg-gradient-to-r from-purple-500 to-blue-600">
            <Navigation className="h-3 w-3 text-primary-foreground" />
          </span>
          <span>AI-Planned Travel</span>
        </span>
      </motion.div>
      
      <h2 className={cn(
        "font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight",
        "bg-clip-text text-transparent bg-gradient-to-br from-foreground via-foreground/90 to-foreground/80",
        "leading-[1.1] mb-6"
      )}>
        {regularTitle}{" "}
        <span className="relative inline-block text-primary">
          {highlightedWord}
          <motion.span 
            className="absolute bottom-0 left-0 w-full h-[0.12em] bg-gradient-to-r from-primary/30 via-primary/80 to-primary/30 rounded-full" 
            initial={shouldAnimate ? { scaleX: 0, originX: 0 } : { scaleX: 1 }}
            whileInView={shouldAnimate ? { scaleX: 1 } : undefined}
            transition={{ delay: 0.4, duration: 0.7 }}
            viewport={{ once: true }}
          />
          
          {/* Subtle glow effect */}
          <motion.div
            initial={shouldAnimate ? { opacity: 0 } : { opacity: 1 }}
            whileInView={shouldAnimate ? { opacity: 1 } : undefined}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="absolute -inset-x-2 -inset-y-1 bg-primary/10 blur-xl rounded-full -z-10"
          />
        </span>
      </h2>
      
      <motion.p
        initial={shouldAnimate ? { opacity: 0 } : { opacity: 1 }}
        whileInView={shouldAnimate ? { opacity: 1 } : undefined}
        transition={{ 
          duration: ANIMATION_CONSTANTS.SECTION_ANIMATION_DURATION, 
          delay: 0.3 
        }}
        viewport={{ once: true }}
        className="text-muted-foreground mb-8 sm:mb-10 font-light tracking-wide leading-relaxed text-lg md:text-xl max-w-lg"
      >
        {subtitle}
      </motion.p>
      
      {/* Feature list */}
      <FeatureList 
        features={features} 
        disableAnimations={disableAnimations}
      />
      
      {/* Action button */}
      <motion.div
        initial={shouldAnimate ? { opacity: 0, y: 10 } : { opacity: 1 }}
        whileInView={shouldAnimate ? { opacity: 1, y: 0 } : undefined}
        transition={{ 
          duration: ANIMATION_CONSTANTS.BUTTON_ANIMATION_DURATION, 
          delay: 0.8 
        }}
        viewport={{ once: true }}
        className="mt-10 sm:mt-12"
      >
        <SecondaryActionButton 
          href={buttonLink}
          disableAnimations={disableAnimations}
        >
          {buttonText}
        </SecondaryActionButton>
      </motion.div>
    </motion.div>
  );
}