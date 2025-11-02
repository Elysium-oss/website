"use client"

import { Header } from "@/components/header"

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="pt-24 pb-24">
        {/* Hero Section */}
        <section className="px-4 sm:px-6 lg:px-8 py-16 border-b border-border">
          <div className="max-w-4xl mx-auto">
            <p className="text-xs font-semibold text-muted-foreground tracking-wider mb-4">ABOUT US</p>
            <h1 className="font-display font-bold text-6xl sm:text-7xl text-foreground leading-tight mb-8 text-balance">
              Building the Decentralized Future
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              We're a team of researchers, engineers, and architects dedicated to advancing Web3 infrastructure and
              knowledge.
            </p>
          </div>
        </section>

        {/* Mission & Values */}
        <section className="px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-16">
            {/* Mission */}
            <div>
              <h2 className="font-display font-bold text-2xl text-foreground mb-4">Our Mission</h2>
              <p className="text-base text-muted-foreground leading-relaxed">
                We simplify complexity. Through deep technical research and production-ready development, we help
                builders and enterprises understand and implement blockchain solutions that matter.
              </p>
            </div>

            {/* Values */}
            <div>
              <h2 className="font-display font-bold text-2xl text-foreground mb-4">Our Approach</h2>
              <p className="text-base text-muted-foreground leading-relaxed">
                Technical rigor meets editorial excellence. We don't oversimplify—we make the complex accessible. Every
                protocol deserves to be understood. Every solution deserves to be built right.
              </p>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="px-4 sm:px-6 lg:px-8 py-20 border-t border-b border-border">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-3 gap-8 sm:gap-12">
              <div className="text-center">
                <p className="font-display font-bold text-4xl sm:text-5xl text-foreground mb-2">50+</p>
                <p className="text-sm text-muted-foreground">Articles Published</p>
              </div>
              <div className="text-center">
                <p className="font-display font-bold text-4xl sm:text-5xl text-foreground mb-2">20+</p>
                <p className="text-sm text-muted-foreground">Projects Delivered</p>
              </div>
              <div className="text-center">
                <p className="font-display font-bold text-4xl sm:text-5xl text-foreground mb-2">10K+</p>
                <p className="text-sm text-muted-foreground">Community Members</p>
              </div>
            </div>
          </div>
        </section>

        {/* Focus Areas */}
        <section className="px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-display font-bold text-3xl text-foreground mb-12">What We Focus On</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {[
                { title: "Protocol Research", desc: "Deep analysis of blockchain architectures and mechanisms" },
                { title: "Smart Contracts", desc: "Secure, optimized contracts for production use" },
                { title: "Infrastructure", desc: "Scalable solutions for Web3 applications" },
                { title: "Developer Education", desc: "Clear documentation and educational content" },
              ].map((item) => (
                <div
                  key={item.title}
                  className="p-6 border-2 border-border rounded-lg hover:border-foreground transition-colors"
                >
                  <h3 className="font-display font-bold text-lg text-foreground mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  )
}