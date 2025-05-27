"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { PlusCircle, Globe, Sparkles } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import PlanningInspirationCard from "./planning-inspiration-card";
import { DashboardOverviewProps } from "@/types/dashboard";
import {
  itemVariants,
  travelStats,
  upcomingTrips,
} from "@/lib/constants/dashboard-data";
import { UpcomingTripsCard } from "./upcoming-trips";
import { ExploreCard } from "./explore-card";
import { TravelInsightsCard } from "./travel-insights";

/**
 * Dashboard Overview Component
 *
 * Main dashboard view displaying user information, upcoming trips,
 * personalized recommendations, and travel insights.
 *
 * @param {DashboardOverviewProps} props - Component props
 * @returns Dashboard overview React component
 */
export default function DashboardOverview({ user }: DashboardOverviewProps) {
  // Tabs for personalized and trending destinations
  const [activeTab, setActiveTab] = useState<"recommendations" | "trending">("recommendations");
  const [mounted, setMounted] = useState(false);
  
  // Handle any client-side only effects
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Current date formatting - using a client-side date to ensure freshness
  const currentDate = mounted ? new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  }) : "";

  // Get user's first name for personalized greeting
  const firstName = user?.name?.split(" ")[0] || "Traveler";
  
  // Time-based greeting
  const getGreeting = () => {
    if (!mounted) return "Welcome";
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="relative pb-12" aria-label="Dashboard overview">
      
      {/* Main Content */}
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Welcome Header */}
        <header className="pt-6 px-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col md:flex-row md:items-center justify-between gap-5"
          >
            <div>
              <div className="text-sm text-muted-foreground">{currentDate}</div>
              <h1 className="text-3xl md:text-4xl font-serif font-medium mt-1">
                {getGreeting()}, <span className="text-primary">{firstName}</span>
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link href="/dashboard/trips">
                      <Button variant="outline" className="gap-2 h-10 cursor-pointer">
                        <Globe className="h-4 w-4" aria-hidden="true" />
                        <span>My Trips</span>
                      </Button>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>View and manage all your trips</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link href="/plan">
                      <Button className="gap-2 h-10 cursor-pointer">
                        <PlusCircle className="h-4 w-4" aria-hidden="true" />
                        <span>New Trip</span>
                      </Button>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>Create a new AI-powered trip plan</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </motion.div>
        </header>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 px-2">
          {/* Left Column - Planning & Trip */}
          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-8 space-y-6"
          >
            {/* AI-Powered Planning Card */}
            <PlanningInspirationCard />

            {/* Next Trip Card */}
            <motion.div
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.2 }}
            >
              <UpcomingTripsCard trips={upcomingTrips} />
            </motion.div>
          </motion.div>

          {/* Right Column - Explore & Insights */}
          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.1 }}
            className="lg:col-span-4 space-y-6"
          >
            {/* Explore Card */}
            <ExploreCard
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              userPreferences={user?.prefs.toString() || ""}
            />

            {/* Travel Stats Card */}
            <motion.div
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.3 }}
            >
              <TravelInsightsCard stats={travelStats} />
            </motion.div>
          </motion.div>
        </div>
        
        {/* Inspirational footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="flex justify-center mt-8 text-sm text-muted-foreground"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-muted/40 rounded-full">
            <Sparkles className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
            <span>&quot;{getRandomQuote()}&quot;</span>
          </div>
        </motion.footer>
      </div>
    </div>
  );
}

// Travel inspiration quotes
function getRandomQuote() {
  const quotes = [
    "Travel is the only thing you buy that makes you richer",
    "The world is a book and those who do not travel read only one page",
    "Life is either a daring adventure or nothing at all",
    "Not all who wander are lost",
    "Travel far, travel wide, travel deep",
    "Adventure awaits, go find it"
  ];
  
  return quotes[Math.floor(Math.random() * quotes.length)];
}