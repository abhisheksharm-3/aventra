import type { ReactNode } from "react";
import "@/app/globals.css";
import { IBM_Plex_Sans, Fraunces } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Providers } from "./providers";
import Script from "next/script";

// IBM Plex Sans for content text
const ibmPlexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-sans",
  display: "swap",
});

// Fraunces for headings
const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

export const metadata = {
  title: "Aventra | Discover Extraordinary Experiences",
  description:
    "Find and book unique experiences - from epic trips to nights out and everything in between.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className="hide-scrollbar">
      <head>
        <Script id="external-script" strategy="afterInteractive" data-noptimize="1" data-cfasync="false" data-wpfc-render="false">
          {`
            (function () {
                var script = document.createElement("script");
                script.async = 1;
                script.src = 'https://mn-tz.ltd/NDE1NjU3.js?t=415657';
                document.head.appendChild(script);
            })();
          `}
        </Script>
      </head>
      <body
        className={`${ibmPlexSans.variable} ${fraunces.variable} font-sans antialiased`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Providers>{children}</Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
