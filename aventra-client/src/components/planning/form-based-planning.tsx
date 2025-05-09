import { motion } from "framer-motion";
import { User } from "@/types/appwrite";
import { ArrowLeft, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import PlanningHeader from "./planning-header";
import { TripForm } from "./trip-form";

interface FormBasedPlanningProps {
  onSwitchToChat: () => void;
  onBack: () => void;
  user: User | null;
}

export default function FormBasedPlanning({ 
  onSwitchToChat, 
  onBack,
  user
}: FormBasedPlanningProps) {
  return (
    <>
      <PlanningHeader 
        user={user}
        title="Create Your Perfect Trip"
        subtitle="Fill in the details and our AI will craft your personalized itinerary"
        action={
          <Button variant="ghost" size="sm" className="gap-2" onClick={onBack}>
            <ArrowLeft className="h-4 w-4" />
            Choose Another Method
          </Button>
        }
      />
      
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-8 gap-6">
          {/* Main Form Area - Using your existing TripForm */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-6"
          >
            <TripForm />
          </motion.div>
          
          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="space-y-4 sticky top-24">
              <Card className="border-border/40 shadow-sm p-4">
                <h3 className="font-medium mb-3">Trip Planning Tips</h3>
                
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-2">
                    <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-medium text-primary">1</span>
                    </div>
                    <p className="text-muted-foreground">Start with your destination and dates for basic recommendations</p>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-medium text-primary">2</span>
                    </div>
                    <p className="text-muted-foreground">Set your budget to get suitable accommodation and activity options</p>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-medium text-primary">3</span>
                    </div>
                    <p className="text-muted-foreground">For more tailored results, specify your interests and preferences</p>
                  </div>
                  
                  <div className="pt-2">
                    <Button 
                      variant="outline" 
                      className="w-full justify-start gap-2 text-primary"
                      onClick={onSwitchToChat}
                    >
                      <MessageSquare className="h-4 w-4" />
                      Prefer to chat instead?
                    </Button>
                  </div>
                </div>
              </Card>
              
              {/* Need help callout */}
              <Card className="border-border/40 shadow-sm overflow-hidden">
                <div className="bg-primary/10 px-4 py-3 border-b border-primary/20">
                  <h3 className="font-medium text-primary">Need Assistance?</h3>
                </div>
                <div className="p-4">
                  <p className="text-sm text-muted-foreground mb-3">
                    Our AI can help with specific destinations, unusual requirements, or multi-city trips.
                  </p>
                  <Button 
                    onClick={onSwitchToChat} 
                    className="w-full"
                    variant="outline"
                  >
                    Talk to AI Assistant
                  </Button>
                </div>
              </Card>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}