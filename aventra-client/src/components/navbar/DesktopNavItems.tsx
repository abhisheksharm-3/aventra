"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ExperiencesDropdown } from "./ExperiencesDropdown";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { mainNavItems } from "@/lib/constants/navigation";

/**
 * @component DesktopNavItems
 * @description Renders the main navigation items for desktop view including dropdowns
 * and animated hover effects.
 * @returns {JSX.Element} The desktop navigation menu
 */
export const DesktopNavItems = () => {
  const [activeItem, setActiveItem] = useState<string>("");

  return (
    <NavigationMenu className="hidden md:flex">
      <NavigationMenuList className="gap-1">
        <ExperiencesDropdown />
        
        {/* Main navigation items */}
        {mainNavItems.map((item) => (
          <NavigationMenuItem key={item.name}>
            <NavigationMenuLink 
              asChild
              className={cn(
                "flex px-4 h-10 items-center justify-center rounded-full text-sm font-medium",
                "hover:bg-accent/40 hover:text-accent-foreground",
                "transition-all duration-200 border border-transparent hover:border-border/20",
                "relative group"
              )}
              onMouseEnter={() => setActiveItem(item.name)}
              onMouseLeave={() => setActiveItem("")}
            >
              <Link href={item.href}>
                {item.name}
                <motion.div 
                  className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 h-0.5 
                           bg-primary rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: activeItem === item.name ? '60%' : 0 }}
                  transition={{ duration: 0.2 }}
                />
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
};