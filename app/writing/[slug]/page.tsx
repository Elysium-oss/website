"use client"

import { useState, useEffect, useRef, useCallback } from "react"
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
  const contentContainerRef = useRef<HTMLDivElement | null>(null)
  const [tableOfContents, setTableOfContents] = useState<TocItem[]>([])
  const [activeSection, setActiveSection] = useState<string>("")
  const observerRef = useRef<IntersectionObserver | null>(null)

  // Sanitize text coming from feeds (e.g., CDATA wrappers)
  const sanitizeText = (text?: string) => {
    if (!text) return ''
    return text.replace(/<!\[CDATA\[(.*?)\]\]>/g, '$1').trim()
  }

  // Remove newsletter/subscribe forms from article content (runs after DOM is ready)
  useEffect(() => {
    if (contentContainerRef.current && article?.content) {
      const cleanup = () => {
        if (!contentContainerRef.current) return
        
        const allForms = contentContainerRef.current.querySelectorAll('form')
        allForms.forEach((form) => {
          const hasEmailInput = form.querySelector('input[type="email"]')
          const buttons = form.querySelectorAll('button')
          const hasSubscribeButton = Array.from(buttons).some(
            btn => btn.textContent?.toLowerCase().includes('subscribe')
          )
          const formText = form.textContent?.toLowerCase() || ''
          
          if (hasEmailInput && (hasSubscribeButton || formText.includes('subscribe') || formText.includes('newsletter'))) {
            form.remove()
          }
        })
        
        const containers = contentContainerRef.current.querySelectorAll('div, section')
        containers.forEach((container) => {
          const hasEmailInput = container.querySelector('input[type="email"]')
          const buttons = container.querySelectorAll('button')
          const hasSubscribeButton = Array.from(buttons).some(
            btn => btn.textContent?.toLowerCase().includes('subscribe')
          )
          const containerText = container.textContent?.toLowerCase() || ''
          
          if (hasEmailInput && hasSubscribeButton && (containerText.includes('subscribe') || containerText.includes('newsletter') || containerText.includes('type your email'))) {
            container.remove()
          }
        })
        
        const newsletterSelectors = [
          'form[action*="subscribe"]',
          'form[action*="Subscribe"]',
          'form[action*="newsletter"]',
          'form[action*="Newsletter"]',
          'div[class*="subscribe"]',
          'div[class*="Subscribe"]',
          'div[class*="newsletter"]',
          'div[class*="Newsletter"]',
          'div[id*="subscribe"]',
          'div[id*="Subscribe"]',
          'div[id*="newsletter"]',
          'div[id*="Newsletter"]',
          'section[class*="subscribe"]',
          'section[class*="Subscribe"]',
          'section[class*="newsletter"]',
          'section[class*="Newsletter"]',
        ]
        
        newsletterSelectors.forEach((selector) => {
          try {
            if (!contentContainerRef.current) return
            const elements = contentContainerRef.current.querySelectorAll(selector)
            elements.forEach((el) => {
              const text = el.textContent?.toLowerCase() || ''
              if (text.includes('subscribe') || text.includes('newsletter') || text.includes('type your email')) {
                el.remove()
              }
            })
          } catch (e) {
            // Invalid selector, skip
          }
        })

        const iframes = contentContainerRef.current.querySelectorAll('iframe')
        iframes.forEach((frame) => {
          const src = frame.getAttribute('src')?.toLowerCase() || ''
          if (src.includes('substack') || src.includes('subscribe') || src.includes('newsletter') || src.includes('embed')) {
            frame.remove()
          }
        })
      }
      
      cleanup()
      setTimeout(cleanup, 200)
      setTimeout(cleanup, 1000)
    }
  }, [article?.content])

  // Setup scroll tracking with IntersectionObserver
  useEffect(() => {
    if (!contentContainerRef.current || !article?.content) return

    let retryCount = 0
    const maxRetries = 3
    let nestedTimer: NodeJS.Timeout | null = null

    const processContent = () => {
      if (!contentContainerRef.current) return
      
      // Process images
      const images = contentContainerRef.current.querySelectorAll('img')
      images.forEach((img) => {
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
        
        if (!img.getAttribute('loading')) {
          img.loading = 'lazy'
        }
        
        if (img.srcset && !img.src) {
          const srcsetMatch = img.srcset.match(/^([^\s,]+)/)
          if (srcsetMatch) {
            img.src = srcsetMatch[1]
          }
        }
        
        img.onerror = () => {
          img.style.backgroundColor = '#f0f0f0'
          img.style.minHeight = '200px'
          img.alt = img.alt || 'Image failed to load'
        }
        
        img.onload = () => {
          img.style.opacity = '1'
          img.style.visibility = 'visible'
        }
        
        img.removeAttribute('hidden')
        const existingStyle = img.getAttribute('style') || ''
        img.setAttribute('style', `${existingStyle}; display: block !important; max-width: 100% !important; width: 100% !important; height: auto !important; margin: 1.5rem auto !important; border-radius: 0.5rem !important; opacity: 1 !important; visibility: visible !important;`)
        img.classList.add('article-image')
      })
      
      // Generate table of contents
      const headings = Array.from(contentContainerRef.current.querySelectorAll('h1, h2'))
      
      if (headings.length === 0) {
        retryCount++
        if (retryCount < maxRetries) {
          nestedTimer = setTimeout(processContent, 500)
          return
        }
        // If still no headings after retries, set empty TOC
        setTableOfContents([])
        return
      }
      
      const toc: TocItem[] = []
      
      headings.forEach((heading, index) => {
        const level = parseInt(heading.tagName.charAt(1))
        const text = heading.textContent || ''
        const id = `heading-${index}`
        const headingEl = heading as HTMLElement
        
        // Set ID and add scroll margin
        headingEl.id = id
        headingEl.style.scrollMarginTop = '120px'
        
        toc.push({
          id,
          text,
          level
        })
      })
      
      setTableOfContents(toc)
      
      // Disconnect previous observer if exists
      if (observerRef.current) {
        observerRef.current.disconnect()
      }

      // Create new IntersectionObserver
      // Track the most visible section (highest intersection ratio)
      const observerCallback = (entries: IntersectionObserverEntry[]) => {
        let maxRatio = 0
        let mostVisibleId = ''
        
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > maxRatio) {
            maxRatio = entry.intersectionRatio
            mostVisibleId = entry.target.id
          }
        })
        
        if (mostVisibleId) {
          setActiveSection(mostVisibleId)
        }
      }

      observerRef.current = new IntersectionObserver(observerCallback, {
        rootMargin: '-100px 0px -66% 0px',
        threshold: [0, 0.25, 0.5, 0.75, 1]
      })

      // Observe all headings
      headings.forEach((heading) => {
        if (observerRef.current) {
          observerRef.current.observe(heading)
        }
      })
    }

    // Initial delay to ensure DOM is ready
    const timer = setTimeout(processContent, 1000)
    
    return () => {
      clearTimeout(timer)
      if (nestedTimer) {
        clearTimeout(nestedTimer)
      }
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [article?.content])

  // Handle clicking on a TOC item
  const scrollToSection = useCallback((id: string) => {
    // Try multiple methods to find the element
    let element = document.getElementById(id)
    
    if (!element && contentContainerRef.current) {
      // Try finding by index from the TOC
      const index = parseInt(id.replace('heading-', ''))
      const headings = contentContainerRef.current.querySelectorAll('h1, h2')
      element = headings[index] as HTMLElement
      
      if (element) {
        // Set the ID if it's missing
        element.id = id
      }
    }
    
    if (!element) {
      return
    }

    const headerOffset = 100
    const elementPosition = element.getBoundingClientRect().top
    const offsetPosition = elementPosition + window.pageYOffset - headerOffset

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    })
  }, [])

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true)
        
        const response = await fetch("/api/substack")
        
        if (!response.ok) {
          throw new Error("Failed to fetch articles")
        }

        const data = await response.json()
        const articles = data.articles || []
        
        const foundArticle = articles.find((a: Article) => {
          const articleSlug = slug
          if (a.id === articleSlug || a.id.includes(articleSlug)) {
            return true
          }
          if (a.link) {
            const urlSlug = a.link.match(/\/p\/([^/?]+)/)?.[1]
            return urlSlug === articleSlug
          }
          return false
        })

        if (foundArticle) {
          let cleanedArticle = { ...foundArticle }
          if (foundArticle.content) {
            let cleanedContent = foundArticle.content
              
            cleanedContent = cleanedContent.replace(
              /<form[^>]*(?:subscribe|newsletter)[^>]*>[\s\S]*?<\/form>/gi,
              ''
            )
            cleanedContent = cleanedContent.replace(
              /<div[^>]*(?:class|id)=[^>]*(?:subscribe|newsletter)[^>]*>[\s\S]*?<\/div>/gi,
              ''
            )
            cleanedContent = cleanedContent.replace(
              /<section[^>]*(?:class|id)=[^>]*(?:subscribe|newsletter)[^>]*>[\s\S]*?<\/section>/gi,
              ''
            )
            
            cleanedContent = cleanedContent.replace(
              /<form[^>]*>[\s\S]*?<input[^>]*type=["']email["'][^>]*>[\s\S]*?<button[^>]*>[\s\S]*?(?:subscribe|Subscribe)[\s\S]*?<\/button>[\s\S]*?<\/form>/gi,
              ''
            )
            
            cleanedContent = cleanedContent.replace(
              /<(?:div|section)[^>]*>[\s\S]*?<input[^>]*type=["']email["'][^>]*>[\s\S]*?<button[^>]*>[\s\S]*?(?:subscribe|Subscribe)[\s\S]*?<\/button>[\s\S]*?<\/(?:div|section)>/gi,
              ''
            )
            
            cleanedArticle.content = cleanedContent
          }
          
          setArticle(cleanedArticle)
          
          if (!foundArticle.content && foundArticle.link) {
            setLoadingContent(true)
            try {
              const contentResponse = await fetch(
                `/api/substack/article?url=${encodeURIComponent(foundArticle.link)}`
              )
              
              if (contentResponse.ok) {
                const contentData = await contentResponse.json()
                if (contentData.content) {
                  let cleanedContent = contentData.content
                  
                  cleanedContent = cleanedContent.replace(
                    /<form[^>]*(?:subscribe|newsletter)[^>]*>[\s\S]*?<\/form>/gi,
                    ''
                  )
                  cleanedContent = cleanedContent.replace(
                    /<div[^>]*(?:class|id)=[^>]*(?:subscribe|newsletter)[^>]*>[\s\S]*?<\/div>/gi,
                    ''
                  )
                  cleanedContent = cleanedContent.replace(
                    /<section[^>]*(?:class|id)=[^>]*(?:subscribe|newsletter)[^>]*>[\s\S]*?<\/section>/gi,
                    ''
                  )
                  
                  cleanedContent = cleanedContent.replace(
                    /<form[^>]*>[\s\S]*?<input[^>]*type=["']email["'][^>]*>[\s\S]*?<button[^>]*>[\s\S]*?(?:subscribe|Subscribe)[\s\S]*?<\/button>[\s\S]*?<\/form>/gi,
                    ''
                  )
                  
                  cleanedContent = cleanedContent.replace(
                    /<(?:div|section)[^>]*>[\s\S]*?<input[^>]*type=["']email["'][^>]*>[\s\S]*?<button[^>]*>[\s\S]*?(?:subscribe|Subscribe)[\s\S]*?<\/button>[\s\S]*?<\/(?:div|section)>/gi,
                    ''
                  )
                  
                  setArticle({
                    ...foundArticle,
                    content: cleanedContent,
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
              onClick={() => router.push("/writing")}
              className="px-6 py-3 rounded-lg bg-foreground text-white hover:bg-accent-hover transition-colors"
            >
              Back to Writing
            </button>
          </div>
        </main>
      </>
    )
  }

  return (
    <>
      <Header />
      <main className="pt-20 sm:pt-24 pb-12 sm:pb-16 lg:pb-24 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-12">
            <aside className="hidden lg:block lg:col-span-3">
              <div className="sticky top-1/2 -translate-y-1/2">
                <button
                  onClick={() => router.back()}
                  className="hidden lg:inline-flex mb-8 items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  <span>Back</span>
                </button>
                
                {tableOfContents.length > 0 ? (
                  <>
                    <h2 className="text-xs font-bold text-foreground uppercase tracking-wider mb-2 pl-2">
                      TABLE OF CONTENTS
                    </h2>
                    <nav className="space-y-0">
                      {tableOfContents.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => scrollToSection(item.id)}
                          className={`block w-full text-left py-0.5 px-2 rounded text-sm transition-all ${
                            activeSection === item.id
                              ? 'text-foreground font-semibold'
                              : 'text-muted-foreground hover:text-foreground hover:underline'
                          }`}
                          style={{
                            paddingLeft: `${(item.level - 1) * 0.4 + 0.5}rem`
                          }}
                        >
                          {activeSection === item.id ? '◆ ' : ''}
                          {item.text}
                        </button>
                      ))}
                    </nav>
                  </>
                ) : article?.content ? (
                  <nav className="space-y-0">
                    {[1, 2, 3, 4, 5].map((i) => {
                      const widths = [85, 75, 90, 70, 80]
                      return (
                        <div
                          key={i}
                          className="animate-pulse py-0.5 px-2 rounded text-xs"
                          style={{
                            paddingLeft: '0.5rem'
                          }}
                        >
                          <div
                            className="h-3.5 bg-muted rounded"
                            style={{
                              width: `${widths[i - 1]}%`
                            }}
                          />
                        </div>
                      )
                    })}
                  </nav>
                ) : null}
              </div>
            </aside>

            <article className="lg:col-span-9">
              <button
                onClick={() => router.back()}
                className="lg:hidden mb-6 sm:mb-8 inline-flex items-center gap-2 text-sm sm:text-base text-muted-foreground hover:text-foreground transition-colors"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span>Back</span>
              </button>
              
              <header className="mb-8">
                <div className="mb-4">
                  <span className="inline-block px-4 py-2 rounded-full bg-muted text-sm font-semibold text-foreground">
                    {article.category || "Article"}
                  </span>
                </div>
                
                <h1 className="font-display font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl text-foreground leading-tight mb-4 sm:mb-6">
                  {article.title}
                </h1>
                
                <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground mb-4 sm:mb-6">
                  <span>{new Date(article.pubDate).toLocaleDateString("en-US", { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}</span>
                  <span>•</span>
                  <span>By {sanitizeText(article.author)}</span>
                  <span>•</span>
                  <span>{article.readTime}</span>
                </div>
              </header>

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
                    ref={contentContainerRef}
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