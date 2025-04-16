"use client";

import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { menuItemVariants } from "@/lib/constants/AnimationVariants";
import {
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { navItems } from "@/lib/constants/navigation";

interface ExperiencesDropdownProps {
  onClose?: () => void;
}

export const ExperiencesDropdown = ({ onClose }: ExperiencesDropdownProps) => {
  const [, setActiveItem] = useState("");

  return (
    <NavigationMenuItem>
      <NavigationMenuTrigger 
        className="bg-transparent hover:bg-accent/40 font-medium text-sm h-10 px-4 
                 tracking-wide rounded-full transition-colors duration-200 group"
        onMouseEnter={() => setActiveItem("experiences")}
        onMouseLeave={() => setActiveItem("")}
      >
        <span className="bg-clip-text text-transparent bg-gradient-to-r 
                       from-primary to-primary/80 group-hover:opacity-90 
                       transition-opacity">
          Experiences
        </span>
      </NavigationMenuTrigger>
      <NavigationMenuContent>
        <ul className="grid w-[400px] gap-3 p-5 md:w-[500px] md:grid-cols-2 lg:w-[600px] 
                     rounded-xl border border-border/30 bg-background/95 backdrop-blur-xl 
                     shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 
                        via-background/0 to-background/0 opacity-50 rounded-xl"></div>
          {navItems.map((item, index) => (
            <motion.li 
              key={item.name}
              custom={index}
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={menuItemVariants}
            >
              <NavigationMenuLink asChild>
                <a
                  href={`#${item.name.toLowerCase().replace(" ", "-")}`}
                  className="block select-none space-y-1 rounded-xl p-3.5 leading-none 
                          no-underline outline-none transition-all hover:bg-accent/40 
                          hover:text-accent-foreground focus:bg-accent 
                          focus:text-accent-foreground group relative overflow-hidden 
                          hover:scale-[1.02] border border-transparent 
                          hover:border-border/30"
                  onClick={() => onClose?.()}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/5 
                              to-primary/0 rounded-xl opacity-0 group-hover:opacity-100 
                              transition-opacity duration-300"></div>
                  <div className="relative z-10">
                    <div className="flex items-center gap-2.5">
                      <div className="bg-background/90 backdrop-blur-sm p-1.5 
                                  rounded-full border border-border/30 shadow-sm">
                        <span className="text-lg">{item.icon}</span>
                      </div>
                      <div className="text-sm font-medium">{item.name}</div>
                    </div>
                    <p className="line-clamp-2 text-xs leading-relaxed 
                              text-muted-foreground mt-1.5">
                      {item.description}
                    </p>
                    <div className="absolute bottom-2 right-2 opacity-0 
                                group-hover:opacity-100 transition-opacity 
                                text-primary">
                      <ChevronRight className="h-3.5 w-3.5" />
                    </div>
                  </div>
                </a>
              </NavigationMenuLink>
            </motion.li>
          ))}
        </ul>
      </NavigationMenuContent>
    </NavigationMenuItem>
  );
};