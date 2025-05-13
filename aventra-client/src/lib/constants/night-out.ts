import { SimpleFeature } from "@/types/landing-page";

/**
 * Default title for the nights out section
 * @constant
 */
export const DEFAULT_TITLE = "Social Gatherings";

/**
 * Default subtitle for the nights out section
 * @constant
 */
export const DEFAULT_SUBTITLE = "Elevate your social calendar with carefully selected venues and experiences that bring friends together for unforgettable evenings.";

/**
 * Default features list for the nights out section
 * @constant
 */
export const DEFAULT_FEATURES: SimpleFeature[] = [
  {
    text: "Curated selection of trending venues"
  },
  {
    text: "Exclusive event access and reservations"
  },
  {
    text: "Themed experience packages"
  },
  {
    text: "Group coordination tools"
  },
  {
    text: "Personalized recommendations based on preferences"
  }
];

/**
 * Default button text for the nights out section
 * @constant
 */
export const DEFAULT_BUTTON_TEXT = "Discover Venues";

/**
 * Default button link for the nights out section
 * @constant
 */
export const DEFAULT_BUTTON_LINK = "/venues";

/**
 * Default image source for the nights out section
 * @constant
 */
export const DEFAULT_IMAGE_SRC = "https://images.unsplash.com/photo-1541532713592-79a0317b6b77?q=80&w=1788&auto=format&fit=crop";

/**
 * Default image alt text for the nights out section
 * @constant
 */
export const DEFAULT_IMAGE_ALT = "Friends night out";

/**
 * Animation constants for the nights out section
 * @constant
 */
export const ANIMATION_CONSTANTS = {
  SECTION_ANIMATION_DURATION: 0.7,
  FEATURE_STAGGER_DELAY: 0.1,
  BUTTON_ANIMATION_DELAY: 0.8,
  TITLE_ANIMATION_DELAY: 0.2
};

/**
 * Color constants for the nights out section
 * @constant
 */
export const COLOR_CONSTANTS = {
  GRADIENT_FROM: "purple-500",
  GRADIENT_TO: "fuchsia-500",
  HOVER_GRADIENT_FROM: "purple-600",
  HOVER_GRADIENT_TO: "fuchsia-600",
  SHADOW: "rgba(168,85,247,0.3)"
};