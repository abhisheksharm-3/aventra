import logging
from typing import Dict, Any, List
import json
from datetime import datetime, timedelta

from app.models.request import ItineraryRequest
from app.services.gemini_service import get_gemini_structured_response

logger = logging.getLogger(__name__)

async def get_activities(request: ItineraryRequest) -> Dict[str, Any]:
    """
    Generate activities/things to do for the trip.
    
    Args:
        request: The itinerary request object
        
    Returns:
        Dictionary containing activities and things to do
    """
    logger.info(f"Generating activities for {request.location.destination}")
    
    # Calculate trip duration in days
    start_date = datetime.strptime(request.dates.startDate, "%Y-%m-%d")
    end_date = datetime.strptime(request.dates.endDate, "%Y-%m-%d")
    duration_days = (end_date - start_date).days + 1
    
    # Extract interests if available
    interests = "No specific interests mentioned"
    if request.preferences.interests:
        interests = ", ".join(request.preferences.interests)
    
    # Create a prompt for Gemini to generate activities
    prompt = f"""
    Generate a comprehensive list of activities and things to do in {request.location.destination} for a {duration_days}-day trip.
    
    Trip details:
    - Trip dates: {request.dates.startDate} to {request.dates.endDate} (Duration: {duration_days} days)
    - Trip styles: {', '.join(request.tripStyle)}
    - Number of travelers: {request.travelers.count} ({request.travelers.adults} adults, {request.travelers.children} children, {request.travelers.infants} infants)
    - Pace preference: {request.preferences.pace}
    - Interests: {interests}
    
    Additional preferences:
    {request.additionalContext if request.additionalContext else "No additional preferences specified"}
    
    Provide a diverse range of activities including:
    1. Must-see attractions and landmarks
    2. Cultural experiences (museums, historical sites, performances)
    3. Outdoor activities appropriate for the location
    4. Local experiences (markets, festivals, workshops)
    5. Hidden gems and off-the-beaten-path options
    6. Family-friendly activities if traveling with children
    
    For each activity include:
    - Detailed description
    - Duration
    - Cost
    - Location information
    - Priority level (1-5, with 1 being highest)
    - Any relevant warnings or considerations
    
    Return as a structured JSON with the following schema:
    {{
        "must_see": [
            {{
                "title": string,
                "type": string,
                "description": string,
                "location": {{
                    "name": string,
                    "coordinates": {{
                        "lat": number,
                        "lng": number
                    }},
                    "google_maps_link": string
                }},
                "duration": integer (in minutes),
                "cost": {{
                    "currency": string,
                    "range": string
                }},
                "priority": integer (1-5),
                "images": [string],
                "booking_link": string,
                "warnings": [
                    {{
                        "type": string,
                        "message": string,
                        "priority": integer (1-3)
                    }}
                ]
            }}
        ],
        "cultural": [array of objects with same structure as above],
        "outdoor": [array of objects with same structure as above],
        "local_experiences": [array of objects with same structure as above],
        "hidden_gems": [array of objects with same structure as above],
        "family_friendly": [array of objects with same structure as above]
    }}
    """
    
    system_instruction = """
    You are a travel expert with in-depth knowledge of destinations worldwide. 
    Provide diverse, interesting, and realistic activity recommendations suitable for the specified trip style and traveler preferences.
    Include accurate location information, costs, and timing estimates.
    """
    
    try:
        activities = await get_gemini_structured_response(prompt, system_instruction)
        logger.info(f"Generated {sum(len(activities.get(k, [])) for k in activities)} activities for {request.location.destination}")
        return activities
    except Exception as e:
        logger.error(f"Error generating activities: {str(e)}")
        # Return a minimal structure in case of error
        return {
            "must_see": [],
            "cultural": [],
            "outdoor": [],
            "local_experiences": [],
            "hidden_gems": [],
            "family_friendly": []
        }