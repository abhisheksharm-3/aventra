"use client";

import { motion } from "framer-motion";
import { 
  ArrowRight, 
  MapPin, 
  CalendarDays, 
  Users, 
  BrainCircuit,
  Sparkles,
  Compass
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";

export default function PlanningInspirationCard() {
  return (
    <Card className="w-full overflow-hidden border-border/40 relative shadow-sm">
      <div className="absolute inset-0 h-full w-full">
        <Image
          src="https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e"
          alt="Planning inspiration"
          fill
          className="object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background/90 to-background/80" />
      </div>
      
      <CardContent className="p-6 md:p-8 relative z-10">
        <div className="flex flex-col md:flex-row justify-between gap-6">
          <div className="max-w-xl">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7 }}
              className="flex items-center gap-2 mb-3"
            >
              <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center">
                <BrainCircuit className="h-4 w-4 text-primary" />
              </div>
              <h2 className="font-medium text-primary">AI-Powered Trip Planning</h2>
            </motion.div>
            
            <motion.h3
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-2xl md:text-3xl font-serif font-medium mb-2"
            >
              Your perfect trip is just a few clicks away
            </motion.h3>
            
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-muted-foreground mb-6"
            >
              Let our AI assistant create a personalized itinerary based on your preferences, 
              budget, and travel style. No more hours of research and planning.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="flex flex-wrap gap-4"
            >
              <Link href="/plan">
                <button className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition shadow-sm group">
                  <Sparkles className="h-4 w-4 group-hover:animate-pulse" />
                  <span>Create Trip Plan</span>
                </button>
              </Link>
              
              <Link href="/explore">
                <button className="flex items-center gap-2 px-4 py-2.5 bg-background border border-border rounded-lg hover:bg-muted/50 transition group">
                  <Compass className="h-4 w-4 group-hover:rotate-[15deg] transition-transform" />
                  <span>Explore Destinations</span>
                </button>
              </Link>
            </motion.div>
          </div>
          
          <div className="flex-shrink-0 hidden lg:block">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="bg-background/80 backdrop-blur-sm border border-border/40 rounded-lg p-5 shadow-sm w-[240px]"
            >
              <h3 className="font-medium mb-3 text-sm">Begin with</h3>
              
              <div className="space-y-3">
                {[
                  { icon: MapPin, label: "Choose destination" },
                  { icon: CalendarDays, label: "Select dates" },
                  { icon: Users, label: "Add travelers" },
                  { icon: Sparkles, label: "Get AI itinerary" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <item.icon className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <span className="text-sm">{item.label}</span>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 pt-3 border-t border-border/40 flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Ready to start?</span>
                <Link href="/plan">
                  <button className="h-7 w-7 rounded-full bg-primary/10 hover:bg-primary/20 flex items-center justify-center text-primary transition-colors">
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}