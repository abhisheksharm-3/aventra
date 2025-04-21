export interface ExperienceCardProps {
  id: number;
  name: string;
  type: string;
  location: string;
  image: string;
  date: string;
}

export interface UpcomingExperienceProps {
  name: string;
  location: string;
  image: string;
  startDate: string;
  endDate: string;
  completed: number;
  type: string;
}

export interface DashboardSidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export interface DashboardHeaderProps {
  toggleSidebar: () => void;
}
export interface SavedItineraryCardProps {
    itinerary: {
      id: number;
      name: string;
      destination: string;
      duration: string;
      image: string;
      aiGenerated: boolean;
    };
  }