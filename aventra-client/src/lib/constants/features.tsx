import { FeatureType } from "@/types/landing-page";
import { Compass, Users, Heart, Utensils, Calendar, MapPin } from "lucide-react";

/**
 * Default features data for the Features section
 * @constant
 */
export const DEFAULT_FEATURES: FeatureType[] = [
  {
    icon: <Compass className="h-8 w-8 sm:h-10 sm:w-10" />,
    title: "Trip Planning",
    description: "Craft the perfect getaway with personalized itineraries and unique experiences tailored just for you.",
    link: "/trips",
    color: "from-teal-500/40 to-cyan-500/40" // Singapore color
  },
  {
    icon: <Users className="h-8 w-8 sm:h-10 sm:w-10" />,
    title: "Friends Night Out",
    description: "Discover trending venues and activities for memorable evenings with friends in the city's hottest spots.",
    link: "/nights-out",
    color: "from-purple-500/40 to-fuchsia-500/40" // Seoul color
  },
  {
    icon: <Heart className="h-8 w-8 sm:h-10 sm:w-10" />,
    title: "Date Night",
    description: "Curated romantic experiences to create special moments with your partner in breathtaking settings.",
    link: "/dates",
    color: "from-rose-500/40 to-orange-500/40" // Kyoto color
  },
  {
    icon: <Utensils className="h-8 w-8 sm:h-10 sm:w-10" />,
    title: "Fine Dining",
    description: "Explore exceptional culinary experiences from hidden gems to acclaimed restaurants with signature dishes.",
    link: "/dining",
    color: "from-amber-500/40 to-yellow-500/40" // Bangkok color
  },
  {
    icon: <Calendar className="h-8 w-8 sm:h-10 sm:w-10" />,
    title: "Family Outings",
    description: "Age-appropriate activities and adventures the whole family will enjoy, creating memories that last forever.",
    link: "/family",
    color: "from-emerald-500/40 to-teal-500/40" // Bali color
  },
  {
    icon: <MapPin className="h-8 w-8 sm:h-10 sm:w-10" />,
    title: "Local Experiences",
    description: "Authentic local activities that showcase the best of your destination, curated by regional experts.",
    link: "/local",
    color: "from-blue-600/40 to-sky-400/40" // Istanbul color
  }
];

/**
 * Animation timing constants
 * @constant
 */
export const ANIMATION_CONSTANTS = {
  CARD_STAGGER_DELAY: 0.1,
  TITLE_STAGGER_DELAY: 0.2,
  ITEM_ANIMATION_DURATION: 0.7,
  BACKGROUND_ANIMATION_DURATION: 8,
  SCROLL_TRANSITION_DURATION: 0.9,
};