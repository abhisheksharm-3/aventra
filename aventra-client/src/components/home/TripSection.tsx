"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

const TripSection = () => {
  return (
    <section id="trips" className="relative py-24 sm:py-28 md:py-36 overflow-hidden">
      {/* Background with subtle gradients matching hero */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-background/95" />
        <div className="absolute top-20 -left-40 md:-left-20 h-[500px] w-[500px] bg-primary/5 rounded-full blur-[100px] opacity-60 animate-[pulse_10s_infinite]" />
        <div className="absolute bottom-0 -right-40 md:-right-20 h-[500px] w-[500px] bg-blue-700/5 rounded-full blur-[100px] opacity-60 animate-[pulse_14s_infinite]" />
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
            <h2 className={cn(
              "font-serif text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight",
              "bg-clip-text text-transparent bg-gradient-to-br from-foreground via-foreground/90 to-foreground/80",
              "leading-[1.2] mb-6"
            )}>
              Curated{" "}
              <span className="relative text-primary/70">
                Journeys
                <motion.span 
                  className="absolute bottom-1 left-0 w-full h-[0.12em] bg-primary/60 rounded-full" 
                  initial={{ scaleX: 0, originX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  transition={{ delay: 0.4, duration: 0.7 }}
                  viewport={{ once: true }}
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
                  className="flex items-center gap-3 font-light text-sm sm:text-base"
                >
                  <div className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-primary to-primary/80" />
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
                className="px-6 sm:px-8 py-6 h-auto rounded-full bg-primary hover:bg-primary/90 transition-colors duration-300 shadow-md hover:shadow-lg group"
              >
                <Sparkles className="h-3.5 w-3.5 opacity-70 mr-2" />
                <span className="group-hover:translate-x-0.5 transition-transform duration-300">Plan Your Journey</span>
              </Button>
            </motion.div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            viewport={{ once: true, margin: "-100px" }}
            className="order-1 md:order-2"
          >
            <div className="relative aspect-[4/3] rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-500 group">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 via-transparent to-transparent opacity-60 z-10"></div>
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-primary/20 opacity-60 z-10"></div>
              
              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-blue-700/10 rounded-full blur-xl opacity-70 z-0"></div>
              <div className="absolute -bottom-8 -left-8 w-36 h-36 bg-primary/10 rounded-full blur-2xl opacity-70 z-0"></div>
              
              <div className="absolute inset-0 border border-white/10 rounded-xl z-20 pointer-events-none"></div>
              
              <Image
                src="https://images.unsplash.com/photo-1533105079780-92b9be482077"
                alt="Trip planning interface"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
                className="object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
              />
            </div>
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

export default TripSection