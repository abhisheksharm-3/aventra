import { Compass } from "lucide-react"

export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#FAFAFA]">
      <div className="flex flex-col items-center gap-4">
        <Compass className="h-12 w-12 text-primary animate-pulse" />
        <h1 className="font-display text-2xl tracking-wide">Aventra</h1>
        <p className="text-muted-foreground font-light tracking-wide">Curating your experience...</p>
      </div>
    </div>
  )
}

