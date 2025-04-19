export interface TrendingItemProps {
  icon: string;
  name: string;
  className?: string;
  tabIndex?: number;
  onKeyDown?: (e: { key: string; preventDefault: () => void }) => void;
  onClick: () => void;
}

export interface SearchSuggestionProps {
  suggestion: string;
  onClick: () => void;
  isRecent?: boolean;
  isAutocomplete?: boolean;
}

// For DestinationCard
export interface DestinationCardProps {
  name: string;
  country: string;
  image: string;
  onClick?: () => void;  // Add this new prop
}

export interface FilterOptions {
  location: string | null;
  dateRange: { from: Date; to: Date } | null;
  groupSize: number;
  regions: string[];
  budget: BudgetOption | null; // Changed from string | null to BudgetOption | null
  travelStyle: string[];
}

export interface BudgetOption {
  type: string;
  label: string;
  maxAmount?: number;
  currency: string;
}

export interface LocationFilterProps {
  onClose: () => void;
  selectedLocation: string | null;
  setSelectedLocation: (location: string | null) => void;
}

export interface DateFilterProps {
  onClose: () => void;
  selectedDate: { from: Date; to: Date } | null;
  setSelectedDate: (dateRange: { from: Date; to: Date } | null) => void;
}

export interface GroupSizeFilterProps {
  onClose: () => void;
  groupSize: number;
  setGroupSize: (size: number) => void;
}

export interface GlobalFilterProps {
  onClose: () => void;
  selectedRegions: string[];
  setSelectedRegions: (regions: string[]) => void;
}

export interface LocationFilterProps {
  onClose: () => void;
  selectedLocation: string | null;
  setSelectedLocation: (location: string | null) => void;
  recentSearches?: string[];
}

export interface TrendingSectionProps {
  className?: string;
  compact?: boolean;
  maxItems?: number;
}

/**
 * Interface for Featured Section component props
 * @interface FeaturedSectionProps
 * @property {string} [className] - Optional CSS class to apply to the component
 * @property {number} [maxItems=6] - Maximum number of destinations to display
 * @property {string} [viewAllLink="/destinations"] - Link for the "View all" button
 */
export interface FeaturedSectionProps {
  className?: string;
  maxItems?: number;
  viewAllLink?: string;
}