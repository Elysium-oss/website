import type React from "react"
import type { Metadata } from "next"
import { Urbanist } from "next/font/google"
import "./globals.css"

const urbanist = Urbanist({ subsets: ["latin"], variable: "--font-sans" })
const urbanistDisplay = Urbanist({ subsets: ["latin"], variable: "--font-display" })

export const metadata: Metadata = {
  title: "Elysium",
  description: "Deep technical research and production-ready development. For builders. By builders.",
  metadataBase: new URL("https://elysium.org.in"),
  icons: {
    icon: "/logo-dark.png",
  },
  openGraph: {
    type: "website",
    url: "https://elysium.dev",
    title: "Elysium - Web3 Research & Development",
    description: "Deep technical research and production-ready development.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Elysium - Web3 Research & Development",
    description: "Deep technical research and production-ready development.",
  },
  
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${urbanist.variable} ${urbanistDisplay.variable} font-sans bg-background text-foreground overflow-x-hidden`}>
        {children}
      </body>
    </html>
  )
}
