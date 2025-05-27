import logging
from typing import Dict, Any, List
import json
from datetime import datetime, timedelta
import openmeteo_requests # type: ignore
import requests_cache # type: ignore
from retry_requests import retry # type: ignore
import numpy as np
from geopy.geocoders import Nominatim # type: ignore

from app.models.request import ItineraryRequest
from app.services.gemini_service import get_gemini_structured_response

logger = logging.getLogger(__name__)

# Setup the Open-Meteo API client with cache and retry on error
cache_session = requests_cache.CachedSession('.cache', expire_after=3600)
retry_session = retry(cache_session, retries=5, backoff_factor=0.2)
openmeteo = openmeteo_requests.Client(session=retry_session)

async def get_coordinates_with_gemini(location_name):
    """
    Get latitude and longitude for a location using Gemini.
    
    Args:
        location_name: Name of the location
        
    Returns:
        Tuple of (latitude, longitude) or None if not found
    """
    try:
        prompt = f"""
        Provide the precise latitude and longitude coordinates for {location_name}.
        Return ONLY the coordinates in this exact JSON format:
        {{
            "latitude": 00.0000,
            "longitude": 00.0000
        }}
        
        Use 4 decimal places precision. Do not include any explanation, just the JSON.
        """
        
        system_instruction = """
        You are a geographical expert. Provide accurate latitude and longitude coordinates 
        for the specified location. Only return the JSON, nothing else.
        """
        
        result = await get_gemini_structured_response(prompt, system_instruction)
        
        if result and "latitude" in result and "longitude" in result:
            lat = result["latitude"]
            lng = result["longitude"]
            logger.info(f"Retrieved coordinates via Gemini for {location_name}: ({lat}, {lng})")
            return (lat, lng)
        return None
    except Exception as e:
        logger.warning(f"Error getting coordinates with Gemini for {location_name}: {str(e)}")
        return None

async def get_coordinates(location_name):
    """
    Get latitude and longitude for a location using geocoding.
    Tries standard geocoder first, then falls back to Gemini if needed.
    
    Args:
        location_name: Name of the location
        
    Returns:
        Tuple of (latitude, longitude) or None if not found
    """
    try:
        # Manual overrides for commonly used locations
        location_overrides = {
            "Manali": (32.2432, 77.1892),
            "Manali, India": (32.2432, 77.1892),
            "Shimla": (31.1048, 77.1734),
            "Kullu": (31.9576, 77.1095),
            # Add more popular destinations as needed
        }
        
        # Check overrides first
        if location_name in location_overrides:
            logger.info(f"Using override coordinates for {location_name}")
            return location_overrides[location_name]
            
        # Try standard geocoding first
        geolocator = Nominatim(user_agent="travel_itinerary_app")
        location = geolocator.geocode(location_name)
        if location:
            logger.info(f"Successfully geocoded {location_name} to: ({location.latitude}, {location.longitude})")
            return (location.latitude, location.longitude)
        
        # If standard geocoding fails, try Gemini
        logger.info(f"Standard geocoding failed for {location_name}, trying Gemini")
        gemini_coordinates = await get_coordinates_with_gemini(location_name)
        if gemini_coordinates:
            return gemini_coordinates
            
        logger.warning(f"All geocoding methods failed for: {location_name}")
        return None
    except Exception as e:
        logger.warning(f"Error in standard geocoding for {location_name}: {str(e)}")
        
        # Try Gemini as fallback
        logger.info(f"Trying Gemini for coordinates after geocoding exception")
        return await get_coordinates_with_gemini(location_name)

async def get_open_meteo_forecast(latitude, longitude, start_date):
    """
    Fetch weather forecast from Open-Meteo API.
    
    Args:
        latitude: Latitude of the location
        longitude: Longitude of the location
        start_date: Start date for the forecast
        
    Returns:
        Dictionary with daily forecast data
    """
    try:
        # Format dates for Open-Meteo API (YYYY-MM-DD)
        end_date = (datetime.strptime(start_date, "%Y-%m-%d") + timedelta(days=5)).strftime("%Y-%m-%d")
        
        # Set up API parameters
        params = {
            "latitude": latitude,
            "longitude": longitude,
            "daily": [
                "temperature_2m_max", 
                "temperature_2m_min",
                "precipitation_probability_max",
                "precipitation_sum", 
                "wind_speed_10m_max",
                "wind_direction_10m_dominant",
                "weather_code"
            ],
            "timezone": "auto",
            "start_date": start_date,
            "end_date": end_date
        }
        
        # Make API call
        responses = openmeteo.weather_api("https://api.open-meteo.com/v1/forecast", params=params)
        response = responses[0]
        
        daily = response.Daily()
        
        # Process weather data
        weather_data = []
        weather_codes = {
            0: "Clear sky",
            1: "Mainly clear", 2: "Partly cloudy", 3: "Overcast",
            45: "Fog", 48: "Depositing rime fog",
            51: "Light drizzle", 53: "Moderate drizzle", 55: "Dense drizzle",
            61: "Slight rain", 63: "Moderate rain", 65: "Heavy rain",
            71: "Slight snow", 73: "Moderate snow", 75: "Heavy snow",
            80: "Slight rain showers", 81: "Moderate rain showers", 82: "Violent rain showers",
            95: "Thunderstorm", 96: "Thunderstorm with slight hail", 99: "Thunderstorm with heavy hail"
        }
        
        # Wind direction conversion
        def get_wind_direction(degrees):
            directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"]
            index = round(degrees / 45) % 8
            return directions[index]
        
        # Convert API response to our format
        dates = daily.Variables(0).ValuesAsNumpy().tolist()
        max_temps = daily.Variables(0).ValuesAsNumpy().tolist()
        min_temps = daily.Variables(1).ValuesAsNumpy().tolist()
        precip_prob = daily.Variables(2).ValuesAsNumpy().tolist()
        precip_sum = daily.Variables(3).ValuesAsNumpy().tolist()
        wind_speed = daily.Variables(4).ValuesAsNumpy().tolist()
        wind_dir_deg = daily.Variables(5).ValuesAsNumpy().tolist()
        weather_code_vals = daily.Variables(6).ValuesAsNumpy().tolist()
        
        for i in range(len(dates)):
            if i >= 5:  # Limit to 5 days
                break
                
            date_str = datetime.fromtimestamp(dates[i]).strftime("%Y-%m-%d")
            weather_code = int(weather_code_vals[i])
            condition = weather_codes.get(weather_code, "Unknown")
            
            precip_amount = "None"
            if precip_sum[i] < 1:
                precip_amount = "None"
            elif precip_sum[i] < 5:
                precip_amount = "Light"
            elif precip_sum[i] < 15:
                precip_amount = "Moderate"
            else:
                precip_amount = "Heavy"
                
            weather_data.append({
                "date": date_str,
                "temperature": {
                    "min": round(min_temps[i], 1),
                    "max": round(max_temps[i], 1)
                },
                "conditions": condition,
                "precipitation": {
                    "probability": round(precip_prob[i]),
                    "amount": precip_amount 
                },
                "wind": {
                    "speed": round(wind_speed[i], 1),
                    "unit": "km/h",
                    "direction": get_wind_direction(wind_dir_deg[i])
                },
                "advisory": ""  # Will be filled in by Gemini
            })
        
        logger.info(f"Successfully retrieved Open-Meteo forecast data with {len(weather_data)} days")
        return weather_data
    except Exception as e:
        logger.error(f"Error fetching Open-Meteo forecast: {str(e)}")
        return None

async def enhance_forecast_with_gemini(weather_data, destination):
    """
    Enhance the weather forecast with Gemini-generated advisories.
    
    Args:
        weather_data: List of weather forecast data from Open-Meteo
        destination: Destination name
        
    Returns:
        Enhanced weather forecast with advisories
    """
    try:
        # Create a prompt including the real weather data
        weather_json = json.dumps(weather_data, indent=2)
        
        prompt = f"""
        Here is the actual weather forecast for {destination} for the next 5 days:
        
        {weather_json}
        
        Based on this forecast data, please provide:
        1. A specific advisory for each day based on the conditions, temperature, precipitation, and wind
        2. A general advisory for the entire period
        
        For each day's advisory, consider:
        - What activities would be suitable or unsuitable based on the weather
        - What clothing or equipment would be appropriate
        - Any safety precautions needed
        
        For the general advisory, provide an overall assessment of the weather during this period and how it might affect travel plans.
        
        Return as a structured JSON with the following schema:
        {{
            "daily_advisories": [
                {{
                    "date": "YYYY-MM-DD",
                    "advisory": "Advisory text for this specific day"
                }}
            ],
            "general_advisory": "Overall weather advisory for the entire period"
        }}
        """
        
        system_instruction = """
        You are a meteorological expert. Provide helpful weather advisories based on the provided forecast data.
        Focus on practical advice for travelers, including clothing recommendations, activity suggestions, and safety precautions.
        """
        
        advisories = await get_gemini_structured_response(prompt, system_instruction)
        
        # Add Gemini's advisories to the weather data
        for day in weather_data:
            date = day["date"]
            for advisory in advisories.get("daily_advisories", []):
                if advisory.get("date") == date:
                    day["advisory"] = advisory.get("advisory", "")
        
        logger.info(f"Successfully enhanced forecast with Gemini advisories")
        return {
            "forecast": weather_data,
            "general_advisory": advisories.get("general_advisory", "Weather conditions may vary. Check local forecasts.")
        }
    except Exception as e:
        logger.error(f"Error enhancing forecast with Gemini: {str(e)}")
        
        # Return original data if enhancement fails
        return {
            "forecast": weather_data,
            "general_advisory": "Be prepared for variable weather conditions."
        }

async def get_weather_forecast(request: ItineraryRequest) -> Dict[str, Any]:
    """
    Generate a 5-day weather forecast for the destination using real data and AI enhancement.
    
    Args:
        request: The itinerary request object
        
    Returns:
        Dictionary containing weather forecast
    """
    logger.info(f"Generating weather forecast for {request.location.destination}")
    
    try:
        # First get coordinates for the destination
        coordinates = await get_coordinates(request.location.destination)
        
        if coordinates:
            # Get real weather data from Open-Meteo
            latitude, longitude = coordinates
            logger.info(f"Using coordinates ({latitude}, {longitude}) for {request.location.destination}")
            
            weather_data = await get_open_meteo_forecast(latitude, longitude, request.dates.startDate)
            
            if weather_data:
                # Enhance forecast with Gemini advisories
                enhanced_forecast = await enhance_forecast_with_gemini(weather_data, request.location.destination)
                logger.info(f"Generated enhanced weather forecast for {request.location.destination}")
                return enhanced_forecast
        
        # Fallback to Gemini-only forecast if Open-Meteo fails
        logger.warning(f"Falling back to Gemini-only forecast for {request.location.destination}")
        return await get_gemini_forecast(request)
    except Exception as e:
        logger.error(f"Error generating weather forecast: {str(e)}")
        return await get_gemini_forecast(request)  # Fallback to Gemini-only forecast

async def get_gemini_forecast(request: ItineraryRequest) -> Dict[str, Any]:
    """
    Generate a simulated 5-day weather forecast using Gemini (fallback method).
    
    Args:
        request: The itinerary request object
        
    Returns:
        Dictionary containing simulated weather forecast
    """
    # Parse start date
    start_date = datetime.strptime(request.dates.startDate, "%Y-%m-%d")
    
    # Create a prompt for Gemini to generate weather forecast
    prompt = f"""
    Generate a realistic 5-day weather forecast for {request.location.destination} starting from {request.dates.startDate}.
    
    Consider:
    - Typical weather patterns for this location during this time of year
    - Seasonal variations and climate of the destination
    - Altitude and geographical features that might affect weather
    
    For each day, provide:
    - Date
    - Temperature range (min/max in Celsius)
    - Weather conditions (sunny, cloudy, rainy, etc.)
    - Precipitation probability (%)
    - Wind speed
    - Any relevant weather advisories or warnings
    
    Return as a structured JSON with the following schema:
    {{
        "forecast": [
            {{
                "date": string (YYYY-MM-DD),
                "temperature": {{
                    "min": number,
                    "max": number
                }},
                "conditions": string,
                "precipitation": {{
                    "probability": number (0-100),
                    "amount": string
                }},
                "wind": {{
                    "speed": number,
                    "unit": string,
                    "direction": string
                }},
                "advisory": string
            }}
        ],
        "general_advisory": string
    }}
    """
    
    system_instruction = """
    You are a meteorological expert. Generate realistic weather forecasts based on typical conditions
    for the specified location and time of year. Include temperature ranges, conditions, and appropriate
    advisories based on the forecast. Make sure the data follows seasonal patterns and geographical considerations.
    """
    
    try:
        weather_forecast = await get_gemini_structured_response(prompt, system_instruction)
        logger.info(f"Generated fallback Gemini weather forecast for {request.location.destination}")
        return weather_forecast
    except Exception as e:
        logger.error(f"Error generating fallback Gemini forecast: {str(e)}")
        # Return a minimal structure in case of error
        forecast = []
        for i in range(5):
            date = start_date + timedelta(days=i)
            forecast.append({
                "date": date.strftime("%Y-%m-%d"),
                "temperature": {"min": 15, "max": 25},
                "conditions": "Unknown",
                "precipitation": {"probability": 0, "amount": "None"},
                "wind": {"speed": 0, "unit": "km/h", "direction": "N/A"},
                "advisory": "Weather data unavailable"
            })
        
        return {
            "forecast": forecast,
            "general_advisory": "Weather data could not be retrieved."
        }