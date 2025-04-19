"use client";

import { useRef, useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Send, Sparkles, Loader2, MapPin, Calendar, Users, X } from "lucide-react";
import { useSearchStore } from "@/stores/searchStore";
import { useSearchQuery } from "@/hooks/useSearchQuery";
import { format } from "date-fns";

// Types for chat messages
type MessageRole = "assistant" | "user" | "system";
type SuggestionType = "location" | "dates" | "activities" | "budget" | "summary";

interface ChatMessage {
  id: string;
  content: string;
  role: MessageRole;
  timestamp: Date;
  isLoading?: boolean;
  suggestions?: {
    type: SuggestionType;
    text: string;
  }[];
}

interface ChatPlanningDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ChatPlanningDialog({ open, onOpenChange }: ChatPlanningDialogProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const { setFilterOptions, searchQuery, setSearchQuery } = useSearchStore();
  const { mutate: generateItinerary } = useSearchQuery();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Add initial message when dialog opens
  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([
        {
          id: "welcome",
          role: "assistant",
          content: "Hi there! I'm your AI travel planner. Tell me about the trip you're dreaming of, and I'll help you plan it. Where would you like to go?",
          timestamp: new Date(),
          suggestions: [
            { type: "location", text: "Beach vacation" },
            { type: "location", text: "Mountain retreat" },
            { type: "location", text: "City exploration" },
            { type: "location", text: "Cultural experience" }
          ]
        }
      ]);
    }
  }, [open, messages.length]);
  
  // Focus input when dialog opens
  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [open]);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  
  // Handle user message submission
  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    
    if (!inputValue.trim()) return;
    
    // Add user message
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: inputValue,
      timestamp: new Date()
    };
    
    // Add AI message with loading state
    const aiMessageId = `ai-${Date.now()}`;
    const aiLoadingMessage: ChatMessage = {
      id: aiMessageId,
      role: "assistant",
      content: "",
      isLoading: true,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage, aiLoadingMessage]);
    setInputValue("");
    setIsTyping(true);
    
    // Simulate AI response with suggestions based on conversation flow
    setTimeout(() => {
      setIsTyping(false);
      
      // Process message content to determine context
      const messageContext = processMessageContent(inputValue, messages);
      const aiResponse = generateAiResponse(messageContext, messages.length);
      
      setMessages(prev => 
        prev.map(msg => 
          msg.id === aiMessageId 
            ? { ...msg, content: aiResponse.content, isLoading: false, suggestions: aiResponse.suggestions } 
            : msg
        )
      );
    }, 1500);
  };
  
  // Process message content to determine context
  const processMessageContent = (message: string, previousMessages: ChatMessage[]): string => {
    const lowercaseMsg = message.toLowerCase();
    
    if (previousMessages.length <= 1) {
      return "destination";
    } else if (lowercaseMsg.includes("day") || lowercaseMsg.includes("date") || lowercaseMsg.includes("when")) {
      return "dates";
    } else if (lowercaseMsg.includes("people") || lowercaseMsg.includes("family") || lowercaseMsg.includes("friend")) {
      return "group";
    } else if (lowercaseMsg.includes("budget") || lowercaseMsg.includes("cost") || lowercaseMsg.includes("spend")) {
      return "budget";
    } else if (lowercaseMsg.includes("activity") || lowercaseMsg.includes("do") || lowercaseMsg.includes("see")) {
      return "activities";
    } else if (lowercaseMsg.includes("plan") || lowercaseMsg.includes("itinerary") || lowercaseMsg.includes("generate")) {
      return "summary";
    }
    
    return "general";
  };
  
  // Generate AI response based on context
  const generateAiResponse = (context: string, messageCount: number): { content: string; suggestions?: ChatMessage["suggestions"] } => {
    switch(context) {
      case "destination":
        return {
          content: "Great choice! When are you planning to visit? Having dates helps me suggest better activities based on season and local events.",
          suggestions: [
            { type: "dates", text: "Next month" },
            { type: "dates", text: "Summer vacation" },
            { type: "dates", text: "Weekend getaway" },
            { type: "dates", text: "Winter holidays" }
          ]
        };
      case "dates":
        return {
          content: "Perfect! How many people will be traveling? This helps me recommend suitable accommodations and activities.",
          suggestions: [
            { type: "activities", text: "Solo trip" },
            { type: "activities", text: "Couple" },
            { type: "activities", text: "Family with kids" },
            { type: "activities", text: "Group of friends" }
          ]
        };
      case "budget":
        return {
          content: "I'll keep your budget in mind. What kind of activities are you interested in? For example: adventure, relaxation, sightseeing, culinary experiences?",
          suggestions: [
            { type: "activities", text: "Adventure & outdoors" },
            { type: "activities", text: "Cultural experiences" },
            { type: "activities", text: "Food & dining" },
            { type: "activities", text: "Relaxation & wellness" }
          ]
        };
      case "activities":
        return {
          content: "Thanks for sharing your interests! I have enough information to help you plan a great trip. Would you like me to create an itinerary based on what we've discussed?",
          suggestions: [
            { type: "summary", text: "Generate itinerary" },
            { type: "summary", text: "Suggest accommodations" },
            { type: "summary", text: "Recommend restaurants" },
            { type: "summary", text: "More activity ideas" }
          ]
        };
      case "summary":
        return {
          content: "I've analyzed your preferences and created a travel plan. You can now generate a complete itinerary with the button below, or ask me more specific questions about your trip.",
          suggestions: [
            { type: "summary", text: "Generate detailed itinerary" }
          ]
        };
      default:
        if (messageCount > 8) {
          return {
            content: "Based on our conversation, I think I have a good understanding of what you're looking for. Ready to see your personalized travel plan?",
            suggestions: [
              { type: "summary", text: "Generate itinerary now" }
            ]
          };
        }
        return {
          content: "That's helpful to know! What else would you like to share about your travel preferences? Budget constraints, must-see attractions, or specific interests?",
          suggestions: [
            { type: "budget", text: "Discuss budget" },
            { type: "activities", text: "Activity preferences" },
            { type: "summary", text: "I'm ready for suggestions" }
          ]
        };
    }
  };
  
  // Handle suggestion click
  const handleSuggestionClick = (suggestion: string, type: SuggestionType) => {
    setInputValue(suggestion);
    setTimeout(() => {
      handleSubmit();
    }, 100);
    
    // Update search store based on suggestion type
    if (type === "location") {
      setSearchQuery(suggestion);
      setFilterOptions({ location: suggestion });
    } else if (type === "summary" && suggestion.includes("Generate")) {
      // Prepare to transition to actual itinerary generation
      onOpenChange(false);
      
      // Extract destination from chat
      const destinationMessage = messages.find(m => 
        m.role === "user" && messages.indexOf(m) <= 2
      );
      
      if (destinationMessage) {
        setSearchQuery(destinationMessage.content);
      }
      
      // We could also extract dates, group size, etc. from the conversation
      // and set them in the filter options
      
      // Open a confirmation modal or directly trigger generation
      setTimeout(() => {
        if (window.confirm("Generate your personalized itinerary with AI?")) {
          generateItinerary({ 
            query: searchQuery || "travel plan", 
            filters: useSearchStore.getState().filterOptions
          });
        }
      }, 500);
    }
  };
  
  // Generate a rich text representation of the message content
  const renderMessageContent = (content: string) => {
    // This is a placeholder for more complex formatting
    // You could parse markdown, highlight keywords, etc.
    return content;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] p-0 gap-0 h-[80vh] flex flex-col">
        <DialogHeader className="p-6 pb-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Chat with AI Travel Planner
            </DialogTitle>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => onOpenChange(false)}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Share your travel preferences through conversation and get personalized recommendations
          </p>
        </DialogHeader>
        
        <ScrollArea className="flex-1 p-6 pt-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div 
                key={message.id} 
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div 
                  className={`flex gap-3 max-w-[85%] ${message.role === "user" ? "flex-row-reverse" : ""}`}
                >
                  <Avatar className={`h-8 w-8 ${message.role === "assistant" ? "bg-primary/10" : ""}`}>
                    {message.role === "assistant" ? (
                      <Sparkles className="h-4 w-4 text-primary" />
                    ) : (
                      <>
                        <AvatarImage src="/avatars/user.png" />
                        <AvatarFallback>AS</AvatarFallback>
                      </>
                    )}
                  </Avatar>
                  
                  <div>
                    <div 
                      className={`px-4 py-2 rounded-lg ${
                        message.role === "user" 
                          ? "bg-primary text-primary-foreground" 
                          : "bg-muted"
                      }`}
                    >
                      {message.isLoading ? (
                        <div className="flex items-center h-6">
                          <Loader2 className="h-4 w-4 animate-spin" />
                        </div>
                      ) : (
                        <div>{renderMessageContent(message.content)}</div>
                      )}
                    </div>
                    
                    {message.suggestions && !message.isLoading && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {message.suggestions.map((suggestion, i) => (
                          <Badge 
                            key={i}
                            variant="outline" 
                            className="cursor-pointer hover:bg-accent px-3 py-1.5"
                            onClick={() => handleSuggestionClick(suggestion.text, suggestion.type)}
                          >
                            {suggestion.type === "location" && <MapPin className="h-3 w-3 mr-1" />}
                            {suggestion.type === "dates" && <Calendar className="h-3 w-3 mr-1" />}
                            {suggestion.type === "activities" && <Users className="h-3 w-3 mr-1" />}
                            {suggestion.type === "summary" && <Sparkles className="h-3 w-3 mr-1" />}
                            {suggestion.text}
                          </Badge>
                        ))}
                      </div>
                    )}
                    
                    <div className="text-xs text-muted-foreground mt-1 ml-1">
                      {format(message.timestamp, "h:mm a")}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
        
        <form onSubmit={handleSubmit} className="p-4 border-t flex items-center gap-2">
          <Input
            ref={inputRef}
            placeholder="Type your message..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="flex-1"
            disabled={isTyping}
          />
          <Button type="submit" size="icon" disabled={isTyping || !inputValue.trim()}>
            {isTyping ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </form>
        
        <DialogFooter className="px-4 py-3 border-t flex-row justify-between items-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setMessages([])}
            className="text-xs"
          >
            Clear conversation
          </Button>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => {
              onOpenChange(false);
              // You could save the conversation to history here
            }}
          >
            <ArrowRight className="h-4 w-4 mr-1" /> Continue to planner
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}