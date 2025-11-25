"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Header } from "@/components/header"
import { usePostHog } from "posthog-js/react"

interface Article {
  id: string
  title: string
  excerpt: string
  pubDate: string
  category: string
  author: string
  authorImage?: string
  readTime: string
  image?: string
  link?: string
  content?: string
}

const ITEMS_PER_PAGE = 9

export default function WritingPage() {
  const router = useRouter()
  const posthog = usePostHog()
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [categories, setCategories] = useState<string[]>(["All"])
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState("")

  /**
   * Sanitize text by removing CDATA wrappers
   */
  const sanitizeText = (text: string): string => {
    if (!text) return ''
    return text.replace(/<!\[CDATA\[(.*?)\]\]>/g, '$1').trim()
  }

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
    posthog?.capture("article_open", {
      id: article.id,
      title: article.title,
      category: article.category,
      location: "writing_list",
    })
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
            authorImage: article.authorImage,
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

  // Get the latest article (first one from sorted articles by date)
  const sortedByDate = [...articles].sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime())
  const latestArticle = sortedByDate.length > 0 ? sortedByDate[0] : null

  // Filter out the latest article from the grid (only if it matches current filters)
  const articlesWithoutLatest = filteredArticles.filter(article => article.id !== latestArticle?.id)
  
  const totalPages = Math.ceil(articlesWithoutLatest.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const currentArticles = articlesWithoutLatest.slice(startIndex, endIndex)

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
          {/* Featured Latest Article */}
          {!loading && latestArticle && (
            <div 
              onClick={() => handleArticleClick(latestArticle)}
              className="mb-8 sm:mb-12 cursor-pointer"
            >
              <div className="bg-gradient-to-br from-white/50 via-white/30 to-white/10 dark:from-white/5 dark:via-white/10 dark:to-white/5 border border-border overflow-hidden flex flex-col lg:flex-row">
                {/* Left: Text Content */}
                <div className="flex-1 p-6 sm:p-8 lg:p-10 flex flex-col justify-between">
                  <div>
                    {/* Category Tag and Date */}
                    <div className="mb-4 sm:mb-6 flex items-center justify-between gap-4">
                      <span className="inline-block bg-muted text-foreground text-xs font-semibold px-3 sm:px-4 py-1.5 sm:py-2 rounded-full uppercase">
                        {latestArticle.category || "RESEARCH"}
                      </span>
                      <span className="text-xs sm:text-sm text-muted-foreground">
                        {new Date(latestArticle.pubDate).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                    
                    {/* Title */}
                    <h2 className="font-display font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-foreground mb-3 sm:mb-4 leading-tight">
                      {latestArticle.title}
                    </h2>
                    
                    {/* Excerpt */}
                    <p className="text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed mb-6 sm:mb-8 line-clamp-3">
                      {latestArticle.excerpt}
                    </p>
                  </div>
                  
                  {/* Author */}
                  <div className="flex items-center gap-3">
                    {latestArticle.authorImage ? (
                      <img 
                        src={latestArticle.authorImage} 
                        alt={sanitizeText(latestArticle.author)}
                        className="w-6 h-6 sm:w-7 sm:h-7 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-muted flex items-center justify-center">
                        <span className="text-xs font-medium text-foreground">
                          {sanitizeText(latestArticle.author).charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                    <span className="text-base sm:text-lg text-foreground font-medium">
                      {sanitizeText(latestArticle.author)}
                    </span>
                  </div>
                </div>
                
                {/* Right: Image */}
                <div className="w-full lg:w-96 h-64 sm:h-80 lg:h-auto bg-muted relative overflow-hidden my-6 sm:my-8 lg:my-10 mx-4 sm:mx-6 lg:mx-8 lg:mx-10">
                  {latestArticle.image ? (
                    <img
                      src={latestArticle.image}
                      alt={latestArticle.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <svg
                        className="w-16 h-16 sm:w-24 sm:h-24 text-foreground opacity-40"
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
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Loading state for featured article */}
          {loading && (
            <div className="mb-8 sm:mb-12 animate-pulse">
              <div className="bg-gradient-to-br from-white/50 via-white/30 to-white/10 dark:from-white/5 dark:via-white/10 dark:to-white/5 border border-border flex flex-col lg:flex-row">
                <div className="flex-1 p-6 sm:p-8 lg:p-10">
                  <div className="h-6 bg-muted rounded w-32 mb-4"></div>
                  <div className="h-8 bg-muted rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-muted rounded w-full mb-2"></div>
                  <div className="h-4 bg-muted rounded w-5/6 mb-6"></div>
                  <div className="h-10 bg-muted rounded w-1/2"></div>
                </div>
                <div className="w-full lg:w-96 h-64 sm:h-80 lg:h-auto bg-muted my-6 sm:my-8 lg:my-10 mx-4 sm:mx-6 lg:mx-8 lg:mx-10"></div>
              </div>
            </div>
          )}

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
                  onClick={() => {
                    posthog?.capture("writing_search_clear")
                    setSearchQuery("")
                  }}
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
                    posthog?.capture("writing_category_select", { category })
                    setSelectedCategory(category)
                    setCurrentPage(1)
                  }}
                  className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-none font-medium text-xs sm:text-sm whitespace-nowrap transition-all duration-200 cursor-pointer ${
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
                  className="cursor-pointer bg-background rounded-none overflow-hidden border border-border"
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
                    <span className="inline-block bg-muted text-muted-foreground text-xs font-semibold px-3 py-1 rounded-full uppercase mb-3">
                      {article.category}
                    </span>
                    <h3 className="font-display font-bold text-lg text-foreground mb-2 line-clamp-2">
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
                  onClick={() => {
                    posthog?.capture("writing_page_change", { to: currentPage - 1, action: "prev" })
                    handlePageChange(currentPage - 1)
                  }}
                    disabled={currentPage === 1}
                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-none bg-background border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>

                  {getPageNumbers().map((page, index) => (
                    <button
                      key={index}
                    onClick={() => {
                      if (typeof page === 'number') {
                        posthog?.capture("writing_page_change", { to: page, action: "page" })
                        handlePageChange(page)
                      }
                    }}
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
                  onClick={() => {
                    posthog?.capture("writing_page_change", { to: currentPage + 1, action: "next" })
                    handlePageChange(currentPage + 1)
                  }}
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