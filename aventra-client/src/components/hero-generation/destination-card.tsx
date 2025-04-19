"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowRight, MapPin } from "lucide-react";
import { DestinationCardProps } from "@/types/hero";
import { cn } from "@/lib/utils";

/**
 * DestinationCard Component
 * 
 * An interactive card displaying a travel destination with image, name, country,
 * and hover effects. Supports keyboard navigation for accessibility.
 * 
 * @param {DestinationCardProps} props - Component props
 * @returns {JSX.Element} The rendered destination card
 */
export const DestinationCard: React.FC<DestinationCardProps> = ({ 
  name, 
  country, 
  image,
  onClick
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  
  // Handle keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick?.();
    }
  }, [onClick]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      className="group relative rounded-xl overflow-hidden h-[160px] cursor-pointer shadow-sm"
      role="button"
      tabIndex={0}
      aria-label={`Explore ${name}, ${country}`}
      onClick={onClick}
      onKeyDown={handleKeyDown}
    >
      {/* Gradient overlay - improved for better text contrast */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10" />
      
      {/* Hover overlay with smoother transition */}
      <motion.div 
        className="absolute inset-0 bg-primary/40 opacity-0 group-hover:opacity-100 z-10"
        transition={{ duration: 0.3 }}
      />
      
      {/* Content section */}
      <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
        <motion.div
          initial={{ y: 5, opacity: 0.8 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-1">
            <MapPin className="h-3 w-3 text-white/70 hidden sm:block" aria-hidden="true" />
            <p className="text-white font-medium text-lg leading-tight">{name}</p>
          </div>
          <p className="text-white/80 text-sm mt-0.5">{country}</p>
        </motion.div>
      </div>
      
      {/* Arrow indicator */}
      <div className="absolute top-0 right-0 p-2 z-20">
        <motion.div 
          className="bg-background/80 backdrop-blur-sm p-1.5 rounded-md opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0"
          whileHover={{ scale: 1.1, rotate: -5 }}
          transition={{ duration: 0.2 }}
        >
          <ArrowRight className="h-4 w-4" />
        </motion.div>
      </div>
      
      {/* Image container with loading state */}
      <div className="w-full h-full overflow-hidden">
        {!imageLoaded && (
          <div className="w-full h-full bg-muted/30 animate-pulse" />
        )}
        <Image 
          src={image}
          alt={`${name}, ${country} destination`}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className={cn(
            "object-cover transition-transform duration-500 group-hover:scale-110",
            imageLoaded ? "opacity-100" : "opacity-0"
          )}
          loading="eager"
          priority={true}
          onLoad={() => setImageLoaded(true)}
          quality={85}
        />
      </div>
      
      {/* Subtle border for better definition */}
      <div className="absolute inset-0 rounded-xl border border-white/5 pointer-events-none z-20" />

      {/* Focus ring for accessibility */}
      <div className="absolute inset-0 rounded-xl ring-offset-2 ring-primary/50 ring-0 focus-within:ring-2 pointer-events-none z-0" />
    </motion.div>
  );
};