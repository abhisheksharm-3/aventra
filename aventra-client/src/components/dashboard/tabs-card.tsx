import { Destination, QuickAction } from "@/types/dashboard";
import { Card } from "../ui/card";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ArrowRight, ChevronRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import Image from "next/image";
import { Badge } from "../ui/badge";

/**
 * Tabs Card Component
 * 
 * Interactive card with tabbed interface that toggles between AI-recommended 
 * destinations and quick actions for the user. Features animated tab indicators
 * and content transitions.
 * 
 * @param {Object} props - Component props
 * @param {'destinations' | 'actions'} props.activeTab - Currently active tab identifier
 * @param {Function} props.setActiveTab - Function to change the active tab
 * @param {Destination[]} props.destinations - Array of destination recommendations to display
 * @param {QuickAction[]} props.actions - Array of quick actions to display
 * @returns React component with tabbed interface
 */
export function TabsCard({ 
  activeTab, 
  setActiveTab,
  destinations,
  actions
}: { 
  activeTab: 'destinations' | 'actions'; 
  setActiveTab: (tab: 'destinations' | 'actions') => void;
  destinations: Destination[];
  actions: QuickAction[];
}) {
  return (
    <Card className="border-border/40 shadow-sm overflow-hidden">
      <div className="flex border-b border-border/40" role="tablist">
        <button 
          onClick={() => setActiveTab('destinations')}
          className={cn(
            "flex-1 py-3 px-4 text-sm font-medium transition-colors relative",
            activeTab === 'destinations' ? "text-primary" : "text-muted-foreground"
          )}
          role="tab"
          aria-selected={activeTab === 'destinations'}
          aria-controls="destinations-panel"
          id="destinations-tab"
        >
          AI Recommendations
          {activeTab === 'destinations' && (
            <motion.div 
              layoutId="tabIndicator"
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
              aria-hidden="true"
            />
          )}
        </button>
        
        <button 
          onClick={() => setActiveTab('actions')}
          className={cn(
            "flex-1 py-3 px-4 text-sm font-medium transition-colors relative",
            activeTab === 'actions' ? "text-primary" : "text-muted-foreground"
          )}
          role="tab"
          aria-selected={activeTab === 'actions'}
          aria-controls="actions-panel"
          id="actions-tab"
        >
          Quick Actions
          {activeTab === 'actions' && (
            <motion.div 
              layoutId="tabIndicator"
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
              aria-hidden="true"
            />
          )}
        </button>
      </div>
      
      <div className="p-4">
        {activeTab === 'destinations' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
            id="destinations-panel"
            role="tabpanel"
            aria-labelledby="destinations-tab"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                <span className="text-sm font-medium">Personalized for You</span>
              </div>
              <Link href="/explore">
                <Button variant="ghost" size="sm" className="text-xs h-7 gap-1">
                  <span>More Ideas</span>
                  <ChevronRight className="h-3 w-3" aria-hidden="true" />
                </Button>
              </Link>
            </div>
            
            <ul className="grid gap-3">
              {destinations.map((dest, i) => (
                <li key={dest.id}>
                  <Link 
                    href={`/explore/${dest.id}`}
                    className="group block"
                  >
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * i, duration: 0.4 }}
                      className="relative h-24 rounded-lg overflow-hidden border border-border/40"
                    >
                      <Image
                        src={dest.image}
                        alt={`${dest.name} - ${dest.tagline}`}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30" aria-hidden="true"></div>
                      
                      <div className="absolute inset-0 flex items-center justify-between p-4">
                        <div className="text-white">
                          <h3 className="font-medium">{dest.name}</h3>
                          <p className="text-xs text-white/80">{dest.tagline}</p>
                        </div>
                        <Badge className="bg-primary/90 group-hover:bg-primary transition-colors">
                          {dest.match}% match
                        </Badge>
                      </div>
                    </motion.div>
                  </Link>
                </li>
              ))}
            </ul>
            
            <Link href="/plan" className="mt-2 group">
              <div className="flex items-center justify-between text-sm text-primary py-2">
                <span className="font-medium group-hover:underline">
                  Start planning a custom trip
                </span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
              </div>
            </Link>
          </motion.div>
        )}
        
        {activeTab === 'actions' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="space-y-3 py-1"
            id="actions-panel"
            role="tabpanel"
            aria-labelledby="actions-tab"
          >
            <ul>
              {actions.map((action, i) => (
                <li key={i}>
                  <motion.div
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.07 * i, duration: 0.3 }}
                  >
                    <Link 
                      href={action.href}
                      className="flex items-center justify-between p-2.5 hover:bg-muted/50 rounded-md transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                          <action.icon className="h-4 w-4 text-primary" aria-hidden="true" />
                        </div>
                        <span className="text-sm">{action.title}</span>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" aria-hidden="true" />
                    </Link>
                  </motion.div>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </div>
    </Card>
  );
}