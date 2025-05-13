"use client";

import { useState, useEffect, useRef, useCallback, JSX } from "react";
import { motion, AnimatePresence, useMotionValue } from "framer-motion";
import { Compass } from "lucide-react";
import Image from "next/image";
import { HeroProps } from "@/types/hero";
import { featuredDestinations } from "@/lib/constants/hero";
import { DestinationImage } from "../hero/destination-image";
import { NavigationDots } from "../hero/navigation-dots";
import { ActionButtons } from "../hero/action-buttons";


// Constants
const DOTS_PER_PAGE = 3;
const AUTO_ROTATION_INTERVAL = 8000; // 8 seconds
const SWIPE_THRESHOLD = 50; // Minimum swipe distance

/**
 * Hero section with rotating destinations and interactive elements
 * Provides an engaging entry point to the travel application with
 * dynamic backgrounds, animations, and destination selection.
 * 
 * @param {HeroProps} props - Component properties
 * @returns {JSX.Element} Rendered hero component
 */
export default function Hero({ 
  initialDestination = 0,
  rotationInterval = AUTO_ROTATION_INTERVAL 
}: HeroProps = {}): JSX.Element {
  const [activeDest, setActiveDest] = useState(initialDestination);
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const sectionRef = useRef<HTMLElement | null>(null);
  const touchStartX = useMotionValue(0);
  const touchEndX = useMotionValue(0);
  
  // Active destination
  const destination = featuredDestinations[activeDest];
  
  // Preload next image index
  const nextDestIndex = (activeDest + 1) % featuredDestinations.length;
  
  /**
   * Checks if the device is mobile based on screen width
   */
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Initial check
    checkIfMobile();
    
    // Add event listener for window resize
    window.addEventListener('resize', checkIfMobile);
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);
  
  /**
   * Sets up intersection observer to detect when hero is visible
   */
  useEffect(() => {
    if (!sectionRef.current) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );
    
    observer.observe(sectionRef.current);
    
    return () => {
      observer.disconnect();
    };
  }, []);
  
  /**
   * Auto-rotate featured destinations when not hovered and component is visible
   */
  useEffect(() => {
    if (isHovered || !isVisible) return;
    
    const interval = setInterval(() => {
      setActiveDest((current) => (current + 1) % featuredDestinations.length);
    }, rotationInterval);
    
    return () => clearInterval(interval);
  }, [isHovered, isVisible, rotationInterval]);

  /**
   * Handles the scroll parallax effect
   */
  useEffect(() => {
    const handleScroll = () => {
      if (sectionRef.current) {
        // Different fading behavior based on device
        const fadeDistance = isMobile ? 800 : 500;
        const parallaxStrength = isMobile ? 0.15 : 0.4;
        
        const scrollPos = window.scrollY;
        // Less aggressive opacity transition for mobile
        const opacity = Math.max(0, Math.min(1, 1 - scrollPos / fadeDistance));
        sectionRef.current.style.opacity = opacity.toString();
        
        // Gentler parallax for background on mobile
        const parallaxElements = sectionRef.current.querySelectorAll('.parallax-bg');
        parallaxElements.forEach((el: Element) => {
          if (el instanceof HTMLElement) {
            el.style.transform = `translate3d(0, ${scrollPos * parallaxStrength}px, 0) scale(1.1)`;
          }
        });
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMobile]);

  /**
   * Handle touch swipe interactions for carousel
   */
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.set(e.touches[0].clientX);
  }, [touchStartX]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    touchEndX.set(e.touches[0].clientX);
  }, [touchEndX]);

  const handleTouchEnd = useCallback(() => {
    const diff = touchStartX.get() - touchEndX.get();
    
    if (Math.abs(diff) > SWIPE_THRESHOLD) {
      if (diff > 0) {
        // Swiped left - go to next
        setActiveDest((current) => (current + 1) % featuredDestinations.length);
      } else {
        // Swiped right - go to previous
        setActiveDest((current) => 
          (current - 1 + featuredDestinations.length) % featuredDestinations.length
        );
      }
    }
  }, [touchStartX, touchEndX]);

  /**
   * Updates the hover state for auto-rotation pausing
   */
  const handleHoverChange = useCallback((hovered: boolean) => {
    setIsHovered(hovered);
  }, []);

  return (
    <section 
      ref={sectionRef}
      className="relative w-full min-h-screen flex flex-col items-center overflow-hidden bg-black"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      aria-roledescription="carousel"
      aria-label="Destination showcase"
    >
      {/* Enhanced background overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/25 to-black/60 z-10" />
      
      {/* Added fade at the bottom of the hero section */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent z-20" />
      
      {/* Subtle grain texture for depth */}
      <div className="absolute inset-0 opacity-20 z-10">
        <div className="absolute inset-0 bg-[url('/noise.png')] bg-repeat opacity-20"></div>
      </div>
      
      {/* Decorative floating elements with destination-specific colors */}
      <div className="absolute inset-0 pointer-events-none z-[5] overflow-hidden">
        <motion.div
          animate={{ 
            y: [0, -15, 0],
            rotate: [0, 5, 0]
          }}
          transition={{ 
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className={`absolute top-[20%] left-[15%] w-64 h-64 rounded-full blur-[100px] opacity-70 animate-drift-slow bg-gradient-to-r ${destination.color}`}
        />
        <motion.div
          animate={{ 
            y: [0, 20, 0],
            rotate: [0, -7, 0]
          }}
          transition={{ 
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute bottom-[25%] right-[10%] w-80 h-80 bg-blue-500/20 rounded-full blur-[120px] opacity-70 animate-drift-medium"
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ 
            duration: 15, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-[50%] left-[70%] w-40 h-40 bg-cyan-500/15 rounded-full blur-[80px] opacity-60 animate-drift-fast"
        />
      </div>
      
      {/* Rotating background images with mouse parallax */}
      <AnimatePresence mode="wait">
        <DestinationImage 
          key={activeDest}
          destination={destination}
          isMobile={isMobile}
          isActive={true}
        />
      </AnimatePresence>
      
      {/* Preload next image */}
      <div className="hidden" aria-hidden="true">
        <Image
          src={featuredDestinations[nextDestIndex].image}
          width={1}
          height={1}
          alt="Preload next"
        />
      </div>
      
      {/* Main content with improved text readability */}
      <div className="relative z-20 container mx-auto px-4 h-full flex flex-col justify-center items-center text-center pt-28 pb-20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-4xl mx-auto"
        >
          {/* Enhanced badge with destination-specific colors */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mb-8 inline-flex"
          >
            <span className={`px-5 py-2 rounded-full backdrop-blur-md border border-white/10 text-white shadow-lg flex items-center gap-2 bg-gradient-to-r ${destination.color}`}>
              <span className={`flex items-center justify-center w-5 h-5 rounded-full bg-gradient-to-r ${destination.buttonGradient}`}>
                <Compass className="h-3 w-3 text-white" />
              </span>
              <span className="text-sm font-medium">AI-Powered Travel</span>
            </span>
          </motion.div>
          
          <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl font-medium tracking-tight leading-[1.1] mb-6 text-white drop-shadow-[0_2px_3px_rgba(0,0,0,0.6)]">
            <span className="block mb-2 text-white/95">Explore</span>
            <AnimatePresence mode="wait">
              <motion.span
                key={activeDest}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-white/90 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
              >
                {destination.name}
              </motion.span>
            </AnimatePresence>
            <span className="block mt-2 text-white/95">with AI</span>
          </h1>
            
          <AnimatePresence mode="wait">
            <motion.p
              key={activeDest}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="text-lg sm:text-xl text-white/90 mt-4 mb-8 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] max-w-2xl mx-auto font-medium"
            >
              {destination.tagline}. Let our AI create your perfect itinerary in seconds, tailored to your preferences and travel style.
            </motion.p>
          </AnimatePresence>
          
          {/* Navigation dots component */}
          <NavigationDots
            destinations={featuredDestinations}
            activeDestIndex={activeDest}
            dotsPerPage={DOTS_PER_PAGE}
            setActiveDestIndex={setActiveDest}
          />
          
          {/* Action buttons component */}
          <ActionButtons
            destination={destination}
            onHoverChange={handleHoverChange}
          />
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mt-6 flex items-center justify-center gap-4"
          >
            <div className="h-px w-12 bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
            <p className="text-xs text-white/70 text-center drop-shadow">
              No credit card required • Free personalized plan
            </p>
            <div className="h-px w-12 bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
          </motion.div>
        </motion.div>
      </div>
      
      {/* Destination counter with destination colors */}
      <div className="absolute bottom-6 right-6 z-20">
        <div className={`px-3 py-1.5 rounded-full border border-white/10 text-xs text-white shadow-lg bg-gradient-to-r ${destination.color}`}>
          <span className="text-white font-medium">{activeDest + 1}</span>
          <span className="mx-1">/</span>
          <span>{featuredDestinations.length}</span>
        </div>
      </div>
    </section>
  );
}