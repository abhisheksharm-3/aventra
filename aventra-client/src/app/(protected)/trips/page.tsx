/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { getUserItineraries } from "@/controllers/ItineraryController";
import { useItineraryStore } from "@/stores/useItineraryStore";
import { Loader2, Map, Trash2, Plus, Search, Clock, ChevronRight } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { format, parseISO } from "date-fns";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Layout from "@/components/layout/Layout";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ItineraryPreview {
  tripId: string;
  name: string | null;
  tripType: string;
  createdAt: string;
  durationDays: number;
  totalBudget: number;
  currency: string;
}

export default function TripsPage() {
  const [itineraries, setItineraries] = useState<ItineraryPreview[]>([]);
  const [filteredItineraries, setFilteredItineraries] = useState<ItineraryPreview[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"recent" | "duration" | "budget">("recent");
  const removeItinerary = useItineraryStore((state) => state.removeItinerary);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedItinerary, setSelectedItinerary] = useState<ItineraryPreview | null>(null);

  useEffect(() => {
    const fetchItineraries = async () => {
      try {
        setLoading(true);
        const response = await getUserItineraries();

        if (response.success && response.itineraries) {
          setItineraries(response.itineraries);
          setFilteredItineraries(response.itineraries);
        } else {
          toast.error("Failed to load itineraries");
        }
      } catch (error) {
        console.error("Error fetching itineraries:", error);
        toast.error("An error occurred while loading itineraries");
      } finally {
        setLoading(false);
      }
    };

    fetchItineraries();
  }, []);

  useEffect(() => {
    // Filter itineraries based on search query
    const filtered = itineraries.filter(
      (itinerary) => {
        const nameMatch = itinerary.name 
          ? itinerary.name.toLowerCase().includes(searchQuery.toLowerCase()) 
          : false;
          
        const typeMatch = itinerary.tripType 
          ? itinerary.tripType.toLowerCase().includes(searchQuery.toLowerCase())
          : false;
          
        return nameMatch || typeMatch;
      }
    );

    // Sort itineraries based on selection
    const sorted = [...filtered].sort((a, b) => {
      if (sortBy === "recent") {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else if (sortBy === "duration") {
        return b.durationDays - a.durationDays;
      } else {
        return b.totalBudget - a.totalBudget;
      }
    });

    setFilteredItineraries(sorted);
  }, [searchQuery, sortBy, itineraries]);

  const handleDeleteItinerary = async () => {
    if (!deleteId) return;
    
    try {
      setIsDeleting(true);
      await removeItinerary(deleteId, true);
      setItineraries((prev) => prev.filter((itinerary) => itinerary.tripId !== deleteId));
      setFilteredItineraries((prev) => prev.filter((itinerary) => itinerary.tripId !== deleteId));
      toast.success("Itinerary deleted successfully");
      setDeleteId(null);
      setDeleteDialogOpen(false);
    } catch (error) {
      toast.error("Failed to delete itinerary");
      console.error("Error deleting itinerary:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), "MMM d, yyyy");
    } catch {
      return dateString;
    }
  };

  return (
    <Layout className="">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col gap-4 py-8 px-4 md:px-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-medium tracking-tight">My Trips</h1>
              <p className="text-muted-foreground mt-1 text-sm">
                View and manage your saved itineraries
              </p>
            </div>
            
            <Link href="/plan">
              <Button variant="outline" size="sm" className="gap-1.5">
                <Plus className="h-3.5 w-3.5" />
                New Trip
              </Button>
            </Link>
          </div>

          <Separator className="my-1" />

          {itineraries.length > 0 && !loading && (
            <div className="flex flex-col sm:flex-row gap-3 justify-between my-2">
              <div className="relative w-full sm:max-w-xs">
                <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                <Input
                  placeholder="Search trips..."
                  className="pl-8 w-full h-9 text-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <Select value={sortBy} onValueChange={(value) => setSortBy(value as any)}>
                <SelectTrigger className="w-[180px] h-9 text-sm">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Recent First</SelectItem>
                  <SelectItem value="duration">Longest Duration</SelectItem>
                  <SelectItem value="budget">Highest Budget</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Loading State */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              <p className="mt-4 text-sm text-muted-foreground">Loading your trips...</p>
            </div>
          ) : filteredItineraries.length > 0 ? (
            // Itinerary Cards Grid
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              {filteredItineraries.map((itinerary) => (
                <Card 
                  key={itinerary.tripId} 
                  className="overflow-hidden border-border h-full flex flex-col"
                >
                  <CardHeader className="p-4 pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-base font-medium">
                          {itinerary.name || `${itinerary.tripType} Trip`}
                        </CardTitle>
                        <CardDescription className="text-xs mt-1">
                          Created {formatDate(itinerary.createdAt)}
                        </CardDescription>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {itinerary.tripType}
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="p-4 pt-2 flex-grow">
                    <div className="flex gap-4 my-3">
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">Duration</div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                          <span className="text-sm">{itinerary.durationDays} days</span>
                        </div>
                      </div>
                      
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">Budget</div>
                        <div className="flex items-center gap-1">
                          {itinerary.currency}
                          <span className="text-sm">{itinerary.totalBudget.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  
                  <CardFooter className="p-4 pt-3 flex justify-between items-center border-t">
                    <Link href={`/plan/generated/${itinerary.tripId}`}>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="text-sm h-8 px-2 hover:bg-transparent hover:underline"
                      >
                        View Details
                        <ChevronRight className="h-3.5 w-3.5 ml-1" />
                      </Button>
                    </Link>
                    
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                      onClick={() => {
                        setDeleteId(itinerary.tripId);
                        setSelectedItinerary(itinerary);
                        setDeleteDialogOpen(true);
                      }}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            // Empty State
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="border border-dashed rounded-full p-4 mb-5">
                <Map className="h-6 w-6 text-muted-foreground" aria-hidden="true" />
              </div>
              
              <h3 className="text-base font-medium mb-2">No saved itineraries yet</h3>
              <p className="text-sm text-muted-foreground max-w-md mb-6">
                You haven&apos;t saved any travel itineraries yet. Create your first trip to get started.
              </p>
              
              <Link href="/plan">
                <Button variant="outline" size="sm" className="gap-1.5">
                  <Plus className="h-3.5 w-3.5" />
                  Create Trip
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Itinerary</DialogTitle>
            <DialogDescription>
              {selectedItinerary && (
                <>
                  Are you sure you want to delete this trip? This action cannot be undone.
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex space-x-2 sm:justify-end">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              size="sm"
              onClick={handleDeleteItinerary}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                  Deleting...
                </>
              ) : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}