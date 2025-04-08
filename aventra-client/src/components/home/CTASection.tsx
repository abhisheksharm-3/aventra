import { Button } from "@/components/ui/button"

const CTASection = () => {
  return (
    <section id="cta" className="py-28 md:py-36 bg-primary text-primary-foreground">
      <div className="container text-center">
        <h2 className="font-display text-3xl sm:text-5xl">
          Elevate Your <span className="italic">Experiences</span>
        </h2>
        <p className="mt-8 max-w-2xl mx-auto opacity-90 font-light tracking-wide text-lg">
          Join our community of discerning adventurers and begin crafting unforgettable moments.
        </p>
        <div className="mt-14 flex flex-col sm:flex-row gap-6 justify-center">
          <Button size="lg" variant="secondary" className="px-10 rounded-full transition-all duration-300 hover:scale-105">
            Learn More
          </Button>
          <Button size="lg" variant="default" className="bg-white text-primary hover:bg-white/90 px-10 rounded-full transition-all duration-300 hover:scale-105">
            Begin Your Journey
          </Button>
        </div>
      </div>
    </section>
  )
}

export default CTASection                   