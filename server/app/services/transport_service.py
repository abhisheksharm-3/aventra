import logging
from typing import Dict, Any, List
import json
from datetime import datetime, timedelta
import math

import urllib

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
    
    # Create a prompt for Gemini to generate transport options with emphasis on realistic travel times
    prompt = f"""
    Generate REALISTIC transportation options for a trip from {request.location.baseCity} to {request.location.destination}.
    
    Trip details:
    - Trip dates: {request.dates.startDate} to {request.dates.endDate} (Duration: {duration_days} days)
    - Trip styles: {', '.join(request.tripStyle)}
    - Number of travelers: {request.travelers.count} ({request.travelers.adults} adults, {request.travelers.children} children, {request.travelers.infants} infants)
    - Pace preference: {request.preferences.pace}
    
    Additional preferences:
    {request.additionalContext if request.additionalContext else "No additional preferences specified"}
    
    VERY IMPORTANT: Please be extremely realistic about travel times and options based on geography:
    - Consider the actual road conditions, terrain, and distances between locations
    - For remote or mountainous destinations, include accurate travel durations
    - If direct transport isn't available, suggest reasonable combinations of options
    - Check if the transport mode you're suggesting actually exists between these locations
    - Provide accurate duration estimates (e.g., mountain routes often take 2-3x longer than flat terrain)
    - Consider elevation changes and road conditions in your time estimates
    
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
    You are a transportation specialist with detailed knowledge of global geography and travel logistics.
    
    When providing travel options:
    1. Research actual distances and travel times between locations
    2. For mountain destinations, consider winding roads, elevation changes, and slower speeds
    3. For remote locations, suggest combinations of transport (e.g., flight + bus + taxi)
    4. Be realistic about transport modes that actually exist between locations
    5. If a direct mode doesn't exist, explain the best combination of options
    6. Duration should include all necessary transfers, stops, and waiting times
    
    EXAMPLE DURATIONS:
    - Major cities 30km apart: 45-60 minutes by car/taxi
    - Mountain roads 100km: 3-4 hours (not 1-2 hours) due to winding roads
    - Remote locations: Include transfers and connection times
    - International flights: Include check-in, security, boarding times
    
    NEVER underestimate travel times, especially for mountainous or remote areas.
    """
    
    try:
        transport_options = await get_gemini_structured_response(prompt, system_instruction)
        logger.info(f"Generated transport options for {request.location.destination}")
        
        # Add basic validation/fallback for unrealistic travel times
        if isinstance(transport_options.get("main_transport"), list):
            for option in transport_options["main_transport"]:
                # If duration is unrealistically short for the context, adjust it
                if "duration" in option and option["duration"] < 60 and "flight" not in option.get("mode", "").lower():
                    # Assume at least 1 hour for any non-flight transport
                    option["duration"] = max(60, option["duration"])
                
                # Specifically check for very remote destinations or mountain locations
                destination_lower = request.location.destination.lower()
                if any(term in destination_lower for term in ["mountain", "himalayas", "alps", "remote", "kaza", "spiti"]):
                    if "duration" in option and option["duration"] < 300 and "flight" not in option.get("mode", "").lower():
                        # For mountain/remote locations, ensure road transport is at least 5 hours
                        option["duration"] = max(300, option["duration"])
                
                # Update arrival time based on adjusted duration if needed
                if "departure_time" in option and "duration" in option:
                    try:
                        departure = datetime.strptime(option["departure_time"], "%H:%M")
                        arrival = departure + timedelta(minutes=option["duration"])
                        option["arrival_time"] = arrival.strftime("%H:%M")
                    except (ValueError, TypeError):
                        # If time format issues, just leave as is
                        pass
        # Add fallback Google Maps links for any transport option missing links
        if isinstance(transport_options, dict):
            # Process main_transport links
            if isinstance(transport_options.get("main_transport"), list):
                for option in transport_options["main_transport"]:
                    if not option.get("booking_link") and not option.get("link"):
                        # Create Google Maps directions link
                        if option.get("from") and option.get("to"):
                            from_location = urllib.parse.quote(option["from"])
                            to_location = urllib.parse.quote(option["to"])
                            option["link"] = f"https://www.google.com/maps/dir/{from_location}/{to_location}"
                    # Standardize link field (use "link" instead of "booking_link")
                    if option.get("booking_link") and not option.get("link"):
                        option["link"] = option.pop("booking_link")
            
            # Process local_transport links
            if isinstance(transport_options.get("local_transport"), list):
                for option in transport_options["local_transport"]:
                    if not option.get("link"):
                        # Create Google Maps search link for the area
                        if option.get("area"):
                            area = urllib.parse.quote(option["area"])
                            mode = option.get("mode", "transport").lower()
                            # Add mode-specific search
                            if "taxi" in mode or "car" in mode:
                                option["link"] = f"https://www.google.com/maps/search/taxi+in+{area}"
                            elif "bus" in mode:
                                option["link"] = f"https://www.google.com/maps/search/bus+in+{area}"
                            elif "train" in mode or "metro" in mode or "subway" in mode:
                                option["link"] = f"https://www.google.com/maps/search/train+station+in+{area}"
                            elif "rental" in mode:
                                option["link"] = f"https://www.google.com/maps/search/car+rental+in+{area}"
                            else:
                                option["link"] = f"https://www.google.com/maps/search/transportation+in+{area}"
            
            # Process transfers links
            if isinstance(transport_options.get("transfers"), list):
                for option in transport_options["transfers"]:
                    if not option.get("link"):
                        # Create Google Maps directions link
                        if option.get("from") and option.get("to"):
                            from_location = urllib.parse.quote(option["from"])
                            to_location = urllib.parse.quote(option["to"])
                            option["link"] = f"https://www.google.com/maps/dir/{from_location}/{to_location}"
            
            # Process route_transport links
            if isinstance(transport_options.get("route_transport"), list):
                for option in transport_options["route_transport"]:
                    if not option.get("link"):
                        # Create Google Maps directions link
                        if option.get("from") and option.get("to"):
                            from_location = urllib.parse.quote(option["from"])
                            to_location = urllib.parse.quote(option["to"])
                            mode_param = ""
                            # Add mode-specific parameter if available
                            if option.get("recommended_mode"):
                                mode = option["recommended_mode"].lower()
                                if "walk" in mode:
                                    mode_param = "&travelmode=walking"
                                elif "bus" in mode or "transit" in mode:
                                    mode_param = "&travelmode=transit"
                                elif "car" in mode or "drive" in mode or "taxi" in mode:
                                    mode_param = "&travelmode=driving"
                            option["link"] = f"https://www.google.com/maps/dir/{from_location}/{to_location}{mode_param}"
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