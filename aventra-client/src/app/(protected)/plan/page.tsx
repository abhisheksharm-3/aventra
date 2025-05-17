"use client";

import { useState } from "react";
import Layout from "@/components/layout/Layout";
import PlanPageSkeleton from "@/components/planning/plan-page-skeleton";
import PlanningMethodSelection from "@/components/planning/planning-method-selection";
import ChatBasedPlanning from "@/components/planning/chat-based-planning";
import FormBasedPlanning from "@/components/planning/form-based-planning";
import { useUserStore } from "@/stores/userStore";

/**
 * Defines the possible planning method states for the planning page.
 * 
 * @typedef {string} PlanningMethod
 * @property {"undecided"} undecided - Initial state when user hasn't selected a planning method
 * @property {"chat"} chat - Chat-based planning interface selected
 * @property {"form"} form - Form-based planning interface selected
 */
type PlanningMethod = "undecided" | "chat" | "form";

/**
 * PlanPage component that handles different planning methods/interfaces.
 * 
 * This component manages the user's planning experience by providing different
 * planning interfaces based on the user's preference. It supports both
 * chat-based and form-based planning methods.
 * 
 * The component handles:
 * - Initial method selection interface
 * - Switching between planning methods
 * - Loading states while user data is being fetched
 * - Passing user context to child components
 * 
 * @returns {JSX.Element} The rendered plan page component
 */
export default function PlanPage() {
  const { user, isLoading } = useUserStore();
  const [planningMethod, setPlanningMethod] = useState<PlanningMethod>("undecided");
  
  // Handle loading state
  if (isLoading) {
    return (
      <Layout>
        <PlanPageSkeleton />
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/10 pb-12">
        <div className="container mx-auto px-4 py-8">
          {planningMethod === "undecided" ? (
            <>
              <PlanningMethodSelection onSelectMethod={setPlanningMethod} />
            </>
          ) : planningMethod === "chat" ? (
            <ChatBasedPlanning 
              onSwitchToForm={() => setPlanningMethod("form")} 
              onBack={() => setPlanningMethod("undecided")}
              user={user}
            />
          ) : (
            <FormBasedPlanning 
              onSwitchToChat={() => setPlanningMethod("chat")} 
              onBack={() => setPlanningMethod("undecided")}
              user={user}
            />
          )}
        </div>
      </div>
    </Layout>
  );
}