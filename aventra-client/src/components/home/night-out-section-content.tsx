import { motion } from "framer-motion";
import { Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { JSX } from "react";
import { SectionContentProps } from "@/types/landing-page";
import { ANIMATION_CONSTANTS, COLOR_CONSTANTS } from "@/lib/constants/night-out";
import { FeatureList } from "./trip-features";
import { SecondaryActionButton } from "./secondary-action-button";

/**
 * Content section with title, description, features and button
 * @param {SectionContentProps} props - Component properties
 * @returns {JSX.Element} Rendered component
 */
export function NightOutSectionContent({ 
  title,
  subtitle,
  features,
  buttonText,
  buttonLink,
  disableAnimations
}: SectionContentProps): JSX.Element {
  const prefersReducedMotion = useReducedMotion();
  const shouldAnimate = !disableAnimations && !prefersReducedMotion;
  
  // Split the title to highlight the last word
  const words = title.split(' ');
  const highlightedWord = words.pop() || '';
  const regularTitle = words.join(' ');
  
  const { GRADIENT_FROM, GRADIENT_TO } = COLOR_CONSTANTS;
  
  return (
    <motion.div
      initial={shouldAnimate ? { opacity: 0, x: 20 } : { opacity: 1 }}
      whileInView={shouldAnimate ? { opacity: 1, x: 0 } : undefined}
      transition={{ 
        duration: ANIMATION_CONSTANTS.SECTION_ANIMATION_DURATION, 
        delay: ANIMATION_CONSTANTS.TITLE_ANIMATION_DELAY, 
        ease: "easeOut" 
      }}
      viewport={{ once: true, margin: "-100px" }}
      className="order-1 md:order-2"
    >
      {/* Enhanced section label */}
      <motion.div
        initial={shouldAnimate ? { opacity: 0, y: -10 } : { opacity: 1 }}
        whileInView={shouldAnimate ? { opacity: 1, y: 0 } : undefined}
        transition={{ delay: ANIMATION_CONSTANTS.TITLE_ANIMATION_DELAY, duration: 0.6 }}
        viewport={{ once: true }}
        className="mb-7 inline-flex"
      >
        <span className={`px-5 py-2 rounded-full bg-gradient-to-r from-${GRADIENT_FROM}/20 to-${GRADIENT_TO}/20 backdrop-blur-md border border-border text-foreground/90 text-sm font-medium shadow-lg flex items-center gap-2`}>
          <span className={`flex items-center justify-center w-5 h-5 rounded-full bg-gradient-to-r from-${GRADIENT_FROM} to-${GRADIENT_TO}`}>
            <Users className="h-3 w-3 text-primary-foreground" />
          </span>
          <span>Social Experiences</span>
        </span>
      </motion.div>
      
      <h2 className={cn(
        "font-serif text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight",
        "bg-clip-text text-transparent bg-gradient-to-br from-foreground via-foreground/90 to-foreground/80",
        "leading-[1.2] mb-6"
      )}>
        {regularTitle}{" "}
        <span className={`relative text-${GRADIENT_FROM}`}>
          {highlightedWord}
          <motion.span 
            className={`absolute bottom-1 left-0 w-full h-[0.12em] bg-gradient-to-r from-${GRADIENT_FROM}/30 via-${GRADIENT_FROM}/80 to-${GRADIENT_FROM}/30 rounded-full`}
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
            className={`absolute -inset-x-2 -inset-y-1 bg-${GRADIENT_FROM}/10 blur-xl rounded-full -z-10`}
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
        className="text-muted-foreground mb-8 sm:mb-10 font-light tracking-wide leading-relaxed text-base sm:text-lg"
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
          duration: 0.5, 
          delay: ANIMATION_CONSTANTS.BUTTON_ANIMATION_DELAY 
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