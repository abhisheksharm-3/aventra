import { MotionValue } from "framer-motion";

/**
 * Defines the structure for a feature in the features section
 * @interface FeatureType
 */
export interface FeatureType {
  /** Icon to display with the feature */
  icon: React.ReactNode;
  /** Feature title */
  title: string;
  /** Feature description text */
  description: string;
  /** URL to navigate to when exploring the feature */
  link: string;
  /** CSS gradient color class for styling */
  color: string;
}

/**
 * Props for the FeatureCard component
 * @interface FeatureCardProps
 * @extends {FeatureType}
 */
export interface FeatureCardProps extends FeatureType {
  /** Index of the feature in the list (used for animation timing) */
  index: number;
}

/**
 * Props for the FeaturesSection component
 * @interface FeaturesSectionProps
 */
export interface FeaturesSectionProps {
  /** Optional title text override */
  title?: string;
  /** Optional subtitle text override */
  subtitle?: string;
  /** Optional features data override */
  features?: FeatureType[];
  /** Optional flag to disable animations */
  disableAnimations?: boolean;
}

/**
 * Props for the SectionHeader component
 * @interface SectionHeaderProps
 */
export interface SectionHeaderProps {
  /** Title text to display */
  title: string;
  /** Subtitle/description text */
  subtitle: string;
  /** ScrollY progress value for animation */
  scrollYProgress: MotionValue<number>;
  /** Whether animations should be disabled */
  disableAnimations?: boolean;
}

/**
 * Props for the BackgroundEffects component
 * @interface BackgroundEffectsProps
 */
export interface BackgroundEffectsProps {
  /** ScrollY progress value for parallax effects */
  scrollYProgress: MotionValue<number>;
  /** Whether animations should be disabled */
  disableAnimations?: boolean;
}