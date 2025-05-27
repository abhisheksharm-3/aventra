"use client";

import React, { useEffect, useRef } from "react";
import { Map as MapIcon, Mountain, Maximize2, ArrowUpRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface JourneyMapProps {
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
  className?: string;
}

const JourneyMap: React.FC<JourneyMapProps> = ({ journeyPath, className = "" }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Draw the elevation profile chart
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const elevationData = journeyPath.elevation_profile;
    if (!elevationData || elevationData.length === 0) return;

    // Canvas setup
    const padding = 20;
    const width = canvas.width - padding * 2;
    const height = canvas.height - padding * 2;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Find min and max elevation
    const elevations = elevationData.map(p => p.elevation);
    const minElevation = Math.min(...elevations);
    const maxElevation = Math.max(...elevations);
    const elevationRange = Math.max(maxElevation - minElevation, 1); // Avoid division by zero

    // Find max distance
    const maxDistance = elevationData[elevationData.length - 1]?.distance || 0;

    // Draw axes
    ctx.strokeStyle = '#cbd5e1'; // slate-300
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, height + padding);
    ctx.lineTo(width + padding, height + padding);
    ctx.stroke();

    // Draw elevation profile
    if (elevationData.length > 0) {
      ctx.beginPath();
      ctx.moveTo(
        padding + (elevationData[0].distance / maxDistance) * width,
        padding + height - ((elevationData[0].elevation - minElevation) / elevationRange) * height
      );

      for (let i = 1; i < elevationData.length; i++) {
        const point = elevationData[i];
        const x = padding + (point.distance / maxDistance) * width;
        const y = padding + height - ((point.elevation - minElevation) / elevationRange) * height;
        ctx.lineTo(x, y);
      }

      // Add bottom line to close the path
      const lastPoint = elevationData[elevationData.length - 1];
      const lastX = padding + (lastPoint.distance / maxDistance) * width;
      ctx.lineTo(lastX, height + padding);
      ctx.lineTo(padding, height + padding);
      
      // Fill with gradient
      const gradient = ctx.createLinearGradient(0, padding, 0, height + padding);
      gradient.addColorStop(0, 'rgba(125, 211, 252, 0.5)'); // sky-300 with opacity
      gradient.addColorStop(1, 'rgba(224, 242, 254, 0.2)'); // sky-50 with opacity
      ctx.fillStyle = gradient;
      ctx.fill();

      // Draw the line on top
      ctx.strokeStyle = 'rgb(14, 165, 233)'; // sky-500
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(
        padding + (elevationData[0].distance / maxDistance) * width,
        padding + height - ((elevationData[0].elevation - minElevation) / elevationRange) * height
      );

      for (let i = 1; i < elevationData.length; i++) {
        const point = elevationData[i];
        const x = padding + (point.distance / maxDistance) * width;
        const y = padding + height - ((point.elevation - minElevation) / elevationRange) * height;
        ctx.lineTo(x, y);
      }
      ctx.stroke();
    }

    // Draw labels
    ctx.font = '10px system-ui, sans-serif';
    ctx.fillStyle = '#64748b'; // slate-500
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    
    // Y-axis labels (elevation)
    ctx.fillText(`${Math.round(minElevation)}m`, padding - 4, height + padding);
    ctx.fillText(`${Math.round(maxElevation)}m`, padding - 4, padding);
    
    // X-axis labels (distance)
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText('0 km', padding, height + padding + 4);
    ctx.textAlign = 'right';
    ctx.fillText(`${Math.round(maxDistance)} km`, width + padding, height + padding + 4);
    
    // Mark highest point
    const highestPoint = elevationData.reduce((prev, current) => 
      (prev.elevation > current.elevation) ? prev : current);
    
    const highX = padding + (highestPoint.distance / maxDistance) * width;
    const highY = padding + height - ((highestPoint.elevation - minElevation) / elevationRange) * height;
    
    ctx.fillStyle = '#ef4444'; // red-500
    ctx.beginPath();
    ctx.arc(highX, highY, 4, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = '#ef4444'; // red-500
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    ctx.fillText(`Peak: ${Math.round(highestPoint.elevation)}m`, highX, highY - 5);
  }, [journeyPath.elevation_profile]);

  // Calculate map center for display
  const getMapCenter = () => {
    const points = journeyPath.overview;
    if (!points || points.length === 0) return { lat: 0, lng: 0 };
    
    const lat = points.reduce((sum, point) => sum + point.lat, 0) / points.length;
    const lng = points.reduce((sum, point) => sum + point.lng, 0) / points.length;
    
    return { lat, lng };
  };

  // Get elevation stats
  const getElevationStats = () => {
    const data = journeyPath.elevation_profile;
    if (!data || data.length === 0) return { min: 0, max: 0, start: 0, end: 0 };
    
    const elevations = data.map(p => p.elevation);
    return {
      min: Math.min(...elevations),
      max: Math.max(...elevations),
      start: data[0].elevation,
      end: data[data.length - 1].elevation,
    };
  };

  const elevationStats = getElevationStats();
  const mapCenter = getMapCenter();

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Map Section */}
      <Card className="overflow-hidden border-primary/10 shadow-sm">
        <div className="p-3 border-b bg-muted/30 flex justify-between items-center">
          <div className="flex items-center gap-1.5">
            <MapIcon className="h-4 w-4 text-primary" />
            <h3 className="text-base font-medium">Journey Map</h3>
          </div>
          <div className="flex items-center gap-1.5">
            <Badge variant="outline" className="text-xs">
              {journeyPath.distance_km.toFixed(1)} km total
            </Badge>
            <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
              <Maximize2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
        
        <div className="relative">
          <div ref={mapRef} className="aspect-[16/9] bg-muted/30">
            {/* This would be replaced with actual map implementation */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center max-w-md p-4">
                <MapIcon className="mx-auto h-12 w-12 text-primary/50 mb-3" />
                <p className="text-muted-foreground mb-2">
                  Interactive map with journey route visualization
                </p>
                <p className="text-xs text-muted-foreground">
                  Map center: {mapCenter.lat.toFixed(4)}, {mapCenter.lng.toFixed(4)}
                </p>
              </div>
            </div>
            
            {/* Demo route visualization */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="xMidYMid meet" viewBox="0 0 100 100">
              <path 
                d="M20,80 Q30,50 50,60 T80,40" 
                fill="none" 
                stroke="var(--primary)" 
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray="1,0"
              />
              {/* Start point */}
              <circle cx="20" cy="80" r="3" fill="var(--primary)" />
              {/* End point */}
              <circle cx="80" cy="40" r="3" fill="var(--destructive)" />
              {/* Points along the way */}
              <circle cx="35" cy="55" r="2" fill="var(--primary)" opacity="0.7" />
              <circle cx="50" cy="60" r="2" fill="var(--primary)" opacity="0.7" />
              <circle cx="65" cy="50" r="2" fill="var(--primary)" opacity="0.7" />
            </svg>
          </div>
          
          {/* Map Legend */}
          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-md shadow-sm p-2 border">
            <div className="text-xs font-medium mb-1">Legend</div>
            <div className="flex items-center gap-1.5 text-xs">
              <div className="h-2.5 w-2.5 bg-primary rounded-full"></div>
              <span>Route Path</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs mt-1">
              <div className="h-2.5 w-2.5 bg-destructive rounded-full"></div>
              <span>Destination</span>
            </div>
          </div>
          
          {/* View on Google Maps button */}
          <div className="absolute bottom-3 right-3">
            <Button size="sm" variant="secondary" className="gap-1.5 text-xs shadow-sm">
              <ArrowUpRight className="h-3 w-3" />
              View on Google Maps
            </Button>
          </div>
        </div>
      </Card>

      {/* Elevation Profile */}
      <Card className="border-primary/10 shadow-sm overflow-hidden">
        <div className="p-3 border-b bg-muted/30 flex justify-between items-center">
          <div className="flex items-center gap-1.5">
            <Mountain className="h-4 w-4 text-primary" />
            <h3 className="text-base font-medium">Elevation Profile</h3>
          </div>
          <Badge variant="outline" className="text-xs">
            {elevationStats.max - elevationStats.min}m gain
          </Badge>
        </div>
        
        <CardContent className="p-4">
          <div className="mb-1">
            <canvas ref={canvasRef} width={600} height={150} className="w-full h-auto" />
          </div>
          
          <div className="flex justify-between text-xs text-muted-foreground mt-3">
            <div className="flex flex-col items-start">
              <span className="font-medium">Starting Elevation</span>
              <span>{Math.round(elevationStats.start)}m</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="font-medium">Total Distance</span>
              <span>{journeyPath.distance_km.toFixed(1)} km</span>
            </div>
            <div className="flex flex-col items-end">
              <span className="font-medium">Final Elevation</span>
              <span>{Math.round(elevationStats.end)}m</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default JourneyMap;