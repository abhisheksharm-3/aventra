import { useState, useCallback, JSX } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { FeatureCardProps } from "@/types/landing-page";
import { ANIMATION_CONSTANTS } from "@/lib/constants/features";

/**
 * Individual feature card component that displays a feature with icon and description
 * @param {FeatureCardProps} props - Component properties
 * @returns {JSX.Element} Rendered component
 */
const FeatureCard = ({ 
  icon, 
  title, 
  description, 
  link, 
  index, 
  color 
}: FeatureCardProps): JSX.Element => {
  const [isHovered, setIsHovered] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const shouldAnimate = !prefersReducedMotion;
  
  // Memoize handlers to prevent unnecessary re-renders
  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);
  
  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
  }, []);
  
  // Validate and sanitize the link
  const safeLink = link.startsWith('/') ? link : `/${link.replace(/^#/, '')}`;
  
  return (
    <motion.div
      initial={shouldAnimate ? { opacity: 0, y: 30 } : { opacity: 1 }}
      whileInView={shouldAnimate ? { opacity: 1, y: 0 } : undefined}
      transition={{ 
        duration: ANIMATION_CONSTANTS.ITEM_ANIMATION_DURATION, 
        delay: index * ANIMATION_CONSTANTS.CARD_STAGGER_DELAY, 
        ease: "easeOut" 
      }}
      viewport={{ once: true, margin: "-50px" }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "group relative rounded-xl overflow-hidden backdrop-blur-sm border border-border",
        "bg-card/5 hover:bg-card/10",
        "shadow-sm hover:shadow-xl transition-all duration-500",
      )}
    >
      {/* Enhanced gradient background effect with animation */}
      <div 
        className={cn(
          "absolute inset-0 transition-opacity duration-700",
          isHovered ? "opacity-100" : "opacity-0"
        )}
      >
        <motion.div 
          animate={isHovered && shouldAnimate ? {
            opacity: [0.1, 0.2],
            scale: [1, 1.05],
          } : {}}
          transition={{ 
            duration: 3, 
            repeat: Infinity, 
            repeatType: "reverse",
            type: "tween"
          }}
          className={cn(
            "absolute inset-0 blur-xl bg-gradient-to-br",
            color
          )} 
        />
      </div>
      
      {/* Animated highlight */}
      <motion.div 
        className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary/50 to-transparent"
        initial={shouldAnimate ? { scaleX: 0, opacity: 0 } : { scaleX: 1, opacity: 1 }}
        whileInView={shouldAnimate ? { scaleX: 1, opacity: 1 } : undefined}
        transition={{ 
          duration: 0.8, 
          delay: index * ANIMATION_CONSTANTS.CARD_STAGGER_DELAY + 0.5 
        }}
        viewport={{ once: true }}
      />
      
      {/* Subtle corner glow on hover */}
      <div className={cn(
        "absolute -top-10 -right-10 w-40 h-40 bg-primary/10 rounded-full blur-xl transition-opacity duration-500",
        isHovered ? "opacity-30" : "opacity-0"
      )}></div>
      
      <div className="p-6 sm:p-7 relative z-10">
        {/* Enhanced icon animation */}
        <div className="mb-5 sm:mb-6 relative">
          <motion.div 
            initial={shouldAnimate ? { scale: 0.8, opacity: 0 } : { scale: 1, opacity: 1 }}
            whileInView={shouldAnimate ? { scale: 1, opacity: 1 } : undefined}
            transition={{ 
              type: "spring", 
              stiffness: 100, 
              delay: index * ANIMATION_CONSTANTS.CARD_STAGGER_DELAY 
            }}
            viewport={{ once: true }}
            animate={isHovered && shouldAnimate ? { y: -5 } : { y: 0 }}
            className={cn(
              "inline-flex p-3 sm:p-4 rounded-xl",
              "bg-gradient-to-br from-background/70 to-background/30",
              "border border-border shadow-md",
              "transform group-hover:scale-105 transition-transform duration-500"
            )}
          >
            <div className="text-primary relative">
              {icon}
              {/* Icon glow effect on hover */}
              <div className={cn(
                "absolute inset-0 bg-primary/20 blur-md rounded-full transition-opacity duration-300",
                isHovered ? "opacity-70" : "opacity-0"
              )}></div>
            </div>
          </motion.div>
          
          {/* Decorative dots */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            className="absolute top-0 right-0 hidden sm:block"
          >
            <div className="flex gap-1">
              {[...Array(3)].map((_, i) => (
                <div 
                  key={i} 
                  className={`h-1.5 w-1.5 rounded-full bg-primary/60 ${isHovered && shouldAnimate ? 'animate-pulse' : ''}`}
                  style={{ animationDelay: `${i * 0.2}s` }}
                ></div>
              ))}
            </div>
          </motion.div>
        </div>
        
        {/* Enhanced text animations */}
        <motion.h3 
          initial={shouldAnimate ? { x: -10, opacity: 0 } : { opacity: 1 }}
          whileInView={shouldAnimate ? { x: 0, opacity: 1 } : undefined}
          transition={{ 
            duration: 0.5, 
            delay: index * ANIMATION_CONSTANTS.CARD_STAGGER_DELAY + ANIMATION_CONSTANTS.TITLE_STAGGER_DELAY 
          }}
          viewport={{ once: true }}
          className={cn(
            "text-xl font-medium mb-2.5 transition-colors duration-500",
            "relative inline-block",
            isHovered ? "text-primary" : "text-foreground"
          )}
        >
          {title}
        </motion.h3>
        
        <motion.p 
          initial={shouldAnimate ? { x: -10, opacity: 0 } : { opacity: 1 }}
          whileInView={shouldAnimate ? { x: 0, opacity: 1 } : undefined}
          transition={{ 
            duration: 0.5, 
            delay: index * ANIMATION_CONSTANTS.CARD_STAGGER_DELAY + ANIMATION_CONSTANTS.TITLE_STAGGER_DELAY + 0.1 
          }}
          viewport={{ once: true }}
          className="text-muted-foreground mb-5 line-clamp-3 text-sm sm:text-base"
        >
          {description}
        </motion.p>
        
        {/* Enhanced link animation */}
        <motion.div
          initial={shouldAnimate ? { y: 10, opacity: 0 } : { opacity: 1 }}
          whileInView={shouldAnimate ? { y: 0, opacity: 1 } : undefined}
          transition={{ 
            duration: 0.5, 
            delay: index * ANIMATION_CONSTANTS.CARD_STAGGER_DELAY + ANIMATION_CONSTANTS.TITLE_STAGGER_DELAY + 0.2 
          }}
          viewport={{ once: true }}
        >
          <Link 
            href={safeLink}
            aria-label={`Explore ${title}`}
            className="inline-flex items-center text-primary hover:text-primary/80 font-medium group/link"
          >
            <span className="group-hover/link:translate-x-1 transition-transform duration-300">Explore</span>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className={cn(
                "ml-1 h-4 w-4 transition-all duration-300",
                "group-hover/link:translate-x-1",
                isHovered && shouldAnimate ? "animate-pulse" : ""
              )}
              aria-hidden="true"
            >
              <path d="M5 12h14"></path>
              <path d="m12 5 7 7-7 7"></path>
            </svg>
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default FeatureCard;