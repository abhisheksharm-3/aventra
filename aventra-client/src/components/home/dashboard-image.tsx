import { motion } from "framer-motion";
import Image from "next/image";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { DashboardImageProps } from "@/types/landing-page";
import { JSX } from "react";
import { ANIMATION_CONSTANTS, COLOR_CONSTANTS } from "@/lib/constants/dashboard-preview";

/**
 * Dashboard preview image with decorative elements
 * @param {DashboardImageProps} props - Component properties
 * @returns {JSX.Element} Rendered component
 */
export function DashboardImage({ 
  src, 
  imageAlt,
  disableAnimations
}: DashboardImageProps): JSX.Element {
  const prefersReducedMotion = useReducedMotion();
  const shouldAnimate = !disableAnimations && !prefersReducedMotion;
  
  const { GRADIENT_FROM } = COLOR_CONSTANTS;
  
  return (
    <motion.div
      initial={shouldAnimate ? { opacity: 0, y: 30 } : { opacity: 1 }}
      whileInView={shouldAnimate ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: ANIMATION_CONSTANTS.IMAGE_ANIMATION_DURATION, delay: 0.2 }}
      viewport={{ once: true, margin: "-50px" }}
      className="relative mx-auto max-w-5xl"
    >
      {/* Decorative elements */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl opacity-70 z-0"></div>
      <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-700/5 rounded-full blur-3xl opacity-70 z-0"></div>
      
      <div className="relative z-10 rounded-xl border border-border/40 bg-background/70 backdrop-blur-sm p-3 sm:p-4 shadow-[0_10px_60px_-15px_rgba(0,0,0,0.25)] hover:shadow-[0_20px_70px_-15px_rgba(0,0,0,0.3)] transition-all duration-500 group">
        {/* Browser-like header with dots */}
        <div className="flex items-center gap-2 mb-3 pl-2">
          <div className="flex gap-1.5">
            <div className="h-3 w-3 rounded-full bg-red-400" aria-hidden="true"></div>
            <div className="h-3 w-3 rounded-full bg-yellow-400" aria-hidden="true"></div>
            <div className="h-3 w-3 rounded-full bg-green-400" aria-hidden="true"></div>
          </div>
          <div className="text-xs text-muted-foreground font-medium">Aventra Dashboard</div>
        </div>
        
        {/* Dashboard image with decorative overlays */}
        <div className="aspect-[16/9] overflow-hidden rounded-lg border border-border/20 relative">
          {/* Image overlay gradients */}
          <div className={`absolute inset-0 bg-gradient-to-tr from-${GRADIENT_FROM}/20 via-transparent to-transparent opacity-0 group-hover:opacity-70 transition-opacity duration-700 z-10`}></div>
          <div className={`absolute inset-0 bg-gradient-to-bl from-transparent via-transparent to-${GRADIENT_FROM}/10 opacity-0 group-hover:opacity-70 transition-opacity duration-700 z-10`}></div>
          
          {/* Corner accents that appear on hover */}
          <div className={`absolute top-3 left-3 w-12 h-12 border-t-2 border-l-2 border-transparent rounded-tl-lg z-20 opacity-0 group-hover:opacity-100 group-hover:border-${GRADIENT_FROM}/50 transition-all duration-500`}></div>
          <div className={`absolute bottom-3 right-3 w-12 h-12 border-b-2 border-r-2 border-transparent rounded-br-lg z-20 opacity-0 group-hover:opacity-100 group-hover:border-${GRADIENT_FROM}/50 transition-all duration-500`}></div>
          
          <Image
            src={src}
            alt={imageAlt}
            width={1920}
            height={1080}
            className="object-cover group-hover:scale-[1.02] transition-transform duration-700 ease-out"
            onError={(e) => {
              console.error(`Failed to load dashboard image: ${src}`);
              // Fallback to a default image
              (e.target as HTMLImageElement).src = '/images/fallback-dashboard.jpg';
            }}
          />
        </div>
      </div>
    </motion.div>
  );
}