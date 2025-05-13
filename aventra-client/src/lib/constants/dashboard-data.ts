import { Destination, InsightStat, QuickAction, TripData } from "@/types/dashboard";
import { Bell, Briefcase, FileText, Globe, Heart, MapPin, Zap } from "lucide-react";

export const upcomingTrips: TripData[] = [
    {
        id: "mongolia-2025",
        destination: "Mongolia",
        startDate: "Jun 15, 2025",
        endDate: "Jun 28, 2025",
        image: "https://images.unsplash.com/photo-1602207072074-bd868c14c801",
        daysRemaining: 37,
        progress: 65
    }
];

export const recommendedDestinations: Destination[] = [
    {
        id: "istanbul",
        name: "Istanbul",
        tagline: "Where Continents Meet",
        match: 94,
        image: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200"
    },
    {
        id: "capetown",
        name: "Cape Town",
        tagline: "Where Mountains Meet Sea",
        match: 88,
        image: "https://images.unsplash.com/photo-1580060839134-75a5edca2e99"
    },
    {
        id: "kyoto",
        name: "Kyoto",
        tagline: "Ancient Traditions",
        match: 85,
        image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e"
    }
];

export const quickActions: QuickAction[] = [
    { title: "Update Mongolia visa info", href: "/dashboard/documents", icon: FileText },
    { title: "Complete pending bookings", href: "/dashboard/trips/mongolia-2025", icon: Briefcase },
    { title: "Verify your travel insurance", href: "/dashboard/documents", icon: Zap },
    { title: "Check flight deals for Mongolia", href: "/explore/flights", icon: Globe },
    { title: "View your travel notifications", href: "/dashboard/notifications", icon: Bell },
];

export const travelStats: InsightStat[] = [
    { label: "Countries", value: "7", icon: Globe, colorClass: "bg-blue-500/10 text-blue-500 border-blue-500/10 group-hover:bg-blue-500/20" },
    { label: "Total Trips", value: "12", icon: Briefcase, colorClass: "bg-amber-500/10 text-amber-500 border-amber-500/10 group-hover:bg-amber-500/20" },
    { label: "Distance", value: "28,410 km", icon: MapPin, colorClass: "bg-emerald-500/10 text-emerald-500 border-emerald-500/10 group-hover:bg-emerald-500/20" },
    { label: "Saved Places", value: "24", icon: Heart, colorClass: "bg-rose-500/10 text-rose-500 border-rose-500/10 group-hover:bg-rose-500/20" },
];

export const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};
