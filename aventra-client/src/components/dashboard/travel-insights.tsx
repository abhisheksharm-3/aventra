import { ArrowRight, Compass } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { InsightStat } from "@/types/dashboard";
import Link from "next/link";

/**
 * Travel Insights Card Component
 * 
 * Displays a summary of the user's travel statistics and insights in a grid format,
 * with colorful indicators and icons. Provides a link to detailed analytics.
 * 
 * @param {Object} props - Component props
 * @param {InsightStat[]} props.stats - Array of travel statistics to display
 * @returns React component displaying travel insights data
 */
export function TravelInsightsCard({ stats }: { stats: InsightStat[] }) {
  return (
    <Card className="border-border/40 shadow-sm overflow-hidden">
      <CardHeader className="bg-muted/30 p-4">
        <CardTitle className="text-lg font-medium flex items-center gap-2">
          <Compass className="h-4 w-4 text-primary" aria-hidden="true" />
          Travel Insights
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-4">
        <div className="grid grid-cols-2 gap-3">
          {stats.map((stat, i) => (
            <div 
              key={i} 
              className={`p-3 rounded-lg border flex items-center gap-3 transition-colors duration-300 group cursor-default`}
            >
              <div className={`h-8 w-8 rounded-full ${stat.colorClass} flex items-center justify-center group-hover:scale-110 transition-transform duration-300 flex-shrink-0`}>
                <stat.icon className={`h-4 w-4`} aria-hidden="true" />
              </div>
              <div>
                <div className="text-lg font-medium">{stat.value}</div>
                <div className="text-xs text-muted-foreground">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-3 pt-3 border-t border-border/20">
          <Link href="/dashboard/analytics" className="flex items-center justify-center gap-1.5 text-sm text-primary hover:underline">
            <span>View detailed travel analytics</span>
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}