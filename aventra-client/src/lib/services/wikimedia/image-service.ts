/**
 * Service to fetch destination images from Wikimedia Commons API
 */
"use server"
interface WikimediaResponse {
  query: {
    pages: Record<string, {
      title: string;
      imageinfo?: Array<{
        url: string;
      }>;
    }>;
  };
}

/**
 * Fetches destination images from Wikimedia Commons
 * 
 * @param destination - The location to find images for
 * @param count - Number of images to return
 * @returns Array of image URLs
 */
export async function getWikimediaImages(
  destination: string,
  count: number = 1
): Promise<string[]> {
  const searchQuery = `${destination} travel landmark`;
  
  // Wikimedia API endpoint to search for images related to the destination
  const apiUrl = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrnamespace=6&gsrsearch=${encodeURIComponent(searchQuery)}&gsrlimit=${count}&prop=imageinfo&iiprop=url&format=json&origin=*`;
  
  try {
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      throw new Error(`Wikimedia API error: ${response.status}`);
    }
    
    const data = await response.json() as WikimediaResponse;
    
    // Extract image URLs from response
    if (data.query && data.query.pages) {
      const images: string[] = [];
      
      Object.values(data.query.pages).forEach(page => {
        if (page.imageinfo && page.imageinfo.length > 0) {
          images.push(page.imageinfo[0].url);
        }
      });
      
      return images.slice(0, count);
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching Wikimedia images:', error);
    return [];
  }
}