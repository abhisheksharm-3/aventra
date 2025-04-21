"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  ArrowLeft, MessageSquare, FormInput, Sparkles, CheckCircle, ChevronRight,
  Plane, Compass, Map, Calendar
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Import your existing components
import { SearchBar } from "@/components/hero-generation/SearchBar";
import { FilterBar } from "@/components/hero-generation/FilterBar";
import { ChatPlanningDialog } from "@/components/dashboard/chat-planning-dialog";
import Layout from "@/components/layout/Layout";

// Current date and user data from the prompt
const currentDate = "2025-04-21 14:53:27";
const currentUser = "abhisheksharm-3";

export default function NewTripPage() {
  const [activeOption, setActiveOption] = useState<"form" | "chat" | null>(null);
  const [chatDialogOpen, setChatDialogOpen] = useState(false);

  // Extract time of day for personalized greeting
  const hour = new Date(currentDate).getHours();
  const timeOfDay = hour < 12 ? "morning" : hour < 18 ? "afternoon" : "evening";
  
  // Format username for display
  const displayName = currentUser.split('-')[0];
  const capitalizedName = displayName.charAt(0).toUpperCase() + displayName.slice(1);
  
  return (
    <Layout className="flex flex-col min-h-screen">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[15%] right-[10%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] opacity-70"></div>
        <div className="absolute bottom-[10%] left-[5%] w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px] opacity-60"></div>
      </div>
      
      <main className="flex-1 container py-8 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <Link href="/dashboard" className="flex items-center text-muted-foreground hover:text-foreground mb-4 group">
            <motion.div
              whileHover={{ x: -2 }}
              className="flex items-center"
            >
              <ArrowLeft className="mr-2 h-4 w-4 group-hover:text-primary transition-colors" />
              Back to Dashboard
            </motion.div>
          </Link>
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Create New Trip</h1>
              <p className="text-muted-foreground mt-2">
                Good {timeOfDay}, {capitalizedName}! Ready to plan your next adventure?
              </p>
            </div>
            
            <Badge 
              variant="outline"
              className="self-start bg-primary/10 border-primary/20 text-primary hover:bg-primary/15 flex items-center gap-1.5 px-3 py-1.5 h-auto"
            >
              <Plane className="h-3.5 w-3.5" />
              <span>Premium Planning</span>
            </Badge>
          </div>
        </motion.div>
        
        {/* Option selection cards */}
        <AnimatePresence mode="wait">
          {!activeOption && (
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              {/* Form-based planning option */}
              <motion.div
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <Card className="border border-border/40 hover:border-primary/30 hover:shadow-md transition-all cursor-pointer h-full relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <CardContent className="pt-6 px-6 relative z-10">
                    <div className="h-12 w-12 rounded-full bg-background border border-primary/20 flex items-center justify-center mb-5 shadow-sm">
                      <FormInput className="h-5 w-5 text-primary" />
                    </div>
                    <h2 className="text-xl font-semibold mb-2">Form-Based Planning</h2>
                    <p className="text-muted-foreground">
                      Enter your travel details directly using our structured form. Perfect when you already know your destination and preferences.
                    </p>
                    
                    <div className="mt-6 space-y-3.5">
                      <div className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-emerald-500 dark:text-emerald-400 mr-3 mt-0.5 shrink-0" />
                        <p className="text-sm">Quick and direct approach</p>
                      </div>
                      <div className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-emerald-500 dark:text-emerald-400 mr-3 mt-0.5 shrink-0" />
                        <p className="text-sm">Best for specific destinations</p>
                      </div>
                      <div className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-emerald-500 dark:text-emerald-400 mr-3 mt-0.5 shrink-0" />
                        <p className="text-sm">Detailed filtering options</p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="px-6 pb-6 pt-4 relative z-10">
                    <Button 
                      onClick={() => setActiveOption("form")} 
                      className="w-full bg-primary/10 hover:bg-primary/20 text-primary hover:text-primary border-[1.5px] border-primary/20 hover:border-primary/40"
                    >
                      Use Form Planner
                      <ChevronRight className="ml-2 h-4 w-4 opacity-70" />
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
              
              {/* Chat-based planning option */}
              <motion.div
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <Card className="border border-border/40 hover:border-primary/30 hover:shadow-md transition-all cursor-pointer h-full relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <CardContent className="pt-6 px-6 relative z-10">
                    <div className="h-12 w-12 rounded-full bg-background border border-blue-500/20 flex items-center justify-center mb-5 shadow-sm">
                      <MessageSquare className="h-5 w-5 text-blue-500" />
                    </div>
                    <h2 className="text-xl font-semibold mb-2">Chat with AI Planner</h2>
                    <p className="text-muted-foreground">
                      Have a conversation with our AI travel assistant who will guide you through planning your perfect trip.
                    </p>
                    
                    <div className="mt-6 space-y-3.5">
                      <div className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-emerald-500 dark:text-emerald-400 mr-3 mt-0.5 shrink-0" />
                        <p className="text-sm">Natural conversation experience</p>
                      </div>
                      <div className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-emerald-500 dark:text-emerald-400 mr-3 mt-0.5 shrink-0" />
                        <p className="text-sm">Great for undecided travelers</p>
                      </div>
                      <div className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-emerald-500 dark:text-emerald-400 mr-3 mt-0.5 shrink-0" />
                        <p className="text-sm">Personalized recommendations</p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="px-6 pb-6 pt-4 relative z-10">
                    <Button 
                      onClick={() => setChatDialogOpen(true)} 
                      className="w-full bg-blue-500/10 hover:bg-blue-500/20 text-blue-500 hover:text-blue-600 border-[1.5px] border-blue-500/20 hover:border-blue-500/40"
                    >
                      Start Chat Planning
                      <ChevronRight className="ml-2 h-4 w-4 opacity-70" />
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Form-based planning interface */}
        <AnimatePresence mode="wait">
          {activeOption === "form" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.4 }}
              className="max-w-3xl"
            >
              <Button 
                variant="ghost" 
                onClick={() => setActiveOption(null)}
                className="mb-6 group hover:bg-background"
              >
                <ArrowLeft className="mr-2 h-4 w-4 group-hover:text-primary transition-colors" />
                Back to options
              </Button>
              
              <div className="bg-card/50 backdrop-blur-sm border border-border/40 rounded-xl p-6 sm:p-8 shadow-sm">
                <div className="flex items-center gap-3 mb-8">
                  <div className="h-10 w-10 rounded-full bg-background border border-primary/20 flex items-center justify-center shadow-sm">
                    <Compass className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">Plan Your Trip</h2>
                    <p className="text-sm text-muted-foreground">Fill in the details to create your perfect itinerary</p>
                  </div>
                </div>
                
                <div className="space-y-8">
                  {/* Destination search */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <Map className="h-4 w-4 text-primary" />
                      <h3 className="text-sm font-medium">Where would you like to go?</h3>
                    </div>
                    <SearchBar />
                  </motion.div>
                  
                  {/* Travel dates */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <Calendar className="h-4 w-4 text-primary" />
                      <h3 className="text-sm font-medium">When would you like to travel?</h3>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="bg-muted rounded-md p-3 text-center border border-border/30">
                        <p className="text-sm text-muted-foreground mb-1">Start Date</p>
                        <p className="font-medium">May 15, 2025</p>
                      </div>
                      <div className="bg-muted rounded-md p-3 text-center border border-border/30">
                        <p className="text-sm text-muted-foreground mb-1">End Date</p>
                        <p className="font-medium">May 22, 2025</p>
                      </div>
                    </div>
                  </motion.div>
                  
                  {/* Travel preferences */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.3 }}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <Sparkles className="h-4 w-4 text-primary" />
                      <h3 className="text-sm font-medium">Travel preferences</h3>
                    </div>
                    <FilterBar />
                  </motion.div>
                  
                  {/* Generate button */}
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.4 }}
                    className="pt-2"
                  >
                    <Button className="w-full sm:w-auto bg-gradient-to-r from-primary to-blue-500 hover:from-primary/90 hover:to-blue-500/90 text-white border-0">
                      <Sparkles className="mr-2 h-4 w-4" />
                      Generate AI Itinerary
                    </Button>
                    <p className="text-xs text-muted-foreground mt-2">Our AI will create a personalized itinerary based on your preferences</p>
                  </motion.div>
                </div>
              </div>
              
              <div className="mt-10 text-center">
                <p className="text-muted-foreground text-sm mb-4">Not sure where to start?</p>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setActiveOption(null);
                    setChatDialogOpen(true);
                  }}
                  className="border-primary/20 hover:border-primary/40 text-primary bg-transparent hover:bg-primary/5"
                >
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Switch to Chat Planning
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      
      {/* Chat Dialog */}
      <ChatPlanningDialog open={chatDialogOpen} onOpenChange={setChatDialogOpen} />
    </Layout>
  );
}