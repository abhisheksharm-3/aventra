import { formatDistanceToNow } from "date-fns";
import { User } from "lucide-react";

interface ChatMessageProps {
  message: {
    id: string;
    role: "user" | "assistant";
    content: string;
    timestamp: Date;
  };
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";
  
  return (
    <div className={`flex items-start gap-3 ${isUser ? "justify-end" : ""}`}>
      {!isUser && (
        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
          <span className="text-primary font-medium text-sm">AI</span>
        </div>
      )}
      
      <div className={`rounded-lg p-4 max-w-[80%] ${
        isUser 
          ? "bg-primary text-white" 
          : "bg-muted/30"
      }`}>
        <p className="whitespace-pre-wrap">{message.content}</p>
        <div className={`text-xs mt-1 ${isUser ? "text-white/70" : "text-muted-foreground"}`}>
          {formatDistanceToNow(message.timestamp, { addSuffix: true })}
        </div>
      </div>
      
      {isUser && (
        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
          <User className="h-4 w-4 text-primary" />
        </div>
      )}
    </div>
  );
}