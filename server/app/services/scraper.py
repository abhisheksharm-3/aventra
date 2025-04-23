# app/services/scraper.py
import httpx
from bs4 import BeautifulSoup
import urllib.parse
import json
from tenacity import retry, wait_exponential, stop_after_attempt
from app.core.logger import logger
from datetime import datetime, timedelta

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
}

@retry(wait=wait_exponential(multiplier=1, min=2, max=10), stop=stop_after_attempt(3))
async def scrape_skyscanner_hotels(destination: str, budget: str) -> list:
    """Scrape top 5 hotels from Skyscanner with budget filtering"""
    try:
        query = urllib.parse.quote(destination)
        current_date = datetime.now().strftime("%Y-%m-%d")
        next_date = (datetime.now() + timedelta(days=7)).strftime("%Y-%m-%d")
        
        # Convert budget to price class for Skyscanner
        price_class = "1" if budget.lower() == "low" else "2" if budget.lower() == "medium" else "3"
        
        url = f"https://www.skyscanner.com/hotels/search?destination={query}&checkin={current_date}&checkout={next_date}&adults=2&priceFilter={price_class}"
        
        async with httpx.AsyncClient(headers=HEADERS, timeout=20) as client:
            resp = await client.get(url)
            soup = BeautifulSoup(resp.text, "html.parser")
            
            results = []
            # Extract hotel information
            for card in soup.select(".HotelCardWrapper")[:5]:
                name = card.select_one(".HotelCardName")
                price = card.select_one(".HotelCardPrice")
                img = card.select_one("img")
                rating = card.select_one(".HotelRating")
                desc = card.select_one(".HotelCardDescription")
                
                # Build the specific hotel URL if possible
                hotel_id = card.get("data-hotel-id", "")
                hotel_url = f"https://www.skyscanner.com/hotels/hotel/{hotel_id}?destination={query}" if hotel_id else url
                
                results.append({
                    "name": name.text.strip() if name else f"Hotel in {destination}",
                    "image": img["src"] if img and "src" in img.attrs else f"https://source.unsplash.com/300x200/?hotel,{urllib.parse.quote(destination)}",
                    "price_range": price.text.strip() if price else f"{budget.title()} Budget",
                    "link": hotel_url,
                    "description": desc.text.strip()[:200] + "..." if desc else f"Hotel accommodation in {destination}",
                    "rating": rating.text.strip() if rating else "N/A"
                })
            
            # If no results were found, create placeholder entries
            if not results:
                for i in range(3):
                    results.append({
                        "name": f"{destination} {['Budget', 'Comfort', 'Luxury'][i]} Hotel",
                        "image": f"https://source.unsplash.com/300x200/?hotel,{urllib.parse.quote(destination)}",
                        "price_range": f"{budget.title()} Budget",
                        "link": url,
                        "description": f"Hotel accommodation in {destination}",
                        "rating": "N/A"
                    })
                    
            return results
    except Exception as e:
        logger.error(f"Skyscanner hotels scrape failed: {str(e)}")
        # Return fallback results
        return [
            {
                "name": f"{destination} {['Budget', 'Standard', 'Premium'][i]} Hotel",
                "image": f"https://source.unsplash.com/300x200/?hotel,{urllib.parse.quote(destination)}",
                "price_range": f"{budget.title()} Budget",
                "link": f"https://www.skyscanner.com/hotels/search?destination={query}",
                "description": f"Hotel accommodation in {destination}",
                "rating": "N/A"
            } for i in range(3)
        ]

@retry(wait=wait_exponential(multiplier=1, min=2, max=10), stop=stop_after_attempt(3))
async def scrape_google_restaurants(destination: str, budget: str) -> list:
    """Scrape top 5 restaurants from Google Maps with budget filtering"""
    try:
        price_level = "$" if budget.lower() == "low" else "$$" if budget.lower() == "medium" else "$$$"
        query = urllib.parse.quote(f"restaurants in {destination} {price_level}")
        url = f"https://www.google.com/maps/search/{query}"
        
        async with httpx.AsyncClient(headers=HEADERS, timeout=20) as client:
            resp = await client.get(url)
            soup = BeautifulSoup(resp.text, "html.parser")
            
            results = []
            # Extract restaurant information
            for card in soup.select(".section-result")[:5]:
                name = card.select_one(".section-result-title")
                rating = card.select_one(".section-result-rating")
                price = card.select_one(".section-result-price")
                details = card.select_one(".section-result-details")
                
                # Extract link
                link_elem = card.select_one("a")
                link = "https://www.google.com" + link_elem["href"] if link_elem and "href" in link_elem.attrs else url
                
                results.append({
                    "name": name.text.strip() if name else f"Restaurant in {destination}",
                    "rating": rating.text.strip() if rating else "N/A",
                    "price_range": price.text.strip() if price else price_level,
                    "cuisine": details.text.strip() if details else "Local",
                    "link": link,
                    "image": f"https://source.unsplash.com/400x300/?restaurant,{urllib.parse.quote(destination)}"
                })
            
            # If no results were found, create placeholder entries
            if not results:
                cuisines = ["Local", "International", "Traditional", "Popular", "Specialty"]
                for i in range(min(5, len(cuisines))):
                    results.append({
                        "name": f"{cuisines[i]} Restaurant in {destination}",
                        "rating": "4.0+",
                        "price_range": price_level,
                        "cuisine": cuisines[i],
                        "link": url,
                        "image": f"https://source.unsplash.com/400x300/?restaurant,{urllib.parse.quote(destination+' '+cuisines[i])}"
                    })
                    
            return results
    except Exception as e:
        logger.error(f"Google restaurants scrape failed: {str(e)}")
        # Return fallback results
        cuisines = ["Local", "International", "Traditional", "Popular", "Specialty"]
        return [
            {
                "name": f"{cuisines[i]} Restaurant in {destination}",
                "rating": "4.0+",
                "price_range": price_level,
                "cuisine": cuisines[i],
                "link": url,
                "image": f"https://source.unsplash.com/400x300/?restaurant,{urllib.parse.quote(destination+' '+cuisines[i])}"
            } for i in range(min(5, len(cuisines)))
        ]

@retry(wait=wait_exponential(multiplier=1, min=2, max=10), stop=stop_after_attempt(3))
async def scrape_google_flights(origin: str, destination: str) -> list:
    """Get flight options with prices from Google Flights"""
    try:
        query = urllib.parse.quote(f"{origin} to {destination}")
        url = f"https://www.google.com/travel/flights?q={query}"
        
        async with httpx.AsyncClient(headers=HEADERS, timeout=20) as client:
            resp = await client.get(url)
            soup = BeautifulSoup(resp.text, "html.parser")
            
            results = []
            # Extract flight options
            for card in soup.select(".gws-flights-results__result")[:3]:
                airline = card.select_one(".gws-flights-results__carriers")
                price = card.select_one(".gws-flights-results__price")
                duration = card.select_one(".gws-flights-results__duration")
                
                results.append({
                    "mode": "flight",
                    "title": f"{airline.text if airline else 'Flight'} from {origin} to {destination}",
                    "description": f"Duration: {duration.text if duration else 'varies'}",
                    "price_range": price.text if price else "Varies",
                    "link": url,
                    "image": "https://via.placeholder.com/200?text=✈️"
                })
            
            # If no results found, provide a default option
            if not results:
                results.append({
                    "mode": "flight",
                    "title": f"Flight from {origin} to {destination}",
                    "description": "Check Google Flights for best options",
                    "price_range": "Varies",
                    "link": url,
                    "image": "https://via.placeholder.com/200?text=✈️"
                })
                
            return results
    except Exception as e:
        logger.error(f"Google flights scrape failed: {str(e)}")
        return [{
            "mode": "flight",
            "title": f"Flight from {origin} to {destination}",
            "description": "Check Google Flights for best options",
            "price_range": "Varies",
            "link": url,
            "image": "https://via.placeholder.com/200?text=✈️"
        }]

@retry(wait=wait_exponential(multiplier=1, min=2, max=10), stop=stop_after_attempt(3))
async def scrape_google_trains(origin: str, destination: str) -> list:
    """Get train options with more details from Google Maps"""
    try:
        query = urllib.parse.quote(f"{origin} to {destination}")
        url = f"https://www.google.com/maps/dir/{query}/data=!4m2!4m1!3e3"  # 3e3 is for transit mode
        
        async with httpx.AsyncClient(headers=HEADERS, timeout=20) as client:
            resp = await client.get(url)
            soup = BeautifulSoup(resp.text, "html.parser")
            
            results = []
            # Extract train options from transit results
            for card in soup.select(".section-directions-trip-option")[:3]:
                duration = card.select_one(".section-directions-trip-duration")
                details = card.select_one(".section-directions-trip-description")
                
                results.append({
                    "mode": "train",
                    "title": f"Train from {origin} to {destination}",
                    "description": f"Duration: {duration.text if duration else 'varies'} - {details.text if details else 'Check schedule'}",
                    "price_range": "Varies",
                    "link": url,
                    "image": "https://via.placeholder.com/200?text=🚆"
                })
            
            # If no results found, provide a default option
            if not results:
                results.append({
                    "mode": "train",
                    "title": f"Train from {origin} to {destination}",
                    "description": "Check schedules for best train options",
                    "price_range": "Varies",
                    "link": url,
                    "image": "https://via.placeholder.com/200?text=🚆"
                })
                
            return results
    except Exception as e:
        logger.error(f"Google trains scrape failed: {str(e)}")
        return [{
            "mode": "train",
            "title": f"Train from {origin} to {destination}",
            "description": "Check train schedules for best options",
            "price_range": "Varies",
            "link": url,
            "image": "https://via.placeholder.com/200?text=🚆"
        }]