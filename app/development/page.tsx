"use client"

import { useState } from "react"
import { Header } from "@/components/header"

const CATEGORIES = ["All", "DeFi Infrastructure", "Security", "Interoperability", "Governance"]

export default function DevelopmentPage() {
  const [selectedCategory, setSelectedCategory] = useState("All")

  return (
    <>
      <Header />
      <main className="pt-20 sm:pt-24 pb-12 sm:pb-16 lg:pb-24 min-h-screen">
        {/* Split Layout */}
        <div className="flex flex-col lg:flex-row">
          {/* Left Sidebar - Header and Filters */}
          <aside className="lg:w-1/2 lg:border-r lg:border-border lg:sticky lg:top-24 lg:h-[calc(100vh-6rem)] lg:overflow-y-auto border-b lg:border-b-0 border-border">
            <div className="px-4 sm:px-6 lg:px-12 py-6 sm:py-8 lg:py-16 lg:pr-16">
              <div className="mb-8 sm:mb-12">
                <p className="text-xs font-semibold text-muted-foreground tracking-wider mb-3 sm:mb-4">DEVELOPMENT</p>
                <h1 className="font-display font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-foreground leading-tight mb-4 sm:mb-6 text-balance">
                  Production-Ready Solutions for Web3
                </h1>
                <p className="text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed max-w-2xl">
                  From protocol design to dApp development, we build scalable, secure infrastructure that powers the
                  decentralized future.
                </p>
              </div>

              {/* Category Filter */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                {CATEGORIES.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-none font-medium text-xs sm:text-sm whitespace-nowrap transition-all duration-200 ${
                      selectedCategory === category
                        ? "bg-foreground text-white border border-foreground"
                        : "bg-transparent border border-border text-muted-foreground hover:border-foreground hover:text-foreground"
                    }`}
                  >
                    {selectedCategory === category && "◆ "}
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </aside>
        </div>

        {/* CTA Section */}
        <section className="px-4 sm:px-6 lg:px-8 py-12 sm:py-16 border-t border-border">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-display font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-foreground mb-3 sm:mb-4">Ready to Build?</h2>
            <p className="text-sm sm:text-base md:text-lg text-muted-foreground mb-6 sm:mb-8 px-4">
              Let's collaborate on your next Web3 project. From concept to production, we deliver.
            </p>
            <a
              href={process.env.NEXT_PUBLIC_TALLY_PROJECTS_URL || "https://tally.so/r/0QrAJ9"}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-6 sm:px-8 py-2.5 sm:py-3 rounded-none text-white font-medium text-sm sm:text-base bg-foreground hover:bg-accent-hover shadow-sm hover:shadow-md hover:translate-y-[-2px] transition-all"
            >
              Start a Project
            </a>
          </div>
        </section>
      </main>
    </>
  )
}
