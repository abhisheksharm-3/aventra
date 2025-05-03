from typing import List, Optional
from pydantic import BaseModel, Field

class LocationInfo(BaseModel):
    destination: str = Field(..., description="Primary destination for the trip")
    baseCity: str = Field(..., description="City of origin for the trip")

class DateInfo(BaseModel):
    startDate: str = Field(..., description="Trip start date in YYYY-MM-DD format")
    endDate: str = Field(..., description="Trip end date in YYYY-MM-DD format")
    isFlexible: bool = Field(False, description="Whether dates are flexible by a few days")

class TravelersInfo(BaseModel):
    count: int = Field(..., ge=1, description="Number of travelers")
    adults: int = Field(1, ge=0, description="Number of adults (18+)")
    children: int = Field(0, ge=0, description="Number of children (2-17)")
    infants: int = Field(0, ge=0, description="Number of infants (under 2)")

class BudgetInfo(BaseModel):
    ceiling: int = Field(..., description="Maximum budget for the entire trip")
    currency: str = Field("USD", description="Currency code (ISO 4217)")

class AccessibilityInfo(BaseModel):
    mobilityNeeds: bool = Field(False)
    hearingNeeds: bool = Field(False)
    visionNeeds: bool = Field(False)
    dietaryRestrictions: bool = Field(False)
    notes: Optional[str] = None

class PreferencesInfo(BaseModel):
    interests: Optional[List[str]] = Field(None, description="Specific interests for activities and attractions")
    travelStyle: Optional[List[str]] = Field(None, description="Preferred travel styles and experiences")
    dietaryPreferences: Optional[List[str]] = Field(None, description="Dietary requirements and food preferences")
    pace: str = Field("moderate", description="Preferred pace of the trip")
    accessibility: Optional[AccessibilityInfo] = None

class ItineraryRequest(BaseModel):
    location: LocationInfo
    dates: DateInfo
    travelers: TravelersInfo
    budget: Optional[BudgetInfo] = None
    tripStyle: List[str] = Field(..., description="Primary styles or purposes of the trip")
    preferences: PreferencesInfo
    additionalContext: Optional[str] = Field(None, description="Any additional details, preferences, or restrictions")