import Image from "next/image"
import { Button } from "@/components/ui/button"

const TripSection = () => {
  return (
    <section id="trips" className="py-28 md:py-36 bg-[#F8F8F8]">
      <div className="container">
        <div className="grid md:grid-cols-2 gap-20 items-center">
          <div>
            <h2 className="font-display text-3xl sm:text-4xl mb-6">
              Curated <span className="italic">Journeys</span>
            </h2>
            <p className="text-muted-foreground mb-10 font-light tracking-wide leading-relaxed text-lg">
              From weekend escapes to extended adventures, our expertly crafted itineraries ensure every moment of
              your journey is thoughtfully planned and memorable.
            </p>
            <ul className="space-y-5">
              {[
                "Personalized itineraries based on your preferences",
                "Exclusive access to unique accommodations",
                "Insider recommendations from local experts",
                "Seamless booking for all activities",
                "Detailed travel guides and resources",
              ].map((feature, i) => (
                <li key={i} className="flex items-center gap-3 font-light">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                  {feature}
                </li>
              ))}
            </ul>
            <Button className="mt-12 px-8 rounded-full">Plan Your Journey</Button>
          </div>
          <div className="relative aspect-[4/3] rounded-xl overflow-hidden shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)]">
            <Image
              src="https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=1788&auto=format&fit=crop"
              alt="Trip planning interface"
              fill
              className="object-cover hover:scale-105 transition-transform duration-700"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export default TripSection