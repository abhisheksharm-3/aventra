"use client"

import { Compass, Users, Heart, Utensils, Calendar, MapPin } from "lucide-react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { ReactNode } from "react"

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  link: string;
  index: number;
}

const FeatureCard = ({ icon, title, description, link, index }: FeatureCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true, margin: "-50px" }}
      className="group relative rounded-xl overflow-hidden bg-background/50 backdrop-blur-sm border border-border/40 shadow-sm hover:shadow-md transition-all duration-300"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background/0 to-background/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      <div className="absolute -bottom-1.5 -right-1.5 w-24 h-24 bg-primary/5 rounded-full blur-2xl opacity-0 group-hover:opacity-70 transition-opacity duration-500"></div>
      
      <div className="p-5 sm:p-6 relative z-10">
        <div className="mb-4 sm:mb-5 inline-flex p-2.5 sm:p-3 rounded-xl bg-background/80 border border-border/30 shadow-sm">
          <div className="text-primary">
            {icon}
          </div>
        </div>
        
        <h3 className="text-xl font-medium mb-2 group-hover:text-primary/90 transition-colors duration-300">{title}</h3>
        
        <p className="text-muted-foreground mb-4 sm:mb-5 line-clamp-3 text-sm sm:text-base">{description}</p>
        
        <Link href={link} className="inline-flex items-center text-primary hover:text-primary/80 font-medium">
          <span className="group-hover:translate-x-1 transition-transform duration-300">Explore</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300">
            <path d="M5 12h14"></path>
            <path d="m12 5 7 7-7 7"></path>
          </svg>
        </Link>
      </div>
    </motion.div>
  )
}

interface FeatureType {
  icon: ReactNode;
  title: string;
  description: string;
  link: string;
}

const FeaturesSection = () => {
  const features: FeatureType[] = [
    {
      icon: <Compass className="h-8 w-8 sm:h-10 sm:w-10" />,
      title: "Trip Planning",
      description: "Craft the perfect getaway with personalized itineraries and unique experiences.",
      link: "#trips"
    },
    {
      icon: <Users className="h-8 w-8 sm:h-10 sm:w-10" />,
      title: "Friends Night Out",
      description: "Discover trending venues and activities for memorable evenings with friends.",
      link: "#nights-out"
    },
    {
      icon: <Heart className="h-8 w-8 sm:h-10 sm:w-10" />,
      title: "Date Night",
      description: "Curated romantic experiences to create special moments with your partner.",
      link: "#dates"
    },
    {
      icon: <Utensils className="h-8 w-8 sm:h-10 sm:w-10" />,
      title: "Fine Dining",
      description: "Explore exceptional culinary experiences from hidden gems to acclaimed restaurants.",
      link: "#dining"
    },
    {
      icon: <Calendar className="h-8 w-8 sm:h-10 sm:w-10" />,
      title: "Family Outings",
      description: "Age-appropriate activities and adventures the whole family will enjoy.",
      link: "#family"
    },
    {
      icon: <MapPin className="h-8 w-8 sm:h-10 sm:w-10" />,
      title: "Local Experiences",
      description: "Authentic local activities that showcase the best of your destination.",
      link: "#local"
    }
  ];

  return (
    <section id="features" className="relative py-20 sm:py-24 md:py-28 lg:py-36 overflow-hidden">
      {/* Background effects matching hero section */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 -left-40 md:-left-20 h-[500px] w-[500px] bg-primary/5 rounded-full blur-[100px] opacity-60 animate-[pulse_10s_infinite]" />
        <div className="absolute bottom-0 -right-40 md:-right-20 h-[500px] w-[500px] bg-blue-700/5 rounded-full blur-[100px] opacity-60 animate-[pulse_14s_infinite]" />
      </div>

      <div className="container px-4 sm:px-6 md:px-8 w-full mx-auto ">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-12 sm:mb-16 md:mb-20"
        >
          <h2 className={cn(
            "font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-medium tracking-tight",
            "bg-clip-text text-transparent bg-gradient-to-br from-foreground via-foreground/90 to-foreground/80",
            "leading-[1.2] mb-3 sm:mb-4"
          )}>
            Discover Your Next{" "}
            <span className="relative text-primary/70">
              Adventure
              <motion.span 
                className="absolute bottom-1 left-0 w-full h-[0.12em] bg-primary/60 rounded-full" 
                initial={{ scaleX: 0, originX: 0 }}
                whileInView={{ scaleX: 1 }}
                transition={{ delay: 0.3, duration: 0.7 }}
                viewport={{ once: true }}
              />
            </span>
          </h2>
          <motion.p 
            className="mt-3 sm:mt-4 text-muted-foreground max-w-2xl mx-auto font-light tracking-wide text-base sm:text-lg md:text-xl"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
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
            transition={{ duration: 0.5 }}
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 lg:gap-8"
          >
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                link={feature.link}
                index={index}
              />
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          viewport={{ once: true }}
          className="mt-12 sm:mt-16 flex justify-center"
        >
          <div className="inline-flex items-center gap-2 py-2 px-4 rounded-full bg-background/90 border border-border/30 shadow-sm">
            <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <span className="text-sm sm:text-base">✨</span>
            </div>
            <span className="text-xs sm:text-sm">Personalized for your interests</span>
          </div>
        </motion.div>
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

export default FeaturesSection