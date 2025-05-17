import { MotionValue } from "framer-motion";
import { ReactNode } from "react";

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
 * @interface SecondaryBackgroundEffectsProps
 */
export interface SecondaryBackgroundEffectsProps {
  /** Whether animations should be disabled */
  disableAnimations?: boolean;
}

/**
 * Feature item in the trip section list
 * @interface SimpleFeature
 */
export interface SimpleFeature {
  /** Feature description text */
  text: string;
}

/**
 * Props for the TripSection component
 * @interface TripSectionProps
 */
export interface TripSectionProps {
  /** Optional section title override */
  title?: string;
  /** Optional section subtitle override */
  subtitle?: string;
  /** Optional feature list override */
  features?: SimpleFeature[];
  /** Optional CTA button text override */
  buttonText?: string;
  /** Optional CTA button link */
  buttonLink?: string;
  /** Optional image source URL */
  imageSrc?: string;
  /** Optional image alt text */
  imageAlt?: string;
  /** Optional flag to disable animations */
  disableAnimations?: boolean;
}

/**
 * Props for the TripContent component
 * @interface TripContentProps
 */
export interface TripContentProps {
  /** Title of the section */
  title: string;
  /** Subtitle description */
  subtitle: string;
  /** List of features */
  features: SimpleFeature[];
  /** Button text */
  buttonText: string;
  /** Button link */
  buttonLink: string;
  /** ScrollY progress value for animation */
  scrollYProgress: import("framer-motion").MotionValue<number>;
  /** Whether animations should be disabled */
  disableAnimations?: boolean;
}

/**
 * Props for the SecondaryHeroImage component
 * @interface SecondaryHeroImageProps
 */
export interface SecondaryHeroImageProps {
  /** Image source URL */
  src: string;
  /** Image alternative text */
  alt: string;
  /** Caption text */
  caption: string;
  /** ScrollY progress value for animation */
  scrollYProgress: import("framer-motion").MotionValue<number>;
  /** Whether animations should be disabled */
  disableAnimations?: boolean;
}

/**
 * Props for the FeatureList component
 * @interface FeatureListProps
 */
export interface FeatureListProps {
  /** List of features to display */
  features: SimpleFeature[];
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

/**
 * Props for the SecondaryActionButton component
 * @interface SecondaryActionButtonProps
 */
export interface SecondaryActionButtonProps {
  /** Button text content */
  children: ReactNode;
  /** Button link URL */
  href?: string;
  /** Whether animations should be disabled */
  disableAnimations?: boolean;
}

/**
 * Props for the NightsOutSection component
 * @interface NightsOutSectionProps
 */
export interface NightsOutSectionProps {
  /** Optional section title override */
  title?: string;
  /** Optional section subtitle override */
  subtitle?: string;
  /** Optional feature list override */
  features?: SimpleFeature[];
  /** Optional CTA button text override */
  buttonText?: string;
  /** Optional CTA button link */
  buttonLink?: string;
  /** Optional image source URL */
  imageSrc?: string;
  /** Optional image alt text */
  imageAlt?: string;
  /** Optional flag to disable animations */
  disableAnimations?: boolean;
}

/**
 * Props for the SectionContent component
 * @interface SectionContentProps
 */
export interface SectionContentProps {
  /** Title of the section */
  title: string;
  /** Subtitle description */
  subtitle: string;
  /** List of features */
  features: SimpleFeature[];
  /** Button text */
  buttonText: string;
  /** Button link */
  buttonLink: string;
  /** Whether animations should be disabled */
  disableAnimations?: boolean;
}

/**
 * Props for the SectionImage component
 * @interface SectionImageProps
 */
export interface SectionImageProps {
  /** Image source URL */
  src: string;
  /** Image alternative text */
  alt: string;
  /** Whether animations should be disabled */
  disableAnimations?: boolean;
}

/**
 * Feature highlight in the dashboard preview section
 * @interface DashboardFeature
 */
export interface DashboardFeature {
  /** Feature title */
  title: string;
  /** Feature description text */
  description: string;
}

/**
 * Props for the DashboardPreview component
 * @interface DashboardPreviewProps
 */
export interface DashboardPreviewProps {
  /** Optional section title override */
  title?: string;
  /** Optional section subtitle override */
  subtitle?: string;
  /** Optional features list override */
  features?: DashboardFeature[];
  /** Optional CTA button text override */
  buttonText?: string;
  /** Optional CTA button link */
  buttonLink?: string;
  /** Optional dashboard image source URL */
  imageSrc?: string;
  /** Optional dashboard image alt text */
  imageAlt?: string;
  /** Optional flag to disable animations */
  disableAnimations?: boolean;
}

/**
 * Props for the DashboardImage component
 * @interface DashboardImageProps
 */
export interface DashboardImageProps {
  /** Image source URL */
  src: string;
  /** Image alt text */
  imageAlt: string;
  /** Whether animations should be disabled */
  disableAnimations?: boolean;
}

/**
 * Props for the FeatureHighlights component
 * @interface FeatureHighlightsProps
 */
export interface FeatureHighlightsProps {
  /** Features to display */
  features: DashboardFeature[];
  /** Whether animations should be disabled */
  disableAnimations?: boolean;
}

/**
 * Props for the BottomWave component
 * @interface BottomWaveProps
 */
export interface BottomWaveProps {
  /** Optional CSS class names */
  className?: string;
}

/**
 * Defines the structure for a testimonial item
 * @interface Testimonial
 */
export interface Testimonial {
  /** The quote text from the testimonial */
  quote: string;
  /** Name of the person giving the testimonial */
  author: string;
  /** Role or title of the person */
  role: string;
  /** URL to the person's profile image */
  imageSrc: string;
  /** CSS gradient color for the testimonial card */
  color: string;
}

/**
 * Props for the TestimonialCard component
 * @interface TestimonialCardProps
 * @extends {Testimonial}
 */
export interface TestimonialCardProps extends Testimonial {
  /** Index of the testimonial in the list (used for animation timing) */
  index: number;
  /** Whether animations should be disabled */
  disableAnimations?: boolean;
}

/**
 * Props for the TestimonialsSection component
 * @interface TestimonialsSectionProps
 */
export interface TestimonialsSectionProps {
  /** Optional section title override */
  title?: string;
  /** Optional section subtitle override */
  subtitle?: string;
  /** Optional testimonials data override */
  testimonials?: Testimonial[];
  /** Optional footer text override */
  footerText?: string;
  /** Optional flag to disable animations */
  disableAnimations?: boolean;
}


/**
 * Props for the TestimonialsList component
 * @interface TestimonialsListProps
 */
export interface TestimonialsListProps {
  /** List of testimonials to display */
  testimonials: Testimonial[];
  /** Whether animations should be disabled */
  disableAnimations?: boolean;
}

/**
 * Props for the FooterBadge component
 * @interface FooterBadgeProps
 */
export interface FooterBadgeProps {
  /** Text to display in the badge */
  text: string;
  /** Whether animations should be disabled */
  disableAnimations?: boolean;
}