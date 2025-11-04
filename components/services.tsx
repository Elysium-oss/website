"use client"

import Link from "next/link"
import Image from "next/image"
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
            className="h-full"
          >
            <div className="group relative h-full p-8 rounded-2xl border border-border hover:border-foreground/40 bg-background hover:bg-muted/30 transition-all duration-200 overflow-hidden flex flex-col hover:shadow-md">

              {/* Icon */}
              {/* <div className="relative w-14 h-14 rounded-xl bg-muted/50 backdrop-blur-sm border border-border/50 flex items-center justify-center mb-6 group-hover:bg-foreground group-hover:border-foreground group-hover:shadow-lg group-hover:shadow-foreground/20 transition-all duration-500 p-2">
                <Image
                  src="/quill-pen.png"
                  alt="Writing"
                  width={28}
                  height={28}
                  className="w-7 h-7 object-contain transition-all duration-500 group-hover:brightness-0 group-hover:invert"
                />
              </div> */}

              <h3 className="font-display font-bold text-3xl text-foreground mb-3">
                Writing
              </h3>
              <p className="text-base text-muted-foreground leading-relaxed mb-6 flex-grow">
                In-depth analysis of protocols, mechanisms, and infrastructure. Published on Substack with thousands of
                subscribers reaching builders worldwide.
              </p>
              <Link
                href="/writing"
                className="font-medium text-sm hover:text-foreground inline-flex items-center gap-2 group-hover:translate-x-1 transition-all duration-200 text-foreground mt-auto"
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
            className="h-full"
          >
            <div className="group relative h-full p-8 rounded-2xl border border-border hover:border-foreground/40 bg-background hover:bg-muted/30 transition-all duration-200 overflow-hidden flex flex-col hover:shadow-md">

              {/* Icon */}
              {/* <div className="relative w-14 h-14 rounded-xl bg-muted/50 backdrop-blur-sm border border-border/50 flex items-center justify-center mb-6 group-hover:bg-foreground group-hover:border-foreground group-hover:shadow-lg group-hover:shadow-foreground/20 transition-all duration-500">
                <svg
                  className="w-7 h-7 text-foreground group-hover:text-white transition-colors duration-500"
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
              </div> */}

              <h3 className="font-display font-bold text-3xl text-foreground mb-3">
                Product Development
              </h3>
              <p className="text-base text-muted-foreground leading-relaxed mb-6 flex-grow">
                Full-stack Web3 development from smart contracts to dApp interfaces. We ship production-grade systems that
                scale.
              </p>
              <button className="font-medium text-sm hover:text-foreground inline-flex items-center gap-2 group-hover:translate-x-1 transition-all duration-200 text-foreground mt-auto">
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
