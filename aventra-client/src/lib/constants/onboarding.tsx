import { Bookmark, Camera, Coffee, Compass, Fish, Gem, Globe, Leaf, Mountain, Palette, Palmtree, Salad, Sparkles, Sprout, Star, Utensils, UtensilsCrossed, Wheat, Wine } from "lucide-react";

export const preferenceTypes = [
    { id: "minimal", name: "Minimal & Modern", icon: <Palette className="h-5 w-5" />, description: "Clean aesthetics and contemporary designs" },
    { id: "premium", name: "Luxury Experiences", icon: <Gem className="h-5 w-5" />, description: "High-end and exclusive destinations" },
    { id: "aesthetic", name: "Instagram-Worthy", icon: <Camera className="h-5 w-5" />, description: "Visually stunning and shareable moments" },
    { id: "adventure", name: "Adventurous", icon: <Mountain className="h-5 w-5" />, description: "Thrilling and active experiences" },
    { id: "cultural", name: "Cultural Immersion", icon: <Compass className="h-5 w-5" />, description: "Authentic local experiences" },
    { id: "hidden-gems", name: "Hidden Gems", icon: <Sparkles className="h-5 w-5" />, description: "Off-the-beaten-path discoveries" },
    { id: "culinary", name: "Culinary Delights", icon: <Wine className="h-5 w-5" />, description: "Exceptional food and drink experiences" },
    { id: "sustainable", name: "Eco-Friendly", icon: <Leaf className="h-5 w-5" />, description: "Sustainable and responsible experiences" },
    { id: "cozy", name: "Cozy & Intimate", icon: <Coffee className="h-5 w-5" />, description: "Warm and intimate atmospheres" },
  ];

  export   const travelStyles = [
    { 
      id: "luxury", 
      name: "Luxury", 
      icon: <Sparkles className="h-6 w-6" />, 
      description: "Premium experiences and high-end accommodations"
    },
    { 
      id: "budget", 
      name: "Budget-friendly", 
      icon: <Star className="h-6 w-6" />, 
      description: "Great value and affordable options"
    },
    { 
      id: "adventure", 
      name: "Adventure", 
      icon: <Mountain className="h-6 w-6" />, 
      description: "Thrilling activities and unique experiences"
    },
    { 
      id: "relax", 
      name: "Relaxation", 
      icon: <Palmtree className="h-6 w-6" />, 
      description: "Peaceful retreats and rejuvenating escapes"
    },
    { 
      id: "cultural", 
      name: "Cultural", 
      icon: <Globe className="h-6 w-6" />, 
      description: "Authentic local experiences and historical sites"
    },
    { 
      id: "foodie", 
      name: "Foodie", 
      icon: <Utensils className="h-6 w-6" />, 
      description: "Culinary delights and gastronomic adventures"
    },
  ];
  export   const dietaryPreferences = [
    { 
      id: "none", 
      name: "No Restrictions", 
      icon: <UtensilsCrossed className="h-6 w-6" />, 
      description: "Open to all culinary experiences"
    },
    { 
      id: "vegetarian", 
      name: "Vegetarian", 
      icon: <Salad className="h-6 w-6" />, 
      description: "No meat, but dairy and eggs are fine"
    },
    { 
      id: "vegan", 
      name: "Vegan", 
      icon: <Sprout className="h-6 w-6" />, 
      description: "Plant-based options only"
    },
    { 
      id: "gluten-free", 
      name: "Gluten-Free", 
      icon: <Wheat className="h-6 w-6" strokeWidth={1.5} />, 
      description: "No wheat, barley, or rye products"
    },
    { 
      id: "halal", 
      name: "Halal", 
      icon: <Fish className="h-6 w-6" strokeWidth={1.5} />, 
      description: "Prepared according to Islamic law"
    },
    { 
      id: "kosher", 
      name: "Kosher", 
      icon: <Bookmark className="h-6 w-6" strokeWidth={1.5} />, 
      description: "Prepared according to Jewish dietary laws"
    },
  ];