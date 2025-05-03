from datetime import datetime, timedelta
from typing import List, Dict, Any, Tuple

def calculate_date_range(start_date: str, end_date: str) -> List[str]:
    """
    Generate a list of dates between start_date and end_date.
    
    Args:
        start_date: Start date in YYYY-MM-DD format
        end_date: End date in YYYY-MM-DD format
        
    Returns:
        List of dates in YYYY-MM-DD format
    """
    start = datetime.strptime(start_date, "%Y-%m-%d")
    end = datetime.strptime(end_date, "%Y-%m-%d")
    
    date_list = []
    current = start
    
    while current <= end:
        date_list.append(current.strftime("%Y-%m-%d"))
        current += timedelta(days=1)
    
    return date_list

def format_currency(amount: float, currency: str = "USD") -> str:
    """
    Format a currency amount with the appropriate symbol.
    
    Args:
        amount: The amount to format
        currency: The currency code
        
    Returns:
        Formatted currency string
    """
    currency_symbols = {
        "USD": "$",
        "EUR": "€",
        "GBP": "£",
        "JPY": "¥",
        "INR": "₹"
    }
    
    symbol = currency_symbols.get(currency, currency)
    
    if currency in ["JPY", "INR"]:
        # No decimal places for these currencies
        return f"{symbol}{int(amount):,}"
    else:
        return f"{symbol}{amount:,.2f}"

def calculate_budget_breakdown(total_budget: float) -> Dict[str, float]:
    """
    Calculate a typical budget breakdown for a trip.
    
    Args:
        total_budget: The total trip budget
        
    Returns:
        Dictionary with budget categories and amounts
    """
    return {
        "accommodation": total_budget * 0.35,
        "transportation": total_budget * 0.25,
        "activities": total_budget * 0.20,
        "food": total_budget * 0.15,
        "miscellaneous": total_budget * 0.05
    }

def haversine_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """
    Calculate the great circle distance between two points 
    on the earth (specified in decimal degrees)
    
    Args:
        lat1, lon1: Coordinates of point 1
        lat2, lon2: Coordinates of point 2
        
    Returns:
        Distance in kilometers
    """
    from math import radians, cos, sin, asin, sqrt
    
    # Convert decimal degrees to radians
    lat1, lon1, lat2, lon2 = map(radians, [lat1, lon1, lat2, lon2])
    
    # Haversine formula
    dlon = lon2 - lon1
    dlat = lat2 - lat1
    a = sin(dlat/2)**2 + cos(lat1) * cos(lat2) * sin(dlon/2)**2
    c = 2 * asin(sqrt(a))
    r = 6371  # Radius of earth in kilometers
    
    return c * r