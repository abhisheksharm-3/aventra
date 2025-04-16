"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Sparkles, ChevronRight, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { menuItemVariants } from "@/lib/constants/AnimationVariants";
import { mainNavItems, navItems } from "@/lib/constants/navigation";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileMenu = ({ isOpen, onClose }: MobileMenuProps) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="md:hidden fixed inset-0 z-50 flex flex-col overflow-y-auto 
                bg-background/95 backdrop-blur-xl"
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation menu"
        style={{ position: 'fixed', width: '100vw', height: '100vh', top: 0, left: 0 }}
      >
        {/* Background gradients */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div 
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 0.6, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="absolute top-[15%] left-[-10%] h-[250px] w-[250px] 
                     bg-primary/5 rounded-full blur-[80px]"
          />
          <motion.div 
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 0.6, x: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="absolute bottom-[15%] right-[-10%] h-[250px] w-[250px] 
                     bg-blue-400/5 rounded-full blur-[80px]"
          />
        </div>
        
        {/* Content container */}
        <div className="relative z-[9999] h-full flex flex-col min-h-screen">
          {/* Header with close button */}
          <div className="sticky top-0 flex justify-between px-5 py-4 
                       bg-background/90 backdrop-blur-xl border-b border-border/10">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Image 
                src="/logo.png" 
                alt="Logo" 
                width={100}
                height={26}
                className="w-auto h-6"
                priority
              />
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                variant="ghost" 
                size="icon" 
                className="rounded-full h-9 w-9 bg-background/30 hover:bg-accent/30 
                         border border-border/20"
                onClick={onClose}
                aria-label="Close menu"
              >
                <X className="h-4 w-4" />
              </Button>
            </motion.div>
          </div>
          
          {/* Menu content */}
          <div className="flex-1 overflow-y-auto px-5 py-6">
            {/* Experiences section */}
            <nav aria-label="Mobile navigation - Experiences">
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="text-base font-bold mb-3 flex items-center gap-2"
              >
                <div className="bg-primary/10 text-primary px-2.5 py-0.5 rounded-full text-xs">
                  Explore
                </div>
                <div>Experiences</div>
              </motion.div>
              <div className="grid grid-cols-1 gap-2.5">
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.name}
                    custom={index}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    variants={menuItemVariants}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <Link 
                      href={`#${item.name.toLowerCase().replace(" ", "-")}`} 
                      className="flex items-center p-3 rounded-lg bg-background/50 
                              border border-border/20 hover:bg-accent/20 
                              transition-all duration-200 hover:shadow-sm"
                      onClick={onClose}
                    >
                      <div className="bg-background/80 backdrop-blur-sm p-2 rounded-full 
                                   border border-border/30 shadow-sm mr-3">
                        <span className="text-lg" aria-hidden="true">{item.icon}</span>
                      </div>
                      <div>
                        <div className="font-medium text-sm">{item.name}</div>
                        <p className="text-xs text-muted-foreground line-clamp-1">
                          {item.description}
                        </p>
                      </div>
                      <motion.div 
                        className="ml-auto text-primary"
                        initial={{ x: 0 }}
                        whileHover={{ x: 2 }}
                        aria-hidden="true"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </motion.div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </nav>
            
            {/* Main navigation section */}
            <nav aria-label="Mobile navigation - Main" className="mt-8">
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                className="text-base font-bold mb-3 flex items-center gap-2"
              >
                <div className="bg-blue-500/10 text-blue-500 px-2.5 py-0.5 rounded-full text-xs">
                  Menu
                </div>
                <div>Navigation</div>
              </motion.div>
              <div className="grid grid-cols-1 gap-2.5">
                {mainNavItems.map((item, index) => (
                  <motion.div
                    key={item.name}
                    custom={index + navItems.length}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    variants={menuItemVariants}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <Link 
                      href={item.href} 
                      className="flex items-center p-3 rounded-lg bg-background/50 
                              border border-border/20 hover:bg-accent/20 
                              transition-all duration-200 hover:shadow-sm"
                      onClick={onClose}
                    >
                      <div className="font-medium text-sm">{item.name}</div>
                      <motion.div 
                        className="ml-auto text-primary"
                        initial={{ x: 0 }}
                        whileHover={{ x: 2 }}
                        aria-hidden="true"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </motion.div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </nav>
          </div>
          
          {/* Footer with Get Started button */}
          <div className="sticky bottom-0 p-5 border-t border-border/10 
                       bg-background/90 backdrop-blur-xl">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <Button 
                className="w-full justify-center font-medium tracking-wide rounded-lg 
                        shadow-sm py-5 bg-gradient-to-r from-primary/95 to-primary/85 
                        hover:from-primary hover:to-primary/90 group transition-all 
                        duration-200 border border-primary/10"
              >
                <div className="flex items-center gap-2">
                  <span className="group-hover:translate-x-0.5 transition-transform duration-200">
                    Get Started
                  </span>
                  <Sparkles className="h-3.5 w-3.5 opacity-80 group-hover:opacity-100 animate-pulse" />
                </div>
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.div>
    )}
  </AnimatePresence>
);