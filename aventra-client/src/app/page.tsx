/**
 * @component Home
 * @description The main landing page component that showcases the application's features and content.
 * It combines multiple section components to create a complete marketing homepage.
 * @returns {JSX.Element} Rendered Home page with all sections wrapped in a Layout
 */
import HeroSection from "@/components/home/HeroSection";
import FeaturesSection from "@/components/home/FeatureSection";
import TripSection from "@/components/home/TripsSection";
import TestimonialsSection from "@/components/home/TestimonialSection";
import CTASection from "@/components/home/CTASection";
import Layout from "@/components/layout/Layout";
import DashboardPreview from "@/components/home/DashboardPreview";
import NightsOutSection from "@/components/home/NightOutSection";

export default function Home() {
  return (
    <Layout>
      <HeroSection />
      <FeaturesSection />
      <TripSection />
      <NightsOutSection />
      <DashboardPreview />
      <TestimonialsSection />
      <CTASection />
    </Layout>
  );
}