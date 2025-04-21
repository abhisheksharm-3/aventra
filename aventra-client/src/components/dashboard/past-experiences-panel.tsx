"use client";

import { useState } from "react";
import Image from "next/image";
import { MapPin, Clock, CalendarDays, ChevronRight, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

// Use dynamic current date instead of hardcoded value
const currentDate = new Date().toISOString().split('T')[0];

// Type for experiences with color settings
type ExperienceType = "Trip" | "Dining" | "Family" | "Night Out" | "Date Night";

interface PastExperience {
  id: number;
  name: string;
  type: ExperienceType;
  location: string;
  image: string;
  endDate: string;
  rating?: number;
}

const mockPastExperiences: PastExperience[] = [
  {
    id: 1,
    name: "Goa Beach Vacation",
    type: "Trip",
    location: "Goa, India",
    image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&auto=format&fit=crop",
    endDate: "2025-02-15",
    rating: 4.8
  },
  {
    id: 2,
    name: "Dinner at Spice Route",
    type: "Dining",
    location: "Delhi, India",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop",
    endDate: "2025-03-20",
    rating: 4.5
  },
  {
    id: 3,
    name: "Movie Night with Family",
    type: "Family",
    location: "PVR Cinemas",
    image: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=800&auto=format&fit=crop",
    endDate: "2025-04-01",
    rating: 4.2
  }
];

// Get badge styles based on experience type
const getTypeBadgeStyles = (type: ExperienceType) => {
  const styles = {
    "Trip": "border-blue-200 text-blue-600 dark:border-blue-800 dark:text-blue-400",
    "Dining": "border-amber-200 text-amber-600 dark:border-amber-800 dark:text-amber-400",
    "Family": "border-emerald-200 text-emerald-600 dark:border-emerald-800 dark:text-emerald-400",
    "Night Out": "border-purple-200 text-purple-600 dark:border-purple-800 dark:text-purple-400",
    "Date Night": "border-rose-200 text-rose-600 dark:border-rose-800 dark:text-rose-400"
  };
  
  return styles[type] || styles["Trip"];
};

function PastExperienceItem({ experience, index }: { experience: PastExperience; index: number }) {
  const [isHovered, setIsHovered] = useState(false);
  
  // Format date for display
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric' 
    });
  };
  
  // Calculate how long ago this was (in months/days)
  const getTimeAgo = (dateStr: string) => {
    const now = new Date(currentDate);
    const past = new Date(dateStr);
    const diffTime = Math.abs(now.getTime() - past.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays >= 30) {
      const months = Math.floor(diffDays / 30);
      return `${months} ${months === 1 ? 'month' : 'months'} ago`;
    } else {
      return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
    }
  };
  
  return (
    <motion.div 
      className={cn(
        "flex items-center p-2.5 rounded-lg transition-all duration-300 group",
        isHovered ? "bg-muted/50" : ""
      )}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <div className="relative h-16 w-16 rounded-lg bg-cover bg-center shrink-0 overflow-hidden shadow-sm">
        <Image
          src={experience.image}
          alt={experience.name}
          fill
          className={cn(
            "object-cover transition-transform duration-700",
            isHovered ? "scale-110" : "scale-100"
          )}
        />
      </div>
      
      <div className="ml-3 flex-1 overflow-hidden">
        <div className="flex items-center justify-between">
          <p className="font-medium text-sm">{experience.name}</p>
          <Badge 
            variant="outline" 
            className={cn(
              "text-xs border-[0.5px] bg-background/70",
              getTypeBadgeStyles(experience.type)
            )}
          >
            {experience.type}
          </Badge>
        </div>
        
        <div className="flex items-center justify-between mt-1">
          <div className="flex items-center">
            <MapPin className="h-3 w-3 mr-1 text-muted-foreground" />
            <p className="text-xs text-muted-foreground truncate max-w-[150px]">
              {experience.location}
            </p>
          </div>
          
          {experience.rating && (
            <div className="flex items-center">
              <Star className="h-3 w-3 text-amber-500 fill-amber-500 mr-1" />
              <span className="text-xs font-medium">{experience.rating}</span>
            </div>
          )}
        </div>
        
        <div className="flex items-center justify-between mt-1">
          <div className="flex items-center text-xs text-muted-foreground">
            <CalendarDays className="h-3 w-3 mr-1" />
            <span>{formatDate(experience.endDate)}</span>
          </div>
          <div className="text-xs text-primary opacity-70">
            {getTimeAgo(experience.endDate)}
          </div>
        </div>
      </div>
      
      <motion.div 
        className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity"
        initial={{ x: -5, opacity: 0 }}
        animate={isHovered ? { x: 0, opacity: 1 } : { x: -5, opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        <ChevronRight className="h-4 w-4 text-muted-foreground" />
      </motion.div>
    </motion.div>
  );
}

export default function PastExperiencesPanel() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="overflow-hidden border-border/40 h-full">
        <CardHeader className="pb-3 border-b border-border/30 bg-primary/5 relative">
          <div className="absolute inset-0 opacity-20 pointer-events-none overflow-hidden">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-amber-500/5 rounded-full blur-3xl"></div>
          </div>
          
          <div className="flex items-center relative z-10">
            <div className="h-8 w-8 rounded-full bg-background backdrop-blur-sm border border-primary/20 flex items-center justify-center mr-3 shadow-sm">
              <Clock className="h-4 w-4 text-amber-500" />
            </div>
            <div>
              <CardTitle className="text-base">Past Experiences</CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">
                Your memories from the last 3 months
              </p>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-5">
          <div className="space-y-2">
            {mockPastExperiences.map((exp, index) => (
              <PastExperienceItem key={exp.id} experience={exp} index={index} />
            ))}
          </div>
          
          <div className="mt-6 pt-4 border-t border-border/20">
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full bg-background hover:bg-primary/5 border-primary/20 hover:border-primary/40 text-primary gap-2 h-9 text-sm"
            >
              View All Past Experiences
              <ChevronRight className="h-3.5 w-3.5 ml-1" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}