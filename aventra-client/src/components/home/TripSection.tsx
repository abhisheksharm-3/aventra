"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { motion, useScroll, useTransform } from "framer-motion"
import { Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import { useRef, useState } from "react"

const TripSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  
  // Parallax scrolling effects
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });
  
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
  const imageY = useTransform(scrollYProgress, [0, 1], [0, -30]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 40]);
  
  return (
    <section 
      ref={sectionRef}
      id="trips" 
      className="relative py-24 sm:py-28 md:py-36 lg:py-40 overflow-hidden w-screen flex items-center justify-center"
    >
      {/* Enhanced background with subtle gradients and animation matching hero */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-background/95 to-background" />
        
        {/* Animated gradient blobs - Fixed: Using type: "tween" explicitly */}
        <motion.div 
          animate={{ 
            opacity: [0.6, 0.7],
            scale: [1, 1.05],
          }}
          transition={{ 
            duration: 8, 
            repeat: Infinity, 
            repeatType: "reverse",
            type: "tween"  // Explicitly use tween for multi-keyframe animations
          }}
          className="absolute top-20 -left-40 md:-left-20 h-[600px] w-[600px] bg-primary/5 rounded-full blur-[120px]" 
        />
        
        <motion.div 
          animate={{ 
            opacity: [0.5, 0.7],
            scale: [1, 1.05],
          }}
          transition={{ 
            duration: 12, 
            repeat: Infinity, 
            repeatType: "reverse",
            type: "tween",  // Explicitly use tween
            delay: 2
          }}
          className="absolute bottom-0 -right-40 md:-right-20 h-[600px] w-[600px] bg-blue-700/5 rounded-full blur-[120px]" 
        />
        
        {/* Subtle grain texture for depth - matching hero */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-[url('/noise.png')] bg-repeat opacity-20"></div>
        </div>
      </div>

      <div className="container px-4 sm:px-6 md:px-8 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center max-w-7xl mx-auto">
          {/* Content Column with Parallax */}
          <motion.div
            style={{ y: contentY }}
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            viewport={{ once: true, margin: "-100px" }}
            className="order-2 md:order-1"
          >
            {/* Enhanced section label */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              viewport={{ once: true }}
              className="mb-7 inline-flex"
            >
              <span className="px-4 py-2 rounded-full bg-black/30 backdrop-blur-md border border-white/10 text-white/90 text-sm font-medium shadow-lg">
                AI-Planned Travel
              </span>
            </motion.div>
            
            <h2 className={cn(
              "font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight",
              "bg-clip-text text-transparent bg-gradient-to-br from-foreground via-foreground/90 to-foreground/80",
              "leading-[1.1] mb-6"
            )}>
              Curated{" "}
              <span className="relative inline-block text-primary">
                Journeys
                <motion.span 
                  className="absolute bottom-0 left-0 w-full h-[0.12em] bg-gradient-to-r from-primary/30 via-primary/80 to-primary/30 rounded-full" 
                  initial={{ scaleX: 0, originX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  transition={{ delay: 0.4, duration: 0.7 }}
                  viewport={{ once: true }}
                />
                
                {/* Subtle glow effect */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.8, duration: 0.5 }}
                  className="absolute -inset-x-2 -inset-y-1 bg-primary/10 blur-xl rounded-full -z-10"
                />
              </span>
            </h2>
            
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              viewport={{ once: true }}
              className="text-muted-foreground/90 mb-8 sm:mb-10 font-light tracking-wide leading-relaxed text-lg md:text-xl max-w-lg"
            >
              From weekend escapes to extended adventures, our expertly crafted itineraries ensure every moment of
              your journey is thoughtfully planned and memorable.
            </motion.p>
            
            <motion.ul 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              viewport={{ once: true }}
              className="space-y-4 sm:space-y-5"
            >
              {[
                "Personalized itineraries based on your preferences",
                "Exclusive access to unique accommodations",
                "Insider recommendations from local experts",
                "Seamless booking for all activities",
                "Detailed travel guides and resources",
              ].map((feature, i) => (
                <motion.li 
                  key={i} 
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 + (i * 0.1) }}
                  viewport={{ once: true }}
                  className="flex items-center gap-3 font-light text-sm sm:text-base text-foreground/80"
                >
                  <motion.div 
                    whileHover={{ scale: 1.3 }}
                    className="h-2 w-2 rounded-full bg-gradient-to-r from-primary to-primary/80 shadow-sm shadow-primary/20" 
                  />
                  {feature}
                </motion.li>
              ))}
            </motion.ul>
            
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              viewport={{ once: true }}
              className="mt-10 sm:mt-12"
            >
              <Button 
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className="px-6 sm:px-8 py-6 h-auto rounded-full bg-primary hover:bg-primary/90 transition-colors duration-500 shadow-md hover:shadow-xl group relative overflow-hidden"
              >
                {/* Button background animation - Fixed: Using type: "tween" explicitly */}
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  animate={isHovered ? {
                    opacity: [0, 0.5, 0],
                    scale: [1, 1.1, 1],
                  } : {}}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    type: "tween"  // Explicitly use tween for multi-keyframe animations
                  }}
                />
                
                {/* FIX: Changed animation to only use direct values instead of arrays */}
                <motion.div
                  animate={isHovered ? {
                    scale: 1.1  // Single value instead of array
                  } : {
                    scale: 1
                  }}
                  transition={{
                    duration: 0.6,
                    type: "spring",
                    stiffness: 300
                  }}
                  className="relative flex items-center"
                >
                  <Sparkles className="h-4 w-4 mr-2 opacity-70" />
                  <span className="font-medium group-hover:translate-x-0.5 transition-transform duration-300">
                    Plan Your Journey
                  </span>
                </motion.div>
              </Button>
            </motion.div>
          </motion.div>
          
          {/* Image Column with Parallax */}
          <motion.div
            style={{ y: imageY }}
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
            viewport={{ once: true, margin: "-100px" }}
            className="order-1 md:order-2"
          >
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 group">
              {/* Image container with multiple gradients */}
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/30 via-transparent to-transparent opacity-70 z-10"></div>
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-primary/30 opacity-70 z-10"></div>
              
              {/* Enhanced decorative elements - Fixed: Using type: "tween" explicitly */}
              <motion.div 
                animate={{
                  opacity: [0.5, 0.8],
                  scale: [1, 1.1],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  repeatType: "reverse",
                  type: "tween"  // Explicitly use tween
                }}
                className="absolute -top-5 -right-5 w-28 h-28 bg-blue-700/10 rounded-full blur-2xl opacity-70 z-0"
              />
              
              <motion.div 
                animate={{
                  opacity: [0.5, 0.7],
                  scale: [1, 1.2],
                }}
                transition={{
                  duration: 10,
                  repeat: Infinity,
                  repeatType: "reverse",
                  delay: 1,
                  type: "tween"  // Explicitly use tween
                }}
                className="absolute -bottom-10 -left-10 w-44 h-44 bg-primary/15 rounded-full blur-2xl opacity-70 z-0"
              />
              
              {/* Border glow effect */}
              <div className="absolute inset-0 border border-white/20 rounded-2xl z-20 group-hover:border-primary/30 transition-colors duration-500 pointer-events-none"></div>
              <div className="absolute inset-0 backdrop-blur-[1px] opacity-0 group-hover:opacity-10 transition-opacity duration-500 z-10"></div>
              
              {/* Corner accents */}
              <div className="absolute top-3 left-3 w-10 h-10 border-t-2 border-l-2 border-white/30 rounded-tl-lg z-20 opacity-70 group-hover:opacity-100 group-hover:border-primary/50 transition-all duration-500"></div>
              <div className="absolute bottom-3 right-3 w-10 h-10 border-b-2 border-r-2 border-white/30 rounded-br-lg z-20 opacity-70 group-hover:opacity-100 group-hover:border-primary/50 transition-all duration-500"></div>
              
              {/* Image with parallax effect */}
              <motion.div 
                className="absolute inset-0 w-full h-full" 
                style={{ scale: imageScale }}
              >
                <Image
                  src="https://images.unsplash.com/photo-1533105079780-92b9be482077"
                  alt="Trip planning interface"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
                />
              </motion.div>
              
              {/* Overlay filter */}
              <div className="absolute inset-0 bg-black/10 mix-blend-overlay group-hover:opacity-50 transition-opacity duration-500 z-10"></div>
            </div>
            
            {/* Caption under image */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.9 }}
              viewport={{ once: true }}
              className="mt-4 text-center text-xs text-muted-foreground/70 italic"
            >
              AI-powered trip planning for your unique travel style
            </motion.p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default TripSection