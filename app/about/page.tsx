"use client"

import { Header } from "@/components/header"
import Image from "next/image"

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="pt-20 sm:pt-24 pb-0">
        {/* Hero Section */}
        <section className="px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16 border-b border-border">
          <div className="max-w-4xl mx-auto">
            <p className="text-xs font-semibold text-muted-foreground tracking-wider mb-3 sm:mb-4">ABOUT US</p>
            <h1 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-foreground leading-tight mb-6 sm:mb-8 text-balance">
              Decoding the Decentralized Future
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed">
              We're a team of researchers, engineers, and architects dedicated to advancing Web3 infrastructure and
              knowledge.
            </p>
          </div>
        </section>

        {/* Content */}
        <section className="px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          <div className="max-w-4xl mx-auto">
            <div className="text-base sm:text-lg md:text-xl text-muted-foreground leading-[1.8] sm:leading-[1.9] space-y-8 sm:space-y-10 font-light">
              <p>
                We believe that every protocol deserves to be understood, but not every protocol deserves your attention. In the current market, it is easy to overlook a revolutionary solution because its value proposition is buried in a niche forum, or conversely, to buy into a flawed project because no one took the time to critically analyze its economic sustainability. We established Elysium to be the bridge that connects complex code to clear, strategic understanding.
              </p>
              <p>
                Our approach combines technical rigor with editorial excellence. We don't just list transactions-per-second (TPS) or copy-paste press releases. We dive deep into infrastructure analysis, examining the critical trade-offs between security, interoperability, and speed. We look at the "meta" of the current cycle and determine where new architectures truly fit, ensuring that we don't oversimplify the tech, but rather make the complex accessible.
              </p>
              <p>
                Beyond just the code, we analyze the human and economic elements that drive Web3. This includes "Strategic Breakdowns" of how protocols acquire liquidity and users. We examine the difference between sustainable growth and temporary incentives, offering unfiltered takes on the direction of the market. We view analysis as a two-way street, often collaborating with the architects of the future to help the world understand why their build matters.
              </p>
              <p>
                Ultimately, Elysium is a research firm built for clarity. We are here for the builders who need their vision articulated, the investors who demand unbiased due diligence, and the curious observers who want to look past the marketing fluff. We offer a high-signal environment where deep research meets plain English, giving you the tools to navigate the decentralized future with confidence.
              </p>
            </div>
          </div>
        </section>
        
        {/* Banner Image */}
        <div className="mt-16 sm:mt-20 lg:mt-24 w-full">
          <Image
            src="/banner.png"
            alt="Elysium Banner"
            width={1920}
            height={640}
            className="w-full h-auto object-cover"
            priority
          />
        </div>
      </main>
    </>
  )
}