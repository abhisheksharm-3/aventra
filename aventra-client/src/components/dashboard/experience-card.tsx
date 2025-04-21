import React from "react";
import Image from "next/image";
import { Calendar, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExperienceCardProps } from "@/types/dashboard";

export function ExperienceCard({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  id,
  name,
  type,
  location,
  image,
  date,
}: ExperienceCardProps) {
  return (
    <Card className="overflow-hidden">
      <div className="relative h-40">
        <Image 
          src={image} 
          alt={name} 
          fill 
          className="object-cover transition-transform hover:scale-105"
        />
        <Badge className="absolute top-2 right-2">
          {type}
        </Badge>
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold">{name}</h3>
        <div className="flex items-center text-sm text-muted-foreground mt-1">
          <MapPin className="h-3.5 w-3.5 mr-1" />
          <span>{location}</span>
        </div>
        <div className="flex items-center text-sm text-muted-foreground mt-1">
          <Calendar className="h-3.5 w-3.5 mr-1" />
          <span>{date}</span>
        </div>
        <Button size="sm" className="w-full mt-3">View Details</Button>
      </CardContent>
    </Card>
  );
}