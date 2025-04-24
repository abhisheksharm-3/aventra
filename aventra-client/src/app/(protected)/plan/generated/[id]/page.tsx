"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Layout from "@/components/layout/Layout";
import {
  Share2,
  Download,
  Calendar,
  Cloud,
  MapPin,
  Plane,
  Hotel,
  Utensils,
  Mountain,
  Sun,
  ShoppingBag,
  Wallet,
  CheckCircle2,
  Car,
  AlertTriangle,
  Edit
} from "lucide-react";

export default function TripPlanPage() {
  const [scrolled, setScrolled] = useState(false);
  const [tripDate] = useState("2025-05-12");

  // Format the trip date range
  const startDate = new Date(tripDate);
  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + 6);
  
  const formattedDateRange = `${startDate.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric'
  })} - ${endDate.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  })}`;

  // Handle scroll effects
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const sections = [
    { value: "overview", label: "Overview" },
    { value: "travel", label: "Travel" },
    { value: "stay", label: "Stay" },
    { value: "itinerary", label: "Itinerary" },
  ];

  return (
    <Layout>
      <div className="flex flex-1 h-[calc(100vh-64px)] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-background/80 pointer-events-none" />

        <div className="flex-1 overflow-auto relative">
          <div
            className={cn(
              "sticky top-0 z-10 backdrop-blur-md transition-all duration-300",
              scrolled ? "bg-background/80 shadow-sm" : "bg-transparent"
            )}
          >
            <div className="container mx-auto px-4 py-6 max-w-7xl">
              {/* Header Section */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="flex items-center">
                    <h1 className="text-3xl font-bold tracking-tight">
                      Leh Ladakh Adventure
                    </h1>
                    <Badge 
                      variant="outline" 
                      className="ml-3 bg-green-500/10 border-green-500/20 text-green-600 px-2 py-0.5 hidden sm:flex items-center gap-1"
                    >
                      <CheckCircle2 className="h-3 w-3" />
                      <span className="text-xs font-medium">Confirmed</span>
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      {formattedDateRange} · 7 days
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="flex gap-2 mt-4 sm:mt-0"
                >
                  <Button variant="outline" size="sm">
                    <Share2 className="mr-2 h-4 w-4" />
                    Share
                  </Button>
                  <Button size="sm">
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                </motion.div>
              </div>
            </div>
          </div>

          <div className="container mx-auto px-4 py-6 max-w-7xl">
            {/* Trip Hero Image */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mb-8"
            >
              <div className="relative rounded-xl overflow-hidden h-[300px]">
                <img 
                  src="https://images.unsplash.com/photo-1635255506105-b74adbd94026" 
                  alt="Panoramic view of Leh Ladakh" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-6">
                  <div className="text-white max-w-2xl">
                    <h2 className="text-2xl font-bold mb-2">The Ultimate Leh Ladakh Experience</h2>
                    <p className="text-white/90 text-sm">Breathtaking landscapes, ancient monasteries, and unique Ladakhi culture.</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Trip Stats Overview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8"
            >
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Duration</p>
                      <h3 className="text-xl font-bold">7 Days</h3>
                    </div>
                    <div className="bg-blue-500/10 p-2 rounded-full">
                      <Calendar className="h-5 w-5 text-blue-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Budget</p>
                      <h3 className="text-xl font-bold">₹68,500</h3>
                    </div>
                    <div className="bg-green-500/10 p-2 rounded-full">
                      <Wallet className="h-5 w-5 text-green-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Distance</p>
                      <h3 className="text-xl font-bold">1,235 km</h3>
                    </div>
                    <div className="bg-amber-500/10 p-2 rounded-full">
                      <MapPin className="h-5 w-5 text-amber-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Altitude</p>
                      <h3 className="text-xl font-bold">3,500 m</h3>
                    </div>
                    <div className="bg-purple-500/10 p-2 rounded-full">
                      <Mountain className="h-5 w-5 text-purple-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Trip Plan Tabs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-8"
            >
              <Tabs defaultValue="overview">
                <div className="border-b mb-6">
                  <TabsList className="bg-muted/40 p-0.5 rounded-xl w-full justify-start overflow-x-auto flex-nowrap hide-scrollbar">
                    {sections.map((section) => (
                      <TabsTrigger
                        key={section.value}
                        value={section.value}
                        className="data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg px-4 py-2 relative"
                      >
                        <span>{section.label}</span>
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </div>

                {/* Overview Tab */}
                <TabsContent value="overview" className="focus-visible:outline-none focus-visible:ring-0">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                      <Card>
                        <CardHeader>
                          <CardTitle>Trip Summary</CardTitle>
                          <CardDescription>Your 7-day adventure in Leh Ladakh</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground mb-4">
                            Welcome to your personalized Leh Ladakh experience! This journey takes you through stunning 
                            landscapes, ancient monasteries, and unique Himalayan culture with carefully planned activities
                            that balance adventure with relaxation.
                          </p>
                          
                          <div className="border rounded-lg p-4 mb-4">
                            <h4 className="font-medium mb-2 flex items-center">
                              <AlertTriangle className="h-4 w-4 text-amber-500 mr-2" /> Altitude Warning
                            </h4>
                            <p className="text-xs text-muted-foreground">
                              Leh is at high altitude (3,500m). First 24-48 hours are for acclimatization.
                              Drink plenty of water and avoid strenuous activities initially.
                            </p>
                          </div>
                          
                          <h4 className="font-medium mb-3">Highlights</h4>
                          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {[
                              "Ancient Leh Palace and Shanti Stupa",
                              "Stunning blue waters of Pangong Lake",
                              "Unique culture of Ladakhi villages",
                              "Dramatic Himalayan landscapes",
                              "Authentic Ladakhi cuisine"
                            ].map((highlight, i) => (
                              <li key={i} className="flex items-start">
                                <CheckCircle2 className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                                <span className="text-sm">{highlight}</span>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    </div>

                    <div>
                      <Card>
                        <CardHeader>
                          <CardTitle>Weather Forecast</CardTitle>
                          <CardDescription>7-day forecast for Leh</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            {[
                              { day: "May 12", temp: "18°C / 5°C", condition: "Sunny", icon: Sun },
                              { day: "May 13", temp: "17°C / 4°C", condition: "Partly Cloudy", icon: Cloud },
                              { day: "May 14", temp: "15°C / 3°C", condition: "Cloudy", icon: Cloud }
                            ].map((day, i) => {
                              const DayIcon = day.icon;
                              return (
                                <div key={i} className="flex items-center justify-between">
                                  <div className="flex items-center">
                                    <div className="w-8 h-8 rounded-full flex items-center justify-center mr-3 bg-blue-100 text-blue-600">
                                      <DayIcon className="h-4 w-4" />
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium">{day.day}</p>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <p className="text-sm font-medium">{day.temp}</p>
                                    <p className="text-xs text-muted-foreground">{day.condition}</p>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                          
                          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                            <h4 className="text-sm font-medium mb-2">Weather Advisory</h4>
                            <p className="text-xs text-muted-foreground">
                              UV index is very high - use SPF 50+ sunscreen. Temperature drops significantly at night - bring warm clothes.
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </TabsContent>

                {/* Travel Tab */}
                <TabsContent value="travel" className="focus-visible:outline-none focus-visible:ring-0">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Plane className="h-5 w-5 mr-2" />
                        Flight Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        {/* Outbound Flight */}
                        <div className="border rounded-lg p-4">
                          <div className="flex flex-col sm:flex-row justify-between mb-4">
                            <div className="mb-2 sm:mb-0">
                              <Badge>Outbound</Badge>
                              <h4 className="font-medium text-lg mt-1">Delhi → Leh</h4>
                              <p className="text-sm text-muted-foreground">May 12, 2025</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium">Air India AI-445</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="text-center">
                              <p className="text-xl font-bold">08:15</p>
                              <p className="text-xs text-muted-foreground">Delhi (DEL)</p>
                            </div>
                            
                            <div className="flex-1 mx-4">
                              <div className="relative flex items-center">
                                <div className="h-0.5 flex-1 bg-muted"></div>
                                <div className="mx-2 text-xs text-muted-foreground whitespace-nowrap">1h 25m</div>
                                <div className="h-0.5 flex-1 bg-muted"></div>
                              </div>
                            </div>
                            
                            <div className="text-center">
                              <p className="text-xl font-bold">09:40</p>
                              <p className="text-xs text-muted-foreground">Leh (IXL)</p>
                            </div>
                          </div>
                        </div>
                        
                        {/* Return Flight */}
                        <div className="border rounded-lg p-4">
                          <div className="flex flex-col sm:flex-row justify-between mb-4">
                            <div className="mb-2 sm:mb-0">
                              <Badge>Return</Badge>
                              <h4 className="font-medium text-lg mt-1">Leh → Delhi</h4>
                              <p className="text-sm text-muted-foreground">May 18, 2025</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium">IndiGo 6E-2021</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="text-center">
                              <p className="text-xl font-bold">14:20</p>
                              <p className="text-xs text-muted-foreground">Leh (IXL)</p>
                            </div>
                            
                            <div className="flex-1 mx-4">
                              <div className="relative flex items-center">
                                <div className="h-0.5 flex-1 bg-muted"></div>
                                <div className="mx-2 text-xs text-muted-foreground whitespace-nowrap">1h 40m</div>
                                <div className="h-0.5 flex-1 bg-muted"></div>
                              </div>
                            </div>
                            
                            <div className="text-center">
                              <p className="text-xl font-bold">16:00</p>
                              <p className="text-xs text-muted-foreground">Delhi (DEL)</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="border-t pt-4">
                      <div className="flex items-center text-sm">
                        <Car className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="text-muted-foreground">Airport transfers included in both cities</span>
                      </div>
                    </CardFooter>
                  </Card>
                </TabsContent>

                {/* Stay Tab */}
                <TabsContent value="stay" className="focus-visible:outline-none focus-visible:ring-0">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Hotel className="h-5 w-5 mr-2" />
                        Hotel Ladakh Palace
                      </CardTitle>
                      <CardDescription>Your accommodation in Leh</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                        <div className="lg:col-span-3">
                          <div className="rounded-lg overflow-hidden h-60">
                            <img 
                              src="https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070" 
                              alt="Hotel Ladakh Palace" 
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>
                        <div className="lg:col-span-2 space-y-4">
                          <div>
                            <h4 className="font-medium">Reservation Details</h4>
                            <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                              <div>
                                <p className="text-muted-foreground">Check-in</p>
                                <p className="font-medium">May 12, 2025</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">Check-out</p>
                                <p className="font-medium">May 18, 2025</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">Room Type</p>
                                <p className="font-medium">Deluxe Mountain View</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">Meals</p>
                                <p className="font-medium">Breakfast Included</p>
                              </div>
                            </div>
                          </div>

                          <div>
                            <h4 className="font-medium">Amenities</h4>
                            <div className="grid grid-cols-2 gap-1 mt-2 text-xs">
                              {[
                                "Free WiFi", "Room Heater", "Hot Water 24/7", "Restaurant",
                                "Airport Shuttle", "Mountain Views"
                              ].map((amenity, i) => (
                                <div key={i} className="flex items-center">
                                  <CheckCircle2 className="h-3 w-3 text-green-500 mr-1.5" />
                                  <span>{amenity}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Itinerary Tab */}
                <TabsContent value="itinerary" className="focus-visible:outline-none focus-visible:ring-0">
                  <div className="space-y-6">
                    {[
                      {
                        day: "Day 1",
                        date: "May 12",
                        title: "Arrival & Acclimatization",
                        activities: [
                          { time: "08:30", activity: "Flight from Delhi to Leh", icon: Plane },
                          { time: "10:30", activity: "Check-in at Hotel Ladakh Palace", icon: Hotel },
                          { time: "13:00", activity: "Light lunch at hotel restaurant", icon: Utensils },
                          { time: "18:00", activity: "Evening stroll in Leh Market", icon: ShoppingBag }
                        ],
                        note: "Take it easy today to adjust to the high altitude"
                      },
                      {
                        day: "Day 2",
                        date: "May 13",
                        title: "Leh Palace & Shanti Stupa",
                        activities: [
                          { time: "08:30", activity: "Breakfast at hotel", icon: Utensils },
                          { time: "10:00", activity: "Visit Leh Palace", icon: Mountain },
                          { time: "15:00", activity: "Visit Shanti Stupa", icon: Mountain }
                        ]
                      },
                      {
                        day: "Day 3",
                        date: "May 14",
                        title: "Pangong Lake Excursion",
                        activities: [
                          { time: "05:00", activity: "Early departure for Pangong Lake", icon: Car },
                          { time: "12:30", activity: "Arrive at Pangong Lake", icon: Mountain },
                          { time: "16:00", activity: "Begin return journey", icon: Car }
                        ],
                        note: "Long driving day on mountain roads"
                      }
                    ].map((day, index) => (
                      <Card key={index}>
                        <CardHeader className="pb-2">
                          <CardTitle className="flex items-start justify-between">
                            <div className="flex items-center">
                              <div className="bg-primary/10 w-10 h-10 rounded-full flex items-center justify-center mr-3 text-primary">
                                <span className="font-bold">{day.day.split(" ")[1]}</span>
                              </div>
                              <div>
                                <h3>{day.title}</h3>
                                <p className="text-sm text-muted-foreground">{day.date}</p>
                              </div>
                            </div>
                            {day.note && (
                              <Badge variant="outline" className="bg-amber-500/10 text-amber-600">
                                {day.note}
                              </Badge>
                            )}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            {day.activities.map((activity, idx) => {
                              const ActivityIcon = activity.icon;
                              return (
                                <div key={idx} className="flex items-center">
                                  <div className="mr-4 w-12 text-right text-sm text-muted-foreground">
                                    {activity.time}
                                  </div>
                                  <div className="w-6 flex justify-center">
                                    <div className={cn(
                                      "h-4 w-4 rounded-full",
                                      activity.activity.includes("Flight") ? "bg-blue-500" :
                                      activity.activity.includes("Check-in") ? "bg-green-500" :
                                      activity.activity.includes("Lunch") || activity.activity.includes("Breakfast") ? "bg-amber-500" :
                                      "bg-slate-500"
                                    )}>
                                      <ActivityIcon className="h-2 w-2 text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                                    </div>
                                  </div>
                                  <div className="ml-4">
                                    <div className="text-sm">{activity.activity}</div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    <div className="flex justify-center">
                      <Button variant="outline">View Full 7-Day Itinerary</Button>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </motion.div>

            {/* Quick Essentials */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-8"
            >
              <Card>
                <CardHeader>
                  <CardTitle>Trip Essentials</CardTitle>
                  <CardDescription>Key things to know and pack</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <h3 className="font-medium text-lg mb-3">Documents</h3>
                      <div className="space-y-1 text-sm">
                        <div className="flex items-center">
                          <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                          <span>ID proof (Aadhar/Passport)</span>
                        </div>
                        <div className="flex items-center">
                          <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                          <span>Inner Line Permit (arranged)</span>
                        </div>
                        <div className="flex items-center">
                          <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                          <span>Travel insurance details</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-medium text-lg mb-3">Must-Pack Items</h3>
                      <div className="space-y-1 text-sm">
                        <div className="flex items-center">
                          <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                          <span>Sunscreen (SPF 50+)</span>
                        </div>
                        <div className="flex items-center">
                          <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                          <span>Warm jacket for evenings</span>
                        </div>
                        <div className="flex items-center">
                          <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                          <span>Altitude sickness medication</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-medium text-lg mb-3">Emergency Contacts</h3>
                      <div className="space-y-1 text-sm">
                        <p>Local Guide: +91-9876543210</p>
                        <p>Hotel: +91-1982-252177</p>
                        <p>Local Police: +91-1982-252234</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t pt-4 flex justify-center">
                  <Button>
                    <Download className="mr-2 h-4 w-4" />
                    Download Trip Plan
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </Layout>
  );
}