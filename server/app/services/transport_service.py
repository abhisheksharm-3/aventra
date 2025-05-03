import logging
from typing import Dict, Any, List
import json
from datetime import datetime, timedelta

from app.models.request import ItineraryRequest
from app.services.gemini_service import get_gemini_structured_response

logger = logging.getLogger(__name__)

async def get_transport_options(request: ItineraryRequest) -> Dict[str, Any]:
    """
    Generate transport options for the trip.
    
    Args:
        request: The itinerary request object
        
    Returns:
        Dictionary containing transport options
    """
    logger.info(f"Generating transport options for {request.location.baseCity} to {request.location.destination}")
    
    # Calculate trip duration in days
    start_date = datetime.strptime(request.dates.startDate, "%Y-%m-%d")
    end_date = datetime.strptime(request.dates.endDate, "%Y-%m-%d")
    duration_days = (end_date - start_date).days + 1
    
    # Create a prompt for Gemini to generate transport options
    prompt = f"""
    Generate realistic transportation options for a trip from {request.location.baseCity} to {request.location.destination}.
    
    Trip details:
    - Trip dates: {request.dates.startDate} to {request.dates.endDate} (Duration: {duration_days} days)
    - Trip styles: {', '.join(request.tripStyle)}
    - Number of travelers: {request.travelers.count} ({request.travelers.adults} adults, {request.travelers.children} children, {request.travelers.infants} infants)
    - Pace preference: {request.preferences.pace}
    
    Additional preferences:
    {request.additionalContext if request.additionalContext else "No additional preferences specified"}
    
    Provide detailed transportation options including:
    1. Main transportation to the destination (flights, trains, buses, etc.)
    2. Local transportation options at the destination
    3. Airport/station transfers if applicable
    4. Recommended transportation between points of interest
    
    Return as a structured JSON with the following schema:
    {{
        "main_transport": [
            {{
                "mode": string (flight, train, bus, car, etc.),
                "from": string,
                "to": string,
                "departure_time": string,
                "arrival_time": string,
                "duration": integer (in minutes),
                "operator": string,
                "cost": {{
                    "currency": string,
                    "range": string,
                    "per_unit": string
                }},
                "booking_link": string,
                "details": string
            }}
        ],
        "local_transport": [
            {{
                "mode": string,
                "area": string,
                "cost": {{
                    "currency": string,
                    "range": string,
                    "per_unit": string
                }},
                "details": string
            }}
        ],
        "transfers": [
            {{
                "from": string,
                "to": string,
                "mode": string,
                "duration": integer,
                "cost": {{
                    "currency": string,
                    "range": string
                }}
            }}
        ],
        "route_transport": [
            {{
                "from": string,
                "to": string,
                "recommended_mode": string,
                "duration": integer,
                "details": string
            }}
        ]
    }}
    """
    
    system_instruction = """
    You are a transportation specialist with expertise in global travel options. 
    Provide realistic and accurate transport options with details like costs, durations, 
    and operators. Use realistic travel times, prices, and schedules.
    """
    
    try:
        transport_options = await get_gemini_structured_response(prompt, system_instruction)
        logger.info(f"Generated transport options for {request.location.destination}")
        return transport_options
    except Exception as e:
        logger.error(f"Error generating transport options: {str(e)}")
        # Return a minimal structure in case of error
        return {
            "main_transport": [],
            "local_transport": [],
            "transfers": [],
            "route_transport": []
        }