"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { X, Sun, Moon, Menu, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { useTheme } from "next-themes"
import Image from "next/image"
import { menuItemVariants } from "@/lib/constants/AnimationVariants"

/**
 * Navigation item types definition
 * @typedef {Object} NavItem
 * @property {string} name - Display name of the navigation item
 * @property {string} icon - Emoji icon for the navigation item
 * @property {string} description - Brief description of the navigation item
 */

/**
 * Main navigation item type definition
 * @typedef {Object} MainNavItem
 * @property {string} name - Display name of the navigation item
 * @property {string} href - URL path for the navigation item
 */

/**
 * Experience category navigation items
 * Used in dropdown menus and mobile navigation
 */
const navItems = [
  { name: "Trips", icon: "✈️", description: "Discover amazing trip experiences for your next adventure" },
  { name: "Nights Out", icon: "🌃", description: "Find the perfect nightlife experiences in your city" },
  { name: "Family", icon: "👨‍👩‍👧‍👦", description: "Create unforgettable memories with family-friendly activities" },
  { name: "Date Night", icon: "💖", description: "Plan the perfect romantic evening with curated experiences" },
  { name: "Dining", icon: "🍽️", description: "Explore exquisite culinary adventures and tastings" }
];

/**
 * Primary navigation items
 * Used for main navigation links in desktop and mobile menus
 */
const mainNavItems = [
  { name: "About", href: "/about" },
  { name: "Pricing", href: "/pricing" },
  { name: "Contact", href: "/contact" }
];

/**
 * Navigation Component
 * 
 * A responsive navigation bar with mobile and desktop layouts.
 * Features include:
 * - Responsive design with mobile hamburger menu
 * - Theme toggle (light/dark)
 * - Dropdown navigation for experience categories
 * - Animated transitions
 * - Scroll-aware styling
 * 
 * @returns {JSX.Element} The rendered navigation component
 */
const NavbarComponent = () => {
  // State management
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { theme, setTheme } = useTheme();
  
  /**
   * Handle scroll effect to update navbar appearance on scroll
   */
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /**
   * Manage body scroll behavior when mobile menu is open/closed
   */
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : 'unset';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);
  
  /**
   * ExperiencesDropdown Component
   * 
   * Displays a dropdown menu showing different experience categories
   * with descriptions and icons.
   * 
   * @returns {JSX.Element} The rendered dropdown menu
   */
  const ExperiencesDropdown = () => (
    <NavigationMenuItem>
      <NavigationMenuTrigger className="bg-transparent hover:bg-accent/50 font-medium text-sm h-10 px-4 tracking-wide rounded-full transition-colors duration-300 group">
        <span className="bg-clip-text text-transparent bg-gradient-to-br from-primary/90 to-primary via-primary/70 group-hover:opacity-80 transition-all duration-300">
          Experiences
        </span>
      </NavigationMenuTrigger>
      <NavigationMenuContent>
        <ul className="grid w-[400px] gap-3 p-6 md:w-[550px] md:grid-cols-2 lg:w-[650px] rounded-xl overflow-hidden shadow-lg border border-border/40 bg-background/95 backdrop-blur-xl">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background/0 to-background/0 opacity-50"></div>
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
                  className="block select-none space-y-1 rounded-xl p-4 leading-none no-underline outline-none transition-colors hover:bg-accent/60 hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground group relative overflow-hidden"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-primary/0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative z-10">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{item.icon}</span>
                      <div className="text-base font-medium leading-none">{item.name}</div>
                    </div>
                    <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground mt-2">
                      {item.description}
                    </p>
                  </div>
                </a>
              </NavigationMenuLink>
            </motion.li>
          ))}
        </ul>
      </NavigationMenuContent>
    </NavigationMenuItem>
  );
  
  /**
   * ThemeToggle Component
   * 
   * Button that toggles between light and dark themes
   * with smooth transition animations.
   * 
   * @returns {JSX.Element} The rendered theme toggle button
   */
  const ThemeToggle = () => (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="rounded-full w-9 h-9 border border-border/40 bg-background/80 hover:bg-accent/60 transition-colors duration-300"
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
    >
      <Sun className="h-[1.1rem] w-[1.1rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.1rem] w-[1.1rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
  
  /**
   * GetStartedButton Component
   * 
   * Primary CTA button for the desktop navigation
   * 
   * @returns {JSX.Element} The rendered button
   */
  const GetStartedButton = () => (
    <div className="hidden md:flex items-center">
      <Button 
        size="sm" 
        className="font-medium tracking-wide px-5 h-10 rounded-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/95 hover:to-primary/85 text-primary-foreground shadow-md hover:shadow-lg transition-all duration-300 group"
      >
        <div className="flex items-center gap-2">
          <span className="group-hover:translate-x-0.5 transition-transform duration-300">Get Started</span>
          <Sparkles className="h-3.5 w-3.5 opacity-80 group-hover:opacity-100" />
        </div>
      </Button>
    </div>
  );
  
  /**
   * MobileMenuToggle Component
   * 
   * Button that toggles the mobile navigation menu
   * with animated icon transitions.
   * 
   * @returns {JSX.Element} The rendered toggle button
   */
  const MobileMenuToggle = () => (
    <Button 
      variant="ghost" 
      size="icon" 
      className="md:hidden border border-border/40 rounded-full h-10 w-10 bg-background/80 backdrop-blur-sm hover:bg-accent/60"
      onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
      aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
      aria-expanded={mobileMenuOpen}
    >
      <AnimatePresence mode="wait">
        {mobileMenuOpen ? (
          <motion.div
            key="close"
            initial={{ opacity: 0, rotate: -90 }}
            animate={{ opacity: 1, rotate: 0 }}
            exit={{ opacity: 0, rotate: 90 }}
            transition={{ duration: 0.2 }}
          >
            <X className="h-5 w-5" />
          </motion.div>
        ) : (
          <motion.div
            key="menu"
            initial={{ opacity: 0, rotate: 90 }}
            animate={{ opacity: 1, rotate: 0 }}
            exit={{ opacity: 0, rotate: -90 }}
            transition={{ duration: 0.2 }}
          >
            <Menu className="h-5 w-5" />
          </motion.div>
        )}
      </AnimatePresence>
      <span className="sr-only">Toggle menu</span>
    </Button>
  );
  
  /**
   * MobileMenu Component
   * 
   * Full-screen mobile navigation menu with animated entries,
   * background effects, and organized navigation sections.
   * 
   * @returns {JSX.Element} The rendered mobile menu
   */
  const MobileMenu = () => (
    <AnimatePresence>
      {mobileMenuOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="md:hidden fixed inset-0 z-50 flex flex-col overflow-y-auto bg-background/60 backdrop-blur-xl"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation menu"
          style={{
            position: 'fixed',
            width: '100vw',
            height: '100vh',
            top: 0,
            left: 0
          }}
        >
          {/* Content container */}
          <div className="relative z-[9999] h-full flex flex-col min-h-screen backdrop-blur-xl bg-background/80">
            {/* Header with close button */}
            <div className="sticky top-0 flex justify-between px-6 py-4 bg-background/80 backdrop-blur-2xl">
            <Image 
                  src="/logo.png" 
                  alt="Logo" 
                  width={110}
                  height={28}
                  className="w-auto h-7 md:h-8"
                  priority
                />
              <Button 
                variant="ghost" 
                size="icon" 
                className="rounded-full h-10 w-10 bg-background/20 hover:bg-accent/30"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            {/* Menu content */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* Background gradient effects */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-20 h-[300px] w-[300px] bg-primary/5 rounded-full blur-[100px] opacity-60"></div>
                <div className="absolute bottom-20 right-10 h-[250px] w-[250px] bg-blue-700/5 rounded-full blur-[100px] opacity-60"></div>
              </div>
              
              {/* Experiences section */}
              <nav aria-label="Mobile navigation - Experiences">
                <div className="text-lg font-bold mb-4">Experiences</div>
                <div className="grid grid-cols-1 gap-3">
                  {navItems.map((item, index) => (
                    <motion.div
                      key={item.name}
                      custom={index}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      variants={menuItemVariants}
                    >
                      <Link 
                        href={`#${item.name.toLowerCase().replace(" ", "-")}`} 
                        className="flex items-center p-4 rounded-xl bg-background/40 border border-border/30 hover:bg-accent/30 transition-colors duration-300 group"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <span className="text-2xl mr-4" aria-hidden="true">{item.icon}</span>
                        <div>
                          <div className="font-medium text-base">{item.name}</div>
                          <p className="text-sm text-muted-foreground line-clamp-1">{item.description}</p>
                        </div>
                        <span className="ml-auto text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-transform duration-300" aria-hidden="true">→</span>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </nav>
              
              {/* Main navigation section */}
              <nav aria-label="Mobile navigation - Main">
                <div className="text-lg font-bold mb-4">Navigation</div>
                <div className="grid grid-cols-1 gap-3">
                  {mainNavItems.map((item, index) => (
                    <motion.div
                      key={item.name}
                      custom={index + navItems.length}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      variants={menuItemVariants}
                    >
                      <Link 
                        href={item.href} 
                        className="flex items-center p-4 rounded-xl bg-background/40 border border-border/30 hover:bg-accent/30 transition-colors duration-300 group"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <div className="font-medium">{item.name}</div>
                        <span className="ml-auto text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-transform duration-300" aria-hidden="true">→</span>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </nav>
            </div>
            
            {/* Footer with Get Started button */}
            <div className="sticky bottom-0 p-6 border-t border-border/20 bg-background/70 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.4 }}
              >
                <Button 
                  size="lg" 
                  className="w-full justify-center font-medium tracking-wide rounded-xl shadow-md py-6 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/95 hover:to-primary/85 group transition-all duration-300"
                >
                  <div className="flex items-center gap-2">
                    <span className="group-hover:translate-x-0.5 transition-transform duration-300">Get Started</span>
                    <Sparkles className="h-4 w-4 opacity-80 group-hover:opacity-100" aria-hidden="true" />
                  </div>
                </Button>
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
  
  /**
   * DesktopNavItems Component
   * 
   * Desktop navigation menu with dropdown and main links
   * 
   * @returns {JSX.Element} The rendered desktop navigation items
   */
  const DesktopNavItems = () => (
    <NavigationMenu className="hidden md:flex">
      <NavigationMenuList className="gap-1">
        <ExperiencesDropdown />
        
        {/* Main navigation items */}
        {mainNavItems.map((item) => (
          <NavigationMenuItem key={item.name}>
            <Link href={item.href} legacyBehavior passHref>
              <NavigationMenuLink className={cn(
                "flex px-4 h-10 items-center justify-center rounded-full text-sm font-medium",
                "hover:bg-accent/60 hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                "transition-colors duration-300 border border-transparent hover:border-border/30"
              )}>
                {item.name}
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );

  return (
    <header 
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        "backdrop-blur-xl border-b",
        scrolled 
          ? "bg-background/70 border-border/40 shadow-sm" 
          : "bg-transparent border-transparent"
      )}
      role="banner"
    >
      {/* Background gradient effect */}
      <div className="relative">
        {!scrolled && (
          <div className="absolute inset-0">
            <div className="absolute top-0 left-20 h-[300px] w-[300px] bg-primary/5 rounded-full blur-[100px] opacity-60"></div>
            <div className="absolute top-0 right-20 h-[200px] w-[200px] bg-blue-700/5 rounded-full blur-[100px] opacity-60"></div>
          </div>
        )}
      </div>

      {/* Main navigation container */}
      <div className="container mx-auto px-4 md:px-6 flex h-16 lg:h-18 items-center justify-between relative">
        {/* Logo */}
        <div className="flex-shrink-0">
          <Link 
            href="/" 
            className="relative flex items-center"
            aria-label="Home"
          >
            <div className="relative overflow-hidden rounded-xl">
              <div className="relative z-10 transition-transform duration-300 hover:scale-105 p-1">
                <Image 
                  src="/logo.png" 
                  alt="Logo" 
                  width={110}
                  height={28}
                  className="w-auto h-7 md:h-8"
                  priority
                />
              </div>
            </div>
          </Link>
        </div>

        {/* Desktop Navigation Menu */}
        <div className="flex-grow flex justify-center">
          <DesktopNavItems />
        </div>

        {/* Navigation Actions */}
        <div className="flex items-center gap-2 md:gap-3">
          <ThemeToggle />
          <GetStartedButton />
          <MobileMenuToggle />
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <MobileMenu />
    </header>
  );
};

export default NavbarComponent;