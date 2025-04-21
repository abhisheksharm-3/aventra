"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Calendar, MapPin, ChevronRight, PlusCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

// Sample data
const mockUpcomingExperiences = [
  {
    id: 1,
    name: "Bali Adventure",
    type: "Trip",
    location: "Bali, Indonesia",
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&auto=format&fit=crop",
    startDate: "2025-05-05",
    endDate: "2025-05-15",
    completed: 80
  },
  {
    id: 2,
    name: "Jazz Club Night",
    type: "Night Out",
    location: "Blue Note, New York",
    image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&auto=format&fit=crop",
    startDate: "2025-05-01",
    endDate: "2025-05-01",
    completed: 60
  },
  {
    id: 3,
    name: "Family Zoo Trip",
    type: "Family",
    location: "National Zoo",
    image: "https://images.unsplash.com/photo-1503919275948-9f99db3d64e4?w=800&auto=format&fit=crop",
    startDate: "2025-05-25",
    endDate: "2025-05-25",
    completed: 30
  }
];

interface ExperienceCardProps {
  experience: {
    id: number;
    name: string;
    type: string;
    location: string;
    image: string;
    startDate: string;
    endDate: string;
    completed: number;
  };
  index: number;
}

function ExperienceCard({ experience, index }: ExperienceCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  // Format dates
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };
  
  const dateRange = `${formatDate(experience.startDate)} - ${formatDate(experience.endDate)}`;
  const sameDay = formatDate(experience.startDate) === formatDate(experience.endDate);

  // Calculate days until this experience
  const today = new Date("2025-04-21"); // Using the provided current date
  const startDate = new Date(experience.startDate);
  const daysUntil = Math.ceil((startDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Card className="overflow-hidden border-border/40 transition-all duration-300 hover:shadow-md h-full">
        <div className="relative h-48 overflow-hidden">
          <Image 
            src={experience.image} 
            alt={experience.name} 
            fill 
            className={cn(
              "object-cover transition-transform duration-700",
              isHovered ? "scale-110" : "scale-100"
            )}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
          
          {/* Badge with type */}
          <div className="absolute top-3 left-3">
            <Badge className="font-medium bg-background/80 backdrop-blur-sm border-0 text-foreground px-2 py-0.5">
              {experience.type}
            </Badge>
          </div>
          
          {/* Days until badge */}
          <div className="absolute top-3 right-3">
            <Badge 
              className={cn(
                "font-medium backdrop-blur-sm border-0 px-2 py-0.5",
                daysUntil <= 7 
                  ? "bg-rose-500/80 text-white" 
                  : daysUntil <= 14 
                  ? "bg-amber-500/80 text-white" 
                  : "bg-emerald-500/80 text-white"
              )}
            >
              {daysUntil === 0 ? "Today" : daysUntil === 1 ? "Tomorrow" : `In ${daysUntil} days`}
            </Badge>
          </div>
          
          {/* Title overlay at bottom of image */}
          <div className="absolute bottom-0 left-0 right-0 p-3">
            <h3 className="font-bold text-lg text-white drop-shadow-sm">
              {experience.name}
            </h3>
          </div>
        </div>
        
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center text-sm text-muted-foreground">
              <MapPin className="h-3.5 w-3.5 mr-1.5" />
              <span>{experience.location}</span>
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <Calendar className="h-3.5 w-3.5 mr-1.5" />
              <span>{sameDay ? formatDate(experience.startDate) : dateRange}</span>
            </div>
          </div>
          
          <div className="mt-3">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-sm text-muted-foreground">Planning progress</span>
              <span className="text-sm font-medium">{experience.completed}%</span>
            </div>
            <div className="relative">
              <Progress 
                value={experience.completed} 
                className="h-1.5 bg-muted/40" 
              />
              <motion.div 
                className="absolute bottom-0 left-0 h-1.5 rounded-full bg-primary"
                initial={{ width: 0 }}
                animate={{ width: `${experience.completed}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </div>
          </div>
          
          <div className="flex mt-4">
            <Button 
              variant="outline" 
              size="sm" 
              asChild 
              className="flex-1 border-primary/20 hover:border-primary/40 bg-primary/5 hover:bg-primary/10 text-primary"
            >
              <Link href={`/dashboard/experience/${experience.id}`}>
                Continue Planning
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Add to Card component
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const CreateExperienceCard = ({ categoryFilter, index }: { categoryFilter?: string; index: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay: index * 0.1 }}
  >
    <Card className="border-dashed border-border/50 border-2 flex flex-col items-center justify-center text-center p-6 h-full hover:border-primary/40 transition-all hover:bg-primary/5 group">
      <div className="h-14 w-14 rounded-full bg-background border border-border/40 flex items-center justify-center mb-3 group-hover:border-primary/20 transition-colors">
        <PlusCircle className="h-7 w-7 text-muted-foreground group-hover:text-primary transition-colors" />
      </div>
      <p className="font-medium text-foreground group-hover:text-primary transition-colors">Create New Experience</p>
      <p className="text-sm text-muted-foreground mt-1.5 mb-4 max-w-[200px]">Plan your next adventure with ease</p>
      <Button 
        variant="outline"
        size="sm"
        className="bg-background hover:bg-primary/10 border-primary/20 hover:border-primary/40 text-primary"
      >
        Get Started
      </Button>
    </Card>
  </motion.div>
);

// Empty state component
const EmptyState = ({ categoryFilter }: { categoryFilter?: string }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.4 }}
  >
    <Card className="p-8 text-center border-border/40 bg-background">
      <div className="mx-auto w-16 h-16 rounded-full bg-muted/60 flex items-center justify-center mb-4">
        <Calendar className="h-7 w-7 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-medium">No {categoryFilter || "upcoming"} experiences yet</h3>
      <p className="text-muted-foreground mt-2 mb-6 max-w-md mx-auto">
        Start planning your next {categoryFilter?.toLowerCase() || "experience"} and make unforgettable memories
      </p>
      <Button className="bg-primary hover:bg-primary/90">
        <PlusCircle className="mr-2 h-4 w-4" />
        Create New {categoryFilter || "Experience"}
      </Button>
    </Card>
  </motion.div>
);

interface UpcomingExperiencesProps {
  categoryFilter?: string;
}

export default function UpcomingExperiences({ categoryFilter }: UpcomingExperiencesProps) {
  // Filter experiences based on category if provided
  const filteredExperiences = categoryFilter
    ? mockUpcomingExperiences.filter(exp => exp.type === categoryFilter)
    : mockUpcomingExperiences;
    
  return (
    <motion.div 
      className="mb-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold tracking-tight">Upcoming Experiences</h2>
        <Button variant="ghost" size="sm" asChild className="text-primary hover:text-primary/80">
          <Link href="/dashboard/experiences">
            View all <ChevronRight className="ml-1 h-4 w-4" />
          </Link>
        </Button>
      </div>
      
      {filteredExperiences.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredExperiences.map((experience, index) => (
            <ExperienceCard key={experience.id} experience={experience} index={index} />
          ))}
          <CreateExperienceCard categoryFilter={categoryFilter} index={filteredExperiences.length} />
        </div>
      ) : (
        <EmptyState categoryFilter={categoryFilter} />
      )}
    </motion.div>
  );
}