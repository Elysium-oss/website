"use client"

import { useState, useEffect } from "react"

interface Article {
  id: string
  title: string
  excerpt: string
  pubDate: string
  link: string
  category: string
}

export function Articles() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        // Mock articles - replace with actual RSS fetch in production
        const mockArticles: Article[] = [
          {
            id: "1",
            title: "Understanding Proof of Stake: A Deep Dive into Consensus Mechanisms",
            excerpt:
              "Explore the technical foundations of Proof of Stake and how it revolutionizes blockchain consensus. Learn the economics, security implications, and real-world implementations.",
            pubDate: "2025-02-28",
            link: "https://elysium.substack.com",
            category: "Protocol Design",
          },
          {
            id: "2",
            title: "The Future of Smart Contract Security: Formal Verification and Beyond",
            excerpt:
              "Dive into the cutting-edge approaches to securing smart contracts. From formal verification to runtime monitoring, discover how projects are building bulletproof dApps.",
            pubDate: "2025-02-21",
            link: "https://elysium.substack.com",
            category: "Security",
          },
          {
            id: "3",
            title: "Cross-Chain Communication: Bridges, Messaging, and Interoperability",
            excerpt:
              "As multi-chain becomes the norm, understanding cross-chain communication is essential. We break down bridges, messaging protocols, and the trade-offs involved.",
            pubDate: "2025-02-14",
            link: "https://elysium.substack.com",
            category: "Infrastructure",
          },
        ]

        setArticles(mockArticles)
      } catch (error) {
        console.error("Failed to fetch articles:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchArticles()
  }, [])

  return (
    <section id="articles" className="relative py-24 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="absolute top-0 right-0 w-96 h-96 bg-muted rounded-full blur-3xl opacity-10 -z-10 pointer-events-none" />

      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="mb-16">
          <h2 className="font-display font-bold text-5xl sm:text-6xl text-foreground mb-4">
            Latest <span className="text-muted-foreground">Research</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Cutting-edge analysis on Web3 protocols and decentralized technologies.
          </p>
        </div>

        {/* Articles Grid */}
        {loading ? (
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-40 bg-muted rounded-lg mb-4" />
                <div className="h-4 bg-muted rounded mb-2" />
                <div className="h-4 bg-muted rounded w-3/4" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {articles.map((article) => (
              <a
                key={article.id}
                href={article.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative p-6 rounded-2xl border-2 border-border hover:border-foreground bg-background hover:bg-muted/50 hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col"
              >
                <div className="absolute top-0 left-0 right-0 h-1 bg-foreground opacity-0 group-hover:opacity-100 transition-opacity" />

                {/* Category Tag */}
                <div className="inline-flex mb-4 w-fit">
                  <span className="px-3 py-1 text-xs font-semibold text-foreground bg-muted rounded-full group-hover:bg-foreground group-hover:text-white transition-all">
                    {article.category}
                  </span>
                </div>

                {/* Title */}
                <h3 className="font-display font-bold text-xl text-foreground mb-3 line-clamp-2 transition-colors flex-grow">
                  {article.title}
                </h3>

                {/* Excerpt */}
                <p className="text-sm text-muted-foreground leading-relaxed mb-6 line-clamp-3">{article.excerpt}</p>

                {/* Meta */}
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <time className="text-xs text-muted-foreground">
                    {new Date(article.pubDate).toLocaleDateString()}
                  </time>
                  <span className="text-foreground font-medium text-sm group-hover:translate-x-1 transition-transform">
                    →
                  </span>
                </div>
              </a>
            ))}
          </div>
        )}

        {/* View All Button */}
        <div className="text-center">
          <a
            href="https://elysium.substack.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex px-8 py-3 rounded-lg border-2 border-foreground text-foreground font-medium text-base hover:bg-foreground hover:text-white shadow-sm hover:shadow-md hover:translate-y-[-2px] transition-all"
          >
            View All Articles
          </a>
        </div>
      </div>
    </section>
  )
}
