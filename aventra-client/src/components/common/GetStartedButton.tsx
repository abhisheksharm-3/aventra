"use client";

import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export const GetStartedButton = () => (
  <motion.div 
    className="hidden md:flex items-center"
    whileHover={{ scale: 1.03 }}
    whileTap={{ scale: 0.97 }}
  >
    <Button 
      size="sm" 
      className="font-medium tracking-wide px-5 h-10 rounded-full 
                bg-gradient-to-r from-primary/95 to-primary/85 
                hover:from-primary hover:to-primary/90
                text-primary-foreground shadow-md hover:shadow-lg 
                transition-all duration-300 group border border-primary/10 cursor-pointer"
    >
      <div className="flex items-center gap-2">
        <span className="group-hover:translate-x-0.5 transition-transform duration-300">
          Get Started
        </span>
        <Sparkles className="h-3.5 w-3.5 opacity-80 group-hover:opacity-100 animate-pulse" />
      </div>
    </Button>
  </motion.div>
);