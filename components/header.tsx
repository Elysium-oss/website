"use client"

import { useState, useEffect } from "react"
import Link from "next/link"

export function Header() {
  // State to track scroll opacity (0 to 1) for gradual appearance
  const [scrollOpacity, setScrollOpacity] = useState(0)
  // State to control mobile menu visibility
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Effect to handle scroll events and update scroll opacity
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      // Gradually fade in between 0-100px of scroll
      const opacity = Math.min(scrollY / 100, 1)
      setScrollOpacity(opacity)
    }
    // Set initial opacity on mount
    handleScroll()
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Effect to prevent body scrolling when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isMobileMenuOpen])

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 bg-background transition-all duration-300"
      style={{
        width: '100vw',
        maxWidth: '100%',
      }}
    >
      {/* Border and shadow overlay that fades in gradually */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          borderBottom: '1px solid hsl(var(--border))',
          boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
          opacity: scrollOpacity,
          transition: 'opacity 0.1s ease-out',
        }}
      />
      <div className="relative z-10 w-full max-w-full overflow-hidden">
        <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="group flex-shrink-0" onClick={() => setIsMobileMenuOpen(false)}>
              <span className="text-2xl sm:text-3xl text-foreground transition-colors" style={{ fontFamily: 'var(--font-funnel-display)', fontWeight: 700 }}>
                elysium
              </span>
            </Link>

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex items-center gap-2 lg:gap-3 flex-shrink-0">
            <Link
              href="/about"
              className="px-3 lg:px-4 py-2 rounded-none text-sm lg:text-base font-medium bg-[#F9FAFB] text-[#070707] focus:outline-none whitespace-nowrap"
            >
              <span className="inline-block animate-softpulse">About</span>
            </Link>
            <Link
              href="/writing"
              className="px-3 lg:px-4 py-2 rounded-none text-sm lg:text-base font-medium bg-[#F9FAFB] text-[#070707] focus:outline-none whitespace-nowrap"
            >
              <span className="inline-block animate-softpulse">Writing</span>
            </Link>
            <Link
              href="/development"
              className="px-3 lg:px-4 py-2 rounded-none text-sm lg:text-base font-medium bg-[#F9FAFB] text-[#070707] focus:outline-none whitespace-nowrap"
            >
              <span className="inline-block animate-softpulse">Development</span>
            </Link>
            <Link
              href="/contact"
              className="px-4 lg:px-5 py-2 rounded-none text-sm lg:text-base font-medium bg-[#070707] text-[#F9FAFB] focus:outline-none whitespace-nowrap"
            >
              <span className="inline-block animate-softpulse">Contact</span>
            </Link>
          </nav>

          {/* Mobile menu button */}
          <button 
            className="md:hidden p-2 text-foreground z-50 flex-shrink-0"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
          </div>
        </div>
      </div>
      <div 
        className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-gray-300 to-transparent animate-lineflow pointer-events-none"
        style={{ 
          opacity: scrollOpacity,
          transition: 'opacity 0.1s ease-out',
        }}
      />

      {/* Mobile Menu */}
      <div
        className={`fixed inset-x-0 top-20 bottom-0 bg-background border-t border-border transition-transform duration-300 md:hidden z-40 overflow-y-auto ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{
          maxWidth: '100vw',
        }}
      >
        <nav className="flex flex-col p-4 space-y-2 max-w-full">
          <Link
            href="/about"
            onClick={() => setIsMobileMenuOpen(false)}
            className="px-4 py-3 rounded-none text-base font-medium bg-[#F9FAFB] text-[#070707] w-full"
          >
            About
          </Link>
          <Link
            href="/writing"
            onClick={() => setIsMobileMenuOpen(false)}
            className="px-4 py-3 rounded-none text-base font-medium bg-[#F9FAFB] text-[#070707] w-full"
          >
            Writing
          </Link>
          <Link
            href="/development"
            onClick={() => setIsMobileMenuOpen(false)}
            className="px-4 py-3 rounded-none text-base font-medium bg-[#F9FAFB] text-[#070707] w-full"
          >
            Development
          </Link>
          <Link
            href="/contact"
            onClick={() => setIsMobileMenuOpen(false)}
            className="w-full px-4 py-3 rounded-none text-base font-medium bg-[#070707] text-[#F9FAFB] text-center mt-4"
          >
            Contact
          </Link>
        </nav>
      </div>
    </header>
  )
}