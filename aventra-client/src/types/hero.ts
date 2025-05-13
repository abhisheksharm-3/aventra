/**
 * Defines the structure for a destination in the featured carousel
 * @interface Destination
 */
export interface Destination {
  /** Unique identifier for the destination */
  id: string;
  /** Display name of the destination */
  name: string;
  /** Short descriptive tagline for the destination */
  tagline: string;
  /** URL to the image representing the destination */
  image: string;
  /** CSS gradient color class for various UI elements */
  color: string;
  /** CSS gradient for primary buttons */
  buttonGradient: string;
  /** CSS gradient for hover states */
  hoverGradient: string;
  /** CSS shadow color value */
  shadowColor: string;
}

/**
 * Props for the Hero component
 * @interface HeroProps
 */
export interface HeroProps {
  /** Optional initial destination index to display */
  initialDestination?: number;
  /** Optional auto-rotation interval in milliseconds */
  rotationInterval?: number;
}

/**
 * Props for the DestinationImage component
 * @interface DestinationImageProps
 */
export interface DestinationImageProps {
  /** The destination to display */
  destination: Destination;
  /** Whether the component is being viewed on a mobile device */
  isMobile: boolean;
  /** Whether this destination is currently active in the carousel */
  isActive: boolean;
}

/**
 * Props for the NavigationDots component
 * @interface NavigationDotsProps
 */
export interface NavigationDotsProps {
  /** List of all available destinations */
  destinations: Destination[];
  /** Index of the currently active destination */
  activeDestIndex: number;
  /** Number of dots to show per page */
  dotsPerPage: number;
  /** Callback to change the active destination */
  setActiveDestIndex: (index: number) => void;
}

/**
 * Props for the ActionButtons component
 * @interface ActionButtonsProps
 */
export interface ActionButtonsProps {
  /** The currently active destination */
  destination: Destination;
  /** Callback when hover state changes */
  onHoverChange: (hovered: boolean) => void;
}