"use client"

import { Compass, Users, Heart, Utensils, Calendar, MapPin } from "lucide-react"
import { motion, useScroll, useTransform } from "framer-motion"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { ReactNode, useRef } from "react"

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  link: string;
  index: number;
  color: string;
}

const FeatureCard = ({ icon, title, description, link, index, color }: FeatureCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: index * 0.1, ease: "easeOut" }}
      viewport={{ once: true, margin: "-50px" }}
      className={cn(
        "group relative rounded-xl overflow-hidden backdrop-blur-sm border border-white/10",
        "bg-black/5 hover:bg-black/10 dark:bg-white/5 dark:hover:bg-white/10",
        "shadow-sm hover:shadow-lg transition-all duration-500",
      )}
    >
      {/* Gradient background effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
        <div className={cn(
          "absolute inset-0 blur-xl bg-gradient-to-br opacity-20",
          color
        )} />
      </div>
      
      {/* Animated highlight */}
      <motion.div 
        className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary/50 to-transparent"
        initial={{ scaleX: 0, opacity: 0 }}
        whileInView={{ scaleX: 1, opacity: 1 }}
        transition={{ duration: 0.8, delay: index * 0.1 + 0.5 }}
        viewport={{ once: true }}
      />
      
      <div className="p-6 sm:p-7 relative z-10">
        <div className="mb-5 sm:mb-6 transform group-hover:scale-105 transition-transform duration-500">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 100, delay: index * 0.1 }}
            viewport={{ once: true }}
            className={cn(
              "inline-flex p-3 sm:p-4 rounded-xl",
              "bg-gradient-to-br from-background/70 to-background/30",
              "border border-white/10 shadow-md"
            )}
          >
            <div className="text-primary">
              {icon}
            </div>
          </motion.div>
        </div>
        
        <motion.h3 
          initial={{ x: -10, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
          viewport={{ once: true }}
          className="text-xl font-medium mb-2.5 group-hover:text-primary transition-colors duration-500"
        >
          {title}
        </motion.h3>
        
        <motion.p 
          initial={{ x: -10, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
          viewport={{ once: true }}
          className="text-muted-foreground/90 mb-5 line-clamp-3 text-sm sm:text-base"
        >
          {description}
        </motion.p>
        
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: index * 0.1 + 0.4 }}
          viewport={{ once: true }}
        >
          <Link 
            href={link} 
            className="inline-flex items-center text-primary hover:text-primary/80 font-medium group/link"
          >
            <span className="group-hover/link:translate-x-1 transition-transform duration-300">Explore</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1 h-4 w-4 group-hover/link:translate-x-1 transition-transform duration-300">
              <path d="M5 12h14"></path>
              <path d="m12 5 7 7-7 7"></path>
            </svg>
          </Link>
        </motion.div>
      </div>
    </motion.div>
  )
}

interface FeatureType {
  icon: ReactNode;
  title: string;
  description: string;
  link: string;
  color: string;
}

const FeaturesSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });
  
  // Parallax effect for background blobs
  const leftBlobX = useTransform(scrollYProgress, [0, 1], [-60, -20]);
  const rightBlobX = useTransform(scrollYProgress, [0, 1], [0, 40]);
  
  // Gradient feature colors to match the destination colors in Hero
  const features: FeatureType[] = [
    {
      icon: <Compass className="h-8 w-8 sm:h-10 sm:w-10" />,
      title: "Trip Planning",
      description: "Craft the perfect getaway with personalized itineraries and unique experiences tailored just for you.",
      link: "#trips",
      color: "from-teal-500/40 to-cyan-500/40" // Singapore color
    },
    {
      icon: <Users className="h-8 w-8 sm:h-10 sm:w-10" />,
      title: "Friends Night Out",
      description: "Discover trending venues and activities for memorable evenings with friends in the city's hottest spots.",
      link: "#nights-out",
      color: "from-purple-500/40 to-fuchsia-500/40" // Seoul color
    },
    {
      icon: <Heart className="h-8 w-8 sm:h-10 sm:w-10" />,
      title: "Date Night",
      description: "Curated romantic experiences to create special moments with your partner in breathtaking settings.",
      link: "#dates",
      color: "from-rose-500/40 to-orange-500/40" // Kyoto color
    },
    {
      icon: <Utensils className="h-8 w-8 sm:h-10 sm:w-10" />,
      title: "Fine Dining",
      description: "Explore exceptional culinary experiences from hidden gems to acclaimed restaurants with signature dishes.",
      link: "#dining",
      color: "from-amber-500/40 to-yellow-500/40" // Bangkok color
    },
    {
      icon: <Calendar className="h-8 w-8 sm:h-10 sm:w-10" />,
      title: "Family Outings",
      description: "Age-appropriate activities and adventures the whole family will enjoy, creating memories that last forever.",
      link: "#family",
      color: "from-emerald-500/40 to-teal-500/40" // Bali color
    },
    {
      icon: <MapPin className="h-8 w-8 sm:h-10 sm:w-10" />,
      title: "Local Experiences",
      description: "Authentic local activities that showcase the best of your destination, curated by regional experts.",
      link: "#local",
      color: "from-blue-600/40 to-sky-400/40" // Istanbul color
    }
  ];

  return (
    <section 
      ref={sectionRef}
      id="features" 
      className="relative py-20 sm:py-24 md:py-28 lg:py-36 overflow-hidden bg-gradient-to-b from-background to-background/95"
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 -z-10">
        <motion.div 
          style={{ x: leftBlobX }}
          className="absolute top-20 -left-40 h-[600px] w-[600px] bg-primary/5 rounded-full blur-[120px] opacity-70" 
        />
        <motion.div 
          style={{ x: rightBlobX }}
          className="absolute bottom-0 -right-40 h-[600px] w-[600px] bg-blue-700/5 rounded-full blur-[120px] opacity-70" 
        />
        
        {/* Subtle grain texture for depth - matching hero */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[url('/noise.png')] bg-repeat opacity-20"></div>
        </div>
      </div>

      {/* Top fade from hero section */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black to-transparent -mt-32 z-10 pointer-events-none" />

      <div className="container px-4 sm:px-6 md:px-8 w-full mx-auto relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-16 sm:mb-20 md:mb-24"
        >
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-8 inline-flex"
          >
            <span className="px-4 py-2 rounded-full bg-black/30 backdrop-blur-md border border-white/10 text-white/90 text-sm font-medium shadow-lg">
              Tailored Experiences
            </span>
          </motion.div>
          
          <h2 className={cn(
            "font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight",
            "bg-clip-text text-transparent bg-gradient-to-br from-foreground via-foreground/90 to-foreground/80",
            "leading-[1.1] mb-4"
          )}>
            Discover Your Next{" "}
            <span className="relative text-primary">
              Adventure
              <motion.span 
                className="absolute bottom-0 left-0 w-full h-[0.12em] bg-primary/60 rounded-full" 
                initial={{ scaleX: 0, originX: 0 }}
                whileInView={{ scaleX: 1 }}
                transition={{ delay: 0.6, duration: 0.9 }}
                viewport={{ once: true }}
              />
            </span>
          </h2>
          
          <motion.p 
            className="mt-4 sm:mt-6 text-muted-foreground max-w-2xl mx-auto tracking-wide text-lg sm:text-xl md:text-2xl font-light"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.4, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            Aventra offers a curated selection of experiences for every occasion, from weekend getaways to spontaneous
            dinner plans.
          </motion.p>
        </motion.div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-7 lg:gap-8"
          >
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                link={feature.link}
                index={index}
                color={feature.color}
              />
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.7 }}
          viewport={{ once: true }}
          className="mt-16 sm:mt-20 flex justify-center"
        >
          <div className="inline-flex items-center gap-2.5 py-2.5 px-5 rounded-full bg-black/20 dark:bg-white/10 backdrop-blur-md border border-white/10 shadow-lg">
            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-primary/20 flex items-center justify-center text-primary">
              <span className="text-base sm:text-lg">✨</span>
            </div>
            <span className="text-sm sm:text-base text-white/90">Personalized for your interests and style</span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default FeaturesSection