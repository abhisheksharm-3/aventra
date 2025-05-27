import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Star, ExternalLink} from "lucide-react";

interface Accommodation {
  name: string;
  type: string;
  location: {
    name: string;
    coordinates: {
      lat: number;
      lng: number;
    };
    google_maps_link?: string;
  };
  price_range: string;
  rating?: number;
  images?: string[];
  amenities?: string[];
  link?: string;
  description?: string;
}

interface AccommodationListProps {
  accommodations: Accommodation[];
}

const DEFAULT_HOTEL_IMAGE = "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?q=80&w=1000";

const AccommodationList: React.FC<AccommodationListProps> = ({ accommodations }) => {
  const [expandedId, setExpandedId] = useState<number | null>(null);
  
  const toggleHotelInfo = (idx: number) => {
    setExpandedId(expandedId === idx ? null : idx);
  };
  
  return (
    <Card className="border-primary/10 shadow-sm">
      <div className="p-4 border-b bg-muted/30">
        <h3 className="text-lg font-medium">Recommended Accommodations</h3>
      </div>
      
      <div className="p-4">
        <div className="space-y-4">
          {accommodations.map((hotel, idx) => (
            <div key={idx} className="group" onClick={() => toggleHotelInfo(idx)}>
              <div className="relative h-40 w-full rounded-md overflow-hidden cursor-pointer">
                <Image
                  src={hotel.images && hotel.images.length > 0 ? hotel.images[0] : DEFAULT_HOTEL_IMAGE}
                  alt={hotel.name || "Hotel"}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-0 p-3 w-full">
                  <div className="flex justify-between items-end w-full">
                    <div>
                      <Badge className="mb-1 bg-primary/90 text-primary-foreground">
                        {hotel.type || "Hotel"}
                      </Badge>
                      <h4 className="text-white font-medium">{hotel.name}</h4>
                      {hotel.location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-white/70" />
                          <span className="text-xs text-white/90">{hotel.location.name}</span>
                        </div>
                      )}
                    </div>
                    {hotel.rating && (
                      <div className="flex items-center bg-white/20 backdrop-blur-sm rounded px-2 py-1">
                        <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
                        <span className="text-xs text-white ml-1">{hotel.rating}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <AnimatePresence>
                {expandedId === idx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="pt-3 pb-1">
                      <div className="flex justify-between items-center mb-2">
                        <div>
                          <span className="text-xs text-muted-foreground">{hotel.price_range}</span>
                        </div>
                        
                        <div className="flex gap-2">
                          {hotel.location?.google_maps_link && (
                            <a 
                              href={hotel.location.google_maps_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-primary hover:underline flex items-center gap-1"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <MapPin className="h-3 w-3" />
                              <span>View on Maps</span>
                            </a>
                          )}
                          
                          {hotel.link && (
                            <a 
                              href={hotel.link} 
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-primary hover:underline flex items-center gap-1"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <ExternalLink className="h-3 w-3" />
                              <span>Visit Website</span>
                            </a>
                          )}
                        </div>
                      </div>
                      
                      {hotel.description && (
                        <p className="text-sm text-muted-foreground mb-2">
                          {hotel.description}
                        </p>
                      )}
                      
                      {hotel.amenities && hotel.amenities.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-2">
                          {hotel.amenities.slice(0, 4).map((amenity, i) => (
                            <Badge key={i} variant="outline" className="text-[10px] bg-muted/30">
                              {amenity}
                            </Badge>
                          ))}
                          {hotel.amenities.length > 4 && (
                            <Badge variant="outline" className="text-[10px] bg-muted/30">
                              +{hotel.amenities.length - 4} more
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default AccommodationList;