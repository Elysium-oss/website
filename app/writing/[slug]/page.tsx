"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useParams, useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { usePostHog } from "posthog-js/react"

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
  const posthog = usePostHog()
  
  const [article, setArticle] = useState<Article | null>(null)
  const [loading, setLoading] = useState(true)
  const [loadingContent, setLoadingContent] = useState(false)
  const contentContainerRef = useRef<HTMLDivElement | null>(null)
  const [tableOfContents, setTableOfContents] = useState<TocItem[]>([])
  const [activeSection, setActiveSection] = useState<string>("")
  const observerRef = useRef<IntersectionObserver | null>(null)
  const [copied, setCopied] = useState(false)

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
          if (src.includes('substack') || src.includes('youtube') || src.includes('youtu.be') || src.includes('subscribe') || src.includes('newsletter') || src.includes('embed')) {
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
        img.style.borderRadius = '0'
        img.style.opacity = '1'
        img.style.visibility = 'visible'
        img.style.border = 'none'
        
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
          img.style.display = 'block'
        }
        
        img.removeAttribute('hidden')
        const existingStyle = img.getAttribute('style') || ''
        img.setAttribute('style', `${existingStyle}; display: block !important; max-width: 100% !important; width: 100% !important; height: auto !important; margin: 1.5rem auto !important; border-radius: 0 !important; border: none !important; opacity: 1 !important; visibility: visible !important;`)
        img.classList.add('article-image')
      })

      // Force long URLs and words to wrap and prevent horizontal overflow
      if (contentContainerRef.current) {
        const root = contentContainerRef.current

        const nodes = root.querySelectorAll('p, li, blockquote, a, h1, h2, h3, h4, h5, h6, code')
        nodes.forEach((el) => {
          const s = (el as HTMLElement).style
          s.wordBreak = 'break-word'
          s.overflowWrap = 'anywhere'
          s.maxWidth = '100%'
        })

        const pres = root.querySelectorAll('pre')
        pres.forEach((pre) => {
          pre.style.whiteSpace = 'pre-wrap'
          pre.style.wordBreak = 'break-word'
          pre.style.maxWidth = '100%'
          pre.style.overflowX = 'auto'
        })

        const tables = root.querySelectorAll('table')
        tables.forEach((table) => {
          const parent = table.parentElement
          if (!parent || !parent.classList.contains('article-table-wrapper')) {
            const wrapper = document.createElement('div')
            wrapper.className = 'article-table-wrapper'
            wrapper.style.overflowX = 'auto'
            wrapper.style.width = '100%'
            wrapper.style.marginTop = '1rem'
            wrapper.style.marginBottom = '1rem'
            parent?.insertBefore(wrapper, table)
            wrapper.appendChild(table)
          }
        })
      }
      
      // Generate table of contents
      const headings = Array.from(contentContainerRef.current.querySelectorAll('h3'))
      
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

  // Get current page URL for sharing
  const getShareUrl = () => {
    if (typeof window !== 'undefined') {
      return window.location.href
    }
    return article?.link || ''
  }

  // Get share text
  const getShareText = () => {
    return `${article?.title || ''}${article?.excerpt ? ` - ${article.excerpt}` : ''}`
  }

  // Handle social media sharing
  const handleShare = (platform: string) => {
    posthog?.capture("article_share_click", { platform, id: article?.id, title: article?.title })
    const url = getShareUrl()
    const text = getShareText()
    
    const shareUrls: Record<string, string> = {
      twitter: `https://x.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      reddit: `https://reddit.com/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent(article?.title || '')}`,
    }
    
    if (shareUrls[platform]) {
      window.open(shareUrls[platform], '_blank', 'width=600,height=400')
    }
  }

  // Handle copy link
  const handleCopyLink = async () => {
    const url = getShareUrl()
    try {
      posthog?.capture("article_copy_link", { id: article?.id })
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy link:', err)
    }
  }

  // Handle clicking on a TOC item
  const scrollToSection = useCallback((id: string) => {
    posthog?.capture("toc_item_click", { target: id, id: article?.id })
    // Try multiple methods to find the element
    let element = document.getElementById(id)
    
    if (!element && contentContainerRef.current) {
      // Try finding by index from the TOC
      const index = parseInt(id.replace('heading-', ''))
      const headings = contentContainerRef.current.querySelectorAll('h3')
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
            
            // Remove YouTube iframes and embeds
            cleanedContent = cleanedContent.replace(
              /<iframe[^>]*(?:youtube|youtu\.be)[^>]*>[\s\S]*?<\/iframe>/gi,
              ''
            )
            cleanedContent = cleanedContent.replace(
              /<div[^>]*(?:class|id)=[^>]*(?:youtube|youtu\.be)[^>]*>[\s\S]*?<\/div>/gi,
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
                  
                  // Remove YouTube iframes and embeds
                  cleanedContent = cleanedContent.replace(
                    /<iframe[^>]*(?:youtube|youtu\.be)[^>]*>[\s\S]*?<\/iframe>/gi,
                    ''
                  )
                  cleanedContent = cleanedContent.replace(
                    /<div[^>]*(?:class|id)=[^>]*(?:youtube|youtu\.be)[^>]*>[\s\S]*?<\/div>/gi,
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
              onClick={() => {
                posthog?.capture("article_back_to_list")
                router.push("/writing")
              }}
              className="px-6 py-3 rounded-none bg-foreground text-white hover:bg-accent-hover transition-colors"
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
      <main className="pt-20 sm:pt-24 pb-12 sm:pb-16 lg:pb-24 min-h-screen overflow-x-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-12">
            <aside className="hidden lg:block lg:col-span-3 relative">
              <div className="fixed left-16 top-0 h-screen w-[calc((100vw-80rem)/2+14rem)] max-w-[20rem] px-4 py-4">
                <button
                  onClick={() => {
                    posthog?.capture("article_back_click")
                    router.back()
                  }}
                  className="inline-flex mt-24 mb-4 items-center gap-3 text-lg text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  <span>Back</span>
                </button>

                <div className="h-[calc(100vh-12rem)] flex items-center">
                  {tableOfContents.length > 0 ? (
                    <div className="w-full">
                      <h2 className="text-sm font-bold text-foreground uppercase tracking-wider mb-2 pl-2">
                        TABLE OF CONTENTS
                      </h2>
                      <nav className="space-y-0 max-h-[60vh] overflow-auto pr-2">
                        {tableOfContents.map((item) => (
                          <button
                            key={item.id}
                            onClick={() => scrollToSection(item.id)}
                            className={`block w-full text-left py-0.5 px-2 rounded text-base transition-all cursor-pointer ${
                              activeSection === item.id
                                ? 'text-foreground font-semibold'
                                : 'text-muted-foreground hover:text-foreground hover:underline'
                            }`}
                          >
                            {activeSection === item.id ? '◆ ' : ''}
                            {item.text}
                          </button>
                        ))}
                      </nav>
                    </div>
                  ) : article?.content ? (
                    <div className="w-full">
                      <nav className="space-y-0 max-h-[60vh] overflow-auto pr-2">
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
                    </div>
                  ) : null}
                </div>
              </div>
            </aside>

            <article className="lg:col-span-9">
              <button
                onClick={() => {
                  posthog?.capture("article_back_click")
                  router.back()
                }}
                className="lg:hidden mb-6 sm:mb-8 inline-flex items-center gap-2 text-sm sm:text-base text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span>Back</span>
              </button>
              
              <header className="mb-8">
                {article.category ? (
                  <div className="mb-4">
                    <span className="inline-block px-4 py-2 rounded-full bg-muted text-sm font-semibold text-muted-foreground">
                      {article.category}
                    </span>
                  </div>
                ) : null}
                
                <h1 className="font-display font-bold text-3xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl text-foreground leading-tight mb-4 sm:mb-6">
                  {article.title}
                </h1>
                
                {article.excerpt && (
                  <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed mb-6 sm:mb-8">
                    {article.excerpt}
                  </p>
                )}
                
                <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground mb-4 sm:mb-6">
                  <span>{new Date(article.pubDate).toLocaleDateString("en-US", { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}</span>
                  <span className="h-3 w-px bg-border"></span>
                  <span>By {sanitizeText(article.author)}</span>
                  <span className="h-3 w-px bg-border"></span>
                  <span>{article.readTime}</span>
                </div>
              </header>

              <div className="border-t border-border mb-3"></div>

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
                    className="article-content break-words overflow-x-hidden"
                    dangerouslySetInnerHTML={{ __html: article.content }}
                    style={{
                      fontSize: '1.125rem',
                      lineHeight: '1.8',
                      wordBreak: 'break-word',
                      overflowWrap: 'anywhere',
                      maxWidth: '100%',
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

              {/* Sharing Panel */}
              <div className="mt-12 pt-8 border-t border-border">
                <div className="mb-4">
                  <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">
                    Share this article
                  </h3>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  {/* Twitter/X */}
                  <button
                    onClick={() => handleShare('twitter')}
                    className="flex items-center gap-2 px-4 py-2 rounded-none bg-background border border-border text-muted-foreground hover:text-foreground hover:border-foreground transition-all group"
                    aria-label="Share on X (Twitter)"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                    <span className="text-sm font-medium">X</span>
                  </button>

                  {/* LinkedIn */}
                  <button
                    onClick={() => handleShare('linkedin')}
                    className="flex items-center gap-2 px-4 py-2 rounded-none bg-background border border-border text-muted-foreground hover:text-foreground hover:border-foreground transition-all group"
                    aria-label="Share on LinkedIn"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                    <span className="text-sm font-medium">LinkedIn</span>
                  </button>

                  {/* Facebook */}
                  <button
                    onClick={() => handleShare('facebook')}
                    className="flex items-center gap-2 px-4 py-2 rounded-none bg-background border border-border text-muted-foreground hover:text-foreground hover:border-foreground transition-all group"
                    aria-label="Share on Facebook"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd"/>
                    </svg>
                    <span className="text-sm font-medium">Facebook</span>
                  </button>

                  {/* Reddit */}
                  <button
                    onClick={() => handleShare('reddit')}
                    className="flex items-center gap-2 px-4 py-2 rounded-none bg-background border border-border text-muted-foreground hover:text-foreground hover:border-foreground transition-all group"
                    aria-label="Share on Reddit"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/>
                    </svg>
                    <span className="text-sm font-medium">Reddit</span>
                  </button>

                  {/* Copy Link */}
                  <button
                    onClick={handleCopyLink}
                    className="flex items-center gap-2 px-4 py-2 rounded-none bg-background border border-border text-muted-foreground hover:text-foreground hover:border-foreground transition-all group"
                    aria-label="Copy link"
                  >
                    {copied ? (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-sm font-medium">Copied!</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        <span className="text-sm font-medium">Copy Link</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              <footer className="mt-8 pt-8 border-t border-border">
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