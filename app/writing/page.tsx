"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Header } from "@/components/header"

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

const ITEMS_PER_PAGE = 9

export default function WritingPage() {
  const router = useRouter()
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [categories, setCategories] = useState<string[]>(["All"])
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
    router.push(`/writing/${slug}`)
  }

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true)
        // Fetch parsed articles from our API route - use cache by default for performance
        // Only add refresh=true if you explicitly want to bypass cache
        const response = await fetch("/api/substack")
        
        if (!response.ok) {
          throw new Error("Failed to fetch articles")
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
        } else {
          setArticles([])
        }
      } catch (error) {
        console.error("Error fetching articles from Substack:", error)
        // Set articles to empty array on error
        setArticles([])
      } finally {
        setLoading(false)
      }
    }

    fetchArticles()
  }, [])

  // Filter articles by category and search query
  const filteredArticles = articles.filter((article) => {
    // Category filter
    const matchesCategory = selectedCategory === "All" || article.category === selectedCategory
    
    // Search filter - search in title, excerpt, and category
    const matchesSearch = searchQuery.trim() === "" || 
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.category.toLowerCase().includes(searchQuery.toLowerCase())
    
    return matchesCategory && matchesSearch
  })
  
  // Reset to page 1 when search query or category changes
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, selectedCategory])

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
      <main className="pt-20 sm:pt-24 pb-12 sm:pb-16 lg:pb-24 min-h-screen">
        {/* Search and Filters */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="mb-8 sm:mb-12">
            <p className="text-xs font-semibold text-muted-foreground tracking-wider mb-3 sm:mb-4">WRITING</p>
            <h1 className="font-display font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-foreground leading-tight mb-4 sm:mb-6 text-balance">
              We Focus Our Writing on Topics That Align with Our Core Interests
            </h1>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between mb-6 sm:mb-8">
            {/* Search */}
            <div className="relative w-full sm:w-80">
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-muted rounded-none px-4 py-1.5 sm:py-2 pl-10 text-foreground placeholder-muted-foreground focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                style={{ 
                  border: 'none',
                  borderWidth: '0',
                  borderStyle: 'none',
                  boxShadow: 'inset 0 0 0 1px var(--border)',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.boxShadow = 'inset 0 0 0 1px var(--foreground)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.boxShadow = 'inset 0 0 0 1px var(--border)';
                }}
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
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => {
                    setSelectedCategory(category)
                    setCurrentPage(1)
                  }}
                  className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-none font-medium text-xs sm:text-sm whitespace-nowrap transition-all duration-200 ${
                    selectedCategory === category
                      ? "bg-foreground text-white border border-foreground"
                      : "bg-transparent border border-border text-muted-foreground hover:border-foreground hover:text-foreground"
                  }`}
                >
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
                  className="group cursor-pointer bg-background rounded-none overflow-hidden border border-border hover:border-foreground transition-all hover:shadow-lg"
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
                    <div className="absolute top-3 right-3 text-muted-foreground text-xs font-medium">
                      {new Date(article.pubDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </div>
                  </div>

                  {/* Article Content */}
                  <div className="p-5">
                    <span className="inline-block bg-foreground text-white text-xs font-semibold px-3 py-1 rounded-full uppercase mb-3">
                      {article.category}
                    </span>
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
            <div className="mt-8 sm:mt-12 mb-6 sm:mb-8">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-xs sm:text-sm text-muted-foreground text-center sm:text-left">
                  Showing {startIndex + 1} - {Math.min(endIndex, filteredArticles.length)} of {filteredArticles.length} posts
                </p>

                <div className="flex items-center gap-1 sm:gap-2 flex-wrap justify-center">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-none bg-background border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>

                  {getPageNumbers().map((page, index) => (
                    <button
                      key={index}
                      onClick={() => typeof page === 'number' && handlePageChange(page)}
                      disabled={page === '...'}
                      className={`min-w-8 h-8 sm:min-w-10 sm:h-10 px-2 sm:px-3 rounded-none font-medium text-xs sm:text-sm transition-all ${
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
                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-none bg-background border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  )
}