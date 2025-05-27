import logging
import asyncio
import json
from datetime import datetime, timedelta
from typing import Dict, Any, List, Tuple
import concurrent.futures
from urllib.parse import quote

import urllib
from app.models.request import ItineraryRequest
from app.models.response import ItineraryResponse
from app.services.gemini_service import get_gemini_response, get_gemini_structured_response
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

async def generate_metadata(request: ItineraryRequest) -> Dict:
    """Generate metadata for the itinerary"""
    start_date = datetime.strptime(request.dates.startDate, "%Y-%m-%d")
    end_date = datetime.strptime(request.dates.endDate, "%Y-%m-%d")
    duration_days = (end_date - start_date).days + 1
    
    # Extract budget info
    currency = "USD"  # Default
    total_budget = "Budget not specified"

    if request.budget:
        currency = request.budget.currency  
        total_budget = str(request.budget.ceiling)
    
    # Generate breakdown based on trip style
    accommodation_pct = 0.3
    transportation_pct = 0.2
    activities_pct = 0.2
    food_pct = 0.3  # Standard allocation
    
    # Convert trip_style array to string if it contains elements
    trip_type = request.tripStyle[0] if request.tripStyle else "general"
    
    if "food" in request.tripStyle:
        food_pct = 0.6
        accommodation_pct = 0.2
        transportation_pct = 0.1
        activities_pct = 0.1
        trip_type = "food"
    elif "adventure" in request.tripStyle:
        activities_pct = 0.4
        accommodation_pct = 0.2
        transportation_pct = 0.3
        food_pct = 0.1
        trip_type = "adventure"
    elif "luxury" in request.tripStyle:
        accommodation_pct = 0.5
        food_pct = 0.2
        transportation_pct = 0.2
        activities_pct = 0.1
        trip_type = "luxury"
        
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
        "trip_type": trip_type,  # Changed from array to string
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
    
    IMPORTANT: Include at least 3 emergency contacts including public emergency numbers and don't include any assumed, pseudo or hypothetical numbers.
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

async def generate_day_with_assigned_venues(day_number, date_str, request, weather, assigned_venues):
    """
    Generate a single day itinerary with pre-assigned venues.
    """
    logger.info(f"Generating itinerary for day {day_number} ({date_str}) with pre-assigned venues")
    
    # Get restaurants and activities for this day
    restaurants = assigned_venues["restaurants"] 
    activities = assigned_venues["activities"]
    
    # Get weather data for this specific day
    day_weather = {"temperature": {"min": 15, "max": 25}, "conditions": "No data available", "advisory": "Check local conditions"}
    for forecast in weather.get("forecast", []):
        if forecast.get("date") == date_str:
            day_weather = {
                "temperature": {
                    "min": forecast["temperature"]["min"],
                    "max": forecast["temperature"]["max"]
                },
                "conditions": forecast["conditions"],
                "advisory": forecast["advisory"]
            }
            break
    
    # EXTREMELY SIMPLIFIED PROMPT - focus only on generating basic time blocks
    prompt = f"""
    Create a day schedule for Day {day_number} in {request.location.destination}.
    
    Available restaurants:
    {", ".join([r.get("name", "Restaurant") for r in restaurants])}
    
    Available activities:
    {", ".join([a.get("title", "Activity") for a in activities])}
    
    Create exactly 5 time blocks for the day with:
    - Time block for breakfast (morning)
    - Time block for a morning activity
    - Time block for lunch (midday)
    - Time block for an afternoon activity
    - Time block for dinner (evening)
    
    Use this exact JSON structure:
    {{
      "time_blocks": [
        {{
          "type": "fixed",
          "start_time": "08:00",
          "end_time": "09:00",
          "activity": {{
            "title": "RESTAURANT NAME HERE FOR BREAKFAST"
          }}
        }},
        {{
          "type": "flexible",
          "start_time": "10:00",
          "end_time": "12:00",
          "activity": {{
            "title": "ACTIVITY NAME HERE"
          }}
        }}
      ]
    }}
    
    YOU MUST INCLUDE EXACTLY 5 TIME BLOCKS.
    """
    
    system_instruction = "Create a simple day schedule with exactly 5 time blocks using only the restaurant and activity names provided."
    
    try:
        # Try to get a basic schedule from Gemini
        day_outline = await get_gemini_structured_response(prompt, system_instruction)
        
        # If we don't get time blocks, go straight to fallback
        time_blocks = day_outline.get("time_blocks", [])
        if len(time_blocks) < 3:
            logger.warning(f"Not enough time blocks for day {day_number}, using fallback")
            return create_fallback_day(day_number, date_str, restaurants, activities, day_weather, request)
        
        # Now enrich these simple time blocks with our venue data
        enriched_time_blocks = []
        restaurant_map = {r["name"].lower(): r for r in restaurants}
        activity_map = {a["title"].lower(): a for a in activities}
        
        # Process each time block
        for block in time_blocks:
            activity_title = block.get("activity", {}).get("title", "")
            if not activity_title:
                continue
                
            activity_title_lower = activity_title.lower()
            
            # Create base time block
            time_block = {
                "type": block.get("type", "fixed"),
                "start_time": block.get("start_time", "09:00"),
                "end_time": block.get("end_time", "10:00"),
                "duration_minutes": int((datetime.strptime(block.get("end_time", "10:00"), "%H:%M") - 
                                      datetime.strptime(block.get("start_time", "09:00"), "%H:%M")).total_seconds() / 60)
            }
            
            # Find matching venue (restaurant or activity)
            venue_data = None
            venue_type = None
            
            # Check restaurants
            for name, data in restaurant_map.items():
                if name in activity_title_lower or activity_title_lower in name:
                    venue_data = data
                    venue_type = "restaurant"
                    break
                    
            # Check activities if not found in restaurants
            if not venue_data:
                for name, data in activity_map.items():
                    if name in activity_title_lower or activity_title_lower in name:
                        venue_data = data
                        venue_type = "activity"
                        break
            
            # Create rich activity data
            if venue_data:
                if venue_type == "restaurant":
                    # Determine meal type
                    meal_type = "meal"
                    if "breakfast" in activity_title_lower or int(block.get("start_time", "09:00").split(":")[0]) < 11:
                        meal_type = "breakfast"
                    elif "lunch" in activity_title_lower or 11 <= int(block.get("start_time", "09:00").split(":")[0]) < 15:
                        meal_type = "lunch" 
                    else:
                        meal_type = "dinner"
                    
                    # Format the price range correctly with descriptive text
                    price_range = venue_data.get("price_range", "600-1200 per person")
                    if "per person" not in price_range and "for" not in price_range:
                        price_range = f"{price_range} per person"
                        
                    activity = {
                        "title": activity_title,
                        "type": "dining",
                        "description": f"Enjoy a delightful {meal_type} at {venue_data.get('name')}, featuring local specialties and fresh ingredients.",
                        "location": venue_data.get("location") or {
                            "name": venue_data.get("name"),
                            "coordinates": {"lat": 0, "lng": 0},
                            "google_maps_link": f"https://www.google.com/maps/search/?api=1&query={urllib.parse.quote(venue_data.get('name', 'restaurant'))}"
                        },
                        "duration": time_block["duration_minutes"],
                        "cost": {
                            "currency": request.budget.currency,
                            "range": price_range
                        },
                        "images": venue_data.get("images", []),
                        "link": venue_data.get("link") or venue_data.get("reservation_link"),
                        "priority": 2,
                        "highlights": ["Local cuisine", "Authentic flavors", "Dining experience"]
                    }
                else:
                    # Format the cost range correctly with descriptive text
                    cost = venue_data.get("cost") or {"currency": request.budget.currency, "range": "500-1000 per person"}
                    if "range" in cost and "per person" not in cost["range"] and "for" not in cost["range"]:
                        cost["range"] = f"{cost['range']} per person"
                    
                    # Ensure correct currency
                    if "currency" in cost:
                        cost["currency"] = request.budget.currency
                        
                    activity = {
                        "title": activity_title,
                        "type": venue_data.get("type", "sightseeing"),
                        "description": venue_data.get("description", f"Explore {venue_data.get('title')} and discover the local culture and attractions."),
                        "location": venue_data.get("location") or {
                            "name": venue_data.get("title"),
                            "coordinates": {"lat": 0, "lng": 0},
                            "google_maps_link": f"https://www.google.com/maps/search/?api=1&query={urllib.parse.quote(venue_data.get('title', 'attraction'))}"
                        },
                        "duration": time_block["duration_minutes"],
                        "cost": cost,
                        "images": venue_data.get("images", []),
                        "link": venue_data.get("link") or venue_data.get("booking_link"),
                        "priority": venue_data.get("priority", 2),
                        "highlights": venue_data.get("highlights") or ["Cultural experience", "Local attraction", "Must-see destination"]
                    }
            else:
                # Fallback if we can't match the venue
                activity = {
                    "title": activity_title,
                    "type": "sightseeing" if "restaurant" not in activity_title_lower else "dining",
                    "description": f"Experience {activity_title} in {request.location.destination}.",
                    "location": {
                        "name": activity_title,
                        "coordinates": {"lat": 0, "lng": 0},
                        "google_maps_link": f"https://www.google.com/maps/search/?api=1&query={urllib.parse.quote(activity_title)}"
                    },
                    "duration": time_block["duration_minutes"],
                    "cost": {"currency": request.budget.currency, "range": "500-800 per person"},
                    "images": [],
                    "link": None,
                    "priority": 2,
                    "highlights": ["Local experience", "Regional specialty"]
                }
                
            # Add travel information with consistent operator field
            travel = {
                "mode": block.get("travel", {}).get("mode", "taxi"),
                "details": block.get("travel", {}).get("details", f"Travel to {activity_title}"),
                "duration_minutes": block.get("travel", {}).get("duration", 15),
                "cost": {
                    "currency": request.budget.currency,
                    "range": "0" if block.get("travel", {}).get("mode") == "walking" else "200-300"
                },
                "link": block.get("travel", {}).get("link"),
                "operator": block.get("travel", {}).get("operator", "Local Transportation Service")
            }
            
            # Add warnings (ensure we always have at least one)
            warnings = [{
                "type": "general",
                "message": day_weather.get("advisory", "Check local conditions before heading out."),
                "priority": 2
            }]
            
            # Complete the time block
            time_block["activity"] = activity
            time_block["travel"] = travel
            time_block["warnings"] = warnings
            
            enriched_time_blocks.append(time_block)
            
        # Create the final day structure
        day_itinerary = {
            "day_number": day_number,
            "date": date_str,
            "weather": day_weather,
            "time_blocks": enriched_time_blocks
        }
        
        return day_itinerary
        
    except Exception as e:
        logger.error(f"Error generating day {day_number}: {str(e)}")
        return create_fallback_day(day_number, date_str, restaurants, activities, day_weather, request)
    
def create_fallback_day(day_number, date_str, restaurants, activities, weather, request):
    """
    Create a fallback day itinerary if generation fails.
    """
    time_blocks = []
    current_hour = 8
    
    # Morning - Breakfast
    if restaurants:
        breakfast = restaurants[0]
        # Format price range correctly with descriptive text
        price_range = breakfast.get("price_range", "400-600 per person")
        if "per person" not in price_range and "for" not in price_range:
            price_range = f"{price_range} per person"
            
        time_blocks.append({
            "type": "fixed",
            "start_time": f"{current_hour:02d}:00",
            "end_time": f"{current_hour+1:02d}:00",
            "duration_minutes": 60,
            "activity": {
                "title": f"Breakfast at {breakfast.get('name', 'Local Restaurant')}",
                "type": "dining",
                "description": f"Start your day with breakfast at {breakfast.get('name', 'a local restaurant')}",
                "location": breakfast.get("location") or {
                    "name": breakfast.get("name", "Local Restaurant"),
                    "coordinates": {"lat": 0, "lng": 0},
                    "google_maps_link": f"https://www.google.com/maps/search/?api=1&query={urllib.parse.quote(breakfast.get('name', 'restaurant'))}"
                },
                "duration": 60,
                "cost": {
                    "currency": request.budget.currency,
                    "range": price_range
                },
                "images": breakfast.get("images", []),
                "link": breakfast.get("link") or breakfast.get("reservation_link"),
                "priority": 2,
                "highlights": ["Morning meal", "Local cuisine", "Energizing start"]
            },
            "travel": {
                "mode": "walking",
                "details": "Walk to restaurant",
                "duration_minutes": 15,
                "cost": {"currency": request.budget.currency, "range": "0"},
                "operator": "Self-guided"
            },
            "warnings": [{
                "type": "general",
                "message": weather.get("advisory", "Check local conditions"),
                "priority": 2
            }]
        })
        current_hour += 2
    
    # Morning activity
    if activities:
        morning_activity = activities[0]
        # Format cost range correctly with descriptive text
        cost = morning_activity.get("cost") or {"currency": request.budget.currency, "range": "500-800 per person"}
        if "range" in cost and "per person" not in cost["range"] and "for" not in cost["range"]:
            cost["range"] = f"{cost['range']} per person"
        
        # Ensure correct currency
        if "currency" in cost:
            cost["currency"] = request.budget.currency
            
        time_blocks.append({
            "type": "flexible",
            "start_time": f"{current_hour:02d}:00",
            "end_time": f"{current_hour+2:02d}:30",
            "duration_minutes": 150,
            "activity": {
                "title": morning_activity.get("title", "Local Attraction"),
                "type": morning_activity.get("type", "sightseeing"),
                "description": morning_activity.get("description", f"Visit {morning_activity.get('title', 'local attraction')}"),
                "location": morning_activity.get("location") or {
                    "name": morning_activity.get("title", "Local Attraction"),
                    "coordinates": {"lat": 0, "lng": 0},
                    "google_maps_link": f"https://www.google.com/maps/search/?api=1&query={urllib.parse.quote(morning_activity.get('title', 'attraction'))}"
                },
                "duration": morning_activity.get("duration", 150),
                "cost": cost,
                "images": morning_activity.get("images", []),
                "link": morning_activity.get("link") or morning_activity.get("booking_link"),
                "priority": morning_activity.get("priority", 2),
                "highlights": morning_activity.get("highlights") or ["Local attraction", "Cultural experience", "Must-see spot"]
            },
            "travel": {
                "mode": "taxi",
                "details": f"Taxi to {morning_activity.get('title', 'attraction')}",
                "duration_minutes": 20,
                "cost": {"currency": request.budget.currency, "range": "200-300"},
                "operator": "Local Taxi Service"
            },
            "warnings": [{
                "type": "general",
                "message": weather.get("advisory", "Check local conditions"),
                "priority": 2
            }]
        })
        current_hour += 3
    
    # Lunch
    if len(restaurants) > 1:
        lunch = restaurants[1]
        # Format price range correctly with descriptive text
        price_range = lunch.get("price_range", "600-900 per person")
        if "per person" not in price_range and "for" not in price_range:
            price_range = f"{price_range} per person"
            
        time_blocks.append({
            "type": "fixed",
            "start_time": f"{current_hour:02d}:00",
            "end_time": f"{current_hour+1:02d}:30",
            "duration_minutes": 90,
            "activity": {
                "title": f"Lunch at {lunch.get('name', 'Local Restaurant')}",
                "type": "dining",
                "description": f"Enjoy lunch at {lunch.get('name', 'a local restaurant')}",
                "location": lunch.get("location") or {
                    "name": lunch.get("name", "Local Restaurant"),
                    "coordinates": {"lat": 0, "lng": 0},
                    "google_maps_link": f"https://www.google.com/maps/search/?api=1&query={urllib.parse.quote(lunch.get('name', 'restaurant'))}"
                },
                "duration": 90,
                "cost": {
                    "currency": request.budget.currency,
                    "range": price_range
                },
                "images": lunch.get("images", []),
                "link": lunch.get("link") or lunch.get("reservation_link"),
                "priority": 2,
                "highlights": ["Midday meal", "Local flavors", "Dining experience"]
            },
            "travel": {
                "mode": "taxi",
                "details": f"Taxi to {lunch.get('name', 'restaurant')}",
                "duration_minutes": 20,
                "cost": {"currency": request.budget.currency, "range": "200-300"},
                "operator": "Local Taxi Service"
            },
            "warnings": [{
                "type": "crowding",
                "message": "Restaurant may be busy during lunch hours",
                "priority": 2
            }]
        })
        current_hour += 2
    
    # Afternoon activity
    if len(activities) > 1:
        afternoon_activity = activities[1]
        # Format cost range correctly with descriptive text
        cost = afternoon_activity.get("cost") or {"currency": request.budget.currency, "range": "600-900 per person"}
        if "range" in cost and "per person" not in cost["range"] and "for" not in cost["range"]:
            cost["range"] = f"{cost['range']} per person"
        
        # Ensure correct currency
        if "currency" in cost:
            cost["currency"] = request.budget.currency
            
        time_blocks.append({
            "type": "flexible",
            "start_time": f"{current_hour:02d}:00",
            "end_time": f"{current_hour+2:02d}:00",
            "duration_minutes": 120,
            "activity": {
                "title": afternoon_activity.get("title", "Local Attraction"),
                "type": afternoon_activity.get("type", "sightseeing"),
                "description": afternoon_activity.get("description", f"Visit {afternoon_activity.get('title', 'local attraction')}"),
                "location": afternoon_activity.get("location") or {
                    "name": afternoon_activity.get("title", "Local Attraction"),
                    "coordinates": {"lat": 0, "lng": 0},
                    "google_maps_link": f"https://www.google.com/maps/search/?api=1&query={urllib.parse.quote(afternoon_activity.get('title', 'attraction'))}"
                },
                "duration": afternoon_activity.get("duration", 120),
                "cost": cost,
                "images": afternoon_activity.get("images", []),
                "link": afternoon_activity.get("link") or afternoon_activity.get("booking_link"),
                "priority": afternoon_activity.get("priority", 2),
                "highlights": afternoon_activity.get("highlights") or ["Popular destination", "Memorable experience", "Local culture"]
            },
            "travel": {
                "mode": "taxi",
                "details": f"Taxi to {afternoon_activity.get('title', 'attraction')}",
                "duration_minutes": 25,
                "cost": {"currency": request.budget.currency, "range": "250-350"},
                "operator": "Local Taxi Service"
            },
            "warnings": [{
                "type": "weather",
                "message": f"{weather.get('conditions', 'Local conditions')} may affect your experience",
                "priority": 2
            }]
        })
        current_hour += 3
    
    # Dinner
    dinner_index = 2 if len(restaurants) > 2 else 0
    dinner = restaurants[dinner_index] if restaurants else None
    
    if dinner:
        # Format price range correctly with descriptive text
        price_range = dinner.get("price_range", "800-1200 per person")
        if "per person" not in price_range and "for" not in price_range:
            price_range = f"{price_range} per person"
            
        time_blocks.append({
            "type": "fixed",
            "start_time": "19:00",
            "end_time": "20:30",
            "duration_minutes": 90,
            "activity": {
                "title": f"Dinner at {dinner.get('name', 'Local Restaurant')}",
                "type": "dining",
                "description": f"Enjoy dinner at {dinner.get('name', 'a local restaurant')}",
                "location": dinner.get("location") or {
                    "name": dinner.get("name", "Local Restaurant"),
                    "coordinates": {"lat": 0, "lng": 0},
                    "google_maps_link": f"https://www.google.com/maps/search/?api=1&query={urllib.parse.quote(dinner.get('name', 'restaurant'))}"
                },
                "duration": 90,
                "cost": {
                    "currency": request.budget.currency,
                    "range": price_range
                },
                "images": dinner.get("images", []),
                "link": dinner.get("link") or dinner.get("reservation_link"),
                "priority": 2,
                "highlights": ["Evening dining", "Local cuisine", "Relaxing atmosphere"]
            },
            "travel": {
                "mode": "taxi",
                "details": f"Taxi to {dinner.get('name', 'restaurant')}",
                "duration_minutes": 20,
                "cost": {"currency": request.budget.currency, "range": "200-300"},
                "operator": "Local Taxi Service"
            },
            "warnings": [{
                "type": "reservation",
                "message": "Reservation recommended during peak hours",
                "priority": 2
            }]
        })
    
    # Create the complete day structure
    return {
        "day_number": day_number,
        "date": date_str,
        "weather": weather,
        "time_blocks": time_blocks
    }

async def generate_complete_itinerary(request: ItineraryRequest) -> Dict[str, Any]:
    """
    Generate a complete trip itinerary using pre-allocation approach for speed without redundancy.
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
    
    # Calculate trip duration
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
    
    # Run metadata generation in parallel with components
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
    
    # Start essential info generation in parallel
    essential_info_task = asyncio.create_task(generate_essential_info(request, meta_info))
    
    # STEP 2: PRE-ALLOCATION - Distribute venues across days to avoid redundancy
    
    # Create lists of available venues with their complete data intact
    available_restaurants = []
    for dining in accommodations_and_dining.get("dining", []):
        if "name" in dining:
            # Fix price_range format for restaurants
            if "price_range" in dining:
                price_range = dining["price_range"]
                if isinstance(price_range, str):
                    if "per person" not in price_range and "for" not in price_range:
                        price_range = f"{price_range} per person"
                    dining["price_range"] = price_range
            
            # Fix links for restaurants
            if "reservation_link" in dining and not "link" in dining:
                dining["link"] = dining.pop("reservation_link")
                
            # Fix location links
            if "location" in dining and isinstance(dining["location"], dict):
                if "link" in dining["location"]:
                    dining["location"]["google_maps_link"] = dining["location"].pop("link")
                elif not "google_maps_link" in dining["location"]:
                    dining["location"]["google_maps_link"] = f"https://www.google.com/maps/search/?api=1&query={urllib.parse.quote(dining['name'])}"
            
            available_restaurants.append({
                "name": dining["name"],
                "data": dining,  # Keep all original data
                "assigned_day": None
            })
    
    available_activities = []
    for category in activities:
        if isinstance(activities[category], list):
            for activity in activities[category]:
                if "title" in activity:
                    # Fix cost format for activities
                    if "cost" in activity:
                        cost = activity["cost"]
                        if isinstance(cost, dict) and "currency" in cost:
                            cost["currency"] = request.budget.currency
                            if "range" in cost and isinstance(cost["range"], str):
                                if "per person" not in cost["range"] and "for" not in cost["range"]:
                                    cost["range"] = f"{cost['range']} per person"
                    
                    # Fix links for activities
                    if "booking_link" in activity and not "link" in activity:
                        activity["link"] = activity.pop("booking_link")
                        
                    # Fix location links
                    if "location" in activity and isinstance(activity["location"], dict):
                        if "link" in activity["location"]:
                            activity["location"]["google_maps_link"] = activity["location"].pop("link")
                        elif not "google_maps_link" in activity["location"]:
                            activity["location"]["google_maps_link"] = f"https://www.google.com/maps/search/?api=1&query={urllib.parse.quote(activity['title'])}"
                    
                    available_activities.append({
                        "name": activity["title"],
                        "data": activity,  # Keep all original data
                        "assigned_day": None,
                        "category": category
                    })
    
    # Calculate how many venues we need per day to cover all days
    restaurants_per_day = max(2, min(3, len(available_restaurants) // duration_days))
    activities_per_day = max(2, min(4, len(available_activities) // duration_days))
    
    # Assign venues to specific days - this prevents redundancy without sequential generation
    for day_number in range(1, duration_days + 1):
        # Get unassigned venues
        unassigned_restaurants = [r for r in available_restaurants if r["assigned_day"] is None]
        unassigned_activities = [a for a in available_activities if a["assigned_day"] is None]
        
        # Assign restaurants to this day
        for i in range(min(restaurants_per_day, len(unassigned_restaurants))):
            unassigned_restaurants[i]["assigned_day"] = day_number
        
        # Assign activities to this day
        for i in range(min(activities_per_day, len(unassigned_activities))):
            unassigned_activities[i]["assigned_day"] = day_number
    
    # Create daily venue assignments
    day_venue_assignments = {}
    for day_number in range(1, duration_days + 1):
        day_venue_assignments[day_number] = {
            "restaurants": [r["data"] for r in available_restaurants if r["assigned_day"] == day_number],
            "activities": [a["data"] for a in available_activities if a["assigned_day"] == day_number]
        }
    
    # Generate all days concurrently using the pre-allocated venues
    day_itineraries = []
    for i, date_str in enumerate(date_range):
        day_number = i + 1
        assigned_venues = day_venue_assignments.get(day_number, {"restaurants": [], "activities": []})
        
        # Process one day at a time
        day_itinerary = await generate_day_with_assigned_venues(day_number, date_str, request, weather, assigned_venues)
        
        # Add initial transport to first day
        # Replace the if condition with this
        if day_number == 1:
            src_coords_task = asyncio.create_task(get_coordinates_from_gemini(request.location.baseCity))
            dst_coords_task = asyncio.create_task(get_coordinates_from_gemini(request.location.destination))

            # Get main transport if available, otherwise create a placeholder
            main_transport = {}
            if isinstance(transport_options.get("main_transport"), list) and transport_options.get("main_transport"):
                main_transport = transport_options["main_transport"][0]
            
            logger.info("Adding initial transport to day 1")
            
            # Determine realistic duration based on location context
            duration_mins = main_transport.get("duration", 120)  # Default 2 hours if not specified
            
            # Make duration more realistic based on destination type
            destination_lower = request.location.destination.lower()
            base_city_lower = request.location.baseCity.lower()
            
            # Check for mountain/remote locations
            is_mountain = any(term in destination_lower for term in ["mountain", "himalayas", "alps", "spiti", "ladakh", "kaza", "manali", "shimla", "uttarakhand", "kashmir"])
            is_remote = any(term in destination_lower for term in ["remote", "village", "island", "jungle", "forest", "national park"])
            
            # If no explicit duration and mountain/remote location, set realistic duration
            if not main_transport.get("duration") and (is_mountain or is_remote):
                if is_mountain:
                    duration_mins = 480  # 8 hours for mountain travel
                elif is_remote:
                    duration_mins = 300  # 5 hours for remote locations
            
            # Format travel mode and times properly
            travel_mode = main_transport.get("mode", "transport").lower()
            
            # Default start time (early morning)
            departure_time = main_transport.get("departure_time", "06:00")
            if not isinstance(departure_time, str) or len(departure_time) < 5:
                departure_time = "06:00"
                
            # Calculate arrival time based on duration
            try:
                departure_dt = datetime.strptime(departure_time[:5], "%H:%M")
                arrival_dt = departure_dt + timedelta(minutes=duration_mins)
                arrival_time = arrival_dt.strftime("%H:%M")
            except:
                # Fallback if datetime parsing fails
                departure_time = "06:00"
                if duration_mins <= 120:
                    arrival_time = "08:00"
                elif duration_mins <= 300:
                    arrival_time = "11:00"
                else:
                    arrival_time = "14:00"
            
            # Get cost information from transport data or provide realistic fallback
            cost = main_transport.get("cost", {})
            if not isinstance(cost, dict):
                cost = {}
                
            cost_currency = cost.get("currency", request.budget.currency)
            
            # Set cost range based on mode and duration
            cost_range = cost.get("range", "")
            if not cost_range:
                if "flight" in travel_mode:
                    cost_range = "3000-8000 per person"
                elif "train" in travel_mode:
                    cost_range = "800-2000 per person"
                elif "bus" in travel_mode:
                    cost_range = "500-1500 per person"
                else:
                    cost_range = "1000-3000 per person"
            
            # Choose appropriate description based on mode
            mode_display = "Transport"
            if "flight" in travel_mode:
                mode_display = "Flight"
            elif "train" in travel_mode:
                mode_display = "Train"
            elif "bus" in travel_mode:
                mode_display = "Bus"
            elif "car" in travel_mode or "taxi" in travel_mode:
                mode_display = "Car"
            
            # Create description with transport details
            description = main_transport.get("details", "")
            if not description:
                description = f"{mode_display} journey from {request.location.baseCity} to {request.location.destination}"
                if is_mountain:
                    description += ". This scenic mountain route offers beautiful views but takes longer due to winding roads and elevation changes."
                elif is_remote:
                    description += ". This journey to a remote location may involve multiple stops or transfers."
            
            # Create warning message based on mode
            warning_message = "Allow extra time for check-in and security procedures."
            if "flight" in travel_mode:
                warning_message = "Arrive at the airport at least 2 hours before departure for check-in and security."
            elif "train" in travel_mode:
                warning_message = "Arrive at the station 30 minutes before departure to find your platform."
            elif is_mountain:
                warning_message = "Mountain roads can be challenging. Take motion sickness medication if needed and expect occasional delays."
            
            # Create transport highlights
            highlights = ["Initial journey", "Start of adventure"]
            if is_mountain:
                highlights.append("Scenic mountain views")
            if "flight" in travel_mode:
                highlights.append("Aerial perspectives")
            elif "train" in travel_mode:
                highlights.append("Comfortable rail journey")
            
            src_coords = await src_coords_task
            dst_coords = await dst_coords_task
            
            # Create the time block with realistic values
            transport_time_block = {
                "type": "fixed",
                "start_time": departure_time[:5],
                "end_time": arrival_time,
                "duration_minutes": duration_mins,
                "activity": {
                    "title": f"{mode_display} from {request.location.baseCity} to {request.location.destination}",
                    "type": "transport",
                    "description": description,
                    "location": {
                        "name": f"From {request.location.baseCity}",
                        "coordinates": src_coords,
                        "google_maps_link": f"https://www.google.com/maps/dir/{urllib.parse.quote(request.location.baseCity)}/{urllib.parse.quote(request.location.destination)}"
                    },
                    "duration": duration_mins,
                    "cost": {"currency": cost_currency, "range": cost_range},
                    "images": [],
                    "link": main_transport.get("booking_link"),
                    "priority": 1,
                    "highlights": highlights
                },
                "travel": {
                    "mode": travel_mode,
                    "details": description,
                    "duration_minutes": duration_mins,
                    "cost": {"currency": cost_currency, "range": cost_range},
                    "operator": main_transport.get("operator", f"Local {mode_display} Service")
                },
                "warnings": [{
                    "type": "general",
                    "message": warning_message,
                    "priority": 1
                }]
            }
            
            # Insert at the beginning of the day's time blocks
            day_itinerary["time_blocks"].insert(0, transport_time_block)
        
        day_itineraries.append(day_itinerary)
        
        # Add a small delay between requests to respect API limits
        if i < len(date_range) - 1:
            await asyncio.sleep(1)
        
        logger.info(f"Generated day {day_number} itinerary")

    logger.info(f"Generated all {len(day_itineraries)} day itineraries sequentially")
    
    # Get essential info (should be done by now)
    essential_info = await essential_info_task
    logger.info("Generated essential information")
    
    # Create schema-compliant transportation data
    transportation_options = []
    
    # Process main transport options
    if isinstance(transport_options.get("main_transport"), list):
        for item in transport_options.get("main_transport"):
            if isinstance(item, dict):
                # Format cost range correctly with descriptive text
                cost = item.get("cost") or {"currency": request.budget.currency, "range": "1000-2000 for full trip"}
                if "range" in cost and "per person" not in cost["range"] and "for" not in cost["range"]:
                    cost["range"] = f"{cost['range']} for full trip"
                
                # Ensure correct currency
                if "currency" in cost:
                    cost["currency"] = request.budget.currency
                    
                # Fix links
                link = item.get("link") or item.get("booking_link")
                
                # Convert to schema-compliant format
                transportation_options.append({
                    "mode": item.get("mode", "car"),
                    "details": item.get("details", "Transportation"),
                    "duration_minutes": item.get("duration"),
                    "cost": cost,
                    "link": link,  # Use consistent link field
                    "operator": item.get("operator", "Local Operator")  # Ensure operator is present
                })
    
    # Process local transport options
    if isinstance(transport_options.get("local_transport"), list):
        for item in transport_options.get("local_transport"):
            if isinstance(item, dict):
                # Format cost range correctly with descriptive text
                cost = item.get("cost") or {"currency": request.budget.currency, "range": "200-400 per trip"}
                if "range" in cost and "per person" not in cost["range"] and "for" not in cost["range"]:
                    cost["range"] = f"{cost['range']} per trip"
                
                # Ensure correct currency
                if "currency" in cost:
                    cost["currency"] = request.budget.currency
                    
                # Convert to schema-compliant format
                transportation_options.append({
                    "mode": item.get("mode", "local"),
                    "details": item.get("details", "Local transportation"),
                    "duration_minutes": item.get("duration"),
                    "cost": cost,
                    "link": item.get("link"),
                    "operator": item.get("operator", "Local Transit Provider")  # Ensure operator is present
                })
    
    # Ensure we have at least one transportation option
    if not transportation_options:
        transportation_options = [{
            "mode": "car",
            "details": f"Transportation in {request.location.destination}",
            "duration_minutes": 60,
            "cost": {
                "currency": request.budget.currency,
                "range": "600-1200 for full day"
            },
            "link": None,
            "operator": "Local operators"
        }]
    
    # Fix accommodations data
    accommodations = []
    for accommodation in accommodations_and_dining.get("accommodations", []):
        # Fix price_range format
        if "price_range" in accommodation:
            price_range = accommodation["price_range"]
            if isinstance(price_range, str):
                if "per night" not in price_range:
                    price_range = f"{price_range} per night"
                accommodation["price_range"] = price_range
        
        # Fix links for accommodations
        if "booking_link" in accommodation and not "link" in accommodation:
            accommodation["link"] = accommodation.pop("booking_link")
            
        # Fix location links
        if "location" in accommodation and isinstance(accommodation["location"], dict):
            if "link" in accommodation["location"]:
                accommodation["location"]["google_maps_link"] = accommodation["location"].pop("link")
            elif not "google_maps_link" in accommodation["location"]:
                accommodation["location"]["google_maps_link"] = f"https://www.google.com/maps/search/?api=1&query={urllib.parse.quote(accommodation['name'])}"
        
        accommodations.append(accommodation)
    
    # Fix dining data
    dining_options = []
    for dining in accommodations_and_dining.get("dining", []):
        # Fix price_range format
        if "price_range" in dining:
            price_range = dining["price_range"]
            if isinstance(price_range, str):
                if "for two" not in price_range:
                    price_range = f"{price_range} for two"
                dining["price_range"] = price_range
        
        # Fix links for dining
        if "reservation_link" in dining and not "link" in dining:
            dining["link"] = dining.pop("reservation_link")
            
        dining_options.append(dining)
    

    prompt = f"""
    Create a simple and attractive travel itinerary name for a trip to {request.location.destination}.

    Format examples:
    - "Himalayan Bliss in Manali"
    - "Snow Adventures in Manali & Solang Valley"
    - "Heritage Trail in Jaipur, Agra & Delhi"
    - "Peaceful Days in Dharamshala & McLeod Ganj"

    The name should be simple, descriptive, and highlight a key experience or attraction at the destination.
    DO NOT mention the trip style explicitly in the name.
    ONLY return the itinerary name itself, nothing else.
    """

    try:
        # Use get_gemini_response instead of get_gemini_structured_response to get raw text
        itinerary_name = await get_gemini_response(prompt, "Generate a simple travel itinerary name")
        
        # Clean up the response - remove any quotes, new lines or extra spaces
        itinerary_name = itinerary_name.strip('"\'').strip()
        
        # Fallback if the name is empty or too short
        if not itinerary_name or len(itinerary_name) < 5:
            itinerary_name = f"Discover {request.location.destination}"
    except Exception:
        itinerary_name = f"Discover {request.location.destination}"

    logger.info(f"Created itinerary name: {itinerary_name}")
    
    # Assemble the final itinerary with proper schema and field order
    complete_itinerary = {
        "name": itinerary_name,
        "metadata": metadata,
        "itinerary": day_itineraries,
        "recommendations": {
            "accommodations": accommodations,
            "dining": dining_options,
            "transportation": transportation_options
        },
        "essential_info": essential_info,
        "journey_path": meta_info.get("journey_path", {})
    }
    
    logger.info(f"Successfully generated complete itinerary with {len(day_itineraries)} days")
    return complete_itinerary

async def get_coordinates_from_gemini(location_name: str) -> dict:
    """Get coordinates for a location using Gemini."""
    prompt = f"""
    Provide the latitude and longitude coordinates for {location_name}.
    Return only a JSON object with this exact format:
    {{
      "lat": 00.0000,
      "lng": 00.0000
    }}
    
    Be precise and use accurate coordinates.
    """
    
    system_instruction = "You are a geography expert. Provide accurate coordinates in decimal format."
    
    try:
        coordinates = await get_gemini_structured_response(prompt, system_instruction)
        # Validate coordinates
        if (isinstance(coordinates, dict) and 
            "lat" in coordinates and 
            "lng" in coordinates and
            isinstance(coordinates["lat"], (int, float)) and
            isinstance(coordinates["lng"], (int, float))):
            return coordinates
        else:
            # Fallback to center of India if invalid response
            logger.warning(f"Invalid coordinates response for {location_name}: {coordinates}")
            return {'lat': 20.5937, 'lng': 78.9629}
    except Exception as e:
        logger.error(f"Error getting coordinates for {location_name}: {str(e)}")
        return {'lat': 20.5937, 'lng': 78.9629}