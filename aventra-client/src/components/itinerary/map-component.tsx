"use client";

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Define the props for the Map component
interface MapComponentProps {
  journeyPath: {
    overview: Array<{
      lat: number;
      lng: number;
    }>;
    distance_km: number;
    elevation_profile: Array<{
      distance: number;
      elevation: number;
    }>;
  };
  mapType: 'streets' | 'satellite' | 'terrain';
  onPointClick: (index: number) => void;
  activePoint: number | null;
}

// Define map tile sources
const mapTileSources = {
  streets: {
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  },
  satellite: {
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
  },
  terrain: {
    url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a>'
  }
};

const MapComponent = ({ journeyPath, mapType, onPointClick, activePoint }: MapComponentProps) => {
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const routeLayerRef = useRef<L.Polyline | null>(null);
  
  // Custom icons for markers
  const createCustomIcon = (iconUrl: string, iconSize: [number, number]) => {
    return L.icon({
      iconUrl,
      iconSize,
      iconAnchor: [iconSize[0] / 2, iconSize[1]],
      popupAnchor: [0, -iconSize[1]]
    });
  };

  useEffect(() => {
    // Create custom marker icons
    const startIcon = createCustomIcon(
      'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzNiIgaGVpZ2h0PSI0OCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgY2xhc3M9Imx1Y2lkZSBsdWNpZGUtbWFwLXBpbiI+PHBhdGggZD0iTTIwIDEwYzAgNC40LTggMTItOCAxMnMtOC03LjYtOC0xMmE4IDggMCAwIDEgMTYgMFoiIGZpbGw9IiMyMmM1NWUiLz48Y2lyY2xlIGN4PSIxMiIgY3k9IjEwIiByPSIzIiBmaWxsPSJ3aGl0ZSIvPjwvc3ZnPg==',
      [30, 40]
    );
    
    const endIcon = createCustomIcon(
      'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzNiIgaGVpZ2h0PSI0OCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgY2xhc3M9Imx1Y2lkZSBsdWNpZGUtbWFwLXBpbiI+PHBhdGggZD0iTTIwIDEwYzAgNC40LTggMTItOCAxMnMtOC03LjYtOC0xMmE4IDggMCAwIDEgMTYgMFoiIGZpbGw9IiNlZjQ0NDQiLz48Y2lyY2xlIGN4PSIxMiIgY3k9IjEwIiByPSIzIiBmaWxsPSJ3aGl0ZSIvPjwvc3ZnPg==',
      [30, 40]
    );
    
    const wayPointIcon = createCustomIcon(
      'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgY2xhc3M9Imx1Y2lkZSBsdWNpZGUtbWFwLXBpbiI+PHBhdGggZD0iTTIwIDEwYzAgNC40LTggMTItOCAxMnMtOC03LjYtOC0xMmE4IDggMCAwIDEgMTYgMFoiIGZpbGw9IiMzYjgyZjYiLz48Y2lyY2xlIGN4PSIxMiIgY3k9IjEwIiByPSIzIiBmaWxsPSJ3aGl0ZSIvPjwvc3ZnPg==',
      [24, 32]
    );
    
    const activePointIcon = createCustomIcon(
      'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgY2xhc3M9Imx1Y2lkZSBsdWNpZGUtbWFwLXBpbiI+PHBhdGggZD0iTTIwIDEwYzAgNC40LTggMTItOCAxMnMtOC03LjYtOC0xMmE4IDggMCAwIDEgMTYgMFoiIGZpbGw9IiNmOTczMTYiLz48Y2lyY2xlIGN4PSIxMiIgY3k9IjEwIiByPSIzIiBmaWxsPSJ3aGl0ZSIvPjwvc3ZnPg==',
      [28, 36]
    );
    
    // Check if we have valid data to display
    const hasValidRoutePoints = journeyPath.overview && 
      journeyPath.overview.length > 0 && 
      journeyPath.overview.every(p => 
        typeof p.lat === 'number' && 
        typeof p.lng === 'number' && 
        !isNaN(p.lat) && 
        !isNaN(p.lng)
      );

    if (!hasValidRoutePoints) {
      return; // Don't proceed if no valid points
    }
    
    // If the map instance doesn't exist, create it
    if (!mapRef.current) {
      mapRef.current = L.map('map', {
        center: [journeyPath.overview[0].lat, journeyPath.overview[0].lng], 
        zoom: 12,
        layers: [
          L.tileLayer(mapTileSources[mapType].url, { 
            attribution: mapTileSources[mapType].attribution,
            maxZoom: 18
          })
        ]
      });
      
      // Create the route
      routeLayerRef.current = L.polyline(
        journeyPath.overview.map(point => [point.lat, point.lng]), 
        { 
          color: '#3b82f6', 
          weight: 5,
          opacity: 0.8,
          lineJoin: 'round',
          lineCap: 'round'
        }
      ).addTo(mapRef.current);
      
      // Add markers for each point
      journeyPath.overview.forEach((point, index) => {
        let icon;
        if (index === 0) {
          icon = startIcon;
        } else if (index === journeyPath.overview.length - 1) {
          icon = endIcon;
        } else {
          icon = wayPointIcon;
        }
        
        const marker = L.marker([point.lat, point.lng], { icon })
          .addTo(mapRef.current!)
          .bindPopup(`Point ${index + 1}`)
          .on('click', () => {
            onPointClick(index);
          });
        
        markersRef.current.push(marker);
      });
      
      // Fit the map to the route bounds
      const bounds = routeLayerRef.current.getBounds();
      mapRef.current.fitBounds(bounds, { padding: [50, 50] });
    } else {
      
      L.tileLayer(mapTileSources[mapType].url, { 
        attribution: mapTileSources[mapType].attribution,
        maxZoom: 18
      }).addTo(mapRef.current);
    }
    
    // Update active point if needed
    if (activePoint !== null && activePoint >= 0 && activePoint < markersRef.current.length) {
      const marker = markersRef.current[activePoint];
      marker.setIcon(activePointIcon);
      marker.openPopup();
      
      // Reset all other markers
      markersRef.current.forEach((m, i) => {
        if (i !== activePoint) {
          if (i === 0) {
            m.setIcon(startIcon);
          } else if (i === journeyPath.overview.length - 1) {
            m.setIcon(endIcon);
          } else {
            m.setIcon(wayPointIcon);
          }
        }
      });
    }
    
    // Cleanup function
    return () => {
      if (mapRef.current) {
        markersRef.current = [];
        routeLayerRef.current = null;
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [journeyPath, mapType, activePoint, onPointClick]);

  return <div id="map" className='z-0' style={{ width: '100%', height: '100%' }}></div>;
};

export default MapComponent;