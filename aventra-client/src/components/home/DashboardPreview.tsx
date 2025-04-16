"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { Sparkles, Monitor } from "lucide-react"
import { cn } from "@/lib/utils"

const DashboardPreview = () => {
  return (
    <section id="dashboard-preview" className="relative py-24 sm:py-28 md:py-36 overflow-hidden flex items-center justify-center">
      {/* Background with subtle gradients matching hero */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-background/95" />
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 h-[600px] w-[600px] bg-primary/5 rounded-full blur-[120px] opacity-60 animate-[pulse_15s_infinite]" />
        <div className="absolute bottom-0 right-1/4 h-[400px] w-[400px] bg-blue-700/5 rounded-full blur-[100px] opacity-50 animate-[pulse_18s_infinite]" />
        <div className="absolute hidden md:block top-24 left-40 w-8 h-8 rounded-full border border-primary/20 bg-background/50 backdrop-blur-sm" />
      </div>

      <div className="container px-4 sm:px-6 md:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-16 sm:mb-20"
        >
          <h2 className={cn(
            "font-serif text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight",
            "bg-clip-text text-transparent bg-gradient-to-br from-foreground via-foreground/90 to-foreground/80",
            "leading-[1.2] mb-4 sm:mb-6"
          )}>
            Your Digital{" "}
            <span className="relative text-primary/70">
              Travel Companion
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
            className="mt-4 text-muted-foreground max-w-2xl mx-auto font-light tracking-wide text-base sm:text-lg"
          >
            Transform how you plan and experience travel with our intuitive dashboard — bringing together your itineraries, reservations, and personalized recommendations in one elegant interface.
          </motion.p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2 }}
          viewport={{ once: true, margin: "-50px" }}
          className="relative mx-auto max-w-5xl"
        >
          {/* Decorative elements */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl opacity-70 z-0"></div>
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-700/5 rounded-full blur-3xl opacity-70 z-0"></div>
          
          <div className="relative z-10 rounded-xl border border-border/40 bg-background/70 backdrop-blur-sm p-3 sm:p-4 shadow-[0_10px_60px_-15px_rgba(0,0,0,0.25)] hover:shadow-[0_20px_70px_-15px_rgba(0,0,0,0.3)] transition-all duration-500">
            <div className="flex items-center gap-2 mb-3 pl-2">
              <div className="flex gap-1.5">
                <div className="h-3 w-3 rounded-full bg-red-400"></div>
                <div className="h-3 w-3 rounded-full bg-yellow-400"></div>
                <div className="h-3 w-3 rounded-full bg-green-400"></div>
              </div>
              <div className="text-xs text-muted-foreground font-medium">Aventra Dashboard</div>
            </div>
            <div className="aspect-[16/9] overflow-hidden rounded-lg border border-border/20 group">
              <Image
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop"
                alt="Aventra's intelligent travel planning dashboard interface"
                width={1920}
                height={1080}
                className="object-cover group-hover:scale-[1.02] transition-transform duration-700 ease-out"
              />
            </div>
          </div>
          
          {/* Feature highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 mt-8 max-w-4xl mx-auto">
            {[
              {
                title: "Smart Planning",
                description: "AI-powered suggestions based on your preferences and travel style"
              },
              {
                title: "All-in-One Management",
                description: "Seamlessly track reservations, itineraries and local recommendations"
              },
              {
                title: "Real-time Updates",
                description: "Stay informed with instant notifications about your upcoming experiences"
              }
            ].map((feature, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 + (i * 0.1) }}
                viewport={{ once: true }}
                className="bg-background/60 backdrop-blur-sm rounded-xl p-4 border border-border/30"
              >
                <h3 className="font-medium text-base mb-1">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          viewport={{ once: true }}
          className="mt-14 sm:mt-16 text-center"
        >
          <Button 
            size="lg" 
            className="px-8 sm:px-10 py-6 h-auto rounded-full bg-primary hover:bg-primary/90 transition-all duration-300 group shadow-md hover:shadow-xl"
          >
            <Monitor className="h-4 w-4 mr-2 opacity-80" />
            <span className="group-hover:translate-x-0.5 transition-transform duration-300">
              Try the Dashboard
            </span>
            <Sparkles className="h-3.5 w-3.5 opacity-70 ml-2" />
          </Button>
          
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1 }}
            viewport={{ once: true }}
            className="mt-8 flex justify-center"
          >
            <div className="inline-flex items-center gap-2 py-2 px-4 rounded-full bg-background/90 border border-border/30 shadow-sm">
              <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <span className="text-xs">✦</span>
              </div>
              <span className="text-xs sm:text-sm">Seamlessly integrated with your preferences</span>
            </div>
          </motion.div>
        </motion.div>
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

export default DashboardPreview