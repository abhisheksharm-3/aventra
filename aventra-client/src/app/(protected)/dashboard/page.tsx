"use client"
import DashboardOverview from "@/components/dashboard/dashboard-overview";
import DashboardSkeleton from "@/components/dashboard/dashboard-skeleton";
import Layout from "@/components/layout/Layout";
import { useUserStore } from "@/stores/userStore";

export default function DashboardPage() {
  const { user, isLoading } = useUserStore();
  
  // Prevent layout shifts during loading with skeleton
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background/50 pb-12">
        <main className="container mx-auto px-4 py-8">
          <DashboardSkeleton />
        </main>
      </div>
    );
  }

  return (
    <Layout className="pb-12">
      <main className="container mx-auto px-4 py-8">
        <DashboardOverview user={user} />
      </main>
    </Layout>
  );
}