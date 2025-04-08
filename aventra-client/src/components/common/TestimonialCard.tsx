import Image from "next/image"
import { FC } from "react"

interface TestimonialCardProps {
  quote: string
  author: string
  role: string
  imageSrc?: string
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

export default TestimonialCard