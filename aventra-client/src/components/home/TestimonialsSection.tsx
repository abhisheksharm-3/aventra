import TestimonialCard from "@/components/common/TestimonialCard"

const TestimonialsSection = () => {
  const testimonials = [
    {
      quote: "Aventra transformed our regular friend gatherings into extraordinary experiences. Their venue recommendations are consistently exceptional.",
      author: "Alexandra K.",
      role: "Social Enthusiast",
      imageSrc: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=2071&auto=format&fit=crop"
    },
    {
      quote: "Planning our family vacation was effortless and the curated activities delighted both adults and children alike.",
      author: "Marcus J.",
      role: "Family Traveler",
      imageSrc: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1887&auto=format&fit=crop"
    },
    {
      quote: "As a culinary enthusiast, I've discovered remarkable dining experiences that I would never have found otherwise.",
      author: "Sophia L.",
      role: "Gastronomy Aficionado",
      imageSrc: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1964&auto=format&fit=crop"
    }
  ];

  return (
    <section id="testimonials" className="py-28 md:py-36">
      <div className="container">
        <div className="text-center mb-20">
          <h2 className="font-display text-3xl sm:text-4xl">
            Client <span className="italic">Testimonials</span>
          </h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto font-light tracking-wide text-lg">
            Join our community of discerning travelers and social connoisseurs who&apos;ve elevated their experiences
            with Aventra.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard
              key={index}
              quote={testimonial.quote}
              author={testimonial.author}
              role={testimonial.role}
              imageSrc={testimonial.imageSrc}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default TestimonialsSection