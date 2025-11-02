import type React from "react"
import type { Metadata } from "next"
import { Inter, Space_Grotesk } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-display" })

export const metadata: Metadata = {
  title: "elysium - Web3 Research & Development",
  description: "Deep technical research and production-ready development. For builders. By builders.",
  metadataBase: new URL("https://elysium.dev"),
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
      <body className={`${inter.variable} ${spaceGrotesk.variable} font-sans bg-background text-foreground`}>
        {children}
      </body>
    </html>
  )
}
