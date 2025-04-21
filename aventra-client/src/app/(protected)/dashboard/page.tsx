"use client";

import { useState, useEffect } from "react";
import DashboardSidebar from "@/components/dashboard/dashboard-sidebar";
import StatCards from "@/components/dashboard/stat-card";
import UpcomingExperiences from "@/components/dashboard/upcoming-experiences";
import SavedItineraries from "@/components/dashboard/saved-itineraries";
import RecommendationsPanel from "@/components/dashboard/recommendations-panel";
import PastExperiencesPanel from "@/components/dashboard/past-experiences-panel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/layout/Navbar";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  
  return (
    <SidebarProvider>
      <DashboardSidebar />
      <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className="flex flex-1 h-[calc(100vh-64px)] overflow-hidden">
        
        {/* Main Content Area */}
        <div className="flex-1 overflow-auto">
          <div className="container mx-auto px-4 py-6 max-w-7xl">
            {/* Welcome Section */}
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Hey, Abhishek! 👋</h1>
                <p className="text-muted-foreground mt-1">
                  Ready to plan your next adventure?
                </p>
              </div>
              <Button size="lg" className="mt-4 lg:mt-0 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                <PlusCircle className="mr-2 h-4 w-4" />
                Create New Experience
              </Button>
            </div>

            {/* Stats Overview */}
            <StatCards />
            
            {/* Experience Categories */}
            <Tabs defaultValue="all" className="mt-10">
              <div className="border-b mb-6">
                <TabsList className="bg-transparent w-full justify-start">
                  <TabsTrigger value="all" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none data-[state=active]:shadow-none">
                    All
                  </TabsTrigger>
                  <TabsTrigger value="trips" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none data-[state=active]:shadow-none">
                    Trips
                  </TabsTrigger>
                  <TabsTrigger value="nights-out" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none data-[state=active]:shadow-none">
                    Nights Out
                  </TabsTrigger>
                  <TabsTrigger value="family" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none data-[state=active]:shadow-none">
                    Family
                  </TabsTrigger>
                  <TabsTrigger value="date-night" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none data-[state=active]:shadow-none">
                    Date Night
                  </TabsTrigger>
                  <TabsTrigger value="dining" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none data-[state=active]:shadow-none">
                    Dining
                  </TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="all">
                {/* Upcoming Experiences */}
                <UpcomingExperiences />
                
                {/* Saved Itineraries */}
                <SavedItineraries />
                
                {/* Two-column layout for recommendations and past experiences */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-10">
                  <RecommendationsPanel />
                  <PastExperiencesPanel />
                </div>
              </TabsContent>
              
              {/* Other tabs would have filtered content */}
              <TabsContent value="trips">
                <UpcomingExperiences categoryFilter="Trip" />
              </TabsContent>
              
              <TabsContent value="nights-out">
                <UpcomingExperiences categoryFilter="Night Out" />
              </TabsContent>
              
              <TabsContent value="family">
                <UpcomingExperiences categoryFilter="Family" />
              </TabsContent>
              
              <TabsContent value="date-night">
                <UpcomingExperiences categoryFilter="Date Night" />
              </TabsContent>
              
              <TabsContent value="dining">
                <UpcomingExperiences categoryFilter="Dining" />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}