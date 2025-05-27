import { User } from "./appwrite";

/**
 * Trip data interface
 */
export interface TripData {
  id: string;
  destination: string;
  startDate: string;
  endDate: string;
  image: string;
  daysRemaining?: number;
  progress?: number;
}

/**
 * Destination recommendation interface
 */
export interface Destination {
  id: string;
  name: string;
  tagline: string;
  match: number;
  image: string;
  imageQuery?: string; // Optional query for fetching images
  isLoading?: boolean;
}

export interface InDepthDestination extends Destination {
  description: string;
  bestTimeToVisit: string;
  highlights: string[];
  travelTips: string[];
  localCuisine: string[];
  culturalNotes: string;
  budget: {
    currency: string;
    hostel: string;
    midRange: string;
    luxury: string;
    averageMeal: string;
    transportDaily: string;
  };
  category: string;
}
/**
 * Quick action interface
 */
export interface QuickAction {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

/**
 * Insights stat interface
 */
export interface InsightStat {
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  colorClass: string;
}

/**
 * Dashboard overview component props
 */
export interface DashboardOverviewProps {
  user: User | null;
}
