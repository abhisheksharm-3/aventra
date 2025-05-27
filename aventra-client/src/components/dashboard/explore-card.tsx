import { Card } from "../ui/card";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ArrowRight, ChevronRight, Compass, Sparkles, TrendingUp, Loader2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "../ui/badge";
import { useRecommendedDestinations } from "@/hooks/useRecommenedDestinations";
import { Skeleton } from "../ui/skeleton";
import { Destination } from "@/types/dashboard";

/**
 * Explore Card Component
 * 
 * Interactive card with tabbed interface that toggles between AI-recommended 
 * destinations and trending locations. Dynamically fetches data based on user preferences.
 * 
 * @param {Object} props - Component props
 * @param {'recommendations' | 'trending'} props.activeTab - Currently active tab identifier
 * @param {Function} props.setActiveTab - Function to change the active tab
 * @param {string} [props.userPreferences] - Optional string describing user preferences for recommendations
 * @returns React component with tabbed interface
 */
export function ExploreCard({ 
  activeTab, 
  setActiveTab,
  userPreferences
}: { 
  activeTab: 'recommendations' | 'trending'; 
  setActiveTab: (tab: 'recommendations' | 'trending') => void;
  userPreferences?: string;
}) {
  // Use our dynamic hook to fetch destinations
  const { recommendations, trending, loading, error } = useRecommendedDestinations(userPreferences);
  
  // Get current destinations based on active tab
  const destinations = activeTab === 'recommendations' 
    ? recommendations as Destination[]
    : trending as Destination[];

  return (
    <Card className="border-border/40 shadow-sm overflow-hidden py-0">
      {/* Simple tab header */}
      <div className="border-b border-border/40 flex" role="tablist">
        <button 
          onClick={() => setActiveTab('recommendations')}
          className={cn(
            "flex-1 py-3.5 text-sm font-medium relative transition-colors",
            activeTab === 'recommendations' ? "text-primary" : "text-muted-foreground hover:text-foreground"
          )}
          role="tab"
          aria-selected={activeTab === 'recommendations'}
          id="recommendations-tab"
        >
          For You
          {activeTab === 'recommendations' && (
            <motion.div 
              layoutId="tabIndicator"
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
              transition={{ duration: 0.3 }}
              aria-hidden="true"
            />
          )}
        </button>
        
        <button 
          onClick={() => setActiveTab('trending')}
          className={cn(
            "flex-1 py-3.5 text-sm font-medium relative transition-colors",
            activeTab === 'trending' ? "text-primary" : "text-muted-foreground hover:text-foreground"
          )}
          role="tab"
          aria-selected={activeTab === 'trending'}
          id="trending-tab"
        >
          Trending
          {activeTab === 'trending' && (
            <motion.div 
              layoutId="tabIndicator"
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
              transition={{ duration: 0.3 }}
              aria-hidden="true"
            />
          )}
        </button>
      </div>
      
      {/* Tab content with destinations */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          {activeTab === 'recommendations' ? (
            <div className="flex items-center gap-1.5">
              <Compass className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
              <span className="text-sm font-medium">Personalized for you</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <TrendingUp className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
              <span className="text-sm font-medium">Popular right now</span>
            </div>
          )}
          
          <Link href="/explore">
            <div className="text-xs text-primary hover:underline">See all</div>
          </Link>
        </div>
        
        {/* Loading state - now handled by skeleton UI in the grid */}
        {loading && destinations.length === 0 && (
          <div className="py-8 flex flex-col items-center justify-center text-center">
            <Loader2 className="h-6 w-6 text-primary animate-spin mb-2" aria-hidden="true" />
            <p className="text-sm text-muted-foreground">Discovering destinations for you...</p>
          </div>
        )}
        
        {/* Error state */}
        {error && !loading && destinations.length === 0 && (
          <div className="py-6 flex flex-col items-center justify-center text-center">
            <Sparkles className="h-6 w-6 text-muted-foreground mb-2" aria-hidden="true" />
            <p className="text-sm font-medium mb-1">Couldn&apos;t fetch destinations</p>
            <p className="text-xs text-muted-foreground">Please try again later</p>
          </div>
        )}
        
        {/* Destinations grid with skeleton loading support */}
        {destinations.length > 0 && (
          <ul className="grid gap-3">
            {destinations.map((dest, i) => (
              <li key={dest.id}>
                {dest.isLoading ? (
                  // Skeleton UI for loading state
                  <div className="flex h-24 rounded-lg overflow-hidden border border-border/40">
                    <Skeleton className="relative h-full aspect-square" />
                    <div className="flex-1 p-3 flex flex-col justify-between">
                      <div>
                        <Skeleton className="h-4 w-3/4 mb-2" />
                        <Skeleton className="h-3 w-5/6" />
                      </div>
                      <div className="flex items-center justify-between">
                        <Skeleton className="h-5 w-16" />
                        <Skeleton className="h-3.5 w-3.5 rounded-full" />
                      </div>
                    </div>
                  </div>
                ) : (
                  // Actual destination card
                  <Link 
                    href={`/explore/${dest.id}`}
                    className="group block"
                  >
                    <motion.div 
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.05 * i }}
                      className="flex h-24 rounded-lg overflow-hidden border border-border/40 group-hover:border-primary/30 transition-colors"
                    >
                      {/* Image thumbnail */}
                      <div className="relative h-full aspect-square">
                        <Image
                          src={dest.image || '/assets/placeholder-destination.jpg'} // Fallback image
                          alt={dest.name}
                          fill
                          sizes="(max-width: 768px) 25vw, 33vw"
                          className="object-cover"
                        />
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1 p-3 flex flex-col justify-between">
                        <div>
                          <h3 className="font-medium text-sm leading-tight">{dest.name}</h3>
                          <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{dest.tagline}</p>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          {activeTab === 'recommendations' ? (
                            <Badge variant="outline" className="text-xs bg-primary/5 border-primary/20 text-primary px-1.5 py-0 h-5">
                              {dest.match}% match
                            </Badge>
                          ) : (
                            <div className="text-xs text-muted-foreground flex items-center gap-1">
                              <TrendingUp className="h-3 w-3" aria-hidden="true" />
                              {dest.match}% interest
                            </div>
                          )}
                          
                          <ChevronRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors" aria-hidden="true" />
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                )}
              </li>
            ))}
          </ul>
        )}
        
        {/* Empty state - shown if no destinations and no loading/error */}
        {!loading && !error && destinations.length === 0 && (
          <div className="py-8 flex flex-col items-center justify-center text-center">
            <Compass className="h-6 w-6 text-muted-foreground mb-2" aria-hidden="true" />
            <p className="text-sm font-medium mb-1">No destinations found</p>
            <p className="text-xs text-muted-foreground">Try adjusting your preferences</p>
          </div>
        )}
        
        <Link href="/plan" className="mt-3 block">
          <div className="rounded-md bg-muted/30 p-3 flex items-center justify-between hover:bg-muted/50 transition-colors group">
            <div className="font-medium text-sm">Create personalized travel plan</div>
            <ArrowRight className="h-4 w-4 text-primary group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
          </div>
        </Link>
      </div>
    </Card>
  );
}