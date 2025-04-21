"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Compass, Award, Heart } from "lucide-react";

// Notification items for demo
const notificationItems = [
  {
    id: 1,
    icon: <Compass className="h-4 w-4" />,
    iconBg: "bg-blue-50 dark:bg-blue-900/20",
    iconColor: "text-blue-600 dark:text-blue-400",
    title: "Trip Reminder",
    message: "Your trip to Bali is in 12 days. Start packing!",
    time: "2h ago",
    unread: true,
  },
  {
    id: 2,
    icon: <Award className="h-4 w-4" />,
    iconBg: "bg-amber-50 dark:bg-amber-900/20",
    iconColor: "text-amber-600 dark:text-amber-400",
    title: "Achievement Unlocked",
    message: "You've visited 10 destinations! Claim your reward now.",
    time: "5h ago",
    unread: true,
  },
  {
    id: 3,
    icon: <Heart className="h-4 w-4" />,
    iconBg: "bg-rose-50 dark:bg-rose-900/20",
    iconColor: "text-rose-600 dark:text-rose-400",
    title: "New Like",
    message: "Maria liked your photo from Thailand trip.",
    time: "1d ago",
    unread: true,
  },
];

export const NotificationsPanel = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.95 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className="absolute right-0 mt-2 w-[320px] bg-card/95 backdrop-blur-xl border border-border/30 rounded-2xl shadow-lg overflow-hidden"
    >
      <div className="p-3 border-b border-border/20 flex justify-between items-center">
        <h3 className="font-medium text-sm">Notifications</h3>
        <Button variant="ghost" size="sm" className="text-xs h-7 px-2 text-primary hover:text-primary/80 hover:bg-primary/5">
          Mark all read
        </Button>
      </div>
      
      <div className="max-h-[380px] overflow-y-auto">
        {notificationItems.map((item) => (
          <motion.div 
            key={item.id}
            whileHover={{ x: 2 }}
            className={cn(
              "p-3 hover:bg-muted/50 transition-colors border-b border-border/10 cursor-pointer flex group",
              item.unread && "bg-muted/20"
            )}
          >
            <div className="flex items-start w-full">
              <div className={cn("flex-shrink-0 mr-3 h-8 w-8 rounded-full flex items-center justify-center", item.iconBg)}>
                <span className={cn("", item.iconColor)}>{item.icon}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between">
                  <p className="text-sm font-medium leading-none mb-1">{item.title}</p>
                  <span className="text-xs text-muted-foreground ml-2 flex-shrink-0">{item.time}</span>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {item.message}
                </p>
              </div>
              {item.unread && (
                <div className="ml-2 w-1.5 h-1.5 bg-primary rounded-full flex-shrink-0 mt-1.5 group-hover:opacity-0 transition-opacity"></div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
      
      <div className="p-3 text-center border-t border-border/20 bg-muted/10">
        <Button variant="ghost" size="sm" className="text-xs w-full h-8 font-medium hover:bg-background/60">
          View all notifications
        </Button>
      </div>
    </motion.div>
  );
};

export default NotificationsPanel;