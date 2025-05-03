from typing import List, Optional, Any, Dict, Union
from pydantic import BaseModel, Field

# Sub-models for the response
class Temperature(BaseModel):
    min: float
    max: float

class Weather(BaseModel):
    temperature: Temperature
    conditions: str
    advisory: str

class Coordinates(BaseModel):
    lat: float
    lng: float

class GeoLocation(BaseModel):
    name: str
    coordinates: Coordinates
    altitude: Optional[float] = None
    google_maps_link: Optional[str] = None

class CostEstimate(BaseModel):
    currency: str
    range: str
    per_unit: Optional[str] = None

class Warning(BaseModel):
    type: str
    message: str
    priority: int = Field(..., ge=1, le=3)

class Activity(BaseModel):
    title: str
    type: str
    description: str
    location: GeoLocation
    duration: int
    cost: CostEstimate
    images: List[str] = []
    booking_link: Optional[str] = Field(None, alias="link")
    priority: int = Field(..., ge=1, le=5)
    highlights: List[str] = []
    backup_alternative_options: Optional[List["Activity"]] = None

class TravelOption(BaseModel):
    mode: str
    details: str
    duration: Optional[int] = None
    cost: CostEstimate
    booking_link: Optional[str] = Field(None, alias="link")
    operator: Optional[str] = None

class TimeBlock(BaseModel):
    type: str
    start_time: str
    end_time: str
    duration_minutes: int
    activity: Optional[Activity] = None
    travel: Optional[TravelOption] = None
    warnings: List[Warning] = []

class DayItinerary(BaseModel):
    day_number: int
    date: str
    weather: Weather
    time_blocks: List[TimeBlock]

class Accommodation(BaseModel):
    name: str
    type: str
    location: GeoLocation
    price_range: str
    rating: float
    images: List[str]
    amenities: List[str]
    booking_link: Optional[str] = Field(None, alias="link")

class Dining(BaseModel):
    name: str
    cuisine: str
    price_range: str
    dietary_options: List[str]
    images: List[str]
    reservation_link: Optional[str] = Field(None, alias="link")

class BudgetBreakdown(BaseModel):
    accommodation: float
    transportation: float
    activities: float
    food: float

class TotalBudget(BaseModel):
    currency: str
    total: str = Field(..., alias="range")
    breakdown: BudgetBreakdown

class Preferences(BaseModel):
    dietary_restrictions: List[str] = []
    accessibility_needs: bool
    pace: str
    context: Optional[str] = None

class Metadata(BaseModel):
    trip_type: Union[str, List[str]]
    duration_days: int
    total_budget: TotalBudget
    preferences: Preferences

class EmergencyContact(BaseModel):
    type: str
    number: str

class EssentialInfo(BaseModel):
    documents: List[str]
    emergency_contacts: List[EmergencyContact]

class PathPoint(BaseModel):
    lat: float
    lng: float

class ElevationPoint(BaseModel):
    distance: float
    elevation: float

class JourneyPath(BaseModel):
    overview: List[PathPoint]
    distance_km: float
    elevation_profile: List[ElevationPoint]

class Recommendations(BaseModel):
    accommodations: List[Accommodation]
    dining: List[Dining]
    transportation: List[TravelOption]

class ItineraryResponse(BaseModel):
    metadata: Metadata
    itinerary: List[DayItinerary]
    recommendations: Recommendations
    essential_info: EssentialInfo
    journey_path: JourneyPath