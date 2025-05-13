"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { Quote, MessageSquareHeart } from "lucide-react"
import { useState } from "react"

interface TestimonialCardProps {
  quote: string;
  author: string;
  role: string;
  imageSrc: string;
  index: number;
  color: string;
}

const TestimonialCard = ({ quote, author, role, imageSrc, index, color }: TestimonialCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.15 * index }}
      viewport={{ once: true, margin: "-50px" }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group rounded-xl overflow-hidden backdrop-blur-sm border border-border shadow-sm hover:shadow-lg transition-all duration-300 p-6 relative bg-card/5"
    >
      {/* Background effects */}
      <div className={`absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${color}`}></div>
      <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-primary/5 rounded-full blur-2xl opacity-0 group-hover:opacity-60 transition-opacity duration-500"></div>
      
      <div className="relative z-10">
        {/* Quote icon */}
        <motion.div 
          animate={isHovered ? { y: -5 } : { y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-primary mb-4 flex items-center gap-1.5"
        >
          <Quote className="h-6 w-6" />
          
          {/* Decorative dots */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            className="hidden sm:block"
          >
            <div className="flex gap-1">
              {[...Array(3)].map((_, i) => (
                <div 
                  key={i} 
                  className={`h-1.5 w-1.5 rounded-full bg-primary/60 ${isHovered ? 'animate-pulse' : ''}`}
                  style={{ animationDelay: `${i * 0.2}s` }}
                ></div>
              ))}
            </div>
          </motion.div>
        </motion.div>
        
        <p className="italic text-foreground mb-6 leading-relaxed text-sm sm:text-base">&quot;{quote}&quot;</p>
        
        <div className="flex items-center gap-3 mt-auto">
          <div className="h-11 w-11 rounded-full overflow-hidden border border-border shadow-sm group-hover:shadow-md group-hover:border-primary/30 transition-all duration-300">
            <Image
              src={imageSrc}
              alt={author}
              width={44}
              height={44}
              className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
            />
          </div>
          <div>
            <h4 className="font-medium group-hover:text-primary transition-colors duration-300">{author}</h4>
            <p className="text-sm text-muted-foreground">{role}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const TestimonialsSection = () => {
  const testimonials = [
    {
      quote: "Aventra transformed our regular friend gatherings into extraordinary experiences. Their venue recommendations are consistently exceptional.",
      author: "Alexandra K.",
      role: "Social Enthusiast",
      imageSrc: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=2071&auto=format&fit=crop",
      color: "from-primary/10 to-primary/5" // Using primary color from theme
    },
    {
      quote: "Planning our family vacation was effortless and the curated activities delighted both adults and children alike.",
      author: "Marcus J.",
      role: "Family Traveler",
      imageSrc: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1887&auto=format&fit=crop",
      color: "from-primary/10 to-secondary/5" // Using primary/secondary from theme
    },
    {
      quote: "As a culinary enthusiast, I've discovered remarkable dining experiences that I would never have found otherwise.",
      author: "Sophia L.",
      role: "Gastronomy Aficionado",
      imageSrc: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1964&auto=format&fit=crop",
      color: "from-secondary/10 to-secondary/5" // Using secondary color from theme
    }
  ];

  return (
    <section id="testimonials" className="relative py-24 sm:py-28 md:py-36 overflow-hidden flex items-center justify-center">
      {/* Background with subtle gradients matching hero */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-background/95" />
        <div className="absolute top-20 -left-40 md:-left-20 h-[500px] w-[500px] bg-primary/5 rounded-full blur-[100px] opacity-60 animate-[pulse_13s_infinite]" />
        <div className="absolute bottom-0 -right-40 md:-right-20 h-[500px] w-[500px] bg-secondary/5 rounded-full blur-[100px] opacity-60 animate-[pulse_17s_infinite]" />
        <div className="absolute hidden md:block top-40 right-24 w-12 h-12 rounded-full border border-primary/20 bg-background/50 backdrop-blur-sm" />
        
        {/* Subtle grain texture for depth - matching hero */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-[url('/noise.png')] bg-repeat opacity-20"></div>
        </div>
      </div>

      <div className="container px-4 sm:px-6 md:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-14 sm:mb-20"
        >
          {/* Enhanced section label matching hero styles */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-7 flex justify-center"
          >
            <span className="px-5 py-2 rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 backdrop-blur-md border border-border text-foreground text-sm font-medium shadow-lg flex items-center gap-2">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-gradient-to-r from-primary to-secondary">
                <MessageSquareHeart className="h-3 w-3 text-primary-foreground" />
              </span>
              <span>Customer Stories</span>
            </span>
          </motion.div>
          
          <h2 className={cn(
            "font-serif text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight",
            "bg-clip-text text-transparent bg-gradient-to-br from-foreground via-foreground/90 to-foreground/80",
            "leading-[1.2] mb-4 sm:mb-6"
          )}>
            Client{" "}
            <span className="relative text-primary">
              Testimonials
              <motion.span 
                className="absolute bottom-1 left-0 w-full h-[0.12em] bg-gradient-to-r from-primary/30 via-primary/80 to-primary/30 rounded-full" 
                initial={{ scaleX: 0, originX: 0 }}
                whileInView={{ scaleX: 1 }}
                transition={{ delay: 0.4, duration: 0.7 }}
                viewport={{ once: true }}
              />
              
              {/* Subtle glow effect */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                className="absolute -inset-x-2 -inset-y-1 bg-primary/10 blur-xl rounded-full -z-10"
              />
            </span>
          </h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            viewport={{ once: true }}
            className="mt-4 text-muted-foreground max-w-2xl mx-auto font-light tracking-wide text-base sm:text-lg"
          >
            Join our community of discerning travelers and social connoisseurs who&apos;ve elevated their experiences
            with Aventra.
          </motion.p>
        </motion.div>
        
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard
                key={index}
                quote={testimonial.quote}
                author={testimonial.author}
                role={testimonial.role}
                imageSrc={testimonial.imageSrc}
                index={index}
                color={testimonial.color}
              />
            ))}
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            viewport={{ once: true }}
            className="mt-14 sm:mt-16 flex justify-center"
          >
            <div className="inline-flex items-center gap-2.5 py-2.5 px-5 rounded-full bg-gradient-to-r from-primary/10 to-secondary/10 backdrop-blur-md border border-border shadow-lg">
              <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                <motion.span 
                  animate={{ 
                    scale: [1, 1.2],
                    rotate: [0, 10]
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "easeInOut"
                  }}
                  className="text-base sm:text-lg"
                >
                  ★
                </motion.span>
              </div>
              <span className="text-xs sm:text-sm text-foreground/80">Join thousands of satisfied adventurers</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom wave decoration similar to hero */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-0 transform">
        <svg className="relative block w-full h-[30px] sm:h-[40px]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path 
            d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" 
            className="fill-background/60 dark:fill-background/40"
            opacity=".25"
          />
        </svg>
      </div>
    </section>
  )
}

export default TestimonialsSection