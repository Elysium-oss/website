import type React from "react"
import { Suspense } from "react"
import type { Metadata } from "next"
import { Urbanist } from "next/font/google"
import "./globals.css"
import PostHogProviderClient from "@/components/posthog-provider"

const urbanist = Urbanist({ subsets: ["latin"], variable: "--font-sans" })
const urbanistDisplay = Urbanist({ subsets: ["latin"], variable: "--font-display" })

export const metadata: Metadata = {
  title: "Elysium - Decoding the Decentralized Future",
  description: "A research firm dedicated to distilling clarity from the chaos of the blockchain industry. Deep technical research and strategic analysis for Web3 infrastructure.",
  metadataBase: new URL("https://elysium.org.in"),
  icons: {
    icon: "/logo-dark.png",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://elysium.org.in",
    siteName: "Elysium",
    title: "Elysium - Decoding the Decentralized Future",
    description: "A research firm dedicated to distilling clarity from the chaos of the blockchain industry. Deep technical research and strategic analysis for Web3 infrastructure.",
    images: [
      {
        url: "/twitter-banner.png",
        width: 1200,
        height: 630,
        alt: "Elysium - Web3 Research & Development",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Elysium - Decoding the Decentralized Future",
    description: "A research firm dedicated to distilling clarity from the chaos of the blockchain industry. Deep technical research and strategic analysis for Web3 infrastructure.",
    images: ["/twitter-banner.png"],
    // Uncomment and add your Twitter handle when available
    // creator: "@elysium",
    // site: "@elysium",
  },
  alternates: {
    canonical: "https://elysium.org.in",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth" data-scroll-behavior="smooth">
      <body className={`${urbanist.variable} ${urbanistDisplay.variable} font-sans bg-background text-foreground overflow-x-hidden`}>
        <Suspense fallback={null}>
          <PostHogProviderClient>
        {children}
          </PostHogProviderClient>
        </Suspense>
      </body>
    </html>
  )
}
