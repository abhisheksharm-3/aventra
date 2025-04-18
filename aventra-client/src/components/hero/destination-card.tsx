"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { DestinationCardProps } from "@/types/hero";

export const DestinationCard: React.FC<DestinationCardProps> = ({ 
  name, 
  country, 
  image,
  onClick 
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  
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
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick?.();
        }
      }}
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
          <p className="text-white font-medium text-lg leading-tight">{name}</p>
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
          sizes="(max-width: 768px) 100vw, 33vw"
          className={`object-cover transition-transform duration-500 group-hover:scale-110 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          loading="eager"
          priority={true}
          onLoadingComplete={() => setImageLoaded(true)}
          quality={85}
        />
      </div>
      
      {/* Subtle border for better definition */}
      <div className="absolute inset-0 rounded-xl border border-white/5 pointer-events-none z-20" />
    </motion.div>
  );
};