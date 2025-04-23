# app/services/generator.py
import re
import json
import httpx
import urllib.parse
from fastapi import HTTPException
from app.core.config import settings
from app.core.logger import logger
from app.services.utils import geocode, get_wikimedia_image
from app.services.scraper import (
    scrape_skyscanner_hotels,
    scrape_google_restaurants,
    scrape_google_flights,
    scrape_google_trains
)

PROMPT_TEMPLATE = """
Generate a detailed travel itinerary in STRICT JSON format following these rules:
1. Structure:
{{
  "trip_name": "{duration} {travel_style} Trip to {destination}",
  "summary": "Detailed overview focusing on {travel_style} experiences within {budget} budget",
  "days": [
    {{
      "day": 1,
      "activities": [
        {{
          "time": "09:00 AM",
          "type": "travel",
          "name": "Travel from {origin} to {destination}",
          "description": "Detailed travel instructions considering {budget} budget",
          "travel_modes": ["flight", "train", "bus", "car"],
          "distance_km": 250,
          "duration": "4 hours",
          "recommended_mode": "train"
        }},
        {{
          "time": "01:00 PM",
          "type": "attraction",
          "name": "Landmark Name",
          "description": "3-5 sentences about the place with visitor tips",
          "duration": "2 hours",
          "price": {{
            "amount": 500,
            "currency": "{currency}"
          }}
        }}
      ],
      "daily_budget": {{
        "amount": 5000,
        "currency": "{currency}"
      }}
    }}
  ],
  "essential_tips": [
    "Tip related to {context}"
  ],
  "emergency_contacts": {{
    "Police": "100",
    "Ambulance": "102"
  }}
}}
2. Requirements:
- Include exact times for each activity
- For travel between locations, calculate realistic distance_km and duration
- Recommend the best travel mode in recommended_mode based on distance and budget
- For meals, suggest local specialties
- Include realistic prices in {currency}
- Split budget appropriately between travel, stays, and activities
- For attractions, include detailed descriptions and visitor tips
- Never include image URLs - only image_query text
- For each day, calculate and include daily budget estimate
- Include map links using OpenTripMap format
"""

TRAVEL_PROMPT = """
Analyze the travel route between {origin} and {destination} and provide:
1. Straight-line distance in km
2. Recommended travel modes ordered by suitability
3. Estimated duration for each mode
4. Budget considerations
Return in this exact JSON format:
{{
  "distance_km": 250,
  "recommended_modes": [
    {{
      "mode": "train",
      "duration": "4 hours",
      "budget_impact": "medium"
    }},
    {{
      "mode": "flight",
      "duration": "1 hour",
      "budget_impact": "high"
    }}
  ]
}}
"""

async def generate_itinerary(payload: dict) -> dict:
    try:
        # Log the payload
        logger.debug(f"Processing payload: {payload}")
        
        # Get destination coordinates
        dest_lat, dest_lon = await geocode(payload["destination"])
        logger.debug(f"Geocoded coordinates: {dest_lat}, {dest_lon}")
        
        # Build final prompt with all parameters
        full_prompt = PROMPT_TEMPLATE.format(
            origin=payload["origin"],
            destination=payload["destination"],
            travelers=payload["travelers"],
            budget=payload.get("budget", "Medium"),
            travel_style=", ".join(payload["travel_style"]),
            duration=payload["duration"],
            context=payload.get("context", "None"),
            currency=payload.get("currency", "INR")
        )
        logger.debug(f"Generated prompt (first 200 chars): {full_prompt[:200]}...")
        
        # Gemini API Call for itinerary
        async with httpx.AsyncClient(timeout=45) as client:
            logger.debug("Sending request to Gemini API")
            response = await client.post(
                "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent",
                params={"key": settings.GEMINI_API_KEY},
                json={
                    "contents": [{
                        "parts": [{"text": full_prompt}]
                    }],
                    "generationConfig": {
                        "responseMimeType": "application/json",
                        "temperature": 0.3
                    }
                }
            )
            response.raise_for_status()
            logger.debug(f"Got response from Gemini API: status={response.status_code}")
            logger.debug(f"Response text (first 500 chars): {response.text[:500]}...")
            
            response_data = response.json()
            logger.debug(f"Response keys: {list(response_data.keys())}")
            
            if not response_data.get('candidates') or len(response_data['candidates']) == 0:
                logger.error(f"Empty candidates in response: {response_data}")
                raise HTTPException(500, detail="AI service returned empty response")
            
            logger.debug(f"Candidates length: {len(response_data['candidates'])}")
            logger.debug(f"First candidate keys: {list(response_data['candidates'][0].keys())}")
            
            content = response_data['candidates'][0].get('content', {})
            logger.debug(f"Content keys: {list(content.keys()) if content else 'Empty'}")
            
            parts = content.get('parts', [])
            logger.debug(f"Parts length: {len(parts)}")
            
            if not parts:
                raise HTTPException(500, detail="AI response missing parts")
                
            raw_json = parts[0].get('text', '{}')
            logger.debug(f"Raw JSON (first 200 chars): {raw_json[:200]}...")
            
        # Clean and validate JSON
        itinerary = clean_ai_response(raw_json)
        
        # Enhance with real data
        for day in itinerary["days"]:
            for activity in day["activities"]:
                if activity["type"] == "travel":
                    # Get detailed travel analysis from Gemini
                    travel_data = await get_travel_analysis(
                        payload["origin"] if activity["name"].startswith("Travel from") else activity.get("from"),
                        payload["destination"] if activity["name"].endswith(payload["destination"]) else activity.get("to"),
                        payload["budget"]
                    )
                    
                    # Update activity with travel data
                    if "recommended_modes" in travel_data and travel_data["recommended_modes"]:
                        # If we have recommended modes, use the first one
                        recommended_mode = travel_data["recommended_modes"][0]["mode"]
                        modes_for_options = travel_data["recommended_modes"]
                    else:
                        # Fallback if no recommended modes exist
                        recommended_mode = "car"
                        modes_for_options = [{"mode": "car", "duration": "N/A", "budget_impact": "medium"}]
                    
                    activity.update({
                        "distance_km": travel_data.get("distance_km", 0),
                        "recommended_mode": recommended_mode,
                        "options": await build_travel_options(
                            payload["origin"] if activity["name"].startswith("Travel from") else activity.get("from", ""),
                            payload["destination"] if activity["name"].endswith(payload["destination"]) else activity.get("to", ""),
                            modes_for_options,
                            payload["budget"]
                        )
                    })
                
                # Add images and map links for attractions
                if activity["type"] == "attraction" and not activity.get("image"):
                    query = f"{payload['destination']} {activity['name']}"
                    img = await get_wikimedia_image(activity["name"])
                    activity["image"] = img or f"https://via.placeholder.com/800x600.png?text={urllib.parse.quote(query)}"
                    activity["map_link"] = f"https://opentripmap.com/en/card?lat={activity.get('location', {}).get('lat', dest_lat)}&lon={activity.get('location', {}).get('lng', dest_lon)}&zoom=15"
            
            # Add stays and restaurants at end of day
            day["stay_suggestions"] = await scrape_skyscanner_hotels(payload["destination"], payload["budget"])
            day["restaurant_suggestions"] = await scrape_google_restaurants(payload["destination"], payload["budget"])
        
        return {
            "itinerary": itinerary,
            "metadata": {
                "currency": payload.get("currency", "INR"),
                "total_budget": payload.get("budget", "Medium")
            }
        }
        
    except Exception as e:
        logger.error(f"Error generating itinerary: {str(e)}")
        logger.exception("Full traceback:")  # Logs the full traceback
        raise HTTPException(500, detail="Failed to generate itinerary")

async def get_travel_analysis(origin: str, destination: str, budget: str) -> dict:
    """Get detailed travel analysis from Gemini"""
    try:
        logger.debug(f"Getting travel analysis from {origin} to {destination}")
        prompt = TRAVEL_PROMPT.format(
            origin=origin,
            destination=destination,
            budget=budget
        )
        logger.debug(f"Travel prompt: {prompt[:200]}...")
        
        async with httpx.AsyncClient(timeout=30) as client:
            logger.debug("Sending travel analysis request to Gemini API")
            response = await client.post(
                "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent",
                params={"key": settings.GEMINI_API_KEY},
                json={
                    "contents": [{
                        "parts": [{"text": prompt}]
                    }],
                    "generationConfig": {
                        "responseMimeType": "application/json",
                        "temperature": 0.1  # More deterministic for factual data
                    }
                }
            )
            response.raise_for_status()
            logger.debug(f"Got travel analysis response: status={response.status_code}")
            logger.debug(f"Travel analysis response text: {response.text}")
            
            response_data = response.json()
            logger.debug(f"Travel analysis response keys: {list(response_data.keys())}")
            
            if not response_data.get('candidates') or len(response_data['candidates']) == 0:
                logger.error(f"Empty candidates in travel analysis response: {response_data}")
                raise HTTPException(500, detail="AI service returned empty response for travel analysis")
            
            logger.debug(f"Travel analysis candidates length: {len(response_data['candidates'])}")
            logger.debug(f"First travel candidate keys: {list(response_data['candidates'][0].keys())}")
            
            content = response_data['candidates'][0].get('content', {})
            logger.debug(f"Travel analysis content keys: {list(content.keys()) if content else 'Empty'}")
            
            parts = content.get('parts', [])
            logger.debug(f"Travel analysis parts length: {len(parts)}")
            
            if not parts:
                raise HTTPException(500, detail="AI response missing parts in travel analysis")
                
            raw_json = parts[0].get('text', '{}')
            logger.debug(f"Raw travel JSON: {raw_json}")
            
            return clean_ai_response(raw_json)
    except Exception as e:
        logger.error(f"Travel analysis failed: {str(e)}")
        logger.exception("Full traceback for travel analysis:")
        return {
            "distance_km": 0,
            "recommended_modes": [{
                "mode": "car",
                "duration": "N/A",
                "budget_impact": "medium"
            }]
        }
        
async def build_travel_options(origin: str, destination: str, modes: list, budget: str) -> list:
    """Build travel options based on Gemini's recommendations"""
    options = []
    
    for mode in modes:
        if mode["mode"] == "flight":
            options.extend(await scrape_google_flights(origin, destination))
        elif mode["mode"] == "train":
            options.extend(await scrape_google_trains(origin, destination))
        else:
            # For other modes, create informational cards
            options.append({
                "mode": mode["mode"],
                "title": f"{mode['mode'].title()} from {origin} to {destination}",
                "description": f"Estimated duration: {mode['duration']}. Budget impact: {mode['budget_impact']}",
                "price_range": "High" if mode["budget_impact"] == "high" else "Medium" if mode["budget_impact"] == "medium" else "Low",
                "link": "",
                "image": f"https://via.placeholder.com/200?text={get_travel_emoji(mode['mode'])}"
            })
    
    return options

def get_travel_emoji(mode: str) -> str:
    """Get emoji for travel mode"""
    return {
        "flight": "✈️",
        "train": "🚆",
        "bus": "🚌",
        "car": "🚗",
        "taxi": "🚖",
        "walk": "🚶"
    }.get(mode.lower(), "✈️")


def clean_ai_response(raw_json: str) -> dict:
    """Industrial-strength JSON cleaner with multiple fallbacks"""
    clean = ""  # Define clean outside try block for error logging
    try:
        logger.debug(f"Cleaning raw JSON (first 100 chars): {raw_json[:100]}...")
        
        # Fix time format issues
        raw_json = re.sub(r'"(\d+)"\s*:\s*(\d+\s*[AP]M)', r'\1:\2', raw_json)
        logger.debug("Applied time format fix")
        
        # Attempt 1: Direct parse
        try:
            logger.debug("Attempting direct JSON parse")
            return json.loads(raw_json)
        except json.JSONDecodeError as e:
            logger.debug(f"Direct parse failed: {str(e)}")
        
        # Attempt 2: Remove markdown code blocks
        logger.debug("Removing markdown code blocks")
        clean = re.sub(r'```json|```', '', raw_json)
        try:
            return json.loads(clean)
        except json.JSONDecodeError as e:
            logger.debug(f"Markdown cleanup failed: {str(e)}")
        
        # Log more detailed info for debugging
        logger.debug(f"JSON after markdown cleanup (first 200 chars): {clean[:200]}...")

        # Attempt 3: Fix common syntax errors
        fixes = [
            (r'(?<=\W)\'(?=\W)', '"'),  # Replace standalone single quotes
            (r'(?<!\\)"', "'"),         # Replace unescaped double quotes
            (r',\s*(?=}|])', ''),       # Remove trailing commas
            (r'(\w+):', r'"\1":'),      # Quote unquoted keys
            (r'\\x([0-9a-fA-F]{2})', lambda m: chr(int(m.group(1), 16)))  # Fix hex escapes
        ]
        
        for pattern, replacement in fixes:
            clean = re.sub(pattern, replacement, clean)

        # Attempt 4: Find largest valid JSON substring
        max_attempts = [
            r'\{.*\}',        # Greedy match
            r'\{[\s\S]*?\}'   # Non-greedy match
        ]
        
        for pattern in max_attempts:
            match = re.search(pattern, clean, re.DOTALL)
            if match:
                try:
                    return json.loads(match.group(0))
                except json.JSONDecodeError:
                    continue

        # Final attempt: Manual structure repair
        lines = []
        brace_count = 0
        for line in clean.splitlines():
            line = line.strip()
            if not line:
                continue
            brace_count += line.count('{') - line.count('}')
            lines.append(line)
            if brace_count == 0:
                break
                
        repaired = '\n'.join(lines)
        return json.loads(repaired)

    except Exception as e:
        logger.error(f"JSON Clean Failed: {str(e)}\nPartial Response: {clean[:2000]}")
        raise HTTPException(500, detail="Failed to process AI response")