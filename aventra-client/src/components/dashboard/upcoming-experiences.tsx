import Image from "next/image";
import Link from "next/link";
import { Calendar, MapPin, ChevronRight, PlusCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

// Sample data
const mockUpcomingExperiences = [
  {
    id: 1,
    name: "Bali Adventure",
    type: "Trip",
    location: "Bali, Indonesia",
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&auto=format&fit=crop",
    startDate: "2025-05-05",
    endDate: "2025-05-15",
    completed: 80
  },
  {
    id: 2,
    name: "Jazz Club Night",
    type: "Night Out",
    location: "Blue Note, New York",
    image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&auto=format&fit=crop",
    startDate: "2025-05-01",
    endDate: "2025-05-01",
    completed: 60
  },
  {
    id: 3,
    name: "Family Zoo Trip",
    type: "Family",
    location: "National Zoo",
    image: "https://images.unsplash.com/photo-1503919275948-9f99db3d64e4?w=800&auto=format&fit=crop",
    startDate: "2025-05-25",
    endDate: "2025-05-25",
    completed: 30
  }
];

interface ExperienceCardProps {
  experience: {
    id: number;
    name: string;
    type: string;
    location: string;
    image: string;
    startDate: string;
    endDate: string;
    completed: number;
  };
}

function ExperienceCard({ experience }: ExperienceCardProps) {
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };
  
  const dateRange = `${formatDate(experience.startDate)} - ${formatDate(experience.endDate)}`;
  const sameDay = formatDate(experience.startDate) === formatDate(experience.endDate);

  return (
    <Card className="overflow-hidden group transition-all duration-300 hover:shadow-lg">
      <div className="relative h-40 overflow-hidden">
        <Image 
          src={experience.image} 
          alt={experience.name} 
          fill 
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-70" />
        <Badge className="absolute top-3 right-3 font-medium bg-white/90 text-primary hover:bg-white">
          {experience.type}
        </Badge>
      </div>
      <CardContent className="p-5">
        <h3 className="font-bold text-lg">{experience.name}</h3>
        <div className="flex items-center mt-2 text-sm text-muted-foreground">
          <MapPin className="h-3.5 w-3.5 mr-1" />
          <span>{experience.location}</span>
        </div>
        <div className="flex items-center mt-1 text-sm text-muted-foreground">
          <Calendar className="h-3.5 w-3.5 mr-1" />
          <span>{sameDay ? formatDate(experience.startDate) : dateRange}</span>
        </div>
        
        <div className="mt-4">
          <div className="flex items-center justify-between mb-1 text-sm">
            <span>Planning progress</span>
            <span className="font-medium">{experience.completed}%</span>
          </div>
          <Progress 
            value={experience.completed} 
            className="h-2"
            style={{
              background: 'linear-gradient(to right, #ddd 0%, #ddd 100%)',
              // Custom colorful gradient based on completion
              backgroundImage: `linear-gradient(to right, ${
                experience.completed > 70 ? '#10b981' : 
                experience.completed > 40 ? '#f59e0b' : '#3b82f6'
              }, ${
                experience.completed > 70 ? '#059669' : 
                experience.completed > 40 ? '#d97706' : '#2563eb'
              })`
            }}
          />
        </div>
        
        <div className="flex mt-4">
          <Button variant="default" size="sm" asChild className="flex-1">
            <Link href={`/dashboard/experience/${experience.id}`}>
              Continue Planning
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

interface UpcomingExperiencesProps {
  categoryFilter?: string;
}

export default function UpcomingExperiences({ categoryFilter }: UpcomingExperiencesProps) {
  // Filter experiences based on category if provided
  const filteredExperiences = categoryFilter
    ? mockUpcomingExperiences.filter(exp => exp.type === categoryFilter)
    : mockUpcomingExperiences;
    
  return (
    <div className="mb-10">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Upcoming Experiences</h2>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/experiences">
            View all <ChevronRight className="ml-1 h-4 w-4" />
          </Link>
        </Button>
      </div>
      
      {filteredExperiences.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredExperiences.map((experience) => (
            <ExperienceCard key={experience.id} experience={experience} />
          ))}
          <Card className="border-dashed border-2 flex flex-col items-center justify-center text-center p-6 hover:border-primary/50 transition-colors">
            <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-3">
              <PlusCircle className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="font-medium">Create New Experience</p>
            <p className="text-sm text-muted-foreground mt-1 mb-4">Plan your next adventure</p>
            <Button variant="outline" size="sm">
              Get Started
            </Button>
          </Card>
        </div>
      ) : (
        <Card className="p-8 text-center">
          <div className="mx-auto w-14 h-14 rounded-full bg-muted flex items-center justify-center mb-4">
            <Calendar className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium">No {categoryFilter || "upcoming"} experiences yet</h3>
          <p className="text-muted-foreground mt-2 mb-6 max-w-md mx-auto">
            Start planning your next {categoryFilter?.toLowerCase() || "experience"} and make unforgettable memories
          </p>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Create New {categoryFilter || "Experience"}
          </Button>
        </Card>
      )}
    </div>
  );
}