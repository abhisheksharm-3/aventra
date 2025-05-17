"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Check, ArrowRight, HelpCircle, AlertCircle, Bell } from "lucide-react";
import { cn } from "@/lib/utils";
import Layout from "@/components/layout/Layout";

const futurePricingPlans = [
  {
    name: "Free",
    description: "Perfect for curious travelers and one-time trips",
    price: "0",
    features: [
      "1 personalized itinerary per month",
      "Basic destination recommendations",
      "Standard planning tools",
      "Email support"
    ],
    popular: false,
    color: "bg-gradient-to-b from-blue-400/30 to-cyan-400/30",
    darkColor: "bg-gradient-to-b from-blue-500/20 to-cyan-500/20",
    badge: null
  },
  {
    name: "Wanderer",
    description: "For frequent travelers who want deep customization",
    price: "1,599",
    features: [
      "10 personalized itineraries per month",
      "Advanced AI recommendations",
      "Custom preferences profiles",
      "Priority email support",
      "Trip sharing with friends",
      "Offline access to itineraries"
    ],
    popular: true,
    color: "bg-gradient-to-b from-violet-400/30 to-purple-400/30",
    darkColor: "bg-gradient-to-b from-violet-500/20 to-purple-500/20",
    // badge: "Most Popular"
  },
  {
    name: "Explorer",
    description: "For travel enthusiasts and digital nomads",
    price: "3,999",
    features: [
      "Unlimited personalized itineraries",
      "Premium AI destination discovery",
      "Multiple traveler profiles",
      "24/7 priority support",
      "Group trip coordination",
      "Real-time itinerary updates",
      "Expense tracking",
      "Local experience recommendations"
    ],
    popular: false,
    color: "bg-gradient-to-b from-amber-400/30 to-orange-400/30",
    darkColor: "bg-gradient-to-b from-amber-500/20 to-orange-500/20",
    badge: null
  }
];

const FAQs = [
  {
    question: "Is Aventra currently free to use?",
    answer: "Yes! As this is our 8th semester academic project, all features are currently available for free. We're focused on developing the best AI travel planning experience possible."
  },
  {
    question: "Will Aventra become a paid service in the future?",
    answer: "We're considering developing Aventra into a standalone product in the future, which may include paid subscription tiers. The pricing model shown here represents our potential future plans, but currently everything is free to use."
  },
  {
    question: "How long will Aventra remain free?",
    answer: "Aventra will remain free throughout our academic project phase. If we decide to scale it into a commercial product, we'll provide advance notice to all users about any upcoming pricing changes."
  },
  {
    question: "Can I contribute feedback to help shape the future of Aventra?",
    answer: "Absolutely! We welcome feedback from all users. Your input helps us improve the platform and shape our future development. Please use the contact page to share your thoughts and suggestions."
  },
  {
    question: "Will there be a free tier if Aventra becomes a paid service?",
    answer: "Yes, if we transition to a commercial model, we plan to maintain a free tier with basic features, allowing users to experience the platform before committing to a paid subscription."
  }
];

const PricingPage = () => {
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">("monthly");
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [showNotify, setShowNotify] = useState<boolean>(false);

  return (
    <Layout className="bg-background text-foreground">
      {/* Academic Project Banner */}
      <div className="bg-gradient-to-r from-primary/80 via-purple-600/80 to-primary/80">
        <div className="container mx-auto px-4 py-3 text-center">
          <p className="flex items-center justify-center gap-2 text-sm font-medium text-primary-foreground">
            <AlertCircle size={16} />
            Aventra is currently free to use as part of our academic project!
          </p>
        </div>
      </div>
      
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 h-[500px] w-[500px] bg-primary/10 rounded-full blur-[120px] opacity-70"></div>
          <div className="absolute bottom-1/4 right-1/4 h-[400px] w-[400px] bg-purple-500/10 rounded-full blur-[100px] opacity-60"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-6xl md:text-8xl lg:text-9xl font-serif font-bold mb-6"
            >
              PRICING
            </motion.h1>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="mb-12 bg-gradient-to-r from-purple-500/10 to-primary/10 border  rounded-2xl p-6 backdrop-blur-sm"
            >
              <h2 className="text-2xl md:text-3xl mb-3 font-medium">Currently Free For Everyone</h2>
              <p className="text-muted-foreground mb-4">
                Aventra is our 8th semester major project at CCET Chandigarh. We&apos;re providing all features free of charge while we develop and improve the platform.
              </p>
              <p className="text-muted-foreground/70 text-sm">
                Below is our tentative pricing model if we decide to scale Aventra into a commercial product in the future.
              </p>
            </motion.div>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl text-muted-foreground max-w-3xl mx-auto mb-12"
            >
              Potential future pricing model - simple and transparent
            </motion.p>
            
            {/* Billing toggle */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="inline-flex items-center p-1 rounded-full backdrop-blur-sm mb-16 bg-muted/80"
            >
              <button 
                className={cn(
                  "px-6 py-2 rounded-full text-sm font-medium transition-all",
                  billingPeriod === "monthly" 
                    ? "bg-card text-card-foreground shadow-md" 
                    : "text-muted-foreground hover:text-foreground"
                )}
                onClick={() => setBillingPeriod("monthly")}
              >
                Monthly
              </button>
              <button 
                className={cn(
                  "px-6 py-2 rounded-full text-sm font-medium transition-all",
                  billingPeriod === "yearly" 
                    ? "bg-card text-card-foreground shadow-md" 
                    : "text-muted-foreground hover:text-foreground"
                )}
                onClick={() => setBillingPeriod("yearly")}
              >
                Yearly (20% off)
              </button>
            </motion.div>
            
            {/* Future Pricing cards */}
            <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
              {futurePricingPlans.map((plan, index) => (
                <motion.div 
                  key={plan.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 + (index * 0.1) }}
                  className={cn(
                    "relative rounded-2xl overflow-hidden",
                    "border ",
                    "bg-card/50 backdrop-blur-sm",
                    "shadow-xl shadow-black/5",
                    "transform transition-all duration-300 hover:scale-[1.02]",
                    // Important: Add extra top padding for cards with the popular badge
                    plan.popular ? "md:-mt-4 md:mb-4 pt-4" : ""
                  )}
                >
                  {/* Background gradient */}
                  <div className={cn(
                    "absolute inset-0 opacity-20",
                    plan.color,
                    "dark:" + plan.darkColor
                  )}></div>
                  
                  {/* Popular badge - Fixed positioning to avoid getting cut */}
                  {/* {plan.badge && (
                    <div className="absolute top-0 left-0 w-full flex justify-center" style={{ transform: "translateY(-50%)" }}>
                      <span className="bg-gradient-to-r from-violet-500 to-purple-600 text-white text-xs font-bold px-6 py-1.5 rounded-full shadow-lg inline-block">
                        {plan.badge}
                      </span>
                    </div>
                  )} */}
                  
                  <div className="p-8 relative z-10 flex flex-col h-full">
                    <h3 className="text-2xl font-serif mb-1">{plan.name}</h3>
                    <p className="text-muted-foreground mb-6 text-sm">{plan.description}</p>
                    
                    <div className="mb-6 relative">
                      <div className="inline-block">
                        <span className="text-4xl font-bold">₹{billingPeriod === "yearly" ? 
                          (plan.price === "0" ? "0" : 
                            Math.round(parseInt(plan.price.replace(/,/g, '')) * 0.8)
                              .toString()
                              .replace(/\B(?=(\d{3})+(?!\d))/g, ',')) 
                          : plan.price}</span>
                        <span className="text-muted-foreground ml-1">/month</span>
                      </div>
                    </div>
                    
                    <ul className="space-y-3 mb-8">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-start text-muted-foreground text-left">
                          <Check size={16} className="mr-2 mt-1 text-green-500 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <div 
                      className="mt-auto cursor-pointer"
                      onClick={() => setShowNotify(true)}
                    >
                      <motion.div
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        className={cn(
                          "w-full py-3.5 rounded-full text-center font-medium flex items-center justify-center gap-2 transition-all",
                          plan.popular 
                            ? "bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white shadow-lg shadow-purple-500/20" 
                            : "bg-muted/80 hover:bg-muted text-muted-foreground hover:text-foreground"
                        )}
                      >
                        <Bell size={16} />
                        Notify Me When Available
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            
            {/* Notification message */}
            <AnimatePresence>
              {showNotify && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="mt-10 p-5 bg-primary/5 rounded-lg border border-primary/20 shadow-lg"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-start gap-3">
                      <div className="bg-primary/10 p-1.5 rounded-full text-primary">
                        <Bell size={20} />
                      </div>
                      <p className="text-muted-foreground text-left">
                        Thanks for your interest! Currently, Aventra is completely free as part of our academic project. We&apos;ll notify you if we launch paid plans in the future.
                      </p>
                    </div>
                    <button 
                      className="text-muted-foreground hover:text-foreground ml-2 flex-shrink-0"
                      onClick={() => setShowNotify(false)}
                    >
                      <span className="sr-only">Close</span>
                      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Currently Free Section */}
      <section className="py-16 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="bg-card border  rounded-2xl p-8 shadow-xl shadow-black/5">
              <motion.div 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="text-center mb-12"
              >
                <h2 className="text-3xl md:text-4xl font-serif mb-4">Currently Available for Free</h2>
                <div className="w-24 h-1 bg-gradient-to-r from-primary to-purple-600 mx-auto mb-6"></div>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  As a major project for our 8th semester at CCET Chandigarh, Aventra is currently available for free with full access to all features.
                </p>
              </motion.div>
              
              <div className="grid md:grid-cols-2 gap-8">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="bg-muted/30 p-7 rounded-xl border  shadow-sm"
                >
                  <h3 className="text-xl font-medium mb-5">Academic Project Phase</h3>
                  <ul className="space-y-4">
                    <li className="flex items-start">
                      <div className="bg-green-100 dark:bg-green-500/20 p-1 rounded-full mr-3 mt-0.5">
                        <Check size={14} className="text-green-600 dark:text-green-400" />
                      </div>
                      <span className="text-muted-foreground">Free access to all features</span>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-green-100 dark:bg-green-500/20 p-1 rounded-full mr-3 mt-0.5">
                        <Check size={14} className="text-green-600 dark:text-green-400" />
                      </div>
                      <span className="text-muted-foreground">Unlimited itineraries and destinations</span>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-green-100 dark:bg-green-500/20 p-1 rounded-full mr-3 mt-0.5">
                        <Check size={14} className="text-green-600 dark:text-green-400" />
                      </div>
                      <span className="text-muted-foreground">Early access to new features</span>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-green-100 dark:bg-green-500/20 p-1 rounded-full mr-3 mt-0.5">
                        <Check size={14} className="text-green-600 dark:text-green-400" />
                      </div>
                      <span className="text-muted-foreground">Help shape product development</span>
                    </li>
                  </ul>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="bg-muted/30 p-7 rounded-xl border  shadow-sm"
                >
                  <h3 className="text-xl font-medium mb-4">Future Development</h3>
                  <p className="text-muted-foreground mb-5">
                    While we may consider transitioning Aventra into a commercial product in the future, our current focus is on:
                  </p>
                  <ul className="space-y-4">
                    <li className="flex items-start">
                      <div className="bg-primary/10 p-1 rounded-full mr-3 mt-0.5">
                        <Check size={14} className="text-primary" />
                      </div>
                      <span className="text-muted-foreground">Refining our AI algorithms</span>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-primary/10 p-1 rounded-full mr-3 mt-0.5">
                        <Check size={14} className="text-primary" />
                      </div>
                      <span className="text-muted-foreground">Expanding destination coverage</span>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-primary/10 p-1 rounded-full mr-3 mt-0.5">
                        <Check size={14} className="text-primary" />
                      </div>
                      <span className="text-muted-foreground">Improving user experience</span>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-primary/10 p-1 rounded-full mr-3 mt-0.5">
                        <Check size={14} className="text-primary" />
                      </div>
                      <span className="text-muted-foreground">Gathering valuable user feedback</span>
                    </li>
                  </ul>
                </motion.div>
              </div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-center mt-12"
              >
                <Link href="/">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.97 }}
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-700 text-primary-foreground px-8 py-4 rounded-full font-medium shadow-lg shadow-purple-500/20"
                  >
                    Try Aventra Now
                    <ArrowRight size={16} />
                  </motion.button>
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-serif mb-4">Frequently Asked Questions</h2>
              <div className="w-20 h-1 bg-gradient-to-r from-primary to-purple-600 mx-auto"></div>
            </motion.div>
            
            <div className="space-y-4">
              {FAQs.map((faq, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="border  rounded-xl overflow-hidden shadow-sm"
                >
                  <button 
                    className="w-full px-6 py-5 flex justify-between items-center text-left bg-card hover:bg-muted transition-colors"
                    onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                  >
                    <span className="font-medium">{faq.question}</span>
                    <div className={`h-6 w-6 rounded-full flex items-center justify-center text-primary-foreground transition-all duration-300 ${expandedFaq === index ? 'bg-primary rotate-45' : 'bg-muted-foreground'}`}>
                      <span>+</span>
                    </div>
                  </button>
                  
                  <AnimatePresence>
                    {expandedFaq === index && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="px-6 py-5 bg-muted/30 border-t "
                      >
                        <p className="text-muted-foreground">{faq.answer}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
            
            {/* Additional Question CTA */}
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="mt-16 text-center"
            >
              <p className="text-muted-foreground mb-6">Have other questions about Aventra?</p>
              <Link href="/contact">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center gap-2 bg-card hover:bg-muted text-foreground px-6 py-3 rounded-full transition-colors shadow-md"
                >
                  <HelpCircle size={18} />
                  Contact Us
                </motion.button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Future Plans Section */}
      <section className="py-24 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-r from-primary/5 to-purple-500/5 rounded-2xl p-12 border border-primary/10 shadow-lg">
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="text-center mb-10"
              >
                <h2 className="text-3xl md:text-4xl font-serif mb-6">Future Possibilities</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  If we decide to scale Aventra into a commercial product, we may explore solutions for travel agencies, corporate travel departments, and tour operators. This would include custom features tailored to business needs.
                </p>
              </motion.div>
              
              <div className="flex justify-center">
                <Link href="/contact">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-700 text-primary-foreground px-8 py-3.5 rounded-full font-medium shadow-lg shadow-purple-500/20"
                  >
                    Share Your Feedback
                    <ArrowRight size={18} />
                  </motion.div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default PricingPage;