import { useRef, useEffect, JSX } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { DestinationImageProps } from '@/types/hero';

/**
 * Renders a destination background image with parallax effect
 * @param {DestinationImageProps} props - Component properties
 * @returns {JSX.Element} Rendered component
 */
export const DestinationImage = ({ 
  destination, 
  isMobile,
  isActive 
}: DestinationImageProps): JSX.Element => {
  const backgroundRef = useRef<HTMLDivElement | null>(null);

  // Mouse movement for parallax effect
  useEffect(() => {
    if (isMobile || !isActive) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      if (!backgroundRef.current) return;
      
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      
      // Calculate normalized mouse position (-1 to 1)
      const x = (clientX / innerWidth) * 2 - 1;
      const y = (clientY / innerHeight) * 2 - 1;
      
      // Apply parallax effect (slower and smoother movement)
      const moveX = x * -20; // pixels to move horizontally
      const moveY = y * -20; // pixels to move vertically
      
      backgroundRef.current.style.transform = `translate3d(${moveX}px, ${moveY}px, 0) scale(1.1)`;
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isMobile, isActive]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.2 }}
      className="absolute inset-0 w-full h-full parallax-bg"
    >
      <div 
        ref={backgroundRef}
        className="absolute inset-0 w-full h-full transition-transform duration-[0.4s] ease-out"
        style={{ 
          willChange: 'transform',
          transformStyle: 'preserve-3d'
        }}
      >
        <Image 
          src={destination.image}
          fill
          priority
          sizes="100vw"
          alt={`${destination.name} - ${destination.tagline}`}
          className="object-cover"
          onError={(e) => {
            console.error(`Failed to load image for ${destination.name}`);
            // Fallback to a default image if needed
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1539634936668-036d13a9cc3b';
          }}
        />
        
        {/* Custom color overlay based on destination */}
        <div className={`absolute inset-0 opacity-40 mix-blend-multiply bg-gradient-to-r ${destination.color}`} />
      </div>
    </motion.div>
  );
};