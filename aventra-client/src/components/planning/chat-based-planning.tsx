"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Send,
  RefreshCw,
  Share2,
  Download,
  MessageSquare,
  FileText,
  Lightbulb,
  Sparkles,
  Globe,
  Star,
  Smile,
  MapPin,
  Plus,
  Lock,
  XCircle,
  Calendar,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import Image from "next/image";
import PlanningHeader from "./planning-header";
import { useUser } from "@/hooks/useUser";
import { InspirationTab } from "../common/inspiration-tab";

interface ChatBasedPlanningProps {
  onSwitchToForm: () => void;
  onBack: () => void;
}

type MessageType = {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
  attachments?: string[];
  actions?: {
    label: string;
    action: string;
  }[];
};

export default function ChatBasedPlanning({
  onSwitchToForm,
  onBack,
}: ChatBasedPlanningProps) {
  // Current date/time from the input
  const currentDateTime = "2025-05-10 13:19:30";

  // Use the hook to get user data
  const { user, isLoading } = useUser();

  const [messages, setMessages] = useState<MessageType[]>([
    {
      id: "welcome",
      role: "system",
      content: `Chat started on ${currentDateTime} UTC`,
      timestamp: new Date(currentDateTime),
    },
    {
      id: "1",
      role: "assistant",
      content:
        "Hi there! I'm AventrAI, your personal travel assistant. Tell me about the trip you're planning. Where would you like to go, when are you traveling, and what are you interested in?",
      timestamp: new Date(currentDateTime),
    },
  ]);

  const [input, setInput] = useState("");
  const [isAILoading, setIsAILoading] = useState(false);
  const [hasPlan, setHasPlan] = useState(false);
  const [selectedTab, setSelectedTab] = useState<string>("chat");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Get username for display
  const username = user?.name || user?.email?.split("@")[0] || "Guest";

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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

  // Sample destinations for suggestions
  const suggestedQueries = [
    { icon: MapPin, text: "Japan in cherry blossom season" },
    { icon: Calendar, text: "10-day trip to Mongolia in June" },
    { icon: Globe, text: "Safari adventure in Tanzania" },
    { icon: Star, text: "Luxury beach vacation in Maldives" },
  ];

  const sendMessage = () => {
    if (input.trim() === "") return;

    // Add user message
    const userMessage: MessageType = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsAILoading(true);

    // Simulate AI response
    setTimeout(() => {
      // Sample AI response logic
      let aiResponse =
        "I'm working on your travel plan based on what you've told me. Could you also let me know your budget range and how long you're planning to stay?";
      let actions: { label: string; action: string }[] = [];

      // For demo purposes, if user mentions Mongolia, show a more specific response
      if (input.toLowerCase().includes("mongolia")) {
        aiResponse =
          "Mongolia is an amazing choice for adventure travel! The best time to visit is from May to September when the weather is most pleasant.\n\nBased on your interest, I recommend:\n• Exploring the vast Gobi Desert\n• Horseback riding with nomadic families\n• Staying in traditional ger camps\n• Visiting the ancient capital of Karakorum\n\nWould you like me to create a detailed itinerary with these experiences?";
        setHasPlan(true);
        actions = [
          { label: "Create detailed itinerary", action: "create_itinerary" },
          { label: "Suggest accommodations", action: "suggest_accommodations" },
          { label: "Show best time to visit", action: "show_best_time" },
        ];
      }

      const assistantMessage: MessageType = {
        id: Date.now().toString(),
        role: "assistant",
        content: aiResponse,
        timestamp: new Date(),
        actions: actions.length > 0 ? actions : undefined,
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setIsAILoading(false);
    }, 1500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // If still loading user data, show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center animate-pulse">
            <Sparkles className="h-5 w-5 text-primary/70" />
          </div>
          <p className="text-muted-foreground">Loading AventrAI...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/5 pb-8">
      {/* Header Area */}
      <div className="max-w-7xl mx-auto px-4">
        <PlanningHeader
          user={user}
          title="AventrAI Travel Assistant"
          subtitle="Describe your dream trip and let our AI create your perfect itinerary"
          action={
            <Button
              variant="ghost"
              size="sm"
              className="gap-2"
              onClick={onBack}
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Choose Another Method</span>
              <span className="inline sm:hidden">Back</span>
            </Button>
          }
        />
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4">
        {/* Tabs Navigation - Moved outside the banner */}
        <div className="mb-6">
          <Tabs
            defaultValue="chat"
            value={selectedTab}
            onValueChange={setSelectedTab}
            className="w-full"
          >
            <div className="flex items-center justify-between mb-4">
              <TabsList className="bg-muted/50 p-1 h-auto">
                <TabsTrigger
                  value="chat"
                  className={cn(
                    "flex items-center gap-2 data-[state=active]:bg-background rounded-md transition-all px-4 py-2",
                    "data-[state=active]:shadow-sm"
                  )}
                >
                  <MessageSquare className="h-4 w-4" />
                  <span>AI Chat</span>
                </TabsTrigger>
                <TabsTrigger
                  value="inspiration"
                  className={cn(
                    "flex items-center gap-2 data-[state=active]:bg-background rounded-md transition-all px-4 py-2",
                    "data-[state=active]:shadow-sm"
                  )}
                >
                  <Lightbulb className="h-4 w-4" />
                  <span>Inspiration</span>
                </TabsTrigger>
                <TabsTrigger
                  value="form"
                  className={cn(
                    "flex items-center gap-2 data-[state=active]:bg-background rounded-md transition-all px-4 py-2",
                    "data-[state=active]:shadow-sm"
                  )}
                  onClick={(e) => {
                    e.preventDefault();
                    onSwitchToForm();
                  }}
                >
                  <FileText className="h-4 w-4" />
                  <span>Form Builder</span>
                </TabsTrigger>
              </TabsList>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1 text-sm hidden md:flex"
                  disabled={!hasPlan}
                >
                  <Share2 className="h-3.5 w-3.5" />
                  Share
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1 text-sm hidden md:flex"
                  disabled={!hasPlan}
                >
                  <Download className="h-3.5 w-3.5" />
                  Export
                </Button>
              </div>
            </div>

            {/* Tab Content */}
            <TabsContent
              value="chat"
              className="mt-0 focus-visible:outline-none focus-visible:ring-0"
            >
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
                  {/* Main Chat Area */}
                  <div className="xl:col-span-8 space-y-6">
                    {/* Hero Banner - Premium Design */}
                    <div className="rounded-xl overflow-hidden shadow-sm border border-border/40 relative">
                      {/* Full bleed image with no spacing */}
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
                                Let&apos;s Plan Your Adventure
                              </h2>
                              <p className="text-white/80 max-w-xl">
                                Tell me where you want to go, when, and your
                                interests — I&apos;ll create a personalized
                                itinerary just for you.
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
                    </div>

                    {/* Chat Card */}
                    <Card className="border-border/40 shadow-sm overflow-hidden mt-8">
                      {/* Chat messages area */}
                      <div
                        ref={chatContainerRef}
                        className="h-[500px] relative"
                      >
                        <ScrollArea className="h-full">
                          <div className="p-4 pt-5 space-y-6">
                            {messages.map((message, index) => {
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
                                    {message.role === "assistant" ? (
                                      <div className="h-10 w-10 rounded-full overflow-hidden bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0 mt-1">
                                        <Sparkles className="h-5 w-5 text-primary" />
                                      </div>
                                    ) : (
                                      <Avatar className="h-10 w-10 flex-shrink-0 mt-1">
                                        <AvatarImage
                                          src={user?.avatarUrl}
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
                                          {message.role === "assistant"
                                            ? "AventrAI"
                                            : username}
                                        </span>
                                        <span className="text-xs text-muted-foreground">
                                          {message.timestamp.toLocaleTimeString(
                                            [],
                                            {
                                              hour: "2-digit",
                                              minute: "2-digit",
                                            }
                                          )}
                                        </span>
                                      </div>

                                      <div
                                        className={cn(
                                          "rounded-xl p-4",
                                          message.role === "assistant"
                                            ? "bg-muted/40 text-foreground border border-border/40"
                                            : "bg-primary/10 text-foreground"
                                        )}
                                      >
                                        <div className="whitespace-pre-wrap text-sm">
                                          {message.content}
                                        </div>

                                        {/* Action buttons for assistant messages */}
                                        {message.role === "assistant" &&
                                          message.actions && (
                                            <div className="mt-4 flex flex-wrap gap-2">
                                              {message.actions.map(
                                                (action, i) => (
                                                  <Button
                                                    key={i}
                                                    variant="secondary"
                                                    size="sm"
                                                    className="h-8 bg-background/80"
                                                  >
                                                    {action.label}
                                                  </Button>
                                                )
                                              )}
                                            </div>
                                          )}
                                      </div>

                                      {/* Badges/metadata */}
                                      {message.role === "assistant" &&
                                        hasPlan &&
                                        index === messages.length - 1 && (
                                          <div className="flex items-center gap-1.5">
                                            <Badge
                                              variant="outline"
                                              className="text-[10px] h-5 bg-primary/5 hover:bg-primary/10 px-2 gap-1"
                                            >
                                              <MapPin className="h-2.5 w-2.5" />
                                              Mongolia
                                            </Badge>
                                            <Badge
                                              variant="outline"
                                              className="text-[10px] h-5 bg-primary/5 hover:bg-primary/10 px-2 gap-1"
                                            >
                                              <Calendar className="h-2.5 w-2.5" />
                                              May-September
                                            </Badge>
                                            <Badge
                                              variant="outline"
                                              className="text-[10px] h-5 bg-primary/5 hover:bg-primary/10 px-2 gap-1"
                                            >
                                              <Star className="h-2.5 w-2.5" />
                                              Adventure
                                            </Badge>
                                          </div>
                                        )}
                                    </div>
                                  </div>
                                </div>
                              );
                            })}

                            {isAILoading && (
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
                                        {new Date().toLocaleTimeString([], {
                                          hour: "2-digit",
                                          minute: "2-digit",
                                        })}
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
                              placeholder="Describe your dream trip..."
                              className="w-full rounded-xl border border-border/60 bg-background focus:outline-none focus:ring-1 focus:ring-primary px-4 py-3 min-h-[56px] max-h-[150px] resize-none pr-20"
                              value={input}
                              onChange={(e) => setInput(e.target.value)}
                              onKeyDown={handleKeyDown}
                              disabled={isAILoading}
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
                                disabled={isAILoading}
                                onClick={() =>
                                  setShowEmojiPicker(!showEmojiPicker)
                                }
                              >
                                <Smile className="h-4 w-4" />
                              </Button>

                              <Button
                                className="h-9 rounded-full px-4 gap-1.5 shadow-sm"
                                onClick={sendMessage}
                                disabled={isAILoading || input.trim() === ""}
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
                      <div className="flex justify-end">
                        <p className="text-xs text-muted-foreground">
                          Last updated: {currentDateTime} UTC
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Right Column - Sidebar */}
                  <div className="xl:col-span-4">
                    <div className="space-y-6 sticky top-24">
                      {/* Planning Assistant Card */}
                      <Card className="overflow-hidden border-border/40 shadow-sm">
                        <div className="bg-gradient-to-br from-primary/10 to-primary/5 border-b border-primary/10 p-4">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                              <Sparkles className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <h3 className="font-medium">Trip Progress</h3>
                              <p className="text-sm text-muted-foreground">
                                {hasPlan
                                  ? "Initial plan ready"
                                  : "Getting started"}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="p-4">
                          {/* Progress tracker */}
                          <div className="space-y-3 mb-5">
                            {[
                              { label: "Destination", completed: hasPlan },
                              { label: "Travel Dates", completed: false },
                              { label: "Accommodations", completed: false },
                              { label: "Activities", completed: false },
                              { label: "Transportation", completed: false },
                            ].map((item, idx) => (
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
                            {hasPlan ? (
                              <Button
                                className="w-full gap-2"
                                onClick={() => {
                                  // This would normally generate a final plan
                                }}
                              >
                                <Star className="h-4 w-4" />
                                Finalize Trip Plan
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
                              onClick={() => {
                                setMessages([
                                  {
                                    id: "welcome",
                                    role: "system",
                                    content: `Chat started on ${currentDateTime} UTC`,
                                    timestamp: new Date(currentDateTime),
                                  },
                                  {
                                    id: "1",
                                    role: "assistant",
                                    content:
                                      "Hi there! I'm AventrAI, your personal travel assistant. Tell me about the trip you're planning. Where would you like to go, when are you traveling, and what are you interested in?",
                                    timestamp: new Date(currentDateTime),
                                  },
                                ]);
                                setHasPlan(false);
                              }}
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

                      {/* Chat Tips Card */}
                      <Card className="border-border/40 shadow-sm overflow-hidden">
                        <div className="border-b border-border/30 p-4">
                          <div className="flex justify-between items-center">
                            <h3 className="font-medium">Chat Tips</h3>
                            <Badge
                              variant="secondary"
                              className="bg-primary/5 text-[10px]"
                            >
                              PRO TIPS
                            </Badge>
                          </div>
                        </div>
                        <div className="p-4 space-y-3 text-sm">
                          {[
                            "Be specific about destinations, dates, and activities you enjoy",
                            "Mention your budget range and travel style preferences",
                            "Ask for recommendations for local experiences and hidden gems",
                            "Specify any dietary restrictions or accessibility needs",
                          ].map((tip, i) => (
                            <div key={i} className="flex items-start gap-2">
                              <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <span className="text-xs font-medium text-primary">
                                  {i + 1}
                                </span>
                              </div>
                              <p className="text-muted-foreground">{tip}</p>
                            </div>
                          ))}
                        </div>

                        {/* Sample prompt */}
                        <div className="border-t border-border/30 p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Lightbulb className="h-4 w-4 text-amber-500" />
                            <h4 className="text-sm font-medium">
                              Example prompt
                            </h4>
                          </div>
                          <div className="bg-muted/30 rounded-lg p-3 text-sm italic text-muted-foreground">
                            &quot;I&apos;m planning a 10-day trip to Mongolia in
                            June with my partner. We love outdoor adventures,
                            photography, and experiencing local culture. Our
                            budget is around $3000 per person excluding
                            flights.&quot;
                          </div>
                          <Button
                            size="sm"
                            variant="link"
                            className="mt-2 h-auto p-0 text-xs"
                            onClick={() =>
                              handleSuggestionClick(
                                "I'm planning a 10-day trip to Mongolia in June with my partner. We love outdoor adventures, photography, and experiencing local culture. Our budget is around $3000 per person excluding flights."
                              )
                            }
                          >
                            Use this example
                          </Button>
                        </div>
                      </Card>

                      {/* User info display */}
                      <Card className="border-border/40 shadow-sm overflow-hidden">
                        <div className="p-4 flex justify-between items-center">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-9 w-9">
                              <AvatarImage
                                src={user?.avatarUrl}
                                alt={username}
                              />
                              <AvatarFallback className="text-xs bg-muted">
                                {username.substring(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-medium">{username}</p>
                              <p className="text-xs text-muted-foreground">
                                Session started: {currentDateTime}
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
                  </div>
                </div>
              </motion.div>
            </TabsContent>

            <TabsContent
              value="inspiration"
              className="mt-0 focus-visible:outline-none focus-visible:ring-0"
            >
              <InspirationTab
                onUseTemplate={(template) => {
                  // Handle using a template, perhaps by pre-filling form
                  console.log("Using template:", template.title);
                }}
                onBrowseAll={() => {
                  // Handle browsing all templates
                  console.log("Browse all templates");
                }}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
