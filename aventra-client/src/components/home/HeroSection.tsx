import Image from "next/image"
import { Search, MapPin, Users, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const HeroSection = () => {
  return (
    <section className="relative">
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=2070&auto=format&fit=crop"
          alt="Beautiful mountain landscape"
          fill
          className="object-cover brightness-[0.6]"
          priority
        />
      </div>
      <div className="container relative z-10 py-40 md:py-56 lg:py-64">
        <div className="mx-auto max-w-3xl text-center text-white">
          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl leading-tight">
            Curated <span className="italic">Experiences</span> for Every Occasion
          </h1>
          <p className="mt-8 text-lg md:text-xl font-light tracking-wide text-white/95 max-w-2xl mx-auto leading-relaxed">
            From intimate date nights to grand adventures, Aventra helps you discover and plan the perfect
            excursion.
          </p>
          <div className="mt-14 bg-white/10 backdrop-blur-md rounded-xl p-5 md:p-6 border border-white/20">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <MapPin className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input type="text" placeholder="Where to?" className="pl-10 bg-white/95 border-0 h-12 rounded-lg" />
              </div>
              <div className="relative flex-1">
                <Calendar className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input type="text" placeholder="When?" className="pl-10 bg-white/95 border-0 h-12 rounded-lg" />
              </div>
              <div className="relative flex-1">
                <Users className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input type="text" placeholder="Who's joining?" className="pl-10 bg-white/95 border-0 h-12 rounded-lg" />
              </div>
              <Button className="h-12 px-8 rounded-lg">
                <Search className="mr-2 h-4 w-4" />
                Explore
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 w-full h-24 bg-gradient-to-t from-[#FAFAFA] to-transparent"></div>
    </section>
  )
}

export default HeroSection