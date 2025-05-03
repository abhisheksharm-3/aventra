"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "../common/ThemeToggle";
import { GetStartedButton } from "../common/GetStartedButton";
import { Bell, Search } from "lucide-react";
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

/**
 * Navbar Component
 */
const Navbar = () => {
  // State management
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const navbarRef = useRef<HTMLElement>(null);
  
  // Use our custom hook for authentication state
  const { user, isLoading, isLoggedIn } = useUser();

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
   * Close notifications when clicking outside
   */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showNotifications && navbarRef.current && !navbarRef.current.contains(event.target as Node)) {
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

  // Current time for the header
  const formattedDate = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-500",
        "backdrop-blur-xl border-b",
        scrolled
          ? "bg-background/80 border-border/20 shadow-sm"
          : "bg-transparent border-transparent"
      )}
      role="banner"
      ref={navbarRef}
    >
      {/* Only show navbar flare on public pages (not logged in) */}
      {!isLoggedIn && <NavbarFlare />}

      {/* Main navigation container */}
      <div className="container mx-auto px-4 md:px-6 flex h-16 items-center justify-between relative">
        {/* Logo */}
        <motion.div
          className="flex items-center gap-2 z-10"
          whileHover={{ scale: 1.03 }}
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
          </Link>
        </motion.div>

        {/* Desktop Navigation Menu - Only show public nav when not logged in */}
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

        {/* User Welcome Header - Show when logged in */}
        {isLoggedIn && !showSearch && user && (
          <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 text-center">
            <div className="text-xs text-muted-foreground">
              {formattedDate}
            </div>
            <div className="text-sm font-medium">
              Welcome back, <span className="text-primary">{user.name || user.email}</span>
            </div>
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
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSearch}
              className={cn(
                "rounded-full relative hover:bg-background/80 transition-all",
                showSearch && "bg-background/80"
              )}
              aria-label="Search"
            >
              <Search className="h-[18px] w-[18px] text-foreground/70" />
            </Button>
          )}

          {/* Notifications Button (Only show when logged in) */}
          {isLoggedIn && (
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleNotifications}
                className={cn(
                  "rounded-full relative hover:bg-background/80 transition-all",
                  showNotifications && "bg-background/80"
                )}
                aria-label="Notifications"
              >
                <div className="flex items-center justify-center">
                  <Bell className="h-[18px] w-[18px] text-foreground/70" />
                  <Badge className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full p-0 flex items-center justify-center text-[9px] bg-primary">
                    3
                  </Badge>
                </div>
              </Button>
              
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

          {/* Mobile Menu Toggle - Only show for public pages (not logged in) */}
          {!isLoggedIn && (
            <MobileMenuToggle
              isOpen={mobileMenuOpen}
              onToggle={toggleMobileMenu}
            />
          )}
        </motion.div>
      </div>

      {/* Mobile Navigation Menu - Only for public pages */}
      {!isLoggedIn && (
        <MobileMenu isOpen={mobileMenuOpen} onClose={closeMobileMenu} />
      )}
    </header>
  );
};

export default Navbar;