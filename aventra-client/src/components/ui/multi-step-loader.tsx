"use client";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "motion/react";
import { useState, useEffect, useCallback, useRef } from "react";

// Elegant minimalist icons
const PendingIcon = ({ className }: { className?: string }) => (
  <div className={cn("w-3 h-3 rounded-full bg-gray-300 dark:bg-gray-600", className)} />
);

const LoadingIcon = ({ className }: { className?: string }) => (
  <svg className={cn("w-5 h-5 text-primary", className)} viewBox="0 0 24 24">
    <circle 
      className="opacity-25" 
      cx="12" cy="12" r="10" 
      stroke="currentColor" 
      strokeWidth="4"
      fill="none"
    />
    <path 
      className="opacity-75" 
      fill="currentColor" 
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    >
      <animateTransform
        attributeName="transform"
        attributeType="XML"
        type="rotate"
        from="0 12 12"
        to="360 12 12"
        dur="1s"
        repeatCount="indefinite"
      />
    </path>
  </svg>
);

const CompleteIcon = ({ className }: { className?: string }) => (
  <svg 
    className={cn("w-5 h-5", className)} 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <path 
      d="M7.75 12.75L10 15.25L16.25 8.75" 
      stroke="currentColor" 
      strokeWidth="2.5" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
    />
  </svg>
);

type LoadingState = {
  text: string;
  description?: string;
  icon?: React.ReactNode;
};

interface LoaderBarProps {
  progress: number;
  isAnimated?: boolean;
}

const LoaderBar = ({ progress, isAnimated = true }: LoaderBarProps) => (
  <div className="h-1 bg-gray-100 dark:bg-gray-800 w-full rounded-full overflow-hidden">
    <motion.div
      className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
      initial={{ width: 0 }}
      animate={{ width: `${progress}%` }}
      transition={{ 
        duration: isAnimated ? 0.8 : 0,
        ease: "easeOut"
      }}
    />
  </div>
);

export const MultiStepLoader = ({
  loadingStates,
  loading = false,
  duration = 2000,
  loop = true,
  onComplete,
  className,
}: {
  loadingStates: LoadingState[];
  loading?: boolean;
  duration?: number;
  loop?: boolean;
  onComplete?: () => void;
  className?: string;
}) => {
  const [currentState, setCurrentState] = useState(0);
  const overlayRef = useRef<HTMLDivElement>(null);
  
  const handleComplete = useCallback(() => {
    if (onComplete) {
      onComplete();
    }
  }, [onComplete]);

  useEffect(() => {
    if (!loading) {
      setCurrentState(0);
      return;
    }
    
    const timeout = setTimeout(() => {
      if (currentState === loadingStates.length - 1) {
        if (loop) {
          setCurrentState(0);
        } else {
          handleComplete();
        }
      } else {
        setCurrentState(currentState + 1);
      }
    }, duration);

    return () => clearTimeout(timeout);
  }, [currentState, loading, loop, loadingStates.length, duration, handleComplete]);

  // Mouse parallax effect for background
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!overlayRef.current) return;
      
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      
      const moveX = clientX / innerWidth - 0.5;
      const moveY = clientY / innerHeight - 0.5;
      
      overlayRef.current.style.backgroundPosition = `${moveX * 20}px ${moveY * 20}px`;
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const totalProgress = ((currentState + 1) / loadingStates.length) * 100;

  return (
    <AnimatePresence mode="wait">
      {loading && (
        <motion.div
          ref={overlayRef}
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          exit={{
            opacity: 0,
          }}
          transition={{ duration: 0.5 }}
          className={cn(
            "fixed inset-0 z-[100] flex items-center justify-center backdrop-blur-md",
            "bg-white/30 dark:bg-black/30",
            className
          )}
          style={{
            backgroundImage: 'radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.03) 100%)',
            backgroundSize: '120% 120%',
          }}
        >
          <motion.div
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' viewBox=\'0 0 20 20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%239C92AC\' fill-opacity=\'0.1\' fill-rule=\'evenodd\'%3E%3Ccircle cx=\'3\' cy=\'3\' r=\'3\'/%3E%3Ccircle cx=\'13\' cy=\'13\' r=\'3\'/%3E%3C/g%3E%3C/svg%3E")',
            }}
          />
          
          <motion.div 
            className="w-full max-w-md mx-4 overflow-hidden"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ 
              duration: 0.4,
              ease: [0.23, 1, 0.32, 1] // cubic-bezier
            }}
          >
            <motion.div 
              className="bg-white dark:bg-gray-900 shadow-2xl rounded-2xl overflow-hidden"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.5 }}
            >
              <div className="p-1">
                <LoaderBar progress={totalProgress} />
              </div>
              
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Processing
                  </h3>
                  <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    {Math.round(totalProgress)}%
                  </div>
                </div>
                
                <div className="space-y-4">
                  {loadingStates.map((state, index) => {
                    const isActive = index === currentState;
                    const isCompleted = index < currentState;
                    const isPending = index > currentState;
                    
                    return (
                      <motion.div
                        key={index}
                        className={cn(
                          "flex items-center gap-4 py-3 px-4 rounded-lg transition-colors",
                          isActive && "bg-gray-50 dark:bg-gray-800/50",
                        )}
                        initial={false}
                        animate={{
                          opacity: isPending ? 0.5 : 1,
                          y: 0
                        }}
                        transition={{ duration: 0.2 }}
                      >
                        <motion.div 
                          className={cn(
                            "flex items-center justify-center h-8 w-8 rounded-full text-white",
                            isCompleted 
                              ? "bg-green-500" 
                              : isActive 
                                ? "bg-blue-500" 
                                : "bg-gray-200 dark:bg-gray-700"
                          )}
                          initial={false}
                          animate={{
                            scale: isActive ? [1, 1.05, 1] : 1,
                          }}
                          transition={{
                            duration: 1.5,
                            repeat: isActive ? Infinity : 0,
                            ease: "easeInOut"
                          }}
                        >
                          {isPending && <PendingIcon />}
                          {isActive && <LoadingIcon />}
                          {isCompleted && <CompleteIcon />}
                        </motion.div>
                        
                        <div className="flex-1">
                          <div className={cn(
                            "font-medium text-gray-900 dark:text-white",
                            isActive && "text-blue-600 dark:text-blue-400"
                          )}>
                            {state.text}
                          </div>
                          
                          {state.description && (
                            <div className={cn(
                              "text-sm text-gray-500 dark:text-gray-400 mt-0.5",
                              isActive && "text-gray-600 dark:text-gray-300"
                            )}>
                              {state.description}
                            </div>
                          )}
                        </div>
                        
                        {isActive && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex-shrink-0 h-5 w-5"
                          >
                            <span className="animate-pulse">●</span>
                          </motion.div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </div>
              
              <div className="px-6 pb-6">
                <motion.div 
                  className="text-xs text-center text-gray-500 dark:text-gray-400 mt-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.7 }}
                  transition={{ delay: 1 }}
                >
                  This might take a moment...
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
          
          <div className="absolute bottom-6 left-0 right-0 flex justify-center">
            <motion.div 
              className="px-4 py-2.5 bg-black/10 dark:bg-white/10 rounded-full text-sm font-medium backdrop-blur-md"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {currentState + 1} of {loadingStates.length} steps
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};