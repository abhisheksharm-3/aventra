export interface TravelTip {
  title: string;
  description: string;
  category: 'local-customs' | 'safety' | 'budget' | 'experience' | 'seasonal';
  icon?: string;
}

export interface DestinationInsight {
  bestTimeToVisit: string;
  localCuisine: string;
  tips: TravelTip[];
  uniqueExperiences: string[];
}
export interface TrendingDestination {
  name: string;
  image: string;
  tag: string;
  match: number;
  description?: string;
}