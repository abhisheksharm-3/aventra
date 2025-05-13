"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import TripItineraryDisplay from "@/components/itinerary/trip-itinerary-display";
import { useUserStore } from "@/stores/userStore";
import { useItineraryStore } from "@/stores/useItineraryStore";

export default function GeneratedItineraryPage() {
  const router = useRouter();
  const { user, isLoading: userLoading } = useUserStore();
  const { itineraryData } = useItineraryStore();
  
  // Format current date time and user info
  const currentDateTime = new Date().toISOString().replace('T', ' ').substring(0, 19);
  const currentUserLogin = user?.name || user?.email?.split('@')[0] || "Guest";
  
  // Redirect to planning page if no itinerary data is available
  useEffect(() => {
    if (!itineraryData && !userLoading) {
      router.push("/plan");
    }
  }, [itineraryData, userLoading, router]);
  
  // Handle loading states
  if (userLoading || !itineraryData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="h-16 w-16 rounded-full border-4 border-muted"></div>
            <div className="absolute top-0 left-0 h-16 w-16 rounded-full border-4 border-t-primary animate-spin"></div>
          </div>
          <p className="text-muted-foreground">Loading itinerary...</p>
        </div>
      </div>
    );
  }
  
  // Handle error states
  if (itineraryData.error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-6 max-w-md text-center">
          <AlertCircle className="h-12 w-12 mx-auto text-destructive mb-4" />
          <h2 className="text-xl font-semibold text-destructive mb-2">
            Failed to Load Trip
          </h2>
          <p className="text-destructive/80 mb-4">{itineraryData.error}</p>
          <Button variant="outline" onClick={() => router.push("/plan")}>
            Return to Planning
          </Button>
        </div>
      </div>
    );
  }

  return (
    <TripItineraryDisplay
      tripData={itineraryData}
      currentDateTime={currentDateTime}
      currentUser={currentUserLogin}
    />
  );
}
