"use client";

import { useReducedMotion } from "@/hooks/useReducedMotion";
import { DEFAULT_TITLE, DEFAULT_SUBTITLE, DEFAULT_FEATURES, 
         DEFAULT_BUTTON_TEXT, DEFAULT_BUTTON_LINK,
         DEFAULT_IMAGE_SRC, DEFAULT_IMAGE_ALT } from "@/lib/constants/night-out";
import { NightsOutSectionProps } from "@/types/landing-page";
import { JSX, useRef } from "react";
import { SecondaryBackgroundEffects } from "./secondary-background-effects";
import { SecondaryHeroImage } from "./secondary-hero-image";
import { NightOutSectionContent } from "./night-out-section-content";
import { useScroll } from "framer-motion";
import { BottomWave } from "./bottom-wave";

/**
 * Nights Out section component that showcases social gathering features
 * Provides information about social experiences with an appealing image
 * 
 * @param {NightsOutSectionProps} props - Component properties
 * @returns {JSX.Element} Rendered component
 */
const NightsOutSection = ({
  title = DEFAULT_TITLE,
  subtitle = DEFAULT_SUBTITLE,
  features = DEFAULT_FEATURES,
  buttonText = DEFAULT_BUTTON_TEXT,
  buttonLink = DEFAULT_BUTTON_LINK,
  imageSrc = DEFAULT_IMAGE_SRC,
  imageAlt = DEFAULT_IMAGE_ALT,
  disableAnimations
}: NightsOutSectionProps = {}): JSX.Element => {
  const prefersReducedMotion = useReducedMotion();
  const shouldDisableAnimations = disableAnimations || prefersReducedMotion;

  const sectionRef = useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });
  
  return (
    <section 
      id="nights-out" 
      className="relative py-24 sm:py-28 md:py-36 overflow-hidden flex items-center justify-center"
    >
      {/* Background effects */}
      <SecondaryBackgroundEffects disableAnimations={shouldDisableAnimations} />

      <div className="container px-4 sm:px-6 md:px-8">
        <div className="grid md:grid-cols-2 gap-10 lg:gap-20 items-center max-w-7xl mx-auto">
          {/* Image Column */}
          <SecondaryHeroImage
            src={imageSrc}
            alt={imageAlt}
            disableAnimations={shouldDisableAnimations}
            caption="Experience the thrill of social gatherings with our exclusive features."
            scrollYProgress={scrollYProgress}
          />
          
          {/* Content Column */}
          <NightOutSectionContent
            title={title}
            subtitle={subtitle}
            features={features}
            buttonText={buttonText}
            buttonLink={buttonLink}
            disableAnimations={shouldDisableAnimations}
          />
        </div>
      </div>

      {/* Bottom wave decoration */}
      <BottomWave />
    </section>
  );
};

export default NightsOutSection;