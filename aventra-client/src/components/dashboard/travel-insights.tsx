import { BarChart3, ArrowRight, Compass, Globe } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { InsightStat } from "@/types/dashboard";
import Link from "next/link";
import Image from "next/image";

/**
 * Travel Insights Card Component
 * 
 * Displays a summary of the user's travel statistics and insights in a grid format,
 * with colorful indicators and icons. Provides a link to detailed analytics.
 * Shows a prompt message with illustration when no stats are available.
 * 
 * @param {Object} props - Component props
 * @param {InsightStat[]} props.stats - Array of travel statistics to display
 * @returns React component displaying travel insights data
 */
export function TravelInsightsCard({ stats }: { stats: InsightStat[] }) {
  // Check if stats are empty or if all values are "0"
  const hasNoStats = !stats.length || stats.every(stat => stat.value === "0");

  return (
    <Card className="border-border/40 shadow-sm overflow-hidden py-0">
      <CardHeader className="bg-muted/30 px-5 py-4 flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-medium flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-primary" aria-hidden="true" />
          Travel Insights
        </CardTitle>
        
        {!hasNoStats && (
          <Link href="/dashboard/analytics" className="text-sm text-primary hover:text-primary/80 transition-colors">
            All analytics
          </Link>
        )}
      </CardHeader>
      
      <CardContent className="px-5 py-2">
        {hasNoStats ? (
          <div className="flex flex-col items-center justify-center py-4 text-center">
            <div className="relative h-36 w-36 mb-4">
              <Image 
                src="/images/illustrations/no-trip.svg" 
                alt="No statistics available"
                fill
                className="object-contain rounded-full"
              />
              
              {/* Fallback if image fails to load */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0">
                <Globe className="h-16 w-16 text-muted-foreground/30" />
              </div>
            </div>
            
            <h3 className="text-base font-medium mb-1">No travel insights yet</h3>
            <p className="text-sm text-muted-foreground mb-6 max-w-xs">
              Plan and complete your first trip to see your travel statistics here
            </p>
            
            <Link href="/plan">
              <button className="inline-flex items-center gap-2 px-5 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
                <span>Start exploring</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </Link>
          </div>
        ) : (
          <div>
            {/* Top stats - highlighted primary metrics */}
            {stats.length >= 2 && (
              <div className="grid grid-cols-2 gap-4 mb-4">
                {stats.slice(0, 2).map((stat, i) => (
                  <div 
                    key={`highlight-${i}`} 
                    className="p-4 bg-muted/20 rounded-lg border border-border/50 hover:border-primary/30 transition-colors duration-300"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`h-6 w-6 rounded-full ${stat.colorClass} flex items-center justify-center`}>
                        <stat.icon className="h-3.5 w-3.5" aria-hidden="true" />
                      </div>
                      <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{stat.label}</span>
                    </div>
                    <div className="text-2xl font-semibold">{stat.value}</div>
                  </div>
                ))}
              </div>
            )}
            
            {/* Additional stats in grid */}
            <div className="grid grid-cols-2 sm:grid-cols-2 gap-3">
              {stats.slice(stats.length >= 2 ? 2 : 0).map((stat, i) => (
                <div 
                  key={i} 
                  className="p-3 rounded-lg border border-border/50 hover:border-primary/30 flex items-center gap-3 transition-colors duration-300 group"
                >
                  <div className={`h-8 w-8 rounded-full ${stat.colorClass} flex items-center justify-center flex-shrink-0`}>
                    <stat.icon className="h-4 w-4" aria-hidden="true" />
                  </div>
                  <div>
                    <div className="text-lg font-medium">{stat.value}</div>
                    <div className="text-xs text-muted-foreground">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div className={`mt-5 pt-3 border-t border-border/20 ${hasNoStats ? 'text-center' : ''}`}>
          <Link 
            href="/dashboard/analytics" 
            className="inline-flex items-center gap-1.5 text-sm text-primary hover:text-primary/80 transition-colors"
          >
            <Compass className="h-3.5 w-3.5" aria-hidden="true" />
            <span>{hasNoStats ? "Discover travel insights" : "View detailed analytics"}</span>
            <ArrowRight className="h-3.5 w-3.5 ml-0.5" />
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}