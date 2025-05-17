"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Globe, ArrowRight } from "lucide-react";
import Layout from "@/components/layout/Layout";

const ContactPage = () => {
  const [activeLocation, setActiveLocation] = useState(false);
  
  return (
    <Layout className="bg-background text-foreground min-h-screen">
      {/* Hero Section - Enhanced with floating elements */}
      <section className="relative h-[60vh] overflow-hidden flex items-center justify-center">
        {/* Background Image with parallax effect */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1534536281715-e28d76689b4d?q=80&w=2070&auto=format&fit=crop"
            alt="Contact Us"
            fill
            className="object-cover opacity-30 scale-110 origin-center"
            style={{
              transform: activeLocation ? "scale(1.05) translate(0%, -2%)" : "scale(1.1)",
              transition: "transform 1.5s ease-in-out"
            }}
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/50 to-background"></div>
        </div>
        
        {/* Floating decorative elements */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <motion.div 
            initial={{ opacity: 0, x: -100, y: -50 }}
            animate={{ opacity: 0.1, x: -20, y: -30 }}
            transition={{ duration: 20, repeat: Infinity, repeatType: "reverse" }}
            className="absolute top-[20%] left-[10%] w-32 h-32 bg-primary rounded-full blur-3xl"
          />
          <motion.div 
            initial={{ opacity: 0, x: 100, y: 50 }}
            animate={{ opacity: 0.1, x: 20, y: 30 }}
            transition={{ duration: 15, repeat: Infinity, repeatType: "reverse", delay: 2 }}
            className="absolute bottom-[30%] right-[15%] w-40 h-40 bg-secondary rounded-full blur-3xl"
          />
        </div>
        
        {/* Content */}
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-6xl md:text-8xl lg:text-9xl font-serif font-bold mb-6"
          >
            CONTACT
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-muted-foreground max-w-2xl mx-auto"
          >
            Reach out to us through our portfolio websites
          </motion.p>
        </div>
      </section>

      {/* Team Cards - Redesigned for better visual appeal */}
      <section className="py-24 relative">
        {/* Background gradient for depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/20 to-background pointer-events-none"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-serif mb-5">Meet The Team</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Have questions or want to collaborate? We&apos;d love to hear from you. 
                Reach out to us directly through our portfolio sites.
              </p>
            </motion.div>
            
            <div className="grid md:grid-cols-2 gap-8">
              {/* Abhishek Sharma - Enhanced card with restored gradient */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                whileHover={{ y: -5 }}
                className="group relative overflow-hidden rounded-2xl border border-border p-1"
                style={{
                  background: "linear-gradient(to bottom right, hsla(var(--card)/0.05), hsla(var(--card)/0.1))"
                }}
              >
                {/* Card content with hover effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                <div className="relative rounded-xl overflow-hidden bg-background/40 backdrop-blur-sm p-6 h-full">
                  <div className="flex flex-col md:flex-row md:items-center gap-6">
                    {/* Avatar with border glow */}
                    <div className="mx-auto md:mx-0">
                      <div className="relative rounded-full overflow-hidden w-28 h-28 ring-2 ring-border group-hover:ring-primary/40 transition-all duration-500">
                        <Image
                          src="https://avatars.githubusercontent.com/u/95611197?v=4"
                          alt="Abhishek Sharma"
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="flex flex-col flex-1 text-center md:text-left">
                      <h3 className="text-2xl font-medium mb-1">Abhishek Sharma</h3>
                      <p className="text-muted-foreground/80 mb-4">Full-Stack Developer</p>
                      <p className="text-muted-foreground mb-5 text-sm md:text-base">
                        Passionate about creating seamless digital experiences with modern web technologies and elegant UI design.
                      </p>
                      
                      {/* Link with animation */}
                      <Link 
                        href="https://www.abhisheksharma.tech/contact-me" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="mt-auto"
                      >
                        <motion.div 
                          whileHover={{ x: 5 }}
                          className="inline-flex items-center gap-2 text-foreground group-hover:text-primary transition-colors duration-300"
                        >
                          <Globe size={18} className="text-muted-foreground group-hover:text-primary" />
                          <span>Contact via portfolio</span>
                          <ArrowRight size={14} className="opacity-70 group-hover:opacity-100" />
                        </motion.div>
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
              
              {/* Garvit - Enhanced card with restored gradient */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
                whileHover={{ y: -5 }}
                className="group relative overflow-hidden rounded-2xl border border-border p-1"
                style={{
                  background: "linear-gradient(to bottom right, hsla(var(--card)/0.05), hsla(var(--card)/0.1))"
                }}
              >
                {/* Card content with hover effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                <div className="relative rounded-xl overflow-hidden bg-background/40 backdrop-blur-sm p-6 h-full">
                  <div className="flex flex-col md:flex-row md:items-center gap-6">
                    {/* Avatar with border glow */}
                    <div className="mx-auto md:mx-0">
                      <div className="relative rounded-full overflow-hidden w-28 h-28 ring-2 ring-border group-hover:ring-emerald-400/40 transition-all duration-500">
                        <Image
                          src="https://avatars.githubusercontent.com/u/154075021?v=4"
                          alt="Garvit"
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="flex flex-col flex-1 text-center md:text-left">
                      <h3 className="text-2xl font-medium mb-1">Garvit</h3>
                      <p className="text-muted-foreground/80 mb-4">AI/ML Specialist</p>
                      <p className="text-muted-foreground mb-5 text-sm md:text-base">
                        Expert in machine learning algorithms focused on creating intelligent systems that enhance the user experience.
                      </p>
                      
                      {/* Link with animation */}
                      <Link 
                        href="https://garvitnag.in" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="mt-auto"
                      >
                        <motion.div 
                          whileHover={{ x: 5 }}
                          className="inline-flex items-center gap-2 text-foreground group-hover:text-emerald-400 transition-colors duration-300"
                        >
                          <Globe size={18} className="text-muted-foreground group-hover:text-emerald-400" />
                          <span>Contact via portfolio</span>
                          <ArrowRight size={14} className="opacity-70 group-hover:opacity-100" />
                        </motion.div>
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Project & Location Info - With interactive elements */}
      <section className="py-24 relative bg-background">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="mb-16 text-center"
            >
              <h2 className="text-4xl md:text-5xl font-serif mb-4">Project Information</h2>
              <div className="w-20 h-1 bg-muted-foreground/30 mx-auto"></div>
            </motion.div>
            
            <div className="grid md:grid-cols-2 gap-10 items-center">
              {/* Project info with animated gradient border */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="relative p-[1px] rounded-2xl overflow-hidden bg-gradient-to-r from-primary/20 via-secondary/20 to-primary/20 bg-size-200 animate-gradient"
              >
                <div className="bg-card rounded-2xl p-8">
                  <h3 className="text-2xl font-serif mb-4">About Aventra</h3>
                  <p className="text-muted-foreground mb-4">
                    Aventra is our 8th semester major project at CCET Chandigarh. We&apos;ve created this AI-powered travel platform to showcase our technical skills and passion for creating innovative solutions.
                  </p>
                  <p className="text-muted-foreground/70 text-sm">
                    For detailed inquiries about our project or collaboration opportunities, please reach out through our individual portfolio contact forms linked on this page.
                  </p>
                  
                  {/* Technologies used */}
                  <div className="mt-6">
                    <h4 className="text-sm uppercase text-muted-foreground/60 tracking-wider mb-3">Technologies Used</h4>
                    <div className="flex flex-wrap gap-2">
                      {["Next.js", "React", "Tailwind CSS", "Framer Motion", "Node.js", "MongoDB"].map((tech) => (
                        <span key={tech} className="px-3 py-1 bg-muted/30 rounded-full text-xs text-muted-foreground">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
              
              {/* Location card with interactive toggle */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <div 
                  className="relative h-[400px] rounded-2xl overflow-hidden group cursor-pointer"
                  onMouseEnter={() => setActiveLocation(true)}
                  onMouseLeave={() => setActiveLocation(false)}
                >
                  <Image
                    src="/images/ccet.jpg"
                    alt="CCET Chandigarh"
                    fill
                    className="object-cover transition-transform duration-1000 ease-out"
                    style={{
                      transform: activeLocation ? "scale(1.07)" : "scale(1)"
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent"></div>
                  
                  <div className="absolute inset-0 flex flex-col justify-end p-8">
                    <h3 className="text-2xl font-medium mb-2 flex items-center text-foreground">
                      <MapPin size={20} className="mr-2" />
                      Our Campus
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Chandigarh College of Engineering and Technology<br />
                      Sector 26, Chandigarh, India
                    </p>
                    
                    <AnimatePresence>
                      {activeLocation && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          transition={{ duration: 0.3 }}
                        >
                          <Link href="https://maps.google.com/?q=Chandigarh+College+of+Engineering+and+Technology" target="_blank" rel="noopener noreferrer">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2 rounded-full text-sm font-medium"
                            >
                              Get Directions
                              <ArrowRight size={16} />
                            </motion.button>
                          </Link>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Portfolios Section - Visual refresh */}
      <section className="relative py-24 bg-gradient-to-b from-muted/30 to-background overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-[300px] -left-[300px] w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px]"></div>
          <div className="absolute -bottom-[300px] -right-[300px] w-[600px] h-[600px] bg-secondary/10 rounded-full blur-[120px]"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-serif mb-6">Explore Our Work</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Visit our portfolio websites to see more of our projects and get in touch.
            </p>
          </motion.div>
          
          {/* Portfolio Cards - Improved design with CTA prominence */}
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Abhishek Portfolio Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              whileHover={{ y: -8 }}
            >
              <Link 
                href="https://abhisheksharma.tech/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="block h-full"
              >
                <div className="group relative h-full rounded-xl overflow-hidden border border-border transition-all duration-500 hover:border-primary/50 hover:shadow-[0_0_25px_rgba(79,70,229,0.2)]">
                  {/* Portfolio Image */}
                  <div className="h-48 relative">
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background z-10"></div>
                    <Image
                      src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070&auto=format&fit=crop"
                      alt="Developer Portfolio"
                      fill
                      className="object-cover brightness-75 transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>
                  
                  {/* Content */}
                  <div className="p-6 flex flex-col bg-card/80">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="relative w-10 h-10 rounded-full overflow-hidden">
                        <Image
                          src="https://avatars.githubusercontent.com/u/95611197?v=4"
                          alt="Abhishek Sharma"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium">Abhishek Sharma</h3>
                        <p className="text-muted-foreground/80 text-sm">Full-Stack Developer</p>
                      </div>
                    </div>
                    
                    <p className="text-muted-foreground mb-4 text-sm">
                      Full-stack developer portfolio featuring creative web applications and UI/UX projects.
                    </p>
                    
                    <div className="mt-auto">
                      <span className="inline-flex items-center text-primary gap-1 text-sm font-medium">
                        Visit Portfolio
                        <ArrowRight size={14} className="transform group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
            
            {/* Garvit Portfolio Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              whileHover={{ y: -8 }}
            >
              <Link 
                href="https://garvitnag.in/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="block h-full"
              >
                <div className="group relative h-full rounded-xl overflow-hidden border border-border transition-all duration-500 hover:border-accent/50 hover:shadow-[0_0_25px_rgba(20,184,166,0.2)]">
                  {/* Portfolio Image */}
                  <div className="h-48 relative">
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background z-10"></div>
                    <Image
                      src="https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=2069&auto=format&fit=crop"
                      alt="AI Portfolio"
                      fill
                      className="object-cover brightness-75 transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>
                  
                  {/* Content */}
                  <div className="p-6 flex flex-col bg-card/80">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="relative w-10 h-10 rounded-full overflow-hidden">
                        <Image
                          src="https://avatars.githubusercontent.com/u/154075021?v=4"
                          alt="Garvit"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium">Garvit</h3>
                        <p className="text-muted-foreground/80 text-sm">AI/ML Specialist</p>
                      </div>
                    </div>
                    
                    <p className="text-muted-foreground mb-4 text-sm">
                      AI and machine learning portfolio showcasing innovative solutions and data-driven projects.
                    </p>
                    
                    <div className="mt-auto">
                      <span className="inline-flex items-center text-emerald-400 gap-1 text-sm font-medium">
                        Visit Portfolio
                        <ArrowRight size={14} className="transform group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ContactPage;