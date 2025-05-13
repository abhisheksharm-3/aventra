"use client";

import { create } from 'zustand';

// Define the types based on your API response structure
type Temperature = {
  min: number;
  max: number;
};

type Weather = {
  temperature: Temperature;
  conditions: string;
  advisory: string;
};

type Cost = {
  currency: string | null;
  range: string | null;
  per_unit?: string | null;
};

type Location = {
  name: string;
  coordinates: {
    lat: number | null;
    lng: number | null;
  };
  altitude: number | null;
  google_maps_link: string;
};

type Travel = {
  mode: string | null;
  details: string | null;
  duration: number;
  cost: Cost;
  link: string | null;
  operator: string | null;
};

type Activity = {
  title: string;
  type: string;
  description: string;
  location: Location;
  duration: number;
  cost: Cost;
  images: string[];
  link: string | null;
  priority: number;
  highlights: string[];
};

type Warning = {
  type: string;
  message: string;
  priority: number;
};

type TimeBlock = {
  type: string;
  start_time: string;
  end_time: string;
  duration_minutes: number;
  activity: Activity;
  travel: Travel;
  warnings: Warning[];
};

type Day = {
  day_number: number;
  date: string;
  weather: Weather;
  time_blocks: TimeBlock[];
};

type TotalBudget = {
  currency: string;
  total: string;
  breakdown: {
    accommodation: number;
    transportation: number;
    activities: number;
    food: number;
  };
};

type Preferences = {
  dietary_restrictions: string[];
  accessibility_needs: boolean;
  pace: string;
  context: string;
};

type Metadata = {
  trip_type: string[];
  duration_days: number;
  total_budget: TotalBudget;
  preferences: Preferences;
};

type Accommodation = {
  name: string;
  type: string;
  location: Location;
  price_range: string;
  rating: number;
  images: string[];
  amenities: string[];
  link: string;
  description: string;
};

type DiningOption = {
  name: string;
  cuisine: string;
  price_range: string;
  dietary_options: string[];
  signature_dishes: string[];
  location: Location;
  images: string[];
  link: string;
  description: string;
};

type Transportation = {
  mode: string;
  from?: string;
  to?: string;
  departure_time?: string;
  arrival_time?: string;
  duration?: number;
  operator?: string;
  area?: string;
  cost: Cost;
  link?: string;
  details: string;
};

type Recommendations = {
  accommodations: Accommodation[];
  dining: DiningOption[];
  transportation: Transportation[];
};

type EssentialInfo = {
  documents: string[];
  emergency_contacts: {
    type: string;
    number: string;
  }[];
};

type JourneyPath = {
  overview: {
    lat: number;
    lng: number;
  }[];
  distance_km: number;
  elevation_profile: {
    distance: number;
    elevation: number;
  }[];
};

export type ItineraryData = {
  metadata: Metadata;
  itinerary: Day[];
  recommendations: Recommendations;
  essential_info: EssentialInfo;
  journey_path: JourneyPath;
};

// Define the API response type
export type ApiResponse = {
  isSuccess: boolean;
  id?: string;
  error?: string;
  metadata: {
    trip_type: string;
    duration_days: number;
    total_budget: {
      currency: string;
      total: string;
      breakdown: {
        accommodation: number;
        transportation: number;
        activities: number;
        food: number;
      };
    };
    preferences: {
      dietary_restrictions: string[];
      accessibility_needs: boolean;
      pace: string;
      context: string;
    };
  };
  itinerary: Array<{
    day_number: number;
    date: string;
    weather: {
      temperature: {
        min: number;
        max: number;
      };
      conditions: string;
      advisory: string;
    };
    time_blocks: Array<{
      type: "fixed" | "flexible";
      start_time: string;
      end_time: string;
      duration_minutes: number;
      activity?: {
        title: string;
        type: string;
        description: string;
        location?: {
          name: string;
          coordinates: {
            lat: number;
            lng: number;
          };
          altitude?: number;
          google_maps_link?: string;
        };
        duration: number;
        cost?: {
          currency: string;
          range: string;
        };
        images?: string[];
        priority?: number;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        backup_alternative_options?: any[];
      };
      travel?: {
        mode: "flight" | "train" | "car" | "bus";
        details: string;
        duration: number;
        cost?: {
          currency: string;
          range: string;
        };
        link?: string;
        operator?: string;
      };
      warnings?: Array<{
        type: string;
        message: string;
        priority: number;
      }>;
    }>;
  }>;
  recommendations: {
    accommodations: Array<{
      name: string;
      type: string;
      location: {
        name: string;
        coordinates: {
          lat: number;
          lng: number;
        };
        google_maps_link?: string;
      };
      price_range: string;
      rating: number;
      images: string[];
      amenities: string[];
      link?: string;
    }>;
    dining: Array<{
      name: string;
      cuisine: string;
      price_range: string;
      dietary_options: string[];
      images: string[];
      link?: string;
    }>;
    transportation: Array<{
      mode: string;
      details: string;
      duration: number;
      cost: {
        currency: string;
        range: string;
      };
      link?: string;
      operator?: string;
    }>;
  };
  essential_info: {
    documents: string[];
    emergency_contacts: Array<{
      type: string;
      number: string;
    }>;
  };
  journey_path: {
    overview: Array<{
      lat: number;
      lng: number;
    }>;
    distance_km: number;
    elevation_profile: Array<{
      distance: number;
      elevation: number;
    }>;
  };
  currentDateTime: string;
  currentUser: string;
};

// Define the store state
interface ItineraryState {
  itineraryData: ApiResponse | null;
  setItineraryData: (data: ApiResponse) => void;
  clearItineraryData: () => void;
}

// Create the store
export const useItineraryStore = create<ItineraryState>((set) => ({
  itineraryData: null,
  setItineraryData: (data) => set({ itineraryData: data }),
  clearItineraryData: () => set({ itineraryData: null }),
}));
