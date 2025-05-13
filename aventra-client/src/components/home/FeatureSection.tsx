"use client";

import { useRef, useMemo, JSX } from "react";
import { motion, useScroll } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { ANIMATION_CONSTANTS, DEFAULT_FEATURES } from "@/lib/constants/features";
import { FeaturesSectionProps } from "@/types/landing-page";
import { SectionHeader } from "./section-header";
import { BackgroundEffects } from "./background-effects";
import FeatureCard from "./feature-card";

/**
 * Features section component that showcases application features with animated cards
 * @param {FeaturesSectionProps} props - Component properties
 * @returns {JSX.Element} Rendered component
 */
const FeaturesSection = ({
  title = "Discover Your Next Adventure",
  subtitle = "Aventra offers a curated selection of experiences for every occasion, from weekend getaways to spontaneous dinner plans.",
  features = DEFAULT_FEATURES,
  disableAnimations
}: FeaturesSectionProps = {}): JSX.Element => {
  const prefersReducedMotion = useReducedMotion();
  const shouldDisableAnimations = disableAnimations || prefersReducedMotion;
  
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });
  
  // Memoize the features to avoid unnecessary re-renders
  const memoizedFeatures = useMemo(() => features, [features]);

  return (
    <section 
      ref={sectionRef}
      id="features" 
      className="relative py-20 sm:py-24 md:py-28 lg:py-36 overflow-hidden bg-gradient-to-b from-background to-background/95"
    >
      {/* Enhanced animated background elements */}
      <BackgroundEffects 
        scrollYProgress={scrollYProgress}
        disableAnimations={shouldDisableAnimations}
      />

      {/* Top fade from hero section */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-background to-transparent -mt-32 z-10 pointer-events-none" />

      <div className="container px-4 sm:px-6 md:px-8 w-full mx-auto relative z-10">
        <SectionHeader 
          title={title}
          subtitle={subtitle}
          scrollYProgress={scrollYProgress}
          disableAnimations={shouldDisableAnimations}
        />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
          <motion.div 
            initial={shouldDisableAnimations ? { opacity: 1 } : { opacity: 0 }}
            whileInView={shouldDisableAnimations ? undefined : { opacity: 1 }}
            transition={{ duration: ANIMATION_CONSTANTS.ITEM_ANIMATION_DURATION }}
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-7 lg:gap-8"
          >
            {memoizedFeatures.map((feature, index) => (
              <FeatureCard
                key={`feature-${index}-${feature.title.toLowerCase().replace(/\s+/g, '-')}`}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                link={feature.link}
                index={index}
                color={feature.color}
              />
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={shouldDisableAnimations ? { opacity: 1 } : { opacity: 0, y: 20 }}
          whileInView={shouldDisableAnimations ? undefined : { opacity: 1, y: 0 }}
          transition={{ 
            duration: ANIMATION_CONSTANTS.ITEM_ANIMATION_DURATION, 
            delay: 0.7 
          }}
          viewport={{ once: true }}
          className="mt-16 sm:mt-20 flex justify-center"
        >
          <motion.div 
            whileHover={shouldDisableAnimations ? {} : { scale: 1.05 }}
            className="inline-flex items-center gap-2.5 py-2.5 px-5 rounded-full bg-gradient-to-r from-purple-500/10 to-blue-600/10 backdrop-blur-md border border-border shadow-lg"
          >
            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-primary/20 flex items-center justify-center text-primary">
              <motion.span 
                animate={shouldDisableAnimations ? {} : { 
                  scale: [1, 1.2],
                  rotate: [0, 10]
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity,
                  repeatType: "reverse",
                  ease: "easeInOut",
                  type: "tween"
                }}
                className="text-base sm:text-lg"
              >
                ✨
              </motion.span>
            </div>
            <span className="text-sm sm:text-base text-foreground/90">Personalized for your interests and style</span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;