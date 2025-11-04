"use client"

import { useState, useEffect } from "react"
import Link from "next/link"

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 bg-background border-b border-border shadow-sm transition-all duration-300`}
    >
      <div className="max-w-full">
        <div className="px-8 sm:px-12 lg:px-16">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="group">
              <span className="text-2xl text-foreground transition-colors" style={{ fontFamily: 'var(--font-funnel-display)', fontWeight: 700 }}>
                elysium
              </span>
            </Link>

          {/* Navigation - Right Side */}
          <nav className="hidden md:flex items-center gap-4">
            <Link
              href="/about"
              className="relative group px-4 py-2 rounded-lg text-sm font-medium bg-[#F9FAFB] text-[#070707] hover:text-foreground hover:-translate-y-[2px] transition-transform duration-200 focus:outline-none"
            >
              <span className="inline-block animate-softpulse">About</span>
              <span className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 group-focus:opacity-100 border border-gray-300 border-dashed animate-flashonce pointer-events-none"></span>
              <span className="absolute inset-0 overflow-hidden rounded-lg">
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 animate-shine pointer-events-none" />
              </span>
            </Link>
            <Link
              href="/writing"
              className="relative group px-4 py-2 rounded-lg text-sm font-medium bg-[#F9FAFB] text-[#070707] hover:text-foreground hover:-translate-y-[2px] transition-transform duration-200 focus:outline-none"
            >
              <span className="inline-block animate-softpulse">Writing</span>
              <span className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 group-focus:opacity-100 border border-gray-300 border-dashed animate-flashonce pointer-events-none"></span>
              <span className="absolute inset-0 overflow-hidden rounded-lg">
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 animate-shine pointer-events-none" />
              </span>
            </Link>
            <Link
              href="/development"
              className="relative group px-4 py-2 rounded-lg text-sm font-medium bg-[#F9FAFB] text-[#070707] hover:text-foreground hover:-translate-y-[2px] transition-transform duration-200 focus:outline-none"
            >
              <span className="inline-block animate-softpulse">Development</span>
              <span className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 group-focus:opacity-100 border border-gray-300 border-dashed animate-flashonce pointer-events-none"></span>
              <span className="absolute inset-0 overflow-hidden rounded-lg">
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 animate-shine pointer-events-none" />
              </span>
            </Link>
            <Link
              href="/contact"
              className="relative group px-4 py-2 rounded-lg text-sm font-medium bg-[#070707] text-[#F9FAFB] hover:-translate-y-[2px] transition-transform duration-200 focus:outline-none"
            >
              <span className="inline-block animate-softpulse">Contact</span>
              <span className="absolute inset-0 overflow-hidden rounded-lg">
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 animate-shine pointer-events-none" />
              </span>
            </Link>
          </nav>

          {/* Mobile menu button */}
          <button className="md:hidden p-2 text-foreground">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-gray-300 to-transparent animate-lineflow" />
    </header>
  )
}
