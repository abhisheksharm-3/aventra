import logging
from typing import Dict, Any, List
import json
from datetime import datetime, timedelta

from app.models.request import ItineraryRequest
from app.services.gemini_service import get_gemini_structured_response

logger = logging.getLogger(__name__)

async def get_weather_forecast(request: ItineraryRequest) -> Dict[str, Any]:
    """
    Generate a 5-day weather forecast for the destination.
    
    Args:
        request: The itinerary request object
        
    Returns:
        Dictionary containing weather forecast
    """
    logger.info(f"Generating weather forecast for {request.location.destination}")
    
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
        logger.info(f"Generated weather forecast for {request.location.destination}")
        return weather_forecast
    except Exception as e:
        logger.error(f"Error generating weather forecast: {str(e)}")
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