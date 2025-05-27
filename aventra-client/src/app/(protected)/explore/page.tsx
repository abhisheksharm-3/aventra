"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useInDepthDestinations } from "@/hooks/useInDepthDestinationRecommendations";
import { 
  ArrowRight, 
  Calendar, 
  Compass, 
  DollarSign, 
  MapPin,
  Search,
  Utensils
} from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Layout from "@/components/layout/Layout";
import { Skeleton } from "@/components/ui/skeleton";

const CATEGORIES = [
  { value: "all", label: "All Destinations" }, // Changed from "" to "all"
  { value: "beach", label: "Beaches" },
  { value: "city", label: "Cities" },
  { value: "nature", label: "Nature" },
  { value: "cultural", label: "Cultural" },
  { value: "adventure", label: "Adventure" }
];

export default function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("all"); // Changed initial state from "" to "all"
  const [selectedDestination, setSelectedDestination] = useState<string | null>(null);
  
  // Only pass category to hook if it's not "all"
  const apiCategory = category === "all" ? undefined : category;
  const { destinations, loading, error } = useInDepthDestinations(apiCategory);
  
  // Filter destinations based on search query
  const filteredDestinations = destinations.filter(dest => {
    if (!dest.name) return false; // Handle potentially undefined name
    
    return dest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (dest.tagline && dest.tagline.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (dest.category && dest.category.toLowerCase().includes(searchQuery.toLowerCase()));
  });

  return (
    <Layout>
      <div className="max-w-6xl mx-auto py-8 px-4">
        {/* Header */}
        <div className="flex flex-col gap-2 mb-6">
          <h1 className="text-2xl font-medium tracking-tight">Explore Destinations</h1>
          <p className="text-muted-foreground text-sm">
            Discover detailed information about destinations around the world
          </p>
        </div>
        
        <Separator className="my-4" />
        
        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-3 justify-between my-4">
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder="Search destinations..."
              className="pl-8 w-full h-9 text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2">
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-[180px] h-9 text-sm">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* Destinations Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="h-48 w-full" />
                <CardContent className="p-4">
                  <Skeleton className="h-6 w-2/3 mb-2" />
                  <Skeleton className="h-4 w-full mb-4" />
                  <div className="flex justify-between">
                    <Skeleton className="h-5 w-1/4" />
                    <Skeleton className="h-5 w-1/4" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-muted-foreground mb-4">Failed to load destinations</p>
            <Button 
              onClick={() => window.location.reload()} 
              variant="outline"
              size="sm"
            >
              Retry
            </Button>
          </div>
        ) : filteredDestinations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
            {filteredDestinations.map((destination) => (
              <Card key={destination.id} className="overflow-hidden py-0">
                <div className="relative h-48 w-full overflow-hidden">
                  <Image
                    src={destination.image || "https://images.unsplash.com/photo-1517760444937-f6397edcbbcd"}
                    alt={destination.name}
                    fill
                    className="object-cover transition-transform hover:scale-105 duration-500"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute top-2 right-2">
                    <Badge className="bg-white/80 text-black hover:bg-white/70">
                      {destination.category || "Destination"}
                    </Badge>
                  </div>
                </div>
                
                <CardContent className="p-4 pb-2">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium text-base">{destination.name}</h3>
                    <Badge variant="outline" className="text-xs">
                      {destination.match}% Match
                    </Badge>
                  </div>
                  <p className="text-muted-foreground text-sm mb-3">
                    {destination.tagline}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>Best time: {destination.bestTimeToVisit?.split(" ")[0] || "Year-round"}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-3 w-3" />
                      <span>{destination.budget?.midRange?.split(" ")[0] || "$100"}/night</span>
                    </div>
                  </div>
                </CardContent>
                
                <CardFooter className="px-4 py-3 flex justify-between border-t">
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="text-sm h-8 px-2 hover:bg-transparent hover:underline"
                        onClick={() => setSelectedDestination(destination.id)}
                      >
                        View Details
                        <ArrowRight className="h-3.5 w-3.5 ml-1" />
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="right" className="overflow-y-auto sm:max-w-lg">
                      {selectedDestination === destination.id && (
                        <>
                          <SheetHeader className="mb-4">
                            <SheetTitle>{destination.name}</SheetTitle>
                            <SheetDescription>{destination.tagline}</SheetDescription>
                          </SheetHeader>
                          
                          <div className="relative h-52 w-full mb-4 rounded-md overflow-hidden">
                            <Image
                              src={destination.image || "https://images.unsplash.com/photo-1517760444937-f6397edcbbcd"}
                              alt={destination.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          
                          <div className="space-y-4">
                            <div>
                              <h4 className="text-sm font-medium mb-1">About</h4>
                              <p className="text-sm">{destination.description}</p>
                            </div>
                            
                            <Separator />
                            
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <h4 className="text-sm font-medium mb-1 flex items-center">
                                  <Calendar className="h-3.5 w-3.5 mr-1.5" />
                                  Best Time to Visit
                                </h4>
                                <p className="text-sm">{destination.bestTimeToVisit}</p>
                              </div>
                              
                              <div>
                                <h4 className="text-sm font-medium mb-1 flex items-center">
                                  <MapPin className="h-3.5 w-3.5 mr-1.5" />
                                  Category
                                </h4>
                                <p className="text-sm">{destination.category}</p>
                              </div>
                            </div>
                            
                            <Separator />
                            
                            <div>
                              <h4 className="text-sm font-medium mb-2 flex items-center">
                                <Compass className="h-3.5 w-3.5 mr-1.5" />
                                Highlights
                              </h4>
                              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                {destination.highlights?.map((item, i) => (
                                  <li key={i} className="text-sm flex items-start gap-1">
                                    <span className="text-primary">•</span>
                                    {item}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            
                            <Separator />
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <h4 className="text-sm font-medium mb-2">Travel Tips</h4>
                                <ul className="space-y-1">
                                  {destination.travelTips?.map((tip, i) => (
                                    <li key={i} className="text-sm flex items-start gap-1">
                                      <span className="text-primary">•</span>
                                      {tip}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                              
                              <div>
                                <h4 className="text-sm font-medium mb-2 flex items-center">
                                  <Utensils className="h-3.5 w-3.5 mr-1.5" />
                                  Local Cuisine
                                </h4>
                                <ul className="space-y-1">
                                  {destination.localCuisine?.map((dish, i) => (
                                    <li key={i} className="text-sm flex items-start gap-1">
                                      <span className="text-primary">•</span>
                                      {dish}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                            
                            <Separator />
                            
                            <div>
                              <h4 className="text-sm font-medium mb-2 flex items-center">
                                <DollarSign className="h-3.5 w-3.5 mr-1.5" />
                                Budget Information ({destination.budget?.currency || "USD"})
                              </h4>
                              <div className="grid grid-cols-2 gap-2">
                                <div className="border rounded p-2">
                                  <span className="text-xs text-muted-foreground block">Budget</span>
                                  <span className="text-sm">{destination.budget?.hostel || "$20-40"}</span>
                                </div>
                                <div className="border rounded p-2">
                                  <span className="text-xs text-muted-foreground block">Mid-Range</span>
                                  <span className="text-sm">{destination.budget?.midRange || "$80-150"}</span>
                                </div>
                                <div className="border rounded p-2">
                                  <span className="text-xs text-muted-foreground block">Luxury</span>
                                  <span className="text-sm">{destination.budget?.luxury || "$200+"}</span>
                                </div>
                                <div className="border rounded p-2">
                                  <span className="text-xs text-muted-foreground block">Meals</span>
                                  <span className="text-sm">{destination.budget?.averageMeal || "$10-20"}</span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="pt-4">
                              <h4 className="text-sm font-medium mb-2">Cultural Notes</h4>
                              <p className="text-sm">{destination.culturalNotes}</p>
                            </div>
                            
                            <Separator />
                            
                            <div className="flex justify-center pt-2">
                              <Link href={`/plan?destination=${encodeURIComponent(destination.name)}`}>
                                <Button size="sm">
                                  Plan a Trip to {destination.name.split(',')[0]}
                                </Button>
                              </Link>
                            </div>
                          </div>
                        </>
                      )}
                    </SheetContent>
                  </Sheet>
                  
                  <Link href={`/plan?destination=${encodeURIComponent(destination.name)}`}>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-8"
                    >
                      Plan Trip
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <p className="text-muted-foreground mb-4">No destinations found matching your criteria</p>
            <Button 
              onClick={() => {
                setSearchQuery("");
                setCategory("all"); // Changed from "" to "all"
              }} 
              variant="outline"
              size="sm"
            >
              Reset Filters
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
}