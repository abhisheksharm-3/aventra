"use client";

import React, { useState } from "react";
import { Calendar, Map, FileText, PieChart, Building, UtensilsCrossed } from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { GeneratedItineraryResponse } from "@/types/itinerary";
import ItineraryBanner from "./itinerary-banner";
import { getCoverImage } from "@/lib/utils/itinerary-utils";
import DailyItineraryContent from "./daily-itinerary-content";
import JourneyMapContent from "./journey-map-content";
import EssentialInfoContent from "./essential-info";
import TripSummary from "./trip-summary";
import AccommodationList from "./accomodation-list";
import RestaurantList from "./restaurant-list";

interface TripItineraryProps {
  tripData: GeneratedItineraryResponse;
  currentDateTime?: string;
  currentUser?: string;
}

export default function TripItineraryDisplay({ 
  tripData, 
  currentDateTime = "2025-05-27 16:08:54", 
  currentUser = "abhisheksharm-3" 
}: TripItineraryProps) {
  const [activeDay, setActiveDay] = useState(1);


  return (
    <div className="min-h-screen bg-background">
      <ItineraryBanner 
        tripName={tripData.name}
        coverImage={getCoverImage(tripData)}
        durationDays={tripData.metadata.duration_days} 
        startDate={tripData.itinerary[0].date}
        endDate={tripData.itinerary[tripData.itinerary.length - 1].date}
      />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Itinerary */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="itinerary" className="w-full">
              <TabsList className="w-full mb-6 h-11 bg-muted/50">
                <TabsTrigger value="itinerary" className="flex gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Itinerary</span>
                </TabsTrigger>
                <TabsTrigger value="map" className="flex gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <Map className="h-4 w-4" />
                  <span>Journey Map</span>
                </TabsTrigger>
                <TabsTrigger value="info" className="flex gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <FileText className="h-4 w-4" />
                  <span>Essential Info</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent 
                value="itinerary" 
                className="focus-visible:outline-none focus-visible:ring-0 animate-in fade-in-50 data-[state=inactive]:animate-out data-[state=inactive]:fade-out-0"
              >
                <Card className="border-none shadow-none bg-transparent">
                  <DailyItineraryContent 
                    itinerary={tripData.itinerary}
                    activeDay={activeDay}
                    setActiveDay={setActiveDay}
                  />
                </Card>
              </TabsContent>
              
              <TabsContent 
                value="map" 
                className="focus-visible:outline-none focus-visible:ring-0 animate-in fade-in-50 data-[state=inactive]:animate-out data-[state=inactive]:fade-out-0"
              >
                <Card className="border-none shadow-none bg-transparent">
                  <JourneyMapContent journeyPath={tripData.journey_path} />
                </Card>
              </TabsContent>
              
              <TabsContent 
                value="info" 
                className="focus-visible:outline-none focus-visible:ring-0 animate-in fade-in-50 data-[state=inactive]:animate-out data-[state=inactive]:fade-out-0"
              >
                <Card className="border-none shadow-none bg-transparent">
                  <EssentialInfoContent essentialInfo={tripData.essential_info} />
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Column: Trip Summary & Recommendations */}
          <div>
            <Tabs defaultValue="summary" className="w-full">
              <TabsList className="w-full mb-6 h-11 bg-muted/50">
                <TabsTrigger value="summary" className="flex gap-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <PieChart className="h-4 w-4" />
                  <span>Summary</span>
                </TabsTrigger>
                <TabsTrigger value="accommodation" className="flex gap-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <Building className="h-4 w-4" />
                  <span>Stays</span>
                </TabsTrigger>
                <TabsTrigger value="dining" className="flex gap-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <UtensilsCrossed className="h-4 w-4" />
                  <span>Dining</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent 
                value="summary" 
                className="focus-visible:outline-none focus-visible:ring-0 mt-0 animate-in fade-in-50 data-[state=inactive]:animate-out data-[state=inactive]:fade-out-0"
              >
                <TripSummary 
                  metadata={tripData.metadata} 
                  currentUser={currentUser}
                  currentDateTime={currentDateTime}

                />
              </TabsContent>

              <TabsContent 
                value="accommodation" 
                className="focus-visible:outline-none focus-visible:ring-0 mt-0 animate-in fade-in-50 data-[state=inactive]:animate-out data-[state=inactive]:fade-out-0"
              >
                <AccommodationList accommodations={tripData.recommendations.accommodations} />
              </TabsContent>

              <TabsContent 
                value="dining" 
                className="focus-visible:outline-none focus-visible:ring-0 mt-0 animate-in fade-in-50 data-[state=inactive]:animate-out data-[state=inactive]:fade-out-0"
              >
                <RestaurantList restaurants={tripData.recommendations.dining} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}