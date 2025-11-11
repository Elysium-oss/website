"use client"

import type React from "react"
import { useState } from "react"
import { usePostHog } from "posthog-js/react"

export function Newsletter() {
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const [isAlreadySubscribed, setIsAlreadySubscribed] = useState(false)
  const posthog = usePostHog()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    if (!email) return
    posthog?.capture("newsletter_submit", { location: "newsletter_section" })
    
    // Clear previous errors
    setErrorMessage("")
    setIsAlreadySubscribed(false)
    setIsLoading(true)
    
    try {
      // Call our server-side API route to handle subscription
      const response = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })
      
      const data = await response.json()
      
      if (response.ok && data.success) {
        // Success - trigger subscribe animation
        setIsSubscribed(true)
        setErrorMessage("")
        posthog?.capture("newsletter_subscribe_success", { location: "newsletter_section" })
        
        // Revert back after 2.5 seconds
        setTimeout(() => {
          setIsSubscribed(false)
          setEmail("")
        }, 2500)
      } else {
        // Handle different error types gracefully
        if (data.alreadySubscribed) {
          setIsAlreadySubscribed(true)
          setErrorMessage(data.error || "You're already subscribed!")
          posthog?.capture("newsletter_subscribe_error", { reason: "already_subscribed" })
        } else {
          setErrorMessage(data.error || "Failed to subscribe. Please try again.")
          posthog?.capture("newsletter_subscribe_error", { reason: "api_error" })
        }
        
        // Clear error message after 5 seconds
        setTimeout(() => {
          setErrorMessage("")
          setIsAlreadySubscribed(false)
        }, 5000)
      }
    } catch (error) {
      console.error("Error subscribing to newsletter:", error)
      setErrorMessage("An error occurred. Please try again later.")
      posthog?.capture("newsletter_subscribe_error", { reason: "network_error" })
      
      // Clear error message after 5 seconds
      setTimeout(() => {
        setErrorMessage("")
      }, 5000)
    } finally {
      setIsLoading(false)
    }
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
              disabled={isLoading || isSubscribed}
              className="flex-1 px-4 py-2.5 sm:py-3 rounded-none border-2 border-border bg-background text-foreground placeholder:text-muted-foreground focus:border-foreground focus:ring-0 focus:outline-none focus:shadow-none outline-none transition-all text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ outline: 'none', boxShadow: 'none' }}
              onFocus={(e) => {
                e.target.style.outline = 'none'
                e.target.style.boxShadow = 'none'
              }}
            />
            <button
              type="submit"
              disabled={isLoading || isSubscribed}
              className={`px-5 sm:px-6 py-2.5 sm:py-3 rounded-sm sm:rounded-none font-medium text-sm sm:text-base shadow-md transition-all duration-300 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 ${
                isSubscribed
                  ? 'bg-gray-400 text-white'
                  : 'bg-foreground text-white'
              }`}
            >
              {isLoading ? 'Subscribing...' : isSubscribed ? 'Subscribed!' : 'Subscribe'}
            </button>
          </form>
          
          {/* Success/Error Messages */}
          {errorMessage && (
            <div className={`mt-3 sm:mt-4 p-3 rounded-none text-sm transition-all ${
              isAlreadySubscribed
                ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 border border-blue-200 dark:border-blue-800'
                : 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-800'
            }`}>
              {errorMessage}
            </div>
          )}
          
          {!errorMessage && (
            <p className="text-xs text-muted-foreground mt-3 sm:mt-4">
              Weekly deep dives on Web3 tech. Unsubscribe anytime.
            </p>
          )}
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
