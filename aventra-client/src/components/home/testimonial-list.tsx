import { TestimonialsListProps } from "@/types/landing-page";
import { JSX, useMemo } from "react";
import TestimonialCard from "./testimonial-card";

/**
 * Grid display of testimonial cards
 * @param {TestimonialsListProps} props - Component properties
 * @returns {JSX.Element} Rendered component
 */
export function TestimonialsList({ 
  testimonials,
  disableAnimations 
}: TestimonialsListProps): JSX.Element {
  // Memoize the list to prevent unnecessary re-renders
  const memoizedTestimonials = useMemo(() => testimonials, [testimonials]);
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
      {memoizedTestimonials.map((testimonial, index) => (
        <TestimonialCard
          key={`${testimonial.author}-${index}`}
          quote={testimonial.quote}
          author={testimonial.author}
          role={testimonial.role}
          imageSrc={testimonial.imageSrc}
          index={index}
          color={testimonial.color}
          disableAnimations={disableAnimations}
        />
      ))}
    </div>
  );
}