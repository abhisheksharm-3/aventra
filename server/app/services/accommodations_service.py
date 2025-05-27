import logging
from typing import Dict, Any, List
import json
import asyncio
import aiohttp # type: ignore
import os
import urllib.parse

from app.models.request import ItineraryRequest
from app.services.gemini_service import get_gemini_structured_response

logger = logging.getLogger(__name__)

# Configure the hotel scraper API endpoint
HOTEL_SCRAPER_API_URL = os.environ.get("HOTEL_SCRAPER_API_URL", "http://localhost:7860/api/hotels")
API_ACCESS_TOKEN = os.environ.get("API_ACCESS_TOKEN")

async def get_accommodations(request: ItineraryRequest) -> Dict[str, Any]:
    """
    Generate hotel recommendations for the trip using Gemini AI.
    
    Args:
        request: The itinerary request object
        
    Returns:
        Dictionary containing accommodation recommendations
    """
    logger.info(f"Generating accommodations for {request.location.destination}")
    
    # Extract budget information
    budget_info = "No specific budget mentioned"
    currency = "USD"
    if request.budget:
        budget_info = f"{request.budget.ceiling} {request.budget.currency}"
        currency = request.budget.currency
    
    # Create a prompt for Gemini to generate accommodations
    prompt = f"""
    Generate hotel recommendations for {request.location.destination}.
    
    Trip details:
    - Trip dates: {request.dates.startDate} to {request.dates.endDate}
    - Trip styles: {', '.join(request.tripStyle)}
    - Number of travelers: {request.travelers.count} ({request.travelers.adults} adults, {request.travelers.children} children, {request.travelers.infants} infants)
    - Budget: {budget_info}
    
    Additional preferences:
    {request.additionalContext if request.additionalContext else "No additional preferences specified"}
    
    Provide recommendations for accommodations:
    - A range of options (luxury, mid-range, budget) aligned with trip styles: {', '.join(request.tripStyle)}
    - In different areas of the destination
    - With amenities suitable for the travelers
    - Include basic details only
    
    IMPORTANT: For each hotel, I need ONLY:
    - Hotel name (realistic and accurate)
    - Hotel type (luxury hotel, resort, boutique hotel, etc.)
    - Location (neighborhood or address)
    - Price range appropriate for the destination and budget
    - A brief description (2-3 sentences)
    
    Return exactly 4-6 hotel options as a structured JSON with this exact schema:
    {{
        "accommodations": [
            {{
                "name": string (hotel name),
                "type": string (hotel type),
                "location": {{
                    "name": string (address or neighborhood),
                    "coordinates": {{
                        "lat": number (latitude),
                        "lng": number (longitude)
                    }}
                }},
                "price_range": string (e.g., "$200-280"),
                "description": string (brief description)
            }}
        ]
    }}
    
    DO NOT include these fields (they will be filled separately): rating, images, amenities, booking_link
    """
    
    system_instruction = """
    You are a hospitality expert with extensive knowledge of accommodations worldwide.
    Provide realistic, diverse, and accurate hotel recommendations that match the trip style and preferences.
    Include only the required fields in your response and ensure hotel names are realistic and findable.
    """
    
    try:
        # Get basic hotel recommendations from Gemini
        recommendations = await get_gemini_structured_response(prompt, system_instruction)
        
        if not recommendations or "accommodations" not in recommendations or not recommendations["accommodations"]:
            logger.warning("Gemini returned empty accommodations list")
            return {"accommodations": []}
        
        logger.info(f"Gemini generated {len(recommendations['accommodations'])} accommodation recommendations")
        
        # Enhance recommendations with real data from hotel scraper API
        enhanced_accommodations = await enhance_with_scraper_data(recommendations["accommodations"], request.location.destination)
        
        return {"accommodations": enhanced_accommodations}
    except Exception as e:
        logger.error(f"Error generating accommodations: {str(e)}")
        # Return a minimal structure in case of error
        return {"accommodations": []}

async def enhance_with_scraper_data(accommodations: List[Dict], destination: str) -> List[Dict]:
    """
    Enhance Gemini-generated accommodations with data from the hotel scraper API.
    
    Args:
        accommodations: List of accommodation dictionaries from Gemini
        destination: The destination location
        
    Returns:
        Enhanced list of accommodations with scraped data
    """
    if not accommodations:
        return []
    
    # Format the request payload for batch processing
    hotels_payload = []
    for hotel in accommodations:
        hotels_payload.append({
            "hotel_name": hotel["name"],
            "destination": destination
        })
    
    payload = {"hotels": hotels_payload}
    
    logger.info(f"Sending batch request to hotel scraper API for {len(hotels_payload)} hotels")
    
    try:
        async with aiohttp.ClientSession() as session:
            # Add the API token header to the request
            headers = {"X-API-Token": API_ACCESS_TOKEN}
            
            # Make a single batch request to the hotel scraper API
            async with session.post(
                HOTEL_SCRAPER_API_URL, 
                json=payload, 
                headers=headers,
                timeout=30
            ) as response:
                if response.status != 200:
                    logger.warning(f"Hotel scraper API returned status {response.status}")
                    return accommodations
                
                data = await response.json()
                
                if data.get("status") != "success" or not data.get("results"):
                    logger.warning("Hotel scraper API returned unsuccessful response")
                    return accommodations
                
                # Process the results and merge with original accommodations
                return await merge_scraped_data(accommodations, data["results"])
                
    except Exception as e:
        logger.error(f"Error fetching details from hotel scraper API: {str(e)}")
        return accommodations  # Return original hotel data if scraping fails
    
async def enrich_with_gemini(hotel_name, hotel_type, location, missing_fields):
    """
    Use Gemini to enrich hotel data with missing fields.
    
    Args:
        hotel_name: Name of the hotel
        hotel_type: Type of hotel (luxury, budget, etc.)
        location: Location of the hotel
        missing_fields: List of fields that need to be generated
        
    Returns:
        Dictionary with enriched fields
    """
    try:
        # Create prompt for Gemini
        prompt = f"""
        For the hotel named "{hotel_name}" ({hotel_type}) located in {location}, 
        please generate realistic information for the following fields:
        {', '.join(missing_fields)}
        
        Format as a JSON object with these fields only.
        """
        
        system_instruction = """
        You are a hospitality expert. Generate realistic details for the requested hotel.
        Return a valid JSON object with only the requested fields.
        """
        
        # Use the centralized Gemini service instead of creating a new model instance
        enriched_data = await get_gemini_structured_response(prompt, system_instruction)
        return enriched_data
        
    except Exception as e:
        logger.warning(f"Gemini enrichment failed for {hotel_name}: {str(e)}")
        return {}
    
def create_google_maps_link(hotel_name, location_name):
    """
    Create a Google Maps link for a hotel.
    
    Args:
        hotel_name: Name of the hotel
        location_name: Location of the hotel
        
    Returns:
        Google Maps URL
    """
    query = urllib.parse.quote(f"{hotel_name} {location_name}")
    return f"https://www.google.com/maps/search/?api=1&query={query}"
    
async def merge_scraped_data(original_accommodations: List[Dict], scraped_results: List[Dict]) -> List[Dict]:
    """
    Merge the original Gemini-generated accommodations with scraped data.
    
    Args:
        original_accommodations: Original list of accommodations from Gemini
        scraped_results: Results from the hotel scraper API
    
    Returns:
        Enhanced list of accommodations
    """
    enhanced_accommodations = []
    
    # Create a map of hotel names to their scraped data for quick lookup
    scraped_map = {}
    for item in scraped_results:
        if not item.get("error") and item.get("data"):
            scraped_map[item["hotel_name"]] = item["data"]
    
    # Merge each original accommodation with its scraped data
    for hotel in original_accommodations:
        # Look for matching scraped data
        scraped_data = scraped_map.get(hotel["name"])
        
        if scraped_data:
            # Process rating - if rating > 5, divide by 2 (since it's out of 10)
            rating = scraped_data.get("rating", 4.0)
            if rating and rating > 5:
                rating = rating / 2
            
            # Identify missing fields that need enrichment
            missing_fields = []
            if not scraped_data.get("amenities"):
                missing_fields.append("amenities")
            if not scraped_data.get("booking_link"):
                missing_fields.append("booking_link")
                
            # Enrich with Gemini if needed
            enriched_data = {}
            if missing_fields:
                location_name = hotel["location"]["name"]
                enriched_data = await enrich_with_gemini(
                    hotel["name"], 
                    hotel["type"], 
                    location_name,
                    missing_fields
                )
            
            # Create enhanced hotel with merged data
            enhanced_hotel = {
                # Keep Gemini-generated fields
                "name": hotel["name"],
                "type": hotel["type"],
                "location": hotel["location"],
                "price_range": hotel["price_range"],
                "description": hotel["description"],
                
                # Add scraper-provided fields, with enrichment for missing data
                "rating": rating,
                "images": scraped_data.get("images", []),  # Images can be empty
                "amenities": scraped_data.get("amenities") or enriched_data.get("amenities") or ["Wi-Fi", "Air conditioning", "Room service"],
                # Use Google Maps link if booking_link is empty
                "booking_link": scraped_data.get("booking_link") or enriched_data.get("booking_link") or create_google_maps_link(hotel["name"], hotel["location"]["name"])
            }
        else:
            # If no scraped data was found, enrich with Gemini completely
            location_name = hotel["location"]["name"]
            enriched_data = await enrich_with_gemini(
                hotel["name"],
                hotel["type"],
                location_name,
                ["amenities", "booking_link"]
            )
            
            enhanced_hotel = {
                **hotel,
                "rating": 4.0,  # Default rating
                "images": [],
                "amenities": enriched_data.get("amenities") or ["Wi-Fi", "Air conditioning", "Room service"],
                # Use Google Maps link if booking_link is empty
                "booking_link": enriched_data.get("booking_link") or create_google_maps_link(hotel["name"], hotel["location"]["name"])
            }
        
        enhanced_accommodations.append(enhanced_hotel)
    
    logger.info(f"Enhanced {len(enhanced_accommodations)} accommodations with scraped and enriched data")
    return enhanced_accommodations

# Add these functions after enrich_with_gemini function and before get_dining

async def get_food_images_from_pexels(cuisine, dish_name=None):
    """
    Get a single relevant food image from Pexels API based on cuisine or dish name.
    
    Args:
        cuisine: Type of cuisine
        dish_name: Optional specific dish name
        
    Returns:
        A single image URL or empty string
    """
    try:
        pexels_api_key = os.environ.get("PEXELS_API")
        if not pexels_api_key:
            logger.warning("PEXELS_API key not found in environment variables")
            return ""
            
        # Construct a very specific food search query
        if dish_name and len(dish_name) > 3:
            # If we have a specific dish, search for that
            search_query = f"{dish_name} {cuisine} dish food"
        else:
            # Otherwise search for the cuisine with specific food terms
            search_query = f"{cuisine} traditional food dish"
        
        # Add specific terms to get food-only photos and avoid people
        search_query += " close-up no-people food-photography"
        encoded_query = urllib.parse.quote(search_query)
        
        # Request more results to have better chances of finding good ones
        url = f"https://api.pexels.com/v1/search?query={encoded_query}&per_page=10&orientation=landscape"
        headers = {"Authorization": pexels_api_key}
        
        async with aiohttp.ClientSession() as session:
            async with session.get(url, headers=headers) as response:
                if response.status != 200:
                    logger.warning(f"Pexels API returned status {response.status}")
                    return ""
                    
                data = await response.json()
                
                # Extract photo URLs - get only the first good one
                photos = data.get("photos", [])
                for photo in photos:
                    if "src" in photo and "medium" in photo["src"]:
                        return photo["src"]["medium"]
                
                return ""
    except Exception as e:
        logger.warning(f"Error fetching images from Pexels: {str(e)}")
        return ""

# Modify the get_dining function to enhance with images and links
async def get_dining(request: ItineraryRequest) -> Dict[str, Any]:
    """
    Generate restaurant recommendations for the trip.
    
    Args:
        request: The itinerary request object
        
    Returns:
        Dictionary containing dining recommendations
    """
    logger.info(f"Generating dining options for {request.location.destination}")
    
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
    
    # Create a prompt for Gemini to generate dining options
    prompt = f"""
    Generate restaurant recommendations for {request.location.destination}.
    
    Trip details:
    - Trip dates: {request.dates.startDate} to {request.dates.endDate}
    - Trip styles: {', '.join(request.tripStyle)}
    - Number of travelers: {request.travelers.count} ({request.travelers.adults} adults, {request.travelers.children} children, {request.travelers.infants} infants)
    - Budget: {budget_info}
    - Dietary preferences: {dietary_preferences}
    
    Additional preferences:
    {request.additionalContext if request.additionalContext else "No additional preferences specified"}
    
    Provide recommendations for dining options:
    - Include a variety of cuisines with emphasis on local specialties
    - Range of price points (high-end, casual, street food)
    - Options that accommodate any dietary preferences mentioned
    - Include signature dishes and dining experiences
    
    Return as a structured JSON with the following schema:
    {{
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
                "description": string
            }}
        ]
    }}
    """
    
    system_instruction = """
    You are a culinary expert with extensive knowledge of dining options worldwide.
    Provide realistic, diverse, and accurate recommendations for dining that match the trip style and preferences.
    Include realistic prices, cuisines, and details for all recommendations.
    """
    
    try:
        recommendations = await get_gemini_structured_response(prompt, system_instruction)
        
        # Enhance dining options with images and reservation links
        if "dining" in recommendations and recommendations["dining"]:
            enhanced_dining = []
            
            # Process each dining option
            for restaurant in recommendations["dining"]:
                # Create Google Maps link
                location_name = restaurant["location"]["name"] if "location" in restaurant and "name" in restaurant["location"] else request.location.destination
                maps_link = create_google_maps_link(restaurant["name"], location_name)
                
                # Get food images from Pexels based on cuisine or signature dish
                signature_dish = restaurant.get("signature_dishes", [""])[0] if restaurant.get("signature_dishes") else ""
                cuisine = restaurant.get("cuisine", "")

                # Fetch a single image asynchronously
                image = await get_food_images_from_pexels(cuisine, signature_dish)

                # Create enhanced restaurant entry
                enhanced_restaurant = {
                    **restaurant,
                    "images": [image] if image else [],  # Add as single-item list if successful
                    "reservation_link": maps_link
                }
                
                enhanced_dining.append(enhanced_restaurant)
            
            recommendations["dining"] = enhanced_dining
            
        logger.info(f"Generated {len(recommendations.get('dining', []))} dining options for {request.location.destination}")
        return recommendations
    except Exception as e:
        logger.error(f"Error generating dining options: {str(e)}")
        # Return a minimal structure in case of error
        return {"dining": []}

async def get_accommodations_and_dining(request: ItineraryRequest) -> Dict[str, Any]:
    """
    Generate hotel and restaurant recommendations for the trip by combining
    results from separate accommodation and dining services.
    
    Args:
        request: The itinerary request object
        
    Returns:
        Dictionary containing accommodation and dining recommendations
    """
    logger.info(f"Generating accommodations and dining options for {request.location.destination}")
    
    # Run both functions concurrently for better performance
    accommodations_task = asyncio.create_task(get_accommodations(request))
    dining_task = asyncio.create_task(get_dining(request))
    
    # Wait for both tasks to complete
    accommodations_result = await accommodations_task
    dining_result = await dining_task
    
    # Combine results
    return {
        "accommodations": accommodations_result.get("accommodations", []),
        "dining": dining_result.get("dining", [])
    }