from fastapi import FastAPI
from app.api.v1.routes_plan import router as plan_router

app = FastAPI(title="Aventra Planner API")
app.include_router(plan_router)
