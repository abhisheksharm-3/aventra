"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Globe, ChevronRight, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Inspiration data structure
export interface InspirationItem {
  title: string;
  description: string;
  image: string;
  location?: string;
  color: string;
  featured?: boolean;
}

// Enhanced inspiration data with more stunning destinations
const defaultInspirationData: InspirationItem[] = [
  {
    title: "Cultural Immersion in Japan",
    description: "Explore ancient temples, traditional tea ceremonies, and bustling urban centers.",
    image: "https://images.unsplash.com/photo-1492571350019-22de08371fd3?q=80&w=1000",
    location: "Kyoto, Japan",
    color: "from-red-500/20 to-orange-500/20",
    featured: true
  },
  {
    title: "Northern Lights Adventure",
    description: "Chase the aurora borealis through the pristine wilderness of Scandinavia.",
    image: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?q=80&w=1000",
    location: "Tromsø, Norway",
    color: "from-blue-500/20 to-purple-500/20"
  },
  {
    title: "Mediterranean Coastal Tour",
    description: "Experience the sun-drenched beaches and historic coastal towns of the Mediterranean.",
    image: "https://images.unsplash.com/photo-1530939027401-cca9f9a790b6?q=80&w=1000",
    location: "Amalfi Coast, Italy",
    color: "from-cyan-500/20 to-blue-500/20"
  },
  {
    title: "Tropical Island Paradise",
    description: "Relax in overwater bungalows and swim in crystal-clear turquoise lagoons.",
    image: "https://images.unsplash.com/photo-1512100356356-de1b84283e18?q=80&w=1000",
    location: "Maldives",
    color: "from-emerald-500/20 to-cyan-500/20",
    featured: true
  },
  {
    title: "Safari Adventure",
    description: "Witness the spectacular Great Migration and encounter Africa's iconic wildlife.",
    image: "https://images.unsplash.com/photo-1523805009345-7448845a9e53?q=80&w=1000",
    location: "Serengeti, Tanzania",
    color: "from-amber-500/20 to-yellow-500/20"
  },
  {
    title: "Ancient Wonders",
    description: "Walk in the footsteps of ancient civilizations among spectacular ruins.",
    image: "https://images.unsplash.com/photo-1587595431973-160d0d94add1?q=80&w=1000",
    location: "Machu Picchu, Peru",
    color: "from-lime-500/20 to-emerald-500/20"
  },
  {
    title: "Alpine Retreat",
    description: "Experience breathtaking mountain vistas, pristine lakes, and charming villages.",
    image: "https://images.unsplash.com/photo-1527668752968-14dc70a27c95?q=80&w=1000",
    location: "Swiss Alps",
    color: "from-sky-500/20 to-indigo-500/20"
  },
  {
    title: "Desert Expedition",
    description: "Journey through endless golden dunes and experience magical desert nights.",
    image: "https://images.unsplash.com/photo-1509060270607-4e8fb9b29f98?q=80&w=1000",
    location: "Sahara Desert, Morocco",
    color: "from-orange-500/20 to-amber-500/20"
  },
  {
    title: "Urban Discovery",
    description: "Immerse yourself in the vibrant energy, architecture, and culture of iconic cities.",
    image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?q=80&w=1000",
    location: "New York City, USA",
    color: "from-slate-500/20 to-zinc-500/20"
  },
  {
    title: "Culinary Journey",
    description: "Savor exquisite local cuisines and learn authentic cooking techniques.",
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=1000",
    location: "Bangkok, Thailand",
    color: "from-rose-500/20 to-pink-500/20"
  },
  {
    title: "Spiritual Pilgrimage",
    description: "Find peace and enlightenment at sacred sites of profound spiritual significance.",
    image: "https://images.unsplash.com/photo-1533204515232-b7d9798c4e02?q=80&w=1000",
    location: "Varanasi, India",
    color: "from-violet-500/20 to-purple-500/20"
  },
  {
    title: "Island Hopping Adventure",
    description: "Explore a paradise of white-sand beaches, crystal waters and lush landscapes.",
    image: "https://images.unsplash.com/photo-1468746556993-d1aee1e2edc9?q=80&w=1000",
    location: "Greek Islands",
    color: "from-blue-500/20 to-cyan-500/20",
    featured: true
  }
];

interface InspirationTabProps {
  /**
   * Whether to show the full inspiration UI or a simplified placeholder
   * @default true
   */
  showFullUI?: boolean;
  
  /**
   * Custom inspiration data. If not provided, default data will be used.
   */
  inspirationData?: InspirationItem[];
  
  /**
   * Optional callback for when return to chat is clicked (for chat view)
   */
  onReturnToChat?: () => void;
  
  /**
   * Optional callback for using a template
   */
  onUseTemplate?: (template: InspirationItem) => void;
  
  /**
   * Optional callback for browsing all templates
   */
  onBrowseAll?: () => void;
}

export function InspirationTab({
  showFullUI = true,
  inspirationData = defaultInspirationData,
  onReturnToChat,
  onUseTemplate,
  onBrowseAll
}: InspirationTabProps) {
  const [activeCard, setActiveCard] = useState<number>(0);
  const currentDateTime = "2025-05-10 13:32:18";
  const currentUserLogin = "abhisheksharm-3";
  
  // Simplified placeholder view
  if (!showFullUI) {
    return (
      <div className="flex justify-center py-16">
        <div className="text-center max-w-md space-y-4">
          <Globe className="h-16 w-16 mx-auto text-muted-foreground/50" />
          <h3 className="text-xl font-medium">Travel Inspiration</h3>
          <p className="text-muted-foreground">
            Discover trending destinations and trip ideas to inspire your next adventure.
          </p>
          {onReturnToChat && (
            <div className="pt-4">
              <Button 
                variant="outline" 
                className="gap-2" 
                onClick={onReturnToChat}
              >
                <Globe className="h-4 w-4" />
                Return to Chat
              </Button>
            </div>
          )}
          <p className="text-xs text-muted-foreground pt-6">
            Updated: {currentDateTime} • {currentUserLogin}
          </p>
        </div>
      </div>
    );
  }

  // Featured destinations (show at top)
  const featuredDestinations = inspirationData.filter(item => item.featured);
  const regularDestinations = inspirationData.filter(item => !item.featured);
  
  // Full inspiration UI with cards
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      {featuredDestinations.length > 0 && (
        <>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-medium">Featured Destinations</h3>
            <Badge variant="outline" className="gap-1.5 text-xs">
              <Sparkles className="h-3 w-3 text-amber-500" />
              Trending
            </Badge>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {featuredDestinations.map((inspiration, index) => (
              <div 
                key={`featured-${index}`}
                className="relative"
                onMouseEnter={() => setActiveCard(index)}
              >
                <motion.div
                  whileHover={{ y: -5 }}
                  transition={{ type: "spring", stiffness: 500, damping: 15 }}
                >
                  <Card className="group cursor-pointer overflow-hidden border-border/40 shadow-sm h-full">
                    <div className="relative h-52 w-full overflow-hidden">
                      <Image 
                        src={inspiration.image} 
                        alt={inspiration.title} 
                        fill 
                        className="object-cover transition-transform duration-500 group-hover:scale-105" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20" />
                      <div 
                        className="absolute inset-0 bg-gradient-to-br opacity-60 group-hover:opacity-75 transition-opacity duration-300"
                        style={{ background: `linear-gradient(to bottom right, ${inspiration.color.split(' ')[1]}, ${inspiration.color.split(' ')[3]})` }}
                      />
                      
                      {inspiration.location && (
                        <div className="absolute top-3 left-3">
                          <Badge className="bg-black/50 backdrop-blur-sm text-white border-white/10 gap-1.5">
                            <MapPin className="h-3 w-3" />
                            {inspiration.location}
                          </Badge>
                        </div>
                      )}
                      
                      <div className="absolute top-3 right-3">
                        <Badge className="bg-primary/60 text-primary-foreground">Featured</Badge>
                      </div>
                    </div>
                    
                    <div className="relative p-5">
                      <h3 className="text-xl font-medium mb-2">{inspiration.title}</h3>
                      <p className="text-muted-foreground text-sm mb-4">{inspiration.description}</p>
                      
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="bg-background/50 backdrop-blur-sm">
                          Popular
                        </Badge>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 gap-1.5"
                          onClick={() => onUseTemplate?.(inspiration)}
                        >
                          Use Template
                          <ChevronRight className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
                
                {/* Active indicator */}
                {activeCard === index && (
                  <motion.div 
                    layoutId="inspirationHighlightFeatured"
                    className="absolute -inset-px rounded-lg border-2 border-primary"
                    transition={{ type: "spring", stiffness: 500, damping: 25 }}
                  />
                )}
              </div>
            ))}
          </div>
        </>
      )}

      <div className="mt-8 mb-2">
        <h3 className="text-lg font-medium">All Destinations</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {regularDestinations.map((inspiration, index) => (
          <div 
            key={index}
            className="relative"
            onMouseEnter={() => setActiveCard(index + featuredDestinations.length)}
          >
            <motion.div
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 500, damping: 15 }}
            >
              <Card className="group cursor-pointer overflow-hidden border-border/40 shadow-sm h-full">
                <div className="relative h-48 w-full overflow-hidden">
                  <Image 
                    src={inspiration.image} 
                    alt={inspiration.title} 
                    fill 
                    className="object-cover transition-transform duration-500 group-hover:scale-105" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20" />
                  <div 
                    className="absolute inset-0 bg-gradient-to-br opacity-60 group-hover:opacity-75 transition-opacity duration-300"
                    style={{ background: `linear-gradient(to bottom right, ${inspiration.color.split(' ')[1]}, ${inspiration.color.split(' ')[3]})` }}
                  />
                  
                  {inspiration.location && (
                    <div className="absolute top-3 left-3">
                      <Badge className="bg-black/50 backdrop-blur-sm text-white border-white/10 gap-1.5">
                        <MapPin className="h-3 w-3" />
                        {inspiration.location}
                      </Badge>
                    </div>
                  )}
                </div>
                
                <div className="relative p-5">
                  <h3 className="text-xl font-medium mb-2">{inspiration.title}</h3>
                  <p className="text-muted-foreground text-sm mb-4">{inspiration.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="bg-background/50 backdrop-blur-sm">
                      Trending
                    </Badge>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 gap-1.5"
                      onClick={() => onUseTemplate?.(inspiration)}
                    >
                      Use Template
                      <ChevronRight className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
            
            {/* Active indicator */}
            {activeCard === index + featuredDestinations.length && (
              <motion.div 
                layoutId="inspirationHighlightRegular"
                className="absolute -inset-px rounded-lg border-2 border-primary"
                transition={{ type: "spring", stiffness: 500, damping: 25 }}
              />
            )}
          </div>
        ))}
      </div>
      
      <div className="flex justify-center mt-10">
        <Button 
          variant="outline" 
          className="gap-2"
          onClick={onBrowseAll}
        >
          <Globe className="h-4 w-4" />
          Browse All Trip Templates
        </Button>
      </div>
      
      <div className="flex justify-end mt-2">
        <p className="text-xs text-muted-foreground">
          Last updated: {currentDateTime}
        </p>
      </div>
    </motion.div>
  );
}

// Don't forget to import the Sparkles icon at the top
import { Sparkles } from "lucide-react";