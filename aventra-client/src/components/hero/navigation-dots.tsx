import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { JSX } from 'react';
import { NavigationDotsProps } from '@/types/hero';

/**
 * Navigation dots component for selecting destinations
 * @param {NavigationDotsProps} props - Component properties 
 * @returns {JSX.Element} Rendered component
 */
export const NavigationDots = ({
  destinations,
  activeDestIndex,
  dotsPerPage,
  setActiveDestIndex
}: NavigationDotsProps): JSX.Element => {
  
  // Calculate which "page" of dots the active destination is on
  const activePage = Math.floor(activeDestIndex / dotsPerPage);
  
  // Calculate start and end indices for visible dots
  const startIdx = activePage * dotsPerPage;
  const endIdx = Math.min(startIdx + dotsPerPage, destinations.length);
  
  // Visible destinations for the dots
  const visibleDots = destinations.slice(startIdx, endIdx);
  
  // Navigate to previous/next dot page
  const goToPrevDotPage = () => {
    const newIndex = Math.max(0, activeDestIndex - dotsPerPage);
    setActiveDestIndex(newIndex);
  };
  
  const goToNextDotPage = () => {
    const newIndex = Math.min(destinations.length - 1, activeDestIndex + dotsPerPage);
    setActiveDestIndex(newIndex);
  };

  // Get current destination for styling
  const activeDestination = destinations[activeDestIndex];

  return (
    <div className="flex items-center justify-center gap-2 mb-10">
      {/* Show prev arrow if not at first page */}
      {activePage > 0 && (
        <motion.button
          onClick={goToPrevDotPage}
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
          className={`h-8 w-8 flex items-center justify-center backdrop-blur-sm rounded-full shadow-lg border border-white/10 bg-gradient-to-r hover:opacity-90 ${activeDestination.color}`}
          aria-label="View previous destinations"
        >
          <ChevronLeft className="h-4 w-4 text-white" />
        </motion.button>
      )}
      
      {/* Show only dots for visible destinations */}
      <div className="flex gap-2 px-2 py-1 bg-black/30 backdrop-blur-md rounded-full border border-white/10">
        {visibleDots.map((dest, idx) => {
          const actualIndex = startIdx + idx;
          return (
            <button
              key={dest.id}
              onClick={() => {
                setActiveDestIndex(actualIndex);
              }}
              className={cn(
                "transition-all duration-300 shadow-md rounded-full",
                actualIndex === activeDestIndex 
                  ? `w-16 h-3 bg-gradient-to-r ${dest.buttonGradient}` 
                  : "w-3 h-3 bg-white/40 hover:bg-white/60"
              )}
              aria-label={`View ${dest.name}`}
              aria-current={actualIndex === activeDestIndex ? "true" : "false"}
            />
          );
        })}
      </div>
      
      {/* Show next arrow if not at last page */}
      {(startIdx + dotsPerPage) < destinations.length && (
        <motion.button
          onClick={goToNextDotPage}
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
          className={`h-8 w-8 flex items-center justify-center backdrop-blur-sm rounded-full shadow-lg border border-white/10 bg-gradient-to-r hover:opacity-90 ${activeDestination.color}`}
          aria-label="View more destinations"
        >
          <ChevronRight className="h-4 w-4 text-white" />
        </motion.button>
      )}
    </div>
  );
};