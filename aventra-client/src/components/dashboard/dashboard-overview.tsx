"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { PlusCircle, Globe } from "lucide-react";
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
  quickActions,
  recommendedDestinations,
  travelStats,
  upcomingTrips,
} from "@/lib/constants/dashboard-data";
import { UpcomingTripsCard } from "./upcoming-trips";
import { TabsCard } from "./tabs-card";
import { TravelInsightsCard } from "./travel-insights";

/**
 * Dashboard Overview Component
 *
 * Main dashboard view displaying user information, upcoming trips,
 * recommendations, and quick actions.
 *
 * @param {DashboardOverviewProps} props - Component props
 * @returns Dashboard overview React component
 */
export default function DashboardOverview({ user }: DashboardOverviewProps) {
  // Tabs for actions and ideas
  const [activeTab, setActiveTab] = useState<"destinations" | "actions">(
    "destinations"
  );

  // Current date formatting - using a stable date for SSR consistency
  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div
      className="space-y-8 animate-in fade-in-50 duration-500"
      aria-label="Dashboard overview"
    >
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-background/80 backdrop-blur-sm border border-border/30 rounded-xl p-6 shadow-sm"
        role="region"
        aria-label="Welcome section"
      >
        <div>
          <h1 className="text-3xl md:text-4xl font-serif font-medium">
            Welcome,{" "}
            <span className="text-primary">
              {user?.name || user?.email || "Traveler"}
            </span>
          </h1>
          <p className="text-muted-foreground mt-1">
            {currentDate} • Let&apos;s plan your next adventure
          </p>
        </div>

        <div className="flex items-center gap-3">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href="/dashboard/trips">
                  <Button variant="outline" className="gap-2">
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
                  <Button className="gap-2">
                    <PlusCircle className="h-4 w-4" aria-hidden="true" />
                    <span>Plan New Trip</span>
                  </Button>
                </Link>
              </TooltipTrigger>
              <TooltipContent>Create a new AI-powered trip plan</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Trip Planning & Current Trip */}
        <div className="lg:col-span-2 space-y-6">
          {/* AI-Powered Planning Card - Highlight of your USP */}
          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate="visible"
          >
            <PlanningInspirationCard />
          </motion.div>

          {/* Next Trip Card */}
          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.2 }}
          >
            <UpcomingTripsCard trips={upcomingTrips} />
          </motion.div>
        </div>

        {/* Right Column - Recommendations & Actions */}
        <div className="space-y-6">
          {/* Tabs for Recommendations & Actions */}
          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate="visible"
          >
            <TabsCard
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              destinations={recommendedDestinations}
              actions={quickActions}
            />
          </motion.div>

          {/* Travel Stats Card - Replacing Profile Card */}
          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.2 }}
          >
            <TravelInsightsCard stats={travelStats} />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
