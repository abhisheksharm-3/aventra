"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef} from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { DesktopNavItems } from "../navbar/DesktopNavItems";
import { ThemeToggle } from "../common/ThemeToggle";
import { GetStartedButton } from "../common/GetStartedButton";
import { MobileMenuToggle } from "../navbar/MobileMenuToggle";
import { MobileMenu } from "../navbar/MobileMenu";

/**
 * Navbar Component
 */
const Navbar = () => {
  // State management
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navbarRef = useRef<HTMLElement>(null);

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
      <NavbarFlare />

      {/* Main navigation container */}
      <div className="container mx-auto px-4 md:px-6 flex h-16 items-center justify-between relative">
        {/* Logo */}
        <motion.div
          className="flex-shrink-0"
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

        {/* Desktop Navigation Menu */}
        <motion.div
          className="flex-grow flex justify-center"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <DesktopNavItems />
        </motion.div>

        {/* Navigation Actions */}
        <motion.div
          className="flex items-center gap-2 md:gap-3"
          initial={{ opacity: 0, x: 15 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <ThemeToggle />
          <GetStartedButton />
          <MobileMenuToggle
            isOpen={mobileMenuOpen}
            onToggle={toggleMobileMenu}
          />
        </motion.div>
      </div>

      {/* Mobile Navigation Menu */}
      <MobileMenu isOpen={mobileMenuOpen} onClose={closeMobileMenu} />
    </header>
  );
};

export default Navbar;
