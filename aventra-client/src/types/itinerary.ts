export type Temperature = {
  min: number;
  max: number;
};

export type Weather = {
  temperature: Temperature;
  conditions: string;
  advisory: string;
};

export type Cost = {
  currency: string | null;
  range: string | null;
  per_unit?: string | null;
};

export type Location = {
  name: string;
  coordinates: {
    lat: number | null;
    lng: number | null;
  };
  altitude: number | null;
  google_maps_link: string;
};

export type Travel = {
  mode: string | null;
  details: string | null;
  duration: number;
  cost: Cost;
  link: string | null;
  operator: string | null;
};

export type Activity = {
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

export type Warning = {
  type: string;
  message: string;
  priority: number;
};

export type TimeBlock = {
  type: string;
  start_time: string;
  end_time: string;
  duration_minutes: number;
  activity: Activity;
  travel: Travel;
  warnings: Warning[];
};

export type Day = {
  day_number: number;
  date: string;
  weather: Weather;
  time_blocks: TimeBlock[];
};

export type TotalBudget = {
  currency: string;
  total: string;
  breakdown: {
    accommodation: number;
    transportation: number;
    activities: number;
    food: number;
  };
};

export type Preferences = {
  dietary_restrictions: string[];
  accessibility_needs: boolean;
  pace: string;
  context: string;
};

export type Metadata = {
  trip_type: string[];
  duration_days: number;
  total_budget: TotalBudget;
  preferences: Preferences;
};

export type Accommodation = {
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

export type DiningOption = {
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

export type Transportation = {
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

export type Recommendations = {
  accommodations: Accommodation[];
  dining: DiningOption[];
  transportation: Transportation[];
};

export type EssentialInfo = {
  documents: string[];
  emergency_contacts: {
    type: string;
    number: string;
  }[];
};

export type JourneyPath = {
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
export type GeneratedItineraryResponse = {
  isSuccess: boolean;
  id: string;
  name: string;
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
      activity: {
        title: string;
        type: string;
        description: string;
        location: {
          name: string;
          coordinates: {
            lat: number;
            lng: number;
          };
          altitude: number;
          google_maps_link: string;
        };
        duration: number;
        cost: {
          currency: string;
          range: string;
        };
        images: string[];
        link: string | null;
        highlights: string[];
        priority: number;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        backup_alternative_options?: any[];
      };
      travel: {
        mode: "flight" | "train" | "car" | "bus";
        details: string;
        duration: number;
        cost: {
          currency: string;
          range: string;
        };
        link: string | null;
        operator: string | null;
      };
      warnings: Array<{
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
      signature_dishes: string[];
      location: {
        name: string;
        coordinates: {
          lat: number;
          lng: number;
        };
        google_maps_link?: string;
      };
      description: string;
      images: string[];
      link: string;
    }>;
    transportation: Array<{
      mode: string;
      details: string;
      duration_minutes: number;
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
export interface ItineraryState {
  itineraryData: GeneratedItineraryResponse | null;
  setItineraryData: (data: GeneratedItineraryResponse) => void;
  clearItineraryData: () => void;
}

export interface TripMetadata {
  trip_type: string;
  duration_days: number;
  total_budget: Budget;
  preferences: Preferences;
}

export interface Budget {
  currency: string;
  total: string;
  breakdown: {
    accommodation: number;
    transportation: number;
    activities: number;
    food: number;
  };
}

export interface DayItinerary {
  day_number: number;
  date: string;
  weather: Weather;
  time_blocks: TimeBlock[];
}
export interface Dining {
  name: string;
  cuisine: string;
  price_range: string;
  dietary_options: string[];
  signature_dishes: string[];
  location: Location;
  description: string;
  images: string[];
  link: string;
}

export interface EmergencyContact {
  type: string;
  number: string;
}

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface ElevationPoint {
  distance: number;
  elevation: number;
}
