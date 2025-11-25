"use client"

import { Header } from "@/components/header"
import { motion } from "framer-motion"

export default function DevelopmentPage() {
  return (
    <>
      <Header />
      <main className="pt-20 sm:pt-24 pb-12 sm:pb-16 lg:pb-24 min-h-screen flex items-center justify-center">
        <div className="text-center px-4 sm:px-6 max-w-2xl mx-auto">
          {/* Animated element above text */}
          <motion.div
            className="mb-12 sm:mb-16 flex justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="relative w-24 h-24 sm:w-32 sm:h-32"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                type: "spring",
                stiffness: 100,
                damping: 20,
                delay: 0.2,
              }}
            >
              {/* Outer rotating ring with dots */}
              <motion.div
                className="absolute inset-0 rounded-full"
                animate={{ rotate: 360 }}
                transition={{
                  duration: 25,
                  repeat: Infinity,
                  ease: "linear",
                }}
              >
                <div className="absolute inset-0 rounded-full border border-foreground/15"></div>
                {/* Orbital dots */}
                <motion.div
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-foreground rounded-full"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-foreground rounded-full"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                />
                <motion.div
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-foreground rounded-full"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                />
                <motion.div
                  className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-foreground rounded-full"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
                />
              </motion.div>

              {/* Middle ring rotating opposite */}
              <motion.div
                className="absolute inset-4 sm:inset-6 rounded-full border border-foreground/20"
                animate={{ rotate: -360 }}
                transition={{
                  duration: 18,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />

              {/* Inner pulsing circle */}
              <motion.div
                className="absolute inset-8 sm:inset-10 rounded-full border border-foreground/30"
                animate={{
                  scale: [1, 1.15, 1],
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />

              {/* Center dot with glow */}
              <motion.div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                animate={{
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <div className="w-3 h-3 sm:w-4 sm:h-4 bg-foreground rounded-full shadow-lg"></div>
              </motion.div>

              {/* Ripple effects - multiple layers */}
              <motion.div
                className="absolute inset-0 rounded-full border border-foreground/5"
                animate={{
                  scale: [1, 2],
                  opacity: [0.4, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeOut",
                }}
              />
              <motion.div
                className="absolute inset-0 rounded-full border border-foreground/5"
                animate={{
                  scale: [1, 2],
                  opacity: [0.4, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeOut",
                  delay: 1,
                }}
              />
              <motion.div
                className="absolute inset-0 rounded-full border border-foreground/5"
                animate={{
                  scale: [1, 2],
                  opacity: [0.4, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeOut",
                  delay: 2,
                }}
              />
            </motion.div>
          </motion.div>
          
          {/* Title */}
          <motion.h1
            className="font-display font-bold text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-foreground mb-6 sm:mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Coming Soon
          </motion.h1>
          
          {/* Message */}
          <motion.p
            className="text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            We're working on something amazing. Stay tuned!
          </motion.p>
        </div>
      </main>
    </>
  )
}
