"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  ArrowLeft, MessageSquare, FormInput, Sparkles, CheckCircle, ChevronRight
} from "lucide-react";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

// Import your existing components
import { SearchBar } from "@/components/hero-generation/SearchBar";
import { FilterBar } from "@/components/hero-generation/FilterBar";
import { ChatPlanningDialog } from "@/components/dashboard/chat-planning-dialog";

export default function NewTripPage() {
  const [activeOption, setActiveOption] = useState<"form" | "chat" | null>(null);
  const [chatDialogOpen, setChatDialogOpen] = useState(false);
  
  return (
    <div className="flex flex-col min-h-screen">
      
      <main className="flex-1 container py-8">
        <div className="mb-8">
          <Link href="/dashboard" className="flex items-center text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">Create New Trip</h1>
          <p className="text-muted-foreground mt-2">
            Choose how you&apos;d like to plan your next adventure
          </p>
        </div>
        
        {/* Option selection cards */}
        {!activeOption && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">
            {/* Form-based planning option */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="border-2 hover:border-primary/50 hover:shadow-md transition-all cursor-pointer h-full">
                <CardContent className="pt-6 px-6">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <FormInput className="h-6 w-6 text-primary" />
                  </div>
                  <h2 className="text-xl font-semibold mb-2">Form-Based Planning</h2>
                  <p className="text-muted-foreground">
                    Enter your travel details directly using our structured form. Perfect when you already know your destination and preferences.
                  </p>
                  
                  <div className="mt-6 space-y-3">
                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 shrink-0" />
                      <p className="text-sm">Quick and direct approach</p>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 shrink-0" />
                      <p className="text-sm">Best for specific destinations</p>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 shrink-0" />
                      <p className="text-sm">Detailed filtering options</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="px-6 pb-6 pt-2">
                  <Button 
                    onClick={() => setActiveOption("form")} 
                    className="w-full"
                  >
                    Use Form Planner
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
            
            {/* Chat-based planning option */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card className="border-2 hover:border-primary/50 hover:shadow-md transition-all cursor-pointer h-full">
                <CardContent className="pt-6 px-6">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <MessageSquare className="h-6 w-6 text-primary" />
                  </div>
                  <h2 className="text-xl font-semibold mb-2">Chat with AI Planner</h2>
                  <p className="text-muted-foreground">
                    Have a conversation with our AI travel assistant who will guide you through planning your perfect trip.
                  </p>
                  
                  <div className="mt-6 space-y-3">
                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 shrink-0" />
                      <p className="text-sm">Natural conversation experience</p>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 shrink-0" />
                      <p className="text-sm">Great for undecided travelers</p>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 shrink-0" />
                      <p className="text-sm">Personalized recommendations</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="px-6 pb-6 pt-2">
                  <Button 
                    onClick={() => setChatDialogOpen(true)} 
                    className="w-full"
                  >
                    Start Chat Planning
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          </div>
        )}
        
        {/* Form-based planning interface */}
        {activeOption === "form" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-3xl mx-auto"
          >
            <Button 
              variant="ghost" 
              onClick={() => setActiveOption(null)}
              className="mb-6"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to options
            </Button>
            
            <div className="bg-muted/40 rounded-xl p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <FormInput className="h-4 w-4 text-primary" />
                </div>
                <h2 className="text-xl font-semibold">Plan Your Trip</h2>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium mb-2">Where would you like to go?</h3>
                  <SearchBar />
                </div>
                
                <div>
                  <h3 className="text-sm font-medium mb-2">Travel preferences</h3>
                  <FilterBar />
                </div>
                
                <div className="pt-4">
                  <Button className="w-full sm:w-auto">
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate AI Itinerary
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="mt-8 text-center">
              <p className="text-muted-foreground text-sm mb-4">Not sure where to start?</p>
              <Button 
                variant="outline" 
                onClick={() => {
                  setActiveOption(null);
                  setChatDialogOpen(true);
                }}
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                Switch to Chat Planning
              </Button>
            </div>
          </motion.div>
        )}
      </main>
      
      {/* Chat Dialog */}
      <ChatPlanningDialog open={chatDialogOpen} onOpenChange={setChatDialogOpen} />
    </div>
  );
}