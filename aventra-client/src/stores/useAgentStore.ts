/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { TripFormValues } from "@/lib/validations/trip-schema";
import { nanoid } from 'nanoid';
import { AgentMessage, AgentResponse, initializeAgent, prepareTripFormData, sendMessageToAgent, TripSuggestion } from '@/lib/services/gemini/agent-service';

interface AgentState {
  // State
  isAgentModeActive: boolean;
  isLoading: boolean;
  sessionId: string | null;
  conversation: AgentMessage[];
  currentTrip: Partial<TripFormValues>;
  tripSuggestions: TripSuggestion[];
  lastResponse: AgentResponse | null;
  isGeneratingTrip: boolean;
  tripFormData: TripFormValues | null;
  
  // Actions
  toggleAgentMode: () => Promise<void>;
  sendMessage: (message: string) => Promise<void>;
  resetConversation: () => Promise<void>;
  updateTripField: (fieldPath: string, value: any) => void;
  generateTrip: () => Promise<void>;
  setTripFormData: (data: TripFormValues) => void;
  modifyTrip: (modifications: Partial<TripFormValues>) => void;
}

// Helper function to set nested object properties by path
const setNestedProperty = (obj: any, path: string, value: any) => {
  const parts = path.split('.');
  let current = obj;
  
  for (let i = 0; i < parts.length - 1; i++) {
    const part = parts[i];
    if (!current[part]) current[part] = {};
    current = current[part];
  }
  
  current[parts[parts.length - 1]] = value;
  return obj;
};

export const useAgentStore = create<AgentState>()(
  persist(
    (set, get) => ({
      // Initial state
      isAgentModeActive: false,
      isLoading: false,
      sessionId: null,
      conversation: [],
      currentTrip: {},
      tripSuggestions: [],
      lastResponse: null,
      isGeneratingTrip: false,
      tripFormData: null,

      // Toggle agent mode on/off
      toggleAgentMode: async () => {
        const { isAgentModeActive, conversation } = get();
        
        // If turning on agent mode and no conversation exists, initialize
        if (!isAgentModeActive && conversation.length === 0) {
          set({ isLoading: true });
          
          try {
            const result = await initializeAgent();
            const sessionId = await result.sessionId;
            
            set({
              isAgentModeActive: true,
              sessionId,
              conversation: [result.message],
              isLoading: false
            });
          } catch (error) {
            console.error("Error initializing agent:", error);
            set({ isLoading: false });
          }
        } else {
          // Just toggle the mode
          set({ isAgentModeActive: !isAgentModeActive });
        }
      },

      // Send a message to the agent
      sendMessage: async (message: string) => {
        
        if (message.trim() === "") return;
        
        // Create user message with current timestamp
        const userMessage: AgentMessage = {
          id: nanoid(),
          role: 'user',
          content: message,
          timestamp: new Date().toISOString()
        };
        
        // Update state with user message and loading state
        set(state => ({
          isLoading: true,
          conversation: [...state.conversation, userMessage]
        }));
        
        try {
          // Send message to agent (server action)
          const { response, agentMessage } = await sendMessageToAgent(
            message,
            [...get().conversation, userMessage],
            get().currentTrip
          );
          
          // Update trip data from suggestions
          let updatedTrip = { ...get().currentTrip };
          
          if (response.suggestions && Array.isArray(response.suggestions)) {
            response.suggestions.forEach(suggestion => {
              if (suggestion.type && suggestion.value) {
                // Update nested properties using dot notation
                updatedTrip = setNestedProperty(updatedTrip, suggestion.type, suggestion.value);
              }
            });
          }
          
          // If we have trip data, update our state
          if (response.tripData) {
            updatedTrip = { ...updatedTrip, ...response.tripData };
            if (response.isGeneratingTrip) {
              // The AI thinks we're ready to generate a trip
              set({ tripFormData: response.tripData as TripFormValues });
            }
          }
          
          // Update state with agent response and new trip data
          set(state => ({
            isLoading: false,
            conversation: [...state.conversation, agentMessage],
            currentTrip: updatedTrip,
            lastResponse: response,
            tripSuggestions: response.suggestions || [],
            isGeneratingTrip: !!response.isGeneratingTrip
          }));
          
        } catch (error) {
          console.error("Error sending message to agent:", error);
          
          // Add error message to conversation
          const errorMessage: AgentMessage = {
            id: nanoid(),
            role: 'agent',
            content: "I'm sorry, I encountered an error processing your request. Please try again.",
            timestamp: new Date().toISOString()
          };
          
          set(state => ({
            isLoading: false,
            conversation: [...state.conversation, errorMessage]
          }));
        }
      },

      // Reset the conversation and trip data
      resetConversation: async () => {
        set({ isLoading: true });
        
        try {
          const result = await initializeAgent();
          
          const sessionId = await result.sessionId;
          set({
            sessionId,
            conversation: [result.message],
            currentTrip: {},
            tripSuggestions: [],
            lastResponse: null,
            isGeneratingTrip: false,
            tripFormData: null,
            isLoading: false
          });
        } catch (error) {
          console.error("Error resetting conversation:", error);
          set({ isLoading: false });
        }
      },

      // Update a specific trip field
      updateTripField: (fieldPath: string, value: any) => {
        set(state => {
          const updatedTrip = { ...state.currentTrip };
          return {
            currentTrip: setNestedProperty(updatedTrip, fieldPath, value)
          };
        });
      },

      // Request the agent to prepare trip form data
      generateTrip: async () => {
        const { conversation, currentTrip } = get();
        
        set({ isLoading: true, isGeneratingTrip: true });
        
        try {
          // Call the server action to prepare trip form data
          const { response, agentMessage } = await prepareTripFormData(
            conversation,
            currentTrip
          );
          
          // Check if we have complete trip data
          const tripData = response.tripData as TripFormValues;
          
          set({
            isLoading: false,
            conversation: [...get().conversation, agentMessage],
            currentTrip: { ...get().currentTrip, ...response.tripData },
            lastResponse: response,
            tripFormData: tripData,
            isGeneratingTrip: false
          });
        } catch (error) {
          console.error("Error preparing trip form data:", error);
          
          // Add error message to conversation
          const errorMessage: AgentMessage = {
            id: nanoid(),
            role: 'agent',
            content: "I'm sorry, I had trouble preparing your trip plan. Let's try again.",
            timestamp: new Date().toISOString()
          };
          
          set(state => ({
            isLoading: false,
            isGeneratingTrip: false,
            conversation: [...state.conversation, errorMessage]
          }));
        }
      },

      // Set the complete trip form data
      setTripFormData: (data: TripFormValues) => {
        set({ tripFormData: data });
      },

      // Modify the trip form data based on user feedback
      modifyTrip: (modifications: Partial<TripFormValues>) => {
        const { tripFormData, currentTrip } = get();
        
        const updatedTrip = {
          ...(tripFormData || currentTrip as any),
          ...modifications
        };
        
        set({ 
          tripFormData: updatedTrip as TripFormValues,
          currentTrip: { ...get().currentTrip, ...modifications }
        });
      }
    }),
    {
      name: 'agent-trip-storage',
      storage: createJSONStorage(() => sessionStorage)
    }
  )
);