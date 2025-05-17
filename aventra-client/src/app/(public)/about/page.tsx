"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Github, Linkedin, Globe } from "lucide-react";
import Layout from "@/components/layout/Layout";

const AboutPage = () => {
  return (
    <Layout className="bg-background text-foreground min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[60vh] overflow-hidden flex items-center justify-center">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1488085061387-422e29b40080?q=80&w=2070&auto=format&fit=crop"
            alt="World Map"
            fill
            className="object-cover opacity-40"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/50 to-background"></div>
        </div>
        
        {/* Content */}
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-6xl md:text-8xl lg:text-9xl font-serif font-bold mb-6"
          >
            ABOUT US
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-muted-foreground max-w-3xl mx-auto"
          >
            Reimagining travel planning with the power of artificial intelligence
          </motion.p>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-20 bg-gradient-to-b from-background to-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.h2 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-3xl md:text-4xl font-serif mb-8 text-center"
            >
              Our Mission
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-lg text-muted-foreground mb-6 leading-relaxed"
            >
              At Aventra, we&apos;re on a mission to transform how people plan their travels. We believe that every journey should be as unique as the traveler themselves. By combining the latest advancements in artificial intelligence with our passion for exploration, we&apos;ve created a platform that delivers personalized travel experiences tailored to your preferences and interests.
            </motion.p>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-lg text-muted-foreground leading-relaxed"
            >
              Our AI technology analyzes thousands of data points to create itineraries that balance must-see attractions with hidden gems, ensuring you experience the authentic essence of each destination. Whether you&apos;re seeking adventure, relaxation, cultural immersion, or a mix of everything, Aventra crafts the perfect journey for you.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-gradient-to-b from-muted/30 to-background">
        <div className="container mx-auto px-4">
          <motion.h2 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-3xl md:text-5xl font-serif mb-16 text-center"
          >
            Meet the Team
          </motion.h2>
          
          <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
            {/* Team Member 1 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="flex flex-col items-center bg-card/20 rounded-2xl p-8 border border-border"
            >
              <div className="relative w-48 h-48 mb-6 rounded-full overflow-hidden ring-2 ring-primary/20 shadow-lg">
                <Image
                  src="https://avatars.githubusercontent.com/u/95611197?v=4"
                  alt="Abhishek Sharma"
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="text-2xl font-medium mb-1">Abhishek Sharma</h3>
              <p className="text-muted-foreground/80 mb-4">Full-Stack Developer</p>
              <p className="text-muted-foreground text-center mb-6">
                Passionate about creating seamless user experiences and implementing cutting-edge technologies.
              </p>
              <div className="flex space-x-4">
                <Link href="https://github.com/abhisheksharm-3" target="_blank" rel="noopener noreferrer" className="text-muted-foreground/70 hover:text-primary transition-colors">
                  <Github size={24} />
                </Link>
                <Link href="https://www.linkedin.com/in/abhisheksan/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground/70 hover:text-primary transition-colors">
                  <Linkedin size={24} />
                </Link>
                <Link href="https://abhisheksharma.tech" target="_blank" rel="noopener noreferrer" className="text-muted-foreground/70 hover:text-primary transition-colors">
                  <Globe size={24} />
                </Link>
              </div>
            </motion.div>
            
            {/* Team Member 2 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex flex-col items-center bg-card/20 rounded-2xl p-8 border border-border"
            >
              <div className="relative w-48 h-48 mb-6 rounded-full overflow-hidden ring-2 ring-secondary/20 shadow-lg">
                <Image
                  src="https://avatars.githubusercontent.com/u/154075021?v=4"
                  alt="Garvit"
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="text-2xl font-medium mb-1">Garvit</h3>
              <p className="text-muted-foreground/80 mb-4">AI/ML Specialist</p>
              <p className="text-muted-foreground text-center mb-6">
                Expert in machine learning algorithms with a focus on creating intelligent travel recommendation systems.
              </p>
              <div className="flex space-x-4">
                <Link href="https://github.com/Garvit-Nag" target="_blank" rel="noopener noreferrer" className="text-muted-foreground/70 hover:text-secondary transition-colors">
                  <Github size={24} />
                </Link>
                <Link href="https://www.linkedin.com/in/garvit-nag/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground/70 hover:text-secondary transition-colors">
                  <Linkedin size={24} />
                </Link>
                <Link href="https://garvitnag.in/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground/70 hover:text-secondary transition-colors">
                  <Globe size={24} />
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Project Context */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.h2 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-3xl md:text-4xl font-serif mb-8 text-center"
            >
              Academic Project
            </motion.h2>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="bg-gradient-to-r from-primary/5 to-secondary/5 border border-border rounded-2xl p-8 backdrop-blur-sm"
            >
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Aventra was developed as our major project for the 8th semester at Panjab University. We wanted to create something that combines our technical skills with our shared passion for travel and exploration.
              </p>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                The project leverages the latest web technologies including Next.js, React, Tailwind CSS, and Framer Motion for the frontend, with a robust backend powered by Node.js and MongoDB. Our AI recommendations engine is built using TensorFlow and Python.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                This project represents not just a technical achievement, but our vision for how technology can enhance human experiences by making travel planning more accessible, personalized, and enjoyable for everyone.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-b from-background to-muted/30">
        <div className="container mx-auto px-4 text-center">
          <motion.h2 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-3xl md:text-4xl font-serif mb-8"
          >
            Start Your Journey Today
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-muted-foreground mb-10 max-w-2xl mx-auto"
          >
            Experience the future of travel planning with our AI-powered platform that creates personalized itineraries just for you.
          </motion.p>
          <Link href="/">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3 rounded-full font-medium shadow-md shadow-primary/20"
            >
              Try Aventra Now
              <ArrowRight size={18} />
            </motion.div>
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default AboutPage;