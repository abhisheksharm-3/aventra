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
