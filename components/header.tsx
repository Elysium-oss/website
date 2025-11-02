"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"

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
      className={`fixed top-0 w-full z-50 bg-background transition-all duration-300 ${
        isScrolled ? "border-b border-border shadow-sm" : "border-b border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo with Icon */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 relative">
              <Image src="/elysium-logo.png" alt="Elysium" width={32} height={32} className="w-full h-full" />
            </div>
            <span className="font-display font-bold text-2xl text-foreground transition-colors">
              Elysium
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/writings"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Writings
            </Link>
            <Link
              href="/development"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Development
            </Link>
            <Link
              href="/about"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              About
            </Link>
            <Link
              href="/contact"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Contact
            </Link>
          </nav>

          {/* CTA Button */}
          <button className="hidden sm:inline-flex px-6 py-2 rounded-lg text-white font-medium text-sm hover:bg-accent-hover shadow-sm hover:shadow-md hover:translate-y-[-2px] bg-foreground">
            Start a Project
          </button>

          {/* Mobile menu button */}
          <button className="md:hidden p-2 text-foreground">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  )
}
