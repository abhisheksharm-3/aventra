export interface FilterButtonProps {
  icon: React.ReactNode;
  label: string;
  isSelected?: boolean;
  onClick: () => void;
  isLoading?: boolean;
  count?: number;
  badge?: string | number;
  disabled?: boolean;
  tooltipContent?: string;
  className?: string;
}

export interface TrendingItemProps {
  icon: string;
  name: string;
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