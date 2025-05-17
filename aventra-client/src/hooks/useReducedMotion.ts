import { useEffect, useState } from 'react';

/**
 * Hook to detect if the user prefers reduced motion
 * @returns {boolean} Whether reduced motion is preferred
 */
export function useReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  
  useEffect(() => {
    // Check for the prefers-reduced-motion media query
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    // Set the initial value
    setPrefersReducedMotion(mediaQuery.matches);
    
    // Define a callback function to handle changes
    const handleMediaChange = () => {
      setPrefersReducedMotion(mediaQuery.matches);
    };
    
    // Add the callback as a listener for changes to the media query
    mediaQuery.addEventListener('change', handleMediaChange);
    
    // Remove the listener when the component is unmounted
    return () => {
      mediaQuery.removeEventListener('change', handleMediaChange);
    };
  }, []);
  
  return prefersReducedMotion;
}