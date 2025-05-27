import { Models } from "node-appwrite";

export interface User {
    $id: string;
    $createdAt: string;
    $updatedAt: string;
    name: string;
    password?: string;
    hash?: string;
    hashOptions?: object;
    registration: string;
    status: boolean;
    labels: string[];
    passwordUpdate: string;
    email: string;
    phone?: string;
    emailVerification: boolean;
    phoneVerification: boolean;
    mfa: boolean;
    prefs: object;
    avatarUrl?: string;
    accessedAt: string;
}
/**
 * Type definition for user preferences in the application
 * This represents all configurable settings and preferences that affect a user's experience
 */
export interface UserPreferences {
  /**
   * User's selected travel interests (e.g., "culture", "food", "adventure")
   */
  interests: string[];
  
  /**
   * User's preferred travel styles (e.g., "luxury", "budget", "solo")
   */
  travelStyle: string[];
  
  /**
   * User's dietary restrictions or preferences (e.g., "vegetarian", "vegan", "gluten-free") 
   */
  dietaryPreferences: string[];
  
  /**
   * User's budget preference on a scale of 0-100
   * Lower values represent budget-conscious travel, higher values represent luxury travel
   */
  budget: number;
  
  /**
   * Whether the user wants AI-powered recommendations and features
   */
  useAI: boolean;
  
  /**
   * User's preferred starting location or home city for trip planning
   */
  baseCity: string;
  
  /**
   * User's preferred pace of travel
   * Can be "relaxed", "moderate", or "fast"
   */
  tripPace: 'relaxed' | 'moderate' | 'fast';
  
  /**
   * User's accessibility requirements or preferences
   * Empty array or ["none"] indicates no special needs
   */
  accessibilityNeeds: string[];
  
  /**
   * Optional: Whether the user has completed the onboarding process
   * This is a metadata field that might be included in API responses
   */
  onboardingCompleted?: boolean;
  
  /**
   * Optional: Timestamp when preferences were last updated
   */
  lastUpdated?: string;
}

/**
 * Type for user preference update operations
 * Makes all fields optional to allow partial updates
 */
export type UserPreferenceUpdate = Partial<UserPreferences>;

/**
 * Response type for user preference operations
 */
export interface UserPreferencesResponse {
  success: boolean;
  preferences?: UserPreferences;
  error?: string;
}
export interface UserUpdateResult {
    success: boolean;
    error?: string;
  }

  /**
 * Interface for itinerary document in Appwrite
 */
export interface ItineraryDocument extends Models.Document {
  trip_id: string;
  user_id: string;
  name: string;
  trip_type: string;
  duration_days: number;
  created_at: string;
  currency: string;
  total_budget: number;
  preferences: string; // JSON string
  essential_info: string; // JSON string
  status: string;
}

/**
 * Interface for budget breakdown document in Appwrite
 */
export interface BudgetDocument extends Models.Document {
  trip_id: string;
  accommodation: number;
  transportation: number;
  activities: number;
  food: number;
  currency: string;
}

/**
 * Interface for day document in Appwrite
 */
export interface DayDocument extends Models.Document {
  trip_id: string;
  day_id: string;
  day_number: number;
  date: string;
  weather: string; // JSON string
}

/**
 * Interface for time block document in Appwrite
 */
export interface TimeBlockDocument extends Models.Document {
  trip_id: string;
  day_id: string;
  block_id: string;
  type: "fixed" | "flexible";
  block_type: string;
  start_time: string;
  end_time: string;
  duration_minutes: number;
  content: string | null; // JSON string
  warnings: string | null; // JSON string
}

/**
 * Interface for recommendation document in Appwrite
 */
export interface RecommendationDocument extends Models.Document {
  trip_id: string;
  rec_id: string;
  rec_type: string;
  name: string;
  content: string; // JSON string
}

/**
 * Interface for journey path document in Appwrite
 */
export interface JourneyPathDocument extends Models.Document {
  trip_id: string;
  overview: string; // JSON string
  distance_km: number;
  elevation_profile: string; // JSON string
}