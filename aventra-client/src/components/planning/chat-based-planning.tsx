/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, Send, RefreshCw,
  MessageSquare, FileText, Lightbulb, Sparkles, 
  Globe, Star, Smile, MapPin, Plus, Lock, 
  XCircle, Calendar, CheckCircle2, ArrowDown,
  Briefcase, Banknote, Clock, Heart,
  Home, Activity, Coffee, AccessibilityIcon,
  UserIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import Image from "next/image";
import PlanningHeader from "./planning-header";
import { User } from "@/types/appwrite";
import { useAgentStore } from "@/stores/useAgentStore";
import { useUserStore } from "@/stores/userStore";
import { useTripSubmission } from "@/hooks/useTripSubmission";
import { format, parseISO } from "date-fns";
import { toast } from "sonner";

export interface ChatBasedPlanningProps {
  onSwitchToForm: () => void;
  onBack: () => void;
  user?: User | null;
  currentDateTime?: string;
}

/**
 * Properties for the StatCard component
 */
interface StatCardProps {
  /** Icon component to display */
  icon: React.ComponentType<{ className?: string }>;
  /** Label text describing the stat */
  label: string;
  /** Value to display */
  value: string;
  /** Animation delay factor */
  delayFactor?: number;
  /** Card style variant */
  variant?: "primary" | "secondary" | "accent" | "default";
}

/**
 * A modern, animated statistics card that displays key trip metrics
 * with beautiful gradients and animations
 */
const StatCard: React.FC<StatCardProps> = ({ 
  icon: Icon, 
  label, 
  value, 
  delayFactor = 0,
  variant = "default" 
}) => {
  const variantStyles = {
    primary: "from-primary/20 to-primary/5 border-primary/30 hover:border-primary/50",
    secondary: "from-blue-500/20 to-blue-500/5 border-blue-500/30 hover:border-blue-500/50",
    accent: "from-amber-500/20 to-amber-500/5 border-amber-500/30 hover:border-amber-500/50",
    default: "from-card/70 to-card border-border/40 hover:border-border/60"
  };

  const iconStyles = {
    primary: "bg-primary/20 text-primary",
    secondary: "bg-blue-500/20 text-blue-500",
    accent: "bg-amber-500/20 text-amber-500",
    default: "bg-primary/10 text-primary"
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: delayFactor * 0.15 }}
      whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
      className={cn(
        "relative flex flex-col p-6 border rounded-xl bg-gradient-to-br shadow-md overflow-hidden transition-all duration-300",
        variantStyles[variant]
      )}
    >
      <div className="absolute -right-3 -top-3 opacity-5">
        <Icon className="h-28 w-28" />
      </div>
      <div className="space-y-3 relative z-10">
        <div className="flex items-center gap-2.5">
          <div className={cn("p-2 rounded-full", iconStyles[variant])}>
            <Icon className="h-4 w-4" />
          </div>
          <p className="text-xs font-semibold text-muted-foreground tracking-wide uppercase">{label}</p>
        </div>
        <p className="text-xl font-bold truncate">{value}</p>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute bottom-0 right-0 w-16 h-16 bg-gradient-to-tl from-background/20 to-transparent rounded-tl-3xl" />
    </motion.div>
  );
};

export default function AgentChatPlanning({
  onSwitchToForm,
  onBack,
  currentDateTime = "2025-06-01 06:50:49" // Updated timestamp
}: ChatBasedPlanningProps) {
  // Get state and actions from agent store
  const {
    isAgentModeActive,
    isLoading,
    conversation,
    currentTrip,
    tripFormData,
    isGeneratingTrip,
    toggleAgentMode,
    sendMessage,
    resetConversation,
    generateTrip,
  } = useAgentStore();

  // Get user data and preferences from user store
  const user = useUserStore(state => state.user);
  const getPreference = useUserStore(state => state.getPreference);

  // Use the TripSubmission hook for submitting the finalized trip
  const { 
    submitTrip, 
    isSubmitting, 
    isError, 
    error 
  } = useTripSubmission();

  // Local state for UI
  const [input, setInput] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  
  // Refs for scrolling and input handling
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Username display - use real user data
  const username = user?.name || "abhisheksharm-3";
  
  // Get user preferences for personalization with proper default values
  const userInterests = getPreference<string[]>('interests', []) || [];
  const userTravelStyle = getPreference<string[]>('travelStyle', []) || [];
  const userDietaryPreferences = getPreference<string[]>('dietaryPreferences', []) || [];
  const userBudgetLevel = getPreference<number>('budget', 50); // 0-100 scale
  const userBaseCity = getPreference<string>('baseCity', '') || '';
  const userTripPace = getPreference<'relaxed' | 'moderate' | 'fast'>('tripPace', 'moderate');
  const userAccessibilityNeeds = getPreference<string[]>('accessibilityNeeds', []) || [];
  
  // Budget preference text based on the 0-100 scale
  const getBudgetPreferenceText = () => {
    if (userBudgetLevel === undefined) return "mid-range";
    if (userBudgetLevel <= 30) return "budget-friendly";
    if (userBudgetLevel <= 70) return "mid-range";
    return "luxury";
  };
  
  // Subtle parallax effect for background elements
  const [scrollY, setScrollY] = useState(0);
  
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Activate agent mode when component mounts
  useEffect(() => {
    if (!isAgentModeActive) {
      toggleAgentMode();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  // Check scroll position to show/hide scroll button
  useEffect(() => {
    const scrollArea = scrollAreaRef.current;
    if (!scrollArea) return;
    
    const handleScroll = () => {
      if (!scrollArea) return;
      
      const { scrollTop, scrollHeight, clientHeight } = scrollArea;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 150;
      
      setShowScrollButton(!isNearBottom && conversation.length > 3);
    };
    
    scrollArea.addEventListener('scroll', handleScroll);
    return () => scrollArea.removeEventListener('scroll', handleScroll);
  }, [conversation.length]);

  // Adjust textarea height dynamically
  useEffect(() => {
    const textarea = inputRef.current;
    if (!textarea) return;

    const adjustHeight = () => {
      textarea.style.height = "auto";
      const newHeight = Math.min(textarea.scrollHeight, 150);
      textarea.style.height = `${newHeight}px`;
    };

    textarea.addEventListener("input", adjustHeight);
    return () => textarea.removeEventListener("input", adjustHeight);
  }, []);

  // Handle error in trip submission
  useEffect(() => {
    if (isError && error) {
      toast.error(`Failed to generate trip: ${error.message}`);
    }
  }, [isError, error]);

  // Scroll to bottom manually
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Create personalized suggestions based on user interests and preferences
  const createPersonalizedSuggestions = () => {
    const suggestions = [];
    
    // Add first suggestion based on travel style if available
    if (userTravelStyle.length > 0) {
      const travelStyle = userTravelStyle[0].toLowerCase();
      suggestions.push({
        icon: Activity,
        text: `I want a ${travelStyle} vacation in ${userInterests.length > 0 ? 'a place with ' + (userInterests[0] || '').toLowerCase() : 'Europe'}`
      });
    } else {
      suggestions.push({
        icon: MapPin,
        text: "I want to visit Japan during cherry blossom season"
      });
    }
    
    // Add second suggestion based on base city if available
    if (userBaseCity) {
      suggestions.push({
        icon: Home,
        text: `Plan a trip from ${userBaseCity} to a ${getBudgetPreferenceText()} destination`
      });
    } else {
      suggestions.push({
        icon: Calendar,
        text: "Plan a 10-day trip to Mongolia in June"
      });
    }
    
    // Add third suggestion based on user interests if available
    if (userInterests.length > 0) {
      const interest = userInterests[0].toLowerCase();
      suggestions.push({
        icon: Heart,
        text: `I'm looking for a destination with great ${interest} experiences`
      });
    } else {
      suggestions.push({
        icon: Globe,
        text: "I'm interested in a safari adventure in Tanzania"
      });
    }
    
    // Add fourth suggestion based on budget preference
    suggestions.push({
      icon: Banknote,
      text: `I need a ${getBudgetPreferenceText()} vacation for two weeks`
    });
    
    // Add dietary preferences if available
    if (userDietaryPreferences.length > 0) {
      suggestions.push({
        icon: Coffee,
        text: `I'm ${userDietaryPreferences[0].toLowerCase()} and need suitable food options`
      });
    }
    
    // Add accessibility needs if available
    if (userAccessibilityNeeds.length > 0 && userAccessibilityNeeds[0] !== "none") {
      suggestions.push({
        icon: AccessibilityIcon,
        text: `I need options suitable for travelers with ${userAccessibilityNeeds[0].toLowerCase()} needs`
      });
    }
    
    // Limit to 4 suggestions
    return suggestions.slice(0, 4);
  };

  // Get personalized suggestions
  const suggestedQueries = createPersonalizedSuggestions();

  // Handle sending a message
  const handleSendMessage = () => {
    if (input.trim() === "") return;
    sendMessage(input);
    setInput("");
  };

  // Handle keyboard shortcuts
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Handle suggestion clicks
  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Handle trip submission
  const handleConfirmTrip = () => {
    if (!tripFormData) {
      toast.error("Trip data is incomplete. Please continue the conversation.");
      return;
    }

    // Add a confirmation message to the conversation
    sendMessage("I'd like to confirm this trip plan");

    // Submit the trip using the hook
    submitTrip(tripFormData);
  };

  // Format timestamp for display
  const formatTimestamp = (timestamp: string) => {
    try {
      return format(parseISO(timestamp), 'HH:mm');
    } catch (e) {
      return format(new Date(), 'HH:mm');
    }
  };

  // Calculate trip progress
  const hasTripDestination = !!(currentTrip.location?.destination);
  const hasTripDates = !!(currentTrip.dates?.startDate && currentTrip.dates?.endDate);
  const hasTripBudget = !!(currentTrip.budget?.ceiling);
  const hasTripStyle = !!(currentTrip.tripStyle && currentTrip.tripStyle.length > 0);
  const hasTripTravelers = !!(currentTrip.travelers?.count);
  
  const tripProgress = [
    { label: "Destination", completed: hasTripDestination },
    { label: "Travel Dates", completed: hasTripDates },
    { label: "Travelers", completed: hasTripTravelers },
    { label: "Budget", completed: hasTripBudget },
    { label: "Trip Style", completed: hasTripStyle },
    { label: "Preferences", completed: !!(currentTrip.preferences) },
  ];

  // Calculate trip stats for display
  const calculateDuration = (): string => {
    if (currentTrip.dates?.startDate && currentTrip.dates?.endDate) {
      const start = new Date(currentTrip.dates.startDate);
      const end = new Date(currentTrip.dates.endDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return `${diffDays} ${diffDays === 1 ? "day" : "days"}`;
    }
    return "Not set";
  };

  const formatDateRange = (): string => {
    if (currentTrip.dates?.startDate && currentTrip.dates?.endDate) {
      const start = new Date(currentTrip.dates.startDate).toLocaleDateString(
        "en-US",
        { month: "short", day: "numeric" }
      );
      const end = new Date(currentTrip.dates.endDate).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      return `${start} - ${end}`;
    }
    return "Not set";
  };

  const formatBudget = (): string => {
    if (currentTrip.budget?.ceiling) {
      const currency = currentTrip.budget.currency || "USD";
      const symbol = currency === "USD" ? "$" : currency;
      const amount = new Intl.NumberFormat("en-US").format(
        currentTrip.budget.ceiling
      );
      return `${symbol}${amount}`;
    }
    return "Not set";
  };

  // Calculate if we have enough information for a trip plan
  const hasPlan = Object.values(tripProgress).filter(item => item.completed).length >= 3;
  const showTripStats = !!(currentTrip.location?.destination || currentTrip.dates?.startDate);

  // Get user's avatar URL or fallback
  const avatarUrl = user?.avatarUrl || '';

  // Personalize greeting message based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  // Generate a personalized subtitle for the header
  const getPersonalizedSubtitle = () => {
    let subtitle = "Chat with our AI assistant to create your perfect";
    
    if (userTravelStyle.length > 0) {
      subtitle += ` ${userTravelStyle[0].toLowerCase()}`;
    } else if (getBudgetPreferenceText()) {
      subtitle += ` ${getBudgetPreferenceText()}`;
    }
    
    subtitle += " travel experience";
    
    if (userBaseCity) {
      subtitle += ` from ${userBaseCity}`;
    }
    
    return subtitle;
  };

  // Create an example prompt based on user preferences
  const createPersonalizedExamplePrompt = () => {
    let prompt = "I'm planning a ";
    
    // Add trip duration
    prompt += userTripPace === 'fast' ? "7-day" : userTripPace === 'relaxed' ? "14-day" : "10-day";
    
    // Add destination (random placeholder)
    prompt += " trip to Mongolia";
    
    // Add time frame
    prompt += " in June";
    
    // Add travel companions
    prompt += " with my partner";
    
    // Add interests
    if (userInterests && Array.isArray(userInterests) && userInterests.length > 0) {
      prompt += `. We love ${userInterests.slice(0, 2).join(' and ')}`;
    } else {
      prompt += ". We love outdoor adventures and photography";
    }
    
    // Add culture interest
    prompt += " and experiencing local culture";
    
    // Add budget
    prompt += `. Our budget is around $${(userBudgetLevel ?? 50) < 30 ? "2000" : (userBudgetLevel ?? 50) > 70 ? "5000" : "3000"} per person excluding flights`;
    
    // Add dietary preferences if any
    if (userDietaryPreferences.length > 0) {
      prompt += `. We are ${userDietaryPreferences[0].toLowerCase()} and need suitable dining options`;
    }
    
    // Add accessibility needs if any
    if (userAccessibilityNeeds.length > 0 && userAccessibilityNeeds[0] !== "none") {
      prompt += `. We require ${userAccessibilityNeeds[0].toLowerCase()} accessible accommodations`;
    }
    
    return prompt;
  };

  // Create personalized example prompt
  const examplePrompt = createPersonalizedExamplePrompt();
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background/98 to-background/95 pb-8">
      {/* Header Area with refined styling */}
      <div className="relative">
        <PlanningHeader
          user={user || null}
          title="Design Your Journey"
          subtitle={getPersonalizedSubtitle()}
          action={
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Button
                variant="outline"
                size="sm"
                onClick={onBack}
                className="gap-1.5 hover:bg-background/80 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back</span>
              </Button>
            </motion.div>
          }
        />
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 pb-16">
        <div className="flex flex-col space-y-8">
          {/* Planning mode selection tabs with modern styling */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex justify-center"
          >
            <div className="w-full max-w-md bg-gradient-to-r from-background via-background/95 to-background p-0.5 rounded-xl shadow-lg border border-border/30">
              <Tabs defaultValue="chat" className="w-full">
                <TabsList className="grid grid-cols-2 w-full bg-muted/40 rounded-lg">
                  <TabsTrigger 
                    value="form" 
                    className="rounded-lg transition-all duration-300 py-3"
                    onClick={(e) => {
                      e.preventDefault();
                      onSwitchToForm();
                    }}
                  >
                    <div className="flex items-center gap-2.5">
                      <Briefcase className="h-4 w-4" />
                      <span className="text-sm font-medium">Trip Builder</span>
                    </div>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="chat" 
                    className="data-[state=active]:bg-white dark:data-[state=active]:bg-background rounded-lg data-[state=active]:shadow-md transition-all duration-300"
                  >
                    <div className="flex items-center gap-2.5">
                      <MessageSquare className="h-4 w-4" />
                      <span className="text-sm font-medium">AI Chat</span>
                    </div>
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </motion.div>

          {/* Trip Statistics Display */}
          {showTripStats && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-5"
            >
              <StatCard 
                icon={Globe} 
                label="Destination" 
                value={currentTrip.location?.destination || "Not set"} 
                delayFactor={0}
                variant="primary"
              />
              <StatCard 
                icon={Calendar} 
                label="Dates" 
                value={formatDateRange()} 
                delayFactor={1}
                variant="secondary"
              />
              <StatCard 
                icon={Clock} 
                label="Duration" 
                value={calculateDuration()} 
                delayFactor={2} 
                variant="accent"
              />
              <StatCard 
                icon={Banknote} 
                label="Budget" 
                value={formatBudget()} 
                delayFactor={3} 
              />
            </motion.div>
          )}
          
          {/* Main chat area with inspired styling from form-based planner */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="lg:col-span-3"
            >
              {/* Hero Banner with refined styling and personalized content */}
              <Card className="overflow-hidden border-border/40 shadow-xl hover:shadow-2xl transition-shadow duration-500 mb-6">
                <div className="relative h-48 md:h-56 w-full">
                  <Image
                    src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80"
                    alt="AI Travel Assistant"
                    fill
                    className="object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/60 to-black/20">
                    <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-primary/20 to-transparent opacity-40"></div>
                  </div>
                  <div className="absolute inset-0 flex flex-col justify-end p-6">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                      <div>
                        <Badge
                          variant="outline"
                          className="bg-black/40 text-white border-white/20 backdrop-blur-sm mb-3"
                        >
                          Powered by Aventra
                        </Badge>
                        <h2 className="text-white text-2xl md:text-3xl font-serif font-medium mb-1">
                          {getGreeting()}, {username.split(' ')[0]}!
                        </h2>
                        <p className="text-white/80 max-w-xl">
                          {userBaseCity 
                            ? `Let's plan your journey from ${userBaseCity} to your dream destination.`
                            : "Tell me where you want to go, when, and your interests — I'll create a personalized itinerary just for you."}
                        </p>
                      </div>

                      {/* AI Assistant status badge */}
                      <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-black/30 backdrop-blur-sm border border-white/10 self-start">
                        <div className="relative">
                          <div className="h-10 w-10 rounded-full overflow-hidden bg-primary/20 flex items-center justify-center">
                            <Sparkles className="h-5 w-5 text-primary/70" />
                          </div>
                          <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-black flex items-center justify-center bg-emerald-500">
                            <CheckCircle2 className="h-2 w-2 text-white" />
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <p className="text-white text-sm font-medium">
                              AventrAI
                            </p>
                            <Badge className="bg-emerald-500/20 text-emerald-400 text-[9px] px-1 py-0 h-4 border-emerald-600/30">
                              Live
                            </Badge>
                          </div>
                          <p className="text-white/70 text-xs">
                            Ready to assist
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Chat Card with refined styling */}
              <Card className="overflow-hidden border-border/30 shadow-xl hover:shadow-2xl transition-shadow duration-500">
                <div
                  ref={chatContainerRef}
                  className="h-[500px] relative"
                >
                  <ScrollArea className="h-full" ref={scrollAreaRef}>
                    <div className="p-4 pt-5 space-y-6">
                      {conversation.map((message, index) => {
                        if (message.role === "system") {
                          return (
                            <div
                              key={message.id}
                              className="flex justify-center"
                            >
                              <div className="text-xs px-2 py-1 text-center rounded-md bg-muted/30 text-muted-foreground">
                                {message.content}
                              </div>
                            </div>
                          );
                        }

                        return (
                          <div
                            key={message.id}
                            className={cn(
                              "flex w-full",
                              message.role === "user"
                                ? "justify-end"
                                : "justify-start"
                            )}
                          >
                            <div
                              className={cn(
                                "flex gap-3 max-w-[85%]",
                                message.role === "user"
                                  ? "flex-row-reverse"
                                  : "flex-row"
                              )}
                            >
                              {/* Avatar */}
                              {message.role === "agent" ? (
                                <div className="h-10 w-10 rounded-full overflow-hidden bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0 mt-1">
                                  <Sparkles className="h-5 w-5 text-primary" />
                                </div>
                              ) : (
                                <Avatar className="h-10 w-10 flex-shrink-0 mt-1">
                                  <AvatarImage
                                    src={avatarUrl}
                                    alt={username}
                                  />
                                  <AvatarFallback className="text-xs bg-muted">
                                    {username
                                      .substring(0, 2)
                                      .toUpperCase()}
                                  </AvatarFallback>
                                </Avatar>
                              )}

                              {/* Message content */}
                              <div
                                className={cn(
                                  "space-y-2",
                                  message.role === "user"
                                    ? "items-end"
                                    : "items-start"
                                )}
                              >
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-medium">
                                    {message.role === "agent"
                                      ? "AventrAI"
                                      : username}
                                  </span>
                                  <span className="text-xs text-muted-foreground">
                                    {formatTimestamp(message.timestamp)}
                                  </span>
                                </div>

                                <div
                                  className={cn(
                                    "rounded-xl p-4",
                                    message.role === "agent"
                                      ? "bg-muted/40 text-foreground border border-border/40"
                                      : "bg-primary/10 text-foreground"
                                  )}
                                >
                                  <div className="whitespace-pre-wrap text-sm">
                                    {message.content}
                                  </div>

                                  {/* Trip generation action buttons */}
                                  {message.role === "agent" && 
                                   index === conversation.length - 1 && 
                                   hasPlan && 
                                   !tripFormData && (
                                    <div className="mt-4 flex flex-wrap gap-2">
                                      <Button
                                        variant="secondary"
                                        size="sm"
                                        className="h-8 bg-background/80"
                                        onClick={generateTrip}
                                        disabled={isGeneratingTrip || isLoading}
                                      >
                                        Generate my trip plan
                                      </Button>
                                    </div>
                                  )}

                                  {/* Trip confirmation action buttons */}
                                  {message.role === "agent" && 
                                   tripFormData && 
                                   index === conversation.length - 1 && (
                                    <div className="mt-4 flex flex-wrap gap-2">
                                      <Button
                                        variant="default"
                                        size="sm"
                                        className="h-8"
                                        onClick={handleConfirmTrip}
                                        disabled={isSubmitting}
                                      >
                                        {isSubmitting ? "Confirming..." : "Confirm this trip plan"}
                                      </Button>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-8"
                                        onClick={() => sendMessage("I'd like to modify this trip plan")}
                                        disabled={isSubmitting}
                                      >
                                        Make changes
                                      </Button>
                                    </div>
                                  )}
                                </div>

                                {/* Badges/metadata for trip details */}
                                {message.role === "agent" &&
                                  index === conversation.length - 1 && 
                                  hasTripDestination && (
                                    <div className="flex items-center gap-1.5 flex-wrap">
                                      {currentTrip.location?.destination && (
                                        <Badge
                                          variant="outline"
                                          className="text-[10px] h-5 bg-primary/5 hover:bg-primary/10 px-2 gap-1"
                                        >
                                          <MapPin className="h-2.5 w-2.5" />
                                          {currentTrip.location.destination}
                                        </Badge>
                                      )}
                                      {currentTrip.dates?.startDate && currentTrip.dates?.endDate && (
                                        <Badge
                                          variant="outline"
                                          className="text-[10px] h-5 bg-primary/5 hover:bg-primary/10 px-2 gap-1"
                                        >
                                          <Calendar className="h-2.5 w-2.5" />
                                          {new Date(currentTrip.dates.startDate).toLocaleDateString()} - {new Date(currentTrip.dates.endDate).toLocaleDateString()}
                                        </Badge>
                                      )}
                                      {currentTrip.budget?.ceiling && (
                                        <Badge
                                          variant="outline"
                                          className="text-[10px] h-5 bg-primary/5 hover:bg-primary/10 px-2 gap-1"
                                        >
                                          <Star className="h-2.5 w-2.5" />
                                          {currentTrip.budget.ceiling} {currentTrip.budget.currency || "USD"}
                                        </Badge>
                                      )}
                                      {userTripPace && (
                                        <Badge
                                          variant="outline"
                                          className="text-[10px] h-5 bg-primary/5 hover:bg-primary/10 px-2 gap-1"
                                        >
                                          <Activity className="h-2.5 w-2.5" />
                                          {userTripPace.charAt(0).toUpperCase() + userTripPace.slice(1)} pace
                                        </Badge>
                                      )}
                                    </div>
                                  )}
                              </div>
                            </div>
                          </div>
                        );
                      })}

                      {(isLoading || isSubmitting) && (
                        <div className="flex w-full justify-start">
                          <div className="flex gap-3 max-w-[85%]">
                            <div className="h-10 w-10 rounded-full overflow-hidden bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0 mt-1">
                              <Sparkles className="h-5 w-5 text-primary" />
                            </div>
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium">
                                  AventrAI
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  {format(new Date(), 'HH:mm')}
                                </span>
                              </div>
                              <div className="rounded-xl p-4 bg-muted/40 text-foreground border border-border/40">
                                <div className="flex items-center h-6">
                                  <div className="flex space-x-1.5">
                                    <div className="h-2 w-2 bg-primary/60 rounded-full animate-bounce"></div>
                                    <div className="h-2 w-2 bg-primary/60 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                                    <div className="h-2 w-2 bg-primary/60 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                      <div ref={messagesEndRef} />
                    </div>
                  </ScrollArea>
                  
                  {/* Scroll to bottom button */}
                  {showScrollButton && (
                    <div className="absolute bottom-4 right-4">
                      <Button
                        size="icon"
                        variant="secondary"
                        className="h-10 w-10 rounded-full shadow-md"
                        onClick={scrollToBottom}
                      >
                        <ArrowDown className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>

                {/* Chat input area */}
                <div className="p-4 border-t border-border/40 bg-muted/5">
                  {!hasPlan && (
                    <div className="mb-3 px-1">
                      <p className="text-xs font-medium text-muted-foreground mb-2">
                        Try asking about:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {suggestedQueries.map((suggestion, idx) => (
                          <Badge
                            key={idx}
                            variant="outline"
                            className="cursor-pointer hover:bg-muted transition-colors py-1.5 pl-2 pr-3 gap-1"
                            onClick={() =>
                              handleSuggestionClick(suggestion.text)
                            }
                          >
                            <suggestion.icon className="h-3 w-3" />
                            {suggestion.text}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex flex-col gap-2">
                    <div className="relative">
                      <textarea
                        ref={inputRef}
                        placeholder={userBaseCity 
                          ? `Tell me about your dream trip from ${userBaseCity}...` 
                          : "Describe your dream trip..."}
                        className="w-full rounded-xl border border-border/60 bg-background focus:outline-none focus:ring-1 focus:ring-primary px-4 py-3 min-h-[56px] max-h-[150px] resize-none pr-20"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        disabled={isLoading || isSubmitting}
                        rows={1}
                      />
                      <div className="absolute right-2 bottom-2 flex items-center gap-1.5">
                        <AnimatePresence>
                          {input.trim().length > 0 && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.8 }}
                              transition={{ duration: 0.15 }}
                            >
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 rounded-full text-muted-foreground hover:text-destructive"
                                onClick={() => setInput("")}
                                disabled={isLoading || isSubmitting}
                              >
                                <XCircle className="h-4 w-4" />
                              </Button>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground"
                          type="button"
                          disabled={isLoading || isSubmitting}
                          onClick={() =>
                            setShowEmojiPicker(!showEmojiPicker)
                          }
                        >
                          <Smile className="h-4 w-4" />
                        </Button>

                        <Button
                          className="h-9 rounded-full px-4 gap-1.5 shadow-sm"
                          onClick={handleSendMessage}
                          disabled={isLoading || isSubmitting || input.trim() === ""}
                        >
                          <span>Send</span>
                          <Send className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between px-1">
                      <p className="text-[10px] text-muted-foreground">
                        AI may generate inaccurate information. Verify
                        important details.
                      </p>
                      <div className="flex items-center gap-2">
                        <Lock className="h-3 w-3 text-muted-foreground" />
                        <span className="text-[10px] text-muted-foreground">
                          End-to-end encrypted
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
              
              {/* Last updated information */}
              {hasPlan && (
                <div className="flex justify-end mt-2">
                  <p className="text-xs text-muted-foreground">
                    Last updated: {currentDateTime} UTC
                  </p>
                </div>
              )}
            </motion.div>
            
            {/* Right Column - Sidebar with matching form-based styling */}
            <motion.div 
              className="hidden lg:block"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              style={{
                transform: `translateY(${scrollY * 0.05}px)`, // Subtle parallax effect
              }}
            >
              <div className="space-y-6 sticky top-6">
                {/* User Preferences Card */}
                {(userInterests.length > 0 || userTravelStyle.length > 0 || userDietaryPreferences.length > 0) && (
                  <Card className="overflow-hidden border-border/30 rounded-xl shadow-lg hover:shadow-xl transition-all duration-500">
                    <div className="p-4 border-b border-border/20 bg-gradient-to-r from-blue-500/15 to-transparent">
                      <div className="flex items-center gap-2.5">
                        <div className="bg-blue-500/20 p-2 rounded-full">
                          <UserIcon className="h-4 w-4 text-blue-500" />
                        </div>
                        <h3 className="font-medium text-base">Your Preferences</h3>
                      </div>
                    </div>
                    
                    <div className="p-5">
                      {/* Display user preferences as badges */}
                      <div className="space-y-3">
                        {userInterests.length > 0 && (
                          <div>
                            <p className="text-xs font-medium text-muted-foreground mb-1.5">Interests</p>
                            <div className="flex flex-wrap gap-1.5">
                              {Array.isArray(userInterests) && userInterests.map((interest, idx) => (
                                <Badge key={idx} variant="outline" className="bg-blue-500/5 text-blue-600/90">
                                  {interest}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {userTravelStyle && Array.isArray(userTravelStyle) && userTravelStyle.length > 0 && (
                          <div>
                            <p className="text-xs font-medium text-muted-foreground mb-1.5">Travel Style</p>
                            <div className="flex flex-wrap gap-1.5">
                              {userTravelStyle.map((style, idx) => (
                                <Badge key={idx} variant="outline" className="bg-primary/5 text-primary/90">
                                  {style}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {Array.isArray(userDietaryPreferences) && userDietaryPreferences.length > 0 && (
                          <div>
                            <p className="text-xs font-medium text-muted-foreground mb-1.5">Dietary Preferences</p>
                            <div className="flex flex-wrap gap-1.5">
                              {userDietaryPreferences.map((diet, idx) => (
                                <Badge key={idx} variant="outline" className="bg-amber-500/5 text-amber-600/90">
                                  {diet}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {Array.isArray(userAccessibilityNeeds) && userAccessibilityNeeds.length > 0 && userAccessibilityNeeds[0] !== "none" && (
                          <div>
                            <p className="text-xs font-medium text-muted-foreground mb-1.5">Accessibility Needs</p>
                            <div className="flex flex-wrap gap-1.5">
                              {userAccessibilityNeeds.map((need, idx) => (
                                <Badge key={idx} variant="outline" className="bg-emerald-500/5 text-emerald-600/90">
                                  {need}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        <div className="flex items-center gap-1.5 pt-1.5 text-xs text-muted-foreground">
                          <p>Trip Pace:</p>
                          <Badge variant="secondary" className="text-[10px]">
                            {userTripPace ? userTripPace.charAt(0).toUpperCase() + userTripPace.slice(1) : 'Moderate'}
                          </Badge>

                          <p className="ml-2">Budget Level:</p>
                          <Badge variant="secondary" className="text-[10px]">
                            {getBudgetPreferenceText()}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </Card>
                )}

                {/* Trip Progress Card */}
                <Card className="overflow-hidden border-border/30 rounded-xl shadow-lg hover:shadow-xl transition-all duration-500">
                  <div className="p-4 border-b border-border/20 bg-gradient-to-r from-primary/15 to-transparent">
                    <div className="flex items-center gap-2.5">
                      <div className="bg-primary/20 p-2 rounded-full">
                        <Globe className="h-4 w-4 text-primary" />
                      </div>
                      <h3 className="font-medium text-base">Trip Progress</h3>
                    </div>
                  </div>
                  
                  <div className="p-5">
                    {/* Progress tracker */}
                    <div className="space-y-3 mb-5">
                      {tripProgress.map((item, idx) => (
                        <div
                          key={idx}
                          className={cn(
                            "flex items-center gap-3 px-3 py-2 rounded-md",
                            item.completed &&
                              "bg-primary/5 border-l-2 border-primary"
                          )}
                        >
                          <div
                            className={cn(
                              "h-6 w-6 rounded-full flex items-center justify-center text-xs",
                              item.completed
                                ? "bg-primary text-white"
                                : "bg-muted text-muted-foreground"
                            )}
                          >
                            {item.completed ? (
                              <CheckCircle2 className="h-3.5 w-3.5" />
                            ) : (
                              idx + 1
                            )}
                          </div>
                          <span
                            className={cn(
                              "text-sm",
                              item.completed && "text-primary font-medium"
                            )}
                          >
                            {item.label}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-3">
                      {tripFormData ? (
                        <Button
                          className="w-full gap-2"
                          onClick={handleConfirmTrip}
                          disabled={isSubmitting}
                        >
                          <Star className="h-4 w-4" />
                          {isSubmitting ? "Processing..." : "Create Itinerary"}
                        </Button>
                      ) : hasPlan ? (
                        <Button
                          className="w-full gap-2"
                          onClick={generateTrip}
                          disabled={isGeneratingTrip || isLoading}
                        >
                          <Star className="h-4 w-4" />
                          Generate Trip Plan
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          className="w-full gap-2"
                          onClick={onSwitchToForm}
                        >
                          <FileText className="h-4 w-4" />
                          Try Form Instead
                        </Button>
                      )}

                      <Button
                        variant="outline"
                        className="w-full gap-2 text-muted-foreground justify-between"
                        onClick={() => resetConversation()}
                        disabled={isLoading || isSubmitting}
                      >
                        <div className="flex items-center gap-2">
                          <RefreshCw className="h-4 w-4" />
                          <span>Start Over</span>
                        </div>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>

                {/* Tips Card */}
                <Card className="overflow-hidden border-border/30 rounded-xl shadow-lg hover:shadow-xl transition-all duration-500">
                  <div className="p-4 border-b border-amber-500/10 bg-gradient-to-r from-amber-500/15 to-transparent">
                    <div className="flex items-center gap-2.5">
                      <div className="bg-amber-500/20 p-2 rounded-full">
                        <Lightbulb className="h-4 w-4 text-amber-500" />
                      </div>
                      <h3 className="font-medium text-base">Chat Tips</h3>
                    </div>
                  </div>
                  
                  <div className="p-5 space-y-3 text-sm">
                    {[
                      "Be specific about destinations, dates, and activities you enjoy",
                      `Ask about ${getBudgetPreferenceText()} options for your journey`,
                      userTripPace === "relaxed" 
                        ? "Request itineraries with plenty of downtime between activities" 
                        : userTripPace === "fast" 
                          ? "Ask for itineraries that maximize experiences in a short time"
                          : "Ask for recommendations for local experiences and hidden gems",
                      userDietaryPreferences.length > 0 
                        ? `Remind the AI about your ${userDietaryPreferences[0].toLowerCase()} dietary preferences` 
                        : "Specify any dietary restrictions or accessibility needs",
                    ].map((tip, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <div className="h-5 w-5 rounded-full bg-amber-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-xs font-medium text-amber-500">
                            {i + 1}
                          </span>
                        </div>
                        <p className="text-muted-foreground">{tip}</p>
                      </div>
                    ))}
                  </div>

                  {/* Sample prompt */}
                  <div className="border-t border-border/30 p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <Lightbulb className="h-4 w-4 text-amber-500" />
                      <h4 className="text-sm font-medium">
                        Example prompt
                      </h4>
                    </div>
                    <div className="bg-muted/30 rounded-lg p-3 text-sm italic text-muted-foreground">
                      &quot;{examplePrompt}&quot;
                    </div>
                    <Button
                      size="sm"
                      variant="link"
                      className="mt-2 h-auto p-0 text-xs"
                      onClick={() => handleSuggestionClick(examplePrompt)}
                    >
                      Use this example
                    </Button>
                  </div>
                </Card>

                {/* User info display */}
                <Card className="border-border/30 shadow-lg hover:shadow-xl transition-all duration-500 overflow-hidden">
                  <div className="p-4 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarImage
                          src={avatarUrl}
                          alt={username}
                        />
                        <AvatarFallback className="text-xs bg-muted">
                          {username.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{username}</p>
                        <p className="text-xs text-muted-foreground">
                          Session started: {currentDateTime} UTC
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline" className="gap-1.5">
                      <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                      <span className="text-xs">Active</span>
                    </Badge>
                  </div>
                </Card>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}