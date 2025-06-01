/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { TripFormValues } from "@/lib/validations/trip-schema";
import { cookies } from "next/headers";
import { nanoid } from 'nanoid';
import { getGeminiModel, isConfigured } from "./client";

// Define interfaces for our messages and responses
export interface AgentMessage {
  id: string;
  role: 'user' | 'agent' | 'system';
  content: string;
  timestamp: string;
}

export interface TripSuggestion {
  type: string;
  value: any;
  confidence?: number;
}

export interface AgentResponse {
  message: string;
  suggestions?: TripSuggestion[];
  isGeneratingTrip?: boolean;
  tripData?: Partial<TripFormValues>;
}

// System prompt that defines how the agent behaves
const SYSTEM_PROMPT = `
You are AventrAI, an intelligent travel planning assistant. Help users plan their perfect trip by having a natural conversation.

TASK:
- Guide the conversation to collect all necessary trip information
- Make smart, personalized travel suggestions based on user preferences
- Fill in trip details progressively as you learn them
- When you have enough information, suggest generating a complete trip plan

REQUIRED TRIP INFORMATION (following this specific schema):
- location: { destination: string, baseCity: string }
- dates: { startDate: "YYYY-MM-DD", endDate: "YYYY-MM-DD", isFlexible: boolean }
- travelers: { count: number, adults: number, children: number, infants: number }
- budget: { ceiling: number, currency: string }
- tripStyle: Array of strings from ["adventure", "family", "dining", "night-out", "date", "beach", "culture", "food", "nature", "urban", "wellness", "nightlife", "cruise", "history"]
- preferences: { 
    interests: string[], 
    travelStyle: string[], 
    dietaryPreferences: string[],
    pace: "relaxed" | "moderate" | "fast",
    accessibility: {
      mobilityNeeds: boolean,
      hearingNeeds: boolean,
      visionNeeds: boolean,
      sensoryNeeds: boolean,
      notes: string
    }
  }
- additionalContext: string (any special requirements or notes)

CONVERSATION APPROACH:
1. Start by asking for high-level trip info (destination, dates, purpose)
2. Make personalized suggestions based on what you learn
3. Fill in missing details via natural conversation
4. When you have enough information, suggest generating a complete trip

RESPONSE FORMAT:
Always respond with a JSON object with the following structure:
{
  "message": "Your conversational response to the user",
  "suggestions": [
    {
      "type": "location.destination", // Use dot notation for nested fields
      "value": "the suggested value"
    }
  ],
  "isGeneratingTrip": false, // Set to true when enough data is collected for a trip
  "tripData": null // Only fill this when you have enough data to generate a trip
}

IMPORTANT: Do not include code blocks, formatting, or the JSON structure in your message. The message field should only contain conversational text that will be shown directly to the user.

RULES:
- Be conversational and friendly, not robotic
- Don't ask for all information at once
- Make specific recommendations based on user preferences
- Suggest realistic budgets and timeframes for destinations
- Consider seasonality and local events when suggesting dates
- Ensure tripData follows the exact schema described above when you're ready to generate a trip

Today's date is: 2025-06-01
Current time is: 06:28:42 UTC
`;

// Helper function to get or create a session ID
const getOrCreateSessionId = async () => {
  const cookieStore = await cookies();
  let sessionId = cookieStore.get('agent-session-id')?.value;
  
  if (!sessionId) {
    sessionId = nanoid();
  }
  
  return sessionId;
};

// Helper function to format trip data for Gemini
const formatTripForGeneration = (tripData: Partial<TripFormValues>): string => {
  return JSON.stringify(tripData, null, 2);
};

/**
 * Initialize a new agent conversation
 * @returns The session ID and welcome message
 */
export async function initializeAgent() {
  const sessionId = getOrCreateSessionId();
  
  return {
    sessionId,
    message: {
      id: nanoid(),
      role: 'agent' as const,
      content: "Hi there! I'm AventrAI, your personal travel assistant. I can help you plan your perfect trip. Tell me where you'd like to go, when you're traveling, and what kind of experience you're looking for!",
      timestamp: new Date().toISOString()
    }
  };
}

/**
 * Send a message to the agent and get a response
 * @param message The user's message
 * @param history Previous conversation history
 * @param currentTrip Current trip data
 * @returns The agent's response
 */
export async function sendMessageToAgent(
  message: string,
  history: AgentMessage[],
  currentTrip: Partial<TripFormValues>
): Promise<{
  response: AgentResponse;
  agentMessage: AgentMessage;
}> {
  if (!isConfigured()) {
    throw new Error("Gemini API is not configured properly");
  }

  const model = getGeminiModel();
  
  try {
    // Construct the prompt for Gemini
    const conversationContext = [
      { role: 'user' as const, parts: [{ text: SYSTEM_PROMPT }] },
      { role: 'model' as const, parts: [{ text: "I understand my role as AventrAI, the travel planning assistant. I'll help users plan their perfect trip through natural conversation." }] },
      ...history.map(msg => ({
        role: msg.role === 'user' ? 'user' as const : 'model' as const,
        parts: [{ text: msg.content }]
      })),
      { role: 'user' as const, parts: [{ text: message }] },
      { role: 'user' as const, parts: [{ text: `Current trip details: ${formatTripForGeneration(currentTrip)}` }] },
    ];
    
    // Generate response from Gemini
    const result = await model.generateContent({
      contents: conversationContext,
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 800,
      }
    });
    
    const responseText = result.response.text();
    
    // Parse the JSON response
    let parsedResponse: AgentResponse;
    try {
      // Try to parse the response as JSON
      parsedResponse = JSON.parse(responseText);
      
      // Sanitize the response to make sure we don't show any JSON structures
      if (parsedResponse.message && typeof parsedResponse.message === 'string') {
        // Check if the message itself contains JSON structures and clean them
        if (parsedResponse.message.includes('```') || parsedResponse.message.includes('{') || parsedResponse.message.includes('```json')) {
          // Remove any code blocks or JSON structures from the message
          let cleanMessage = parsedResponse.message;
          cleanMessage = cleanMessage.replace(/```json\s*\{[\s\S]*?\}\s*```/g, '');
          cleanMessage = cleanMessage.replace(/```\s*\{[\s\S]*?\}\s*```/g, '');
          cleanMessage = cleanMessage.replace(/```[\s\S]*?```/g, '');
          
          // Ensure we don't have any JSON literal objects in the message
          cleanMessage = cleanMessage.replace(/\{[\s\S]*?"message"[\s\S]*?\}/g, '');
          
          parsedResponse.message = cleanMessage.trim();
        }
      }
    } catch (e) {
      console.error("Failed to parse Gemini response as JSON", e);
      // If the response isn't valid JSON, try to extract just the message part
      let fallbackMessage = responseText;
      
      // Check if response contains JSON but with extra text
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          const extractedJson = JSON.parse(jsonMatch[0]);
          if (extractedJson.message) {
            fallbackMessage = extractedJson.message;
          }
        } catch (innerError) {
          console.error("Failed to extract message from partial JSON", innerError);
        }
      }
      
      // Fallback response with clean message
      parsedResponse = {
        message: fallbackMessage.replace(/```json[\s\S]*?```/g, '').replace(/```[\s\S]*?```/g, '').trim() || 
          "I'm having trouble processing your request. Let's continue planning your trip."
      };
    }
    
    // Create the agent message
    const agentMessage: AgentMessage = {
      id: nanoid(),
      role: 'agent',
      content: parsedResponse.message,
      timestamp: new Date().toISOString()
    };
    
    return {
      response: parsedResponse,
      agentMessage
    };
  } catch (error) {
    console.error('Error communicating with Gemini:', error);
    
    // Return a fallback response on error
    return {
      response: {
        message: "I'm sorry, I encountered an error while processing your request. Please try again later."
      },
      agentMessage: {
        id: nanoid(),
        role: 'agent',
        content: "I'm sorry, I encountered an error while processing your request. Please try again later.",
        timestamp: new Date().toISOString()
      }
    };
  }
}

/**
 * Process trip data to prepare it for submission via the useTripSubmission hook
 * @param history Conversation history
 * @param currentTrip Current trip data
 * @returns Complete trip form data
 */
export async function prepareTripFormData(
  history: AgentMessage[],
  currentTrip: Partial<TripFormValues>
): Promise<{
  response: AgentResponse;
  agentMessage: AgentMessage;
}> {
  // Use the sendMessageToAgent function with a special prompt
  return sendMessageToAgent(
    "Based on our conversation, please prepare a complete trip plan with all necessary details following the schema I provided. Make sure to include all required fields.",
    history,
    currentTrip
  );
}