"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { ChevronDown, X, Sun, Moon, Menu, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { useTheme } from "next-themes"
import Image from "next/image"

// Constants
const navItems = [
  { name: "Trips", icon: "✈️", description: "Discover amazing trip experiences for your next adventure" },
  { name: "Nights Out", icon: "🌃", description: "Find the perfect nightlife experiences in your city" },
  { name: "Family", icon: "👨‍👩‍👧‍👦", description: "Create unforgettable memories with family-friendly activities" },
  { name: "Date Night", icon: "💖", description: "Plan the perfect romantic evening with curated experiences" },
  { name: "Dining", icon: "🍽️", description: "Explore exquisite culinary adventures and tastings" }
];

const accountItems = [
  { name: "Profile", icon: "👤" },
  { name: "Settings", icon: "⚙️" },
  { name: "Sign In", icon: "🔐" }
];

// Animation variants
const menuItemVariants = {
  hidden: { opacity: 0, y: -8 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.05,
      duration: 0.3,
      ease: [0.22, 1, 0.36, 1]
    }
  }),
  exit: { opacity: 0, y: -8, transition: { duration: 0.2 } }
};

const NavbarComponent = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Theme effect
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Experiences dropdown menu
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
  
  // Theme toggle button
  const ThemeToggle = () => {
    if (!mounted) return null;
    
    return (
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="rounded-full w-9 h-9 border border-border/40 bg-background/80 hover:bg-accent/60 transition-colors duration-300"
      >
        <Sun className="h-[1.1rem] w-[1.1rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute h-[1.1rem] w-[1.1rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        <span className="sr-only">Toggle theme</span>
      </Button>
    );
  };
  
  // Account dropdown menu
  const AccountDropdown = () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="hidden md:flex">
        <Button 
          variant="ghost" 
          size="sm" 
          className="gap-1.5 font-medium tracking-wide h-10 px-4 rounded-full hover:bg-accent/60 border border-border/40 bg-background/80 backdrop-blur-sm transition-colors duration-300 group"
        >
          Account 
          <ChevronDown className="h-3.5 w-3.5 text-muted-foreground transition-transform duration-300 ease-in-out group-data-[state=open]:rotate-180" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-[220px] p-2.5 rounded-xl shadow-lg border border-border/40 bg-background/95 backdrop-blur-xl"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background/0 to-background/0 opacity-50 rounded-xl"></div>
        {accountItems.map((item, index) => (
          <motion.div
            key={item.name}
            custom={index}
            initial="hidden"
            animate="visible"
            variants={menuItemVariants}
            className="relative z-10"
          >
            <DropdownMenuItem className="rounded-lg focus:bg-accent/70 py-2 px-3 cursor-pointer group">
              <Link href={`/${item.name.toLowerCase().replace(" ", "-")}`} className="flex w-full items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  {item.icon}
                </div>
                <span className="font-medium group-hover:translate-x-0.5 transition-transform">
                  {item.name}
                </span>
              </Link>
            </DropdownMenuItem>
          </motion.div>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
  
  // Mobile menu toggle button
  const MobileMenuToggle = () => (
    <Button 
      variant="ghost" 
      size="icon" 
      className="md:hidden border border-border/40 rounded-full h-10 w-10 bg-background/80 backdrop-blur-sm hover:bg-accent/60"
      onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
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
  
  // Mobile menu
  const MobileMenu = () => (
    <AnimatePresence>
      {mobileMenuOpen && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="md:hidden bg-background/95 backdrop-blur-xl border-t border-border/40 overflow-hidden"
        >
          <nav className="container flex flex-col gap-1 py-5 px-4 relative">
            <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background/0 to-background/0 opacity-30"></div>
            {navItems.map((item, index) => (
              <motion.div
                key={item.name}
                custom={index}
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={menuItemVariants}
                className="relative z-10"
              >
                <Link 
                  href={`#${item.name.toLowerCase().replace(" ", "-")}`} 
                  className="flex items-center text-foreground/90 hover:text-foreground py-3.5 px-4 rounded-xl hover:bg-accent/60 transition-colors duration-300 group"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="text-lg mr-3">{item.icon}</span>
                  <span className="font-medium">{item.name}</span>
                  <span className="ml-auto text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-transform duration-300">→</span>
                </Link>
              </motion.div>
            ))}
            
            <div className="h-px w-full bg-gradient-to-r from-border/10 via-border/50 to-border/10 my-4 relative z-10"></div>
            
            <div className="flex flex-col gap-3 mt-2 mb-2 px-2 relative z-10">
              <motion.div
                custom={navItems.length}
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={menuItemVariants}
              >
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="w-full justify-center font-medium tracking-wide rounded-xl border-border/40 hover:bg-accent/60 bg-background/80 backdrop-blur-sm py-6"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      🔐
                    </div>
                    <span>Sign In</span>
                  </div>
                </Button>
              </motion.div>
              
              <motion.div
                custom={navItems.length + 1}
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={menuItemVariants}
              >
                <Button 
                  size="lg" 
                  className="w-full justify-center font-medium tracking-wide rounded-xl shadow-sm py-6 bg-primary hover:bg-primary/90 transition-colors duration-300 group"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-background/20 flex items-center justify-center text-primary-foreground">
                      <Sparkles className="h-3.5 w-3.5 opacity-70" />
                    </div>
                    <span className="group-hover:translate-x-0.5 transition-transform duration-300">Get Started</span>
                  </div>
                </Button>
              </motion.div>
            </div>
          </nav>
        </motion.div>
      )}
    </AnimatePresence>
  );
  
  // Desktop navigation menu
  const DesktopNavItems = () => (
    <NavigationMenu className="hidden md:flex">
      <NavigationMenuList className="gap-1">
        <ExperiencesDropdown />
        
        {/* Regular nav items (not in the dropdown) */}
        {navItems.slice(0, 3).map((item) => (
          <NavigationMenuItem key={item.name}>
            <Link href={`#${item.name.toLowerCase().replace(" ", "-")}`} legacyBehavior passHref>
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
  
  // Get Started Button matching the hero search button style
  const GetStartedButton = () => (
    <Button 
      size="sm" 
      className="font-medium tracking-wide px-6 h-10 rounded-full bg-primary hover:bg-primary/90 transition-colors duration-300 group"
    >
      <Sparkles className="h-3.5 w-3.5 opacity-70 mr-1.5" />
      <span className="group-hover:translate-x-0.5 transition-transform duration-300">Get Started</span>
    </Button>
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
    >
      <div className="relative">
        {!scrolled && (
          <div className="absolute inset-0">
            <div className="absolute top-0 left-20 h-[300px] w-[300px] bg-primary/5 rounded-full blur-[100px] opacity-60"></div>
            <div className="absolute top-0 right-20 h-[200px] w-[200px] bg-blue-700/5 rounded-full blur-[100px] opacity-60"></div>
          </div>
        )}
      </div>
      <div className="container mx-auto px-4 md:px-6 flex h-16 lg:h-18 items-center justify-between relative">
        {/* Logo with glow effect */}
        <Link 
          href="/" 
          className="flex items-center gap-2.5"
        >
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative overflow-hidden rounded-xl p-1"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/10 rounded-xl blur-xl opacity-70"></div>
            <div className="relative z-10 transition-transform duration-300 hover:scale-105">
              <Image 
                src="/logo.png" 
                alt="Logo" 
                width={120}
                height={30}
                className="w-[120px]"
              />
            </div>
          </motion.div>
        </Link>

        {/* Desktop Navigation Menu */}
        <DesktopNavItems />

        <div className="flex items-center gap-3">
          {/* Theme Toggle */}
          <ThemeToggle />
          
          {/* Account Dropdown (Desktop) */}
          <AccountDropdown />
          
          {/* Get Started Button */}
          <GetStartedButton />

          {/* Mobile Menu Toggle */}
          <MobileMenuToggle />
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <MobileMenu />
    </header>
  );
};

export default NavbarComponent;