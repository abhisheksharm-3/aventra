/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { SetStateAction, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Sparkles,
  MessageSquare,
  ChevronRight,
  Bot,
  Sun,
  Compass,
  Users
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsContent,
} from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

import Layout from "@/components/layout/Layout";
import { ChatPlanningDialog } from "@/components/dashboard/chat-planning-dialog";
import { useSearchStore } from "@/stores/searchStore";
import { FilterOptions } from "@/types/hero";

// Trip type options with enhanced icons
const tripTypes = [
  { id: "beach", name: "Beach Getaway", icon: "🏖️", description: "Relax on stunning shores with sun and sea" },
  { id: "city", name: "City Exploration", icon: "🏙️", description: "Discover urban gems and cultural hotspots" },
  { id: "nature", name: "Nature Retreat", icon: "🏞️", description: "Connect with wilderness and stunning landscapes" },
  { id: "cultural", name: "Cultural Journey", icon: "🏛️", description: "Immerse in local traditions and heritage" },
  { id: "adventure", name: "Adventure Trip", icon: "🧗", description: "Seek thrills and adrenaline-pumping activities" },
  { id: "culinary", name: "Culinary Tour", icon: "🍽️", description: "Savor local flavors and food experiences" },
];

// Sample inspiration categories
const inspirationCategories = [
  "Family-friendly", "Couples retreat", "Solo adventure", "Off the beaten path",
  "Budget-friendly", "Luxury escape", "Weekend getaway", "Work & travel"
];

// Sample trending searches for context
const trendingSearches = [
  "Relaxing beach vacation with spa treatments",
  "Hiking trip with scenic views",
  "Cultural immersion with local experiences",
  "Food tour with cooking classes",
  "Historical sites with guided tours"
];

export default function NewTripPage() {
  // Define trip type interface
  interface TripType {
    id: string;
    name: string;
    icon: string;
    description: string;
  }
  
  // State management
    const [selectedDestination, setSelectedDestination] = useState("");
    const [selectedTripType, setSelectedTripType] = useState<TripType | null>(null);
    const [planningStep, setPlanningStep] = useState(0);
    const [aiChatOpen, setAiChatOpen] = useState(false);
    const [tripContext, setTripContext] = useState("");
  
  // Use search store
  const {
    setFilterOptions
  } = useSearchStore();

  // Handle trip context submission
  const handleContextSubmit = (query: string) => {
    if (query && query.trim()) {
      setTripContext(query);
      setTimeout(() => setPlanningStep(1), 300);
    }
  };

  // Handle destination selection from filterbar
  const handleFilterChange = (options: Partial<FilterOptions>) => {
    setFilterOptions(options);
    // If there's a location in options, set it as selected destination
    if (options.location) {
      setSelectedDestination(options.location);
    }
  };

  // Calculate progress percentage
  const progressPercentage = (planningStep / 1) * 100;

  // Helper function to get gradient based on trip type
  const getTripTypeGradient = (typeId: string) => {
    const gradients = {
      beach: "from-blue-50 to-cyan-50 border-blue-100",
      city: "from-slate-50 to-zinc-50 border-slate-100",
      nature: "from-green-50 to-emerald-50 border-green-100",
      cultural: "from-amber-50 to-yellow-50 border-amber-100",
      adventure: "from-red-50 to-orange-50 border-red-100",
      culinary: "from-pink-50 to-rose-50 border-pink-100",
    };
    return selectedTripType?.id === typeId 
      ? `bg-gradient-to-br border-2 border-primary/50 shadow-sm` 
      : `hover:bg-gradient-to-br border border-border/50`;
  };

  return (
    <Layout className="bg-gradient-to-b from-background to-accent/10">
      {/* Enhanced header with gradient underline */}
      <div className="relative py-6 border-b bg-background/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container max-w-6xl">
          <div className="flex justify-between items-center">
            <Link href="/dashboard" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition w-fit group">
              <ArrowLeft className="h-4 w-4 group-hover:translate-x-[-2px] transition" />
              <span>Back to Dashboard</span>
            </Link>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setAiChatOpen(true)} 
              className="flex items-center gap-1.5 bg-background/80 hover:bg-accent/20"
            >
              <Bot className="h-4 w-4 text-primary" />
              <span>Trip Assistant</span>
            </Button>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-primary/30 via-primary/60 to-primary/30"></div>
      </div>

      <main className="container py-12 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center space-y-2 mb-10"
        >
          <h1 className="text-4xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">
            Create Your Perfect Trip
          </h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            Tell us what you&apos;re looking for, and we&apos;ll help you plan an unforgettable journey
          </p>
        </motion.div>

        {/* Planning progress - enhanced with animation */}
        <div className="mb-10 max-w-md mx-auto">
          <div className="flex items-center justify-between mb-2">
            <motion.span 
              key={`step-${planningStep}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm font-medium text-primary"
            >
              Step {planningStep + 1} of 2
            </motion.span>
            <motion.span 
              key={`title-${planningStep}`}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-sm font-medium"
            >
              {planningStep === 0 ? "Trip Context & Theme" : "Destination & Details"}
            </motion.span>
          </div>
          <div className="h-1.5 bg-accent rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-gradient-to-r from-primary/80 to-primary rounded-full"
              initial={{ width: `${progressPercentage - 10}%` }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>
        </div>

        {/* Tabs for different planning steps */}
        <Tabs 
          value={`step-${planningStep}`}
          className="w-full"
        >
          {/* Step 1: Trip Context & Theme - With Autocomplete SearchBar */}
          <TabsContent value="step-0" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
            <AnimatePresence mode="wait">
              <motion.div
                key="step-0"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4 }}
                className="space-y-8"
              >
                <Card className="border shadow-sm overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/0 via-primary/30 to-primary/0"></div>
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2">
                      <Compass className="h-5 w-5 text-primary" />
                      Describe your ideal trip
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm text-muted-foreground mb-4">
                      Tell us what you&apos;re looking for in your trip - activities, atmosphere, experiences
                    </p>
                    
                    {/* SearchBar as autocomplete for trip context */}
                    <div className="mb-6">
                      <p className="text-xs text-muted-foreground mt-2">
                        Add context to help us understand your trip vision (you&apos;ll select locations in the next step)
                      </p>
                    </div>
                    
                    {/* Trending searches */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Sparkles className="h-3.5 w-3.5 text-primary" />
                        <h3 className="text-sm font-medium">Trending inspiration</h3>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        {trendingSearches.map((search, i) => (
                          <Badge 
                            key={i} 
                            variant="outline" 
                            className="cursor-pointer hover:bg-accent transition-colors py-1.5 px-3 bg-accent/40"
                            onClick={() => handleContextSubmit(search)}
                          >
                            {search}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    {/* Inspiration categories */}
                    <div className="mt-6 pt-6 border-t">
                      <div className="flex items-center gap-2 mb-4">
                        <Sun className="h-3.5 w-3.5 text-primary" />
                        <h3 className="text-sm font-medium">Trip inspiration by theme</h3>
                      </div>
                      
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {inspirationCategories.map((category, i) => (
                          <button
                            key={i}
                            className="py-2 px-3 rounded-lg text-sm border bg-accent/20 hover:bg-accent/40 transition-colors text-center"
                            onClick={() => handleContextSubmit(category)}
                          >
                            {category}
                          </button>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* AI Assistant Card - Enhanced */}
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10 overflow-hidden">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                    <CardContent className="p-5 flex items-start gap-4 relative z-10">
                      <div className="bg-primary/10 p-2.5 rounded-full mt-0.5">
                        <Bot className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium mb-1">Need inspiration?</h3>
                        <p className="text-sm text-muted-foreground mb-3">
                          Our AI travel expert can suggest destinations and experiences based on your preferences
                        </p>
                        <Button 
                          size="sm" 
                          className="w-full sm:w-auto"
                          onClick={() => setAiChatOpen(true)}
                        >
                          <MessageSquare className="mr-2 h-3.5 w-3.5" />
                          Chat with Travel AI
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
                
                <div className="flex justify-end">
                  <Button
                    onClick={() => setPlanningStep(1)}
                    disabled={!tripContext}
                    className="group"
                  >
                    Continue
                    <ChevronRight className="ml-1.5 h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                  </Button>
                </div>
              </motion.div>
            </AnimatePresence>
          </TabsContent>

          {/* Step 2: Destination & Trip Details - With FilterBar */}
          <TabsContent value="step-1" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
            <AnimatePresence mode="wait">
              <motion.div
                key="step-1"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4 }}
                className="space-y-8"
              >
                {/* Trip Context Display */}
                {tripContext && (
                  <Card className="bg-gradient-to-r from-accent/50 to-accent/30 border-accent/50 overflow-hidden">
                    <CardContent className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="bg-background p-1.5 rounded-full">
                          <Compass className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground mb-0.5">Trip Theme</div>
                          <div className="text-sm font-medium">{tripContext}</div>
                        </div>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 px-2 text-xs"
                        onClick={() => setPlanningStep(0)}
                      >
                        Change
                      </Button>
                    </CardContent>
                  </Card>
                )}

                {/* Trip Type Selection - Enhanced with descriptions */}
                <Card className="border shadow-sm overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/0 via-primary/30 to-primary/0"></div>
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2">
                      <Compass className="h-5 w-5 text-primary" />
                      What type of experience?
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-2">
                    <p className="text-sm text-muted-foreground mb-4">
                      Select the type of trip that best matches your travel aspirations
                    </p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {tripTypes.map((type) => (
                        <motion.div
                          key={type.id}
                          whileHover={{ y: -2, scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                          onClick={() => setSelectedTripType(type)}
                          className={cn(
                            "flex flex-col items-center gap-2 p-4 rounded-xl cursor-pointer transition-all",
                            getTripTypeGradient(type.id)
                          )}
                        >
                          <span className="text-3xl my-1">{type.icon}</span>
                          <span className="text-sm font-medium">{type.name}</span>
                          <p className="text-xs text-center text-muted-foreground">{type.description}</p>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Destination & Trip Details - Using FilterBar component */}
                <Card className="border shadow-sm overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/0 via-primary/30 to-primary/0"></div>
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-primary" />
                      Where and when?
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-2">
                    <p className="text-sm text-muted-foreground mb-4">
                      Select your destination, travel dates, and group size
                    </p>
                    
                    
                    {/* Selected destination indicator */}
                    {selectedDestination && (
                      <div className="mt-4 flex items-center p-3 bg-primary/5 rounded-lg border border-primary/10">
                        <MapPin className="h-4 w-4 text-primary" />
                        <span className="text-sm ml-2">Destination: <span className="font-medium">{selectedDestination}</span></span>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* AI Recommendation Card - Enhanced */}
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10 overflow-hidden">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                    <CardHeader className="pb-2">
                      <CardTitle className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-primary" />
                        Personalized Recommendations
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="relative z-10">
                      <p className="text-sm mb-4">
                        {selectedDestination ? 
                          `Our AI can help customize your ${selectedTripType?.name?.toLowerCase() || "trip"} to ${selectedDestination} with personalized recommendations:` : 
                          "Let our AI travel assistant enhance your trip planning with expert suggestions:"}
                      </p>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
                        <Badge 
                          variant="outline" 
                          className="bg-background hover:bg-accent cursor-pointer py-3 flex items-center justify-center gap-2" 
                          onClick={() => setAiChatOpen(true)}
                        >
                          <MapPin className="h-3.5 w-3.5" /> Accommodations
                        </Badge>
                        <Badge 
                          variant="outline" 
                          className="bg-background hover:bg-accent cursor-pointer py-3 flex items-center justify-center gap-2" 
                          onClick={() => setAiChatOpen(true)}
                        >
                          <Compass className="h-3.5 w-3.5" /> Local experiences
                        </Badge>
                        <Badge 
                          variant="outline" 
                          className="bg-background hover:bg-accent cursor-pointer py-3 flex items-center justify-center gap-2" 
                          onClick={() => setAiChatOpen(true)}
                        >
                          <Calendar className="h-3.5 w-3.5" /> Itinerary planning
                        </Badge>
                        <Badge 
                          variant="outline" 
                          className="bg-background hover:bg-accent cursor-pointer py-3 flex items-center justify-center gap-2" 
                          onClick={() => setAiChatOpen(true)}
                        >
                          <Users className="h-3.5 w-3.5" /> Group activities
                        </Badge>
                      </div>
                      
                      <Button 
                        className="w-full"
                        onClick={() => setAiChatOpen(true)}
                      >
                        <Bot className="mr-2 h-4 w-4" />
                        Get Personalized Trip Plan
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>

                <div className="flex justify-between items-center pt-6">
                  <Button 
                    variant="outline"
                    onClick={() => setPlanningStep(0)}
                    className="group"
                  >
                    <ArrowLeft className="mr-1.5 h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
                    Back
                  </Button>
                  
                  <Button
                    onClick={() => setAiChatOpen(true)}
                    className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary group"
                    disabled={!selectedDestination}
                  >
                    <Sparkles className="h-4 w-4 mr-1.5 group-hover:scale-110 transition-transform" />
                    Generate Itinerary
                  </Button>
                </div>
              </motion.div>
            </AnimatePresence>
          </TabsContent>
        </Tabs>
      </main>
      
      {/* Chat Planning Dialog */}
      <ChatPlanningDialog open={aiChatOpen} onOpenChange={setAiChatOpen} />

      {/* Floating AI Chat Button - Enhanced */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg bg-gradient-to-br from-primary to-primary/80 hover:shadow-primary/20 hover:from-primary hover:to-primary/90 text-primary-foreground"
                onClick={() => setAiChatOpen(true)}
              >
                <Bot className="h-6 w-6" />
              </Button>
            </motion.div>
          </TooltipTrigger>
          <TooltipContent side="left" className="bg-primary text-primary-foreground border-primary/50">
            <p>Plan with AI assistant</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </Layout>
  );
}