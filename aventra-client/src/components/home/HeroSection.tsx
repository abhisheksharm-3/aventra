"use client"

import { useState, useRef, useEffect, MouseEvent, FormEvent, ReactNode } from "react"
import { Search, MapPin, Calendar, Users, ArrowRight, Sparkles, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"

interface SearchSuggestionProps {
  suggestion: string;
  onClick: () => void;
}

const SearchSuggestion = ({ suggestion, onClick }: SearchSuggestionProps) => (
  <button
    className="flex items-center w-full px-4 py-2.5 text-left rounded-lg hover:bg-primary/10 transition-colors"
    onClick={onClick}
  >
    <Search className="h-4 w-4 mr-2 text-muted-foreground flex-shrink-0" />
    <span className="truncate">{suggestion}</span>
  </button>
)

interface FilterButtonProps {
  icon: ReactNode;
  label: string;
  isSelected: boolean;
  onClick: () => void;
}

const FilterButton = ({ icon, label, isSelected, onClick }: FilterButtonProps) => (
  <Button 
    variant="outline" 
    size="sm" 
    className={cn(
      "rounded-full bg-background/80 border-border/40 hover:bg-accent/60 px-3 sm:px-4",
      isSelected && "bg-primary/20 border-primary/30"
    )}
    onClick={onClick}
  >
    <span className="mr-1">{icon}</span>
    <span className="hidden xs:inline">{label}</span>
  </Button>
)

interface TrendingItemProps {
  icon: string;
  name: string;
  onClick: () => void;
}

const TrendingItem = ({ icon, name, onClick }: TrendingItemProps) => (
  <Button 
    variant="ghost" 
    size="sm" 
    className="rounded-full hover:bg-accent/60 text-sm flex items-center gap-1"
    onClick={onClick}
  >
    <span className="text-base mr-0.5">{icon}</span>
    <span className="truncate">{name}</span>
  </Button>
)

interface DestinationCardProps {
  name: string;
  country: string;
  image: string;
}

const DestinationCard = ({ name, country, image }: DestinationCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 15 }}
    animate={{ opacity: 1, y: 0 }}
    className="group relative rounded-xl overflow-hidden h-[160px] cursor-pointer"
  >
    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10" />
    <div className="absolute inset-0 bg-primary/40 opacity-0 group-hover:opacity-100 transition-opacity z-10" />
    <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
      <p className="text-white font-medium text-lg">{name}</p>
      <p className="text-white/80 text-sm">{country}</p>
    </div>
    <div className="absolute top-0 right-0 p-2 z-20">
      <div className="bg-background/80 backdrop-blur-sm p-1 rounded-md opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all">
        <ArrowRight className="h-4 w-4" />
      </div>
    </div>
    <div className="w-full h-full overflow-hidden">
      <div className="w-full h-full bg-muted/30 animate-pulse" />
      <Image 
        src={image}
        alt={`${name}, ${country}`}
        fill
        sizes="(max-width: 768px) 100vw, 33vw"
        className="object-cover transition-transform duration-500 group-hover:scale-110"
        loading="eager"
        priority={true}
      />
    </div>
  </motion.div>
)

const Background = () => (
  <div className="absolute inset-0 -z-10">
    <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background" />
    <div className="absolute top-0 -left-40 md:-left-20 h-[500px] w-[500px] bg-primary/10 rounded-full blur-[100px] opacity-70 animate-[pulse_8s_infinite]" />
    <div className="absolute bottom-0 -right-40 md:-right-20 h-[500px] w-[500px] bg-blue-700/10 rounded-full blur-[100px] opacity-70 animate-[pulse_12s_infinite]" />
    <div className="absolute hidden md:block top-20 left-20 w-8 h-8 rounded-full border border-primary/20 bg-background/50 backdrop-blur-sm" />
    <div className="absolute hidden md:block bottom-32 right-24 w-12 h-12 rounded-full border border-primary/20 bg-background/50 backdrop-blur-sm" />
    <div className="absolute hidden md:block top-40 right-32 w-6 h-6 rounded-full bg-primary/10" />
  </div>
)

const WaveDecoration = () => (
  <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-0 transform">
    <svg className="relative block w-full h-[60px]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
      <path 
        d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z" 
        className="fill-background/30 dark:fill-background/20"
      />
    </svg>
    <svg className="relative block w-full h-[40px] -mt-[30px]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
      <path 
        d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" 
        className="fill-background/60 dark:fill-background/40"
        opacity=".25"
      />
    </svg>
    <svg className="relative block w-full h-[40px] -mt-[25px]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
      <path 
        d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" 
        className="fill-background dark:fill-background"
        opacity=".5"
      />
    </svg>
  </div>
)

const Headline = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.7 }}
    className="text-center"
  >
    <h1 className={cn(
      "font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-medium tracking-tight",
      "bg-clip-text text-transparent bg-gradient-to-br from-foreground via-foreground/90 to-foreground/80",
      "leading-[1.1] mb-6"
    )}>
      Discover{" "}
      <span className="relative text-primary/60">
        Extraordinary
        <motion.span 
          className="absolute bottom-1 left-0 w-full h-[0.15em] bg-primary/60 rounded-full" 
          initial={{ scaleX: 0, originX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.8, duration: 0.7 }}
        />
      </span>
      {" "}Experiences
    </h1>
    <motion.p 
      className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-8 sm:mb-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.7, delay: 0.3 }}
    >
      Expertly curated travel itineraries with transportation, accommodations, 
      dining, and activities for your perfect adventure.
    </motion.p>
  </motion.div>
)

interface SearchBoxProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isFocused: boolean;
  setIsFocused: (focused: boolean) => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
  suggestions: string[];
  handleSearch: (e: FormEvent) => void;
  selectedCategory: string | null;
  setSelectedCategory: React.Dispatch<React.SetStateAction<string | null>>;
}

const SearchBox = ({ 
  searchQuery, 
  setSearchQuery, 
  isFocused, 
  setIsFocused, 
  inputRef, 
  suggestions, 
  handleSearch, 
  selectedCategory, 
  setSelectedCategory 
}: SearchBoxProps) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.7, delay: 0.4 }}
    className="w-full max-w-3xl relative"
  >
    <form 
      onSubmit={handleSearch}
      className="relative group"
      aria-label="Search experiences"
    >
      <div className="relative flex items-center rounded-xl overflow-hidden shadow-lg">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-background to-background/90 backdrop-blur-md" />
        <div className="relative w-full flex bg-transparent">
          <div className="p-4 pl-5 text-muted-foreground">
            <Search className="h-5 w-5" />
          </div>
          <Input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            placeholder="Where would you like to go?"
            className="flex-1 h-14 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-base"
            aria-label="Search destinations"
            aria-expanded={isFocused}
          />
          <div className="flex items-center">
            <div className="h-6 w-px bg-border/40 mx-1 hidden sm:block"></div>
            <Button 
              type="submit" 
              size="sm"
              className="m-1.5 h-11 px-3 sm:px-4 rounded-lg text-sm font-medium gap-1.5 group-hover:bg-primary/90 transition-all"
            >
              <Sparkles className="h-3.5 w-3.5 opacity-70" />
              <span className="hidden xs:inline">Explore</span>
            </Button>
          </div>
        </div>
      </div>
    </form>

    <AnimatePresence>
      {isFocused && suggestions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="absolute z-20 w-full mt-2 rounded-xl overflow-hidden shadow-lg border border-border/30 bg-background/95 backdrop-blur-md"
        >
          <div className="p-1">
            {suggestions.map((suggestion, index) => (
              <SearchSuggestion
                key={index}
                suggestion={suggestion}
                onClick={() => {
                  setSearchQuery(suggestion)
                  setIsFocused(false)
                }}
              />
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>

    <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2 mt-4">
      <FilterButton
        icon={<MapPin className="h-3.5 w-3.5" />}
        label="Location"
        isSelected={selectedCategory === "location"}
        onClick={() => setSelectedCategory((prev) => prev === "location" ? null : "location")}
      />
      <FilterButton
        icon={<Calendar className="h-3.5 w-3.5" />}
        label="Dates"
        isSelected={selectedCategory === "dates"}
        onClick={() => setSelectedCategory((prev) => prev === "dates" ? null : "dates")}
      />
      <FilterButton
        icon={<Users className="h-3.5 w-3.5" />}
        label="Group Size"
        isSelected={selectedCategory === "group"}
        onClick={() => setSelectedCategory((prev) => prev === "group" ? null : "group")}
      />
      <FilterButton
        icon={<Globe className="h-3.5 w-3.5" />}
        label="Global"
        isSelected={selectedCategory === "global"}
        onClick={() => setSelectedCategory((prev) => prev === "global" ? null : "global")}
      />
    </div>
  </motion.div>
)

export default function HeroSection() {
  const [searchQuery, setSearchQuery] = useState<string>("")
    const [isFocused, setIsFocused] = useState<boolean>(false)
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
    const inputRef = useRef<HTMLInputElement | null>(null)
  
  const suggestions: string[] = searchQuery ? [
    `${searchQuery} in Europe`,
    `Best ${searchQuery} adventures`,
    `${searchQuery} for beginners`,
    `Affordable ${searchQuery} experiences`
  ] : []

  const handleSearch = (e: FormEvent) => {
    e.preventDefault()
    console.log("Search submitted:", searchQuery, "Category:", selectedCategory)
  }

  const trendingExperiences: Array<{ name: string; icon: string }> = [
    { name: "Beach Getaways", icon: "🏝️" },
    { name: "City Tours", icon: "🏙️" },
    { name: "Hiking Adventures", icon: "🥾" },
    { name: "Cooking Classes", icon: "👨‍🍳" },
    { name: "Wine Tastings", icon: "🍷" }
  ]

  const featuredDestinations: Array<{ name: string; country: string; image: string }> = [
    { 
      name: "Kyoto", 
      country: "Japan", 
      image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
    },
    { 
      name: "Santorini", 
      country: "Greece", 
      image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
    },
    { 
      name: "Bali", 
      country: "Indonesia", 
      image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
    }
  ]

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | Event) => {
      if (inputRef.current && event.target instanceof Node && !inputRef.current.contains(event.target)) {
        setIsFocused(false)
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <section className="relative w-full min-h-[90vh] flex flex-col items-center justify-center pt-16 pb-24 overflow-hidden">
      <Background />

      <div className="container px-4 sm:px-6 mx-auto flex flex-col items-center max-w-4xl">
        <Headline />

        <SearchBox 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          isFocused={isFocused}
          setIsFocused={setIsFocused}
          inputRef={inputRef}
          suggestions={suggestions}
          handleSearch={handleSearch}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-8 sm:mt-12 text-center"
        >
          <div className="text-sm text-muted-foreground mb-3">Trending experiences</div>
          <div className="flex flex-wrap gap-1.5 sm:gap-2 justify-center">
            {trendingExperiences.map((item) => (
              <TrendingItem
                key={item.name}
                icon={item.icon}
                name={item.name}
                onClick={() => setSearchQuery(item.name)}
              />
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="w-full mt-12 sm:mt-16 px-1 sm:px-4 md:px-8"
        >
          <h2 className="text-center text-lg font-medium mb-6">Featured Destinations</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {featuredDestinations.map((destination) => (
              <DestinationCard
                key={destination.name}
                name={destination.name}
                country={destination.country}
                image={destination.image}
              />
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="mt-10 sm:mt-14 flex items-center gap-2 py-2 px-4 rounded-full bg-background/90 border border-border/30 shadow-sm"
        >
          <Sparkles className="h-4 w-4 text-primary" />
          <span className="text-sm">Powered by AI recommendations</span>
        </motion.div>
      </div>

      <WaveDecoration />
    </section>
  )
}