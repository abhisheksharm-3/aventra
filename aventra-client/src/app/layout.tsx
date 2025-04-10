import type { ReactNode } from "react"
import "@/app/globals.css"
import { IBM_Plex_Sans, Fraunces } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"

// IBM Plex Sans for content text
const ibmPlexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-sans",
  display: "swap",
})

// Fraunces for headings
const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
})

export const metadata = {
  title: "Aventra | Discover Extraordinary Experiences",
  description: "Find and book unique experiences - from epic trips to nights out and everything in between.",
}

export default function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning className="hide-scrollbar">
      <body className={`${ibmPlexSans.variable} ${fraunces.variable} font-sans antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}