from fastapi import APIRouter, HTTPException
from app.schemas.plan import PlanRequest
from app.core.logger import logger
from app.services.generator import generate_itinerary

router = APIRouter()

@router.post("/plan/generate")
async def plan_generate(payload: PlanRequest):
    try:
        logger.info(f"Generating plan {payload.origin}→{payload.destination}")
        return await generate_itinerary(payload.dict())
    except Exception as e:
        logger.error(f"Error in /plan/generate: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")
