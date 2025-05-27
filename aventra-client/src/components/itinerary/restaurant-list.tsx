import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, ExternalLink, Utensils } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface Restaurant {
  name: string;
  cuisine: string;
  price_range: string;
  dietary_options: string[];
  signature_dishes: string[];
  location: {
    name: string;
    coordinates: {
      lat: number;
      lng: number;
    };
    google_maps_link?: string;
  };
  description: string;
  images: string[];
  link: string;
}

interface RestaurantListProps {
  restaurants: Restaurant[];
}

const RestaurantList: React.FC<RestaurantListProps> = ({ restaurants }) => {
  const [expandedId, setExpandedId] = useState<number | null>(null);
  
  const toggleRestaurantInfo = (idx: number) => {
    setExpandedId(expandedId === idx ? null : idx);
  };
  
  return (
    <Card className="border-primary/10 shadow-sm">
      <div className="p-4 border-b bg-muted/30">
        <h3 className="text-lg font-medium">Recommended Restaurants</h3>
      </div>
      
      <div className="p-4">
        <div className="space-y-4">
          {restaurants.map((restaurant, idx) => (
            <div key={idx} className="border rounded-md overflow-hidden shadow-sm">
              <div 
                className="p-4 bg-muted/20 flex justify-between cursor-pointer"
                onClick={() => toggleRestaurantInfo(idx)}
              >
                <div>
                  <h4 className="font-medium">{restaurant.name}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="bg-primary/10 text-primary/90 border-none">
                      {restaurant.cuisine}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{restaurant.price_range}</span>
                  </div>
                </div>
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Utensils className="h-5 w-5 text-primary/80" />
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
                    <div className="p-4 border-t">
                      <p className="text-sm text-muted-foreground mb-3">
                        {restaurant.description}
                      </p>
                      
                      {restaurant.dietary_options.length > 0 && (
                        <div className="mb-3">
                          <h5 className="text-xs font-medium text-muted-foreground uppercase mb-1">Dietary Options</h5>
                          <div className="flex flex-wrap gap-1">
                            {restaurant.dietary_options.map((option, i) => (
                              <Badge key={i} variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                                {option}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {restaurant.signature_dishes.length > 0 && (
                        <div className="mb-3">
                          <h5 className="text-xs font-medium text-muted-foreground uppercase mb-1">Signature Dishes</h5>
                          <div className="flex flex-wrap gap-1">
                            {restaurant.signature_dishes.map((dish, i) => (
                              <Badge key={i} variant="outline" className="text-xs bg-amber-50 text-amber-700 border-amber-200">
                                {dish}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      <Separator className="my-3" />
                      
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                          <span className="text-muted-foreground">{restaurant.location.name}</span>
                        </div>
                        
                        <div className="flex gap-2">
                          {restaurant.location?.google_maps_link && (
                            <a 
                              href={restaurant.location.google_maps_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-primary hover:underline flex items-center gap-1"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <MapPin className="h-3 w-3" />
                              <span>Maps</span>
                            </a>
                          )}
                          
                          {restaurant.link && (
                            <a 
                              href={restaurant.link} 
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-primary hover:underline flex items-center gap-1"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <ExternalLink className="h-3 w-3" />
                              <span>Website</span>
                            </a>
                          )}
                        </div>
                      </div>
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

export default RestaurantList;