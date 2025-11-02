"use client"

import { Header } from "@/components/header"

export default function ContactPage() {
  const researchFormUrl = process.env.NEXT_PUBLIC_TYPEFORM_RESEARCH_URL || "https://form.typeform.com/to/research-form-id"
  const projectsFormUrl = process.env.NEXT_PUBLIC_TYPEFORM_PROJECTS_URL || "https://form.typeform.com/to/projects-form-id"

  return (
    <>
      <Header />
      <main className="pt-24 pb-24">
        {/* Hero Section */}
        <section className="px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-4xl mx-auto">
            <p className="text-xs font-semibold text-muted-foreground tracking-wider mb-2">CONTACT</p>
            <h1 className="font-display font-bold text-6xl sm:text-7xl text-foreground leading-tight mb-4 text-balance">
              Let's Build Together
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Have a project in mind? Want to collaborate? We'd love to hear from you.
            </p>
          </div>
        </section>

        {/* Contact Section */}
        <section className="px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-6xl mx-auto">
            {/* Typeform Panels - Research & Projects */}
            <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
              {/* Research Panel */}
              <div className="relative rounded-2xl border-2 border-border bg-background p-8 lg:p-10 hover:border-foreground transition-all duration-300 hover:shadow-lg">
                <div className="mb-6">
                  <h3 className="font-display font-bold text-3xl text-foreground mb-3">Research</h3>
                  <p className="text-base text-muted-foreground leading-relaxed">
                    Protocol analysis, technical audits, architecture reviews, and custom research tailored to your needs.
                  </p>
                </div>

                <div className="mb-8 space-y-3">
                  <div className="flex items-start gap-3">
                    <span className="text-foreground mt-1">✓</span>
                    <span className="text-sm text-muted-foreground">In-depth protocol analysis</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-foreground mt-1">✓</span>
                    <span className="text-sm text-muted-foreground">Technical audits and reviews</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-foreground mt-1">✓</span>
                    <span className="text-sm text-muted-foreground">Architecture consultations</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-foreground mt-1">✓</span>
                    <span className="text-sm text-muted-foreground">Custom research projects</span>
                  </div>
                </div>

                <a
                  href={researchFormUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center justify-center w-full px-6 py-4 rounded-lg text-white font-medium bg-foreground hover:bg-accent-hover shadow-sm hover:shadow-lg transition-all duration-200 hover:translate-y-[-2px]"
                >
                  <span>Start Research Inquiry</span>
                  <span className="ml-2 text-lg group-hover:translate-x-1 transition-transform">→</span>
                </a>
                <p className="text-xs text-muted-foreground mt-3 text-center">Opens in a new window</p>
              </div>

              {/* Projects Panel */}
              <div className="relative rounded-2xl border-2 border-border bg-background p-8 lg:p-10 hover:border-foreground transition-all duration-300 hover:shadow-lg">
                <div className="mb-6">
                  <h3 className="font-display font-bold text-3xl text-foreground mb-3">Projects</h3>
                  <p className="text-base text-muted-foreground leading-relaxed">
                    Full-stack Web3 development from smart contracts to dApp interfaces. Production-grade systems that scale.
                  </p>
                </div>

                <div className="mb-8 space-y-3">
                  <div className="flex items-start gap-3">
                    <span className="text-foreground mt-1">✓</span>
                    <span className="text-sm text-muted-foreground">Smart contract development</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-foreground mt-1">✓</span>
                    <span className="text-sm text-muted-foreground">Full-stack dApp building</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-foreground mt-1">✓</span>
                    <span className="text-sm text-muted-foreground">Protocol design & implementation</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-foreground mt-1">✓</span>
                    <span className="text-sm text-muted-foreground">Infrastructure & scalability</span>
                  </div>
                </div>

                <a
                  href={projectsFormUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center justify-center w-full px-6 py-4 rounded-lg text-white font-medium bg-foreground hover:bg-accent-hover shadow-sm hover:shadow-lg transition-all duration-200 hover:translate-y-[-2px]"
                >
                  <span>Start Project Inquiry</span>
                  <span className="ml-2 text-lg group-hover:translate-x-1 transition-transform">→</span>
                </a>
                <p className="text-xs text-muted-foreground mt-3 text-center">Opens in a new window</p>
              </div>
            </div>

            {/* Contact Info & Socials - Below Panels */}
            <div className="mt-12 pt-12">
              <div className="grid md:grid-cols-3 gap-12">
                {/* Email */}
                <div>
                  <p className="text-xs font-semibold text-muted-foreground tracking-wider mb-4 uppercase">Email</p>
                  <a
                    href="mailto:hello@elysium.dev"
                    className="text-xl font-medium text-foreground hover:underline transition-all inline-flex items-center gap-2"
                  >
                    hello@elysium.dev
                    <span className="text-lg">↗</span>
                  </a>
                </div>

                {/* Response Time */}
                <div>
                  <p className="text-xs font-semibold text-muted-foreground tracking-wider mb-4 uppercase">
                    Response Time
                  </p>
                  <p className="text-xl text-foreground font-medium">Within 24 hours</p>
                </div>

                {/* Social Links */}
                <div>
                  <p className="text-xs font-semibold text-muted-foreground tracking-wider mb-4 uppercase">Connect</p>
                  <div className="flex flex-wrap gap-3">
                    <a
                      href="https://twitter.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group p-3 rounded-lg border border-border hover:border-foreground bg-background hover:bg-muted/30 transition-all duration-200"
                      aria-label="Twitter"
                    >
                      <svg className="w-5 h-5 text-foreground" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                      </svg>
                    </a>
                    <a
                      href="https://github.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group p-3 rounded-lg border border-border hover:border-foreground bg-background hover:bg-muted/30 transition-all duration-200"
                      aria-label="GitHub"
                    >
                      <svg className="w-5 h-5 text-foreground" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                      </svg>
                    </a>
                    <a
                      href="https://elysium.substack.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group p-3 rounded-lg border border-border hover:border-foreground bg-background hover:bg-muted/30 transition-all duration-200"
                      aria-label="Substack"
                    >
                      <svg className="w-5 h-5 text-foreground" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M22.539 8.242H1.46V5.406h21.08v2.836zM1.46 10.812V24l10.54-5.91L22.54 24V10.812H1.46zM22.54 0H1.46v2.836h21.08V0z" />
                      </svg>
                    </a>
                    <a
                      href="https://farcaster.cast"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group p-3 rounded-lg border border-border hover:border-foreground bg-background hover:bg-muted/30 transition-all duration-200"
                      aria-label="Farcaster"
                    >
                      <svg className="w-5 h-5 text-foreground" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M9.093 8.647c-.233-.256-.577-.384-.921-.384s-.688.128-.921.384L4.536 11.82c-.233.256-.349.601-.349.946v3.157c0 .345.116.69.349.946l2.115 2.173c.233.256.577.384.921.384s.688-.128.921-.384l2.115-2.173c.233-.256.349-.601.349-.946v-3.157c0-.345-.116-.69-.349-.946L9.093 8.647zm-1.842 3.65v3.157l-2.115-2.173v-3.157l2.115 2.173zm13.498-3.65c-.233-.256-.577-.384-.921-.384s-.688.128-.921.384l-2.115 2.173c-.233.256-.349.601-.349.946v3.157c0 .345.116.69.349.946l2.115 2.173c.233.256.577.384.921.384s.688-.128.921-.384l2.115-2.173c.233-.256.349-.601.349-.946v-3.157c0-.345-.116-.69-.349-.946L20.749 8.647zm-1.842 3.65v3.157l-2.115-2.173v-3.157l2.115 2.173z" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="px-4 sm:px-6 lg:px-8 py-20 border-t border-border bg-muted/30">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-display font-bold text-3xl text-foreground mb-8">Frequently Asked</h2>
            <div className="space-y-8">
              {[
                {
                  q: "What types of projects do you work on?",
                  a: "We specialize in Web3 infrastructure, smart contracts, protocols, and full-stack dApps. From concept to production.",
                },
                {
                  q: "What's your typical project timeline?",
                  a: "Projects typically range from 4-16 weeks depending on scope. We discuss timelines during the initial consultation.",
                },
                {
                  q: "Do you offer research and analysis?",
                  a: "Yes. We provide protocol analysis, technical audits, architecture reviews, and custom research tailored to your needs.",
                },
                {
                  q: "How do you ensure code quality?",
                  a: "Rigorous testing, security audits, code reviews, and industry best practices throughout the development process.",
                },
              ].map((faq, i) => (
                <div key={i}>
                  <h3 className="font-display font-bold text-lg text-foreground mb-2">{faq.q}</h3>
                  <p className="text-base text-muted-foreground leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
