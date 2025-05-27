"use client";

import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
import { Compass, ArrowRight } from "lucide-react";

type LoadingState = {
  text: string;
  description?: string;
};

interface MultiStepLoaderProps {
  loadingStates: LoadingState[];
  loading?: boolean;
  duration?: number;
  loop?: boolean;
  onComplete?: () => void;
  className?: string;
}

export function MultiStepLoader({
  loadingStates,
  loading = false,
  duration = 2000,
  loop = true,
  onComplete,
  className,
}: MultiStepLoaderProps) {
  const [currentState, setCurrentState] = useState(0);
  const [previousState, setPreviousState] = useState(-1);
  
  const handleComplete = useCallback(() => {
    if (onComplete) {
      onComplete();
    }
  }, [onComplete]);

  // Handle state progression
  useEffect(() => {
    if (!loading) {
      setCurrentState(0);
      setPreviousState(-1);
      return;
    }
    
    const timeout = setTimeout(() => {
      if (currentState === loadingStates.length - 1) {
        if (loop) {
          setPreviousState(currentState);
          setCurrentState(0);
        } else {
          handleComplete();
        }
      } else {
        setPreviousState(currentState);
        setCurrentState(currentState + 1);
      }
    }, duration);

    return () => clearTimeout(timeout);
  }, [currentState, loading, loop, loadingStates.length, duration, handleComplete]);

  // Calculate progress percentage
  const progress = ((currentState + 1) / loadingStates.length);

  // Determine animation direction
  const direction = previousState > currentState ? -1 : 1;

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          className={cn(
            "fixed inset-0 z-50 flex items-center justify-center",
            "backdrop-blur-md bg-background/70",
            className
          )}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-0 right-0 h-1 bg-muted/20">
              <motion.div 
                className="h-full bg-primary"
                initial={{ width: 0 }}
                animate={{ width: `${progress * 100}%` }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              />
            </div>
          </div>
          
          <motion.div
            className="w-full max-w-md px-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
          >
            {/* Horizontal dots indicator */}
            <div className="flex justify-center mb-6 relative">
              <div className="flex items-center gap-2">
                {loadingStates.map((_, i) => (
                  <div 
                    key={i} 
                    className={cn(
                      "relative transition-colors duration-300",
                      i === currentState ? "scale-110" : ""
                    )}
                  >
                    <div className={cn(
                      "w-2.5 h-2.5 rounded-full",
                      i === currentState 
                        ? "bg-primary" 
                        : i < currentState 
                          ? "bg-primary/40" 
                          : "bg-muted"
                    )}/>
                    
                    {i === currentState && (
                      <motion.div
                        className="absolute inset-0 rounded-full bg-primary/30"
                        initial={{ scale: 1 }}
                        animate={{ scale: 1.8, opacity: 0 }}
                        transition={{ 
                          duration: 1.5, 
                          repeat: Infinity,
                          ease: "easeOut"
                        }}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Card with current step */}
            <div className="bg-card border border-border/40 shadow-xl rounded-xl overflow-hidden relative">
              <div className="px-6 py-5 relative overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentState}
                    initial={{ 
                      opacity: 0, 
                      x: 20 * direction,
                      position: "relative", 
                    }}
                    animate={{ 
                      opacity: 1, 
                      x: 0,
                      position: "relative",
                    }}
                    exit={{ 
                      opacity: 0, 
                      x: -20 * direction,
                      position: "absolute",
                      inset: 0,
                    }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    className="flex items-start"
                  >
                    <div className="relative mr-4 mt-0.5">
                      <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary/10">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ 
                            duration: 3,
                            ease: "linear",
                            repeat: Infinity,
                          }}
                        >
                          <Compass className="h-4 w-4 text-primary" />
                        </motion.div>
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="font-medium text-foreground mb-1">
                        {loadingStates[currentState].text}
                      </h3>
                      
                      {loadingStates[currentState].description && (
                        <p className="text-sm text-muted-foreground">
                          {loadingStates[currentState].description}
                        </p>
                      )}
                      
                      <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
                        <div className="flex space-x-1">
                          {[...Array(3)].map((_, i) => (
                            <motion.div
                              key={i}
                              className="h-1.5 w-1.5 rounded-full bg-primary/60"
                              animate={{ scale: [0.5, 1, 0.5] }}
                              transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                delay: i * 0.2,
                                ease: "easeInOut"
                              }}
                            />
                          ))}
                        </div>
                        <span>Processing...</span>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
              
              {/* Footer showing step count */}
              <div className="bg-muted/20 px-6 py-2.5 border-t border-border/30 flex justify-between items-center">
                <div className="text-xs text-muted-foreground">
                  Step {currentState + 1} of {loadingStates.length}
                </div>
                
                <div className="flex items-center gap-1.5 text-xs font-medium text-primary">
                  <span>Preparing your journey</span>
                  <ArrowRight className="h-3 w-3" />
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}