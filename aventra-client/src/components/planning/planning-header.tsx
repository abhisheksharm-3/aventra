import { User } from "@/types/appwrite";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { ReactNode } from "react";

interface PlanningHeaderProps {
  user: User | null;
  title?: string;
  subtitle?: string;
  action?: ReactNode;
}

export default function PlanningHeader({
  user,
  title,
  subtitle,
  action
}: PlanningHeaderProps) {
  // Personalize the title based on user availability
  const personalizedTitle = title || (
    user?.name 
      ? `Hello ${user.name}, Let's Plan Your Trip`
      : "Create Your Perfect Travel Plan"
  );
  
  // Personalize subtitle if not explicitly provided
  const personalizedSubtitle = subtitle || (
    user 
      ? "Our AI will craft a personalized itinerary based on your preferences"
      : "Let our AI travel assistant help you design the perfect itinerary"
  );
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-background/80 backdrop-blur-sm border border-border/30 rounded-xl p-6 shadow-sm mb-8"
    >
      <div>
        <div className="flex items-center gap-2 mb-2">
          <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
            <Sparkles className="h-3 w-3 text-primary" />
          </div>
          <span className="text-sm font-medium text-primary">
            {user ? "Your Personal AI Planner" : "AI-Powered Planning"}
          </span>
        </div>
        
        <h1 className="text-3xl md:text-4xl font-serif font-medium">
          {personalizedTitle}
        </h1>
        <p className="text-muted-foreground mt-1">
          {personalizedSubtitle}
        </p>
      </div>
      
      {action && (
        <div className="flex items-center">
          {action}
        </div>
      )}
    </motion.div>
  );
}