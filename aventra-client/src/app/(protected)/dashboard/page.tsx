"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Calendar, MapPin, Globe, Plane, User, Settings, 
  PlusCircle, Bell, ChevronRight, ArrowRight,
  Sparkles, Compass, Clock, MapPinned, Heart
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { UpcomingTrip } from "@/components/dashboard/upcoming-trip";
import { SavedItinerary } from "@/components/dashboard/saved-itinerary";

import { mockUpcomingTrips, mockPastTrips, mockSavedItineraries, mockRecommendations } from "@/lib/mock/dashboard-data";

export default function DashboardPage() {
  const [activeSidebar, setActiveSidebar] = useState("overview");
  
  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="hidden md:flex w-64 flex-col border-r px-4 py-6">
        <div className="flex items-center mb-6 px-2">
          <Globe className="h-6 w-6 text-primary mr-2" />
          <h1 className="text-xl font-semibold">TripPlanner</h1>
        </div>
        
        <nav className="space-y-1 flex-1">
          <Button 
            variant={activeSidebar === "overview" ? "secondary" : "ghost"} 
            className="w-full justify-start" 
            onClick={() => setActiveSidebar("overview")}
          >
            <Globe className="mr-2 h-4 w-4" />
            Overview
          </Button>
          <Button 
            variant={activeSidebar === "trips" ? "secondary" : "ghost"} 
            className="w-full justify-start"
            onClick={() => setActiveSidebar("trips")}
          >
            <Plane className="mr-2 h-4 w-4" />
            My Trips
          </Button>
          <Button 
            variant={activeSidebar === "itineraries" ? "secondary" : "ghost"} 
            className="w-full justify-start"
            onClick={() => setActiveSidebar("itineraries")}
          >
            <MapPinned className="mr-2 h-4 w-4" />
            Itineraries
          </Button>
          <Button 
            variant={activeSidebar === "favorites" ? "secondary" : "ghost"} 
            className="w-full justify-start"
            onClick={() => setActiveSidebar("favorites")}
          >
            <Heart className="mr-2 h-4 w-4" />
            Favorites
          </Button>
          <Button 
            variant={activeSidebar === "profile" ? "secondary" : "ghost"} 
            className="w-full justify-start"
            onClick={() => setActiveSidebar("profile")}
          >
            <User className="mr-2 h-4 w-4" />
            Profile
          </Button>
        </nav>
        
        <div className="mt-auto pt-4 border-t">
          <Button 
            variant={activeSidebar === "settings" ? "secondary" : "ghost"} 
            className="w-full justify-start"
            onClick={() => setActiveSidebar("settings")}
          >
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Button>
          
          <div className="flex items-center mt-4 pt-4 border-t">
            <Avatar className="h-8 w-8">
              <AvatarImage src="/avatars/user.png" alt="Your Avatar" />
              <AvatarFallback>AS</AvatarFallback>
            </Avatar>
            <div className="ml-2">
              <p className="text-sm font-medium">Abhishek Sharma</p>
              <p className="text-xs text-muted-foreground">Premium Plan</p>
            </div>
          </div>
        </div>
      </aside>
      
      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <DashboardHeader />
        
        {/* Overview Dashboard */}
        <main className="px-4 md:px-8 py-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Welcome back, Abhishek!</h1>
              <p className="text-muted-foreground mt-1">
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex gap-2">
              <Button>
                <Plane className="mr-2 h-4 w-4" />
                New Trip
              </Button>
              <Button variant="outline">
                <Bell className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Upcoming Trips</p>
                    <p className="text-2xl font-bold">3</p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Plane className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Days Until Next Trip</p>
                    <p className="text-2xl font-bold">12</p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Calendar className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Countries Visited</p>
                    <p className="text-2xl font-bold">8</p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Globe className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Travel Budget</p>
                    <p className="text-2xl font-bold">₹45,000</p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-primary font-bold">₹</span>
                  </div>
                </div>
                <Progress className="mt-3" value={65} />
                <p className="text-xs mt-1 text-muted-foreground">65% of budget used</p>
              </CardContent>
            </Card>
          </div>

          {/* Upcoming trips */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Upcoming Trips</h2>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard/trips">
                  View all <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockUpcomingTrips.map((trip) => (
                <UpcomingTrip 
                  key={trip.id} 
                  name={trip.name}
                  location={trip.location} 
                  image={trip.image}
                  startDate={trip.startDate}
                  endDate={trip.endDate}
                  completed={trip.completed}
                />
              ))}
              
              <Card className="border-dashed border-2 bg-muted/50">
                <CardContent className="p-6 h-full flex flex-col items-center justify-center text-center">
                  <PlusCircle className="h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-muted-foreground font-medium">Plan a new trip</p>
                  <Button className="mt-4" variant="outline" size="sm">
                    Get Started
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
          
          {/* Saved itineraries */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Saved Itineraries</h2>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard/itineraries">
                  View all <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>
            
            <ScrollArea className="w-full whitespace-nowrap">
              <div className="flex space-x-4 pb-4">
                {mockSavedItineraries.map((itinerary) => (
                  <SavedItinerary
                    key={itinerary.id}
                    id={itinerary.id}
                    name={itinerary.name}
                    destination={itinerary.destination}
                    duration={itinerary.duration}
                    image={itinerary.image}
                    aiGenerated={itinerary.aiGenerated}
                  />
                ))}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </div>
          
          {/* Recommendations and past trips */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4 flex items-center">
                  <Sparkles className="h-4 w-4 text-primary mr-2" />
                  AI Recommendations
                </h3>
                <div className="space-y-4">
                  {mockRecommendations.map((rec, index) => (
                    <div key={index} className="flex items-start">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <Compass className="h-5 w-5 text-primary" />
                      </div>
                      <div className="ml-3">
                        <p className="font-medium">{rec.title}</p>
                        <p className="text-sm text-muted-foreground">{rec.description}</p>
                        <Button variant="link" size="sm" className="p-0 h-auto mt-1">
                          Explore <ArrowRight className="h-3 w-3 ml-1" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                <Button className="w-full mt-4" variant="outline" size="sm">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Get personalized recommendations
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4 flex items-center">
                  <Clock className="h-4 w-4 text-primary mr-2" />
                  Past Trips
                </h3>
                <div className="space-y-3">
                  {mockPastTrips.map((trip) => (
                    <div key={trip.id} className="flex items-center">
                      <div 
                        className="h-10 w-10 rounded bg-cover bg-center shrink-0"
                        style={{ backgroundImage: `url(${trip.image})` }}
                      />
                      <div className="ml-3">
                        <p className="font-medium">{trip.name}</p>
                        <p className="text-xs text-muted-foreground flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          {trip.location}
                        </p>
                      </div>
                      <Badge variant="outline" className="ml-auto text-xs">
                        {new Date(trip.endDate).toLocaleDateString('en-US', {
                          month: 'short',
                          year: 'numeric'
                        })}
                      </Badge>
                    </div>
                  ))}
                </div>
                <Button className="w-full mt-4" variant="outline" size="sm">
                  View travel history
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}