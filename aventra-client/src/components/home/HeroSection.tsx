"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useMotionValue } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

// Enhanced destination data with expanded locations - keeping all destinations
const featuredDestinations = [
  {
    id: "kyoto",
    name: "Kyoto",
    tagline: "Ancient Traditions",
    image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=2070&auto=format&fit=crop",
    color: "from-rose-500/40 to-orange-500/40"
  },
  {
    id: "seoul",
    name: "Seoul",
    tagline: "Neon & Tradition",
    image: "https://images.unsplash.com/photo-1540998145333-e2eef1a9822d",
    color: "from-purple-500/40 to-fuchsia-500/40"
  },
  {
    id: "bangkok",
    name: "Bangkok",
    tagline: "Street Life & Temples",
    image: "https://images.unsplash.com/photo-1508009603885-50cf7c579365?q=80&w=2070&auto=format&fit=crop",
    color: "from-amber-500/40 to-yellow-500/40"
  },
  {
    id: "singapore",
    name: "Singapore",
    tagline: "Futuristic Garden City",
    image: "https://images.unsplash.com/photo-1565967511849-76a60a516170?q=80&w=2071&auto=format&fit=crop",
    color: "from-teal-500/40 to-cyan-500/40"
  },
  {
    id: "bali",
    name: "Bali",
    tagline: "Island Paradise",
    image: "https://images.unsplash.com/photo-1573790387438-4da905039392?q=80&w=2025&auto=format&fit=crop",
    color: "from-emerald-500/40 to-teal-500/40"
  },
  {
    id: "ulaanbaatar",
    name: "Mongolia",
    tagline: "Vast Steppes & Nomads",
    image: "https://images.unsplash.com/photo-1602207072074-bd868c14c801",
    color: "from-amber-600/40 to-yellow-700/40"
  },
  {
    id: "jeju",
    name: "Jeju",
    tagline: "Volcanic Wonder",
    image: "https://images.unsplash.com/photo-1616798249081-30877e213b16",
    color: "from-green-500/40 to-emerald-500/40"
  },
  {
    id: "dubai",
    name: "Dubai",
    tagline: "Desert Luxury",
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=2070&auto=format&fit=crop",
    color: "from-amber-400/40 to-yellow-600/40"
  },
  {
    id: "beijing",
    name: "Beijing",
    tagline: "Ancient Empire",
    image: "https://images.unsplash.com/photo-1584450150050-4b9bdbd51f68?q=80&w=2070&auto=format&fit=crop",
    color: "from-red-500/40 to-orange-600/40"
  },
  {
    id: "istanbul",
    name: "Istanbul",
    tagline: "Where Continents Meet",
    image: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200",
    color: "from-blue-600/40 to-sky-400/40"
  },
  {
    id: "santorini",
    name: "Santorini",
    tagline: "Mediterranean Dreams",
    image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?q=80&w=2066&auto=format&fit=crop",
    color: "from-sky-500/40 to-blue-600/40"
  },
  {
    id: "hokkaido",
    name: "Hokkaido",
    tagline: "Winter Wonderland",
    image: "https://images.unsplash.com/photo-1629725593792-727bbe2255b2",
    color: "from-blue-500/40 to-indigo-500/40"
  },
  {
    id: "bergen",
    name: "Bergen",
    tagline: "Nordic Charm",
    image: "https://images.unsplash.com/photo-1601581875309-fafbf2d3ed3a?q=80&w=2074&auto=format&fit=crop",
    color: "from-indigo-500/40 to-blue-600/40"
  },
  {
    id: "cairo",
    name: "Cairo",
    tagline: "Land of Pharaohs",
    image: "https://images.unsplash.com/photo-1572252009286-268acec5ca0a",
    color: "from-yellow-700/40 to-amber-800/40"
  },
  {
    id: "moscow",
    name: "Moscow",
    tagline: "Golden Domes & History",
    image: "https://images.unsplash.com/photo-1513326738677-b964603b136d?q=80&w=2049&auto=format&fit=crop",
    color: "from-slate-600/40 to-gray-700/40"
  },
  {
    id: "chandigarh",
    name: "Chandigarh",
    tagline: "Planned Perfection",
    image: "https://images.unsplash.com/photo-1633145910107-2875e33d8185",
    color: "from-orange-500/40 to-amber-600/40"
  },
  {
    id: "marrakech",
    name: "Marrakech",
    tagline: "Desert Gem",
    image: "https://images.unsplash.com/photo-1597212618440-806262de4f6b",
    color: "from-red-600/40 to-orange-500/40"
  },
  {
    id: "delhi",
    name: "Delhi",
    tagline: "Cultural Capital",
    image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?q=80&w=2070&auto=format&fit=crop",
    color: "from-orange-500/40 to-amber-600/40"
  },
  {
    id: "pyongyang",
    name: "Pyongyang",
    tagline: "Monumental Architecture",
    image: "https://images.unsplash.com/photo-1601733969381-9fb824a94084",
    color: "from-red-700/40 to-rose-600/40"
  },
  {
    id: "capetown",
    name: "Cape Town",
    tagline: "Where Mountains Meet Sea",
    image: "https://images.unsplash.com/photo-1580060839134-75a5edca2e99",
    color: "from-blue-500/40 to-teal-600/40"
  }
];

export default function Hero() {
  const [activeDest, setActiveDest] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const sectionRef = useRef<HTMLElement | null>(null);
  const touchStartX = useMotionValue(0);
  const touchEndX = useMotionValue(0);
  
  // Number of dots to show at once
  const dotsPerPage = 4;
  
  // Calculate which "page" of dots the active destination is on
  const activePage = Math.floor(activeDest / dotsPerPage);
  
  // Calculate start and end indices for visible dots
  const startIdx = activePage * dotsPerPage;
  const endIdx = Math.min(startIdx + dotsPerPage, featuredDestinations.length);
  
  // Visible destinations for the dots
  const visibleDots = featuredDestinations.slice(startIdx, endIdx);
  
  // Preload next image
  const nextDestIndex = (activeDest + 1) % featuredDestinations.length;
  
  // Check if device is mobile
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
  
  // Auto-rotate featured destinations
  useEffect(() => {
    if (isHovered) return;
    
    const interval = setInterval(() => {
      setActiveDest((current) => (current + 1) % featuredDestinations.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [isHovered]);

  // Handle touch swipe for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.set(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.set(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    const diff = touchStartX.get() - touchEndX.get();
    
    if (Math.abs(diff) > 50) { // Minimum swipe distance
      if (diff > 0) {
        // Swiped left - go to next
        setActiveDest((current) => (current + 1) % featuredDestinations.length);
      } else {
        // Swiped right - go to previous
        setActiveDest((current) => (current - 1 + featuredDestinations.length) % featuredDestinations.length);
      }
    }
  };

  // Navigate to previous/next dot page
  const goToPrevDotPage = () => {
    const newIndex = Math.max(0, activeDest - dotsPerPage);
    setActiveDest(newIndex);
  };
  
  const goToNextDotPage = () => {
    const newIndex = Math.min(featuredDestinations.length - 1, activeDest + dotsPerPage);
    setActiveDest(newIndex);
  };

  // Improved parallax effect for both mobile and desktop
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
            el.style.transform = `translateY(${scrollPos * parallaxStrength}px)`;
          }
        });
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMobile]);

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
      {/* Enhanced background overlay for better text readability - without vignette */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/25 to-black/60 z-10" />
      
      {/* Added fade at the bottom of the hero section */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent z-20" />
      
      {/* Subtle grain texture for depth */}
      <div className="absolute inset-0 opacity-20 z-10">
        <div className="absolute inset-0 bg-[url('/noise.png')] bg-repeat opacity-20"></div>
      </div>
      
      {/* Rotating background images */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeDest}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2 }}
          className="absolute inset-0 w-full h-full parallax-bg"
        >
          <Image 
            src={featuredDestinations[activeDest].image}
            fill
            priority
            alt={`${featuredDestinations[activeDest].name} - ${featuredDestinations[activeDest].tagline}`}
            className="object-cover"
          />
        </motion.div>
      </AnimatePresence>
      
      {/* Preload next image */}
      <div className="hidden">
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
          {/* Subtle badge above heading */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mb-8 inline-flex"
          >
            <span className="px-4 py-2 rounded-full bg-black/30 backdrop-blur-md border border-white/10 text-white/90 text-sm font-medium shadow-lg">
              AI-Powered Travel
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
                {featuredDestinations[activeDest].name}
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
              {featuredDestinations[activeDest].tagline}. Let our AI create your perfect itinerary in seconds, tailored to your preferences and travel style.
            </motion.p>
          </AnimatePresence>
          
          {/* Limited destination selector dots with navigation arrows */}
          <div className="flex items-center justify-center gap-2 mb-10">
            {/* Show prev arrow if not at first page */}
            {activePage > 0 && (
              <motion.button
                onClick={goToPrevDotPage}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                className="h-6 w-6 flex items-center justify-center bg-black/30 hover:bg-black/40 text-white/80 hover:text-white backdrop-blur-sm rounded-full shadow-md"
              >
                <ChevronLeft className="h-4 w-4" />
              </motion.button>
            )}
            
            {/* Show only dots for visible destinations */}
            {visibleDots.map((dest, idx) => {
              const actualIndex = startIdx + idx;
              return (
                <button
                  key={dest.id}
                  onClick={() => {
                    setActiveDest(actualIndex);
                  }}
                  className={cn(
                    "h-3 md:h-2.5 rounded-full transition-all duration-300 shadow-md",
                    actualIndex === activeDest 
                      ? "w-10 md:w-8 bg-white" 
                      : "w-3 md:w-2.5 bg-white/40 hover:bg-white/60"
                  )}
                  aria-label={`View ${dest.name}`}
                  aria-current={actualIndex === activeDest ? "true" : "false"}
                />
              );
            })}
            
            {/* Show next arrow if not at last page */}
            {(startIdx + dotsPerPage) < featuredDestinations.length && (
              <motion.button
                onClick={goToNextDotPage}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                className="h-6 w-6 flex items-center justify-center bg-black/30 hover:bg-black/40 text-white/80 hover:text-white backdrop-blur-sm rounded-full shadow-md"
              >
                <ChevronRight className="h-4 w-4" />
              </motion.button>
            )}
          </div>
          
          {/* Enhanced dual CTA buttons with better contrast */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mt-8">
            <Link href={`/plan?destination=${encodeURIComponent(featuredDestinations[activeDest].name)}`}>
              <motion.div
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.2)" }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  "group relative overflow-hidden rounded-full",
                  "px-8 py-4 shadow-lg",
                  "bg-white hover:bg-white text-black"
                )}
              >
                {/* Gradient highlight on hover */}
                <div className="absolute inset-0 w-full h-full opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className={cn(
                    "absolute inset-0 blur-xl bg-gradient-to-r",
                    featuredDestinations[activeDest].color.replace('/40', '/15')
                  )} />
                </div>
                
                <span className="relative flex items-center justify-center gap-2 text-lg font-medium">
                  Create My {featuredDestinations[activeDest].name} Trip
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  >
                    <ArrowRight className="h-5 w-5" />
                  </motion.div>
                </span>
              </motion.div>
            </Link>
            
            <Link href="/inspiration">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.2)" }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-4 rounded-full text-lg font-medium bg-black/40 hover:bg-black/50 text-white backdrop-blur-md border border-white/20 transition-colors duration-300 shadow-lg"
              >
                Explore Ideas
              </motion.button>
            </Link>
          </div>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-xs text-white/70 text-center mt-4 drop-shadow"
          >
            No credit card required • Free personalized plan
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}