/* eslint-disable @typescript-eslint/no-unused-vars */
"use server"

import { Destination, InDepthDestination } from "@/types/dashboard";
import { getGeminiModel, isConfigured } from "./client";

/**
 * Interface for raw destination data returned from Gemini API
 */
interface RawDestinationData {
  id?: string;
  name: string;
  tagline: string;
  match?: number;
  imageQuery: string;
  [key: string]: unknown; // Allow for additional properties
}

/**
 * Interface for raw in-depth destination data from Gemini API
 */
interface RawInDepthDestinationData extends RawDestinationData {
  description: string;
  bestTimeToVisit: string;
  highlights: string[];
  travelTips: string[];
  localCuisine: string[];
  culturalNotes: string;
  budget: {
    currency: string;
    hostel: string;
    midRange: string;
    luxury: string;
    averageMeal: string;
    transportDaily: string;
  };
}

/**
 * Fetches AI-recommended destinations based on user preferences
 * 
 * @param userPreferences - Optional string describing user preferences
 * @returns Array of destination recommendations
 */
export async function getRecommendedDestinations(
  userPreferences?: string
): Promise<Destination[]> {
  if (!isConfigured()) {
    console.warn("Gemini API not configured");
    return getSampleDestinations("recommendations");
  }

  try {
    const model = getGeminiModel();
    const preferences = userPreferences || "general travel destinations";

    const prompt = `You are a JSON API. Return ONLY valid JSON, no explanations, no markdown, no code blocks.

Based on these user preferences: ${preferences}, provide 3 personalized travel destination recommendations.

Return exactly this JSON structure:
[
  {
    "id": "unique-id-1",
    "name": "Destination Name, Country",
    "tagline": "Short catchy description of the destination (under 60 chars)",
    "match": 95,
    "imageQuery": "specific and detailed search query for this destination that will return high-quality images"
  },
  {
    "id": "unique-id-2",
    "name": "Destination Name, Country",
    "tagline": "Short catchy description of the destination (under 60 chars)",
    "match": 88,
    "imageQuery": "specific and detailed search query for this destination that will return high-quality images"
  },
  {
    "id": "unique-id-3",
    "name": "Destination Name, Country",
    "tagline": "Short catchy description of the destination (under 60 chars)",
    "match": 92,
    "imageQuery": "specific and detailed search query for this destination that will return high-quality images"
  }
]

IMPORTANT: Return ONLY the JSON array above. No text before or after. No markdown formatting. No code blocks.`;

    // Configure Gemini for JSON-only output
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.1, // Lower temperature for more consistent output
        topK: 1, // Most deterministic
        topP: 0.8,
        maxOutputTokens: 1024,
        responseMimeType: "application/json", // Force JSON response
      },
    });

    const response = result.response;
    const text = response.text().trim();
    
    // Parse and process the JSON response
    const destinations = parseGeminiResponse(text);
    
    // Validate we got valid destinations
    if (!destinations || destinations.length === 0) {
      throw new Error("No valid destinations returned from Gemini");
    }
    
    // Process the destinations
    return destinations.map((dest, index) => ({
      id: dest.id || `rec-${Date.now()}-${index}`,
      name: dest.name,
      tagline: dest.tagline,
      match: Math.min(Math.max(dest.match || 85, 70), 98), // Clamp between 70-98
      image: "", // Empty string - images will be fetched on client using useImages
      imageQuery: dest.imageQuery || `${dest.name} travel destination landmark`
    }));
  } catch (error) {
    console.error("Error fetching recommended destinations:", error);
    return getSampleDestinations("recommendations");
  }
}

/**
 * Fetches trending destinations according to current travel trends
 * 
 * @returns Array of trending destinations
 */
export async function getTrendingDestinations(): Promise<Destination[]> {
  if (!isConfigured()) {
    console.warn("Gemini API not configured");
    return getSampleDestinations("trending");
  }

  try {
    const model = getGeminiModel();

    const prompt = `You are a JSON API. Return ONLY valid JSON, no explanations, no markdown, no code blocks.

Provide 3 currently trending travel destinations worldwide.

Return exactly this JSON structure:
[
  {
    "id": "unique-id-1",
    "name": "Destination Name, Country",
    "tagline": "Short catchy description of why it's trending (under 60 chars)",
    "match": 85,
    "imageQuery": "specific and detailed search query for this destination that will return high-quality images"
  },
  {
    "id": "unique-id-2",
    "name": "Destination Name, Country",
    "tagline": "Short catchy description of why it's trending (under 60 chars)",
    "match": 78,
    "imageQuery": "specific and detailed search query for this destination that will return high-quality images"
  },
  {
    "id": "unique-id-3",
    "name": "Destination Name, Country",
    "tagline": "Short catchy description of why it's trending (under 60 chars)",
    "match": 91,
    "imageQuery": "specific and detailed search query for this destination that will return high-quality images"
  }
]

IMPORTANT: Return ONLY the JSON array above. No text before or after. No markdown formatting. No code blocks.`;

    // Configure Gemini for JSON-only output
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.1, // Lower temperature for more consistent output
        topK: 1, // Most deterministic
        topP: 0.8,
        maxOutputTokens: 1024,
        responseMimeType: "application/json", // Force JSON response
      },
    });

    const response = result.response;
    const text = response.text().trim();
    
    // Parse and process the JSON response
    const destinations = parseGeminiResponse(text);
    
    // Validate we got valid destinations
    if (!destinations || destinations.length === 0) {
      throw new Error("No valid destinations returned from Gemini");
    }
    
    // Process the destinations
    return destinations.map((dest, index) => ({
      id: dest.id || `trend-${Date.now()}-${index}`,
      name: dest.name,
      tagline: dest.tagline,
      match: Math.min(Math.max(dest.match || 85, 70), 95), // Clamp between 70-95
      image: "", // Empty string - images will be fetched on client using useImages
      imageQuery: dest.imageQuery || `${dest.name} travel destination landmark`
    }));
  } catch (error) {
    console.error("Error fetching trending destinations:", error);
    return getSampleDestinations("trending");
  }
}

/**
 * Fetches in-depth information about travel destinations
 * Provides detailed information beyond basic recommendations
 * 
 * @param category - Optional category to focus on (e.g., "beach", "culture", "adventure")
 * @param count - Number of destinations to return (default: 6)
 * @returns Array of in-depth destination information
 */
export async function getInDepthDestinations(
  category?: string,
  count: number = 6
): Promise<InDepthDestination[]> {
  if (!isConfigured()) {
    console.warn("Gemini API not configured");
    return getSampleInDepthDestinations();
  }

  try {
    const model = getGeminiModel();
    const destinationFocus = category ? `focusing on ${category} destinations` : "covering diverse types of destinations";

    const prompt = `You are a JSON API. Return ONLY valid JSON, no explanations, no markdown, no code blocks.

Provide ${count} detailed travel destinations ${destinationFocus} with comprehensive information for travelers.

Return exactly this JSON structure:
[
  {
    "id": "unique-id-1",
    "name": "Destination Name, Country",
    "tagline": "Short catchy description of the destination (under 60 chars)",
    "match": 92,
    "imageQuery": "specific and detailed search query for this destination that will return beautiful high-quality images",
    "description": "A comprehensive 2-3 sentence description of what makes this destination special",
    "bestTimeToVisit": "Brief description of the best seasons or months to visit",
    "highlights": [
      "Major attraction or activity 1",
      "Major attraction or activity 2",
      "Major attraction or activity 3",
      "Major attraction or activity 4"
    ],
    "travelTips": [
      "Practical tip about visiting this destination",
      "Safety or transport recommendation",
      "Local custom or etiquette travelers should know"
    ],
    "localCuisine": [
      "Famous local dish 1",
      "Famous local dish 2",
      "Popular beverage or dessert"
    ],
    "culturalNotes": "Brief insight about local culture or customs",
    "budget": {
      "currency": "Local currency code",
      "hostel": "15-25 USD",
      "midRange": "80-120 USD",
      "luxury": "200+ USD",
      "averageMeal": "8-15 USD",
      "transportDaily": "5-10 USD"
    },
    "category": "The main category this destination falls into (e.g., beach, city, nature, cultural, adventure)"
  }
]

IMPORTANT: 
- Return ONLY valid JSON with exactly the structure above.
- Include at least ${count} destinations in the response.
- Make sure all budget figures use actual numbers, not placeholders.
- Use realistic data reflecting current travel trends and costs.
- No text before or after. No markdown formatting. No code blocks.`;

    // Configure Gemini for JSON-only output
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.2, // Slightly higher to get diverse destinations
        topK: 40, 
        topP: 0.8,
        maxOutputTokens: 4096, // Higher token count needed for detailed info
        responseMimeType: "application/json", // Force JSON response
      },
    });

    const response = result.response;
    const text = response.text().trim();
    
    // Parse and process the JSON response
    const destinations = parseGeminiResponse(text) as RawInDepthDestinationData[];
    
    // Validate we got valid destinations
    if (!destinations || destinations.length === 0) {
      throw new Error("No valid destinations returned from Gemini");
    }
    
    // Process the destinations
    return destinations.map((dest, index) => ({
      id: dest.id || `indepth-${Date.now()}-${index}`,
      name: dest.name,
      tagline: dest.tagline,
      match: Math.min(Math.max(dest.match || 85, 70), 98), // Clamp between 70-98
      image: "", // Empty string - images will be fetched on client using useImages
      imageQuery: dest.imageQuery || `${dest.name} travel destination scenic view`,
      description: dest.description || `Discover the wonders of ${dest.name}, a destination known for its unique charm and beautiful landscapes.`,
      bestTimeToVisit: dest.bestTimeToVisit || "Year-round, with peak seasons varying by activity",
      highlights: dest.highlights || ["Local attractions", "Natural wonders", "Cultural experiences", "Unique activities"],
      travelTips: dest.travelTips || ["Research local customs before visiting", "Consider local transportation options", "Try the local cuisine"],
      localCuisine: dest.localCuisine || ["Traditional dishes", "Local specialties", "Regional beverages"],
      culturalNotes: dest.culturalNotes || `${dest.name.split(',')[1]?.trim() || "The region"} has a rich cultural heritage worth exploring.`,
      budget: {
        currency: dest.budget?.currency || "USD",
        hostel: dest.budget?.hostel || "20-40 USD",
        midRange: dest.budget?.midRange || "80-150 USD",
        luxury: dest.budget?.luxury || "200+ USD",
        averageMeal: dest.budget?.averageMeal || "10-20 USD",
        transportDaily: dest.budget?.transportDaily || "5-15 USD"
      },
      category: dest.category?.toString() || "Adventure"
    }));
  } catch (error) {
    console.error("Error fetching in-depth destinations:", error);
    return getSampleInDepthDestinations();
  }
}

/**
 * Parses the Gemini API response text to extract valid JSON
 * Enhanced with better error handling and fallback parsing
 */
function parseGeminiResponse(text: string): RawDestinationData[] {
  if (!text || text.trim().length === 0) {
    throw new Error("Empty response from Gemini");
  }

  const cleanText = text.trim();
  
  try {
    // Try direct parsing first
    const parsed = JSON.parse(cleanText);
    
    // Validate the structure
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    } else {
      throw new Error("Invalid JSON structure - not an array or empty");
    }
  } catch (err) {
    console.warn("Direct JSON parsing failed, attempting fallback methods");
    
    // Method 1: Try to extract JSON from markdown code blocks
    const jsonMatch = cleanText.match(/```(?:json)?\s*\n?([\s\S]*?)\n?```/);
    if (jsonMatch && jsonMatch[1]) {
      try {
        const parsed = JSON.parse(jsonMatch[1].trim());
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch (innerErr) {
        console.warn("Markdown extraction failed");
      }
    }
    
    // Method 2: Try to find JSON array in the text
    const arrayMatch = cleanText.match(/\[\s*\{[\s\S]*\}\s*\]/);
    if (arrayMatch) {
      try {
        const parsed = JSON.parse(arrayMatch[0]);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch (innerErr) {
        console.warn("Array extraction failed");
      }
    }
    
    // Method 3: Clean common formatting issues
    const cleanedText = cleanText
      .replace(/^[^[{]*/, '') // Remove text before JSON starts
      .replace(/[^}\]]*$/, '') // Remove text after JSON ends
      .replace(/,\s*}/g, '}') // Remove trailing commas
      .replace(/,\s*]/g, ']'); // Remove trailing commas in arrays
      
    try {
      const parsed = JSON.parse(cleanedText);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    } catch (finalErr) {
      console.error("All parsing methods failed:", {
        originalText: text,
        cleanedText: cleanedText,
        error: finalErr
      });
    }
    
    // If all else fails, throw an error
    throw new Error(`Failed to parse JSON from Gemini response: ${text.substring(0, 200)}...`);
  }
}

/**
 * Provides sample destinations in case of API failure
 */
function getSampleDestinations(type: 'recommendations' | 'trending'): Destination[] {
  if (type === 'recommendations') {
    return [
      {
        id: 'rec-1',
        name: 'Kyoto, Japan',
        tagline: 'Ancient temples amid spectacular seasonal colors',
        match: 96,
        image: '',
        imageQuery: 'Kyoto Japan temples autumn'
      },
      {
        id: 'rec-2',
        name: 'Santorini, Greece',
        tagline: 'Breathtaking sunsets over white-washed buildings',
        match: 91,
        image: '',
        imageQuery: 'Santorini Greece sunset white buildings'
      },
      {
        id: 'rec-3',
        name: 'Prague, Czech Republic',
        tagline: 'Fairy tale architecture and rich cultural experiences',
        match: 88,
        image: '',
        imageQuery: 'Prague Czech Republic Old Town architecture'
      },
      {
        id: 'rec-4',
        name: 'Reykjavik, Iceland',
        tagline: 'Northern lights and otherworldly landscapes',
        match: 84,
        image: '',
        imageQuery: 'Reykjavik Iceland northern lights'
      }
    ];
  } else {
    return [
      {
        id: 'trend-1',
        name: 'Lisbon, Portugal',
        tagline: 'Europe\'s hottest food and culture destination',
        match: 93,
        image: '',
        imageQuery: 'Lisbon Portugal viewpoint street'
      },
      {
        id: 'trend-2',
        name: 'Mexico City, Mexico',
        tagline: 'Vibrant street life and renowned culinary scene',
        match: 87,
        image: '',
        imageQuery: 'Mexico City historic center colorful'
      },
      {
        id: 'trend-3',
        name: 'Bali, Indonesia',
        tagline: 'Digital nomad paradise with stunning beaches',
        match: 90,
        image: '',
        imageQuery: 'Bali Indonesia rice terraces temple'
      },
      {
        id: 'trend-4',
        name: 'Dubai, UAE',
        tagline: 'Futuristic luxury meets traditional culture',
        match: 82,
        image: '',
        imageQuery: 'Dubai UAE skyline modern architecture'
      }
    ];
  }
}

/**
 * Provides sample in-depth destinations in case of API failure
 */
function getSampleInDepthDestinations(): InDepthDestination[] {
  return [
    {
      id: 'indepth-1',
      name: 'Barcelona, Spain',
      tagline: 'Modernist architecture meets Mediterranean beach culture',
      match: 94,
      image: '',
      imageQuery: 'Barcelona Sagrada Familia architecture Gaudi',
      description: 'Barcelona blends stunning architecture, vibrant street life, and beautiful beaches. The city is famous for Gaudí\'s buildings, bustling markets, and a culinary scene that ranges from simple tapas to avant-garde cuisine.',
      bestTimeToVisit: 'May to June and September to October for pleasant weather and fewer crowds',
      highlights: [
        'Sagrada Familia basilica',
        'Park Güell',
        'Gothic Quarter (Barri Gòtic)',
        'La Rambla and La Boqueria Market'
      ],
      travelTips: [
        'Be aware of pickpockets in tourist areas',
        'Use the efficient metro system to get around',
        'Expect later dinner times than in North America or Northern Europe'
      ],
      localCuisine: [
        'Paella',
        'Tapas and pintxos',
        'Crema Catalana'
      ],
      culturalNotes: 'Barcelona is the capital of Catalonia, a region with its own language and cultural identity distinct from the rest of Spain',
      budget: {
        currency: 'EUR',
        hostel: '25-40 EUR',
        midRange: '90-150 EUR',
        luxury: '200+ EUR',
        averageMeal: '15-25 EUR',
        transportDaily: '10 EUR'
      },
      category: 'City'
    },
    {
      id: 'indepth-2',
      name: 'Queenstown, New Zealand',
      tagline: 'Adventure capital with breathtaking alpine scenery',
      match: 92,
      image: '',
      imageQuery: 'Queenstown New Zealand mountains lake adventure',
      description: 'Nestled between mountains and crystal-clear Lake Wakatipu, Queenstown is the premier destination for adventure tourism in New Zealand. The surrounding region offers everything from adrenaline-pumping activities to serene natural beauty.',
      bestTimeToVisit: 'December to February for summer activities, June to September for skiing',
      highlights: [
        'Bungee jumping at Kawarau Bridge',
        'Skiing at Coronet Peak or The Remarkables',
        'Milford Sound day trips',
        'Scenic flights over Fiordland'
      ],
      travelTips: [
        'Book adventure activities in advance during peak season',
        'Rent a car to explore the surrounding region',
        'Pack for variable weather conditions year-round'
      ],
      localCuisine: [
        'Fergburger (famous local burger joint)',
        'New Zealand lamb',
        'Central Otago wines'
      ],
      culturalNotes: 'The area has strong Māori heritage and was traditionally known as Tāhuna, meaning "shallow bay"',
      budget: {
        currency: 'NZD',
        hostel: '30-50 NZD',
        midRange: '120-200 NZD',
        luxury: '300+ NZD',
        averageMeal: '20-35 NZD',
        transportDaily: '15-30 NZD'
      },
      category: 'Adventure'
    },
    {
      id: 'indepth-3',
      name: 'Tokyo, Japan',
      tagline: 'Ultramodern meets traditional in this dynamic metropolis',
      match: 96,
      image: '',
      imageQuery: 'Tokyo skyline night Shibuya crossing',
      description: 'Tokyo is a city of contrasts where ancient temples stand in the shadows of neon-lit skyscrapers. This buzzing metropolis offers cutting-edge technology, world-class dining, traditional culture, and efficient public transportation.',
      bestTimeToVisit: 'March to May for cherry blossoms, October to November for autumn colors',
      highlights: [
        'Shibuya Crossing and shopping district',
        'Senso-ji Temple in Asakusa',
        'Shinjuku Gyoen National Garden',
        'Tsukiji Outer Market for fresh seafood'
      ],
      travelTips: [
        'Purchase a Suica or Pasmo card for public transportation',
        'Most restaurants and shops are cash-based',
        'Learn basic Japanese phrases for smoother interactions'
      ],
      localCuisine: [
        'Sushi and sashimi',
        'Ramen',
        'Wagashi (traditional sweets)'
      ],
      culturalNotes: 'Japanese culture values politeness, punctuality, and respect for traditions. Bow when greeting people and remove shoes when entering homes or traditional establishments',
      budget: {
        currency: 'JPY',
        hostel: '3,000-5,000 JPY',
        midRange: '10,000-20,000 JPY',
        luxury: '30,000+ JPY',
        averageMeal: '800-2,000 JPY',
        transportDaily: '1,000 JPY'
      },
      category: 'City'
    },
    {
      id: 'indepth-4',
      name: 'Banff, Canada',
      tagline: 'Pristine wilderness and alpine adventures',
      match: 91,
      image: '',
      imageQuery: 'Banff National Park Lake Louise mountains',
      description: 'Banff National Park showcases the raw beauty of the Canadian Rockies with turquoise lakes, snow-capped peaks, and abundant wildlife. The charming town of Banff offers a perfect base for exploring this UNESCO World Heritage site.',
      bestTimeToVisit: 'June to August for hiking, December to March for winter sports',
      highlights: [
        'Lake Louise and Moraine Lake',
        'Banff Gondola to Sulphur Mountain',
        'Johnston Canyon',
        'Wildlife viewing along the Bow Valley Parkway'
      ],
      travelTips: [
        'Book accommodation months in advance for summer visits',
        'Purchase a Parks Canada pass for entry',
        'Carry bear spray when hiking in summer'
      ],
      localCuisine: [
        'Alberta beef',
        'Poutine',
        'Maple-infused dishes'
      ],
      culturalNotes: 'The area has deep connections to Indigenous peoples, particularly the Stoney Nakoda Nation, and was Canada\'s first national park established in 1885',
      budget: {
        currency: 'CAD',
        hostel: '40-60 CAD',
        midRange: '150-250 CAD',
        luxury: '300+ CAD',
        averageMeal: '20-40 CAD',
        transportDaily: '15-30 CAD'
      },
      category: 'Nature'
    },
    {
      id: 'indepth-5',
      name: 'Marrakech, Morocco',
      tagline: 'Ancient medina with vibrant souks and Moorish architecture',
      match: 89,
      image: '',
      imageQuery: 'Marrakech Morocco medina Jemaa el-Fnaa',
      description: 'Marrakech is a sensory feast of colors, aromas, and sounds. The historic medina, a UNESCO World Heritage site, features labyrinthine souks, ornate palaces, and the famous Jemaa el-Fnaa square that comes alive at night with entertainers and food stalls.',
      bestTimeToVisit: 'March to May and September to November for milder temperatures',
      highlights: [
        'Jemaa el-Fnaa square and medina',
        'Bahia Palace and El Badi Palace',
        'Majorelle Garden',
        'Day trips to the Atlas Mountains'
      ],
      travelTips: [
        'Hire a local guide for your first medina experience',
        'Bargain in the souks but stay friendly and respectful',
        'Dress modestly out of respect for local customs'
      ],
      localCuisine: [
        'Tagine',
        'Couscous',
        'Mint tea'
      ],
      culturalNotes: 'Morocco blends Arab, Berber, and French influences. Friday is the Muslim holy day when some shops may close early or not open at all',
      budget: {
        currency: 'MAD',
        hostel: '100-200 MAD',
        midRange: '600-1,200 MAD',
        luxury: '2,000+ MAD',
        averageMeal: '80-150 MAD',
        transportDaily: '50-100 MAD'
      },
      category: 'Cultural'
    },
    {
      id: 'indepth-6',
      name: 'Bali, Indonesia',
      tagline: 'Island of temples, rice terraces, and world-class surfing',
      match: 93,
      image: '',
      imageQuery: 'Bali Indonesia rice terraces Ubud temple',
      description: 'Bali offers an intoxicating blend of spiritual culture, natural beauty, and vibrant nightlife. This Indonesian paradise is known for its elaborate temples, terraced rice fields, yoga retreats, and surf-worthy beaches with something for every type of traveler.',
      bestTimeToVisit: 'April to October for dry season, with May, June and September being ideal months',
      highlights: [
        'Ubud\'s sacred Monkey Forest and rice terraces',
        'Uluwatu Temple and Kecak dance performances',
        'Beaches of Kuta, Seminyak, and Nusa Dua',
        'Mount Batur sunrise trek'
      ],
      travelTips: [
        'Rent a scooter to navigate traffic but drive carefully',
        'Be respectful when visiting temples (wear sarongs)',
        'Drink only bottled water and be cautious with street food'
      ],
      localCuisine: [
        'Nasi Goreng (fried rice)',
        'Babi Guling (suckling pig)',
        'Fresh tropical fruit juices'
      ],
      culturalNotes: 'Balinese Hinduism permeates daily life with offerings (canang sari) seen everywhere. The local calendar includes many religious ceremonies and celebrations',
      budget: {
        currency: 'IDR',
        hostel: '100,000-200,000 IDR',
        midRange: '500,000-1,000,000 IDR',
        luxury: '1,500,000+ IDR',
        averageMeal: '50,000-100,000 IDR',
        transportDaily: '100,000 IDR'
      },
      category: 'Beach'
    }
  ];
}