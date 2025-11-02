"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

interface Article {
  id: string
  title: string
  excerpt: string
  pubDate: string
  category: string
  author: string
  readTime: string
  image?: string
  link?: string
}

// Fallback articles if RSS feed fails to load
const FALLBACK_ARTICLES: Article[] = [
  {
    id: "1",
    title: "Blobobonomics & the New Attack Surface: How Ethereum Is Hardening Its DA Layer",
    excerpt: "EIP-4844's Blob Pricing Created a New Attack Vector, Forcing Rollups to Design Smarter Economic Defenses",
    pubDate: "2025-02-28",
    category: "Protocol Design",
    author: "Ishita Rastogi",
    readTime: "12 min read",
  },
  {
    id: "2",
    title: "Stablecoin Chains for Institutions (Part II)",
    excerpt:
      "How stablecoin L1s will win the distribution war through tokenized FX, agentic payments, invisible infrastructure, and branded partnerships to onboard billions via institutions.",
    pubDate: "2025-02-21",
    category: "Infrastructure",
    author: "Pavel Paramonov, Nitin Jakhar",
    readTime: "15 min read",
  },
  {
    id: "3",
    title: "Raiku: Solving Solana's Biggest Pain Points",
    excerpt:
      "Despite its high speed and low fees, Solana lacks the deterministic execution guarantee required to unlock institutional adoption, particularly during periods of network congestion.",
    pubDate: "2025-02-14",
    category: "Architecture Breakdowns",
    author: "Ishita Rastogi, Pavel Paramonov",
    readTime: "10 min read",
  },
  {
    id: "4",
    title: "Flying Tulip: Using Yield Instead of Fundraising",
    excerpt:
      "A New Crypto Fundraising Model That Uses Yield to Fund Operations and Scale Without Traditional Venture Capital.",
    pubDate: "2025-02-07",
    category: "Research",
    author: "Ishita Rastogi",
    readTime: "8 min read",
  },
]

export default function WritingsPage() {
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [articles, setArticles] = useState<Article[]>(FALLBACK_ARTICLES)
  const [loading, setLoading] = useState(true)
  const [categories, setCategories] = useState<string[]>(["All", "Protocol Design", "Infrastructure", "Architecture Breakdowns", "Research"])

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true)
        // Fetch parsed articles from our API route
        const response = await fetch("/api/substack")
        
        if (!response.ok) {
          throw new Error("Failed to fetch RSS feed")
        }

        const data = await response.json()
        const parsedArticles = data.articles || []

        if (parsedArticles.length > 0) {
          // Map parsed articles to our Article interface
          const mappedArticles: Article[] = parsedArticles.map((article: any) => ({
            id: article.id,
            title: article.title,
            excerpt: article.excerpt,
            pubDate: article.pubDate,
            category: article.category || "Research", // Default category
            author: article.author,
            readTime: article.readTime,
            image: article.image,
            link: article.link,
          }))

          setArticles(mappedArticles)

          // Extract unique categories
          const uniqueCategories = new Set<string>(["All"])
          mappedArticles.forEach((article) => {
            if (article.category) {
              uniqueCategories.add(article.category)
            }
          })
          setCategories(Array.from(uniqueCategories))
        }
      } catch (error) {
        console.error("Error fetching articles from Substack:", error)
        // Keep fallback articles
        setArticles(FALLBACK_ARTICLES)
      } finally {
        setLoading(false)
      }
    }

    fetchArticles()
  }, [])

  const filteredArticles =
    selectedCategory === "All" ? articles : articles.filter((article) => article.category === selectedCategory)

  return (
    <>
      <Header />
      <main className="pt-24 pb-24 min-h-screen">
        {/* Split Layout */}
        <div className="flex flex-col lg:flex-row">
          {/* Left Sidebar - Header and Filters */}
          <aside className="lg:w-1/2 lg:border-r lg:border-border lg:sticky lg:top-24 lg:h-[calc(100vh-6rem)] lg:overflow-y-auto">
            <div className="px-6 sm:px-8 lg:px-12 lg:py-16 py-8 lg:pr-16">
              <div className="mb-12">
                <p className="text-xs font-semibold text-muted-foreground tracking-wider mb-4">WRITING</p>
                <h1 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl text-foreground leading-tight mb-6 text-balance">
                  We Focus Our Writing on Topics That Align with Our Core Interests
                </h1>
              </div>

              {/* Category Filter */}
              <div className="flex flex-wrap items-center gap-3">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-all duration-200 ${
                      selectedCategory === category
                        ? "bg-foreground text-white border border-foreground"
                        : "bg-transparent border border-border text-muted-foreground hover:border-foreground hover:text-foreground"
                    }`}
                  >
                    {selectedCategory === category && "◆ "}
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Right Content - Articles List */}
          <section className="lg:w-1/2 lg:px-12 lg:py-16 px-6 sm:px-8 py-8">
            <div className="space-y-0">
              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse flex gap-4 pb-8 border-b border-border">
                      <div className="w-20 h-20 rounded-md bg-muted" />
                      <div className="flex-grow space-y-2">
                        <div className="h-4 bg-muted rounded w-24" />
                        <div className="h-6 bg-muted rounded w-3/4" />
                        <div className="h-4 bg-muted rounded w-full" />
                        <div className="h-3 bg-muted rounded w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                filteredArticles.map((article) => (
                  <a
                    key={article.id}
                    href={article.link || "https://elysium.substack.com"}
                    target="_blank"
                    rel="noopener noreferrer"
                  className="group flex gap-4 pb-8 border-b border-border hover:border-foreground transition-colors last:border-0"
                >
                  {/* Article Image Placeholder */}
                  <div className="hidden sm:block flex-shrink-0 w-20 h-20 rounded-md bg-muted border border-border overflow-hidden group-hover:border-foreground transition-colors">
                    <div className="w-full h-full bg-muted flex items-center justify-center">
                      <svg
                        className="w-8 h-8 text-foreground opacity-40"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                  </div>

                  {/* Article Content */}
                  <div className="flex-grow min-w-0">
                    <div className="mb-2 flex items-center gap-2">
                      <span className="px-2 py-0.5 text-xs font-semibold text-foreground bg-muted rounded-full group-hover:bg-foreground group-hover:text-white transition-all">
                        {article.category}
                      </span>
                    </div>

                    <h2 className="font-display font-bold text-lg sm:text-xl text-foreground mb-2 transition-colors line-clamp-2 leading-tight">
                      {article.title}
                    </h2>

                    <p className="text-sm text-muted-foreground leading-relaxed mb-3 line-clamp-2">
                      {article.excerpt}
                    </p>

                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <time>
                        {new Date(article.pubDate).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </time>
                      <span>•</span>
                      <span>By {article.author}</span>
                      <span>•</span>
                      <span>{article.readTime}</span>
                    </div>
                  </div>
                </a>
              ))
              )}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  )
}
