import Link from "next/link"
import { FC, ReactNode } from "react"

interface FeatureCardProps {
  icon: ReactNode
  title: string
  description: string
  link: string
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

export default FeatureCard