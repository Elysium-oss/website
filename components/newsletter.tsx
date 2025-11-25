"use client"

import { useState } from "react"
import { usePostHog } from "posthog-js/react"

export function Newsletter() {
  const [email, setEmail] = useState("")
  const [isSubscribed, setIsSubscribed] = useState(false)
  const posthog = usePostHog()
  
  const publicationUrl =
    process.env.NEXT_PUBLIC_SUBSTACK_URL ?? "https://yash102244.substack.com"
  const subscribeUrl = `${publicationUrl.replace(/\/$/, "")}/subscribe`

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!email) return

    posthog?.capture("newsletter_submit", { location: "newsletter_section" })

    // Redirect to Substack subscribe page with email pre-filled
    const emailParam = encodeURIComponent(email.trim().toLowerCase())
    window.open(`${subscribeUrl}?email=${emailParam}`, "_blank")
    
    setIsSubscribed(true)
    posthog?.capture("newsletter_subscribe_success", { location: "newsletter_section" })

    setTimeout(() => {
      setIsSubscribed(false)
      setEmail("")
    }, 2500)
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSubscribed}
              className="flex-1 px-4 py-2.5 sm:py-3 rounded-none border-2 border-border bg-background text-foreground placeholder:text-muted-foreground focus:border-foreground focus:ring-0 focus:outline-none focus:shadow-none outline-none transition-all text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ outline: "none", boxShadow: "none" }}
              onFocus={(e) => {
                e.target.style.outline = "none"
                e.target.style.boxShadow = "none"
              }}
            />
            <button
              type="submit"
              disabled={isSubscribed}
              className={`px-5 sm:px-6 py-2.5 sm:py-3 rounded-sm sm:rounded-none font-medium text-sm sm:text-base shadow-md transition-all duration-300 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 ${
                isSubscribed
                  ? "bg-muted-foreground text-background"
                  : "bg-foreground text-background hover:bg-foreground/90"
              }`}
            >
              {isSubscribed ? "Opening..." : "Subscribe"}
            </button>
          </form>
          <p className="text-xs text-muted-foreground mt-3 sm:mt-4">
            Weekly deep dives on Web3 tech. Unsubscribe anytime.
          </p>
        </div>

      </div>
    </section>
  )
}
