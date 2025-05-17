import { motion, useTransform } from "framer-motion";
import Image from "next/image";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { SecondaryHeroImageProps } from "@/types/landing-page";
import { JSX } from "react";
import { ANIMATION_CONSTANTS } from "@/lib/constants/trips-section";

/**
 * Image component with parallax effects
 * @param {SecondaryHeroImageProps} props - Component properties
 * @returns {JSX.Element} Rendered component
 */
export function SecondaryHeroImage({ 
  src, 
  alt, 
  caption,
  scrollYProgress,
  disableAnimations
}: SecondaryHeroImageProps): JSX.Element {
  const prefersReducedMotion = useReducedMotion();
  const shouldAnimate = !disableAnimations && !prefersReducedMotion;
  
  // Image parallax effects
  const imageY = useTransform(
    scrollYProgress, 
    [0, 1], 
    [0, shouldAnimate ? -30 : 0]
  );
  
  const imageScale = useTransform(
    scrollYProgress, 
    [0, 1], 
    [1, shouldAnimate ? 1.1 : 1]
  );
  
  return (
    <motion.div
      style={shouldAnimate ? { y: imageY } : undefined}
      initial={shouldAnimate ? { opacity: 0, x: 30 } : { opacity: 1 }}
      whileInView={shouldAnimate ? { opacity: 1, x: 0 } : undefined}
      transition={{ 
        duration: ANIMATION_CONSTANTS.IMAGE_ANIMATION_DURATION, 
        delay: 0.2, 
        ease: "easeOut" 
      }}
      viewport={{ once: true, margin: "-100px" }}
      className="order-1 md:order-2"
    >
      <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 group">
        {/* Image gradients and overlays */}
        <div className="absolute inset-0 bg-gradient-to-tr from-primary/30 via-transparent to-transparent opacity-70 z-10"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-primary/30 opacity-70 z-10"></div>
        
        {/* Enhanced decorative elements */}
        <motion.div 
          animate={shouldAnimate ? {
            opacity: [0.5, 0.8],
            scale: [1, 1.1],
          } : undefined}
          transition={shouldAnimate ? {
            duration: 8,
            repeat: Infinity,
            repeatType: "reverse",
            type: "tween"
          } : undefined}
          className="absolute -top-5 -right-5 w-28 h-28 bg-blue-700/10 rounded-full blur-2xl opacity-70 z-0"
        />
        
        <motion.div 
          animate={shouldAnimate ? {
            opacity: [0.5, 0.7],
            scale: [1, 1.2],
          } : undefined}
          transition={shouldAnimate ? {
            duration: 10,
            repeat: Infinity,
            repeatType: "reverse",
            delay: 1,
            type: "tween"
          } : undefined}
          className="absolute -bottom-10 -left-10 w-44 h-44 bg-primary/15 rounded-full blur-2xl opacity-70 z-0"
        />
        
        {/* Border glow effect */}
        <div className="absolute inset-0 border border-border rounded-2xl z-20 group-hover:border-primary/30 transition-colors duration-500 pointer-events-none"></div>
        <div className="absolute inset-0 backdrop-blur-[1px] opacity-0 group-hover:opacity-10 transition-opacity duration-500 z-10"></div>
        
        {/* Corner accents */}
        <div className="absolute top-3 left-3 w-10 h-10 border-t-2 border-l-2 border-border rounded-tl-lg z-20 opacity-70 group-hover:opacity-100 group-hover:border-primary/50 transition-all duration-500"></div>
        <div className="absolute bottom-3 right-3 w-10 h-10 border-b-2 border-r-2 border-border rounded-br-lg z-20 opacity-70 group-hover:opacity-100 group-hover:border-primary/50 transition-all duration-500"></div>
        
        {/* Image with parallax effect */}
        <motion.div 
          className="absolute inset-0 w-full h-full" 
          style={shouldAnimate ? { scale: imageScale } : undefined}
        >
          <Image
            src={src}
            alt={alt}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
            className="object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
            onError={(e) => {
              console.error(`Failed to load image: ${src}`);
              // Fallback to a default image
              (e.target as HTMLImageElement).src = '/images/fallback-trip.jpg';
            }}
          />
        </motion.div>
        
        {/* Overlay filter */}
        <div className="absolute inset-0 bg-black/10 mix-blend-overlay group-hover:opacity-50 transition-opacity duration-500 z-10"></div>
      </div>
      
      {/* Caption under image */}
      <motion.p
        initial={shouldAnimate ? { opacity: 0, y: 10 } : { opacity: 1 }}
        whileInView={shouldAnimate ? { opacity: 1, y: 0 } : undefined}
        transition={{ duration: 0.5, delay: 0.9 }}
        viewport={{ once: true }}
        className="mt-4 text-center text-xs text-muted-foreground/70 italic"
      >
        {caption}
      </motion.p>
    </motion.div>
  );
}