import Image from "next/image"
import { Button } from "@/components/ui/button"

const NightsOutSection = () => {
  return (
    <section id="nights-out" className="py-28 md:py-36">
      <div className="container">
        <div className="grid md:grid-cols-2 gap-20 items-center">
          <div className="order-2 md:order-1 relative aspect-[4/3] rounded-xl overflow-hidden shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)]">
            <Image
              src="https://images.unsplash.com/photo-1541532713592-79a0317b6b77?q=80&w=1788&auto=format&fit=crop"
              alt="Friends night out"
              fill
              className="object-cover hover:scale-105 transition-transform duration-700"
            />
          </div>
          <div className="order-1 md:order-2">
            <h2 className="font-display text-3xl sm:text-4xl mb-6">
              Social <span className="italic">Gatherings</span>
            </h2>
            <p className="text-muted-foreground mb-10 font-light tracking-wide leading-relaxed text-lg">
              Elevate your social calendar with carefully selected venues and experiences that bring friends
              together for unforgettable evenings.
            </p>
            <ul className="space-y-5">
              {[
                "Curated selection of trending venues",
                "Exclusive event access and reservations",
                "Themed experience packages",
                "Group coordination tools",
                "Personalized recommendations based on preferences",
              ].map((feature, i) => (
                <li key={i} className="flex items-center gap-3 font-light">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                  {feature}
                </li>
              ))}
            </ul>
            <Button className="mt-12 px-8 rounded-full">Discover Venues</Button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default NightsOutSection