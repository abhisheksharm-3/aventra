"use client";

import { RefObject } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, Calendar, Star, PieChart, Clock } from "lucide-react";

interface SearchPanelProps {
  searchInputRef: RefObject<HTMLInputElement  | null>;
}

// Quick actions for search panel
const quickActions = [
  { icon: <Calendar className="h-4 w-4" />, label: "Upcoming Trips", shortcut: "T" },
  { icon: <Star className="h-4 w-4" />, label: "Saved Places", shortcut: "S" },
  { icon: <PieChart className="h-4 w-4" />, label: "My Stats", shortcut: "M" },
  { icon: <Clock className="h-4 w-4" />, label: "Recent Activity", shortcut: "R" },
];

export const SearchPanel = ({ searchInputRef }: SearchPanelProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10, height: 0 }}
      animate={{ opacity: 1, y: 0, height: 'auto' }}
      exit={{ opacity: 0, y: -10, height: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className="absolute left-0 right-0 top-16 bg-background/95 backdrop-blur-xl border-b border-border/20 z-50"
    >
      <div className="container mx-auto py-6 px-4 md:px-6">
        <div className="max-w-2xl mx-auto">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground/70" />
            <Input
              ref={searchInputRef}
              type="search"
              placeholder="Search for destinations, experiences, activities..."
              className="w-full pl-10 pr-4 py-5 h-12 rounded-xl border-muted/30 bg-background/50 hover:bg-background/80 focus:bg-background transition-all text-sm"
            />
            <div className="absolute right-3.5 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
              <kbd className="hidden sm:inline-flex h-6 items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                <span className="text-xs">⌘</span>K
              </kbd>
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <Filter className="h-3.5 w-3.5 text-muted-foreground/70" />
              </Button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-5">
            <h4 className="text-xs font-medium text-muted-foreground mb-2 px-1">Quick Actions</h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="h-auto py-3 px-4 justify-start gap-3 bg-muted/20 border-muted/30 hover:bg-muted/40 group"
                >
                  <span className="p-1.5 rounded-md bg-background/80 text-muted-foreground group-hover:text-primary transition-colors">
                    {action.icon}
                  </span>
                  <div className="flex flex-col items-start">
                    <span className="text-sm">{action.label}</span>
                    <div className="flex items-center gap-1">
                      <kbd className="inline-flex h-4 items-center gap-0.5 rounded border bg-muted/30 px-1 font-mono text-[9px] font-medium text-muted-foreground">
                        ⌘
                      </kbd>
                      <kbd className="inline-flex h-4 items-center gap-0.5 rounded border bg-muted/30 px-1 font-mono text-[9px] font-medium text-muted-foreground">
                        {action.shortcut}
                      </kbd>
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </div>

          {/* Recent Searches - Minimal Display */}
          <div className="mt-5">
            <h4 className="text-xs font-medium text-muted-foreground mb-2 px-1">Recent Searches</h4>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" className="h-7 px-3 bg-muted/20 border-muted/30 hover:bg-muted/40">
                <Search className="mr-1 h-3 w-3" /> Bali beaches
              </Button>
              <Button variant="outline" size="sm" className="h-7 px-3 bg-muted/20 border-muted/30 hover:bg-muted/40">
                <Search className="mr-1 h-3 w-3" /> Tokyo food tours
              </Button>
              <Button variant="outline" size="sm" className="h-7 px-3 bg-muted/20 border-muted/30 hover:bg-muted/40">
                <Search className="mr-1 h-3 w-3" /> Swiss Alps hiking
              </Button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SearchPanel;