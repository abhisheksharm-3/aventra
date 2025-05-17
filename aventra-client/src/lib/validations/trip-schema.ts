import { z } from "zod";

export const locationSchema = z.object({
  destination: z.string().min(1, "Destination is required"),
  baseCity: z.string().min(1, "Base city is required"),
});

export const datesSchema = z.object({
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Must be in YYYY-MM-DD format"),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Must be in YYYY-MM-DD format"),
  isFlexible: z.boolean().default(false),
}).refine(data => new Date(data.startDate) <= new Date(data.endDate), {
  message: "End date must be after start date",
  path: ["endDate"],
});

export const travelersSchema = z.object({
  count: z.number().int().min(1, "At least one traveler is required"),
  adults: z.number().int().min(0).default(1),
  children: z.number().int().min(0).default(0),
  infants: z.number().int().min(0).default(0),
}).refine(data => data.adults + data.children + data.infants === data.count, {
  message: "Total travelers must match the sum of adults, children, and infants",
  path: ["count"],
});

export const budgetSchema = z.object({
  ceiling: z.number().int().positive("Budget must be positive"),
  currency: z.string().default("USD"),
});

export const tripStyleSchema = z.array(
  z.enum([
    "adventure", "family", "dining", "night-out", "date", "beach", 
    "culture", "food", "nature", "urban", "wellness", "nightlife", 
    "cruise", "history"
  ])
).min(1, "Select at least one trip style");

export const preferencesSchema = z.object({
  interests: z.array(z.string()).optional(),
  travelStyle: z.array(z.string()).optional(),
  dietaryPreferences: z.array(z.string()).optional(),
  pace: z.enum(["relaxed", "moderate", "fast"]).default("moderate"),
  accessibility: z.object({
    mobilityNeeds: z.boolean().default(false),
    hearingNeeds: z.boolean().default(false),
    visionNeeds: z.boolean().default(false),
    sensoryNeeds: z.boolean().default(false),
    notes: z.string().optional(),
  }).optional(),
});

export const tripFormSchema = z.object({
  location: locationSchema,
  dates: datesSchema,
  travelers: travelersSchema,
  budget: budgetSchema.optional(),
  tripStyle: tripStyleSchema,
  preferences: preferencesSchema,
  additionalContext: z.string().optional(),
});

export type TripFormValues = z.infer<typeof tripFormSchema>;