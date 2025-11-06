"use client"

import Link from "next/link"
import Image from "next/image"

export function Footer() {
  return (
    <footer className="bg-foreground text-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 sm:gap-10 lg:gap-12 mb-8 sm:mb-12">
          {/* Column 1: Logo & Tagline */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 relative">
                <Image src="/logo.svg" alt="Elysium" width={32} height={32} className="w-full h-full invert" />
              </div>
              <h3 className="font-display font-bold text-2xl text-background">Elysium</h3>
            </div>
            <p className="text-sm text-background/80">Building the decentralized future, one protocol at a time.</p>
          </div>

          {/* Column 2: Navigation Links */}
          <div>
            <h4 className="font-semibold text-background mb-4 text-sm">Navigation</h4>
            <ul className="space-y-3">
              <li>
                <Link href="#research" className="text-sm text-background/80 hover:text-background transition-colors">
                  Research
                </Link>
              </li>
              <li>
                <Link
                  href="#development"
                  className="text-sm text-background/80 hover:text-background transition-colors"
                >
                  Development
                </Link>
              </li>
              <li>
                <Link href="#about" className="text-sm text-background/80 hover:text-background transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="#contact" className="text-sm text-background/80 hover:text-background transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-sm text-background/80 hover:text-background transition-colors">
                  Privacy
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Social Links */}
          <div>
            <h4 className="font-semibold text-background mb-4 text-sm">Connect</h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-background/80 hover:text-background transition-colors inline-flex items-center gap-2"
                >
                  Twitter
                  <span className="text-xs">↗</span>
                </a>
              </li>
              <li>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-background/80 hover:text-background transition-colors inline-flex items-center gap-2"
                >
                  GitHub
                  <span className="text-xs">↗</span>
                </a>
              </li>
              <li>
                <a
                  href="https://elysium.substack.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-background/80 hover:text-background transition-colors inline-flex items-center gap-2"
                >
                  Substack
                  <span className="text-xs">↗</span>
                </a>
              </li>
              <li>
                <a
                  href="https://farcaster.cast"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-background/80 hover:text-background transition-colors inline-flex items-center gap-2"
                >
                  Farcaster
                  <span className="text-xs">↗</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="pt-6 sm:pt-8 border-t border-background/20 flex flex-col sm:flex-row items-center justify-between text-xs sm:text-sm text-background/80 gap-4">
          <p>&copy; 2025 Elysium. All rights reserved.</p>
          <div className="flex gap-4 sm:gap-6 flex-wrap justify-center">
            <Link href="/privacy" className="hover:text-background transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-background transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
