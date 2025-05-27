import logging
from typing import Dict, Any, List
import json
from datetime import datetime, timedelta
import aiohttp # type: ignore
import urllib.parse
import os

from app.models.request import ItineraryRequest
from app.services.gemini_service import get_gemini_structured_response

logger = logging.getLogger(__name__)

def create_google_maps_link(activity_name, location_name):
    """
    Create a Google Maps link for an activity.
    
    Args:
        activity_name: Name of the activity
        location_name: Location of the activity
        
    Returns:
        Google Maps URL
    """
    query = urllib.parse.quote(f"{activity_name} {location_name}")
    return f"https://www.google.com/maps/search/?api=1&query={query}"

async def get_wikimedia_image(activity_name, location_name, coordinates=None):
    """
    Get a relevant image from Wikimedia Commons API based on activity and location.
    Uses multiple methods with explicit fallbacks between them.
    
    Args:
        activity_name: Name of the activity
        location_name: Name of the location
        coordinates: Optional dict with lat and lng fields
        
    Returns:
        Image URL or empty string
    """
    try:
        # METHOD 1: Geosearch with lat/long coordinates
        image_url = await try_geosearch_method(activity_name, coordinates)
        if image_url:
            logger.info(f"Successfully found image via geosearch for {activity_name}")
            return image_url
            
        logger.info(f"Geosearch failed for {activity_name}, trying category search")
            
        # METHOD 2: Category search with properly formatted category names
        image_url = await try_category_search_method(activity_name, location_name)
        if image_url:
            logger.info(f"Successfully found image via category search for {activity_name}")
            return image_url
            
        logger.info(f"Category search failed for {activity_name}, trying basic search")
            
        # METHOD 3: Basic search as final fallback
        image_url = await try_basic_search_method(activity_name, location_name)
        if image_url:
            logger.info(f"Successfully found image via basic search for {activity_name}")
            return image_url
        
        logger.info(f"All image search methods failed for {activity_name} at {location_name}")
        return ""
    except Exception as e:
        logger.warning(f"Error in main get_wikimedia_image function: {str(e)}")
        return ""

async def try_geosearch_method(activity_name, coordinates):
    """Try finding images using geosearch based on coordinates"""
    try:
        if not coordinates or 'lat' not in coordinates or 'lng' not in coordinates:
            return ""
            
        lat = coordinates['lat']
        lng = coordinates['lng']
        
        if lat == 0 and lng == 0:  # Skip if coordinates are zeros
            return ""
            
        # Try with increasing radius to ensure we find something
        for radius in [300, 500, 1000, 2000]:
            url = f"https://commons.wikimedia.org/w/api.php?action=query&generator=geosearch&ggscoord={lat}|{lng}&ggsradius={radius}&ggsnamespace=6&ggslimit=10&prop=imageinfo&iiprop=url&format=json"
            
            async with aiohttp.ClientSession() as session:
                async with session.get(url) as response:
                    if response.status != 200:
                        logger.warning(f"Wikimedia geosearch API returned status {response.status}")
                        continue
                    
                    data = await response.json()
                    
                    # Extract the first image URL if available
                    if 'query' in data and 'pages' in data['query']:
                        for page_id, page_data in data['query']['pages'].items():
                            if 'imageinfo' in page_data and page_data['imageinfo']:
                                file_url = page_data['imageinfo'][0]['url']
                                if any(ext in file_url.lower() for ext in ['.jpg', '.jpeg', '.png', '.gif']):
                                    return file_url
        return ""
    except Exception as e:
        logger.warning(f"Error in geosearch method: {str(e)}")
        return ""

async def try_category_search_method(activity_name, location_name):
    """Try finding images using category search"""
    try:
        # Clean up the search terms for category names
        category_terms = [
            f"{activity_name}, {location_name}",
            activity_name,
            location_name
        ]
        
        # Format terms for category search
        formatted_terms = []
        for term in category_terms:
            # Standard format: Title_Case_With_Underscores
            simple = term.strip().title().replace(' ', '_')
            formatted_terms.append(simple)
            
            # Clean format: remove non-alphanumeric chars
            clean = ''.join(c for c in term if c.isalnum() or c.isspace()).strip().title().replace(' ', '_')
            if clean != simple:
                formatted_terms.append(clean)
        
        for term in formatted_terms:
            if len(term) < 4:  # Skip very short terms
                continue
                
            url = f"https://commons.wikimedia.org/w/api.php?action=query&generator=categorymembers&gcmtitle=Category:{term}&gcmlimit=10&gcmtype=file&prop=imageinfo&iiprop=url&format=json"
            
            async with aiohttp.ClientSession() as session:
                async with session.get(url) as response:
                    if response.status != 200:
                        continue
                        
                    data = await response.json()
                    
                    if 'query' in data and 'pages' in data['query']:
                        for page_id, page_data in data['query']['pages'].items():
                            if 'imageinfo' in page_data and page_data['imageinfo']:
                                file_url = page_data['imageinfo'][0]['url']
                                if any(ext in file_url.lower() for ext in ['.jpg', '.jpeg', '.png', '.gif']):
                                    return file_url
        return ""
    except Exception as e:
        logger.warning(f"Error in category search method: {str(e)}")
        return ""

async def try_basic_search_method(activity_name, location_name):
    """Try finding images using basic search as final fallback"""
    try:
        search_terms = [
            f"{activity_name} {location_name}",
            location_name,
            activity_name
        ]
        
        for search_term in search_terms:
            encoded_query = urllib.parse.quote(search_term)
            url = f"https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch={encoded_query}&prop=imageinfo&iiprop=url&format=json&gsrlimit=10"
            
            async with aiohttp.ClientSession() as session:
                async with session.get(url) as response:
                    if response.status != 200:
                        continue
                        
                    data = await response.json()
                    
                    if 'query' in data and 'pages' in data['query']:
                        for page_id, page_data in data['query']['pages'].items():
                            if 'imageinfo' in page_data and page_data['imageinfo']:
                                file_url = page_data['imageinfo'][0]['url']
                                if any(ext in file_url.lower() for ext in ['.jpg', '.jpeg', '.png', '.gif']):
                                    return file_url
        return ""
    except Exception as e:
        logger.warning(f"Error in basic search method: {str(e)}")
        return ""
    
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
    
    DO NOT include images or links - these will be added separately.
    Leave the "images" field as an empty array.
    
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
                    }}
                }},
                "duration": integer (in minutes),
                "cost": {{
                    "currency": string,
                    "range": string
                }},
                "priority": integer (1-5),
                "images": [],
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
    DO NOT include any image URLs - leave the images array empty.
    DO NOT include any example.com URLs or placeholder links.
    """
    
    try:
        activities = await get_gemini_structured_response(prompt, system_instruction)
        
        # Ensure our response has all expected categories
        categories = ["must_see", "cultural", "outdoor", "local_experiences", "hidden_gems", "family_friendly"]
        for category in categories:
            if category not in activities:
                activities[category] = []
            
            # Process each activity
            for activity in activities[category]:
                # Ensure required fields exist
                if 'location' not in activity:
                    activity['location'] = {
                        "name": f"{activity.get('title', 'Attraction')} in {request.location.destination}",
                        "coordinates": {"lat": 0, "lng": 0}
                    }
                    
                # Get location name for further processing
                location_name = activity['location'].get('name', request.location.destination)
                
                # Add Google Maps link if not present
                if 'google_maps_link' not in activity['location']:
                    activity['location']['google_maps_link'] = create_google_maps_link(
                        activity['title'], location_name
                    )
                
                # Clear any existing placeholder images
                if 'images' not in activity or not activity['images'] or any("example.com" in img for img in activity['images']):
                    activity['images'] = []
                
                # Add Wikimedia image if images array is empty
                if not activity['images']:
                    image_url = await get_wikimedia_image(
                        activity['title'], 
                        location_name,
                        activity['location'].get('coordinates') if 'location' in activity and 'coordinates' in activity['location'] else None
                    )
                    if image_url:
                        activity['images'] = [image_url]
                
                # Ensure booking_link exists (can be empty)
                if 'booking_link' not in activity:
                    activity['booking_link'] = ""
                    
                # Ensure currency is ₹ instead of INR
                if 'cost' in activity and isinstance(activity['cost'], dict) and activity['cost'].get('currency') == "INR":
                    activity['cost']['currency'] = "₹"
        
        logger.info(f"Generated {sum(len(activities.get(k, [])) for k in categories)} activities for {request.location.destination}")
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