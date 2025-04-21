import Image from "next/image";
import { Sparkles, ArrowRight, GraduationCap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const mockRecommendations = [
  {
    title: "Weekend Getaway to Shimla",
    description: "Based on your preferences, you might enjoy a mountain retreat.",
    image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800&auto=format&fit=crop",
    category: "Trips"
  },
  {
    title: "Moonlight Rooftop Bar",
    description: "New rooftop experience with live music this weekend.",
    image: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800&auto=format&fit=crop",
    category: "Nights Out"
  },
  {
    title: "Candlelight Dinner at Azure",
    description: "Perfect for your upcoming anniversary next month.",
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&auto=format&fit=crop",
    category: "Date Night"
  }
];

export default function RecommendationsPanel() {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex items-center">
          <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center mr-3">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <CardTitle>AI Recommendations</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-5">
          {mockRecommendations.map((rec, index) => (
            <div key={index} className="flex items-start">
              <div className="h-16 w-16 rounded-md overflow-hidden relative shrink-0">
                <Image
                  src={rec.image}
                  alt={rec.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="ml-4 flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">{rec.title}</h4>
                  <Badge variant="outline" className="ml-2 text-xs">
                    {rec.category}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{rec.description}</p>
                <Button variant="link" size="sm" className="p-0 h-auto mt-1">
                  Explore <ArrowRight className="h-3 w-3 ml-1" />
                </Button>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 pt-6 border-t">
          <Button className="w-full" variant="outline">
            <GraduationCap className="h-4 w-4 mr-2" />
            Train AI with Your Preferences
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}