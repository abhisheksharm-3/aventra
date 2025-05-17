import { useState, useCallback, JSX } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { SecondaryActionButtonProps } from "@/types/landing-page";
import { ANIMATION_CONSTANTS } from "@/lib/constants/trips-section";

/**
 * Animated action button with hover effects
 * @param {SecondaryActionButtonProps} props - Component properties
 * @returns {JSX.Element} Rendered component
 */
export function SecondaryActionButton({ 
  children, 
  href = "/plan",
  disableAnimations 
}: SecondaryActionButtonProps): JSX.Element {
  const [isHovered, setIsHovered] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const shouldAnimate = !disableAnimations && !prefersReducedMotion;
  
  // Memoize handlers to prevent unnecessary re-renders
  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);
  
  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
  }, []);
  
  const ButtonElement = (
    <Button 
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="px-6 sm:px-8 py-6 h-auto rounded-full bg-primary hover:bg-primary/90 transition-colors duration-500 shadow-md hover:shadow-xl group relative overflow-hidden"
    >
      {/* Button background animation */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        animate={isHovered && shouldAnimate ? {
          opacity: [0, 0.5, 0],
          scale: [1, 1.1, 1],
        } : undefined}
        transition={{
          duration: ANIMATION_CONSTANTS.HOVER_ANIMATION_DURATION,
          repeat: Infinity,
          type: "tween"
        }}
      />
      
      <motion.div
        animate={isHovered && shouldAnimate ? {
          scale: 1.1
        } : {
          scale: 1
        }}
        transition={{
          duration: 0.6,
          type: "spring",
          stiffness: 300
        }}
        className="relative flex items-center"
      >
        <Sparkles className="h-4 w-4 mr-2 opacity-70" />
        <span className="font-medium group-hover:translate-x-0.5 transition-transform duration-300">
          {children}
        </span>
      </motion.div>
    </Button>
  );
  
  // If href is provided, wrap the button in a Link component
  if (href) {
    return (
      <Link href={href}>
        {ButtonElement}
      </Link>
    );
  }
  
  // Otherwise, just return the button
  return ButtonElement;
}