"use client";

import { useParams, notFound } from "next/navigation";
import TripItineraryDisplay from "@/components/itinerary/trip-itinerary-display";
import { useUserStore } from "@/stores/userStore";
import { useItineraryStore } from "@/stores/useItineraryStore";

export default function TripPage() {
  const params = useParams();
  const tripId = params?.id as string;
  const { user, isLoading: userLoading } = useUserStore();
  const {itineraryData} = useItineraryStore();
  
  const currentDateTime = new Date().toISOString().replace('T', ' ').substring(0, 19);
  const currentUserLogin = user?.name || user?.email?.split('@')[0] || "Guest";
  
  if (!tripId) {
    return notFound();
  }
  
  // Handle loading states
  if (userLoading || itineraryData === null) {
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
  
  // // Handle error states
  // if (error) {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center">
  //       <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-6 max-w-md text-center">
  //         <AlertCircle className="h-12 w-12 mx-auto text-destructive mb-4" />
  //         <h2 className="text-xl font-semibold text-destructive mb-2">
  //           Failed to Load Trip
  //         </h2>
  //         <p className="text-destructive/80 mb-4">{error}</p>
  //         <Button variant="outline" onClick={() => refetch()}>
  //           Try Again
  //         </Button>
  //       </div>
  //     </div>
  //   );
  // }
  
  // Handle case when trip is not found
  if (!itineraryData) {
    return notFound();
  }

  return (
    <TripItineraryDisplay
      tripData={itineraryData}
      currentDateTime={currentDateTime}
      currentUser={currentUserLogin}
    />
  );
}