import HeroSection from "@/components/home/HeroSection"
import FeaturesSection from "@/components/home/FeaturesSection"
import TripSection from "@/components/home/TripSection"
import NightsOutSection from "@/components/home/NightOutSection"
import DashboardPreview from "@/components/home/DashboardPreview"
import TestimonialsSection from "@/components/home/TestimonialsSection"
import CTASection from "@/components/home/CTASection"
import Layout from "@/components/layout/Layout"

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
  )
}