import logging
import asyncio
import json
from datetime import datetime, timedelta
from typing import Dict, Any, List, Tuple
import concurrent.futures

from app.models.request import ItineraryRequest
from app.models.response import ItineraryResponse
from app.services.gemini_service import get_gemini_structured_response
from app.services.meta_service import get_meta_info
from app.services.transport_service import get_transport_options
from app.services.activities_service import get_activities
from app.services.accommodations_service import get_accommodations_and_dining
from app.services.weather_service import get_weather_forecast
from app.utils.helpers import calculate_date_range
from app.utils.schema_helpers import conform_to_schema

logger = logging.getLogger(__name__)

# Thread pool for running blocking operations
_THREAD_POOL = concurrent.futures.ThreadPoolExecutor(max_workers=10)

async def generate_component_with_fallback(component_func, request, fallback_data, component_name):
    """
    Generate component data with fallback in case of failure.
    """
    try:
        logger.info(f"Starting generation of {component_name}")
        result = await component_func(request)
        logger.info(f"Completed generation of {component_name}")
        return result
    except Exception as e:
        logger.error(f"Error generating {component_name}: {str(e)}")
        logger.info(f"Using fallback data for {component_name}")
        return fallback_data

async def generate_day_itinerary(day_number: int, date_str: str, request: ItineraryRequest, 
                                meta_info: Dict, transport_options: Dict, 
                                activities: Dict, accommodations_dining: Dict,
                                weather: Dict) -> Dict:
    """
    Generate itinerary for a single day.
    """
    logger.info(f"Generating itinerary for day {day_number} ({date_str})")
    
    # Get weather info for this day
    day_weather = None
    for forecast in weather.get("forecast", []):
        if forecast.get("date") == date_str:
            day_weather = {
                "temperature": forecast.get("temperature", {"min": 15, "max": 25}),
                "conditions": forecast.get("conditions", "No data"),
                "advisory": forecast.get("advisory", "No advisory")
            }
            break
    
    if not day_weather:
        day_weather = {
            "temperature": {"min": 15, "max": 25},
            "conditions": "No weather data available",
            "advisory": "No weather advisory available"
        }
    
    # Create prompt for day generation
    is_first_day = day_number == 1
    is_last_day = day_number == (datetime.strptime(request.dates.endDate, "%Y-%m-%d") - 
                               datetime.strptime(request.dates.startDate, "%Y-%m-%d")).days + 1
    
    special_considerations = ""
    if is_first_day:
        special_considerations = "This is the arrival day, include transportation from origin and check-in activities."
    elif is_last_day:
        special_considerations = "This is the departure day, include check-out and return transportation."
        
    # Select activities based on trip style
    relevant_activities = []
    for category in activities:
        if isinstance(activities[category], list):
            for activity in activities[category]:
                activity_info = {
                    "title": activity.get("title", "Unknown"),
                    "type": activity.get("type", "Unknown"),
                    "description": activity.get("description", ""),
                    "duration": activity.get("duration", 120),
                    "priority": activity.get("priority", 3)
                }
                relevant_activities.append(activity_info)
    
    # Get dining options
    dining_options = accommodations_dining.get("dining", [])
    
    prompt = f"""
    Generate a detailed itinerary for DAY {day_number} ({date_str}) of a trip to {request.location.destination}.
    
    Day specifics:
    - Date: {date_str}
    - Weather: {day_weather["conditions"]}, Temperature: {day_weather["temperature"]["min"]}°C to {day_weather["temperature"]["max"]}°C
    - Weather advisory: {day_weather["advisory"]}
    - {special_considerations}
    
    Trip styles: {', '.join(request.tripStyle)}
    Pace preference: {request.preferences.pace}
    
    Create a detailed schedule from morning to evening with at least 5-7 time blocks that include:
    - Breakfast, lunch, and dinner at appropriate times
    - Main sightseeing activities suitable for the day's weather
    - Travel between locations with appropriate modes of transportation
    - Rest periods if needed based on the preferred pace ({request.preferences.pace})
    - A mix of fixed and flexible activities
    
    Remember these dietary preferences: {', '.join(request.preferences.dietaryPreferences) if request.preferences.dietaryPreferences else 'No specific preferences'}
    
    RELEVANT ACTIVITIES TO CHOOSE FROM:
    {json.dumps(relevant_activities[:15], indent=2)}
    
    DINING OPTIONS:
    {json.dumps(dining_options, indent=2)}
    
    VERY IMPORTANT: Follow the exact JSON schema below:
    ```json
    {{
      "day_number": {day_number},
      "date": "{date_str}",
      "weather": {{
        "temperature": {{
          "min": number,
          "max": number
        }},
        "conditions": string,
        "advisory": string
      }},
      "time_blocks": [
        {{
          "type": "fixed" or "flexible",
          "start_time": "HH:MM", (24-hour format),
          "end_time": "HH:MM", (24-hour format),
          "duration_minutes": integer,
          "activity": {{
            "title": string,
            "type": string,
            "description": string,
            "location": {{
              "name": string,
              "coordinates": {{
                "lat": number,
                "lng": number
              }},
              "altitude": number,
              "google_maps_link": string or null
            }},
            "duration": integer,
            "cost": {{
              "currency": string,
              "range": string,
              "per_unit": string or null
            }},
            "images": [string],
            "link": string or null,
            "priority": integer (1-5),
            "highlights": [string]
          }},
          "travel": {{
            "mode": string,
            "details": string,
            "duration": integer,
            "cost": {{
              "currency": string,
              "range": string
            }},
            "link": string or null,
            "operator": string or null
          }},
          "warnings": [
            {{
              "type": string,
              "message": string,
              "priority": integer (1-3)
            }}
          ]
        }}
        // Add at least 5-7 time blocks covering the full day
      ]
    }}
    ```
    
    IMPORTANT: 
    1. Create at least 5-7 time blocks for the day covering morning to evening, including meals and activities
    2. Place warnings at the time_block level, not inside activities
    3. Use "link" instead of "booking_link" in all objects
    4. Provide google_maps_link for all locations, using the location name to generate the link
    """
    
    system_instruction = """
    You are an expert travel planner specializing in creating detailed, personalized itineraries.
    Create a COMPLETE daily schedule with multiple time blocks throughout the day (at least 5-7).
    Include DETAILED information for each activity including location, cost, duration, and descriptions.
    Always follow EXACTLY the specified JSON schema with all required fields.
    Remember to use "link" instead of "booking_link" or "reservation_link" in all objects.
    """
    
    try:
        day_itinerary = await get_gemini_structured_response(prompt, system_instruction)
        logger.info(f"Successfully generated itinerary for day {day_number}")
        return day_itinerary
    except Exception as e:
        logger.error(f"Error generating day {day_number} itinerary: {str(e)}")
        
        # Return a minimal day structure as fallback
        return {
            "day_number": day_number,
            "date": date_str,
            "weather": day_weather,
            "time_blocks": [
                {
                    "type": "flexible",
                    "start_time": "09:00",
                    "end_time": "17:00",
                    "duration_minutes": 480,
                    "activity": {
                        "title": f"Day {day_number} Exploration",
                        "type": "sightseeing",
                        "description": f"Explore {request.location.destination} at your own pace.",
                        "location": {
                            "name": request.location.destination,
                            "coordinates": {"lat": 0, "lng": 0},
                            "altitude": None,
                            "google_maps_link": None
                        },
                        "duration": 480,
                        "cost": {"currency": "INR", "range": "Varies", "per_unit": None},
                        "images": [],
                        "link": None,
                        "priority": 3,
                        "highlights": []
                    },
                    "warnings": []
                }
            ]
        }

async def generate_metadata(request: ItineraryRequest) -> Dict:
    """Generate metadata for the itinerary"""
    start_date = datetime.strptime(request.dates.startDate, "%Y-%m-%d")
    end_date = datetime.strptime(request.dates.endDate, "%Y-%m-%d")
    duration_days = (end_date - start_date).days + 1
    
    # Extract budget info
    currency = "USD"
    total_budget = "Budget not specified"
    
    if request.budget:
        currency = request.budget.currency
        total_budget = str(request.budget.ceiling)
    
    # Generate breakdown based on trip style
    accommodation_pct = 0.3
    transportation_pct = 0.2
    activities_pct = 0.2
    food_pct = 0.3  # Standard allocation
    
    if "food" in request.tripStyle:
        food_pct = 0.6
        accommodation_pct = 0.2
        transportation_pct = 0.1
        activities_pct = 0.1
    elif "adventure" in request.tripStyle:
        activities_pct = 0.4
        accommodation_pct = 0.2
        transportation_pct = 0.3
        food_pct = 0.1
    elif "luxury" in request.tripStyle:
        accommodation_pct = 0.5
        food_pct = 0.2
        transportation_pct = 0.2
        activities_pct = 0.1
        
    budget_value = 50000  # default
    if request.budget:
        budget_value = request.budget.ceiling
        
    # Extract dietary restrictions
    dietary_restrictions = []
    if request.preferences.dietaryPreferences:
        dietary_restrictions = request.preferences.dietaryPreferences
    
    # Accessibility needs
    accessibility_needs = False
    if request.preferences.accessibility:
        accessibility_needs = any([
            request.preferences.accessibility.mobilityNeeds,
            request.preferences.accessibility.hearingNeeds,
            request.preferences.accessibility.visionNeeds,
            request.preferences.accessibility.dietaryRestrictions
        ])
    
    return {
        "trip_type": request.tripStyle,
        "duration_days": duration_days,
        "total_budget": {
            "currency": currency,
            "total": total_budget,
            "breakdown": {
                "accommodation": int(budget_value * accommodation_pct),
                "transportation": int(budget_value * transportation_pct),
                "activities": int(budget_value * activities_pct),
                "food": int(budget_value * food_pct)
            }
        },
        "preferences": {
            "dietary_restrictions": dietary_restrictions,
            "accessibility_needs": accessibility_needs,
            "pace": request.preferences.pace,
            "context": request.additionalContext
        }
    }

async def generate_essential_info(request: ItineraryRequest, destination_info: Dict) -> Dict:
    """Generate essential info section"""
    prompt = f"""
    Generate essential information for a trip to {request.location.destination} from {request.location.baseCity}.
    Include required documents and emergency contacts.
    
    Trip details:
    - Trip dates: {request.dates.startDate} to {request.dates.endDate}
    - Destination: {request.location.destination}
    - Origin: {request.location.baseCity}
    - Trip style: {', '.join(request.tripStyle)}
    
    Return in this JSON format:
    {{
      "documents": [string],
      "emergency_contacts": [
        {{
          "type": string,
          "number": string
        }}
      ]
    }}
    
    IMPORTANT: Include at least 3 emergency contacts including local emergency numbers.
    """
    
    try:
        essential_info = await get_gemini_structured_response(prompt, "Generate essential travel information.")
        return essential_info
    except Exception:
        # Fallback info
        return {
            "documents": [
                "Photo ID",
                "Hotel booking confirmation",
                "Travel insurance"
            ],
            "emergency_contacts": [
                {"type": "Police", "number": "100"},
                {"type": "Ambulance", "number": "102"},
                {"type": "Tourist Helpline", "number": "1363"}
            ]
        }

async def generate_complete_itinerary(request: ItineraryRequest) -> Dict[str, Any]:
    """
    Generate a complete trip itinerary using true parallel processing.
    """
    logger.info(f"Starting itinerary generation for {request.location.destination}")
    
    # Define fallback data for each component
    meta_fallback = {
        "journey_path": {"overview": [], "distance_km": 0, "elevation_profile": []},
        "altitude_info": {},
        "key_coordinates": []
    }
    
    transport_fallback = {
        "main_transport": [],
        "local_transport": [],
        "transfers": [],
        "route_transport": []
    }
    
    activities_fallback = {
        "must_see": [],
        "cultural": [],
        "outdoor": [],
        "local_experiences": [],
        "hidden_gems": [],
        "family_friendly": []
    }
    
    accommodations_fallback = {
        "accommodations": [],
        "dining": []
    }
    
    # Calculate trip duration for fallback weather
    start_date = datetime.strptime(request.dates.startDate, "%Y-%m-%d")
    end_date = datetime.strptime(request.dates.endDate, "%Y-%m-%d")
    duration_days = (end_date - start_date).days + 1
    date_range = calculate_date_range(request.dates.startDate, request.dates.endDate)
    
    weather_fallback = {
        "forecast": [
            {
                "date": (start_date + timedelta(days=i)).strftime("%Y-%m-%d"),
                "temperature": {"min": 15, "max": 25},
                "conditions": "No data available",
                "precipitation": {"probability": 0, "amount": "Unknown"},
                "wind": {"speed": 0, "unit": "km/h", "direction": "Unknown"},
                "advisory": "Weather data unavailable"
            } for i in range(min(5, duration_days))
        ],
        "general_advisory": "Weather information could not be retrieved."
    }
    
    # Run metadata generation in parallel with components (not dependent)
    metadata_task = asyncio.create_task(generate_metadata(request))
    
    # STEP 1: Start ALL component calls in parallel
    tasks = [
        generate_component_with_fallback(get_meta_info, request, meta_fallback, "meta information"),
        generate_component_with_fallback(get_transport_options, request, transport_fallback, "transport options"),
        generate_component_with_fallback(get_activities, request, activities_fallback, "activities"),
        generate_component_with_fallback(get_accommodations_and_dining, request, accommodations_fallback, "accommodations and dining"),
        generate_component_with_fallback(get_weather_forecast, request, weather_fallback, "weather forecast")
    ]
    
    # Wait for all component tasks to complete concurrently 
    meta_info, transport_options, activities, accommodations_and_dining, weather = await asyncio.gather(*tasks)
    logger.info(f"All component data collected for {request.location.destination}")
    
    # Get metadata (should be done by now)
    metadata = await metadata_task
    logger.info("Generated metadata")
    
    # STEP 2: Generate ALL days in parallel - no batching
    day_tasks = []
    for i, date_str in enumerate(date_range):
        day_number = i + 1
        task = generate_day_itinerary(
            day_number, date_str, request, 
            meta_info, transport_options, activities,
            accommodations_and_dining, weather
        )
        day_tasks.append(task)
    
    # Start essential info generation in parallel with days  
    essential_info_task = asyncio.create_task(generate_essential_info(request, meta_info))
    
    # Wait for all day itineraries to complete
    day_itineraries = await asyncio.gather(*day_tasks)
    
    # Get essential info (should be done by now)
    essential_info = await essential_info_task
    logger.info("Generated essential information")
    
    # First prepare the transportation data
    transportation_options = []
    if isinstance(transport_options.get("main_transport"), list):
        transportation_options.extend(transport_options.get("main_transport"))
        
    if isinstance(transport_options.get("local_transport"), list):
        transportation_options.extend(transport_options.get("local_transport"))
    
    # Ensure we have some transportation options
    if not transportation_options:
        transportation_options = [{
            "mode": "car",
            "details": f"Transportation in {request.location.destination}",
            "duration": 60,
            "cost": {
                "currency": request.budget.currency if request.budget else "USD",
                "range": "Varies based on distance"
            },
            "link": None,
            "operator": "Local operators"
        }]
    
    # Assemble the final itinerary
    complete_itinerary = {
        "metadata": metadata,
        "itinerary": day_itineraries,
        "recommendations": {
            "accommodations": accommodations_and_dining.get("accommodations", []),
            "dining": accommodations_and_dining.get("dining", []),
            "transportation": transportation_options
        },
        "essential_info": essential_info,
        "journey_path": meta_info.get("journey_path", {})
    }
    
    # Apply schema conformance rules
    complete_itinerary = conform_to_schema(complete_itinerary, request.additionalContext)
    
    logger.info(f"Successfully generated complete itinerary with {len(day_itineraries)} days")
    return complete_itinerary