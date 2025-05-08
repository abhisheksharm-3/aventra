import { z } from "zod";

// Create schema based on the JSON schema provided
export const tripRequestSchema = z.object({
  location: z.object({
    destination: z.string().min(1, "Destination is required"),
    baseCity: z.string().optional(),
  }),
  
  dates: z.object({
    startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"),
    endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"),
    isFlexible: z.boolean().default(false),
  }),
  
  travelers: z.object({
    count: z.number().int().min(1, "At least 1 traveler required"),
    adults: z.number().int().min(0).default(1),
    children: z.number().int().min(0).default(0),
    infants: z.number().int().min(0).default(0),
  }),
  
  budget: z.object({
    ceiling: z.number().int().optional(),
    currency: z.string().default("USD"),
  }).optional(),
  
  tripStyle: z.array(
    z.enum([
      "adventure", "family", "dining", "night-out", "date", "beach", "culture", 
      "food", "nature", "urban", "wellness", "nightlife", "cruise", "history"
    ])
  ).default([]),
  
  preferences: z.object({
    interests: z.array(z.string()).default([]),
    travelStyle: z.array(z.string()).default([]),
    dietaryPreferences: z.array(z.string()).default([]),
    pace: z.enum(["relaxed", "moderate", "fast"]).default("moderate"),
    accessibility: z.object({
      mobilityNeeds: z.boolean().default(false),
      hearingNeeds: z.boolean().default(false),
      visionNeeds: z.boolean().default(false),
      dietaryRestrictions: z.boolean().default(false),
      notes: z.string().optional(),
    }).optional(),
  }).optional(),
  
  additionalContext: z.string().optional(),
});

export type TripRequestData = z.infer<typeof tripRequestSchema>;