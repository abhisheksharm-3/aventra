"use client";

import React, { useEffect, useRef, useState } from "react";
import { Map as MapIcon, Mountain, Maximize2, Minimize2, Layers } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
// Import Leaflet dynamically to avoid SSR issues
import dynamic from 'next/dynamic';

// Leaflet styles
import 'leaflet/dist/leaflet.css';

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
  title?: string;
  onFullscreen?: () => void;
}

// Dynamic import of MapComponent to avoid SSR issues with Leaflet
const MapComponent = dynamic(() => import('./map-component'), { 
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full min-h-[300px] bg-muted/30">
      <div className="text-center">
        <MapIcon className="mx-auto h-12 w-12 text-primary/50 mb-3 animate-pulse" />
        <p className="text-muted-foreground">Loading map...</p>
      </div>
    </div>
  ) 
});

const JourneyMap: React.FC<JourneyMapProps> = ({ 
  journeyPath, 
  className = "",
  title = "Journey Map",
  onFullscreen
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activePoint, setActivePoint] = useState<number | null>(null);
  const [mapType, setMapType] = useState<'streets' | 'satellite' | 'terrain'>('terrain');
  
  // Get elevation stats
  const getElevationStats = () => {
    const data = journeyPath.elevation_profile;
    if (!data || data.length === 0) return { min: 0, max: 0, start: 0, end: 0, gain: 0 };
    
    const elevations = data.map(p => p.elevation);
    const min = Math.min(...elevations);
    const max = Math.max(...elevations);

    // Calculate total elevation gain (only count upward changes)
    let gain = 0;
    for (let i = 1; i < data.length; i++) {
      const diff = data[i].elevation - data[i - 1].elevation;
      if (diff > 0) gain += diff;
    }
    
    return {
      min,
      max,
      start: data[0].elevation,
      end: data[data.length - 1].elevation,
      gain: Math.round(gain)
    };
  };

  const elevationStats = getElevationStats();
  
  // Toggle fullscreen
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    if (onFullscreen) {
      onFullscreen();
    }
  };
  
  // Update active point and redraw elevation profile
  const handlePointActivation = (index: number) => {
    setActivePoint(index);
    drawElevationProfile(index);
  };
  
  // Change map type
  const cycleMapType = () => {
    const types: ('streets' | 'satellite' | 'terrain')[] = ['streets', 'satellite', 'terrain'];
    const currentIndex = types.indexOf(mapType);
    const nextIndex = (currentIndex + 1) % types.length;
    setMapType(types[nextIndex]);
  };
  
  // Draw elevation profile
  const drawElevationProfile = (highlightIndex: number | null = null) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const elevationData = journeyPath.elevation_profile;
    if (!elevationData || elevationData.length === 0) return;

    // Canvas setup
    const padding = { top: 20, right: 20, bottom: 30, left: 50 };
    const width = canvas.width - padding.left - padding.right;
    const height = canvas.height - padding.top - padding.bottom;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Find min and max elevation with a 10% buffer
    const elevations = elevationData.map(p => p.elevation);
    let minElevation = Math.min(...elevations);
    let maxElevation = Math.max(...elevations);
    const buffer = (maxElevation - minElevation) * 0.1;
    minElevation = Math.max(0, minElevation - buffer);
    maxElevation = maxElevation + buffer;
    const elevationRange = Math.max(maxElevation - minElevation, 1);

    // Find max distance
    const maxDistance = elevationData[elevationData.length - 1]?.distance || 0;

    // Draw background and grid
    ctx.fillStyle = '#f8fafc'; // slate-50
    ctx.fillRect(padding.left, padding.top, width, height);
    
    ctx.strokeStyle = '#e2e8f0'; // slate-200
    ctx.lineWidth = 1;
    
    // Horizontal gridlines
    const elevationStep = Math.ceil(elevationRange / 5);
    for (let i = 0; i <= 5; i++) {
      const y = padding.top + height - (i * elevationStep / elevationRange) * height;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(padding.left + width, y);
      ctx.stroke();
    }
    
    // Vertical gridlines
    const distanceStep = Math.ceil(maxDistance / 5);
    for (let i = 0; i <= 5; i++) {
      const x = padding.left + (i * distanceStep / maxDistance) * width;
      ctx.beginPath();
      ctx.moveTo(x, padding.top);
      ctx.lineTo(x, padding.top + height);
      ctx.stroke();
    }

    // Draw axes
    ctx.strokeStyle = '#94a3b8'; // slate-400
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(padding.left, padding.top);
    ctx.lineTo(padding.left, padding.top + height);
    ctx.lineTo(padding.left + width, padding.top + height);
    ctx.stroke();

    // Draw elevation profile area
    if (elevationData.length > 0) {
      // Plot points
      const points: [number, number][] = elevationData.map((point) => [
        padding.left + (point.distance / maxDistance) * width,
        padding.top + height - ((point.elevation - minElevation) / elevationRange) * height
      ]);
      
      // Create path for area
      ctx.beginPath();
      ctx.moveTo(points[0][0], padding.top + height);
      points.forEach(([x, y]) => {
        ctx.lineTo(x, y);
      });
      ctx.lineTo(points[points.length - 1][0], padding.top + height);
      ctx.closePath();
      
      // Fill with gradient
      const gradient = ctx.createLinearGradient(0, padding.top, 0, padding.top + height);
      gradient.addColorStop(0, 'rgba(59, 130, 246, 0.5)'); // blue-500 with opacity
      gradient.addColorStop(1, 'rgba(239, 246, 255, 0.2)'); // blue-50 with opacity
      ctx.fillStyle = gradient;
      ctx.fill();
      
      // Draw line
      ctx.beginPath();
      ctx.moveTo(points[0][0], points[0][1]);
      points.forEach(([x, y], i) => {
        if (i > 0) ctx.lineTo(x, y);
      });
      ctx.strokeStyle = '#3b82f6'; // blue-500
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Highlight specific point if given
      if (highlightIndex !== null && highlightIndex >= 0 && highlightIndex < elevationData.length) {
        const point = elevationData[highlightIndex];
        const x = padding.left + (point.distance / maxDistance) * width;
        const y = padding.top + height - ((point.elevation - minElevation) / elevationRange) * height;
        
        ctx.fillStyle = '#f97316'; // orange-500
        ctx.beginPath();
        ctx.arc(x, y, 6, 0, Math.PI * 2);
        ctx.fill();
        
        // Add label
        ctx.fillStyle = '#1e293b'; // slate-800
        ctx.font = 'bold 10px system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`${Math.round(point.elevation)}m`, x, y - 10);
      }
      
      // Mark highest point
      const highestPoint = elevationData.reduce((prev, current) => 
        (prev.elevation > current.elevation) ? prev : current);
      
      const highX = padding.left + (highestPoint.distance / maxDistance) * width;
      const highY = padding.top + height - ((highestPoint.elevation - minElevation) / elevationRange) * height;
      
      ctx.fillStyle = '#ef4444'; // red-500
      ctx.beginPath();
      ctx.arc(highX, highY, 4, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.fillStyle = '#ef4444'; // red-500
      ctx.font = 'bold 10px system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'bottom';
      ctx.fillText(`Peak: ${Math.round(highestPoint.elevation)}m`, highX, highY - 8);
    }

    // Draw axis labels
    ctx.font = '10px system-ui, sans-serif';
    ctx.fillStyle = '#64748b'; // slate-500
    
    // Y-axis (elevation)
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    for (let i = 0; i <= 5; i++) {
      const elevation = minElevation + i * elevationStep;
      const y = padding.top + height - (i * elevationStep / elevationRange) * height;
      ctx.fillText(`${Math.round(elevation)}m`, padding.left - 5, y);
    }
    
    // X-axis (distance)
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    for (let i = 0; i <= 5; i++) {
      const distance = i * distanceStep;
      const x = padding.left + (i * distanceStep / maxDistance) * width;
      ctx.fillText(`${Math.round(distance)} km`, x, padding.top + height + 15);
    }
  };

  // Draw elevation profile on component mount
  useEffect(() => {
    drawElevationProfile();
    
    // Redraw on window resize
    const handleResize = () => drawElevationProfile(activePoint);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [journeyPath.elevation_profile]);

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Map Section */}
      <Card className={`overflow-hidden border-primary/10 shadow-sm transition-all ${
        isFullscreen ? 'fixed inset-4 z-50 m-0 h-[calc(100vh-32px)]' : ''
      }`}>
        <div className="p-3 border-b bg-muted/30 flex justify-between items-center">
          <div className="flex items-center gap-1.5">
            <MapIcon className="h-4 w-4 text-primary" />
            <h3 className="text-base font-medium">{title}</h3>
          </div>
          <div className="flex items-center gap-1.5">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge variant="outline" className="text-xs">
                    {journeyPath.distance_km.toFixed(1)} km total
                  </Badge>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p className="text-xs">Total journey distance</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={cycleMapType}>
                    <Layers className="h-3.5 w-3.5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p className="text-xs">Change map style</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={toggleFullscreen}>
                    {isFullscreen ? (
                      <Minimize2 className="h-3.5 w-3.5" />
                    ) : (
                      <Maximize2 className="h-3.5 w-3.5" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p className="text-xs">{isFullscreen ? 'Exit fullscreen' : 'View fullscreen'}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        
        <div className={`relative ${isFullscreen ? 'h-[calc(100%-180px)]' : 'aspect-[16/9]'}`}>
          <MapComponent 
            journeyPath={journeyPath}
            mapType={mapType}
            onPointClick={handlePointActivation}
            activePoint={activePoint}
          />

          {/* OpenStreetMap Attribution */}
          <div className="absolute bottom-0 right-0 bg-white/80 text-[9px] text-muted-foreground p-1 z-[400]">
            © <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer" className="hover:underline">OpenStreetMap</a> contributors
          </div>
        </div>
        
        {/* Elevation Profile - Always show in fullscreen, conditionally in normal mode */}
        {(isFullscreen || true) && (
          <div className="p-4 border-t">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <Mountain className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-medium">Elevation Profile</h3>
              </div>
              <Badge variant="outline" className="text-xs bg-primary/5">
                {elevationStats.gain}m elevation gain
              </Badge>
            </div>
            
            <div className="border rounded-md p-2 bg-white">
              <canvas 
                ref={canvasRef} 
                width={600} 
                height={isFullscreen ? 200 : 150} 
                className="w-full h-auto"
              ></canvas>
            </div>
            
            <div className="flex justify-between text-xs text-muted-foreground mt-2">
              <div className="flex flex-col items-start">
                <span className="font-medium">Starting Elevation</span>
                <span>{Math.round(elevationStats.start)}m</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="font-medium">Peak Elevation</span>
                <span>{Math.round(elevationStats.max)}m</span>
              </div>
              <div className="flex flex-col items-end">
                <span className="font-medium">Final Elevation</span>
                <span>{Math.round(elevationStats.end)}m</span>
              </div>
            </div>
          </div>
        )}
        
        {/* Fullscreen exit button */}
        {isFullscreen && (
          <div className="absolute bottom-4 right-4 z-[500]">
            <Button onClick={toggleFullscreen} className="shadow-lg">
              Exit Fullscreen
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};

export default JourneyMap;