import re
from typing import Dict, Any, List, Optional
import logging
import urllib.parse

logger = logging.getLogger(__name__)

def create_google_maps_link(name: str = None, lat: float = None, lng: float = None) -> Optional[str]:
    """
    Create a Google Maps link from either a name or coordinates
    """
    if name:
        # Try to create a link with the location name
        encoded_name = urllib.parse.quote(name)
        return f"https://maps.app.goo.gl/?q={encoded_name}"
    elif lat is not None and lng is not None:
        # Create a link with coordinates
        return f"https://maps.app.goo.gl/?q={lat},{lng}"
    return None

def convert_booking_links_to_link(data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Convert booking_link, reservation_link, etc. to 'link' in all objects
    """
    if not isinstance(data, dict):
        return data
    
    result = {}
    
    for key, value in data.items():
        if key in ["booking_link", "reservation_link"] and value is not None:
            result["link"] = value
        elif isinstance(value, dict):
            result[key] = convert_booking_links_to_link(value)
        elif isinstance(value, list):
            result[key] = [convert_booking_links_to_link(item) if isinstance(item, dict) else item for item in value]
        else:
            result[key] = value
            
    return result

def ensure_google_maps_links(data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Ensure all location objects have Google Maps links
    """
    if not isinstance(data, dict):
        return data
    
    result = {}
    
    for key, value in data.items():
        if key == "location" and isinstance(value, dict):
            # This is a location object
            if "google_maps_link" not in value or value["google_maps_link"] is None:
                name = value.get("name")
                coords = value.get("coordinates", {})
                lat = coords.get("lat")
                lng = coords.get("lng")
                
                value["google_maps_link"] = create_google_maps_link(name, lat, lng)
            
            result[key] = value
        elif isinstance(value, dict):
            result[key] = ensure_google_maps_links(value)
        elif isinstance(value, list):
            result[key] = [ensure_google_maps_links(item) if isinstance(item, dict) else item for item in value]
        else:
            result[key] = value
            
    return result

def adjust_budget_structure(data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Update budget structure to match the schema
    """
    if "total_budget" in data and isinstance(data["total_budget"], dict):
        budget = data["total_budget"]
        
        # Rename "range" to "total" if needed
        if "range" in budget and "total" not in budget:
            budget["total"] = budget["range"]
        
        # Ensure we have a breakdown
        if "breakdown" not in budget:
            total = 0
            try:
                total = int(budget.get("total", "0").replace(",", ""))
            except ValueError:
                total = 50000  # Default
                
            budget["breakdown"] = {
                "accommodation": int(total * 0.3),
                "transportation": int(total * 0.2),
                "activities": int(total * 0.2),
                "food": int(total * 0.3)
            }
            
    return data

def move_warnings_to_time_blocks(data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Move warnings from activities to time blocks
    """
    if "itinerary" in data and isinstance(data["itinerary"], list):
        for day in data["itinerary"]:
            if "time_blocks" in day and isinstance(day["time_blocks"], list):
                for time_block in day["time_blocks"]:
                    # Check if activity has warnings
                    if "activity" in time_block and isinstance(time_block["activity"], dict):
                        activity = time_block["activity"]
                        if "warnings" in activity and isinstance(activity["warnings"], list):
                            # Move warnings to time block level
                            if "warnings" not in time_block:
                                time_block["warnings"] = []
                            time_block["warnings"].extend(activity["warnings"])
                            del activity["warnings"]
    
    return data

def add_context_to_preferences(data: Dict[str, Any], context: str = None) -> Dict[str, Any]:
    """
    Add context from additionalContext to preferences if needed
    """
    if "metadata" in data and isinstance(data["metadata"], dict):
        metadata = data["metadata"]
        if "preferences" in metadata and isinstance(metadata["preferences"], dict):
            preferences = metadata["preferences"]
            if "context" not in preferences or preferences["context"] is None:
                preferences["context"] = context or "Personalized travel experience"
    
    return data

def conform_to_schema(data: Dict[str, Any], additional_context: str = None) -> Dict[str, Any]:
    """
    Apply all schema conformance functions
    """
    data = convert_booking_links_to_link(data)
    data = ensure_google_maps_links(data)
    data = adjust_budget_structure(data)
    data = move_warnings_to_time_blocks(data)
    data = add_context_to_preferences(data, additional_context)
    
    return data