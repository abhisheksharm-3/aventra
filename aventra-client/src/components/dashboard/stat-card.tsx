"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Clock, Compass, ArrowUpRight, TrendingUp, Hash } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export default function StatCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4">
            <div className="flex justify-between">
              <div className="text-white">
                <p className="text-sm font-medium opacity-80">Upcoming</p>
                <p className="text-2xl font-bold">3</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Calendar className="h-5 w-5 text-white" />
              </div>
            </div>
          </div>
          <div className="p-4">
            <div className="flex items-center text-sm">
              <span className="text-green-500">
                <TrendingUp className="h-4 w-4 inline mr-1" />
                +2
              </span>
              <span className="ml-2 text-muted-foreground">from last month</span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center">
              <Clock className="h-6 w-6 text-amber-600" />
            </div>
            <ArrowUpRight className="h-4 w-4 text-green-500" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Days Until Next Trip</p>
            <p className="text-2xl font-bold mt-1">12</p>
            <p className="text-sm text-muted-foreground mt-2">Bali, Indonesia</p>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
              <Compass className="h-6 w-6 text-blue-600" />
            </div>
            <ArrowUpRight className="h-4 w-4 text-green-500" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Experiences</p>
            <p className="text-2xl font-bold mt-1">24</p>
            <p className="text-sm text-muted-foreground mt-2">8 countries visited</p>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
              <Hash className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-muted-foreground">Travel Budget</p>
              <p className="text-sm font-medium">₹45,000</p>
            </div>
            <Progress className="h-2 mt-2" value={65} />
            <div className="flex items-center justify-between mt-2">
              <p className="text-xs text-muted-foreground">65% used</p>
              <p className="text-xs text-green-600">₹15,750 remaining</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}