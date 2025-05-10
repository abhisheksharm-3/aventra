"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { User } from "@/types/appwrite";
import {
  ArrowLeft,
  MessageSquare,
  Globe,
  Clock,
  Calendar,
  DollarSign,
  Sparkles,
  Lightbulb,
  Share2,
  Save,
  FileText,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import PlanningHeader from "./planning-header";
import { TripForm } from "./trip-form";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useTripStore } from "@/hooks/useTripForm";
import { InspirationTab } from "../common/inspiration-tab";

interface FormBasedPlanningProps {
  onSwitchToChat: () => void;
  onBack: () => void;
  user: User | null;
}

// Separate component for the quick stats display that uses Zustand store
function QuickStatsDisplay() {
  const formData = useTripStore((state) => state.formData);

  // Calculate duration if both dates are available
  const calculateDuration = () => {
    if (formData.dates?.startDate && formData.dates?.endDate) {
      const start = new Date(formData.dates.startDate);
      const end = new Date(formData.dates.endDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return `${diffDays} ${diffDays === 1 ? "day" : "days"}`;
    }
    return "Not specified";
  };

  // Format dates for display
  const formatDateRange = () => {
    if (formData.dates?.startDate && formData.dates?.endDate) {
      const start = new Date(formData.dates.startDate).toLocaleDateString(
        "en-US",
        { month: "short", day: "numeric" }
      );
      const end = new Date(formData.dates.endDate).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      return `${start} - ${end}`;
    }
    return "Not selected";
  };

  // Format budget for display with proper currency symbol
  const formatBudget = () => {
    if (formData.budget?.ceiling) {
      // Get the currency symbol
      const currency = formData.budget.currency || "USD";

      // Use a basic mapping for common currency symbols
      const symbolMap: { [key: string]: string } = {
        USD: "$",
        EUR: "€",
        GBP: "£",
        JPY: "¥",
        INR: "₹",
        CAD: "C$",
        AUD: "A$",
        SGD: "S$",
        CNY: "¥",
        KRW: "₩",
      };

      const symbol = symbolMap[currency] || currency;

      // Format with commas
      const amount = new Intl.NumberFormat("en-US").format(
        formData.budget.ceiling
      );

      return `${symbol}${amount}`;
    }
    return "Not specified";
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
      {[
        {
          icon: Globe,
          label: "Destination",
          value: formData.location?.destination || "Not selected",
        },
        { icon: Calendar, label: "Dates", value: formatDateRange() },
        { icon: Clock, label: "Duration", value: calculateDuration() },
        { icon: DollarSign, label: "Budget", value: formatBudget() },
      ].map((stat, i) => (
        <div
          key={i}
          className="flex flex-col items-center p-3 rounded-lg border border-white/20 text-center bg-black/40 backdrop-blur-sm"
        >
          <stat.icon className="h-5 w-5 text-white/80 mb-1" />
          <span className="text-xs text-white/70">{stat.label}</span>
          <span className="text-sm font-medium text-white truncate w-full">
            {stat.value}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function FormBasedPlanning({
  onSwitchToChat,
  onBack,
  user,
}: FormBasedPlanningProps) {
  const [selectedTab, setSelectedTab] = useState<string>("form");

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/5">
      {/* Header Area */}
      <div className="max-w-7xl mx-auto px-4">
        <PlanningHeader
          user={user}
          title="Design Your Perfect Journey"
          subtitle="Let AI craft your ideal travel experience"
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

      {/* Main Content Area - Reimagined Layout */}
      <div className="max-w-7xl mx-auto px-4">
        {/* Tabs Navigation */}
        <div className="mb-6">
          <Tabs
            defaultValue="form"
            value={selectedTab}
            onValueChange={setSelectedTab}
            className="w-full"
          >
            <div className="flex items-center justify-between mb-4">
              <TabsList className="bg-muted/50 p-1 h-auto">
                <TabsTrigger
                  value="form"
                  className={cn(
                    "flex items-center gap-2 data-[state=active]:bg-background rounded-md transition-all px-4 py-2",
                    "data-[state=active]:shadow-sm"
                  )}
                >
                  <FileText className="h-4 w-4" />
                  <span>Plan Builder</span>
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
                  value="ai-chat"
                  className={cn(
                    "flex items-center gap-2 data-[state=active]:bg-background rounded-md transition-all px-4 py-2",
                    "data-[state=active]:shadow-sm"
                  )}
                  onClick={(e) => {
                    e.preventDefault();
                    onSwitchToChat();
                  }}
                >
                  <MessageSquare className="h-4 w-4" />
                  <span>AI Chat</span>
                </TabsTrigger>
              </TabsList>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1 text-sm hidden md:flex"
                >
                  <Save className="h-3.5 w-3.5" />
                  Save Draft
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1 text-sm hidden md:flex"
                >
                  <Share2 className="h-3.5 w-3.5" />
                  Share
                </Button>
              </div>
            </div>

            {/* Tab Content */}
            <TabsContent
              value="form"
              className="mt-0 focus-visible:outline-none focus-visible:ring-0"
            >
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
                  {/* Main Form Area - Expanded for larger screens */}
                  <div className="xl:col-span-8 space-y-6">
                    {/* Hero Banner - Full Immersive Design */}
                    <div className="rounded-xl overflow-hidden shadow-sm border border-border/40">
                      {/* Full bleed image with no spacing */}
                      <div className="relative h-64 md:h-72 w-full">
                        <Image
                          src="https://images.unsplash.com/photo-1517309230475-6736d926b979"
                          alt="Planning your journey"
                          fill
                          className="object-cover"
                          priority
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/60 to-black/30 flex flex-col justify-end p-6">
                          <h2 className="text-white text-2xl md:text-3xl font-serif font-medium mb-2">
                            Your Journey Begins Here
                          </h2>
                          <p className="text-white/80 mb-6 max-w-xl">
                            Tell us about your dream destination, and we&apos;ll
                            handle the rest.
                          </p>

                          {/* Quick Stats - Inside the hero banner */}
                          <QuickStatsDisplay />
                        </div>
                      </div>
                    </div>

                    {/* Form Progress Indicator */}
                    <div className="flex items-center justify-center px-2">
                      {[
                        "Destination",
                        "Dates",
                        "Travelers",
                        "Interests",
                        "Budget",
                        "Details",
                      ].map((step, i) => (
                        <div key={i} className="flex items-center">
                          <div
                            className={cn(
                              "h-8 w-8 rounded-full flex items-center justify-center",
                              i <= 2
                                ? "bg-primary text-white"
                                : "bg-muted text-muted-foreground"
                            )}
                          >
                            {i <= 2 ? (
                              <CheckCircle2 className="h-4 w-4" />
                            ) : (
                              <span className="text-xs">{i + 1}</span>
                            )}
                          </div>
                          {i < 5 && (
                            <div
                              className={cn(
                                "h-0.5 w-10 md:w-16",
                                i < 2 ? "bg-primary" : "bg-muted"
                              )}
                            ></div>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Main Form */}
                    <div className="bg-background rounded-xl border border-border/40 shadow-sm overflow-hidden">
                      <TripForm />
                    </div>
                  </div>

                  {/* Right Column - Enhanced Sidebar */}
                  <div className="xl:col-span-4">
                    <div className="space-y-6 sticky top-24">
                      {/* Planning Assistant Card with enhanced design */}
                      <Card className="overflow-hidden border-border/40 shadow-sm">
                        <div className="bg-gradient-to-br from-primary/10 to-primary/5 border-b border-primary/10 p-4">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                              <Sparkles className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <h3 className="font-medium">
                                AI Planning Assistant
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                Get personalized help
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="p-4 space-y-4">
                          <p className="text-sm">
                            Having trouble with your trip planning? Our AI can
                            help with specific destinations, unusual
                            requirements, or multi-city trips.
                          </p>

                          <Button
                            onClick={onSwitchToChat}
                            className="w-full gap-2"
                          >
                            <MessageSquare className="h-4 w-4" />
                            Chat with AI Assistant
                          </Button>

                          <div className="bg-muted/50 rounded-lg p-3 text-sm">
                            <p className="font-medium flex items-center gap-2 mb-2">
                              <Lightbulb className="h-4 w-4 text-amber-500" />
                              <span>Try asking about:</span>
                            </p>
                            <ul className="space-y-2">
                              <li className="flex items-center gap-2">
                                <Badge
                                  variant="outline"
                                  className="h-5 w-5 p-0 flex items-center justify-center"
                                >
                                  1
                                </Badge>
                                <span className="text-muted-foreground">
                                  Best time to visit your destination
                                </span>
                              </li>
                              <li className="flex items-center gap-2">
                                <Badge
                                  variant="outline"
                                  className="h-5 w-5 p-0 flex items-center justify-center"
                                >
                                  2
                                </Badge>
                                <span className="text-muted-foreground">
                                  Local customs and etiquette tips
                                </span>
                              </li>
                              <li className="flex items-center gap-2">
                                <Badge
                                  variant="outline"
                                  className="h-5 w-5 p-0 flex items-center justify-center"
                                >
                                  3
                                </Badge>
                                <span className="text-muted-foreground">
                                  Off-the-beaten-path experiences
                                </span>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </Card>

                      {/* Planning Tips Card */}
                      <Card className="border-border/40 shadow-sm overflow-hidden">
                        <div className="border-b border-border/30 p-4">
                          <h3 className="font-medium">Trip Planning Tips</h3>
                        </div>
                        <div className="p-4">
                          <div className="space-y-3 text-sm">
                            <div className="flex items-start gap-2">
                              <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <span className="text-xs font-medium text-primary">
                                  1
                                </span>
                              </div>
                              <p className="text-muted-foreground">
                                Start with your destination and dates for basic
                                recommendations
                              </p>
                            </div>

                            <div className="flex items-start gap-2">
                              <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <span className="text-xs font-medium text-primary">
                                  2
                                </span>
                              </div>
                              <p className="text-muted-foreground">
                                Set your budget to get suitable accommodation
                                and activity options
                              </p>
                            </div>

                            <div className="flex items-start gap-2">
                              <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <span className="text-xs font-medium text-primary">
                                  3
                                </span>
                              </div>
                              <p className="text-muted-foreground">
                                For more tailored results, specify your
                                interests and preferences
                              </p>
                            </div>
                          </div>
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
