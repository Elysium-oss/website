"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
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

interface TocItem {
  id: string
  text: string
  level: number
}

export default function ArticlePage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string
  
  const [article, setArticle] = useState<Article | null>(null)
  const [loading, setLoading] = useState(true)
  const [loadingContent, setLoadingContent] = useState(false)
  const [contentContainerRef, setContentContainerRef] = useState<HTMLDivElement | null>(null)
  const [tableOfContents, setTableOfContents] = useState<TocItem[]>([])
  const [activeSection, setActiveSection] = useState<string>("")

  // Process images and generate table of contents after content is rendered
  useEffect(() => {
    if (contentContainerRef && article?.content) {
      // Wait a bit for the DOM to be ready
      setTimeout(() => {
        const images = contentContainerRef.querySelectorAll('img')
        console.log('Found images:', images.length)
        
        images.forEach((img, index) => {
          console.log(`Processing image ${index + 1}:`, img.src)
          
          // Ensure images are visible and properly styled
          img.style.display = 'block'
          img.style.maxWidth = '100%'
          img.style.width = '100%'
          img.style.height = 'auto'
          img.style.marginLeft = 'auto'
          img.style.marginRight = 'auto'
          img.style.marginTop = '1.5rem'
          img.style.marginBottom = '1.5rem'
          img.style.borderRadius = '0.5rem'
          img.style.opacity = '1'
          img.style.visibility = 'visible'
          
          // Set loading attribute for better performance
          if (!img.getAttribute('loading')) {
            img.loading = 'lazy'
          }
          
          // Ensure src attribute is set properly
          if (img.srcset && !img.src) {
            // Use srcset if src is missing
            const srcsetMatch = img.srcset.match(/^([^\s,]+)/)
            if (srcsetMatch) {
              img.src = srcsetMatch[1]
            }
          }
          
          // Handle image loading errors gracefully (don't hide, show placeholder)
          img.onerror = function() {
            console.error('Image failed to load:', this.src)
            // Instead of hiding, show a placeholder
            this.style.backgroundColor = '#f0f0f0'
            this.style.minHeight = '200px'
            this.alt = this.alt || 'Image failed to load'
          }
          
          // Ensure images maintain aspect ratio
          img.onload = function() {
            console.log('Image loaded successfully:', this.src)
            this.style.opacity = '1'
            this.style.visibility = 'visible'
          }
          
          // Force image to be visible - don't remove style, just override it
          img.removeAttribute('hidden')
          // Merge with existing styles instead of replacing
          const existingStyle = img.getAttribute('style') || ''
          img.setAttribute('style', `${existingStyle}; display: block !important; max-width: 100% !important; width: 100% !important; height: auto !important; margin: 1.5rem auto !important; border-radius: 0.5rem !important; opacity: 1 !important; visibility: visible !important;`)
          
          // Also set CSS classes
          img.classList.add('article-image')
        })
        
        // Generate table of contents from headings
        const headings = contentContainerRef.querySelectorAll('h1, h2, h3, h4, h5, h6')
        const toc: TocItem[] = []
        
        headings.forEach((heading, index) => {
          const level = parseInt(heading.tagName.charAt(1))
          const text = heading.textContent || ''
          const id = `heading-${index}`
          
          // Add ID to heading for scrolling
          heading.id = id
          heading.setAttribute('style', `${heading.getAttribute('style') || ''}; scroll-margin-top: 100px;`)
          
          toc.push({
            id,
            text,
            level
          })
        })
        
        setTableOfContents(toc)
        
        // Setup intersection observer for active section tracking
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                setActiveSection(entry.target.id)
              }
            })
          },
          {
            rootMargin: '-100px 0px -80% 0px'
          }
        )
        
        headings.forEach((heading) => {
          observer.observe(heading)
        })
        
        return () => {
          headings.forEach((heading) => {
            observer.unobserve(heading)
          })
        }
      }, 100)
    }
  }, [contentContainerRef, article?.content])
  
  // Scroll to section when TOC item is clicked
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      })
    }
  }

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true)
        
        // First, get all articles to find the one matching the slug
        const response = await fetch("/api/substack")
        
        if (!response.ok) {
          throw new Error("Failed to fetch articles")
        }

        const data = await response.json()
        const articles = data.articles || []
        
        // Find article by slug or ID
        // Slug can be the article ID or extracted from the URL
        const foundArticle = articles.find((a: Article) => {
          const articleSlug = slug
          // Match by ID
          if (a.id === articleSlug || a.id.includes(articleSlug)) {
            return true
          }
          // Match by slug extracted from link
          if (a.link) {
            const urlSlug = a.link.match(/\/p\/([^/?]+)/)?.[1]
            return urlSlug === articleSlug
          }
          return false
        })

        if (foundArticle) {
          // Just use the content as-is from Substack
          setArticle(foundArticle)
          
          // Fetch full content if not already available
          if (!foundArticle.content && foundArticle.link) {
            setLoadingContent(true)
            try {
              const contentResponse = await fetch(
                `/api/substack/article?url=${encodeURIComponent(foundArticle.link)}`
              )
              
              if (contentResponse.ok) {
                const contentData = await contentResponse.json()
                if (contentData.content) {
                  setArticle({
                    ...foundArticle,
                    content: contentData.content,
                  })
                }
              }
            } catch (error) {
              console.error("Error fetching article content:", error)
            } finally {
              setLoadingContent(false)
            }
          }
        } else {
          // Article not found
          setArticle(null)
        }
      } catch (error) {
        console.error("Error fetching article:", error)
      } finally {
        setLoading(false)
      }
    }

    if (slug) {
      fetchArticle()
    }
  }, [slug])

  if (loading) {
    return (
      <>
        <Header />
        <main className="pt-24 pb-24 min-h-screen">
          <div className="max-w-4xl mx-auto px-6 sm:px-8 py-12">
            <div className="animate-pulse space-y-8">
              <div className="h-12 bg-muted rounded w-3/4"></div>
              <div className="h-6 bg-muted rounded w-1/2"></div>
              <div className="h-64 bg-muted rounded"></div>
              <div className="space-y-4">
                <div className="h-4 bg-muted rounded w-full"></div>
                <div className="h-4 bg-muted rounded w-full"></div>
                <div className="h-4 bg-muted rounded w-5/6"></div>
              </div>
            </div>
          </div>
        </main>
      </>
    )
  }

  if (!article) {
    return (
      <>
        <Header />
        <main className="pt-24 pb-24 min-h-screen">
          <div className="max-w-4xl mx-auto px-6 sm:px-8 py-12 text-center">
            <h1 className="text-3xl font-bold mb-4">Article Not Found</h1>
            <p className="text-muted-foreground mb-8">
              The article you're looking for doesn't exist or has been removed.
            </p>
            <button
              onClick={() => router.push("/writings")}
              className="px-6 py-3 rounded-lg bg-foreground text-white hover:bg-accent-hover transition-colors"
            >
              Back to Writings
            </button>
          </div>
        </main>
      </>
    )
  }

  return (
    <>
      <Header />
      <main className="pt-24 pb-24 min-h-screen">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 py-12">
          {/* Back Button */}
          <button
            onClick={() => router.back()}
            className="mb-8 inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>Back</span>
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            {/* Table of Contents / Content Sidebar - Left Side */}
            <aside className="hidden lg:block lg:col-span-3">
              <div className="sticky top-28">
                {tableOfContents.length > 0 ? (
                  <>
                    <h2 className="text-xs font-bold text-foreground uppercase tracking-wider mb-4">
                      Table of Contents
                    </h2>
                    <nav className="space-y-1">
                      {tableOfContents.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => scrollToSection(item.id)}
                          className={`block w-full text-left py-2 px-3 rounded-lg text-sm transition-all ${
                            activeSection === item.id
                              ? 'bg-muted text-foreground font-medium border-l-2 border-foreground'
                              : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                          }`}
                          style={{
                            paddingLeft: `${(item.level - 1) * 0.5 + 0.75}rem`
                          }}
                        >
                          {item.text}
                        </button>
                      ))}
                    </nav>
                  </>
                ) : (
                  <div className="space-y-4">
                    <h2 className="text-xs font-bold text-foreground uppercase tracking-wider mb-4">
                      Article Info
                    </h2>
                  </div>
                )}
                
                {/* Article Info */}
                <div className={`pt-6 border-t border-border ${tableOfContents.length > 0 ? 'mt-8' : 'mt-0'}`}>
                  <div className="space-y-3 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{article.readTime}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span>{article.author}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>{new Date(article.pubDate).toLocaleDateString("en-US", { 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric' 
                      })}</span>
                    </div>
                    {article.category && (
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                        <span>{article.category}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </aside>

            {/* Main Article Content - Right Side */}
            <article className="lg:col-span-9">

          {/* Article Header */}
          <header className="mb-8">
            <div className="mb-4">
              <span className="inline-block px-4 py-2 rounded-full bg-muted text-sm font-semibold text-foreground">
                {article.category || "Article"}
              </span>
            </div>
            
            <h1 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl text-foreground leading-tight mb-6">
              {article.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
              <span>{new Date(article.pubDate).toLocaleDateString("en-US", { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</span>
              <span>•</span>
              <span>By {article.author}</span>
              <span>•</span>
              <span>{article.readTime}</span>
            </div>
          </header>

          {/* Article Content */}
          <div className="prose dark:prose-invert max-w-none">
            {loadingContent ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-foreground mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Loading article content...</p>
                </div>
              </div>
            ) : article.content ? (
              <div 
                ref={setContentContainerRef}
                className="article-content"
                dangerouslySetInnerHTML={{ __html: article.content }}
                style={{
                  lineHeight: '1.75',
                }}
              />
            ) : (
              <div className="space-y-4">
                <p className="text-foreground leading-relaxed text-lg">{article.excerpt}</p>
                {article.link && (
                  <a
                    href={article.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-foreground hover:text-muted-foreground transition-colors underline"
                  >
                    Read full article on Substack
                    <span>→</span>
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Article Footer */}
          <footer className="mt-16 pt-8 border-t border-border">
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span>Published on {new Date(article.pubDate).toLocaleDateString("en-US", { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</span>
              {article.link && (
                <>
                  <span>•</span>
                  <a
                    href={article.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-foreground transition-colors underline"
                  >
                    View on Substack
                  </a>
                </>
              )}
            </div>
          </footer>
            </article>
          </div>
        </div>
      </main>
    </>
  )
}

