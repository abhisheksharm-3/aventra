import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { User } from "@/types/appwrite";
import { ArrowLeft, Send, RefreshCw, Share2, Download, MessageSquare, ClipboardList } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import PlanningHeader from "./planning-header";
import ChatMessage from "./chat-message";

interface ChatBasedPlanningProps {
  onSwitchToForm: () => void;
  onBack: () => void;
  user: User | null;
}

type MessageType = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
};

export default function ChatBasedPlanning({ onSwitchToForm, onBack, user }: ChatBasedPlanningProps) {
  const [messages, setMessages] = useState<MessageType[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hi there! I'm your AI travel planner. Tell me about the trip you're planning. Where would you like to go, when are you traveling, and what are you interested in?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasPlan, setHasPlan] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  
  const sendMessage = () => {
    if (input.trim() === "") return;
    
    // Add user message
    const userMessage: MessageType = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    
    // Simulate AI response
    setTimeout(() => {
      // Sample AI response logic
      let aiResponse = "I'm working on your travel plan based on what you've told me. Could you also let me know your budget range and how long you're planning to stay?";
      
      // For demo purposes, if user mentions Mongolia, show a more specific response
      if (input.toLowerCase().includes("mongolia")) {
        aiResponse = "Mongolia is an amazing destination! The best time to visit is from May to September when the weather is most pleasant. Would you like me to create an itinerary that includes the Gobi Desert, horseback riding with nomads, and a stay in a traditional ger?";
        setHasPlan(true);
      }
      
      const assistantMessage: MessageType = {
        id: Date.now().toString(),
        role: "assistant",
        content: aiResponse,
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1500);
  };
  
  return (
    <>
      <PlanningHeader 
        user={user}
        title="Chat with Our AI Travel Planner"
        subtitle="Describe your ideal trip and get personalized recommendations"
        action={
          <Button variant="ghost" size="sm" className="gap-2" onClick={onBack}>
            <ArrowLeft className="h-4 w-4" />
            Choose Another Method
          </Button>
        }
      />
      
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-8 gap-6">
          {/* Chat area */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-6"
          >
            <Card className="border-border/40 shadow-sm h-[600px] flex flex-col">
              {/* Chat messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <ChatMessage
                    key={message.id}
                    message={message}
                  />
                ))}
                {isLoading && (
                  <div className="flex items-center space-x-2 p-4 bg-muted/30 rounded-lg max-w-[80%]">
                    <div className="animate-pulse flex space-x-2">
                      <div className="h-2 w-2 bg-primary rounded-full"></div>
                      <div className="h-2 w-2 bg-primary rounded-full"></div>
                      <div className="h-2 w-2 bg-primary rounded-full"></div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
              
              {/* Chat input */}
              <div className="p-4 border-t border-border/40">
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    placeholder="Tell me about your dream trip..."
                    className="flex-1 min-w-0 px-4 py-2 rounded-md border border-border bg-background focus:outline-none focus:ring-1 focus:ring-primary"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                    disabled={isLoading}
                  />
                  <Button 
                    onClick={sendMessage}
                    disabled={isLoading || input.trim() === ""}
                  >
                    <Send className="h-4 w-4" />
                    <span className="sr-only">Send</span>
                  </Button>
                </div>
                
                <div className="mt-3 text-xs text-muted-foreground text-center">
                  Try: &quot;I want to visit Mongolia for 10 days in June with my partner&quot;
                </div>
              </div>
            </Card>
          </motion.div>
          
          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="space-y-4 sticky top-24">
              {/* Action buttons */}
              <Card className="border-border/40 shadow-sm p-4">
                <h3 className="font-medium mb-3">Options</h3>
                
                <div className="space-y-2">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start gap-2" 
                    disabled={!hasPlan}
                  >
                    <Share2 className="h-4 w-4" />
                    Share Plan
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full justify-start gap-2"
                    disabled={!hasPlan}
                  >
                    <Download className="h-4 w-4" />
                    Download PDF
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full justify-start gap-2"
                    onClick={onSwitchToForm}
                  >
                    <ClipboardList className="h-4 w-4" />
                    Switch to Form
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full justify-start gap-2"
                    onClick={() => {
                      setMessages([{
                        id: "1",
                        role: "assistant",
                        content: "Hi there! I'm your AI travel planner. Tell me about the trip you're planning. Where would you like to go, when are you traveling, and what are you interested in?",
                        timestamp: new Date(),
                      }]);
                      setHasPlan(false);
                    }}
                  >
                    <RefreshCw className="h-4 w-4" />
                    Start Over
                  </Button>
                </div>
              </Card>
              
              {/* Tips */}
              <Card className="border-border/40 shadow-sm p-4">
                <h3 className="font-medium mb-3">Chat Tips</h3>
                
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-2">
                    <MessageSquare className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <p className="text-muted-foreground">Be specific about destinations, dates, and activities you enjoy</p>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <MessageSquare className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <p className="text-muted-foreground">Mention your budget and travel style preferences</p>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <MessageSquare className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <p className="text-muted-foreground">Ask follow-up questions to refine your itinerary</p>
                  </div>
                </div>
              </Card>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}