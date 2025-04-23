# app/schemas/itinerary.py
from pydantic import BaseModel
from typing import List, Dict, Optional

class Price(BaseModel):
    amount: float
    currency: str

class TravelOption(BaseModel):
    mode: str
    title: str
    description: str
    price_range: str
    link: str
    image: str

class Activity(BaseModel):
    time: str
    type: str
    name: str
    description: str
    duration: str
    price: Optional[Price] = None
    image: Optional[str] = None
    map_link: Optional[str] = None
    options: Optional[List[TravelOption]] = None

class Suggestion(BaseModel):
    name: str
    image: str
    price_range: str
    link: str
    description: str
    rating: Optional[str] = None

class DayPlan(BaseModel):
    day: int
    activities: List[Activity]
    stay_suggestions: List[Suggestion]
    restaurant_suggestions: List[Suggestion]
    daily_budget: Price

class ItineraryResponse(BaseModel):
    trip_name: str
    summary: str
    days: List[DayPlan]
    essential_tips: List[str]
    emergency_contacts: Dict[str, str]
    metadata: Dict[str, str]