import { NavItem, MainNavItem } from "@/types/navigation";

/**
 * Experience category navigation items
 */
export const navItems: NavItem[] = [
  { 
    name: "Trips", 
    icon: "✈️", 
    description: "Discover amazing trip experiences for your next adventure" 
  },
  { 
    name: "Nights Out", 
    icon: "🌃", 
    description: "Find the perfect nightlife experiences in your city" 
  },
  { 
    name: "Family", 
    icon: "👨‍👩‍👧‍👦", 
    description: "Create unforgettable memories with family-friendly activities" 
  },
  { 
    name: "Date Night", 
    icon: "💖", 
    description: "Plan the perfect romantic evening with curated experiences" 
  },
  { 
    name: "Dining", 
    icon: "🍽️", 
    description: "Explore exquisite culinary adventures and tastings" 
  }
];

/**
 * Primary navigation items
 */
export const mainNavItems: MainNavItem[] = [
  { name: "About", href: "/about" },
  { name: "Pricing", href: "/pricing" },
  { name: "Contact", href: "/contact" }
];