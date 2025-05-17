import { motion, useTransform } from "framer-motion";
import { Compass } from "lucide-react";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { JSX } from "react";
import { SectionHeaderProps } from "@/types/landing-page";
import { ANIMATION_CONSTANTS } from "@/lib/constants/features";

/**
 * Section header with title and subtitle
 * @param {SectionHeaderProps} props - Component properties
 * @returns {JSX.Element} Rendered component
 */
export function SectionHeader({
  title,
  subtitle,
  scrollYProgress,
  disableAnimations
}: SectionHeaderProps): JSX.Element {
  const prefersReducedMotion = useReducedMotion();
  const shouldAnimate = !disableAnimations && !prefersReducedMotion;
  
  const titleY = useTransform(
    scrollYProgress, 
    [0, 0.5], 
    [0, shouldAnimate ? -20 : 0]
  );
  
  return (
    <motion.div 
      style={shouldAnimate ? { y: titleY } : undefined}
      initial={shouldAnimate ? { opacity: 0, y: 20 } : { opacity: 1 }}
      whileInView={shouldAnimate ? { opacity: 1, y: 0 } : undefined}
      transition={{ 
        duration: ANIMATION_CONSTANTS.SCROLL_TRANSITION_DURATION, 
        ease: "easeOut" 
      }}
      viewport={{ once: true, margin: "-100px" }}
      className="text-center mb-16 sm:mb-20 md:mb-24"
    >
      <motion.div
        initial={shouldAnimate ? { opacity: 0, y: -10 } : { opacity: 1 }}
        whileInView={shouldAnimate ? { opacity: 1, y: 0 } : undefined}
        transition={{ 
          delay: 0.2, 
          duration: 0.6 
        }}
        viewport={{ once: true }}
        className="mb-8 inline-flex"
      >
        <span className="px-5 py-2 rounded-full bg-gradient-to-r from-purple-500/20 to-blue-600/20 backdrop-blur-md border border-border text-foreground/90 text-sm font-medium shadow-lg flex items-center gap-2">
          <span className="flex items-center justify-center w-5 h-5 rounded-full bg-gradient-to-r from-purple-500 to-blue-600">
            <Compass className="h-3 w-3 text-primary-foreground" />
          </span>
          <span>Tailored Experiences</span>
        </span>
      </motion.div>
      
      <h2 className={cn(
        "font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight",
        "bg-clip-text text-transparent bg-gradient-to-br from-foreground via-foreground/90 to-foreground/80",
        "leading-[1.1] mb-4"
      )}>
        {title.split(' ').slice(0, -1).join(' ')}{" "}
        <span className="relative inline-block text-primary">
          {title.split(' ').slice(-1)[0]}
          <motion.span 
            className="absolute bottom-0 left-0 w-full h-[0.12em] bg-gradient-to-r from-primary/30 via-primary/80 to-primary/30 rounded-full" 
            initial={shouldAnimate ? { scaleX: 0, originX: 0 } : { scaleX: 1 }}
            whileInView={shouldAnimate ? { scaleX: 1 } : undefined}
            transition={{ delay: 0.6, duration: 0.9 }}
            viewport={{ once: true }}
          />
          
          {/* Subtle glow effect */}
          <motion.div
            initial={shouldAnimate ? { opacity: 0 } : { opacity: 1 }}
            whileInView={shouldAnimate ? { opacity: 1 } : undefined}
            transition={{ delay: 1, duration: 0.5 }}
            className="absolute -inset-x-2 -inset-y-1 bg-primary/10 blur-xl rounded-full -z-10"
          />
        </span>
      </h2>
      
      <motion.p 
        className="mt-4 sm:mt-6 text-muted-foreground max-w-2xl mx-auto tracking-wide text-lg sm:text-xl md:text-2xl font-light"
        initial={shouldAnimate ? { opacity: 0, y: 10 } : { opacity: 1 }}
        whileInView={shouldAnimate ? { opacity: 1, y: 0 } : undefined}
        transition={{ 
          duration: ANIMATION_CONSTANTS.SCROLL_TRANSITION_DURATION, 
          delay: 0.4, 
          ease: "easeOut" 
        }}
        viewport={{ once: true }}
      >
        {subtitle}
      </motion.p>
    </motion.div>
  );
}