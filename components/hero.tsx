"use client"

import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"

export function Hero() {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  return (
    <section className="relative pt-45 pb-32 bg-background overflow-hidden border-b border-border">
      <div className="max-w-full">
        <div className="grid grid-cols-1 lg:grid-cols-[40%_60%] gap-0 items-center">
          {/* Left: Content - Clean white space */}
          <div
            className={`px-8 sm:px-12 lg:px-16 py-12 lg:py-0 flex flex-col justify-center transition-all duration-700 ${
              isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            <h1 className="font-display font-bold text-5xl sm:text-6xl lg:text-7xl text-foreground mb-6 leading-tight text-pretty">
              Building the Decentralized Future
            </h1>

            <p className="text-base sm:text-lg text-muted-foreground mb-8 leading-relaxed max-w-xl font-light">
              Deep technical research and production-ready development. For builders. By builders.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 items-start">
              <Link
                href="#articles"
                className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-foreground text-white font-medium text-base hover:bg-accent-hover hover:shadow-lg transition-all duration-200 hover:translate-y-[-2px]"
              >
                Explore Our Work
              </Link>
              <a
                href="https://elysium.substack.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-6 py-3 rounded-lg border-2 border-foreground text-foreground font-medium text-base hover:bg-foreground hover:text-white transition-all duration-200"
              >
                Read Our Research
              </a>
            </div>
          </div>

          {/* Right: Banner Image - Centered and larger */}
          <div
            className={`relative w-full h-[300px] sm:h-[350px] lg:h-[400px] overflow-hidden flex items-center justify-center transition-all duration-1000 delay-300 ${
              isLoaded ? "opacity-100" : "opacity-0"
            }`}
          >
            <Image
              src="/twitter-banner.png"
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
