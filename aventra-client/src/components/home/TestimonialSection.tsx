"use client";

import { useReducedMotion } from "@/hooks/useReducedMotion";
import { DEFAULT_TITLE, DEFAULT_SUBTITLE, DEFAULT_TESTIMONIALS, DEFAULT_FOOTER_TEXT } from "@/lib/constants/testimonials";
import { TestimonialsSectionProps } from "@/types/landing-page";
import { JSX, useRef } from "react";
import { SecondaryBackgroundEffects } from "./secondary-background-effects";
import { SectionHeader } from "./section-header";
import { TestimonialsList } from "./testimonial-list";
import { FooterBadge } from "./footer-badge";
import { BottomWave } from "./bottom-wave";
import { useScroll } from "framer-motion";

/**
 * Testimonials section component that showcases customer reviews
 * Displays multiple testimonial cards with customer quotes and profile images
 * 
 * @param {TestimonialsSectionProps} props - Component properties
 * @returns {JSX.Element} Rendered component
 */
const TestimonialsSection = ({
  title = DEFAULT_TITLE,
  subtitle = DEFAULT_SUBTITLE,
  testimonials = DEFAULT_TESTIMONIALS,
  footerText = DEFAULT_FOOTER_TEXT,
  disableAnimations
}: TestimonialsSectionProps = {}): JSX.Element => {
  const prefersReducedMotion = useReducedMotion();
  const shouldDisableAnimations = disableAnimations || prefersReducedMotion;
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  
  return (
    <section 
      ref={sectionRef}
      id="testimonials" 
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
        
        <div className="max-w-7xl mx-auto">
          {/* Testimonials list */}
          <TestimonialsList 
            testimonials={testimonials}
            disableAnimations={shouldDisableAnimations}
          />
          
          {/* Footer badge */}
          <FooterBadge 
            text={footerText}
            disableAnimations={shouldDisableAnimations}
          />
        </div>
      </div>

      {/* Bottom wave decoration */}
      <BottomWave />
    </section>
  );
};

export default TestimonialsSection;