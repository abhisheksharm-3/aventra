"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "../common/ThemeToggle";
import { GetStartedButton } from "../common/GetStartedButton";
import { 
  Bell, 
  Search, 
  LayoutDashboard, 
  Globe,
  Map,
  Sparkles,
  MessageSquare
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import NavbarFlare from "../navbar/NavbarFlare";
import { DesktopNavItems } from "../navbar/DesktopNavItems";
import NotificationsPanel from "../navbar/NotificationsPanel";
import SearchPanel from "../navbar/SearchPanel";
import UserProfileMenu from "../navbar/UserProfileMenu";
import { MobileMenuToggle } from "../navbar/MobileMenuToggle";
import { MobileMenu } from "../navbar/MobileMenu";
import { useUser } from "@/hooks/useUser";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { usePathname } from "next/navigation";

/**
 * Premium Navbar Component
 */
const Navbar = () => {
  // State management
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const navbarRef = useRef<HTMLElement>(null);
  const pathname = usePathname();

  // Use our custom hook for authentication state
  const { isLoading, isLoggedIn } = useUser();

  // Menu items for the main navigation
  const mainNavItems = [
    { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { path: "/plan", label: "Plan Trip", icon: Sparkles },
    { path: "/explore", label: "Explore", icon: Globe },
    { path: "/dashboard/trips", label: "My Trips", icon: Map },
  ];

  /**
   * Handle scroll effect to update navbar appearance
   */
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /**
   * Focus search input when search is shown
   */
  useEffect(() => {
    if (showSearch && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [showSearch]);

  /**
   * Manage body scroll behavior when mobile menu is open/closed
   */
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileMenuOpen]);

  /**
   * Close dropdowns when clicking outside
   */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      
      if (showNotifications && navbarRef.current && !navbarRef.current.contains(target)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showNotifications]);

  /**
   * Toggle mobile menu
   */
  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  /**
   * Close mobile menu
   */
  const closeMobileMenu = () => setMobileMenuOpen(false);
  
  /**
   * Toggle notifications panel
   */
  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
    if (showSearch) setShowSearch(false);
  };

  /**
   * Toggle search panel
   */
  const toggleSearch = () => {
    setShowSearch(!showSearch);
    if (showNotifications) setShowNotifications(false);
  };

  /**
   * Check if a given path is active or if the current path starts with it
   */
  const isActive = (path: string) => {
    if (path === "/dashboard" && pathname === "/dashboard") {
      return true;
    }
    return pathname === path || (path !== "/dashboard" && pathname?.startsWith(path));
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-500",
        "backdrop-blur-xl border-b",
        scrolled
          ? "bg-background/95 border-border/40 shadow-sm"
          : "bg-background/50 border-transparent"
      )}
      role="banner"
      ref={navbarRef}
    >
      {/* Only show navbar flare on public pages (not logged in) */}
      {!isLoggedIn && <NavbarFlare />}
      
      {/* Ambient background for more premium look */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-5 -right-5 w-24 h-24 bg-primary/5 rounded-full blur-xl"></div>
        <div className="absolute -bottom-8 left-1/4 w-32 h-32 bg-blue-500/5 rounded-full blur-xl"></div>
      </div>

      {/* Main navigation container */}
      <div className="container mx-auto px-4 md:px-6 flex h-16 items-center justify-between relative">
        {/* Logo */}
        <motion.div
          className="flex items-center z-10"
          whileHover={{ scale: 1.02 }}
          initial={{ opacity: 0, x: -15 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Link
            href="/"
            className="relative flex items-center"
            aria-label="Home"
          >
            <div className="relative overflow-hidden p-1">
              <Image
                src="/images/logo.png"
                alt="Logo"
                width={100}
                height={26}
                className="w-auto h-6 md:h-7"
                priority
              />
            </div>
            
            {/* Version badge for premium feel */}
            <div className="hidden md:flex ml-2 items-center">
              <span className="text-[10px] text-muted-foreground tracking-wider bg-muted px-1.5 py-0.5 rounded-sm">
                BETA
              </span>
            </div>
          </Link>
        </motion.div>

        {/* Desktop Navigation Menu - Public nav for non-logged in users */}
        {!isLoggedIn && (
          <motion.div
            className="flex-grow flex justify-center"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <DesktopNavItems />
          </motion.div>
        )}

        {/* Integrated Menu Navigation - For logged in users */}
        {isLoggedIn && !showSearch && (
          <div className="hidden md:flex items-center justify-center">
            <nav className="bg-muted/40 rounded-lg p-1 backdrop-blur-md">
              <ul className="flex items-center space-x-0.5">
                {mainNavItems.map((item) => {
                  const active = isActive(item.path);
                  return (
                    <li key={item.path}>
                      <Link href={item.path}>
                        <motion.div
                          whileHover={{ y: -2 }}
                          transition={{ type: "spring", stiffness: 500, damping: 15 }}
                        >
                          <Button 
                            variant={active ? "default" : "ghost"} 
                            size="sm" 
                            className={cn(
                              "gap-2 rounded-md h-9 px-3 relative",
                              active ? "shadow-sm" : "hover:bg-muted/80",
                              active && "bg-primary text-primary-foreground"
                            )}
                          >
                            <item.icon className={cn(
                              "h-4 w-4",
                              active ? "text-primary-foreground" : "text-primary"
                            )} />
                            <span>{item.label}</span>
                            
                            {active && (
                              <motion.div
                                layoutId="navIndicator"
                                className="absolute bottom-1 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full bg-primary-foreground"
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                              />
                            )}
                          </Button>
                        </motion.div>
                      </Link>
                    </li>
                  );
                })}
                
                {/* AI Chat special button */}
                <li className="ml-1">
                  <Link href="/plan?method=chat">
                    <motion.div
                      whileHover={{ y: -2 }}
                      transition={{ type: "spring", stiffness: 500, damping: 15 }}
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        className={cn(
                          "gap-2 rounded-md h-9 border-primary/30 bg-primary/5 text-primary hover:bg-primary/10",
                          isActive("/plan?method=chat") && "bg-primary/20 border-primary/40"
                        )}
                      >
                        <MessageSquare className="h-4 w-4" />
                        <span>AI Chat</span>
                      </Button>
                    </motion.div>
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        )}

        {/* Navigation Actions */}
        <motion.div
          className="flex items-center gap-2 md:gap-3 z-10"
          initial={{ opacity: 0, x: 15 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Search Button (Only show when logged in) */}
          {isLoggedIn && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleSearch}
                    className={cn(
                      "rounded-full relative hover:bg-muted transition-colors",
                      showSearch && "bg-muted/80 shadow-sm"
                    )}
                    aria-label="Search"
                  >
                    <motion.div 
                      whileHover={{ scale: 1.1 }} 
                      whileTap={{ scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Search className="h-[18px] w-[18px] text-foreground/70" />
                    </motion.div>
                    
                    {/* Keyboard shortcut indicator */}
                    <span className="sr-only md:not-sr-only md:absolute md:-bottom-0 md:left-1/2 md:transform md:-translate-x-1/2 md:-translate-y-0.5 md:text-[9px] md:text-muted-foreground md:opacity-80">⌘K</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">Search trips & destinations</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}

          {/* Notifications Button (Only show when logged in) */}
          {isLoggedIn && (
            <div className="relative">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={toggleNotifications}
                      className={cn(
                        "rounded-full relative hover:bg-muted transition-colors",
                        showNotifications && "bg-muted/80 shadow-sm"
                      )}
                      aria-label="Notifications"
                    >
                      <motion.div 
                        whileHover={{ scale: 1.1 }} 
                        whileTap={{ scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="flex items-center justify-center"
                      >
                        <Bell className="h-[18px] w-[18px] text-foreground/70" />
                        <span className="absolute -top-0.5 -right-0.5 flex">
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ 
                              type: "spring",
                              stiffness: 500,
                              damping: 15,
                              delay: 0.2 
                            }}
                          >
                            <Badge className="h-4 w-4 rounded-full p-0 flex items-center justify-center text-[9px] bg-primary text-white shadow-sm">
                              3
                            </Badge>
                          </motion.div>
                        </span>
                      </motion.div>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">View notifications</TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              {/* Notifications Panel */}
              <AnimatePresence>
                {showNotifications && (
                  <NotificationsPanel />
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Enhanced Search Panel */}
          <AnimatePresence>
            {showSearch && isLoggedIn && (
              <SearchPanel searchInputRef={searchInputRef} />
            )}
          </AnimatePresence>

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Conditional rendering based on authentication status */}
          {!isLoading && (
            <>
              {isLoggedIn ? (
                <UserProfileMenu />
              ) : (
                <GetStartedButton />
              )}
            </>
          )}

          {/* Mobile Menu Toggle */}
          <div className="md:hidden">
            <MobileMenuToggle
              isOpen={mobileMenuOpen}
              onToggle={toggleMobileMenu}
            />
          </div>
        </motion.div>
      </div>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <MobileMenu isOpen={mobileMenuOpen} onClose={closeMobileMenu} />
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;