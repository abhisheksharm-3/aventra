"use client"

import { Compass } from "lucide-react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center relative overflow-hidden">
      {/* Background effects matching hero */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-background/95" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 h-[600px] w-[600px] bg-primary/5 rounded-full blur-[120px] opacity-60 animate-[pulse_8s_infinite]" />
        <div className="absolute bottom-0 -right-40 md:-right-20 h-[400px] w-[400px] bg-blue-700/5 rounded-full blur-[100px] opacity-50 animate-[pulse_12s_infinite]" />
        <div className="absolute hidden md:block top-40 right-32 w-6 h-6 rounded-full bg-primary/10" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="flex flex-col items-center gap-8 relative z-10 px-4 text-center max-w-md"
      >
        {/* 404 with glow effect */}
        <div className="relative">
          <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl opacity-70 scale-150"></div>
          <div className="relative flex items-center gap-3 z-10">
            <Compass className="h-10 w-10 sm:h-12 sm:w-12 text-primary" />
            <div className="font-serif text-5xl sm:text-6xl text-primary/70 tracking-wide">
              404
            </div>
          </div>
        </div>

        {/* Page not found heading */}
        <h1 className={cn(
          "font-serif text-2xl sm:text-3xl md:text-4xl font-medium tracking-tight",
          "bg-clip-text text-transparent bg-gradient-to-br from-foreground via-foreground/90 to-foreground/80",
          "leading-[1.2] mb-2"
        )}>
          Page{" "}
          <span className="relative text-primary/70">
            Not Found
            <motion.span 
              className="absolute bottom-1 left-0 w-full h-[0.12em] bg-primary/60 rounded-full" 
              initial={{ scaleX: 0, originX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.4, duration: 0.7 }}
            />
          </span>
        </h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="text-muted-foreground font-light tracking-wide text-base sm:text-lg"
        >
          The experience you&apos;re looking for seems to have wandered off the map. Let&apos;s guide you back to your journey.
        </motion.p>

        {/* CTA button */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-4"
        >
          <Button 
            asChild
            className="px-6 sm:px-8 py-6 h-auto rounded-full bg-primary hover:bg-primary/90 transition-colors duration-300 shadow-md hover:shadow-lg group"
          >
            <Link href="/">
              <Compass className="h-4 w-4 mr-2 opacity-80" />
              <span className="group-hover:translate-x-0.5 transition-transform duration-300">Return to Home</span>
            </Link>
          </Button>
        </motion.div>
        
        {/* Decorative element */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="mt-6"
        >
          <div className="inline-flex items-center gap-2 py-2 px-4 rounded-full bg-background/90 border border-border/30 shadow-sm">
            <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <span className="text-xs">✦</span>
            </div>
            <span className="text-xs sm:text-sm">More adventures await you</span>
          </div>
        </motion.div>
      </motion.div>

      {/* Bottom wave decoration */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-0 transform">
        <svg className="relative block w-full h-[30px] sm:h-[40px]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path 
            d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" 
            className="fill-background/60 dark:fill-background/40"
            opacity=".25"
          />
        </svg>
      </div>
    </div>
  )
}