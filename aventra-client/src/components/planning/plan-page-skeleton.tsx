import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function PlanPageSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/10 pb-12">
      <div className="container mx-auto px-4 py-8">
        {/* Header Skeleton */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-background/80 backdrop-blur-sm border border-border/30 rounded-xl p-6 shadow-sm mb-8">
          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-2">
              <Skeleton className="h-6 w-6 rounded-full" />
              <Skeleton className="h-4 w-40" />
            </div>
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-80" />
          </div>
          <Skeleton className="h-9 w-32" />
        </div>
        
        {/* Method Selection Skeleton */}
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[0, 1].map((i) => (
              <Card key={i} className="overflow-hidden border-border/40 shadow-sm">
                <Skeleton className="h-48 w-full" />
                <div className="p-6">
                  <Skeleton className="h-6 w-48 mb-2" />
                  <Skeleton className="h-4 w-full mb-1" />
                  <Skeleton className="h-4 w-3/4 mb-4" />
                  
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-7 w-7 rounded-full flex-shrink-0" />
                      <Skeleton className="h-4 w-2/3" />
                    </div>
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-7 w-7 rounded-full flex-shrink-0" />
                      <Skeleton className="h-4 w-3/4" />
                    </div>
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-7 w-7 rounded-full flex-shrink-0" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                  </div>
                  
                  <Skeleton className="h-10 w-full rounded-lg" />
                </div>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-6">
            <Skeleton className="h-4 w-96 mx-auto" />
          </div>
        </div>
      </div>
    </div>
  );
}