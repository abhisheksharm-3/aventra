from dotenv import load_dotenv
import os

load_dotenv()

class Settings:
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    OPENTRIPMAP_API_KEY: str = os.getenv("OPENTRIPMAP_API_KEY", "")

settings = Settings()
