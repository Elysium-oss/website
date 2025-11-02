"use client"

import type React from "react"

export function Newsletter() {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // Newsletter signup would be handled here or via Substack embed
  }

  return (
    <section className="relative py-24 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-muted rounded-full blur-3xl opacity-10 -z-10 pointer-events-none" />

      <div className="max-w-2xl mx-auto text-center">
        <h2 className="font-display font-bold text-5xl sm:text-6xl text-foreground mb-4">
          Stay <span className="text-muted-foreground">Ahead</span>
        </h2>
        <p className="text-lg text-muted-foreground mb-8">
          Join thousands of builders getting deep technical insights on Web3
        </p>

        <div className="max-w-md mx-auto">
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              placeholder="Enter your email"
              required
              className="flex-1 px-4 py-3 rounded-lg border-2 border-border bg-background text-foreground placeholder:text-muted-foreground focus:border-foreground focus:ring-2 focus:ring-foreground/20 outline-none transition-all"
            />
            <button
              type="submit"
              className="px-6 py-3 rounded-lg text-white font-medium text-base hover:bg-accent-hover shadow-md hover:shadow-lg hover:translate-y-[-2px] transition-all duration-200 bg-foreground"
            >
              Subscribe
            </button>
          </form>
          <p className="text-xs text-muted-foreground mt-4">
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
