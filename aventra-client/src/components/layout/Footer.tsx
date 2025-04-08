import Link from "next/link"
import { Compass } from "lucide-react"

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
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
  )
}

export default Footer