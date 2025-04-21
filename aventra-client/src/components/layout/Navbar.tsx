"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { DesktopNavItems } from "../navbar/DesktopNavItems";
import { ThemeToggle } from "../common/ThemeToggle";
import { GetStartedButton } from "../common/GetStartedButton";
import { MobileMenuToggle } from "../navbar/MobileMenuToggle";
import { MobileMenu } from "../navbar/MobileMenu";
import { Bell, Menu, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { usePathname } from "next/navigation";

interface NavbarProps {
  toggleSidebar?: () => void;
}

/**
 * Navbar Component
 */
const Navbar = ({ toggleSidebar }: NavbarProps) => {
  // State management
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navbarRef = useRef<HTMLElement>(null);
  const pathname = usePathname();
  
  // Check if we're on a dashboard page
  const isDashboard = pathname?.startsWith("/dashboard");

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
   * Manage body scroll behavior when mobile menu is open/closed
   */
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileMenuOpen]);

  /**
   * Toggle mobile menu
   */
  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  /**
   * Close mobile menu
   */
  const closeMobileMenu = () => setMobileMenuOpen(false);

  /**
   * Navbar Flare - decorative background element
   */
  const NavbarFlare = () => (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-[400px] pointer-events-none">
        <div
          className="absolute top-0 left-[15%] w-[400px] h-[400px] 
                     bg-primary/3 rounded-full blur-[100px] opacity-60 
                     animate-blob"
        ></div>
        <div
          className="absolute top-0 right-[15%] w-[400px] h-[400px] 
                     bg-blue-500/3 rounded-full blur-[100px] opacity-60 
                     animate-blob animation-delay-2000"
        ></div>
      </div>
    </div>
  );

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        "backdrop-blur-lg border-b",
        scrolled
          ? "bg-background/70 border-border/20 shadow-sm"
          : "bg-transparent border-transparent"
      )}
      role="banner"
      ref={navbarRef}
    >
      {!isDashboard && <NavbarFlare />}

      {/* Main navigation container */}
      <div className="container mx-auto px-4 md:px-6 flex h-16 items-center justify-between relative">
        {/* Logo with optional sidebar toggle */}
        <motion.div
          className="flex items-center gap-2"
          whileHover={{ scale: 1.03 }}
          initial={{ opacity: 0, x: -15 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {isDashboard && (
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={toggleSidebar}
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          )}
          <Link
            href="/"
            className="relative flex items-center"
            aria-label="Home"
          >
            <div className="relative overflow-hidden p-1">
              <Image
                src="/logo.png"
                alt="Logo"
                width={100}
                height={26}
                className="w-auto h-6 md:h-7"
                priority
              />
            </div>
          </Link>
        </motion.div>

        {/* Desktop Navigation Menu - Only show on non-dashboard pages */}
        {!isDashboard && (
          <motion.div
            className="flex-grow flex justify-center"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <DesktopNavItems />
          </motion.div>
        )}
        
        {/* Search for dashboard */}
        {isDashboard && (
          <div className="hidden md:flex flex-1 justify-center">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search for experiences, places..."
                className="w-full pl-8"
              />
            </div>
          </div>
        )}

        {/* Navigation Actions */}
        <motion.div
          className="flex items-center gap-2 md:gap-3"
          initial={{ opacity: 0, x: 15 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {isDashboard && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="rounded-full relative">
                  <Bell className="h-4 w-4" />
                  <Badge className="absolute -top-1 -right-1 h-4 w-4 rounded-full p-0 flex items-center justify-center text-[10px]">
                    3
                  </Badge>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="max-h-80 overflow-auto">
                  <DropdownMenuItem className="flex flex-col items-start cursor-pointer">
                    <div className="flex w-full">
                      <div className="flex-shrink-0 mr-3">
                        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                          <span className="text-blue-600 text-xs">✈️</span>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">Trip Reminder</p>
                        <p className="text-xs text-muted-foreground mt-1">Your trip to Bali is in 12 days. Start packing!</p>
                      </div>
                      <div className="ml-3 text-xs text-muted-foreground">
                        2h ago
                      </div>
                    </div>
                  </DropdownMenuItem>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          
          <ThemeToggle />
          
          {/* Show Get Started button only on non-dashboard pages */}
          {!isDashboard ? (
            <GetStartedButton />
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/avatars/user.png" alt="Abhishek Sharma" />
                    <AvatarFallback>AS</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col items-start ml-2 hidden sm:flex">
                    <span className="text-sm font-medium">Abhishek Sharma</span>
                    <span className="text-xs text-muted-foreground">Premium</span>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">Abhishek Sharma</p>
                    <p className="text-xs text-muted-foreground">
                      abhisheksharm-3@gmail.com
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    Billing
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600">
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          
          {!isDashboard && (
            <MobileMenuToggle
              isOpen={mobileMenuOpen}
              onToggle={toggleMobileMenu}
            />
          )}
        </motion.div>
      </div>

      {/* Mobile Navigation Menu */}
      <MobileMenu isOpen={mobileMenuOpen} onClose={closeMobileMenu} />
    </header>
  );
};

export default Navbar;