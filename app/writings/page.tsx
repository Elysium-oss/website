"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft, ChevronRight } from "lucide-react"
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
  content?: string
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
  {
    id: "5",
    title: "Understanding Zero-Knowledge Proofs",
    excerpt: "A deep dive into the mathematics and cryptography behind zero-knowledge proofs and their applications in blockchain.",
    pubDate: "2025-01-30",
    category: "Research",
    author: "Pavel Paramonov",
    readTime: "14 min read",
  },
  {
    id: "6",
    title: "The Future of Layer 2 Scaling",
    excerpt: "Exploring the next generation of Layer 2 solutions and their impact on blockchain scalability.",
    pubDate: "2025-01-23",
    category: "Infrastructure",
    author: "Nitin Jakhar",
    readTime: "11 min read",
  },
  {
    id: "7",
    title: "Decentralized Identity Systems",
    excerpt: "How blockchain-based identity systems are revolutionizing digital authentication and privacy.",
    pubDate: "2025-01-16",
    category: "Protocol Design",
    author: "Ishita Rastogi",
    readTime: "9 min read",
  },
  {
    id: "8",
    title: "Cross-Chain Interoperability Challenges",
    excerpt: "Analyzing the technical and economic challenges of achieving true cross-chain interoperability.",
    pubDate: "2025-01-09",
    category: "Architecture Breakdowns",
    author: "Pavel Paramonov",
    readTime: "13 min read",
  },
  {
    id: "9",
    title: "MEV: The Invisible Tax on DeFi",
    excerpt: "Understanding Maximal Extractable Value and its implications for decentralized finance.",
    pubDate: "2025-01-02",
    category: "Research",
    author: "Nitin Jakhar, Ishita Rastogi",
    readTime: "10 min read",
  },
]

const ITEMS_PER_PAGE = 9

export default function WritingsPage() {
  const router = useRouter()
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [articles, setArticles] = useState<Article[]>(FALLBACK_ARTICLES)
  const [loading, setLoading] = useState(true)
  const [categories, setCategories] = useState<string[]>(["All", "Protocol Design", "Infrastructure", "Architecture Breakdowns", "Research"])
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState("")

  /**
   * Generate a slug from article ID or extract from link
   */
  const getArticleSlug = (article: Article): string => {
    // Try to extract slug from link first
    if (article.link) {
      const slugMatch = article.link.match(/\/p\/([^/?]+)/)
      if (slugMatch && slugMatch[1]) {
        return slugMatch[1]
      }
    }
    // Fallback to article ID (clean it up)
    return article.id.replace(/^article-/, '').toLowerCase()
  }

  const handleArticleClick = (article: Article) => {
    const slug = getArticleSlug(article)
    // Navigate to the article page
    router.push(`/writings/${slug}`)
  }

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true)
        // Fetch parsed articles from our API route with cache-busting for latest articles
        const response = await fetch("/api/substack?refresh=true")
        
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
            content: article.content, // Include RSS content (excerpt) initially
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

  const totalPages = Math.ceil(filteredArticles.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const currentArticles = filteredArticles.slice(startIndex, endIndex)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const getPageNumbers = () => {
    const pages = []
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages)
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages)
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages)
      }
    }
    return pages
  }

  return (
    <>
      <Header />
      <main className="pt-24 pb-24 min-h-screen">
        {/* Search and Filters */}
        <div className="max-w-7xl mx-auto px-6 sm:px-8 py-8">
          <div className="mb-12">
            <p className="text-xs font-semibold text-muted-foreground tracking-wider mb-4">WRITING</p>
            <h1 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl text-foreground leading-tight mb-6 text-balance">
              We Focus Our Writing on Topics That Align with Our Core Interests
            </h1>
          </div>

          <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-8">
            {/* Search */}
            <div className="relative w-full md:w-96">
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-muted border border-border rounded-lg px-4 py-3 pl-10 text-foreground placeholder-muted-foreground focus:outline-none focus:border-foreground"
              />
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  ×
                </button>
              )}
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap items-center gap-3">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => {
                    setSelectedCategory(category)
                    setCurrentPage(1)
                  }}
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

          {/* Articles Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-muted rounded-lg h-48 mb-4" />
                  <div className="h-4 bg-muted rounded w-20 mb-3" />
                  <div className="h-6 bg-muted rounded w-3/4 mb-2" />
                  <div className="h-4 bg-muted rounded w-full" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentArticles.map((article) => (
                <article
                  key={article.id}
                  onClick={() => handleArticleClick(article)}
                  className="group cursor-pointer bg-background rounded-lg overflow-hidden border border-border hover:border-foreground transition-all hover:shadow-lg"
                >
                  {/* Article Image */}
                  <div className="relative h-48 bg-muted overflow-hidden border-b border-border">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <svg
                        className="w-16 h-16 text-foreground opacity-40"
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
                    <div className="absolute top-3 left-3">
                      <span className="bg-foreground text-white text-xs font-semibold px-3 py-1 rounded-full uppercase">
                        {article.category}
                      </span>
                    </div>
                    <div className="absolute top-3 right-3 text-muted-foreground text-xs font-medium">
                      {new Date(article.pubDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </div>
                  </div>

                  {/* Article Content */}
                  <div className="p-5">
                    <h3 className="font-display font-bold text-lg text-foreground mb-2 line-clamp-2 group-hover:text-muted-foreground transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-2">
                      {article.excerpt}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-12 mb-8">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Showing {startIndex + 1} - {Math.min(endIndex, filteredArticles.length)} of {filteredArticles.length} posts
                </p>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="w-10 h-10 rounded-lg bg-background border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  {getPageNumbers().map((page, index) => (
                    <button
                      key={index}
                      onClick={() => typeof page === 'number' && handlePageChange(page)}
                      disabled={page === '...'}
                      className={`min-w-10 h-10 px-3 rounded-lg font-medium text-sm transition-all ${
                        page === currentPage
                          ? "bg-foreground text-white"
                          : page === '...'
                          ? "text-muted-foreground cursor-default"
                          : "bg-background border border-border text-muted-foreground hover:text-foreground hover:border-foreground"
                      }`}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="w-10 h-10 rounded-lg bg-background border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}