"use client"

import type React from "react"

export function Newsletter() {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // Newsletter signup would be handled here or via Substack embed
  }

  return (
    <section className="relative pt-8 pb-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-muted rounded-full blur-3xl opacity-10 -z-10 pointer-events-none" />

      <div className="max-w-2xl mx-auto text-center">
        <h2 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-foreground mb-6 sm:mb-4">
          Stay <span className="text-muted-foreground">Ahead</span>
        </h2>
        <p className="text-sm sm:text-base md:text-lg text-muted-foreground mb-8 sm:mb-8 px-4">
          Join thousands of builders getting deep technical insights on Web3
        </p>

        <div className="max-w-md mx-auto px-4">
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 sm:gap-3">
            <input
              type="email"
              placeholder="Enter your email"
              required
              className="flex-1 px-4 py-2.5 sm:py-3 rounded-none border-2 border-border bg-background text-foreground placeholder:text-muted-foreground focus:border-foreground focus:ring-0 focus:outline-none focus:shadow-none outline-none transition-all text-sm sm:text-base"
              style={{ outline: 'none', boxShadow: 'none' }}
              onFocus={(e) => {
                e.target.style.outline = 'none'
                e.target.style.boxShadow = 'none'
              }}
            />
            <button
              type="submit"
              className="px-5 sm:px-6 py-2.5 sm:py-3 rounded-none text-white font-medium text-sm sm:text-base shadow-md bg-foreground"
            >
              Subscribe
            </button>
          </form>
          <p className="text-xs text-muted-foreground mt-3 sm:mt-4">
            Weekly deep dives on Web3 tech. Unsubscribe anytime.
          </p>
        </div>

        {/* Alternative: Substack iFrame embed */}
        {/* Uncomment to use Substack's official embed */}
        {/* <div className="mt-8">
          <iframe
            src="https://elysium.substack.com/embed"
            width="100%"
            height="320"
            style={{ border: '1px solid #E5E5E5', background: 'white', borderRadius: '12px' }}
            frameBorder="0"
            scrolling="no"
          />
        </div> */}
      </div>
    </section>
  )
}
