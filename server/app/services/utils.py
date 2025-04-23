import httpx
import urllib.parse
import logging
from tenacity import retry, wait_exponential, stop_after_attempt, retry_if_exception_type
from app.core.config import settings

logger = logging.getLogger(__name__)

# Common retry policy for all APIs
API_RETRY = retry(
    wait=wait_exponential(multiplier=1, min=2, max=10),
    stop=stop_after_attempt(3),
    retry=retry_if_exception_type(
        (httpx.NetworkError, httpx.TimeoutException, httpx.HTTPStatusError)
    ),
    reraise=True
)

async def geocode(location: str) -> tuple[float, float]:
    """Get coordinates with retries and timeout"""
    @API_RETRY
    async def _fetch():
        async with httpx.AsyncClient(timeout=httpx.Timeout(15.0)) as client:
            response = await client.get(
                "https://api.opentripmap.com/0.1/en/places/geoname",
                params={"name": location, "apikey": settings.OPENTRIPMAP_API_KEY}
            )
            response.raise_for_status()
            return response.json()
    
    try:
        data = await _fetch()
        return (float(data["lat"]), float(data["lon"]))
    except Exception as e:
        logger.error(f"Geocoding failed for {location}: {str(e)}")
        raise

async def get_wikimedia_image(query: str) -> str:
    """Get images with error handling"""
    @API_RETRY
    async def _fetch():
        async with httpx.AsyncClient(timeout=httpx.Timeout(15.0)) as client:
            return await client.get(
                "https://en.wikipedia.org/w/api.php",
                params={
                    "action": "query",
                    "titles": query,
                    "prop": "pageimages",
                    "pithumbsize": 800,
                    "format": "json"
                }
            )
    
    try:
        response = await _fetch()
        response.raise_for_status()
        page = next(iter(response.json()["query"]["pages"].values()))
        return page.get("thumbnail", {}).get("source", "")
    except Exception:
        return ""

def build_transport_links(origin: str, dest: str) -> dict:
    """Transport links remain unchanged"""
    return {
        "flights": f"https://www.google.com/travel/flights?q={urllib.parse.quote(origin)}+to+{urllib.parse.quote(dest)}",
        "trains": f"https://www.thetrainline.com/search/{urllib.parse.quote(origin)}/{urllib.parse.quote(dest)}",
        "buses": f"https://www.flixbus.com/route/{urllib.parse.quote(origin)}/{urllib.parse.quote(dest)}",
        "rentals": f"https://www.rentalcars.com/search/?locationName={urllib.parse.quote(dest)}"
    }

async def get_restaurants(lat: float, lon: float) -> list:
    """Get restaurants with robust error handling"""
    @API_RETRY
    async def _fetch():
        async with httpx.AsyncClient(timeout=httpx.Timeout(20.0)) as client:
            overpass_query = f"""
            [out:json];
            node["amenity"="restaurant"](around:2000,{lat},{lon});
            out body;
            """
            return await client.post(
                "https://overpass-api.de/api/interpreter",
                content=overpass_query
            )
    
    try:
        response = await _fetch()
        response.raise_for_status()
        elements = response.json().get("elements", [])[:3]
        return [
            {
                "name": node["tags"].get("name", "Local Restaurant"),
                "osm_link": f"https://www.openstreetmap.org/node/{node['id']}",
                "cuisine": node["tags"].get("cuisine", "Local")
            } for node in elements
        ]
    except Exception as e:
        logger.error(f"Restaurant fetch failed: {str(e)}")
        return []

async def get_hotels(lat: float, lon: float) -> list:
    """Hotel search with retries"""
    @API_RETRY
    async def _fetch():
        async with httpx.AsyncClient(timeout=httpx.Timeout(15.0)) as client:
            response = await client.get(
                "https://api.opentripmap.com/0.1/en/places/radius",
                params={
                    "lat": lat,
                    "lon": lon,
                    "radius": 5000,
                    "kinds": "accomodations",
                    "apikey": settings.OPENTRIPMAP_API_KEY
                }
            )
            response.raise_for_status()
            return response.json()
    
    try:
        data = await _fetch()
        return [
            {
                "name": place["properties"].get("name", "Local Hotel"),
                "booking_link": f"https://www.booking.com/searchresults.en.html?ss={urllib.parse.quote(place['properties'].get('name', ''))}"
            } for place in data.get("features", [])[:3]
        ]
    except Exception as e:
        logger.error(f"Hotel fetch failed: {str(e)}")
        return []

async def get_activities(lat: float, lon: float) -> list:
    """Activity search with enhanced reliability"""
    @API_RETRY
    async def _fetch():
        async with httpx.AsyncClient(timeout=httpx.Timeout(15.0)) as client:
            response = await client.get(
                "https://api.opentripmap.com/0.1/en/places/radius",
                params={
                    "lat": lat,
                    "lon": lon,
                    "radius": 5000,
                    "kinds": "interesting_places",
                    "apikey": settings.OPENTRIPMAP_API_KEY
                }
            )
            response.raise_for_status()
            return response.json()
    
    try:
        data = await _fetch()
        return [
            {
                "name": place["properties"].get("name", "Local Activity"),
                "booking_link": f"https://www.getyourguide.com/-/t{place['properties']['xid']}" if place["properties"].get("xid") else "",
                "image": f"https://source.unsplash.com/featured/?{urllib.parse.quote(place['properties'].get('name','activity'))}"
            } for place in data.get("features", [])[:3]
        ]
    except Exception as e:
        logger.error(f"Activity fetch failed: {str(e)}")
        return []

async def get_openverse_image(query: str) -> str:
    """
    Fetch the first CC‑licensed/public‑domain image URL from the public Openverse API.
    Returns empty string on failure or no results.
    """
    url = "https://api.openverse.org/v1/images/"
    params = {
        "q": query,
        "format": "json",
        "page_size": 1
    }
    try:
        async with httpx.AsyncClient(timeout=httpx.Timeout(15.0)) as client:
            resp = await client.get(url, params=params)
            resp.raise_for_status()
            data = resp.json()
            results = data.get("results", [])
            if results:
                # Prefer the real image URL; fallback to thumbnail if needed
                return results[0].get("url") or results[0].get("thumbnail", "")
    except Exception as e:
        logger.warning(f"Openverse lookup failed for '{query}': {e}")
    return ""

async def get_flickr_image(query: str) -> str:
    """Fallback to Flickr public feed when other image sources fail"""
    try:
        async with httpx.AsyncClient(timeout=15.0) as client:
            response = await client.get(
                "https://www.flickr.com/services/feeds/photos_public.gne",
                params={
                    "tags": query,
                    "format": "json",
                    "nojsoncallback": "1"
                }
            )
            response.raise_for_status()
            data = response.json()
            if data.get("items"):
                return data["items"][0]["media"]["m"]  # Returns medium-sized image URL
    except Exception as e:
        logger.warning(f"Flickr lookup failed for '{query}': {e}")
    return ""