import { motion, useTransform } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { JSX } from "react";
import { BackgroundEffectsProps } from "@/types/landing-page";
import { ANIMATION_CONSTANTS } from "@/lib/constants/features";

/**
 * Animated background effects for the features section
 * @param {BackgroundEffectsProps} props - Component properties
 * @returns {JSX.Element} Rendered component
 */
export function BackgroundEffects({ 
  scrollYProgress,
  disableAnimations 
}: BackgroundEffectsProps): JSX.Element {
  const prefersReducedMotion = useReducedMotion();
  const shouldAnimate = !disableAnimations && !prefersReducedMotion;
  
  // Enhanced parallax effect for background blobs
  const leftBlobX = useTransform(scrollYProgress, [0, 1], [-60, -20]);
  const leftBlobY = useTransform(scrollYProgress, [0, 1], [0, -40]);
  const rightBlobX = useTransform(scrollYProgress, [0, 1], [0, 40]);
  const rightBlobY = useTransform(scrollYProgress, [0, 1], [0, 60]);
  
  const animationDuration = ANIMATION_CONSTANTS.BACKGROUND_ANIMATION_DURATION;
  
  return (
    <div className="absolute inset-0 -z-10">
      <motion.div 
        style={shouldAnimate ? { x: leftBlobX, y: leftBlobY } : undefined}
        animate={shouldAnimate ? { 
          opacity: [0.6, 0.7],
          scale: [1, 1.05],
        } : undefined}
        transition={shouldAnimate ? { 
          duration: animationDuration, 
          repeat: Infinity, 
          repeatType: "reverse",
          type: "tween"
        } : undefined}
        className="absolute top-20 -left-40 h-[600px] w-[600px] bg-primary/5 rounded-full blur-[120px]" 
      />
      <motion.div 
        style={shouldAnimate ? { x: rightBlobX, y: rightBlobY } : undefined}
        animate={shouldAnimate ? { 
          opacity: [0.6, 0.8],
          scale: [1, 1.03],
        } : undefined}
        transition={shouldAnimate ? { 
          duration: animationDuration + 2, 
          repeat: Infinity, 
          repeatType: "reverse",
          delay: 2,
          type: "tween"
        } : undefined}
        className="absolute bottom-0 -right-40 h-[600px] w-[600px] bg-blue-700/5 rounded-full blur-[120px]" 
      />
      
      {shouldAnimate && (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ 
            duration: 120, 
            repeat: Infinity, 
            ease: "linear" 
          }}
          className="absolute top-1/4 right-1/4 w-[800px] h-[800px] border border-primary/5 rounded-full"
        />
      )}
      
      {/* Subtle grain texture for depth - matching hero */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-[url('/noise.png')] bg-repeat opacity-20"></div>
      </div>
    </div>
  );
}