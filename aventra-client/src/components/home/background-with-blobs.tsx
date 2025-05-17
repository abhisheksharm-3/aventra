import { useReducedMotion } from "@/hooks/useReducedMotion";
import { SecondaryBackgroundEffectsProps } from "@/types/landing-page";
import { JSX } from "react";

/**
 * Animated background effects for the nights out section
 * @param {BackgroundWithBlobsProps} props - Component properties
 * @returns {JSX.Element} Rendered component
 */
export function BackgroundWithBlobs({ disableAnimations }: SecondaryBackgroundEffectsProps): JSX.Element {
  const prefersReducedMotion = useReducedMotion();
  const shouldAnimate = !disableAnimations && !prefersReducedMotion;
  
  return (
    <div className="absolute inset-0 -z-10">
      <div className="absolute inset-0 bg-background/95" />
      
      {/* Animated gradient blobs with CSS animations instead of framer-motion for performance */}
      <div className={`absolute top-40 -right-40 md:-right-20 h-[500px] w-[500px] bg-primary/5 rounded-full blur-[100px] opacity-60 ${shouldAnimate ? 'animate-[pulse_12s_infinite]' : ''}`} />
      <div className={`absolute bottom-20 -left-40 md:-left-20 h-[400px] w-[400px] bg-blue-700/5 rounded-full blur-[100px] opacity-60 ${shouldAnimate ? 'animate-[pulse_16s_infinite]' : ''}`} />
      <div className="absolute hidden md:block top-40 right-32 w-6 h-6 rounded-full bg-primary/10" />
      
      {/* Subtle grain texture for depth - matching hero */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-[url('/noise.png')] bg-repeat opacity-20"></div>
      </div>
    </div>
  );
}