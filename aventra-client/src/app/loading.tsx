"use client"

import { Compass } from "lucide-react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center relative overflow-hidden">
      {/* Background effects matching hero */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-background/95" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 h-[600px] w-[600px] bg-primary/5 rounded-full blur-[120px] opacity-60 animate-[pulse_8s_infinite]" />
        <div className="absolute bottom-0 -right-40 md:-right-20 h-[400px] w-[400px] bg-blue-700/5 rounded-full blur-[100px] opacity-50 animate-[pulse_12s_infinite]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center gap-6 relative z-10"
      >
        {/* Logo with glow effect */}
        <div className="relative">
          <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl opacity-70 scale-150"></div>
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ 
              duration: 4,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            <Compass className="h-12 w-12 text-primary relative z-10" />
          </motion.div>
        </div>

        {/* Brand name with gradient */}
        <h1 className={cn(
          "font-serif text-2xl sm:text-3xl tracking-wide",
          "bg-clip-text text-transparent bg-gradient-to-r from-foreground via-foreground/90 to-foreground/80",
        )}>
          Aventra
        </h1>

        {/* Loading text */}
        <div className="text-center">
          <motion.p
            initial={{ opacity: 0.5 }}
            animate={{ opacity: 1 }}
            transition={{ 
              duration: 1.5, 
              repeat: Infinity, 
              repeatType: "reverse" 
            }}
            className="text-muted-foreground font-light tracking-wide text-base sm:text-lg"
          >
            Curating your experience
            <motion.span
              animate={{ opacity: [0, 1, 1, 1, 0] }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                times: [0, 0.2, 0.4, 0.6, 1]
              }}
            >
              ...
            </motion.span>
          </motion.p>
        </div>

        {/* Loading bar */}
        <div className="w-48 sm:w-56 h-1.5 bg-border/30 rounded-full overflow-hidden mt-2">
          <motion.div 
            className="h-full bg-gradient-to-r from-primary/60 to-primary rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ 
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>
        
        {/* Decorative element */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mt-8 flex justify-center"
        >
          <div className="inline-flex items-center gap-2 py-2 px-4 rounded-full bg-background/90 border border-border/30 shadow-sm">
            <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <span className="text-xs">✨</span>
            </div>
            <span className="text-xs sm:text-sm">Personalizing your journey</span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}