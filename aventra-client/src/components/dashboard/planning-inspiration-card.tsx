"use client";

import { motion } from "framer-motion";
import { 
  ArrowRight, 
  MapPin, 
  CalendarDays, 
  Users, 
  Sparkles,
  Globe
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";

/**
 * Planning Inspiration Card Component
 * 
 * Displays a featured card that highlights AI-powered trip planning capabilities 
 * with inspirational imagery and quick action buttons to help users start planning.
 * 
 * @returns React component with planning inspiration UI
 */
export default function PlanningInspirationCard() {
  return (
    <Card className="w-full overflow-hidden border-border/40 shadow-sm py-0">
      <CardContent className="p-0 relative">
        {/* Banner image with gradient overlay */}
        <div className="h-40 md:h-48 relative">
          <Image
            src="https://images.unsplash.com/photo-1626359909709-8067b64e1655"
            alt="World travel destinations"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20" />
          
          {/* Floating stats cards */}
          <div className="absolute inset-0 hidden md:flex items-center justify-between px-10">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="bg-white/10 backdrop-blur-md rounded-lg py-2 px-3 text-white text-sm shadow-lg"
            >
              <div className="font-medium">190+ Countries</div>
              <div className="text-xs text-white/70">Ready to explore</div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="bg-white/10 backdrop-blur-md rounded-lg py-2 px-3 text-white text-sm shadow-lg"
            >
              <div className="font-medium">3-minute setup</div>
              <div className="text-xs text-white/70">AI-powered planning</div>
            </motion.div>
          </div>
        </div>
        
        {/* Content section */}
        <div className="p-6 md:p-8">
          <div className="grid md:grid-cols-5 gap-6 lg:gap-10">
            {/* Main content - takes up 3/5 of space */}
            <div className="md:col-span-3">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <div className="inline-flex items-center gap-1.5 text-sm text-primary font-medium px-2.5 py-1 bg-primary/10 rounded-full mb-4">
                  <Sparkles className="h-3.5 w-3.5" />
                  AI Trip Planner
                </div>
                
                <h3 className="text-2xl font-serif font-medium mb-2">
                  Your dream vacation, expertly planned
                </h3>
                
                <p className="text-muted-foreground mb-6">
                  Skip the endless research. Our AI analyzes your preferences, budget, and travel style 
                  to create personalized itineraries with the perfect balance of attractions, dining, 
                  and relaxation.
                </p>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="flex flex-wrap gap-3"
              >
                <Link href="/plan">
                  <button className="group cursor-pointer flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition shadow-sm relative overflow-hidden">
                    <span className="absolute inset-0 w-full h-full bg-white/20 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out"></span>
                    <span className="relative z-10">Start New Plan</span>
                    <ArrowRight className="h-4 w-4 relative z-10" />
                  </button>
                </Link>
                
                <Link href="/explore">
                  <button className="flex cursor-pointer items-center gap-2 px-4 py-2.5 bg-muted/50 hover:bg-muted border border-border/40 rounded-lg transition">
                    <Globe className="h-4 w-4" />
                    <span>Browse Destinations</span>
                  </button>
                </Link>
              </motion.div>
            </div>
            
            {/* Steps section - takes up 2/5 of space */}
            <div className="md:col-span-2 hidden md:block">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.3 }}
                className="bg-muted/30 rounded-lg p-5 border border-border/40"
              >
                <h4 className="text-sm font-medium mb-4">How it works</h4>
                
                <div className="space-y-4">
                  {[
                    { icon: MapPin, label: "Choose your destination", color: "bg-pink-500/10 text-pink-500" },
                    { icon: CalendarDays, label: "Select travel dates", color: "bg-amber-500/10 text-amber-500" },
                    { icon: Users, label: "Add travel companions", color: "bg-sky-500/10 text-sky-500" },
                    { icon: Sparkles, label: "Get personalized itinerary", color: "bg-indigo-500/10 text-indigo-500" },
                  ].map((item, i) => (
                    <motion.div 
                      key={i} 
                      className="flex items-center gap-3"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + (i * 0.1), duration: 0.4 }}
                    >
                      <div className={`h-8 w-8 rounded-full ${item.color} flex items-center justify-center flex-shrink-0`}>
                        <item.icon className="h-4 w-4" />
                      </div>
                      <span className="text-sm">{item.label}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}