"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Clock, Compass, ArrowUpRight, Hash } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";

export default function StatCards() {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  return (
    <motion.div 
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {/* Upcoming Events Card */}
      <motion.div variants={itemVariants}>
        <Card className="overflow-hidden group hover:shadow-md transition-all duration-300 border-border/40 h-full">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="h-12 w-12 rounded-full bg-background/80 border border-blue-200/30 backdrop-blur-sm flex items-center justify-center shadow-sm">
                <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <p className="text-xs text-muted-foreground">Events</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Upcoming</p>
              <div className="flex items-baseline gap-1">
                <p className="text-2xl font-bold mt-1">3</p>
                <p className="text-sm text-muted-foreground">experiences</p>
              </div>
              <div className="flex items-center justify-between mt-4">
                <p className="text-sm text-muted-foreground">Next: Bali Trip</p>
                <button className="text-xs text-primary opacity-70 group-hover:opacity-100 flex items-center transition-opacity">
                  View all <ArrowUpRight className="ml-1 h-3 w-3" />
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
      
      {/* Days Until Next Trip */}
      <motion.div variants={itemVariants}>
        <Card className="group hover:shadow-md transition-all duration-300 border-border/40 h-full">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="h-12 w-12 rounded-full bg-background/80 border border-amber-200/30 backdrop-blur-sm flex items-center justify-center shadow-sm">
                <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
              <p className="text-xs text-muted-foreground">Countdown</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Days Until Next Trip</p>
              <div className="flex items-baseline gap-1">
                <p className="text-2xl font-bold mt-1">12</p>
                <p className="text-sm text-muted-foreground">days</p>
              </div>
              <div className="flex items-center justify-between mt-4">
                <p className="text-sm text-muted-foreground">Bali, Indonesia</p>
                <button className="text-xs text-primary opacity-70 group-hover:opacity-100 flex items-center transition-opacity">
                  Details <ArrowUpRight className="ml-1 h-3 w-3" />
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
      
      {/* Experiences Card */}
      <motion.div variants={itemVariants}>
        <Card className="group hover:shadow-md transition-all duration-300 border-border/40 h-full">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="h-12 w-12 rounded-full bg-background/80 border border-indigo-200/30 backdrop-blur-sm flex items-center justify-center shadow-sm">
                <Compass className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <p className="text-xs text-muted-foreground">Total</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Experiences</p>
              <div className="flex items-baseline gap-1">
                <p className="text-2xl font-bold mt-1">24</p>
                <p className="text-sm text-muted-foreground">completed</p>
              </div>
              <div className="flex items-center justify-between mt-4">
                <p className="text-sm text-muted-foreground">8 countries visited</p>
                <button className="text-xs text-primary opacity-70 group-hover:opacity-100 flex items-center transition-opacity">
                  View map <ArrowUpRight className="ml-1 h-3 w-3" />
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
      
      {/* Budget Card */}
      <motion.div variants={itemVariants}>
        <Card className="group hover:shadow-md transition-all duration-300 border-border/40 h-full">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="h-12 w-12 rounded-full bg-background/80 border border-emerald-200/30 backdrop-blur-sm flex items-center justify-center shadow-sm">
                <Hash className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <p className="text-xs text-muted-foreground">This month</p>
            </div>
            <div>
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">Travel Budget</p>
                <p className="text-sm font-medium">₹45,000</p>
              </div>
              <div className="mt-2 relative">
                <Progress 
                  className="h-2 bg-muted/50" 
                  value={65} 
                />
                <div className="absolute top-0 left-[65%] h-4 w-[2px] bg-foreground/20 transform -translate-x-1/2 translate-y-[-1px]" />
              </div>
              <div className="flex items-center justify-between mt-4">
                <p className="text-sm text-muted-foreground">65% used</p>
                <p className="text-sm text-primary font-medium">₹15,750 remaining</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}