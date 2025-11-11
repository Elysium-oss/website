"use client"

import { useEffect, type ReactNode } from "react"
import { usePathname, useSearchParams } from "next/navigation"
import posthog from "posthog-js"
import { PostHogProvider } from "posthog-js/react"

let isPostHogInitialized = false

declare global {
  interface Window {
    __POSTHOG_INITIALIZED?: boolean
  }
}

type PostHogProviderClientProps = {
  children: ReactNode
}

export default function PostHogProviderClient({ children }: PostHogProviderClientProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (isPostHogInitialized) return
    if (typeof window !== "undefined" && window.__POSTHOG_INITIALIZED) return
    // If another initializer (e.g. wizard/instrumentation) already set the token, skip re-init
    if ((posthog as any)?.config?.token) {
      isPostHogInitialized = true
      if (typeof window !== "undefined") {
        window.__POSTHOG_INITIALIZED = true
      }
      return
    }
    const key = process.env.NEXT_PUBLIC_POSTHOG_KEY
    if (!key) return

    posthog.init(key, {
      api_host: "/ingest",
      autocapture: true,
      capture_pageview: false,
      capture_pageleave: true,
      debug: process.env.NODE_ENV === "development",
    })
    isPostHogInitialized = true
    if (typeof window !== "undefined") {
      window.__POSTHOG_INITIALIZED = true
    }
  }, [])

  useEffect(() => {
    if (!isPostHogInitialized) return
    // Capture a pageview on route changes (App Router)
    posthog.capture("$pageview")
  }, [pathname, searchParams])

  return <PostHogProvider client={posthog}>{children}</PostHogProvider>
}

