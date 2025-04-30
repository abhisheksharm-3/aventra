"use client";

import { useState, useEffect } from "react";
import StatCards from "@/components/dashboard/stat-card";
import UpcomingExperiences from "@/components/dashboard/upcoming-experiences";
import SavedItineraries from "@/components/dashboard/saved-itineraries";
import RecommendationsPanel from "@/components/dashboard/recommendations-panel";
import PastExperiencesPanel from "@/components/dashboard/past-experiences-panel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle, Sparkles, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/layout/Layout";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function DashboardPage() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [currentDate, setCurrentDate] = useState("2025-04-21");
  const [scrolled, setScrolled] = useState(false);

  // Format the current date
  const formattedDate = new Date(currentDate).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  // Handle scroll effects
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Categories with icons
  const categories = [
    { value: "all", label: "All", count: 24 },
    { value: "trips", label: "Trips", count: 8 },
    { value: "nights-out", label: "Nights Out", count: 6 },
    { value: "family", label: "Family", count: 4 },
    { value: "date-night", label: "Date Night", count: 3 },
    { value: "dining", label: "Dining", count: 3 },
  ];

  return (
    <Layout>
      <div className="flex flex-1 h-[calc(100vh-64px)] overflow-hidden">
        {/* Page Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-background/80 pointer-events-none" />

        {/* Main Content Area */}
        <div className="flex-1 overflow-auto relative">
          <div
            className={cn(
              "sticky top-0 z-10 backdrop-blur-md transition-all duration-300",
              scrolled ? "bg-background/80 shadow-sm" : "bg-transparent"
            )}
          >
            <div className="container mx-auto px-4 py-6 max-w-7xl">
              {/* Welcome Section */}
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="flex items-center">
                    <h1 className="text-3xl font-bold tracking-tight">
                      Hey, Abhishek! 👋
                    </h1>
                    <Badge variant="outline" className="ml-3 bg-primary/5 border-primary/20 text-primary/80 px-2 py-0.5 hidden sm:flex items-center gap-1">
                      <Sparkles className="h-3 w-3" />
                      <span className="text-xs font-medium">Premium</span>
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      {formattedDate}
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                      <Button
                      size="lg"
                      className="mt-4 lg:mt-0 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md hover:shadow-lg transition-all duration-300"
                      asChild
                      >
                      <Link href="/plan">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Create New Experience
                      </Link>
                      </Button>
                </motion.div>
              </div>
            </div>
          </div>

          <div className="container mx-auto px-4 py-6 max-w-7xl">
            {/* Stats Overview with animation */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <StatCards />
            </motion.div>

            {/* Experience Categories */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-10"
            >
              <Tabs defaultValue="all">
                <div className="border-b mb-6">
                  <TabsList className="bg-muted/40 p-0.5 rounded-xl w-full justify-start overflow-x-auto flex-nowrap hide-scrollbar">
                    {categories.map((category) => (
                      <TabsTrigger
                        key={category.value}
                        value={category.value}
                        className="data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg px-4 py-2 relative"
                      >
                        <span>{category.label}</span>
                        <Badge variant="secondary" className="ml-2 h-5 bg-muted/80 hover:bg-muted text-xs">
                          {category.count}
                        </Badge>
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </div>

                <AnimatePresence mode="wait">
                  <TabsContent 
                    value="all"
                    className="mt-6 focus-visible:outline-none focus-visible:ring-0"
                  >
                    <motion.div
                      key="all"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {/* Upcoming Experiences with subtle animation */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                      >
                        <UpcomingExperiences />
                      </motion.div>

                      {/* Saved Itineraries */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                      >
                        <SavedItineraries />
                      </motion.div>

                      {/* Two-column layout for recommendations and past experiences */}
                      <motion.div 
                        className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-10"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                      >
                        <RecommendationsPanel />
                        <PastExperiencesPanel />
                      </motion.div>
                    </motion.div>
                  </TabsContent>

                  {/* Other tabs would have filtered content */}
                  {categories.slice(1).map((category) => (
                    <TabsContent 
                      key={category.value} 
                      value={category.value}
                      className="mt-6 focus-visible:outline-none focus-visible:ring-0"
                    >
                      <motion.div
                        key={category.value}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <UpcomingExperiences categoryFilter={category.label} />
                      </motion.div>
                    </TabsContent>
                  ))}
                </AnimatePresence>
              </Tabs>
            </motion.div>
          </div>
        </div>
      </div>
    </Layout>
  );
}