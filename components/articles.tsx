"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

interface Article {
  id: string
  title: string
  excerpt: string
  pubDate: string
  link: string
  category: string
}

export function Articles() {
  const router = useRouter()
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)

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
    router.push(`/writing/${slug}`)
  }

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true)
        // Fetch parsed articles from our API route
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
            link: article.link,
          }))

          // Sort by publication date (newest first) and take the first 3
          const latestArticles = mappedArticles
            .sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime())
            .slice(0, 3)

          setArticles(latestArticles)
        } else {
          setArticles([])
        }
      } catch (error) {
        console.error("Failed to fetch articles:", error)
        setArticles([])
      } finally {
        setLoading(false)
      }
    }

    fetchArticles()
  }, [])

  return (
    <section id="articles" className="relative py-24 px-4 sm:px-6 lg:px-8 bg-background border-b border-border">
      <div className="absolute top-0 right-0 w-96 h-96 bg-muted rounded-full blur-3xl opacity-10 -z-10 pointer-events-none" />

      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="mb-16 text-center">
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
        ) : articles.length > 0 ? (
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {articles.map((article) => (
              <button
                key={article.id}
                onClick={() => handleArticleClick(article)}
                className="group relative p-6 rounded-2xl border-2 border-border hover:border-foreground bg-background hover:bg-muted/50 hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col text-left cursor-pointer"
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
              </button>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No articles available at the moment.</p>
          </div>
        )}

        {/* View All Button */}
        <div className="text-center">
          <button
            onClick={() => router.push("/writing")}
            className="inline-flex px-8 py-3 rounded-lg border-2 border-foreground text-foreground font-medium text-base hover:bg-foreground hover:text-white shadow-sm hover:shadow-md hover:translate-y-[-2px] transition-all"
          >
            View All Articles
          </button>
        </div>
      </div>
    </section>
  )
}
