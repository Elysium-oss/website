"use client"

import type React from "react"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function ContactPage() {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    company: "",
    message: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log("Form submitted:", formState)
    setFormState({ name: "", email: "", company: "", message: "" })
  }

  return (
    <>
      <Header />
      <main className="pt-24 pb-24">
        {/* Hero Section */}
        <section className="px-4 sm:px-6 lg:px-8 py-16 border-b border-border">
          <div className="max-w-4xl mx-auto">
            <p className="text-xs font-semibold text-muted-foreground tracking-wider mb-4">CONTACT</p>
            <h1 className="font-display font-bold text-6xl sm:text-7xl text-foreground leading-tight mb-8 text-balance">
              Let's Build Together
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Have a project in mind? Want to collaborate? We'd love to hear from you.
            </p>
          </div>
        </section>

        {/* Contact Section */}
        <section className="px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-12">
            {/* Contact Info */}
            <div className="md:col-span-1">
              <div className="space-y-8">
                <div>
                  <p className="text-xs font-semibold text-muted-foreground tracking-wider mb-2">EMAIL</p>
                  <a
                    href="mailto:hello@elysium.dev"
                    className="text-lg font-medium text-foreground transition-colors"
                  >
                    hello@elysium.dev
                  </a>
                </div>

                <div>
                  <p className="text-xs font-semibold text-muted-foreground tracking-wider mb-2">SOCIAL</p>
                  <div className="space-y-3">
                    <a
                      href="https://twitter.com/elysium"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-foreground transition-colors font-medium"
                    >
                      Twitter
                    </a>
                    <a
                      href="https://github.com/elysium"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-foreground transition-colors font-medium"
                    >
                      GitHub
                    </a>
                    <a
                      href="https://elysium.substack.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-foreground transition-colors font-medium"
                    >
                      Substack
                    </a>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold text-muted-foreground tracking-wider mb-2">RESPONSE TIME</p>
                  <p className="text-foreground font-medium">Within 24 hours</p>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <form onSubmit={handleSubmit} className="md:col-span-2 space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={formState.name}
                  onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                  required
                  className="w-full px-4 py-3 rounded-lg border-2 border-border bg-background text-foreground placeholder:text-muted-foreground focus:border-foreground focus:ring-0 outline-none transition-colors"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={formState.email}
                  onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                  required
                  className="w-full px-4 py-3 rounded-lg border-2 border-border bg-background text-foreground placeholder:text-muted-foreground focus:border-foreground focus:ring-0 outline-none transition-colors"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label htmlFor="company" className="block text-sm font-medium text-foreground mb-2">
                  Company (Optional)
                </label>
                <input
                  type="text"
                  id="company"
                  value={formState.company}
                  onChange={(e) => setFormState({ ...formState, company: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border-2 border-border bg-background text-foreground placeholder:text-muted-foreground focus:border-foreground focus:ring-0 outline-none transition-colors"
                  placeholder="Your company"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  value={formState.message}
                  onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                  required
                  rows={5}
                  className="w-full px-4 py-3 rounded-lg border-2 border-border bg-background text-foreground placeholder:text-muted-foreground focus:border-foreground focus:ring-0 outline-none transition-colors resize-none"
                  placeholder="Tell us about your project..."
                />
              </div>

              <button
                type="submit"
                className="w-full px-6 py-3 rounded-lg text-white font-medium bg-foreground hover:bg-accent-hover shadow-sm hover:shadow-md transition-all hover:translate-y-[-2px]"
              >
                Send Message
              </button>
            </form>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="px-4 sm:px-6 lg:px-8 py-20 border-t border-border bg-muted/30">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-display font-bold text-3xl text-foreground mb-12">Frequently Asked</h2>
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
      <Footer />
    </>
  )
}
