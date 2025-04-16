"use client";

import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface MobileMenuToggleProps {
  isOpen: boolean;
  onToggle: () => void;
}

export const MobileMenuToggle = ({ isOpen, onToggle }: MobileMenuToggleProps) => (
  <motion.div 
    whileHover={{ scale: 1.05 }} 
    whileTap={{ scale: 0.95 }}
    className="md:hidden"
  >
    <Button 
      variant="ghost" 
      size="icon" 
      className="border border-border/30 rounded-full h-9 w-9 
               bg-background/70 backdrop-blur-sm hover:bg-accent/40 
               shadow-sm transition-colors duration-200"
      onClick={onToggle}
      aria-label={isOpen ? "Close menu" : "Open menu"}
      aria-expanded={isOpen}
    >
      <AnimatePresence mode="wait">
        {isOpen ? (
          <motion.div
            key="close"
            initial={{ opacity: 0, rotate: -90 }}
            animate={{ opacity: 1, rotate: 0 }}
            exit={{ opacity: 0, rotate: 90 }}
            transition={{ duration: 0.2 }}
          >
            <X className="h-4.5 w-4.5" />
          </motion.div>
        ) : (
          <motion.div
            key="menu"
            initial={{ opacity: 0, rotate: 90 }}
            animate={{ opacity: 1, rotate: 0 }}
            exit={{ opacity: 0, rotate: -90 }}
            transition={{ duration: 0.2 }}
          >
            <Menu className="h-4.5 w-4.5" />
          </motion.div>
        )}
      </AnimatePresence>
    </Button>
  </motion.div>
);