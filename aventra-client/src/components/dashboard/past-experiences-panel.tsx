import Image from "next/image";
import { MapPin, Clock, CalendarDays } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const mockPastExperiences = [
  {
    id: 1,
    name: "Goa Beach Vacation",
    type: "Trip",
    location: "Goa, India",
    image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&auto=format&fit=crop",
    endDate: "2025-02-15"
  },
  {
    id: 2,
    name: "Dinner at Spice Route",
    type: "Dining",
    location: "Delhi, India",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop",
    endDate: "2025-03-20"
  },
  {
    id: 3,
    name: "Movie Night with Family",
    type: "Family",
    location: "PVR Cinemas",
    image: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=800&auto=format&fit=crop",
    endDate: "2025-04-01"
  }
];

export default function PastExperiencesPanel() {
  // Format date for display
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric' 
    });
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3 border-b bg-gradient-to-r from-amber-50 to-yellow-50">
        <div className="flex items-center">
          <div className="h-8 w-8 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 flex items-center justify-center mr-3">
            <Clock className="h-4 w-4 text-white" />
          </div>
          <CardTitle>Past Experiences</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          {mockPastExperiences.map((exp) => (
            <div key={exp.id} className="flex items-center p-2 rounded-lg hover:bg-accent transition-colors">
              <div 
                className="h-14 w-14 rounded-md bg-cover bg-center shrink-0 relative overflow-hidden"
              >
                <Image
                  src={exp.image}
                  alt={exp.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="ml-3 flex-1">
                <p className="font-medium">{exp.name}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <MapPin className="h-3 w-3 mr-1 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">{exp.location}</p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {exp.type}
                  </Badge>
                </div>
                <div className="flex items-center mt-1 text-xs text-muted-foreground">
                  <CalendarDays className="h-3 w-3 mr-1" />
                  <span>{formatDate(exp.endDate)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 pt-6 border-t">
          <Button variant="outline" size="sm" className="w-full">
            View All Past Experiences
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}