"use client";

import { JSX, useRef } from "react";
import { useScroll } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { DEFAULT_BUTTON_LINK, DEFAULT_BUTTON_TEXT, DEFAULT_FEATURES, DEFAULT_IMAGE_ALT, DEFAULT_IMAGE_CAPTION, DEFAULT_IMAGE_SRC, DEFAULT_SUBTITLE, DEFAULT_TITLE } from "@/lib/constants/trips-section";
import { TripSectionProps } from "@/types/landing-page";
import { TripContent } from "./trip-content";
import { SecondaryBackgroundEffects } from "./secondary-background-effects";
import { SecondaryHeroImage } from "./secondary-hero-image";

/**
 * Trip section component that showcases the trip planning feature
 * Provides visually engaging content with parallax scrolling effects
 * 
 * @param {TripSectionProps} props - Component properties
 * @returns {JSX.Element} Rendered component
 */
const TripSection = ({
  title = DEFAULT_TITLE,
  subtitle = DEFAULT_SUBTITLE,
  features = DEFAULT_FEATURES,
  buttonText = DEFAULT_BUTTON_TEXT,
  buttonLink = DEFAULT_BUTTON_LINK,
  imageSrc = DEFAULT_IMAGE_SRC,
  imageAlt = DEFAULT_IMAGE_ALT,
  disableAnimations
}: TripSectionProps = {}): JSX.Element => {
  const prefersReducedMotion = useReducedMotion();
  const shouldDisableAnimations = disableAnimations || prefersReducedMotion;
  
  const sectionRef = useRef<HTMLElement>(null);
  
  // Parallax scrolling effects
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });
  
  return (
    <section 
      ref={sectionRef}
      id="trips" 
      className="relative py-24 sm:py-28 md:py-36 lg:py-40 overflow-hidden w-screen flex items-center justify-center"
    >
      {/* Background effects */}
      <SecondaryBackgroundEffects disableAnimations={shouldDisableAnimations} />

      <div className="container px-4 sm:px-6 md:px-8 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center max-w-7xl mx-auto">
          {/* Content Column */}
          <TripContent
            title={title}
            subtitle={subtitle}
            features={features}
            buttonText={buttonText}
            buttonLink={buttonLink}
            scrollYProgress={scrollYProgress}
            disableAnimations={shouldDisableAnimations}
          />
          
          {/* Image Column */}
          <SecondaryHeroImage
            src={imageSrc}
            alt={imageAlt}
            caption={DEFAULT_IMAGE_CAPTION}
            scrollYProgress={scrollYProgress}
            disableAnimations={shouldDisableAnimations}
          />
        </div>
      </div>
    </section>
  );
};

export default TripSection;