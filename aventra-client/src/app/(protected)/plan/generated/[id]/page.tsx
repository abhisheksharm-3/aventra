"use client";

import { useParams, notFound } from "next/navigation";
import { useEffect, useState } from "react";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import TripItineraryDisplay from "@/components/itinerary/trip-itinerary-display";
import { useUserStore } from "@/stores/userStore";
import { useItineraryStore } from "@/stores/useItineraryStore";
import { GeneratedItineraryResponse } from "@/types/itinerary";
import Layout from "@/components/layout/Layout";

/**
 * TripPage component that displays a specific itinerary by ID
 * Fetches the itinerary from the store or cloud if not available locally
 */
export default function TripPage() {
  const params = useParams();
  const tripId = params?.id as string;
  const { user, isLoading: userLoading } = useUserStore();
  const { getItinerary, setActiveItinerary } = useItineraryStore();
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [itinerary, setItinerary] = useState<GeneratedItineraryResponse | null>(null);
  
  // Current context information for the trip
  const currentUserLogin = user?.name || user?.email?.split('@')[0] || "Guest";
  
  // Fetch itinerary on component mount - always call hooks at the top level
  useEffect(() => {
    // Check for valid trip ID inside the effect
    if (!tripId) {
      setError("Missing trip ID");
      setIsLoading(false);
      return;
    }
    
    async function loadItinerary() {
      try {
        setIsLoading(true);
        setError(null);
        
        // Fetch the itinerary by ID (this will check store first, then cloud)
        const data = await getItinerary(tripId);
        
        if (!data) {
          setError(`Itinerary with ID ${tripId} not found`);
          return;
        }
        
        // Set this itinerary as active in the store
        setActiveItinerary(tripId);
        
        // Update local state
        setItinerary(data);
      } catch (err) {
        console.error("Failed to load itinerary:", err);
        setError(err instanceof Error ? err.message : "Failed to load itinerary");
      } finally {
        setIsLoading(false);
      }
    }
    
    loadItinerary();
  }, [tripId, getItinerary, setActiveItinerary]);
  
  // Handle case when trip ID is missing - after all hooks have been called
  if (!tripId) {
    return notFound();
  }
  
  // Handle loading states
  if (isLoading || userLoading) {
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
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-6 max-w-md text-center">
          <AlertCircle className="h-12 w-12 mx-auto text-destructive mb-4" />
          <h2 className="text-xl font-semibold text-destructive mb-2">
            Failed to Load Trip
          </h2>
          <p className="text-destructive/80 mb-4">{error}</p>
          <Button 
            variant="outline" 
            onClick={() => window.location.reload()}
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }
  
  // Handle case when trip is not found
  if (!itinerary) {
    return notFound();
  }

  return (
    <Layout>
      <TripItineraryDisplay
        tripData={itinerary}
        currentDateTime={new Date().toISOString()}
        currentUser={currentUserLogin}
      />
    </Layout>
  );
}