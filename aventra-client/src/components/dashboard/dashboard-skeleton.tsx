"use client";

import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardSkeleton() {
  return (
    <div className="space-y-8 animate-in fade-in-50 duration-500">
      {/* Welcome Section Skeleton */}
      <div className="bg-background/80 backdrop-blur-sm border border-border/30 rounded-xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-5 w-40" />
          </div>
          
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-[100px]" />
            <Skeleton className="h-10 w-[120px]" />
          </div>
        </div>
      </div>

      {/* Main Content Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Trip Planning & Current Trip */}
        <div className="lg:col-span-2 space-y-6">
          {/* AI-Powered Planning Card Skeleton */}
          <Card className="w-full overflow-hidden border-border/40 relative shadow-sm">
            <div className="p-6 md:p-8">
              <div className="flex flex-col md:flex-row justify-between gap-6">
                <div className="max-w-xl space-y-4 w-full">
                  <div className="flex items-center gap-2 mb-3">
                    <Skeleton className="h-7 w-7 rounded-full" />
                    <Skeleton className="h-5 w-40" />
                  </div>
                  
                  <Skeleton className="h-8 w-full max-w-[400px]" />
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-5 w-full max-w-[350px]" />
                  
                  <div className="flex flex-wrap gap-4 pt-2">
                    <Skeleton className="h-10 w-[140px]" />
                    <Skeleton className="h-10 w-[160px]" />
                  </div>
                </div>
                
                <div className="hidden lg:block">
                  <Skeleton className="h-[240px] w-[240px] rounded-lg" />
                </div>
              </div>
            </div>
          </Card>
          
          {/* Next Trip Card Skeleton */}
          <Card className="overflow-hidden border-border/40 shadow-sm">
            <div className="p-4 bg-muted/30">
              <div className="flex items-center justify-between">
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-8 w-20" />
              </div>
            </div>
            
            <div>
              <Skeleton className="h-52 md:h-64 w-full" />
              
              <div className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-5 w-40" />
                </div>
                <Skeleton className="h-1.5 w-full rounded-full" />
                
                <div className="flex justify-between pt-2">
                  <Skeleton className="h-9 w-32" />
                  <Skeleton className="h-9 w-24" />
                </div>
              </div>
            </div>
          </Card>
        </div>
        
        {/* Right Column Skeletons */}
        <div className="space-y-6">
          {/* Tabs Skeleton */}
          <Card className="border-border/40 shadow-sm overflow-hidden">
            <div className="flex border-b border-border/40">
              <div className="flex-1 py-3 px-4">
                <Skeleton className="h-5 w-32 mx-auto" />
              </div>
              <div className="flex-1 py-3 px-4">
                <Skeleton className="h-5 w-24 mx-auto" />
              </div>
            </div>
            
            <div className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-7 w-20" />
              </div>
              
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-24 w-full rounded-lg" />
                ))}
                
                <Skeleton className="h-6 w-full mt-2" />
              </div>
            </div>
          </Card>
          
          {/* Travel Stats Skeleton */}
          <Card className="border-border/40 shadow-sm overflow-hidden">
            <div className="p-4 bg-muted/30">
              <Skeleton className="h-6 w-32" />
            </div>
            
            <div className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="p-3 rounded-lg border border-border/20 flex items-center gap-3">
                    <Skeleton className="h-8 w-8 rounded-full flex-shrink-0" />
                    <div className="space-y-2 w-full">
                      <Skeleton className="h-5 w-12" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="pt-3 border-t border-border/20 flex justify-center">
                <Skeleton className="h-5 w-40" />
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}