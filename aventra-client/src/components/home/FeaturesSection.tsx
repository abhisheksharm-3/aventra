"use client"

import { Compass, Users, Heart, Utensils, Calendar, MapPin } from "lucide-react"
import { motion, useScroll, useTransform } from "framer-motion"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { ReactNode, useRef, useState } from "react"

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  link: string;
  index: number;
  color: string;
}

const FeatureCard = ({ icon, title, description, link, index, color }: FeatureCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: index * 0.1, ease: "easeOut" }}
      viewport={{ once: true, margin: "-50px" }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "group relative rounded-xl overflow-hidden backdrop-blur-sm border border-border",
        "bg-card/5 hover:bg-card/10",
        "shadow-sm hover:shadow-xl transition-all duration-500",
      )}
    >
      {/* Enhanced gradient background effect with animation */}
      <div 
        className={cn(
          "absolute inset-0 transition-opacity duration-700",
          isHovered ? "opacity-100" : "opacity-0"
        )}
      >
        <motion.div 
          animate={isHovered ? {
            opacity: [0.1, 0.2],
            scale: [1, 1.05],
          } : {}}
          transition={{ 
            duration: 3, 
            repeat: Infinity, 
            repeatType: "reverse",
            type: "tween"
          }}
          className={cn(
            "absolute inset-0 blur-xl bg-gradient-to-br",
            color
          )} 
        />
      </div>
      
      {/* Animated highlight with pulse effect */}
      <motion.div 
        className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary/50 to-transparent"
        initial={{ scaleX: 0, opacity: 0 }}
        whileInView={{ scaleX: 1, opacity: 1 }}
        transition={{ duration: 0.8, delay: index * 0.1 + 0.5 }}
        viewport={{ once: true }}
      />
      
      {/* Subtle corner glow on hover */}
      <div className={cn(
        "absolute -top-10 -right-10 w-40 h-40 bg-primary/10 rounded-full blur-xl transition-opacity duration-500",
        isHovered ? "opacity-30" : "opacity-0"
      )}></div>
      
      <div className="p-6 sm:p-7 relative z-10">
        {/* Enhanced icon animation */}
        <div className="mb-5 sm:mb-6 relative">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 100, delay: index * 0.1 }}
            viewport={{ once: true }}
            animate={isHovered ? { y: -5 } : { y: 0 }}
            className={cn(
              "inline-flex p-3 sm:p-4 rounded-xl",
              "bg-gradient-to-br from-background/70 to-background/30",
              "border border-border shadow-md",
              "transform group-hover:scale-105 transition-transform duration-500"
            )}
          >
            <div className="text-primary relative">
              {icon}
              {/* Icon glow effect on hover */}
              <div className={cn(
                "absolute inset-0 bg-primary/20 blur-md rounded-full transition-opacity duration-300",
                isHovered ? "opacity-70" : "opacity-0"
              )}></div>
            </div>
          </motion.div>
          
          {/* Decorative dots */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            className="absolute top-0 right-0 hidden sm:block"
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
        </div>
        
        {/* Enhanced text animations */}
        <motion.h3 
          initial={{ x: -10, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
          viewport={{ once: true }}
          className={cn(
            "text-xl font-medium mb-2.5 transition-colors duration-500",
            "relative inline-block",
            isHovered ? "text-primary" : "text-foreground"
          )}
        >
          {title}
        </motion.h3>
        
        <motion.p 
          initial={{ x: -10, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
          viewport={{ once: true }}
          className="text-muted-foreground mb-5 line-clamp-3 text-sm sm:text-base"
        >
          {description}
        </motion.p>
        
        {/* Enhanced link animation */}
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
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className={cn(
                "ml-1 h-4 w-4 transition-all duration-300",
                "group-hover/link:translate-x-1",
                isHovered ? "animate-pulse" : ""
              )}
            >
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
  
  // Enhanced parallax effect for background blobs
  const leftBlobX = useTransform(scrollYProgress, [0, 1], [-60, -20]);
  const leftBlobY = useTransform(scrollYProgress, [0, 1], [0, -40]);
  const rightBlobX = useTransform(scrollYProgress, [0, 1], [0, 40]);
  const rightBlobY = useTransform(scrollYProgress, [0, 1], [0, 60]);
  const titleY = useTransform(scrollYProgress, [0, 0.5], [0, -20]);
  
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
      {/* Enhanced animated background elements */}
      <div className="absolute inset-0 -z-10">
        <motion.div 
          style={{ x: leftBlobX, y: leftBlobY }}
          animate={{ 
            opacity: [0.6, 0.7],
            scale: [1, 1.05],
          }}
          transition={{ 
            duration: 8, 
            repeat: Infinity, 
            repeatType: "reverse",
            type: "tween"
          }}
          className="absolute top-20 -left-40 h-[600px] w-[600px] bg-primary/5 rounded-full blur-[120px]" 
        />
        <motion.div 
          style={{ x: rightBlobX, y: rightBlobY }}
          animate={{ 
            opacity: [0.6, 0.8],
            scale: [1, 1.03],
          }}
          transition={{ 
            duration: 10, 
            repeat: Infinity, 
            repeatType: "reverse",
            delay: 2,
            type: "tween"
          }}
          className="absolute bottom-0 -right-40 h-[600px] w-[600px] bg-blue-700/5 rounded-full blur-[120px]" 
        />
        
        {/* Additional subtle background elements */}
        <motion.div
          animate={{ 
            rotate: 360
          }}
          transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/4 right-1/4 w-[800px] h-[800px] border border-primary/5 rounded-full"
        />
        
        {/* Subtle grain texture for depth - matching hero */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-[url('/noise.png')] bg-repeat opacity-20"></div>
        </div>
      </div>

      {/* Top fade from hero section */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-background to-transparent -mt-32 z-10 pointer-events-none" />

      <div className="container px-4 sm:px-6 md:px-8 w-full mx-auto relative z-10">
        <motion.div 
          style={{ y: titleY }}
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
            <span className="px-5 py-2 rounded-full bg-gradient-to-r from-purple-500/20 to-blue-600/20 backdrop-blur-md border border-border text-foreground/90 text-sm font-medium shadow-lg flex items-center gap-2">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-gradient-to-r from-purple-500 to-blue-600">
                <Compass className="h-3 w-3 text-primary-foreground" />
              </span>
              <span>Tailored Experiences</span>
            </span>
          </motion.div>
          
          <h2 className={cn(
            "font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight",
            "bg-clip-text text-transparent bg-gradient-to-br from-foreground via-foreground/90 to-foreground/80",
            "leading-[1.1] mb-4"
          )}>
            Discover Your Next{" "}
            <span className="relative inline-block text-primary">
              Adventure
              <motion.span 
                className="absolute bottom-0 left-0 w-full h-[0.12em] bg-gradient-to-r from-primary/30 via-primary/80 to-primary/30 rounded-full" 
                initial={{ scaleX: 0, originX: 0 }}
                whileInView={{ scaleX: 1 }}
                transition={{ delay: 0.6, duration: 0.9 }}
                viewport={{ once: true }}
              />
              
              {/* Subtle glow effect */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 1, duration: 0.5 }}
                className="absolute -inset-x-2 -inset-y-1 bg-primary/10 blur-xl rounded-full -z-10"
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
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="inline-flex items-center gap-2.5 py-2.5 px-5 rounded-full bg-gradient-to-r from-purple-500/10 to-blue-600/10 backdrop-blur-md border border-border shadow-lg"
          >
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
                  ease: "easeInOut",
                  type: "tween"
                }}
                className="text-base sm:text-lg"
              >
                ✨
              </motion.span>
            </div>
            <span className="text-sm sm:text-base text-foreground/90">Personalized for your interests and style</span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

export default FeaturesSection