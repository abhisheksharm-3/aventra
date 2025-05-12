"use client";

import { useState } from "react";
import Layout from "@/components/layout/Layout";
import PlanPageSkeleton from "@/components/planning/plan-page-skeleton";
import PlanningMethodSelection from "@/components/planning/planning-method-selection";
import ChatBasedPlanning from "@/components/planning/chat-based-planning";
import FormBasedPlanning from "@/components/planning/form-based-planning";
import { useUserStore } from "@/stores/userStore";

type PlanningMethod = "undecided" | "chat" | "form";

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