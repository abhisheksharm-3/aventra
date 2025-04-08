import Image from "next/image"
import { Button } from "@/components/ui/button"

const DashboardPreview = () => {
  return (
    <section id="dashboard-preview" className="py-28 md:py-36 bg-gradient-to-b from-[#FCFCFC] to-[#F8F8F8]">
      <div className="container">
        <div className="text-center mb-20">
          <h2 className="font-display text-3xl sm:text-4xl">
            Your Personal <span className="italic">Concierge</span>
          </h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto font-light tracking-wide text-lg">
            Manage all your experiences in one elegant, intuitive dashboard designed for the discerning planner.
          </p>
        </div>
        <div className="relative mx-auto max-w-5xl rounded-xl border bg-white p-3 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)]">
          <div className="aspect-[16/9] overflow-hidden rounded-lg">
            <Image
              src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop"
              alt="Dashboard interface"
              width={1920}
              height={1080}
              className="object-cover"
            />
          </div>
        </div>
        <div className="mt-16 text-center">
          <Button size="lg" className="px-10 rounded-full transition-all duration-300 hover:scale-105">
            Experience Aventra
          </Button>
        </div>
      </div>
    </section>
  )
}

export default DashboardPreview