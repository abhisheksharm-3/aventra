import { DashboardFeature } from "@/types/landing-page";

/**
 * Default title for the dashboard preview section
 * @constant
 */
export const DEFAULT_TITLE = "Your Digital Travel Companion";

/**
 * Default subtitle for the dashboard preview section
 * @constant
 */
export const DEFAULT_SUBTITLE = "Transform how you plan and experience travel with our intuitive dashboard — bringing together your itineraries, reservations, and personalized recommendations in one elegant interface.";

/**
 * Default features for the dashboard preview section
 * @constant
 */
export const DEFAULT_FEATURES: DashboardFeature[] = [
  {
    title: "Smart Planning",
    description: "AI-powered suggestions based on your preferences and travel style"
  },
  {
    title: "All-in-One Management",
    description: "Seamlessly track reservations, itineraries and local recommendations"
  },
  {
    title: "Real-time Updates",
    description: "Stay informed with instant notifications about your upcoming experiences"
  }
];

/**
 * Default button text for the dashboard preview section
 * @constant
 */
export const DEFAULT_BUTTON_TEXT = "Try the Dashboard";

/**
 * Default button link for the dashboard preview section
 * @constant
 */
export const DEFAULT_BUTTON_LINK = "/dashboard";

/**
 * Default dashboard image source
 * @constant
 */
export const DEFAULT_IMAGE_SRC = "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop";

/**
 * Default dashboard image alt text
 * @constant
 */
export const DEFAULT_IMAGE_ALT = "Aventra's intelligent travel planning dashboard interface";

/**
 * Animation constants for the dashboard preview section
 * @constant
 */
export const ANIMATION_CONSTANTS = {
  HEADER_ANIMATION_DURATION: 0.7,
  IMAGE_ANIMATION_DURATION: 0.9,
  FEATURE_STAGGER_DELAY: 0.1,
  BUTTON_ANIMATION_DURATION: 0.5,
  BUTTON_ANIMATION_DELAY: 0.8
};

/**
 * Color constants for the dashboard preview section
 * @constant
 */
export const COLOR_CONSTANTS = {
  GRADIENT_FROM: "blue-600",
  GRADIENT_TO: "sky-400",
  HOVER_GRADIENT_FROM: "blue-700",
  HOVER_GRADIENT_TO: "sky-500",
  SHADOW: "rgba(37,99,235,0.3)"
};