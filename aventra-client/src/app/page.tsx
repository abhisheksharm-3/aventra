import Link from "next/link"
import Image from "next/image"
import { Search, MapPin, Users, Calendar, Utensils, Heart, Compass } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FC, ReactNode } from "react"

interface FeatureCardProps {
  icon: ReactNode
  title: string
  description: string
  link: string
}

interface TestimonialCardProps {
  quote: string
  author: string
  role: string
  imageSrc?: string
}

const FeatureCard: FC<FeatureCardProps> = ({ icon, title, description, link }) => {
  return (
    <div className="group relative overflow-hidden rounded-lg border border-[#EFEFEF] bg-white p-8 shadow-sm hover:shadow-xl transition-all duration-500 ease-in-out">
      <div className="mb-6 text-primary">{icon}</div>
      <h3 className="font-display text-xl mb-4">{title}</h3>
      <p className="text-muted-foreground mb-8 font-light tracking-wide leading-relaxed">{description}</p>
      <Link href={link} className="inline-flex items-center text-sm font-light tracking-wide text-primary">
        Discover more
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="ml-2 transition-transform group-hover:translate-x-2"
        >
          <path d="M5 12h14"></path>
          <path d="m12 5 7 7-7 7"></path>
        </svg>
      </Link>
    </div>
  )
}

const TestimonialCard: FC<TestimonialCardProps> = ({ quote, author, role, imageSrc }) => {
  return (
    <div className="rounded-lg border border-[#EFEFEF] bg-white p-10 hover:shadow-xl transition-all duration-500 flex flex-col h-full">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="40"
        height="40"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-primary/20 mb-8"
      >
        <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"></path>
        <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"></path>
      </svg>
      <p className="mb-10 text-muted-foreground font-light tracking-wide leading-relaxed text-lg italic">{quote}</p>
      <div className="mt-auto flex items-center gap-3">
        {imageSrc && (
          <div className="h-12 w-12 rounded-full overflow-hidden">
            <Image src={imageSrc} alt={author} width={48} height={48} className="object-cover" />
          </div>
        )}
        <div>
          <p className="font-display text-lg">{author}</p>
          <p className="text-sm text-muted-foreground font-light tracking-wide">{role}</p>
        </div>
      </div>
    </div>
  )
}

export default function Home() {
  const currentYear = new Date().getFullYear();
  
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container flex h-20 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Compass className="h-7 w-7 text-primary" />
            <span className="font-display text-xl tracking-wide">Aventra</span>
          </Link>
          <nav className="hidden md:flex gap-10">
            {["Trips", "Nights Out", "Family", "Date Night", "Dining"].map((item) => (
              <Link 
                key={item}
                href={`#${item.toLowerCase().replace(" ", "-")}`} 
                className="text-sm font-light tracking-wide hover:text-primary transition-colors"
              >
                {item}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" className="hidden md:flex font-light tracking-wide">
              Sign In
            </Button>
            <Button size="sm" className="font-light tracking-wide px-6 rounded-full">
              Get Started
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1 container">
        <section className="relative">
          <div className="absolute inset-0 z-0">
            <Image
              src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=2070&auto=format&fit=crop"
              alt="Beautiful mountain landscape"
              fill
              className="object-cover brightness-[0.6]"
              priority
            />
          </div>
          <div className="container relative z-10 py-40 md:py-56 lg:py-64">
            <div className="mx-auto max-w-3xl text-center text-white">
              <h1 className="font-display text-5xl sm:text-6xl md:text-7xl leading-tight">
                Curated <span className="italic">Experiences</span> for Every Occasion
              </h1>
              <p className="mt-8 text-lg md:text-xl font-light tracking-wide text-white/95 max-w-2xl mx-auto leading-relaxed">
                From intimate date nights to grand adventures, Aventra helps you discover and plan the perfect
                excursion.
              </p>
              <div className="mt-14 bg-white/10 backdrop-blur-md rounded-xl p-5 md:p-6 border border-white/20">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative flex-1">
                    <MapPin className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                    <Input type="text" placeholder="Where to?" className="pl-10 bg-white/95 border-0 h-12 rounded-lg" />
                  </div>
                  <div className="relative flex-1">
                    <Calendar className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                    <Input type="text" placeholder="When?" className="pl-10 bg-white/95 border-0 h-12 rounded-lg" />
                  </div>
                  <div className="relative flex-1">
                    <Users className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                    <Input type="text" placeholder="Who's joining?" className="pl-10 bg-white/95 border-0 h-12 rounded-lg" />
                  </div>
                  <Button className="h-12 px-8 rounded-lg">
                    <Search className="mr-2 h-4 w-4" />
                    Explore
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute bottom-0 w-full h-24 bg-gradient-to-t from-[#FAFAFA] to-transparent"></div>
        </section>

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
            {[
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
            ].map((feature, index) => (
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

        <section id="trips" className="py-28 md:py-36 bg-[#F8F8F8]">
          <div className="container">
            <div className="grid md:grid-cols-2 gap-20 items-center">
              <div>
                <h2 className="font-display text-3xl sm:text-4xl mb-6">
                  Curated <span className="italic">Journeys</span>
                </h2>
                <p className="text-muted-foreground mb-10 font-light tracking-wide leading-relaxed text-lg">
                  From weekend escapes to extended adventures, our expertly crafted itineraries ensure every moment of
                  your journey is thoughtfully planned and memorable.
                </p>
                <ul className="space-y-5">
                  {[
                    "Personalized itineraries based on your preferences",
                    "Exclusive access to unique accommodations",
                    "Insider recommendations from local experts",
                    "Seamless booking for all activities",
                    "Detailed travel guides and resources",
                  ].map((feature, i) => (
                    <li key={i} className="flex items-center gap-3 font-light">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button className="mt-12 px-8 rounded-full">Plan Your Journey</Button>
              </div>
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)]">
                <Image
                  src="https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=1788&auto=format&fit=crop"
                  alt="Trip planning interface"
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
            </div>
          </div>
        </section>

        <section id="nights-out" className="py-28 md:py-36">
          <div className="container">
            <div className="grid md:grid-cols-2 gap-20 items-center">
              <div className="order-2 md:order-1 relative aspect-[4/3] rounded-xl overflow-hidden shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)]">
                <Image
                  src="https://images.unsplash.com/photo-1541532713592-79a0317b6b77?q=80&w=1788&auto=format&fit=crop"
                  alt="Friends night out"
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="order-1 md:order-2">
                <h2 className="font-display text-3xl sm:text-4xl mb-6">
                  Social <span className="italic">Gatherings</span>
                </h2>
                <p className="text-muted-foreground mb-10 font-light tracking-wide leading-relaxed text-lg">
                  Elevate your social calendar with carefully selected venues and experiences that bring friends
                  together for unforgettable evenings.
                </p>
                <ul className="space-y-5">
                  {[
                    "Curated selection of trending venues",
                    "Exclusive event access and reservations",
                    "Themed experience packages",
                    "Group coordination tools",
                    "Personalized recommendations based on preferences",
                  ].map((feature, i) => (
                    <li key={i} className="flex items-center gap-3 font-light">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button className="mt-12 px-8 rounded-full">Discover Venues</Button>
              </div>
            </div>
          </div>
        </section>

        <section id="dashboard-preview" className="py-28 md:py-36 bg-gradient-to-b from-[#FCFCFC] to-[#F8F8F8]">
          <div className="container">
            <div className="text-center mb-20">
              <h2 className="font-display text-3xl sm:text-4xl">
                Your Personal <span className="italic">Concierge</span>
              </h2>
              <p className="mt-4 text-muted-foreground max-w-2xl mx-auto font-light tracking-wide text-lg">
                Manage all your experiences in one elegant, intuitive dashboard designed for the discerning planner.
              </p>
            </div>
            <div className="relative mx-auto max-w-5xl rounded-xl border bg-white p-3 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)]">
              <div className="aspect-[16/9] overflow-hidden rounded-lg">
                <Image
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop"
                  alt="Dashboard interface"
                  width={1920}
                  height={1080}
                  className="object-cover"
                />
              </div>
            </div>
            <div className="mt-16 text-center">
              <Button size="lg" className="px-10 rounded-full transition-all duration-300 hover:scale-105">
                Experience Aventra
              </Button>
            </div>
          </div>
        </section>

        <section id="testimonials" className="py-28 md:py-36">
          <div className="container">
            <div className="text-center mb-20">
              <h2 className="font-display text-3xl sm:text-4xl">
                Client <span className="italic">Testimonials</span>
              </h2>
              <p className="mt-4 text-muted-foreground max-w-2xl mx-auto font-light tracking-wide text-lg">
                Join our community of discerning travelers and social connoisseurs who&apos;ve elevated their experiences
                with Aventra.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {[
                {
                  quote: "Aventra transformed our regular friend gatherings into extraordinary experiences. Their venue recommendations are consistently exceptional.",
                  author: "Alexandra K.",
                  role: "Social Enthusiast",
                  imageSrc: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=2071&auto=format&fit=crop"
                },
                {
                  quote: "Planning our family vacation was effortless and the curated activities delighted both adults and children alike.",
                  author: "Marcus J.",
                  role: "Family Traveler",
                  imageSrc: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1887&auto=format&fit=crop"
                },
                {
                  quote: "As a culinary enthusiast, I've discovered remarkable dining experiences that I would never have found otherwise.",
                  author: "Sophia L.",
                  role: "Gastronomy Aficionado",
                  imageSrc: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1964&auto=format&fit=crop"
                }
              ].map((testimonial, index) => (
                <TestimonialCard
                  key={index}
                  quote={testimonial.quote}
                  author={testimonial.author}
                  role={testimonial.role}
                  imageSrc={testimonial.imageSrc}
                />
              ))}
            </div>
          </div>
        </section>

        <section id="cta" className="py-28 md:py-36 bg-primary text-primary-foreground">
          <div className="container text-center">
            <h2 className="font-display text-3xl sm:text-5xl">
              Elevate Your <span className="italic">Experiences</span>
            </h2>
            <p className="mt-8 max-w-2xl mx-auto opacity-90 font-light tracking-wide text-lg">
              Join our community of discerning adventurers and begin crafting unforgettable moments.
            </p>
            <div className="mt-14 flex flex-col sm:flex-row gap-6 justify-center">
              <Button size="lg" variant="secondary" className="px-10 rounded-full transition-all duration-300 hover:scale-105">
                Learn More
              </Button>
              <Button size="lg" variant="default" className="bg-white text-primary hover:bg-white/90 px-10 rounded-full transition-all duration-300 hover:scale-105">
                Begin Your Journey
              </Button>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t py-20 bg-[#FCFCFC]">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12">
            <div className="col-span-2 lg:col-span-2">
              <Link href="/" className="flex items-center gap-2">
                <Compass className="h-7 w-7 text-primary" />
                <span className="font-display text-xl tracking-wide">Aventra</span>
              </Link>
              <p className="mt-6 text-sm text-muted-foreground max-w-xs font-light tracking-wide leading-relaxed">
                Curating exceptional experiences for discerning individuals seeking memorable adventures and gatherings.
              </p>
            </div>
            {[
              {
                title: "EXPERIENCES",
                links: [
                  { name: "Journeys", href: "#" },
                  { name: "Social Events", href: "#" },
                  { name: "Culinary", href: "#" },
                  { name: "Romantic", href: "#" }
                ]
              },
              {
                title: "COMPANY",
                links: [
                  { name: "About", href: "#" },
                  { name: "Journal", href: "#" },
                  { name: "Careers", href: "#" },
                  { name: "Contact", href: "#" }
                ]
              },
              {
                title: "LEGAL",
                links: [
                  { name: "Privacy", href: "#" },
                  { name: "Terms", href: "#" },
                  { name: "Cookies", href: "#" },
                  { name: "Licenses", href: "#" }
                ]
              }
            ].map((category, index) => (
              <div key={index}>
                <h3 className="font-display mb-6 tracking-wide text-sm">{category.title}</h3>
                <ul className="space-y-4 text-sm">
                  {category.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <Link
                        href={link.href}
                        className="text-muted-foreground hover:text-foreground transition-colors font-light tracking-wide"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-16 pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-sm text-muted-foreground font-light tracking-wide">
              © {currentYear} Aventra. All rights reserved.
            </p>
            <div className="flex gap-8">
              {[
                { name: "Twitter", icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                  </svg>
                )},
                { name: "Instagram", icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                  </svg>
                )},
                { name: "Facebook", icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                  </svg>
                )}
              ].map((social, index) => (
                <Link key={index} href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  <span className="sr-only">{social.name}</span>
                  {social.icon}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}