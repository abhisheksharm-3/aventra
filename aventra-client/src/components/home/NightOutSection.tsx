"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { Sparkles, Users } from "lucide-react"
import { cn } from "@/lib/utils"
import { useState } from "react"

const NightsOutSection = () => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <section id="nights-out" className="relative py-24 sm:py-28 md:py-36 overflow-hidden flex items-center justify-center">
      {/* Background with subtle gradients matching hero */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-background/95" />
        <div className="absolute top-40 -right-40 md:-right-20 h-[500px] w-[500px] bg-primary/5 rounded-full blur-[100px] opacity-60 animate-[pulse_12s_infinite]" />
        <div className="absolute bottom-20 -left-40 md:-left-20 h-[400px] w-[400px] bg-blue-700/5 rounded-full blur-[100px] opacity-60 animate-[pulse_16s_infinite]" />
        <div className="absolute hidden md:block top-40 right-32 w-6 h-6 rounded-full bg-primary/10" />
        
        {/* Subtle grain texture for depth - matching hero */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-[url('/noise.png')] bg-repeat opacity-20"></div>
        </div>
      </div>

      <div className="container px-4 sm:px-6 md:px-8">
        <div className="grid md:grid-cols-2 gap-10 lg:gap-20 items-center max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true, margin: "-100px" }}
            className="order-2 md:order-1"
          >
            <div className="relative aspect-[4/3] rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-500 group">
              <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/20 via-transparent to-transparent opacity-60 z-10"></div>
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-purple-500/20 opacity-60 z-10"></div>
              
              {/* Decorative elements */}
              <div className="absolute -top-4 -left-4 w-20 h-20 bg-blue-700/10 rounded-full blur-xl opacity-70 z-0"></div>
              <div className="absolute -bottom-8 -right-8 w-36 h-36 bg-primary/10 rounded-full blur-2xl opacity-70 z-0"></div>
              
              {/* Border glow effect */}
              <div className="absolute inset-0 border border-border rounded-xl z-20 group-hover:border-purple-500/30 transition-colors duration-500 pointer-events-none"></div>
              
              {/* Corner accents */}
              <div className="absolute top-3 left-3 w-10 h-10 border-t-2 border-l-2 border-border rounded-tl-lg z-20 opacity-70 group-hover:opacity-100 group-hover:border-purple-500/50 transition-all duration-500"></div>
              <div className="absolute bottom-3 right-3 w-10 h-10 border-b-2 border-r-2 border-border rounded-br-lg z-20 opacity-70 group-hover:opacity-100 group-hover:border-purple-500/50 transition-all duration-500"></div>
              
              <Image
                src="https://images.unsplash.com/photo-1541532713592-79a0317b6b77?q=80&w=1788&auto=format&fit=crop"
                alt="Friends night out"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
                className="object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
              />
              
              {/* Overlay filter */}
              <div className="absolute inset-0 bg-black/10 mix-blend-overlay group-hover:opacity-50 transition-opacity duration-500 z-10"></div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            viewport={{ once: true, margin: "-100px" }}
            className="order-1 md:order-2"
          >
            {/* Enhanced section label matching hero styles */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              viewport={{ once: true }}
              className="mb-7 inline-flex"
            >
              <span className="px-5 py-2 rounded-full bg-gradient-to-r from-purple-500/20 to-fuchsia-500/20 backdrop-blur-md border border-border text-foreground/90 text-sm font-medium shadow-lg flex items-center gap-2">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-gradient-to-r from-purple-500 to-fuchsia-500">
                  <Users className="h-3 w-3 text-primary-foreground" />
                </span>
                <span>Social Experiences</span>
              </span>
            </motion.div>
            
            <h2 className={cn(
              "font-serif text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight",
              "bg-clip-text text-transparent bg-gradient-to-br from-foreground via-foreground/90 to-foreground/80",
              "leading-[1.2] mb-6"
            )}>
              Social{" "}
              <span className="relative text-purple-500">
                Gatherings
                <motion.span 
                  className="absolute bottom-1 left-0 w-full h-[0.12em] bg-gradient-to-r from-purple-500/30 via-purple-500/80 to-purple-500/30 rounded-full" 
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
                  className="absolute -inset-x-2 -inset-y-1 bg-purple-500/10 blur-xl rounded-full -z-10"
                />
              </span>
            </h2>
            
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              viewport={{ once: true }}
              className="text-muted-foreground mb-8 sm:mb-10 font-light tracking-wide leading-relaxed text-base sm:text-lg"
            >
              Elevate your social calendar with carefully selected venues and experiences that bring friends
              together for unforgettable evenings.
            </motion.p>
            
            <motion.ul 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              viewport={{ once: true }}
              className="space-y-4 sm:space-y-5"
            >
              {[
                "Curated selection of trending venues",
                "Exclusive event access and reservations",
                "Themed experience packages",
                "Group coordination tools",
                "Personalized recommendations based on preferences",
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
                    className="h-2 w-2 rounded-full bg-gradient-to-r from-purple-500 to-fuchsia-500/80 shadow-sm shadow-purple-500/20" 
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
                className="px-6 sm:px-8 py-6 h-auto rounded-full bg-gradient-to-r from-purple-500 to-fuchsia-500 hover:from-purple-600 hover:to-fuchsia-600 text-white shadow-[0_8px_16px_rgba(168,85,247,0.3)] transition-all duration-500 group relative overflow-hidden"
              >
                {/* Button glow effect on hover */}
                <motion.div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    boxShadow: "inset 0 0 20px 5px rgba(255,255,255,0.3)"
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
                  <Sparkles className="h-3.5 w-3.5 opacity-70 mr-2" />
                  <span className="group-hover:translate-x-0.5 transition-transform duration-300">Discover Venues</span>
                </motion.div>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Bottom wave decoration similar to hero */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-0 transform">
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

export default NightsOutSection