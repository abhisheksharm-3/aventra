import { useState, useCallback, memo, JSX } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Quote } from "lucide-react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { TestimonialCardProps } from "@/types/landing-page";
import { ANIMATION_CONSTANTS } from "@/lib/constants/testimonials";

/**
 * Card displaying a customer testimonial with author information
 * @param {TestimonialCardProps} props - Component properties
 * @returns {JSX.Element} Rendered component
 */
const TestimonialCard = ({ 
  quote, 
  author, 
  role, 
  imageSrc, 
  index, 
  color,
  disableAnimations
}: TestimonialCardProps): JSX.Element => {
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
  
  return (
    <motion.div
      initial={shouldAnimate ? { opacity: 0, y: 30 } : { opacity: 1 }}
      whileInView={shouldAnimate ? { opacity: 1, y: 0 } : undefined}
      transition={{ 
        duration: ANIMATION_CONSTANTS.CARD_ANIMATION_DURATION, 
        delay: ANIMATION_CONSTANTS.CARD_STAGGER_DELAY * index 
      }}
      viewport={{ once: true, margin: "-50px" }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="group rounded-xl overflow-hidden backdrop-blur-sm border border-border shadow-sm hover:shadow-lg transition-all duration-300 p-6 relative bg-card/5"
    >
      {/* Background effects */}
      <div className={`absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${color}`}></div>
      <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-primary/5 rounded-full blur-2xl opacity-0 group-hover:opacity-60 transition-opacity duration-500"></div>
      
      <div className="relative z-10">
        {/* Quote icon */}
        <motion.div 
          animate={isHovered && shouldAnimate ? { y: -5 } : { y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-primary mb-4 flex items-center gap-1.5"
        >
          <Quote className="h-6 w-6" />
          
          {/* Decorative dots */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered && shouldAnimate ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            className="hidden sm:block"
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
        </motion.div>
        
        <p className="italic text-foreground mb-6 leading-relaxed text-sm sm:text-base">&quot;{quote}&quot;</p>
        
        <div className="flex items-center gap-3 mt-auto">
          <div className="h-11 w-11 rounded-full overflow-hidden border border-border shadow-sm group-hover:shadow-md group-hover:border-primary/30 transition-all duration-300">
            <Image
              src={imageSrc}
              alt={`${author} - ${role}`}
              width={44}
              height={44}
              className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
              onError={(e) => {
                console.error(`Failed to load testimonial image for ${author}`);
                // Fallback to a default image
                (e.target as HTMLImageElement).src = '/images/fallback-avatar.jpg';
              }}
            />
          </div>
          <div>
            <h4 className="font-medium group-hover:text-primary transition-colors duration-300">{author}</h4>
            <p className="text-sm text-muted-foreground">{role}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Memoize the component to prevent unnecessary re-renders
export default memo(TestimonialCard);