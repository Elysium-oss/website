"use client"

import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import posthog from "posthog-js"

export function Hero() {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  return (
    <section className="relative pt-24 sm:pt-32 md:pt-40 pb-12 sm:pb-24 md:pb-32 bg-background overflow-hidden border-b border-border">
      <div className="max-w-full">
        <div className="grid grid-cols-1 lg:grid-cols-[40%_60%] gap-0 items-center">
          {/* Left: Content - Clean white space */}
          <div
            className={`px-4 sm:px-8 lg:px-16 py-5 sm:py-12 lg:py-0 flex flex-col justify-center transition-all duration-700 ${
              isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            <h1 className="font-display font-bold text-5xl sm:text-5xl md:text-5xl lg:text-6xl xl:text-7xl text-foreground mb-3 sm:mb-6 leading-tight text-pretty">
              Building the Decentralized Future
            </h1>

            <p className="text-sm sm:text-base md:text-lg text-muted-foreground mb-5 sm:mb-8 leading-relaxed max-w-xl font-light">
              Deep technical research and production-ready development. For builders. By builders.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 sm:gap-3 items-start">
              <Link
                href="/about"
                onClick={() => {
                  if (typeof window !== 'undefined') {
                    posthog.capture('cta_clicked', {
                      cta_name: 'About Us',
                      location: 'hero'
                    })
                  }
                }}
                className="flex items-center justify-center w-full sm:w-auto px-8 sm:px-10 py-2.5 sm:py-3 mb-4 sm:mb-0 rounded-none bg-foreground text-white font-medium text-base sm:text-lg min-w-[120px] sm:min-w-[140px]"
              >
                About Us
              </Link>
            </div>
          </div>

          {/* Right: Banner Image - Centered and larger */}
          <div
            className={`relative w-full h-[250px] sm:h-[300px] md:h-[350px] lg:h-[400px] overflow-hidden flex items-center justify-center transition-all duration-1000 delay-300 ${
              isLoaded ? "opacity-100" : "opacity-0"
            }`}
          >
            <Image
              src="/banner-new.png"
              alt="Elysium - Decentralized Architecture"
              fill
              className="object-cover object-center"
              priority
              quality={90}
            />
            {/* Subtle gradient fade on left edge */}
            <div className="absolute inset-0 bg-gradient-to-r from-background via-background/40 to-transparent pointer-events-none" />
          </div>
        
        </div>
      </div>
    </section>
  )
}
