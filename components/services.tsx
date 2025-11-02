"use client"

import Link from "next/link"
import { motion } from "framer-motion"

export function Services() {
  return (
    <section id="research" className="relative py-24 px-4 sm:px-6 lg:px-8 bg-background overflow-hidden border-b border-border">
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-muted rounded-full blur-3xl opacity-10 -z-10 pointer-events-none -translate-y-1/2" />

      <div className="max-w-6xl mx-auto">
        {/* Section Title */}
        <div className="text-center mb-16">
          <h2 className="font-display font-bold text-5xl sm:text-6xl text-foreground">
            What We <span className="text-muted-foreground">Build</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We combine research rigor with engineering excellence
          </p>
        </div>

        {/* Services Grid */}
        <motion.div
          className="grid md:grid-cols-2 gap-8 lg:gap-12"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          {/* Writings Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="group relative p-8 rounded-2xl border-2 border-border hover:border-foreground bg-background hover:bg-muted/50 hover:shadow-lg transition-all duration-300 overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-12 bg-foreground transform transition-all duration-300 group-hover:h-full opacity-60 group-hover:opacity-10" />

              {/* Icon */}
              <div className="w-14 h-14 rounded-xl bg-muted flex items-center justify-center mb-6 group-hover:bg-foreground group-hover:text-white transition-all duration-300">
                <svg
                  className="w-7 h-7 text-foreground group-hover:text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>

              <h3 className="font-display font-bold text-3xl text-foreground mb-3 transition-colors">
                Writings
              </h3>
              <p className="text-base text-muted-foreground leading-relaxed mb-6">
                In-depth analysis of protocols, mechanisms, and infrastructure. Published on Substack with thousands of
                subscribers reaching builders worldwide.
              </p>
              <Link
                href="/writings"
                className="font-medium text-sm hover:text-foreground inline-flex items-center gap-2 group-hover:translate-x-2 transition-all text-foreground"
              >
                Read Latest Articles
                <span className="text-lg">→</span>
              </Link>
            </div>
          </motion.div>

          {/* Development Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <div className="group relative p-8 rounded-2xl border-2 border-border hover:border-foreground bg-background hover:bg-muted/50 hover:shadow-lg transition-all duration-300 overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-12 bg-foreground transform transition-all duration-300 group-hover:h-full opacity-60 group-hover:opacity-10" />

              {/* Icon */}
              <div className="w-14 h-14 rounded-xl bg-muted flex items-center justify-center mb-6 group-hover:bg-foreground group-hover:text-white transition-all duration-300">
                <svg
                  className="w-7 h-7 text-foreground group-hover:text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                  />
                </svg>
              </div>

              <h3 className="font-display font-bold text-3xl text-foreground mb-3 transition-colors">
                Product Development
              </h3>
              <p className="text-base text-muted-foreground leading-relaxed mb-6">
                Full-stack Web3 development from smart contracts to dApp interfaces. We ship production-grade systems that
                scale.
              </p>
              <button className="font-medium text-sm hover:text-foreground inline-flex items-center gap-2 group-hover:translate-x-2 transition-all text-foreground">
                View Our Work
                <span className="text-lg">→</span>
              </button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
