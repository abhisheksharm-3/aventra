import { ReactNode } from "react";

export interface SearchSuggestionProps {
  suggestion: string;
  onClick: () => void;
}

export interface FilterButtonProps {
  icon: ReactNode;
  label: string;
  isSelected: boolean;
  onClick: () => void;
}

export interface TrendingItemProps {
  icon: string;
  name: string;
  onClick: () => void;
}

export interface DestinationCardProps {
  name: string;
  country: string;
  image: string;
}

export interface FilterOptions {
  location: string | null;
  dateRange: { from: Date; to: Date } | null;
  groupSize: number;
  regions: string[];
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