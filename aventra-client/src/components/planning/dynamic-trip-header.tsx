import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Navigation } from "lucide-react";
import { useImages } from "@/hooks/useImages";
import { useTripFormStore } from "@/stores/useTripFormStore";

/**
 * Dynamic header component that displays images for both origin and destination
 * Aggregates images from Unsplash and Wikimedia
 */
export function DynamicTripHeader() {
    const formData = useTripFormStore((state) => state.formData);
    const [defaultImage] = useState<string>("https://images.unsplash.com/photo-1488085061387-422e29b40080?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop");

    // Get location information
    const origin = formData.location?.baseCity || '';
    const destination = formData.location?.destination || '';
    
    // Use our custom hook to fetch origin images
    const { 
        images: originImages, 
        loading: loadingOrigin 
    } = useImages(origin, 1);
    
    // Use our custom hook to fetch destination images
    const { 
        images: destinationImages, 
        loading: loadingDestination 
    } = useImages(destination, 1);
    
    // Add state for image transitions
    const [originImageUrl, setOriginImageUrl] = useState(defaultImage);
    const [destinationImageUrl, setDestinationImageUrl] = useState(defaultImage);
    
    // Determine if we're loading any images
    const isLoading = loadingOrigin || loadingDestination;
    
    // Update images with smooth transitions
    useEffect(() => {
        if (originImages && originImages.length > 0) {
            setOriginImageUrl(originImages[0]);
        }
    }, [originImages]);
    
    useEffect(() => {
        if (destinationImages && destinationImages.length > 0) {
            setDestinationImageUrl(destinationImages[0]);
        }
    }, [destinationImages]);
    
    return (
        <div className="relative h-56 sm:h-64 overflow-hidden rounded-t-xl">
            {/* Loading overlay */}
            <AnimatePresence>
                {isLoading && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 z-30 bg-background/60 flex items-center justify-center"
                    >
                        <div className="flex flex-col items-center">
                            <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full"></div>
                            <span className="text-sm text-primary/80 mt-2">Loading destination views</span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Origin image (left side) */}
            <AnimatePresence mode="wait">
                <motion.div 
                    key={`origin-${originImageUrl}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.7 }}
                    className="absolute top-0 left-0 w-1/2 h-full overflow-hidden"
                >
                    <div className="relative h-full w-full">
                        <Image
                            src={originImageUrl}
                            alt="Origin city"
                            fill
                            className="object-cover origin-center brightness-90 scale-105"
                            priority
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/80 z-10"></div>
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Destination image (right side) */}
            <AnimatePresence mode="wait">
                <motion.div 
                    key={`destination-${destinationImageUrl}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.7 }}
                    className="absolute top-0 right-0 w-1/2 h-full overflow-hidden"
                >
                    <div className="relative h-full w-full">
                        <Image
                            src={destinationImageUrl}
                            alt="Destination city"
                            fill
                            className="object-cover origin-center brightness-90 scale-105"
                            priority
                        />
                        <div className="absolute inset-0 bg-gradient-to-l from-transparent to-black/80 z-10"></div>
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Center blend overlay with slight animation */}
            <motion.div 
                key={`${origin}-${destination}-blend`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/20 z-20 flex items-end p-6 sm:p-8"
            >
                <div className="w-full">
                    <div className="flex items-center gap-3 mb-3">
                        {origin && destination && (
                            <>
                                <Badge className="bg-white/20 text-white hover:bg-white/30 transition-colors">
                                    {origin}
                                </Badge>
                                <Navigation className="h-4 w-4 text-white/60 rotate-45" />
                                <Badge className="bg-primary/30 text-white hover:bg-primary/40 transition-colors">
                                    {destination}
                                </Badge>
                            </>
                        )}
                    </div>
                    <motion.h2 
                        key={destination || "default"} // Forces re-render on destination change
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="text-white text-2xl font-medium font-serif"
                    >
                        {destination ? `Your Trip to ${destination}` : "Your Perfect Adventure"}
                    </motion.h2>
                    <p className="text-white/80 text-sm max-w-lg mt-1.5 font-sans">
                        Complete each section and let our AI craft your personalized travel itinerary
                    </p>
                </div>
            </motion.div>
        </div>
    );
}