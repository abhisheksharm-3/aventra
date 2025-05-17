"use client";

import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { type TripFormValues } from "@/lib/validations/trip-schema";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Lightbulb } from "lucide-react";

export function AdditionalContextInput() {
  const { register, watch } = useFormContext<TripFormValues>();
  const additionalContext = watch("additionalContext") || "";
  const MAX_CHARS = 500;
  
  const [isFocused, setIsFocused] = useState(false);
  
  // Calculate character count
  const charCount = additionalContext.length;
  const charCountColor = charCount > MAX_CHARS - 50 
    ? charCount > MAX_CHARS 
      ? "text-destructive" 
      : "text-amber-500"
    : "text-muted-foreground";
  
  // Example trip details to help users
  const exampleDetails = [
    "I'd like to try local authentic cuisine",
    "We're celebrating our anniversary",
    "We prefer less touristy attractions",
    "Looking for outdoor activities",
    "Need wheelchair accessible options"
  ];

  return (
    <Card className={`border border-border/40 shadow-sm transition-all duration-200 ${isFocused ? 'border-primary/50 shadow-md' : ''}`}>
      <CardHeader className="pb-2 pt-4 px-4">
        <CardTitle className="text-base flex items-center gap-2">
          <MessageSquare className="h-4 w-4 text-primary" />
          Additional Details
          <Badge variant="outline" className="font-normal text-xs ml-auto">Optional</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 pb-0 pt-0">
        <div className="space-y-2">
          <div className="text-xs text-muted-foreground">
            Share any additional details that would help us plan your perfect trip:
          </div>
          <Textarea
            placeholder="Tell us more about your trip preferences..."
            className={`resize-none min-h-[120px] bg-background/50 transition-all duration-200 border-muted-foreground/20 ${isFocused ? 'shadow-inner bg-background' : ''}`}
            maxLength={MAX_CHARS}
            {...register("additionalContext", {
              onBlur: () => setIsFocused(false),
            })}
            onFocus={() => setIsFocused(true)}
          />
          
          <div className="flex justify-between items-center text-xs pt-1">
            <div className={charCountColor}>
              {charCount}/{MAX_CHARS} characters
            </div>
            <div className="text-muted-foreground">
              {charCount === 0 ? "Add some details to personalize your trip" : ""}
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="px-4 py-3 mt-2 bg-muted/20 flex flex-col items-start">
        <div className="flex items-center gap-2 text-xs mb-2">
          <Lightbulb className="h-3.5 w-3.5 text-amber-500" />
          <span className="font-medium">Ideas you might include:</span>
        </div>
        
        <div className="flex flex-wrap gap-1.5">
          {exampleDetails.map((detail, index) => (
            <Badge 
              key={index} 
              variant="outline" 
              className="py-0.5 text-xs bg-background/80 cursor-pointer hover:bg-background transition-colors duration-150"
              onClick={() => {
                const currentText = additionalContext;
                const newText = currentText 
                  ? currentText.endsWith(".") || currentText.endsWith("!") || currentText.endsWith("?")
                    ? `${currentText} ${detail}.`
                    : `${currentText}. ${detail}.`
                  : `${detail}.`;
                  
                // Update the form with the new text
                const event = {
                  target: { value: newText }
                } as React.ChangeEvent<HTMLTextAreaElement>;
                register("additionalContext").onChange(event);
              }}
            >
              {detail}
            </Badge>
          ))}
        </div>
      </CardFooter>
    </Card>
  );
}