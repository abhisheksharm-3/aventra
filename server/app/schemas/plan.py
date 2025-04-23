# app/schemas/plan.py
from pydantic import BaseModel, Field
from typing import List, Optional

class PlanRequest(BaseModel):
    origin: str = Field(..., example="Delhi")
    destination: str = Field(..., example="Jaipur")
    travelers: int = Field(..., gt=0, example=2)
    budget: str = Field("Medium", example="10000 INR")
    travel_style: List[str] = Field(..., example=["Cultural", "Shopping"])
    duration: str = Field(..., example="3 days")
    currency: str = Field("INR", example="INR")
    context: Optional[str] = Field(
        None,
        example="Vegetarian diet, Wheelchair access needed, No late-night activities"
    )