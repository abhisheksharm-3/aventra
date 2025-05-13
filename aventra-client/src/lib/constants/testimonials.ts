import { Testimonial } from "@/types/landing-page";

/**
 * Default title for the testimonials section
 * @constant
 */
export const DEFAULT_TITLE = "Client Testimonials";

/**
 * Default subtitle for the testimonials section
 * @constant
 */
export const DEFAULT_SUBTITLE = "Join our community of discerning travelers and social connoisseurs who've elevated their experiences with Aventra.";

/**
 * Default footer text for the testimonials section
 * @constant
 */
export const DEFAULT_FOOTER_TEXT = "Join thousands of satisfied adventurers";

/**
 * Default testimonials data
 * @constant
 */
export const DEFAULT_TESTIMONIALS: Testimonial[] = [
  {
    quote: "Aventra transformed our regular friend gatherings into extraordinary experiences. Their venue recommendations are consistently exceptional.",
    author: "Alexandra K.",
    role: "Social Enthusiast",
    imageSrc: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=2071&auto=format&fit=crop",
    color: "from-primary/10 to-primary/5" // Using primary color from theme
  },
  {
    quote: "Planning our family vacation was effortless and the curated activities delighted both adults and children alike.",
    author: "Marcus J.",
    role: "Family Traveler",
    imageSrc: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1887&auto=format&fit=crop",
    color: "from-primary/10 to-secondary/5" // Using primary/secondary from theme
  },
  {
    quote: "As a culinary enthusiast, I've discovered remarkable dining experiences that I would never have found otherwise.",
    author: "Sophia L.",
    role: "Gastronomy Aficionado",
    imageSrc: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1964&auto=format&fit=crop",
    color: "from-secondary/10 to-secondary/5" // Using secondary color from theme
  }
];

/**
 * Animation constants for the testimonials section
 * @constant
 */
export const ANIMATION_CONSTANTS = {
  SECTION_ANIMATION_DURATION: 0.7,
  CARD_ANIMATION_DURATION: 0.6,
  CARD_STAGGER_DELAY: 0.15,
  FOOTER_ANIMATION_DELAY: 0.8
};