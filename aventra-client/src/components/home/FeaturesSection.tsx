import { Compass, Users, Heart, Utensils, Calendar, MapPin } from "lucide-react"
import FeatureCard from "@/components/common/FeatureCard"

const FeaturesSection = () => {
  const features = [
    {
      icon: <Compass className="h-10 w-10" />,
      title: "Trip Planning",
      description: "Craft the perfect getaway with personalized itineraries and unique experiences.",
      link: "#trips"
    },
    {
      icon: <Users className="h-10 w-10" />,
      title: "Friends Night Out",
      description: "Discover trending venues and activities for memorable evenings with friends.",
      link: "#nights-out"
    },
    {
      icon: <Heart className="h-10 w-10" />,
      title: "Date Night",
      description: "Curated romantic experiences to create special moments with your partner.",
      link: "#dates"
    },
    {
      icon: <Utensils className="h-10 w-10" />,
      title: "Fine Dining",
      description: "Explore exceptional culinary experiences from hidden gems to acclaimed restaurants.",
      link: "#dining"
    },
    {
      icon: <Calendar className="h-10 w-10" />,
      title: "Family Outings",
      description: "Age-appropriate activities and adventures the whole family will enjoy.",
      link: "#family"
    },
    {
      icon: <MapPin className="h-10 w-10" />,
      title: "Local Experiences",
      description: "Authentic local activities that showcase the best of your destination.",
      link: "#local"
    }
  ];

  return (
    <section id="features" className="container py-28 md:py-36">
      <div className="text-center mb-20">
        <h2 className="font-display text-3xl sm:text-4xl mb-4">
          Discover Your Next <span className="italic">Adventure</span>
        </h2>
        <p className="mt-4 text-muted-foreground max-w-2xl mx-auto font-light tracking-wide text-lg">
          Aventra offers a curated selection of experiences for every occasion, from weekend getaways to spontaneous
          dinner plans.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <FeatureCard
            key={index}
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
            link={feature.link}
          />
        ))}
      </div>
    </section>
  )
}

export default FeaturesSection