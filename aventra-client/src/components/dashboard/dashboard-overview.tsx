"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Calendar, Clock, CalendarDays, PlusCircle, 
  Sparkles, ChevronRight, ArrowRight, Globe, 
  MapPin, Heart, Compass, Briefcase, Zap,
  FileText, Bell
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { User } from "@/types/appwrite";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import PlanningInspirationCard from "./planning-inspiration-card";

interface DashboardOverviewProps {
  user: User | null;
}

interface TripData {
  id: string;
  destination: string;
  startDate: string;
  endDate: string;
  image: string;
  daysRemaining?: number;
  progress?: number;
}

const upcomingTrips: TripData[] = [
  {
    id: "mongolia-2025",
    destination: "Mongolia",
    startDate: "Jun 15, 2025",
    endDate: "Jun 28, 2025",
    image: "https://images.unsplash.com/photo-1602207072074-bd868c14c801",
    daysRemaining: 37,
    progress: 65
  }
];

const recommendedDestinations = [
  {
    id: "istanbul",
    name: "Istanbul",
    tagline: "Where Continents Meet",
    match: 94,
    image: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200"
  },
  {
    id: "capetown",
    name: "Cape Town",
    tagline: "Where Mountains Meet Sea",
    match: 88,
    image: "https://images.unsplash.com/photo-1580060839134-75a5edca2e99"
  },
  {
    id: "kyoto",
    name: "Kyoto",
    tagline: "Ancient Traditions",
    match: 85,
    image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e"
  }
];

export default function DashboardOverview({ user }: DashboardOverviewProps) {
  // Tabs for actions and ideas
  const [activeTab, setActiveTab] = useState<'destinations' | 'actions'>('destinations');
  
  // Current date formatting
  const currentDate = new Date("2025-05-09").toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
  
  return (
    <div className="space-y-8 animate-in fade-in-50 duration-500">
      {/* Welcome Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-background/80 backdrop-blur-sm border border-border/30 rounded-xl p-6 shadow-sm"
      >
        <div>
          <h1 className="text-3xl md:text-4xl font-serif font-medium">
            Welcome, <span className="text-primary">{user?.name || user?.email}</span>
          </h1>
          <p className="text-muted-foreground mt-1">{currentDate} • Let&apos;s plan your next adventure</p>
        </div>
        
        <div className="flex items-center gap-3">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href="/dashboard/trips">
                  <Button variant="outline" className="gap-2">
                    <Globe className="h-4 w-4" />
                    My Trips
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
                    <PlusCircle className="h-4 w-4" />
                    Plan New Trip
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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <PlanningInspirationCard />
          </motion.div>
          
          {/* Next Trip Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="overflow-hidden border-border/40 shadow-sm">
              <CardHeader className="bg-muted/30 p-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-medium flex items-center gap-2">
                    <Clock className="h-4 w-4 text-primary" />
                    Your Upcoming Journey
                  </CardTitle>
                  
                  <Link href="/dashboard/trips">
                    <Button variant="ghost" size="sm" className="gap-1 text-xs h-8">
                      View All
                      <ChevronRight className="h-3 w-3" />
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              
              {upcomingTrips.length > 0 ? (
                <div>
                  <div className="relative h-52 md:h-64 w-full">
                    <Image
                      src={upcomingTrips[0].image}
                      alt={upcomingTrips[0].destination}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10"></div>
                    
                    {/* Trip timeline - visual enhancement */}
                    <div className="absolute left-4 right-4 bottom-16 h-1 bg-white/30 rounded-full overflow-hidden">
                      <div className="h-full bg-white/80 rounded-full" style={{ width: "30%" }}></div>
                      <div className="absolute left-[30%] top-1/2 -translate-y-1/2 h-3 w-3 rounded-full bg-white shadow-glow"></div>
                    </div>
                    
                    <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                      <div className="flex items-center gap-1.5 text-white/90 text-sm mb-1">
                        <CalendarDays className="h-3.5 w-3.5" />
                        <span>{upcomingTrips[0].startDate} - {upcomingTrips[0].endDate}</span>
                      </div>
                      <h3 className="text-2xl md:text-3xl font-medium">{upcomingTrips[0].destination}</h3>
                    </div>
                  </div>
                  
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-primary border-primary/30 bg-primary/5">
                          {upcomingTrips[0].daysRemaining} days remaining
                        </Badge>
                      </div>
                      <span className="text-sm text-muted-foreground">Trip planning progress</span>
                    </div>
                    
                    <div className="h-1.5 bg-muted/50 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary rounded-full"
                        style={{ width: `${upcomingTrips[0].progress}%` }}
                      ></div>
                    </div>
                  </CardContent>
                  
                  <CardFooter className="p-4 pt-0 flex justify-between">
                    <Link href={`/dashboard/trips/${upcomingTrips[0].id}`}>
                      <Button variant="ghost" size="sm" className="text-primary hover:text-primary/90 gap-1">
                        View Itinerary
                        <ChevronRight className="h-3.5 w-3.5" />
                      </Button>
                    </Link>
                    
                    <Link href={`/plan?edit=${upcomingTrips[0].id}`}>
                      <Button variant="outline" size="sm">Edit Trip</Button>
                    </Link>
                  </CardFooter>
                </div>
              ) : (
                <CardContent className="p-8 text-center">
                  <div className="h-12 w-12 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Calendar className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <CardTitle className="text-lg mb-2">No upcoming trips</CardTitle>
                  <CardDescription className="mb-4">
                    Start planning your next adventure with our AI-powered tools
                  </CardDescription>
                  <Link href="/plan">
                    <Button>Create Your First Trip</Button>
                  </Link>
                </CardContent>
              )}
            </Card>
          </motion.div>
        </div>
        
        {/* Right Column - Recommendations & Actions */}
        <div className="space-y-6">
          {/* Tabs for Recommendations & Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="border-border/40 shadow-sm overflow-hidden">
              <div className="flex border-b border-border/40">
                <button 
                  onClick={() => setActiveTab('destinations')}
                  className={cn(
                    "flex-1 py-3 px-4 text-sm font-medium transition-colors relative",
                    activeTab === 'destinations' ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  AI Recommendations
                  {activeTab === 'destinations' && (
                    <motion.div 
                      layoutId="tabIndicator"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                    />
                  )}
                </button>
                
                <button 
                  onClick={() => setActiveTab('actions')}
                  className={cn(
                    "flex-1 py-3 px-4 text-sm font-medium transition-colors relative",
                    activeTab === 'actions' ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  Quick Actions
                  {activeTab === 'actions' && (
                    <motion.div 
                      layoutId="tabIndicator"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                    />
                  )}
                </button>
              </div>
              
              <div className="p-4">
                {activeTab === 'destinations' && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <Sparkles className="h-3.5 w-3.5 text-primary" />
                        <span className="text-sm font-medium">Personalized for You</span>
                      </div>
                      <Link href="/explore">
                        <Button variant="ghost" size="sm" className="text-xs h-7 gap-1">
                          More Ideas
                          <ChevronRight className="h-3 w-3" />
                        </Button>
                      </Link>
                    </div>
                    
                    <div className="grid gap-3">
                      {recommendedDestinations.map((dest, i) => (
                        <Link 
                          key={dest.id} 
                          href={`/explore/${dest.id}`}
                          className="group block"
                        >
                          <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 * i, duration: 0.4 }}
                            className="relative h-24 rounded-lg overflow-hidden border border-border/40"
                          >
                            <Image
                              src={dest.image}
                              alt={dest.name}
                              fill
                              className="object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30"></div>
                            
                            <div className="absolute inset-0 flex items-center justify-between p-4">
                              <div className="text-white">
                                <h3 className="font-medium">{dest.name}</h3>
                                <p className="text-xs text-white/80">{dest.tagline}</p>
                              </div>
                              <Badge className="bg-primary/90 group-hover:bg-primary transition-colors">
                                {dest.match}% match
                              </Badge>
                            </div>
                          </motion.div>
                        </Link>
                      ))}
                      
                      <Link href="/plan" className="mt-2 group">
                        <div className="flex items-center justify-between text-sm text-primary py-2">
                          <span className="font-medium group-hover:underline">
                            Start planning a custom trip
                          </span>
                          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </Link>
                    </div>
                  </motion.div>
                )}
                
                {activeTab === 'actions' && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-3 py-1"
                  >
                    {[
                      { title: "Update Mongolia visa info", href: "/dashboard/documents", icon: FileText },
                      { title: "Complete pending bookings", href: "/dashboard/trips/mongolia-2025", icon: Briefcase },
                      { title: "Verify your travel insurance", href: "/dashboard/documents", icon: Zap },
                      { title: "Check flight deals for Mongolia", href: "/explore/flights", icon: Globe },
                      { title: "View your travel notifications", href: "/dashboard/notifications", icon: Bell },
                    ].map((action, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -5 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.07 * i, duration: 0.3 }}
                      >
                        <Link 
                          href={action.href}
                          className="flex items-center justify-between p-2.5 hover:bg-muted/50 rounded-md transition-colors group"
                        >
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                              <action.icon className="h-4 w-4 text-primary" />
                            </div>
                            <span className="text-sm">{action.title}</span>
                          </div>
                          <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                        </Link>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </div>
            </Card>
          </motion.div>
          
          {/* Travel Stats Card - Replacing Profile Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="border-border/40 shadow-sm overflow-hidden">
              <CardHeader className="bg-muted/30 p-4">
                <CardTitle className="text-lg font-medium flex items-center gap-2">
                  <Compass className="h-4 w-4 text-primary" />
                  Travel Insights
                </CardTitle>
              </CardHeader>
              
              <CardContent className="p-4">
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "Countries", value: "7", icon: Globe, color: "blue" },
                    { label: "Total Trips", value: "12", icon: Briefcase, color: "amber" },
                    { label: "Distance", value: "28,410 km", icon: MapPin, color: "emerald" },
                    { label: "Saved Places", value: "24", icon: Heart, color: "rose" },
                  ].map((stat, i) => (
                    <div 
                      key={i} 
                      className={`p-3 rounded-lg bg-${stat.color}-500/5 border border-${stat.color}-500/10 flex items-center gap-3 hover:bg-${stat.color}-500/10 transition-colors duration-300 group cursor-default`}
                    >
                      <div className={`h-8 w-8 rounded-full bg-${stat.color}-500/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 flex-shrink-0`}>
                        <stat.icon className={`h-4 w-4 text-${stat.color}-500`} />
                      </div>
                      <div>
                        <div className="text-lg font-medium">{stat.value}</div>
                        <div className="text-xs text-muted-foreground">{stat.label}</div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-3 pt-3 border-t border-border/20">
                  <Link href="/dashboard/analytics" className="flex items-center justify-center gap-1.5 text-sm text-primary hover:underline">
                    View detailed travel analytics
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}