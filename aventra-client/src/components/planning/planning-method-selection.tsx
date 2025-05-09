import { useState } from "react";
import { motion} from "framer-motion";
import { 
  MessageSquare, ClipboardList, ArrowRight, Sparkles, 
  MapPin, Compass, Calendar, Users, Star, ChevronRight,
  Globe, Plane, Sun, Moon
} from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PlanningMethodSelectionProps {
  onSelectMethod: (method: "chat" | "form") => void;
}

export default function PlanningMethodSelection({ onSelectMethod }: PlanningMethodSelectionProps) {
  const [hoveredCard, setHoveredCard] = useState<"chat" | "form" | null>(null);
  const [highlightedFeature, setHighlightedFeature] = useState<number | null>(null);
  
  // Current time for the header (May 2025)
  const currentDate = new Date("2025-05-09T12:57:52").toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  return (
    <div className="max-w-7xl mx-auto relative">
      {/* Ambient background elements */}
      <div className="absolute inset-0 pointer-events-none -z-10">
        <div className="absolute top-10 left-[10%] w-[300px] h-[300px] rounded-full bg-primary/10 blur-[120px]"></div>
        <div className="absolute top-40 right-[5%] w-[250px] h-[250px] rounded-full bg-blue-500/10 blur-[100px]"></div>
        <div className="absolute bottom-20 left-[20%] w-[350px] h-[350px] rounded-full bg-amber-500/5 blur-[150px]"></div>
        <div className="absolute -bottom-10 right-[30%] w-[200px] h-[200px] rounded-full bg-emerald-500/5 blur-[80px]"></div>
      </div>
      
      {/* Inspirational header with time-based greeting */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="text-center mb-8 md:mb-16"
      >
        <div className="flex items-center justify-center gap-2 mb-4">
          <span className="text-sm text-muted-foreground">{currentDate}</span>
          <span className="h-1 w-1 rounded-full bg-muted-foreground"></span>
          <span className="text-sm text-muted-foreground">Let&apos;s create your journey</span>
        </div>
        
        <h2 className="text-3xl md:text-5xl font-serif font-medium mb-4 leading-tight">
          Choose Your <span className="text-primary">Planning Style</span>
        </h2>
        
        <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
          Different travelers have different planning styles. Select the approach that feels right for you.
        </p>
      </motion.div>
      
      {/* Method cards - completely redesigned */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
        {/* Chat-based Method - Premium Card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="lg:col-span-6"
          onMouseEnter={() => setHoveredCard("chat")}
          onMouseLeave={() => setHoveredCard(null)}
        >
          <div
            onClick={() => onSelectMethod("chat")}
            className={cn(
              "h-full rounded-3xl overflow-hidden cursor-pointer group transition-all duration-500",
              "bg-gradient-to-br from-zinc-900 to-zinc-800 border border-zinc-800/50",
              "hover:shadow-2xl hover:shadow-primary/20 hover:border-zinc-700/50",
              "relative"
            )}
          >
            {/* Day/night atmosphere effect */}
            <div className="absolute inset-0 opacity-30">
              <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-blue-500/20 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-indigo-900/30 to-transparent"></div>
              
              {/* Animated stars/particles */}
              <div className="stars absolute inset-0 opacity-70">
                {[...Array(20)].map((_, i) => (
                  <div 
                    key={i}
                    className="star absolute w-[2px] h-[2px] bg-white rounded-full animate-pulse"
                    style={{
                      top: `${Math.random() * 100}%`,
                      left: `${Math.random() * 100}%`,
                      animationDelay: `${Math.random() * 5}s`,
                      animationDuration: `${3 + Math.random() * 3}s`
                    }}
                  ></div>
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="relative p-8 md:p-10 h-full flex flex-col">
              {/* Top section with badge */}
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/20 backdrop-blur-md flex items-center justify-center">
                    <MessageSquare className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-white">Conversational</h3>
                    <p className="text-zinc-400 text-sm">AI Chat Interface</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md">
                  <Star className="h-3.5 w-3.5 fill-amber-300 text-amber-300" />
                  <span className="text-white text-xs">Popular Choice</span>
                </div>
              </div>
              
              {/* Main title and visual */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <h3 className="text-3xl font-serif font-medium text-white mb-4 leading-tight">
                    Chat with Our AI Travel Agent
                  </h3>
                  <p className="text-zinc-300 mb-6">
                    A natural conversation with our AI to build your perfect itinerary. Just describe what you&apos;re looking for.
                  </p>
                </div>
                
                <div className="relative">
                  <div className="relative h-48 w-full rounded-xl overflow-hidden">
                    <Image
                      src="https://images.unsplash.com/photo-1496939376851-89342e90adcd"
                      alt="Chat interface"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/10"></div>
                    
                    {/* Sample chat bubbles */}
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="flex flex-col gap-2">
                        <div className="flex justify-end">
                          <div className="bg-primary text-white px-3 py-2 rounded-lg rounded-tr-none text-xs max-w-[80%]">
                            I&apos;d like to visit Japan in cherry blossom season
                          </div>
                        </div>
                        <div className="flex justify-start">
                          <div className="bg-white/20 backdrop-blur-md text-white px-3 py-2 rounded-lg rounded-tl-none text-xs max-w-[80%]">
                            Great choice! Cherry blossom season in Japan typically runs from late March to early April...
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Features grid */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                {[
                  { icon: Sun, label: "Share your preferences naturally" },
                  { icon: Globe, label: "Explore unlimited destinations" },
                  { icon: Calendar, label: "Ask any travel question" },
                  { icon: Users, label: "Get personalized suggestions" }
                ].map((feature, i) => (
                  <motion.div
                    key={i}
                    onMouseEnter={() => setHighlightedFeature(i)}
                    onMouseLeave={() => setHighlightedFeature(null)}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-xl transition-all duration-300",
                      highlightedFeature === i && hoveredCard === "chat" ? "bg-white/10" : "bg-transparent"
                    )}
                  >
                    <div className="h-8 w-8 rounded-lg bg-zinc-800 flex items-center justify-center">
                      <feature.icon className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-white text-sm">{feature.label}</span>
                  </motion.div>
                ))}
              </div>
              
              {/* CTA button */}
              <div className="mt-auto">
                <Button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectMethod("chat");
                  }}
                  size="lg"
                  className="w-full bg-primary hover:bg-primary/90 text-white font-medium rounded-xl group relative overflow-hidden shadow-glow-md h-14"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>
                  <span className="relative z-10 flex items-center justify-center gap-2 text-base">
                    Start Conversation
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Button>
                
                <div className="flex items-center justify-center gap-1.5 mt-4">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                  <span className="text-zinc-400 text-xs">Suggested for first-time travelers</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* Form-based Method - Premium Card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="lg:col-span-6"
          onMouseEnter={() => setHoveredCard("form")}
          onMouseLeave={() => setHoveredCard(null)}
        >
          <div
            onClick={() => onSelectMethod("form")}
            className={cn(
              "h-full rounded-3xl overflow-hidden cursor-pointer group transition-all duration-500",
              "bg-white dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700/50",
              "hover:shadow-2xl hover:shadow-blue-500/10 hover:border-zinc-200 dark:hover:border-zinc-600/50",
              "relative"
            )}
          >
            {/* Elegant design elements */}
            <div className="absolute inset-0">
              {/* Grid pattern */}
              <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] dark:opacity-[0.05]"></div>
              
              {/* Gradient accents */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl"></div>
            </div>

            {/* Content */}
            <div className="relative p-8 md:p-10 h-full flex flex-col">
              {/* Top section with badge */}
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-blue-500/10 backdrop-blur-md flex items-center justify-center">
                    <ClipboardList className="h-5 w-5 text-blue-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium dark:text-white">Structured</h3>
                    <p className="text-zinc-500 dark:text-zinc-400 text-sm">Step-by-Step Form</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/20 backdrop-blur-md">
                  <Compass className="h-3.5 w-3.5 text-blue-500" />
                  <span className="text-blue-700 dark:text-blue-300 text-xs">Detailed Planning</span>
                </div>
              </div>
              
              {/* Main title and visual */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <h3 className="text-3xl font-serif font-medium text-zinc-900 dark:text-white mb-4 leading-tight">
                    Use Our Guided Form Builder
                  </h3>
                  <p className="text-zinc-600 dark:text-zinc-300 mb-6">
                    Fill in your travel preferences step-by-step and let our AI create a tailored itinerary just for you.
                  </p>
                </div>
                
                <div className="relative">
                  <div className="relative h-48 w-full rounded-xl overflow-hidden shadow-lg">
                    <Image
                      src="https://images.unsplash.com/photo-1524413840807-0c3cb6fa808d"
                      alt="Form interface"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/10"></div>
                    
                    {/* Form UI preview elements */}
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="space-y-2">
                        <div className="bg-white/90 backdrop-blur-md p-2 rounded-lg shadow-sm">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-3 w-3 text-blue-600" />
                            <div className="h-2.5 w-24 bg-blue-200 rounded-full"></div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <div className="bg-white/90 backdrop-blur-md p-2 rounded-lg shadow-sm flex-1">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-3 w-3 text-blue-600" />
                              <div className="h-2.5 w-12 bg-blue-200 rounded-full"></div>
                            </div>
                          </div>
                          <div className="bg-white/90 backdrop-blur-md p-2 rounded-lg shadow-sm flex-1">
                            <div className="flex items-center gap-2">
                              <Users className="h-3 w-3 text-blue-600" />
                              <div className="h-2.5 w-8 bg-blue-200 rounded-full"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Features grid */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                {[
                  { icon: ClipboardList, label: "Structured step-by-step process" },
                  { icon: Moon, label: "Specific preferences & requirements" },
                  { icon: Calendar, label: "Day-by-day itinerary planning" },
                  { icon: Plane, label: "Comprehensive travel details" }
                ].map((feature, i) => (
                  <motion.div
                    key={i}
                    onMouseEnter={() => setHighlightedFeature(i)}
                    onMouseLeave={() => setHighlightedFeature(null)}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-xl transition-all duration-300",
                      highlightedFeature === i && hoveredCard === "form" ? "bg-blue-50 dark:bg-blue-900/20" : "bg-transparent"
                    )}
                  >
                    <div className="h-8 w-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                      <feature.icon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <span className="text-zinc-700 dark:text-zinc-200 text-sm">{feature.label}</span>
                  </motion.div>
                ))}
              </div>
              
              {/* CTA button */}
              <div className="mt-auto">
                <Button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectMethod("form");
                  }}
                  size="lg"
                  variant="outline"
                  className="w-full border-blue-500 text-blue-600 dark:text-blue-400 font-medium rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20 group relative overflow-hidden h-14"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-100 dark:via-blue-500/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>
                  <span className="relative z-10 flex items-center justify-center gap-2 text-base">
                    Start Form Process
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Button>
                
                <div className="flex items-center justify-center gap-1.5 mt-4">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                  <span className="text-zinc-500 dark:text-zinc-400 text-xs">Perfect for detailed planners</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Testimonial or confidence-building element */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.5 }}
        className="relative"
      >
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-px bg-gradient-to-r from-transparent via-border to-transparent"></div>
        
        <div className="flex justify-center">
          <div className="bg-background/80 backdrop-blur-sm px-8 py-4 rounded-full border border-border/30 shadow-sm flex items-center gap-4">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-primary" />
            </div>
            
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Both methods use our advanced AI to create personalized travel experiences.
                <span className="hidden md:inline"> Select the one that matches your planning style.</span>
              </p>
            </div>
            
            <div className="hidden md:flex items-center">
              <Button variant="ghost" size="sm" className="gap-1.5 text-primary">
                Learn more <ChevronRight className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}