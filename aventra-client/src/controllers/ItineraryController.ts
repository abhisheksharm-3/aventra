"use server";

import { Client, Databases, ID, Query, Models } from "node-appwrite";
import { getLoggedInUser } from "@/lib/services/appwrite/appwrite";
import { 
  GeneratedItineraryResponse,
} from "@/types/itinerary";
import { BudgetDocument, DayDocument, ItineraryDocument, JourneyPathDocument, RecommendationDocument, TimeBlockDocument } from "@/types/appwrite";

// Define collection IDs
const DATABASE_ID = process.env.APPWRITE_TRIPS_DB || "";
const COLLECTIONS = {
  itineraries: process.env.COLLECTION_ITINERARIES || "",
  budgetBreakdowns: process.env.COLLECTION_BUDGET_BREAKDOWNS || "",
  itineraryDays: process.env.COLLECTION_ITINERARY_DAYS || "",
  timeBlocks: process.env.COLLECTION_TIME_BLOCKS || "",
  recommendations: process.env.COLLECTION_RECOMMENDATIONS || "",
  journeyPaths: process.env.COLLECTION_JOURNEY_PATHS || ""
};

/**
 * Creates a database client with user session
 */
async function createDatabaseClient(): Promise<Databases> {
  try {
    const endpoint = process.env.APPWRITE_ENDPOINT;
    const projectId = process.env.APPWRITE_PROJECT_ID;
    const apiKey = process.env.APPWRITE_KEY!;
    
    if (!endpoint || !projectId) {
      throw new Error("Missing required environment variables");
    }
    
    const client = new Client()
      .setEndpoint(endpoint)
      .setProject(projectId)
      .setKey(apiKey);
    
    return new Databases(client);
  } catch (error) {
    console.error("Database client creation failed:", error);
    throw error instanceof Error ? error : new Error("Failed to create database client");
  }
}

/**
 * Validates required collection IDs are configured
 */
function validateCollectionConfig(): void {
  const missingCollections = Object.entries(COLLECTIONS)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    .filter(([_, value]) => !value)
    .map(([key]) => key);
  
  if (missingCollections.length > 0) {
    throw new Error(`Missing required collection IDs: ${missingCollections.join(", ")}`);
  }
  
  if (!DATABASE_ID) {
    throw new Error("Missing required database ID");
  }
}

/**
 * Saves the main itinerary document
 */
async function saveMainItinerary(
  databases: Databases, 
  tripId: string, 
  userId: string, 
  data: GeneratedItineraryResponse, 
): Promise<Models.Document> {
  return databases.createDocument(
    DATABASE_ID,
    COLLECTIONS.itineraries,
    tripId,
    {
      trip_id: tripId,
      user_id: userId,
      trip_type: data.metadata.trip_type,
      duration_days: data.metadata.duration_days,
      currency: data.metadata.total_budget.currency,
      total_budget: parseFloat(data.metadata.total_budget.total),
      preferences: JSON.stringify(data.metadata.preferences),
      essential_info: JSON.stringify(data.essential_info),
      status: 'created'
    }
  );
}

/**
 * Saves the budget breakdown
 */
async function saveBudgetBreakdown(
  databases: Databases, 
  tripId: string, 
  data: GeneratedItineraryResponse
): Promise<Models.Document> {
  return databases.createDocument(
    DATABASE_ID,
    COLLECTIONS.budgetBreakdowns,
    ID.unique(),
    {
      trip_id: tripId,
      accommodation: data.metadata.total_budget.breakdown.accommodation,
      transportation: data.metadata.total_budget.breakdown.transportation,
      activities: data.metadata.total_budget.breakdown.activities,
      food: data.metadata.total_budget.breakdown.food,
      currency: data.metadata.total_budget.currency
    }
  );
}

/**
 * Saves a single day's data
 */
async function saveItineraryDay(
  databases: Databases, 
  tripId: string, 
  day: GeneratedItineraryResponse['itinerary'][0]
): Promise<{ dayId: string }> {
  const dayId = ID.unique();
  
  await databases.createDocument(
    DATABASE_ID,
    COLLECTIONS.itineraryDays,
    dayId,
    {
      trip_id: tripId,
      day_id: dayId,
      day_number: day.day_number,
      date: day.date,
      weather: JSON.stringify(day.weather)
    }
  );
  
  return { dayId };
}

/**
 * Saves time blocks for a specific day
 */
async function saveTimeBlocks(
  databases: Databases, 
  tripId: string, 
  dayId: string, 
  timeBlocks: GeneratedItineraryResponse['itinerary'][0]['time_blocks']
): Promise<void> {
  const savePromises = timeBlocks.map(block => {
    const blockType = block.activity ? 'activity' : (block.travel ? 'travel' : 'other');
    const content = block.activity ? 
      JSON.stringify(block.activity) : 
      (block.travel ? JSON.stringify(block.travel) : null);
    
    // Preserve priority info if available
    let priority = 0;
    if (block.activity?.priority) {
      priority = block.activity.priority;
    }
    
    return databases.createDocument(
      DATABASE_ID,
      COLLECTIONS.timeBlocks,
      ID.unique(),
      {
        trip_id: tripId,
        day_id: dayId,
        block_id: ID.unique(),
        type: block.type,
        block_type: blockType,
        start_time: block.start_time,
        end_time: block.end_time,
        duration_minutes: block.duration_minutes,
        content: content,
        warnings: block.warnings ? JSON.stringify(block.warnings) : null,
        priority: priority // Store priority from activity or warnings
      }
    );
  });
  
  await Promise.all(savePromises);
}

/**
 * Saves all recommendations by type
 */
async function saveRecommendations(
  databases: Databases, 
  tripId: string, 
  recommendations: GeneratedItineraryResponse['recommendations']
): Promise<void> {
  // Process accommodations
  const accommodationsPromises = recommendations.accommodations.map(item => 
    databases.createDocument(
      DATABASE_ID,
      COLLECTIONS.recommendations,
      ID.unique(),
      {
        trip_id: tripId,
        rec_id: ID.unique(),
        rec_type: 'accommodations',
        name: item.name,
        content: JSON.stringify(item)
      }
    )
  );
  
  // Process dining options
  const diningPromises = recommendations.dining.map(item => 
    databases.createDocument(
      DATABASE_ID,
      COLLECTIONS.recommendations,
      ID.unique(),
      {
        trip_id: tripId,
        rec_id: ID.unique(),
        rec_type: 'dining',
        name: item.name,
        content: JSON.stringify(item)
      }
    )
  );
  
  // Process transportation options
  const transportationPromises = recommendations.transportation.map(item => 
    databases.createDocument(
      DATABASE_ID,
      COLLECTIONS.recommendations,
      ID.unique(),
      {
        trip_id: tripId,
        rec_id: ID.unique(),
        rec_type: 'transportation',
        name: item.operator || 'Transportation option',
        content: JSON.stringify(item)
      }
    )
  );
  
  // Wait for all operations to complete
  await Promise.all([
    ...accommodationsPromises,
    ...diningPromises,
    ...transportationPromises
  ]);
}

/**
 * Saves journey path data
 */
async function saveJourneyPath(
  databases: Databases, 
  tripId: string, 
  journeyPath: GeneratedItineraryResponse['journey_path']
): Promise<void> {
  if (!journeyPath) return;
  
  await databases.createDocument(
    DATABASE_ID,
    COLLECTIONS.journeyPaths,
    ID.unique(),
    {
      trip_id: tripId,
      overview: JSON.stringify(journeyPath.overview),
      distance_km: journeyPath.distance_km,
      elevation_profile: JSON.stringify(journeyPath.elevation_profile)
    }
  );
}

/**
 * Main function to save an itinerary
 */
export async function saveItinerary(data: GeneratedItineraryResponse): Promise<{
  success: boolean;
  tripId?: string;
  message?: string;
  error?: string;
}> {
  try {
    validateCollectionConfig();
    
    // Get current user
    const user = await getLoggedInUser();
    if (!user) {
      return { success: false, error: "User not authenticated" };
    }
    
    const userId = user.$id;
    
    // Generate a unique trip ID
    const tripId = ID.unique();
    
    // Get database client
    const databases = await createDatabaseClient();
    
    // Step 1: Save main itinerary data
    await saveMainItinerary(databases, tripId, userId, data);
    
    // Step 2: Save budget breakdown
    await saveBudgetBreakdown(databases, tripId, data);
    
    // Step 3: Save each day and its time blocks
    for (const day of data.itinerary) {
      const { dayId } = await saveItineraryDay(databases, tripId, day);
      await saveTimeBlocks(databases, tripId, dayId, day.time_blocks);
    }
    
    // Step 4: Save recommendations
    await saveRecommendations(databases, tripId, data.recommendations);
    
    // Step 5: Save journey path
    await saveJourneyPath(databases, tripId, data.journey_path);
    
    return { 
      success: true, 
      tripId,
      message: 'Itinerary saved successfully' 
    };
    
  } catch (error) {
    console.error('Error saving itinerary:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to save itinerary'
    };
  }
}

/**
 * Fetches the main itinerary document
 */
async function fetchMainItinerary(
  databases: Databases, 
  tripId: string
): Promise<ItineraryDocument> {
  const result = await databases.listDocuments<ItineraryDocument>(
    DATABASE_ID, 
    COLLECTIONS.itineraries, 
    [Query.equal('trip_id', tripId)]
  );
  
  if (result.documents.length === 0) {
    throw new Error('Itinerary not found');
  }
  
  return result.documents[0];
}

/**
 * Fetches budget breakdown
 */
async function fetchBudgetBreakdown(
  databases: Databases, 
  tripId: string
): Promise<BudgetDocument | null> {
  const result = await databases.listDocuments<BudgetDocument>(
    DATABASE_ID, 
    COLLECTIONS.budgetBreakdowns, 
    [Query.equal('trip_id', tripId)]
  );
  
  return result.documents[0] || null;
}

/**
 * Fetches all days for an itinerary
 */
async function fetchItineraryDays(
  databases: Databases, 
  tripId: string
): Promise<DayDocument[]> {
  const result = await databases.listDocuments<DayDocument>(
    DATABASE_ID, 
    COLLECTIONS.itineraryDays, 
    [
      Query.equal('trip_id', tripId),
      Query.orderAsc('day_number')
    ]
  );
  
  return result.documents;
}

/**
 * Fetches all time blocks for an itinerary
 */
async function fetchTimeBlocks(
  databases: Databases, 
  tripId: string
): Promise<TimeBlockDocument[]> {
  const result = await databases.listDocuments<TimeBlockDocument>(
    DATABASE_ID, 
    COLLECTIONS.timeBlocks, 
    [Query.equal('trip_id', tripId)]
  );
  
  return result.documents;
}

/**
 * Fetches all recommendations for an itinerary
 */
async function fetchRecommendations(
  databases: Databases, 
  tripId: string
): Promise<RecommendationDocument[]> {
  const result = await databases.listDocuments<RecommendationDocument>(
    DATABASE_ID, 
    COLLECTIONS.recommendations, 
    [Query.equal('trip_id', tripId)]
  );
  
  return result.documents;
}

/**
 * Fetches journey path for an itinerary
 */
async function fetchJourneyPath(
  databases: Databases, 
  tripId: string
): Promise<JourneyPathDocument | null> {
  const result = await databases.listDocuments<JourneyPathDocument>(
    DATABASE_ID, 
    COLLECTIONS.journeyPaths, 
    [Query.equal('trip_id', tripId)]
  );
  
  return result.documents.length > 0 ? result.documents[0] : null;
}

/**
 * Organizes time blocks by day and properly handles activity priority and warnings
 */
function organizeTimeBlocksByDay(
  timeBlocks: TimeBlockDocument[]
): Record<string, GeneratedItineraryResponse['itinerary'][0]['time_blocks']> {
  const timeBlocksByDay: Record<string, GeneratedItineraryResponse['itinerary'][0]['time_blocks']> = {};
  
  timeBlocks.forEach(block => {
    const dayId = block.day_id;
    if (!timeBlocksByDay[dayId]) {
      timeBlocksByDay[dayId] = [];
    }
    
    // Parse content based on block type
    let activity = undefined;
    let travel = undefined;
    let warnings = undefined;
    
    if (block.content) {
      if (block.block_type === 'activity') {
        activity = JSON.parse(block.content);
      } else if (block.block_type === 'travel') {
        travel = JSON.parse(block.content);
      }
    }
    
    if (block.warnings) {
      warnings = JSON.parse(block.warnings);
    }
    
    // Build time block with proper types - using the exact type from GeneratedItineraryResponse
    const timeBlock: GeneratedItineraryResponse['itinerary'][0]['time_blocks'][0] = {
      type: block.type, // This is already "fixed" | "flexible"
      start_time: block.start_time,
      end_time: block.end_time,
      duration_minutes: block.duration_minutes
    };
    
    if (activity) timeBlock.activity = activity;
    if (travel) timeBlock.travel = travel;
    if (warnings) timeBlock.warnings = warnings;
    
    timeBlocksByDay[dayId].push(timeBlock);
  });
  
  return timeBlocksByDay;
}

/**
 * Assembles complete itinerary from components
 */
function assembleItinerary(
  itinerary: ItineraryDocument, 
  budget: BudgetDocument | null, 
  days: DayDocument[], 
  timeBlocksByDay: Record<string, GeneratedItineraryResponse['itinerary'][0]['time_blocks']>,
  recommendations: RecommendationDocument[],
  journeyPath: JourneyPathDocument | null
): GeneratedItineraryResponse {
  // Process recommendations by type
  const accommodations: GeneratedItineraryResponse['recommendations']['accommodations'] = [];
  const dining: GeneratedItineraryResponse['recommendations']['dining'] = [];
  const transportation: GeneratedItineraryResponse['recommendations']['transportation'] = [];
  
  recommendations.forEach(rec => {
    const content = JSON.parse(rec.content);
    if (rec.rec_type === 'accommodations') {
      // Ensure null values are converted to defaults
      if (content.location && content.location.coordinates) {
        content.location.coordinates.lat = content.location.coordinates.lat || 0;
        content.location.coordinates.lng = content.location.coordinates.lng || 0;
      }
      accommodations.push(content);
    } else if (rec.rec_type === 'dining') {
      dining.push(content);
    } else if (rec.rec_type === 'transportation') {
      // Ensure required fields have valid values
      content.duration = content.duration || 0;
      transportation.push(content);
    }
  });
  
  return {
    isSuccess: true,
    id: itinerary.trip_id,
    name: itinerary.name,
    metadata: {
      trip_type: itinerary.trip_type,
      duration_days: itinerary.duration_days,
      total_budget: {
        currency: budget?.currency || itinerary.currency,
        total: String(itinerary.total_budget),
        breakdown: budget ? {
          accommodation: budget.accommodation,
          transportation: budget.transportation,
          activities: budget.activities,
          food: budget.food
        } : {
          accommodation: 0,
          transportation: 0,
          activities: 0,
          food: 0
        }
      },
      preferences: JSON.parse(itinerary.preferences)
    },
    itinerary: days.map(day => ({
      day_number: day.day_number,
      date: day.date,
      weather: JSON.parse(day.weather),
      time_blocks: timeBlocksByDay[day.day_id] || []
    })),
    recommendations: {
      accommodations,
      dining,
      transportation
    },
    essential_info: JSON.parse(itinerary.essential_info),
    journey_path: journeyPath ? {
      overview: JSON.parse(journeyPath.overview),
      distance_km: journeyPath.distance_km,
      elevation_profile: JSON.parse(journeyPath.elevation_profile)
    } : {
      overview: [],
      distance_km: 0,
      elevation_profile: []
    },
    currentDateTime: itinerary.$createdAt,
    currentUser: itinerary.user_id
  };
}

/**
 * Main function to retrieve an itinerary
 */
export async function getItinerary(tripId: string): Promise<{
  success: boolean;
  itinerary?: GeneratedItineraryResponse;
  error?: string;
}> {
  try {
    validateCollectionConfig();
    
    // Get database client
    const databases = await createDatabaseClient();
    
    // Fetch all components in parallel for better performance
    const [
      itinerary,
      budget,
      days,
      timeBlocks,
      recommendations,
      journeyPath
    ] = await Promise.all([
      fetchMainItinerary(databases, tripId),
      fetchBudgetBreakdown(databases, tripId),
      fetchItineraryDays(databases, tripId),
      fetchTimeBlocks(databases, tripId),
      fetchRecommendations(databases, tripId),
      fetchJourneyPath(databases, tripId)
    ]);
    
    // Organize data
    const timeBlocksByDay = organizeTimeBlocksByDay(timeBlocks);
    
    // Assemble complete itinerary
    const completeItinerary = assembleItinerary(
      itinerary,
      budget,
      days,
      timeBlocksByDay,
      recommendations,
      journeyPath
    );
    
    return {
      success: true,
      itinerary: completeItinerary
    };
    
  } catch (error) {
    console.error('Error retrieving itinerary:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to retrieve itinerary'
    };
  }
}

/**
 * Model for itinerary preview information
 */
interface ItineraryPreview {
  tripId: string;
  name: string;
  tripType: string;
  createdAt: string;
  durationDays: number;
  totalBudget: number;
  currency: string;
}

/**
 * Gets all itineraries for the current user
 */
export async function getUserItineraries(): Promise<{
  success: boolean;
  itineraries?: ItineraryPreview[];
  error?: string;
}> {
  try {
    validateCollectionConfig();
    
    // Get current user
    const user = await getLoggedInUser();
    if (!user) {
      return { success: false, error: "User not authenticated" };
    }
    
    // Get database client
    const databases = await createDatabaseClient();
    
    // Fetch all itineraries for this user
    const result = await databases.listDocuments<ItineraryDocument>(
      DATABASE_ID,
      COLLECTIONS.itineraries,
      [
        Query.equal('user_id', user.$id),
        Query.orderDesc('created_at')
      ]
    );
    
    const itineraries = result.documents.map(doc => ({
      tripId: doc.trip_id,
      name: doc.name,
      tripType: doc.trip_type,
      createdAt: doc.$createdAt,
      durationDays: doc.duration_days,
      totalBudget: doc.total_budget,
      currency: doc.currency
    }));
    
    return {
      success: true,
      itineraries
    };
    
  } catch (error) {
    console.error('Error getting user itineraries:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get user itineraries'
    };
  }
}

/**
 * Deletes an itinerary and all related records
 */
export async function deleteItinerary(tripId: string): Promise<{
  success: boolean;
  message?: string;
  error?: string;
}> {
  try {
    validateCollectionConfig();
    
    // Get current user
    const user = await getLoggedInUser();
    if (!user) {
      return { success: false, error: "User not authenticated" };
    }
    
    // Get database client
    const databases = await createDatabaseClient();
    
    // First, verify the user owns this itinerary
    const itinerary = await fetchMainItinerary(databases, tripId);
    if (itinerary.user_id !== user.$id) {
      return { success: false, error: "You don't have permission to delete this itinerary" };
    }
    
    // Fetch all related documents
    const [
      budgets,
      days,
      timeBlocks,
      recommendations,
      journeyPaths
    ] = await Promise.all([
      databases.listDocuments<BudgetDocument>(DATABASE_ID, COLLECTIONS.budgetBreakdowns, [Query.equal('trip_id', tripId)]),
      databases.listDocuments<DayDocument>(DATABASE_ID, COLLECTIONS.itineraryDays, [Query.equal('trip_id', tripId)]),
      databases.listDocuments<TimeBlockDocument>(DATABASE_ID, COLLECTIONS.timeBlocks, [Query.equal('trip_id', tripId)]),
      databases.listDocuments<RecommendationDocument>(DATABASE_ID, COLLECTIONS.recommendations, [Query.equal('trip_id', tripId)]),
      databases.listDocuments<JourneyPathDocument>(DATABASE_ID, COLLECTIONS.journeyPaths, [Query.equal('trip_id', tripId)])
    ]);
    
    // Delete all related documents
    await Promise.all([
      // Delete main itinerary document
      databases.deleteDocument(DATABASE_ID, COLLECTIONS.itineraries, itinerary.$id),
      
      // Delete all related documents
      ...budgets.documents.map(doc => 
        databases.deleteDocument(DATABASE_ID, COLLECTIONS.budgetBreakdowns, doc.$id)),
      ...days.documents.map(doc => 
        databases.deleteDocument(DATABASE_ID, COLLECTIONS.itineraryDays, doc.$id)),
      ...timeBlocks.documents.map(doc => 
        databases.deleteDocument(DATABASE_ID, COLLECTIONS.timeBlocks, doc.$id)),
      ...recommendations.documents.map(doc => 
        databases.deleteDocument(DATABASE_ID, COLLECTIONS.recommendations, doc.$id)),
      ...journeyPaths.documents.map(doc => 
        databases.deleteDocument(DATABASE_ID, COLLECTIONS.journeyPaths, doc.$id))
    ]);
    
    return {
      success: true,
      message: 'Itinerary deleted successfully'
    };
    
  } catch (error) {
    console.error('Error deleting itinerary:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete itinerary'
    };
  }
}