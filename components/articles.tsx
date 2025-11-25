"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { usePostHog } from "posthog-js/react"

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
  const posthog = usePostHog()
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
    posthog?.capture("article_open", {
      id: article.id,
      title: article.title,
      category: article.category,
      location: "home_latest_articles",
    })
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
    <section id="articles" className="relative py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-background border-b border-border">
      <div className="absolute top-0 right-0 w-96 h-96 bg-muted rounded-full blur-3xl opacity-10 -z-10 pointer-events-none" />

      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="mb-8 sm:mb-12 lg:mb-16 text-center">
          <h2 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-foreground mb-3 sm:mb-4">
            Latest <span className="text-muted-foreground">Research</span>
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground px-4 max-w-4xl mx-auto">
            Rigorous deep dives into emerging infrastructure and DeFi mechanisms. We strip away the marketing narratives to provide the unfiltered, high-signal analysis that investors and builders actually need.
          </p>
        </div>

        {/* Articles Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-40 bg-muted rounded-lg mb-4" />
                <div className="h-4 bg-muted rounded mb-2" />
                <div className="h-4 bg-muted rounded w-3/4" />
              </div>
            ))}
          </div>
        ) : articles.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 mb-8 sm:mb-12">
            {articles.map((article) => (
              <button
                key={article.id}
                onClick={() => handleArticleClick(article)}
                className="p-5 sm:p-6 rounded-2xl border-2 border-border bg-background overflow-hidden flex flex-col text-left cursor-pointer"
              >
                {/* Category Tag */}
                <div className="inline-flex mb-3 sm:mb-4 w-fit">
                  <span className="px-2.5 sm:px-3 py-1 text-xs font-semibold text-foreground bg-muted rounded-full">
                    {article.category}
                  </span>
                </div>

                {/* Title */}
                <h3 className="font-display font-bold text-lg sm:text-xl text-foreground mb-2 sm:mb-3 line-clamp-2 flex-grow">
                  {article.title}
                </h3>

                {/* Excerpt */}
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mb-4 sm:mb-6 line-clamp-3">{article.excerpt}</p>

                {/* Meta */}
                <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-border">
                  <time className="text-xs text-muted-foreground">
                    {new Date(article.pubDate).toLocaleDateString()}
                  </time>
                  <span className="text-foreground font-medium text-sm">
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
        <div className="text-center mt-8 sm:mt-12">
          <button
            onClick={() => {
              posthog?.capture("view_all_articles_click", { location: "home_latest_articles" })
              router.push("/writing")
            }}
            className="inline-flex px-6 sm:px-8 py-2.5 sm:py-3 rounded-none border-2 border-foreground text-foreground font-medium text-sm sm:text-base shadow-sm"
          >
            View All Articles
          </button>
        </div>
      </div>
    </section>
  )
}
