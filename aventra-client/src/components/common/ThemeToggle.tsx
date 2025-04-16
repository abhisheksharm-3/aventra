"use client";

import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  
  return (
    <motion.div 
      whileHover={{ scale: 1.05 }} 
      whileTap={{ scale: 0.95 }}
    >
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="rounded-full w-9 h-9 backdrop-blur-sm bg-background/60 hover:bg-accent/40 
                  transition-all duration-300 border border-border/20 shadow-sm"
        aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
      >
        <Sun className="h-[1.1rem] w-[1.1rem] rotate-0 scale-100 transition-all 
                      dark:-rotate-90 dark:scale-0 text-amber-500" />
        <Moon className="absolute h-[1.1rem] w-[1.1rem] rotate-90 scale-0 transition-all 
                      dark:rotate-0 dark:scale-100 text-indigo-400" />
        <span className="sr-only">Toggle theme</span>
      </Button>
    </motion.div>
  );
};