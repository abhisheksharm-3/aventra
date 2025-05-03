import logging
from typing import Dict, Any, List
import json

from app.models.request import ItineraryRequest
from app.services.gemini_service import get_gemini_structured_response

logger = logging.getLogger(__name__)

async def get_accommodations_and_dining(request: ItineraryRequest) -> Dict[str, Any]:
    """
    Generate hotel and restaurant recommendations for the trip.
    
    Args:
        request: The itinerary request object
        
    Returns:
        Dictionary containing accommodation and dining recommendations
    """
    logger.info(f"Generating accommodations and dining options for {request.location.destination}")
    
    # Extract budget information
    budget_info = "No specific budget mentioned"
    currency = "USD"
    if request.budget:
        budget_info = f"{request.budget.ceiling} {request.budget.currency}"
        currency = request.budget.currency
    
    # Extract dietary preferences if available
    dietary_preferences = "No specific dietary preferences mentioned"
    if request.preferences.dietaryPreferences:
        dietary_preferences = ", ".join(request.preferences.dietaryPreferences)
    
    # Create a prompt for Gemini to generate accommodations and dining options
    prompt = f"""
    Generate hotel and restaurant recommendations for {request.location.destination}.
    
    Trip details:
    - Trip dates: {request.dates.startDate} to {request.dates.endDate}
    - Trip styles: {', '.join(request.tripStyle)}
    - Number of travelers: {request.travelers.count} ({request.travelers.adults} adults, {request.travelers.children} children, {request.travelers.infants} infants)
    - Budget: {budget_info}
    - Dietary preferences: {dietary_preferences}
    
    Additional preferences:
    {request.additionalContext if request.additionalContext else "No additional preferences specified"}
    
    Provide recommendations for:
    
    1. Accommodations:
       - A range of options (luxury, mid-range, budget)
       - In different areas of the destination
       - With amenities suitable for the travelers
       - Include details like price range, location, and key features
    
    2. Dining options:
       - Include a variety of cuisines with emphasis on local specialties
       - Range of price points (high-end, casual, street food)
       - Options that accommodate any dietary preferences mentioned
       - Include signature dishes and dining experiences
    
    Return as a structured JSON with the following schema:
    {{
        "accommodations": [
            {{
                "name": string,
                "type": string,
                "location": {{
                    "name": string,
                    "coordinates": {{
                        "lat": number,
                        "lng": number
                    }}
                }},
                "price_range": string,
                "rating": number (1-5),
                "images": [string],
                "amenities": [string],
                "booking_link": string,
                "description": string
            }}
        ],
        "dining": [
            {{
                "name": string,
                "cuisine": string,
                "price_range": string,
                "dietary_options": [string],
                "signature_dishes": [string],
                "location": {{
                    "name": string,
                    "coordinates": {{
                        "lat": number,
                        "lng": number
                    }}
                }},
                "images": [string],
                "reservation_link": string,
                "description": string
            }}
        ]
    }}
    """
    
    system_instruction = """
    You are a hospitality and culinary expert with extensive knowledge of accommodations and dining options worldwide.
    Provide realistic, diverse, and accurate recommendations for accommodations and dining that match the trip style and preferences.
    Include realistic prices, locations, and details for all recommendations.
    """
    
    try:
        recommendations = await get_gemini_structured_response(prompt, system_instruction)
        logger.info(f"Generated {len(recommendations.get('accommodations', []))} accommodations and {len(recommendations.get('dining', []))} dining options for {request.location.destination}")
        return recommendations
    except Exception as e:
        logger.error(f"Error generating accommodations and dining options: {str(e)}")
        # Return a minimal structure in case of error
        return {
            "accommodations": [],
            "dining": []
        }