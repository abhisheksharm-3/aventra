"use client"

import {useEffect } from "react";
import DashboardOverview from "@/components/dashboard/dashboard-overview";
import DashboardSkeleton from "@/components/dashboard/dashboard-skeleton";
import Layout from "@/components/layout/Layout";
import { useUserStore } from "@/stores/userStore";

/**
 * Dashboard Page Component
 * 
 * Displays the main dashboard view with user-specific data.
 * Handles loading states and potential errors gracefully.
 * 
 * @returns {JSX.Element} The rendered dashboard page
 */
export default function DashboardPage() {
  const { user, isLoading, error, fetchUser } = useUserStore();
  
  // Fetch user data if needed
  useEffect(() => {
    if (!user && !isLoading && !error) {
      fetchUser();
    }
  }, [user, isLoading, error, fetchUser]);
  
  // Handle error state
  if (error) {
    return (
      <Layout className="pb-12">
        <main className="container mx-auto px-4 py-8">
          <div className="bg-red-50 p-4 rounded-md border border-red-200">
            <h2 className="text-lg font-semibold text-red-800">Something went wrong</h2>
            <p className="text-red-600">{error.message || "Failed to load dashboard data"}</p>
            <button 
              onClick={() => fetchUser()} 
              className="mt-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              Try again
            </button>
          </div>
        </main>
      </Layout>
    );
  }

  // Show loading skeleton with layout to prevent layout shifts
  if (isLoading) {
    return (
      <Layout className="min-h-screen bg-background/50 pb-12">
        <main className="container mx-auto px-4 py-8">
          <DashboardSkeleton />
        </main>
      </Layout>
    );
  }

  return (
      <Layout className="pb-12">
        <main className="container mx-auto px-4 py-8">
          <DashboardOverview user={user} />
        </main>
      </Layout>
  );
};