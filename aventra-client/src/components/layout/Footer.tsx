"use client";

import Link from "next/link";
import { Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [hoveredSocial, setHoveredSocial] = useState<string | null>(null);
  
  return (
    <footer className="relative border-t pt-20 pb-16 overflow-hidden flex items-center justify-center w-screen">
      {/* Background with subtle gradients matching hero */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-background/95" />
        <div className="absolute top-20 -left-40 md:-left-20 h-[400px] w-[400px] bg-primary/5 rounded-full blur-[100px] opacity-40 animate-[pulse_12s_infinite]" />
        <div className="absolute bottom-0 -right-40 md:-right-20 h-[300px] w-[300px] bg-blue-700/5 rounded-full blur-[100px] opacity-40 animate-[pulse_16s_infinite]" />
        
        {/* Subtle grain texture for depth - matching hero */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-[url('/noise.png')] bg-repeat opacity-20"></div>
        </div>
      </div>

      {/* Top wave decoration */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-0 transform">
        <svg
          className="relative block w-full h-[30px] sm:h-[40px] -mt-[1px]"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M1200 120L0 16.48 0 0 1200 0 1200 120z"
            className="fill-background/60 dark:fill-background/40"
            opacity=".25"
          />
        </svg>
      </div>

      <div className="container px-4 sm:px-6 md:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 md:gap-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true, margin: "-50px" }}
            className="col-span-2 lg:col-span-2"
          >
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="relative overflow-hidden rounded-xl p-1">
                {/* Logo hover effect with gradient glow */}
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-r from-primary/20 to-blue-600/20 opacity-0 group-hover:opacity-100 blur-md transition-opacity duration-300" 
                  aria-hidden="true"
                />
                <div className="relative z-10 flex items-center gap-2 transition-transform duration-300 group-hover:scale-105">
                  <Image
                    src="/images/logo.png"
                    alt="Logo"
                    width={120}
                    height={30}
                    className="w-[120px]"
                  />
                </div>
              </div>
            </Link>

            <p className="mt-5 sm:mt-6 text-sm text-muted-foreground max-w-xs font-light tracking-wide leading-relaxed">
              Curating exceptional experiences for discerning individuals
              seeking memorable adventures and gatherings.
            </p>

            <div className="mt-6 inline-flex items-center gap-2 py-2 px-4 rounded-full bg-gradient-to-r from-primary/10 to-blue-600/10 backdrop-blur-md border border-border shadow-sm">
              <div className="w-5 h-5 rounded-full bg-gradient-to-r from-primary to-blue-600/80 flex items-center justify-center">
                <Sparkles className="h-3 w-3 text-primary-foreground" />
              </div>
              <span className="text-xs sm:text-sm">
                AI-powered recommendations
              </span>
            </div>
          </motion.div>

          {[
            {
              title: "EXPERIENCES",
              links: [
                { name: "Journeys", href: "#trips" },
                { name: "Social Events", href: "#nights-out" },
                { name: "Culinary", href: "#dining" },
                { name: "Romantic", href: "#dates" },
              ],
            },
            {
              title: "COMPANY",
              links: [
                { name: "About", href: "#about" },
                { name: "Journal", href: "#journal" },
                { name: "Careers", href: "#careers" },
                { name: "Contact", href: "#contact" },
              ],
            },
            {
              title: "LEGAL",
              links: [
                { name: "Privacy", href: "#privacy" },
                { name: "Terms", href: "#terms" },
                { name: "Cookies", href: "#cookies" },
                { name: "Licenses", href: "#licenses" },
              ],
            },
          ].map((category, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * (index + 1) }}
              viewport={{ once: true, margin: "-50px" }}
            >
              <h3 className="font-serif mb-5 sm:mb-6 tracking-wide text-xs sm:text-sm text-foreground/90">
                {category.title}
              </h3>
              <ul className="space-y-3 sm:space-y-4 text-xs sm:text-sm">
                {category.links.map((link, linkIndex) => (
                  <motion.li
                    key={linkIndex}
                    initial={{ opacity: 0, x: -5 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{
                      duration: 0.3,
                      delay: 0.2 + 0.05 * linkIndex,
                    }}
                    viewport={{ once: true }}
                  >
                    <Link
                      href={link.href}
                      className="text-muted-foreground hover:text-foreground transition-colors font-light tracking-wide group flex items-center"
                    >
                      <span className="group-hover:translate-x-0.5 transition-transform duration-300">
                        {link.name}
                      </span>
                      <motion.span 
                        initial={{ opacity: 0, x: -5 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-primary"
                      >
                        →
                      </motion.span>
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-14 sm:mt-16 pt-6 sm:pt-8 border-t border-border/40 flex flex-col md:flex-row justify-between items-center gap-6"
        >
          <p className="text-xs sm:text-sm text-muted-foreground font-light tracking-wide">
            © {currentYear} Aventra. All rights reserved.
          </p>
          <div className="flex items-center gap-6 sm:gap-8">
            {[
              {
                name: "Twitter",
                gradient: "from-blue-400 to-blue-600",
                icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                  </svg>
                ),
              },
              {
                name: "Instagram",
                gradient: "from-purple-500 to-fuchsia-500",
                icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                  </svg>
                ),
              },
              {
                name: "Facebook",
                gradient: "from-blue-500 to-blue-700",
                icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                  </svg>
                ),
              },
            ].map((social, index) => (
              <Link
                key={index}
                href="#"
                className="text-muted-foreground hover:text-foreground transition-colors group"
                onMouseEnter={() => setHoveredSocial(social.name)}
                onMouseLeave={() => setHoveredSocial(null)}
              >
                <span className="sr-only">{social.name}</span>
                <div className={`p-2 rounded-full transition-all duration-300 border ${
                  hoveredSocial === social.name 
                    ? `bg-gradient-to-r ${social.gradient} border-transparent shadow-md` 
                    : "bg-background border-border/30"
                }`}>
                  <span className={`${hoveredSocial === social.name ? "text-white" : "text-foreground/80"}`}>
                    {social.icon}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;