import { SimpleFeature } from "@/types/landing-page";

/**
 * Default title for the trip section
 * @constant
 */
export const DEFAULT_TITLE = "Curated Journeys";

/**
 * Default subtitle for the trip section
 * @constant
 */
export const DEFAULT_SUBTITLE = "From weekend escapes to extended adventures, our expertly crafted itineraries ensure every moment of your journey is thoughtfully planned and memorable.";

/**
 * Default features list for the trip section
 * @constant
 */
export const DEFAULT_FEATURES: SimpleFeature[] = [
  {
    text: "Personalized itineraries based on your preferences"
  },
  {
    text: "Exclusive access to unique accommodations"
  },
  {
    text: "Insider recommendations from local experts"
  },
  {
    text: "Seamless booking for all activities"
  },
  {
    text: "Detailed travel guides and resources"
  }
];

/**
 * Default button text for the trip section
 * @constant
 */
export const DEFAULT_BUTTON_TEXT = "Plan Your Journey";

/**
 * Default button link for the trip section
 * @constant
 */
export const DEFAULT_BUTTON_LINK = "/plan";

/**
 * Default image source for the trip section
 * @constant
 */
export const DEFAULT_IMAGE_SRC = "https://images.unsplash.com/photo-1533105079780-92b9be482077";

/**
 * Default image alt text for the trip section
 * @constant
 */
export const DEFAULT_IMAGE_ALT = "Trip planning interface";

/**
 * Default image caption for the trip section
 * @constant
 */
export const DEFAULT_IMAGE_CAPTION = "AI-powered trip planning for your unique travel style";

/**
 * Animation constants for the trip section
 * @constant
 */
export const ANIMATION_CONSTANTS = {
  SECTION_ANIMATION_DURATION: 0.7,
  FEATURE_STAGGER_DELAY: 0.1,
  BUTTON_ANIMATION_DURATION: 0.5,
  HOVER_ANIMATION_DURATION: 1.5,
  BACKGROUND_ANIMATION_DURATION: 8,
  IMAGE_ANIMATION_DURATION: 0.7
};