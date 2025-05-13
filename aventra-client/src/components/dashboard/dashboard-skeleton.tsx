"use client";

import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Types of skeleton sections that can be displayed
 */
type SkeletonSection = "welcome" | "planning" | "trip" | "tabs" | "stats";

/**
 * Dashboard Skeleton component props
 */
interface DashboardSkeletonProps {
  /** Sections to show in the skeleton (default: all) */
  sections?: SkeletonSection[];
  /** Custom class name for the container */
  className?: string;
}

/**
 * Dashboard Skeleton Component
 * 
 * Displays a placeholder loading state for the dashboard UI.
 * Shows animated skeletons for various dashboard sections while data is loading.
 * 
 * @param props - Component properties
 * @returns Skeleton UI for dashboard
 */
export default function DashboardSkeleton({
  sections = ["welcome", "planning", "trip", "tabs", "stats"],
  className = "",
}: DashboardSkeletonProps) {
  return (
    <div className={`space-y-8 animate-in fade-in-50 duration-500 ${className}`} 
         aria-busy="true" 
         aria-label="Dashboard loading">
      {/* Welcome Section Skeleton */}
      {sections.includes("welcome") && <WelcomeSkeleton />}

      {/* Main Content Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Trip Planning & Current Trip */}
        {(sections.includes("planning") || sections.includes("trip")) && (
          <div className="lg:col-span-2 space-y-6">
            {/* AI-Powered Planning Card Skeleton */}
            {sections.includes("planning") && <PlanningCardSkeleton />}
            
            {/* Next Trip Card Skeleton */}
            {sections.includes("trip") && <TripCardSkeleton />}
          </div>
        )}
        
        {/* Right Column Skeletons */}
        {(sections.includes("tabs") || sections.includes("stats")) && (
          <div className="space-y-6">
            {/* Tabs Skeleton */}
            {sections.includes("tabs") && <TabsSkeleton />}
            
            {/* Travel Stats Skeleton */}
            {sections.includes("stats") && <StatsSkeleton />}
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Welcome Section Skeleton Component
 * 
 * Displays placeholder loading UI for the dashboard welcome section
 * with animated skeleton elements for username, status, and action buttons.
 * 
 * @returns React component with welcome section loading state
 */
function WelcomeSkeleton() {
  return (
    <div className="bg-background/80 backdrop-blur-sm border border-border/30 rounded-xl p-6 shadow-sm" aria-label="Welcome section loading">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <Skeleton className="h-10 w-64" aria-label="Username loading" />
          <Skeleton className="h-5 w-40" aria-label="User status loading" />
        </div>
        
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-[100px]" aria-label="Action button loading" />
          <Skeleton className="h-10 w-[120px]" aria-label="Action button loading" />
        </div>
      </div>
    </div>
  );
}

/**
 * Trip Planning Card Skeleton Component
 * 
 * Displays placeholder loading UI for the AI planning card section
 * with animated skeleton elements for title, descriptions, and buttons.
 * 
 * @returns React component with trip planning section loading state
 */
function PlanningCardSkeleton() {
  return (
    <Card className="w-full overflow-hidden border-border/40 relative shadow-sm" aria-label="Trip planning section loading">
      <div className="p-6 md:p-8">
        <div className="flex flex-col md:flex-row justify-between gap-6">
          <div className="max-w-xl space-y-4 w-full">
            <div className="flex items-center gap-2 mb-3">
              <Skeleton className="h-7 w-7 rounded-full" aria-label="Icon loading" />
              <Skeleton className="h-5 w-40" aria-label="Feature title loading" />
            </div>
            
            <Skeleton className="h-8 w-full max-w-[400px]" aria-label="Planning headline loading" />
            <Skeleton className="h-5 w-full" aria-label="Description loading" />
            <Skeleton className="h-5 w-full max-w-[350px]" aria-label="Description loading" />
            
            <div className="flex flex-wrap gap-4 pt-2">
              <Skeleton className="h-10 w-[140px]" aria-label="Button loading" />
              <Skeleton className="h-10 w-[160px]" aria-label="Button loading" />
            </div>
          </div>
          
          <div className="hidden lg:block">
            <Skeleton className="h-[240px] w-[240px] rounded-lg" aria-label="Illustration loading" />
          </div>
        </div>
      </div>
    </Card>
  );
}

/**
 * Trip Card Skeleton Component
 * 
 * Displays placeholder loading UI for the upcoming trip card section
 * with animated skeleton elements for trip image, dates, progress indicators,
 * and action buttons.
 * 
 * @returns React component with trip card loading state
 */
function TripCardSkeleton() {
  return (
    <Card className="overflow-hidden border-border/40 shadow-sm" aria-label="Current trip loading">
      <div className="p-4 bg-muted/30">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-40" aria-label="Trip title loading" />
          <Skeleton className="h-8 w-20" aria-label="Trip action loading" />
        </div>
      </div>
      
      <div>
        <Skeleton className="h-52 md:h-64 w-full" aria-label="Trip image loading" />
        
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-32" aria-label="Trip date loading" />
            <Skeleton className="h-5 w-40" aria-label="Trip status loading" />
          </div>
          <Skeleton className="h-1.5 w-full rounded-full" aria-label="Progress bar loading" />
          
          <div className="flex justify-between pt-2">
            <Skeleton className="h-9 w-32" aria-label="Trip action button loading" />
            <Skeleton className="h-9 w-24" aria-label="Trip action button loading" />
          </div>
        </div>
      </div>
    </Card>
  );
}

/**
 * Tabs Skeleton Component
 * 
 * Displays placeholder loading UI for the tabbed interface section
 * with animated skeleton elements for tab headers and content items.
 * Mimics the structure of the TabsCard component.
 * 
 * @returns React component with tabs section loading state
 */
function TabsSkeleton() {
  return (
    <Card className="border-border/40 shadow-sm overflow-hidden" aria-label="Tab section loading">
      <div className="flex border-b border-border/40">
        <div className="flex-1 py-3 px-4">
          <Skeleton className="h-5 w-32 mx-auto" aria-label="Tab label loading" />
        </div>
        <div className="flex-1 py-3 px-4">
          <Skeleton className="h-5 w-24 mx-auto" aria-label="Tab label loading" />
        </div>
      </div>
      
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-32" aria-label="Section title loading" />
          <Skeleton className="h-7 w-20" aria-label="Action loading" />
        </div>
        
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-lg" aria-label={`Item ${i+1} loading`} />
          ))}
          
          <Skeleton className="h-6 w-full mt-2" aria-label="Action link loading" />
        </div>
      </div>
    </Card>
  );
}

/**
 * Travel Stats Skeleton Component
 * 
 * Displays placeholder loading UI for the travel insights card
 * with animated skeleton elements for stat values, labels, and icons.
 * Mimics the structure of the TravelInsightsCard component.
 * 
 * @returns React component with travel stats loading state
 */
function StatsSkeleton() {
  return (
    <Card className="border-border/40 shadow-sm overflow-hidden" aria-label="Stats section loading">
      <div className="p-4 bg-muted/30">
        <Skeleton className="h-6 w-32" aria-label="Stats title loading" />
      </div>
      
      <div className="p-4 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="p-3 rounded-lg border border-border/20 flex items-center gap-3">
              <Skeleton className="h-8 w-8 rounded-full flex-shrink-0" aria-label="Stat icon loading" />
              <div className="space-y-2 w-full">
                <Skeleton className="h-5 w-12" aria-label="Stat value loading" />
                <Skeleton className="h-3 w-16" aria-label="Stat label loading" />
              </div>
            </div>
          ))}
        </div>
        
        <div className="pt-3 border-t border-border/20 flex justify-center">
          <Skeleton className="h-5 w-40" aria-label="View all stats loading" />
        </div>
      </div>
    </Card>
  );
}