"use client";

import { motion, useScroll } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import {
  ANIMATION_CONSTANTS,
  DEFAULT_BUTTON_LINK,
  DEFAULT_BUTTON_TEXT,
  DEFAULT_FEATURES,
  DEFAULT_IMAGE_ALT,
  DEFAULT_IMAGE_SRC,
  DEFAULT_SUBTITLE,
  DEFAULT_TITLE,
} from "@/lib/constants/dashboard-preview";
import { DashboardPreviewProps } from "@/types/landing-page";
import { JSX, useRef } from "react";
import { SecondaryBackgroundEffects } from "./secondary-background-effects";
import { SectionHeader } from "./section-header";
import { DashboardImage } from "./dashboard-image";
import { FeatureHighlights } from "./feature-highlights";
import { SecondaryActionButton } from "./secondary-action-button";
import { InfoBadge } from "./info-badge";
import { BottomWave } from "./bottom-wave";

/**
 * Dashboard preview section component
 * Shows a visual preview of the application dashboard with feature highlights
 *
 * @param {DashboardPreviewProps} props - Component properties
 * @returns {JSX.Element} Rendered component
 */
const DashboardPreview = ({
  title = DEFAULT_TITLE,
  subtitle = DEFAULT_SUBTITLE,
  features = DEFAULT_FEATURES,
  buttonText = DEFAULT_BUTTON_TEXT,
  buttonLink = DEFAULT_BUTTON_LINK,
  imageSrc = DEFAULT_IMAGE_SRC,
  imageAlt = DEFAULT_IMAGE_ALT,
  disableAnimations,
}: DashboardPreviewProps = {}): JSX.Element => {
  const prefersReducedMotion = useReducedMotion();
  const shouldDisableAnimations = disableAnimations || prefersReducedMotion;

  const sectionRef = useRef<HTMLElement>(null);

  // Parallax scrolling effects
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  return (
    <section
      ref={sectionRef}
      id="dashboard-preview"
      className="relative py-24 sm:py-28 md:py-36 overflow-hidden flex items-center justify-center"
    >
      {/* Background effects */}
      <SecondaryBackgroundEffects disableAnimations={shouldDisableAnimations} />

      <div className="container px-4 sm:px-6 md:px-8">
        {/* Section header */}
        <SectionHeader
          title={title}
          subtitle={subtitle}
          disableAnimations={shouldDisableAnimations}
          scrollYProgress={scrollYProgress}
        />

        {/* Dashboard image */}
        <DashboardImage
          src={imageSrc}
          imageAlt={imageAlt}
          disableAnimations={shouldDisableAnimations}
        />

        {/* Feature highlights */}
        <FeatureHighlights
          features={features}
          disableAnimations={shouldDisableAnimations}
        />

        {/* CTA button */}
        <motion.div
          initial={
            shouldDisableAnimations ? { opacity: 1 } : { opacity: 0, y: 10 }
          }
          whileInView={
            shouldDisableAnimations ? undefined : { opacity: 1, y: 0 }
          }
          transition={{
            duration: ANIMATION_CONSTANTS.BUTTON_ANIMATION_DURATION,
            delay: ANIMATION_CONSTANTS.BUTTON_ANIMATION_DELAY,
          }}
          viewport={{ once: true }}
          className="mt-14 sm:mt-16 text-center"
        >
          <SecondaryActionButton
            href={buttonLink}
            disableAnimations={shouldDisableAnimations}
          >
            {buttonText}
          </SecondaryActionButton>

          {/* Info badge */}
          <InfoBadge
            text="Seamlessly integrated with your preferences"
            disableAnimations={shouldDisableAnimations}
          />
        </motion.div>
      </div>

      {/* Bottom wave decoration */}
      <BottomWave />
    </section>
  );
};

export default DashboardPreview;
