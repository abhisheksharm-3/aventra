import logging
from typing import Dict, Any
import json

from app.models.request import ItineraryRequest
from app.services.gemini_service import get_gemini_structured_response

logger = logging.getLogger(__name__)

async def get_meta_info(request: ItineraryRequest) -> Dict[str, Any]:
    """
    Generate metadata information for the trip, including altitudes, distances, etc.
    
    Args:
        request: The itinerary request object
        
    Returns:
        Dictionary containing metadata for the trip
    """
    logger.info(f"Generating meta information for {request.location.destination}")
    
    # Create a prompt for Gemini to generate meta information
    prompt = f"""
    Generate detailed meta information for a trip from {request.location.baseCity} to {request.location.destination}.
    
    Trip details:
    - Trip dates: {request.dates.startDate} to {request.dates.endDate}
    - Trip styles: {', '.join(request.tripStyle)}
    - Number of travelers: {request.travelers.count} ({request.travelers.adults} adults, {request.travelers.children} children, {request.travelers.infants} infants)
    - Pace: {request.preferences.pace}
    
    Include the following information:
    1. Geographic data (distances, altitudes, coordinates for key locations)
    2. Elevation profiles between main points
    3. Journey path coordinates
    4. Altitude-related advisories if applicable
    5. Total trip distance in kilometers
    
    Return as a structured JSON with the following schema:
    {{
        "journey_path": {{
            "overview": [
                {{"lat": number, "lng": number}}
            ],
            "distance_km": number,
            "elevation_profile": [
                {{"distance": number, "elevation": number}}
            ]
        }},
        "altitude_info": {{
            "highest_point": number,
            "lowest_point": number,
            "advisory": string
        }},
        "key_coordinates": [
            {{
                "name": string,
                "lat": number,
                "lng": number,
                "altitude": number
            }}
        ]
    }}
    """
    
    system_instruction = """
    You are a geographic and trip metadata specialist. Provide accurate meta information about the journey 
    including altitudes, distances, coordinates, and elevation profiles. Use realistic geographic data.
    """
    
    try:
        meta_info = await get_gemini_structured_response(prompt, system_instruction)
        logger.info(f"Generated meta information for {request.location.destination}")
        return meta_info
    except Exception as e:
        logger.error(f"Error generating meta information: {str(e)}")
        # Return a minimal structure in case of error
        return {
            "journey_path": {
                "overview": [],
                "distance_km": 0,
                "elevation_profile": []
            },
            "altitude_info": {},
            "key_coordinates": []
        }