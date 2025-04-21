"use client";

import { useState } from "react";
import Image from "next/image";
import { Sparkles, GraduationCap, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

// Recommendation types with appropriate category colors
type RecommendationCategory = "Trips" | "Nights Out" | "Date Night" | "Dining" | "Family";

interface Recommendation {
  title: string;
  description: string;
  image: string;
  category: RecommendationCategory;
}

const getCategoryColor = (category: RecommendationCategory): string => {
  const colors = {
    "Trips": "text-blue-600 dark:text-blue-400",
    "Nights Out": "text-purple-600 dark:text-purple-400",
    "Date Night": "text-rose-600 dark:text-rose-400",
    "Dining": "text-amber-600 dark:text-amber-400",
    "Family": "text-emerald-600 dark:text-emerald-400"
  };
  
  return colors[category] || "text-blue-600 dark:text-blue-400";
};

const mockRecommendations: Recommendation[] = [
  {
    title: "Weekend Getaway to Shimla",
    description: "Based on your preferences, you might enjoy a mountain retreat.",
    image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800&auto=format&fit=crop",
    category: "Trips"
  },
  {
    title: "Moonlight Rooftop Bar",
    description: "New rooftop experience with live music this weekend.",
    image: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800&auto=format&fit=crop",
    category: "Nights Out"
  },
  {
    title: "Candlelight Dinner at Azure",
    description: "Perfect for your upcoming anniversary next month.",
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&auto=format&fit=crop",
    category: "Date Night"
  }
];

// Current user and time details
const currentUser = "abhisheksharm-3";
const currentDate = "2025-04-21 14:48:04";

function RecommendationItem({ rec, index }: { rec: Recommendation; index: number }) {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.div 
      className="flex items-start group"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <div className="h-20 w-20 rounded-lg overflow-hidden relative shrink-0 shadow-sm">
        <Image
          src={rec.image}
          alt={rec.title}
          fill
          className={cn(
            "object-cover transition-transform duration-700",
            isHovered ? "scale-110" : "scale-100"
          )}
        />
      </div>
      <div className="ml-4 flex-1">
        <div className="flex items-center justify-between">
          <h4 className="font-medium text-sm">{rec.title}</h4>
          <Badge 
            variant="outline" 
            className={cn(
              "ml-2 text-xs border-0 bg-background", 
              getCategoryColor(rec.category)
            )}
          >
            {rec.category}
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{rec.description}</p>
        <Button 
          variant="ghost" 
          size="sm" 
          className="p-0 h-auto mt-1 text-xs text-primary flex items-center hover:bg-transparent hover:text-primary/80"
        >
          <span className="relative">
            Explore
            <span className={cn(
              "absolute bottom-0 left-0 w-0 h-[1px] bg-primary transition-all duration-300",
              isHovered ? "w-full" : "w-0"
            )}></span>
          </span>
          <ChevronRight className="h-3 w-3 ml-0.5 transition-transform duration-300 transform" style={{
            transform: isHovered ? "translateX(2px)" : "translateX(0)"
          }} />
        </Button>
      </div>
    </motion.div>
  );
}

export default function RecommendationsPanel() {
  // Extract time of day for personalized greeting
  const hour = new Date(currentDate).getHours();
  const timeOfDay = hour < 12 ? "morning" : hour < 18 ? "afternoon" : "evening";
  
  // Format username for display
  const displayName = currentUser.split('-')[0];
  const capitalizedName = displayName.charAt(0).toUpperCase() + displayName.slice(1);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="overflow-hidden border-border/40 h-full">
        <CardHeader className="pb-3 border-b border-border/30 bg-primary/5 relative">
          <div className="absolute inset-0 opacity-20 pointer-events-none overflow-hidden">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/20 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl"></div>
          </div>
          <div className="flex items-center relative z-10">
            <div className="h-8 w-8 rounded-full bg-background backdrop-blur-sm border border-primary/20 flex items-center justify-center mr-3 shadow-sm">
              <Sparkles className="h-4 w-4 text-primary" />
            </div>
            <div>
              <CardTitle className="text-base">AI Recommendations</CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">
                Good {timeOfDay}, {capitalizedName}
              </p>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-5">
          <div className="space-y-5">
            {mockRecommendations.map((rec, index) => (
              <RecommendationItem key={index} rec={rec} index={index} />
            ))}
          </div>
          
          <div className="mt-6 pt-4 border-t border-border/20">
            <Button 
              variant="outline" 
              className="w-full bg-background hover:bg-primary/5 border-primary/20 hover:border-primary/40 text-primary gap-2 h-9 text-sm"
            >
              <GraduationCap className="h-3.5 w-3.5" />
              Train AI with Your Preferences
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}