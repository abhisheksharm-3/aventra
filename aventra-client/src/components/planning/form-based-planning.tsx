"use client";

import { JSX, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User } from "@/types/appwrite";
import {
  ArrowLeft,
  MessageSquare,
  Globe,
  Calendar,
  Banknote,
  MapPin,
  Sparkles,
  Clock,
  X,
  Lightbulb,
  Compass,
  Briefcase,
  Plane,
  Heart,
  Palmtree,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import PlanningHeader from "./planning-header";
import { TripForm } from "./trip-form";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useTripFormStore } from "@/stores/useTripFormStore";
import { useDestinationInsights } from "@/hooks/useDestinationInsights";
import { useTrendingDestinations } from "@/hooks/useTrendingDestinations";
import { currencies } from "@/lib/constants/currencies";
import { Skeleton } from "@/components/ui/skeleton";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DynamicTripHeader } from "./dynamic-trip-header";
import { cn } from "@/lib/utils";
import Image from "next/image";

/**
 * Properties for the FormBasedPlanning component
 */
interface FormBasedPlanningProps {
  /** Callback function to switch to the chat-based planning interface */
  onSwitchToChat: () => void;
  /** Callback function to navigate back to the previous screen */
  onBack: () => void;
  /** User object containing authentication details or null if not authenticated */
  user: User | null;
}

/**
 * Properties for the StatCard component
 */
interface StatCardProps {
  /** Icon component to display */
  icon: React.ComponentType<{ className?: string }>;
  /** Label text describing the stat */
  label: string;
  /** Value to display */
  value: string;
  /** Animation delay factor */
  delayFactor?: number;
  /** Card style variant */
  variant?: "primary" | "secondary" | "accent" | "default";
}

/**
 * A modern, animated statistics card that displays key trip metrics
 * with beautiful gradients and animations
 */
const StatCard: React.FC<StatCardProps> = ({ 
  icon: Icon, 
  label, 
  value, 
  delayFactor = 0,
  variant = "default" 
}) => {
  const variantStyles = {
    primary: "from-primary/20 to-primary/5 border-primary/30 hover:border-primary/50",
    secondary: "from-blue-500/20 to-blue-500/5 border-blue-500/30 hover:border-blue-500/50",
    accent: "from-amber-500/20 to-amber-500/5 border-amber-500/30 hover:border-amber-500/50",
    default: "from-card/70 to-card border-border/40 hover:border-border/60"
  };

  const iconStyles = {
    primary: "bg-primary/20 text-primary",
    secondary: "bg-blue-500/20 text-blue-500",
    accent: "bg-amber-500/20 text-amber-500",
    default: "bg-primary/10 text-primary"
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: delayFactor * 0.15 }}
      whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
      className={cn(
        "relative flex flex-col p-6 border rounded-xl bg-gradient-to-br shadow-md overflow-hidden transition-all duration-300",
        variantStyles[variant]
      )}
    >
      <div className="absolute -right-3 -top-3 opacity-5">
        <Icon className="h-28 w-28" />
      </div>
      <div className="space-y-3 relative z-10">
        <div className="flex items-center gap-2.5">
          <div className={cn("p-2 rounded-full", iconStyles[variant])}>
            <Icon className="h-4 w-4" />
          </div>
          <p className="text-xs font-semibold text-muted-foreground tracking-wide uppercase">{label}</p>
        </div>
        <p className="text-xl font-bold truncate">{value}</p>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute bottom-0 right-0 w-16 h-16 bg-gradient-to-tl from-background/20 to-transparent rounded-tl-3xl" />
    </motion.div>
  );
};

/**
 * Displays trending destinations with AI-powered recommendations
 * that align with the user's preferences and travel style
 */
function TrendingDestinations() {
  // Using the service hook instead of local state and useEffect
  const { destinations, loading, error } = useTrendingDestinations();
  
  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Skeleton className="h-6 w-6 rounded-full" />
            <Skeleton className="h-5 w-40" />
          </div>
          <Skeleton className="h-5 w-16" />
        </div>
        
        <div className="grid grid-cols-1 gap-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-24 w-full rounded-xl" />
          ))}
        </div>
      </div>
    );
  }
  
  if (error || destinations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <div className="relative w-16 h-16 mb-4">
          <div className="absolute inset-0 bg-amber-500/10 rounded-full animate-pulse"></div>
          <div className="flex items-center justify-center w-16 h-16">
            <Compass className="h-8 w-8 text-amber-500/40" />
          </div>
        </div>
        <h4 className="text-base font-medium mb-1.5">No matching destinations</h4>
        <p className="text-sm text-muted-foreground max-w-xs">
          Try adjusting your preferences to discover more places
        </p>
      </div>
    );
  }
  
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium flex items-center gap-2">
          <span className="bg-amber-500/10 p-1.5 rounded-full">
            <Sparkles className="h-3.5 w-3.5 text-amber-500" />
          </span>
          <span>AI-Matched Destinations</span>
        </h3>
        <Badge 
          variant="outline" 
          className="text-[10px] bg-amber-500/10 text-amber-500 border-amber-500/20 font-semibold"
        >
          TRENDING
        </Badge>
      </div>
      
      <div className="grid grid-cols-1 gap-4">
        {destinations.map((dest, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.15 }}
            whileHover={{ scale: 1.01, transition: { duration: 0.2 } }}
            className="group relative flex overflow-hidden rounded-xl h-28 border border-black/5 shadow-md"
          >
            <div className="absolute inset-0 z-0">
              <Image 
                src={dest.image}
                alt={dest.name}
                fill
                className="object-cover brightness-[0.65] group-hover:brightness-[0.75] group-hover:scale-105 transition-all duration-700"
              />
            </div>
            
            {/* Shimmer effect */}
            <div 
              className="absolute inset-0 opacity-0 group-hover:opacity-30 z-10 bg-gradient-to-r from-transparent via-white to-transparent -translate-x-full group-hover:translate-x-full transition-all duration-1500"
            />
            
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/20 z-10" />
            
            <div className="relative z-20 flex flex-1 items-center justify-between p-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Palmtree className="h-3.5 w-3.5 text-amber-400" />
                  <h4 className="text-white font-semibold text-lg tracking-wide">{dest.name}</h4>
                </div>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="text-xs text-white/95 bg-white/15 backdrop-blur-sm px-3 py-0.5 rounded-full font-medium">{dest.tag}</span>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <div className="flex items-center gap-1.5 mb-2.5 bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-full">
                  <Heart className="h-3.5 w-3.5 text-red-400 fill-red-400 animate-pulse" />
                  <span className="text-xs text-white font-semibold">{dest.match}% match</span>
                </div>
                <Button 
                  size="sm" 
                  className="h-9 text-xs px-4 shadow-md hover:shadow-lg transition-all bg-white/90 hover:bg-white text-black rounded-full font-medium"
                >
                  Explore
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/**
 * AI-powered destination insights that provide contextual travel information and tips
 * This component dynamically loads relevant information based on the selected destination
 */
function DestinationInsights() {
  const { insights, loading } = useDestinationInsights();
  const destination = useTripFormStore((state) => state.formData.location?.destination);
  
  if (!destination) {
    return null;
  }
  
  if (loading) {
    return (
      <div className="p-4 space-y-3">
        <div className="flex items-center gap-2">
          <Skeleton className="h-6 w-6 rounded-full" />
          <Skeleton className="h-5 w-32" />
        </div>
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-4/6" />
      </div>
    );
  }
  
  // If insights couldn't be loaded
  if (!insights) {
    return null;
  }
  
  return (
    <div className="space-y-6 p-1">
      {insights.bestTimeToVisit && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-2.5"
        >
          <h4 className="text-sm font-medium flex items-center gap-2">
            <span className="bg-primary/15 p-1.5 rounded-full">
              <Calendar className="h-3.5 w-3.5 text-primary" />
            </span>
            Best Time to Visit
          </h4>
          <p className="text-sm text-muted-foreground leading-relaxed">{insights.bestTimeToVisit}</p>
        </motion.div>
      )}
      
      {insights.tips && insights.tips.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="space-y-3.5"
        >
          <h4 className="text-sm font-medium flex items-center gap-2">
            <span className="bg-primary/15 p-1.5 rounded-full">
              <Lightbulb className="h-3.5 w-3.5 text-primary" />
            </span>
            Traveler Tips
          </h4>
          <div className="space-y-4">
            {insights.tips.slice(0, 2).map((tip, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 + (index * 0.15) }}
                whileHover={{ scale: 1.01, transition: { duration: 0.2 } }}
                className="rounded-xl bg-gradient-to-br from-muted/60 to-muted/10 p-5 border border-muted/40 shadow-md hover:shadow-lg transition-all duration-300"
              >
                <div className="flex gap-3 items-start">
                  <div className="mt-0.5">
                    <div className="bg-primary/20 p-1.5 rounded-full">
                      <Star className="h-3 w-3 text-primary" />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-semibold mb-2 text-primary/90">{tip.title}</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">{tip.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}

/**
 * Smart trip statistics display component that shows key metrics in a visually appealing format.
 * Automatically formats currency, calculates trip duration, and handles date formatting.
 * 
 * @returns A grid of statistics about the current trip plan
 */
function TripStatsDisplay() {
  const formData = useTripFormStore((state) => state.formData);

  /**
   * Calculates the trip duration in days based on start and end dates
   */
  const calculateDuration = (): string => {
    if (formData.dates?.startDate && formData.dates?.endDate) {
      const start = new Date(formData.dates.startDate);
      const end = new Date(formData.dates.endDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return `${diffDays} ${diffDays === 1 ? "day" : "days"}`;
    }
    return "Not set";
  };

  /**
   * Formats the date range in a human-readable format
   */
  const formatDateRange = (): string => {
    if (formData.dates?.startDate && formData.dates?.endDate) {
      const start = new Date(formData.dates.startDate).toLocaleDateString(
        "en-US",
        { month: "short", day: "numeric" }
      );
      const end = new Date(formData.dates.endDate).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      return `${start} - ${end}`;
    }
    return "Not set";
  };

  /**
   * Formats the budget with proper currency symbol and thousands separators
   */
  const formatBudget = (): string => {
    if (formData.budget?.ceiling) {
      const currency = formData.budget.currency || "USD";
      const currencyObj = currencies.find(c => c.code === currency);
      const symbol = currencyObj?.symbol || currency;
      const amount = new Intl.NumberFormat("en-US").format(
        formData.budget.ceiling
      );
      return `${symbol}${amount}`;
    }
    return "Not set";
  };

  const hasData = formData.location?.destination || formData.dates?.startDate;
  
  if (!hasData) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="grid grid-cols-2 md:grid-cols-4 gap-5"
    >
      <StatCard 
        icon={Globe} 
        label="Destination" 
        value={formData.location?.destination || "Not set"} 
        delayFactor={0}
        variant="primary"
      />
      <StatCard 
        icon={Calendar} 
        label="Dates" 
        value={formatDateRange()} 
        delayFactor={1}
        variant="secondary"
      />
      <StatCard 
        icon={Clock} 
        label="Duration" 
        value={calculateDuration()} 
        delayFactor={2} 
        variant="accent"
      />
      <StatCard 
        icon={Banknote} 
        label="Budget" 
        value={formatBudget()} 
        delayFactor={3} 
      />
    </motion.div>
  );
}

/**
 * Form-based trip planning component with a refined aesthetic focus on minimalism
 * while maintaining powerful AI capabilities.
 * 
 * This component provides a visually appealing interface for planning travel with:
 * - Beautifully styled trip statistics
 * - Elegant form layout with visual elements
 * - AI-powered destination insights and recommendations
 * - Seamless transitions between form and chat interfaces
 */
export default function FormBasedPlanning({
  onSwitchToChat,
  onBack,
  user,
}: FormBasedPlanningProps): JSX.Element {
  const [showAISidebar, setShowAISidebar] = useState<boolean>(false);
  const destination = useTripFormStore((state) => state.formData.location?.destination);
  
  // Subtle parallax effect for background elements
  const [scrollY, setScrollY] = useState(0);
  
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background/98 to-background/95 relative">
      {/* Refined header with subtle visual enhancement */}
      <div className="relative">
          <PlanningHeader
            user={user}
            title="Design Your Journey"
            subtitle="Create your perfect travel experience"
            action={
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onBack}
                  className="gap-1.5 hover:bg-background/80 transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Back</span>
                </Button>
              </motion.div>
            }
          />
      </div>
      
      {/* Main content with refined spacing and layout */}
      <div className="mx-auto px-4 pb-32">
        <div className="flex flex-col space-y-8">
          {/* Planning mode selection with elegant visual styling */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex justify-center"
          >
            <div className="w-full max-w-md bg-gradient-to-r from-background via-background/95 to-background p-0.5 rounded-xl shadow-lg border border-border/30">
              <Tabs defaultValue="form" className="w-full">
                <TabsList className="grid grid-cols-2 w-full bg-muted/40 rounded-lg">
                  <TabsTrigger 
                    value="form" 
                    className="data-[state=active]:bg-white dark:data-[state=active]:bg-background rounded-lg data-[state=active]:shadow-md transition-all duration-300"
                  >
                    <div className="flex items-center gap-2.5">
                      <Briefcase className="h-4 w-4" />
                      <span className="text-sm font-medium">Trip Builder</span>
                    </div>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="chat" 
                    className="rounded-lg transition-all duration-300 py-3"
                    onClick={(e) => {
                      e.preventDefault();
                      onSwitchToChat();
                    }}
                  >
                    <div className="flex items-center gap-2.5">
                      <MessageSquare className="h-4 w-4" />
                      <span className="text-sm font-medium">AI Chat</span>
                    </div>
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </motion.div>
          
          {/* Trip stats with enhanced visual appeal */}
          <AnimatePresence>
            {destination && <TripStatsDisplay />}
          </AnimatePresence>
          
          {/* Main planning area with refined grid layout */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main form column - takes more space with cleaner design */}
            <motion.div 
              className="lg:col-span-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="overflow-hidden border-border/30 rounded-xl shadow-xl hover:shadow-2xl transition-shadow duration-500 py-0 gap-0">
                <DynamicTripHeader />
                  <TripForm />
              </Card>
              
              {/* Mobile floating AI insights button */}
              <Sheet open={showAISidebar} onOpenChange={setShowAISidebar}>
                <SheetTrigger asChild>
                  <Button 
                    className="fixed bottom-6 right-6 shadow-xl lg:hidden h-16 w-16 p-0 rounded-full bg-gradient-to-br from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70" 
                    onClick={() => setShowAISidebar(true)}
                  >
                    <div className="absolute inset-0 rounded-full bg-primary animate-ping opacity-20"></div>
                    <Sparkles className="h-6 w-6 animate-pulse" />
                    <span className="sr-only">AI Insights</span>
                  </Button>
                </SheetTrigger>
                <SheetContent className="w-[90%] sm:max-w-md p-0">
                  <div className="h-full flex flex-col">
                    <div className="bg-gradient-to-r from-primary/20 to-primary/5 p-5 flex items-center justify-between border-b border-border/30">
                      <div className="flex items-center gap-3">
                        <div className="bg-primary/20 p-2 rounded-full">
                          <Sparkles className="h-5 w-5 text-primary animate-pulse" />
                        </div>
                        <h3 className="font-semibold text-xl">AI Travel Insights</h3>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => setShowAISidebar(false)} className="rounded-full hover:bg-background/80">
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <ScrollArea className="flex-1">
                      <div className="space-y-6 p-6">
                        {destination ? (
                          <>
                            <div className="p-5 rounded-xl bg-muted/10 border border-border/30 shadow-md">
                              <DestinationInsights />
                            </div>
                            <div className="p-5 rounded-xl bg-muted/10 border border-border/30 shadow-md">
                              <TrendingDestinations />
                            </div>
                          </>
                        ) : (
                          <div className="flex flex-col items-center justify-center text-center py-20">
                            <div className="relative w-20 h-20 mb-5">
                              <div className="absolute inset-0 bg-primary/10 rounded-full animate-ping opacity-75 animation-duration-3000"></div>
                              <div className="relative flex items-center justify-center w-20 h-20 bg-primary/20 rounded-full">
                                <MapPin className="h-8 w-8 text-primary" />
                              </div>
                            </div>
                            <h3 className="font-semibold mb-2.5 text-2xl">Select a Destination</h3>
                            <p className="text-sm text-muted-foreground max-w-xs">
                              Choose your destination to unlock AI-powered recommendations and insights
                            </p>
                          </div>
                        )}
                      </div>
                    </ScrollArea>
                  </div>
                </SheetContent>
              </Sheet>
            </motion.div>
            
            {/* AI insights sidebar - refined and elegant design */}
            <motion.div 
              className="hidden lg:block"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              style={{
                transform: `translateY(${scrollY * 0.05}px)`, // Subtle parallax effect
              }}
            >
              <div className="space-y-6 sticky top-6">
                {/* AI Destination Insights */}
                <Card className="overflow-hidden border-border/30 rounded-xl shadow-lg hover:shadow-xl transition-all duration-500">
                  <div className="p-4 border-b border-border/20 bg-gradient-to-r from-primary/15 to-transparent">
                    <div className="flex items-center gap-2.5">
                      <div className="bg-primary/20 p-2 rounded-full">
                        <Globe className="h-4 w-4 text-primary" />
                      </div>
                      <h3 className="font-medium text-base">Destination Insights</h3>
                    </div>
                  </div>
                  
                  <div className="p-5 md:p-6">
                    {destination ? <DestinationInsights /> : (
                      <div className="flex flex-col items-center justify-center py-16 text-center">
                        <div className="relative w-16 h-16 mb-4">
                          <div className="absolute inset-0 bg-primary/10 rounded-full animate-ping opacity-50"></div>
                          <div className="relative flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full">
                            <MapPin className="h-6 w-6 text-primary/60" />
                          </div>
                        </div>
                        <h4 className="font-medium mb-2 text-base">Awaiting Destination</h4>
                        <p className="text-sm text-muted-foreground">
                          Select a destination to<br />view AI-powered insights
                        </p>
                      </div>
                    )}
                  </div>
                </Card>
                
                {/* Trending Destinations */}
                <Card className="overflow-hidden border-border/30 rounded-xl shadow-lg hover:shadow-xl transition-all duration-500">
                  <div className="p-4 border-b border-amber-500/10 bg-gradient-to-r from-amber-500/15 to-transparent">
                    <div className="flex items-center gap-2.5">
                      <div className="bg-amber-500/20 p-2 rounded-full">
                        <Plane className="h-4 w-4 text-amber-500" />
                      </div>
                      <h3 className="font-medium text-base">Trending Places</h3>
                    </div>
                  </div>
                  
                  <div className="p-5 md:p-6">
                    <TrendingDestinations />
                  </div>
                </Card>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}