"use client"

import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { Sparkles, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { useState } from "react"

const CTASection = () => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <section id="cta" className="relative py-24 sm:py-28 md:py-36 overflow-hidden flex items-center justify-center">
      {/* Background gradients */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/90 to-primary"></div>
        <div className="absolute top-0 -left-40 md:-left-20 h-[500px] w-[500px] bg-primary-foreground/10 rounded-full blur-[100px] opacity-60 animate-[pulse_10s_infinite]"></div>
        <div className="absolute bottom-0 -right-40 md:-right-20 h-[500px] w-[500px] bg-blue-300/10 rounded-full blur-[100px] opacity-60 animate-[pulse_15s_infinite]"></div>
        
        {/* Subtle grain texture for depth - matching hero */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-[url('/noise.png')] bg-repeat opacity-20"></div>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute hidden md:block top-20 left-20 w-8 h-8 rounded-full border border-primary-foreground/20 bg-primary-foreground/10 backdrop-blur-sm"></div>
      <div className="absolute hidden md:block bottom-32 right-24 w-12 h-12 rounded-full border border-primary-foreground/20 bg-primary-foreground/10 backdrop-blur-sm"></div>
      <div className="absolute hidden md:block top-40 right-32 w-6 h-6 rounded-full bg-primary-foreground/10"></div>
      
      {/* Animated floating elements */}
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
        className="absolute top-[30%] left-[5%] w-24 h-24 rounded-full bg-primary-foreground/5 blur-[30px] opacity-70 pointer-events-none"
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
        className="absolute bottom-[15%] right-[5%] w-32 h-32 rounded-full bg-primary-foreground/5 blur-[40px] opacity-70 pointer-events-none"
      />
      
      <div className="container px-4 sm:px-6 md:px-8 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center max-w-3xl mx-auto"
        >
          <h2 className={cn(
            "font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight",
            "bg-clip-text text-transparent bg-gradient-to-br from-primary-foreground via-primary-foreground/90 to-primary-foreground/80",
            "leading-[1.2] mb-6"
          )}>
            Elevate Your{" "}
            <span className="relative text-white/90">
              Experiences
              <motion.span 
                className="absolute bottom-1 left-0 w-full h-[0.15em] bg-gradient-to-r from-white/40 via-white/80 to-white/40 rounded-full" 
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
                className="absolute -inset-x-2 -inset-y-1 bg-white/10 blur-xl rounded-full -z-10"
              />
            </span>
          </h2>
          
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            viewport={{ once: true }}
            className="mt-6 sm:mt-8 max-w-2xl mx-auto text-primary-foreground/90 font-light tracking-wide text-base sm:text-lg md:text-xl"
          >
            Join our community of discerning adventurers and begin crafting unforgettable moments
            tailored to your unique preferences and aspirations.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            viewport={{ once: true }}
            className="mt-10 sm:mt-14 flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center"
          >
            <Button 
              size="lg" 
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              className="px-8 sm:px-10 py-6 h-auto rounded-full bg-gradient-to-r from-primary-foreground/90 to-primary-foreground text-primary hover:from-primary-foreground hover:to-primary-foreground/90 transition-all duration-300 shadow-md hover:shadow-lg group relative overflow-hidden"
            >
              {/* Button glow effect on hover */}
              <motion.div 
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  boxShadow: "inset 0 0 20px 5px rgba(255,255,255,0.2)"
                }}
              />
              
              <motion.div
                animate={isHovered ? {
                  scale: 1.1
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
                <span className="group-hover:translate-x-0.5 transition-transform duration-300">Learn More</span>
                <ArrowRight className="h-4 w-4 ml-2 opacity-80" />
              </motion.div>
            </Button>
            
            <Button 
              size="lg" 
              variant="default" 
              className="px-8 sm:px-10 py-6 h-auto rounded-full bg-white text-primary hover:bg-white/90 transition-all duration-300 shadow-md hover:shadow-lg group border border-white/20 relative overflow-hidden"
            >
              {/* Button glow effect on hover */}
              <motion.div 
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  boxShadow: "inset 0 0 20px 5px rgba(0,0,0,0.05)"
                }}
              />
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="relative flex items-center"
              >
                <Sparkles className="h-3.5 w-3.5 opacity-70 mr-2" />
                <span className="group-hover:translate-x-0.5 transition-transform duration-300">Begin Your Journey</span>
              </motion.div>
            </Button>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            viewport={{ once: true }}
            className="mt-10 flex justify-center"
          >
            <div className="inline-flex items-center gap-2.5 py-2.5 px-5 rounded-full bg-primary-foreground/10 backdrop-blur-md border border-primary-foreground/20 shadow-lg">
              <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-white/10 flex items-center justify-center text-white">
                <motion.span 
                  animate={{ 
                    scale: [1, 1.2],
                    rotate: [0, 10]
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "easeInOut"
                  }}
                  className="text-base sm:text-lg"
                >
                  ✦
                </motion.span>
              </div>
              <span className="text-xs sm:text-sm text-primary-foreground/90">Personalized experiences awaiting you</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
      
      {/* Wave decoration */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-0 transform rotate-180">
        <svg className="relative block w-full h-[30px] sm:h-[40px]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path 
            d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" 
            className="fill-background/60 dark:fill-background/40"
            opacity=".25"
          />
        </svg>
      </div>
    </section>
  )
}

export default CTASection