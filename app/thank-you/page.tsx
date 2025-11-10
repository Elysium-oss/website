"use client"

import { Header } from "@/components/header"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Suspense } from "react"
import { motion } from "framer-motion"

function ThankYouContent() {
  const searchParams = useSearchParams()
  const type = searchParams.get("type") || "inquiry"

  const getTitle = () => {
    if (type === "research") {
      return "Research Inquiry Submitted"
    } else if (type === "project") {
      return "Project Inquiry Submitted"
    }
    return "Inquiry Submitted"
  }

  const getMessage = () => {
    if (type === "research") {
      return "Thank you for your research inquiry. We'll review your request and get back to you within 24 hours."
    } else if (type === "project") {
      return "Thank you for your project inquiry. We'll review your request and get back to you within 24 hours."
    }
    return "Thank you for your inquiry. We'll review your request and get back to you within 24 hours."
  }

  return (
    <>
      <Header />
      <main className="pt-20 sm:pt-24 pb-12 sm:pb-16 lg:pb-24 min-h-screen">
        <section className="px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          <div className="max-w-2xl mx-auto text-center">
            {/* Success Icon */}
            <motion.div
              className="mb-6 sm:mb-8 flex justify-center"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 15,
                duration: 0.6,
              }}
            >
              <motion.div
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-foreground flex items-center justify-center relative"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 200,
                  damping: 15,
                  delay: 0.1,
                }}
              >
                <motion.svg
                  className="w-8 h-8 sm:w-10 sm:h-10 text-background"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <motion.path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{
                      pathLength: {
                        type: "spring",
                        stiffness: 100,
                        damping: 10,
                        duration: 0.8,
                      },
                      opacity: { duration: 0.2, delay: 0.3 },
                    }}
                  />
                </motion.svg>
                {/* Ripple effect */}
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-foreground"
                  initial={{ scale: 1, opacity: 0.8 }}
                  animate={{ scale: 1.5, opacity: 0 }}
                  transition={{
                    duration: 1.2,
                    delay: 0.5,
                    repeat: 1,
                    repeatDelay: 0.3,
                  }}
                />
              </motion.div>
            </motion.div>

            {/* Title */}
            <motion.h1
              className="font-display font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-foreground leading-tight mb-4 sm:mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              {getTitle()}
            </motion.h1>

            {/* Message */}
            <motion.p
              className="text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed mb-8 sm:mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              {getMessage()}
            </motion.p>

            {/* Action Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <Link
                href="/"
                className="group inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 rounded-none text-white font-medium text-sm sm:text-base bg-foreground hover:bg-accent-hover shadow-sm hover:shadow-lg transition-all duration-200 hover:translate-y-[-2px]"
              >
                <span>Back to Home</span>
                <span className="ml-2 text-base sm:text-lg group-hover:translate-x-1 transition-transform">→</span>
              </Link>
              <Link
                href="/contact"
                className="group inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 rounded-none border-2 border-border text-foreground font-medium text-sm sm:text-base bg-background hover:border-foreground transition-all duration-200"
              >
                <span>Contact Us</span>
              </Link>
            </motion.div>

            {/* Additional Info */}
            <motion.div
              className="mt-12 sm:mt-16 pt-8 sm:pt-12 border-t border-border"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.0 }}
            >
              <p className="text-xs sm:text-sm text-muted-foreground mb-4">
                Response Time
              </p>
              <p className="text-lg sm:text-xl text-foreground font-medium">
                Within 24 hours
              </p>
            </motion.div>
          </div>
        </section>
      </main>
    </>
  )
}

export default function ThankYouPage() {
  return (
    <Suspense fallback={
      <>
        <Header />
        <main className="pt-20 sm:pt-24 pb-12 sm:pb-16 lg:pb-24 min-h-screen">
          <section className="px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
            <div className="max-w-2xl mx-auto text-center">
              <div className="animate-pulse">
                <div className="h-8 bg-muted rounded w-3/4 mx-auto mb-4"></div>
                <div className="h-4 bg-muted rounded w-1/2 mx-auto"></div>
              </div>
            </div>
          </section>
        </main>
      </>
    }>
      <ThankYouContent />
    </Suspense>
  )
}

