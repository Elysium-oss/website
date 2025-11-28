/**
 * API Route to fetch Substack articles
 * Supports both Substack API (with API key) and RSS feed (fallback)
 * This avoids CORS issues when fetching from client-side
 */

import { NextResponse } from "next/server"

// Simple RSS parser for Node.js
function parseRSSServer(rssText: string) {
  const articles: any[] = []
  
  // Extract channel/publication-level author image (logo)
  let channelAuthorImage: string | undefined
  const channelImageMatch = rssText.match(/<image>\s*<url>(.*?)<\/url>\s*<\/image>/i)
  if (channelImageMatch) {
    channelAuthorImage = channelImageMatch[1]
  }
  // Also try iTunes image format
  if (!channelAuthorImage) {
    const itunesImageMatch = rssText.match(/<itunes:image[^>]+href=["']([^"']+)["']/i)
    if (itunesImageMatch) {
      channelAuthorImage = itunesImageMatch[1]
    }
  }
  
  // Split by </item> tag to handle very long articles with complex nested content
  // This is more reliable than regex for articles with lots of HTML
  const itemSections = rssText.split('</item>')
  
  // Each section except the last one should be an item (last section is after final </item>)
  const itemMatches: string[] = []
  for (let i = 0; i < itemSections.length - 1; i++) {
    const section = itemSections[i]
    const itemStart = section.lastIndexOf('<item')
    if (itemStart !== -1) {
      const itemContent = section.substring(itemStart) + '</item>'
      itemMatches.push(itemContent)
    }
  }

  if (itemMatches.length === 0) {
    return articles
  }

  itemMatches.forEach((itemXml, index) => {
    const titleMatch = itemXml.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>|<title>(.*?)<\/title>/i)
    const linkMatch = itemXml.match(/<link>(.*?)<\/link>/i)
    const pubDateMatch = itemXml.match(/<pubDate>(.*?)<\/pubDate>/i)
    const descMatch = itemXml.match(/<description><!\[CDATA\[([\s\S]*?)\]\]><\/description>|<description>([\s\S]*?)<\/description>/i)
    const categoryMatch = itemXml.match(/<category>(.*?)<\/category>/i)
    
    // Extract all creator/author tags (there can be multiple)
    // Handle both CDATA and plain text formats
    const creatorMatches = [
      ...itemXml.matchAll(/<dc:creator><!\[CDATA\[(.*?)\]\]><\/dc:creator>/gi),
      ...itemXml.matchAll(/<dc:creator>(.*?)<\/dc:creator>/gi),
      ...itemXml.matchAll(/<creator><!\[CDATA\[(.*?)\]\]><\/creator>/gi),
      ...itemXml.matchAll(/<creator>(.*?)<\/creator>/gi),
      ...itemXml.matchAll(/<author><!\[CDATA\[(.*?)\]\]><\/author>/gi),
      ...itemXml.matchAll(/<author>(.*?)<\/author>/gi),
    ]
    
    // Substack puts full content (including images) in content:encoded, not description
    const contentMatch = itemXml.match(/<content:encoded><!\[CDATA\[([\s\S]*?)\]\]><\/content:encoded>/i)
    const fullContent = contentMatch ? contentMatch[1] : ""
    
    // Also check for enclosure tag (featured image)
    const enclosureMatch = itemXml.match(/<enclosure[^>]+url=["']([^"']+)["']/i)

    const title = (titleMatch?.[1] || titleMatch?.[2] || "").trim()
    const link = (linkMatch?.[1] || "").trim()
    const pubDate = (pubDateMatch?.[1] || "").trim()
    const description = (descMatch?.[1] || descMatch?.[2] || "").trim()
    
    // Process all creators/authors and join with commas
    const creators: string[] = []
    creatorMatches.forEach((match) => {
      const creator = (match[1] || "").trim()
      if (creator) {
        // CDATA is already handled by the regex, but clean any remaining wrappers
        const cleanedCreator = creator.replace(/<!\[CDATA\[(.*?)\]\]>/g, '$1').trim()
        if (cleanedCreator && !creators.includes(cleanedCreator)) {
          creators.push(cleanedCreator)
        }
      }
    })
    const creator = creators.length > 0 ? creators.join(", ") : ""
    
    const category = (categoryMatch?.[1] || "").trim()

    if (!title || !link) return

    const excerpt = description
      .replace(/<[^>]*>/g, "")
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .substring(0, 200)
      .trim()
      + (description.length > 200 ? "..." : "")

    // Extract first image - try from enclosure, content:encoded, or description
    let image = enclosureMatch ? enclosureMatch[1] : undefined
    
    if (!image) {
      // Try to find first image in full content
      const contentImageMatch = fullContent.match(/<img[^>]+src=["']([^"']+)["']/i)
      image = contentImageMatch ? contentImageMatch[1] : undefined
    }
    
    if (!image) {
      // Fallback to description
      const descImageMatch = description.match(/<img[^>]+src=["']([^"']+)["']/i)
      image = descImageMatch ? descImageMatch[1] : undefined
    }

    // Use content:encoded if available (has full HTML with all images), otherwise use description
    let content = fullContent || description
    
    // Ensure all Substack CDN images are properly formatted
    // Substack uses substackcdn.com for images
    content = content.replace(/<img([^>]*?)>/gi, (match) => {
      // Ensure images have proper display attributes
      if (!match.includes('style=')) {
        return match.replace('<img', '<img style="max-width: 100%; height: auto; display: block; margin: 1rem auto;"')
      }
      return match
    })

    // Calculate read time from full content (content:encoded), not just description
    // This gives accurate reading time based on the actual article length
    const contentForWordCount = fullContent || description
    const plainText = contentForWordCount
      .replace(/<[^>]*>/g, "") // Remove HTML tags
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/\s+/g, " ") // Normalize whitespace
      .trim()
    
    const wordCount = plainText.split(/\s+/).filter(Boolean).length
    // Average reading speed is 200-250 words per minute, using 200 for conservative estimate
    const readTime = Math.max(1, Math.ceil(wordCount / 200))

    articles.push({
      id: `article-${index}`,
      title,
      excerpt: excerpt || "No description available.",
      pubDate: pubDate || new Date().toISOString(),
      link,
      author: creator || "Elysium",
      authorImage: channelAuthorImage, // Add author/publication logo
      category: category || undefined,
      readTime: `${readTime} min read`,
      image,
      content, // Add full content
    })
  })

  return articles
}

/**
 * Fetch articles from Substack API (if API key is provided)
 * Returns null if API should be skipped (e.g., due to rate limits or permissions)
 */
async function fetchFromSubstackAPI(apiKey: string, publicationUrl: string, forceRefresh: boolean = false): Promise<any[] | null> {
  try {
    // Try SubstackAPI.dev service
    const apiBaseUrl = process.env.SUBSTACK_API_BASE_URL || "https://api.substackapi.dev"
    const response = await fetch(`${apiBaseUrl}/posts/latest`, {
      headers: {
        "X-API-Key": apiKey,
        "Content-Type": "application/json",
      },
      next: forceRefresh ? { revalidate: 0 } : { revalidate: 3600 }, // Cache for 1 hour unless forced
      cache: forceRefresh ? 'no-store' : 'default',
    })

    // Check for permanent failures that suggest we should skip API
    if (response.status === 403 || response.status === 401) {
      // API key invalid or forbidden - skip API in future
      return null
    }

    if (response.status === 429) {
      // Rate limited - skip API for this request but don't disable permanently
      return null
    }

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`)
    }

    const data = await response.json()
    
    // Transform API response to our article format
    if (Array.isArray(data)) {
      return data.map((post: any, index: number) => {
        // Handle multiple authors from API
        let authors: string[] = []
        if (post.authors && Array.isArray(post.authors) && post.authors.length > 0) {
          authors = post.authors.map((a: any) => a.name || a).filter(Boolean)
        } else if (post.author?.name) {
          authors = [post.author.name]
        }
        
        const author = authors.length > 0 ? authors.join(", ") : "Elysium"
        
        // Calculate read time from API data
        // Substack API provides reading_time_minutes field
        let readTime = "5 min read" // Default fallback
        if (post.reading_time_minutes) {
          readTime = `${post.reading_time_minutes} min read`
        } else if (post.read_time) {
          readTime = `${post.read_time} min read`
        } else {
          // Calculate from content if not provided
          const contentForCalc = post.body_html || post.content_html || post.description || ""
          const plainText = contentForCalc
            .replace(/<[^>]*>/g, "")
            .replace(/&nbsp;/g, " ")
            .replace(/&amp;/g, "&")
            .replace(/&lt;/g, "<")
            .replace(/&gt;/g, ">")
            .replace(/&quot;/g, '"')
            .replace(/&#39;/g, "'")
            .replace(/\s+/g, " ")
            .trim()
          const wordCount = plainText.split(/\s+/).filter(Boolean).length
          const calculatedReadTime = Math.max(1, Math.ceil(wordCount / 200))
          readTime = `${calculatedReadTime} min read`
        }
        
        return {
          id: post.id || post.slug || `article-${index}`,
          title: post.title || "",
          excerpt: post.subtitle || post.description || "",
          pubDate: post.created_at || post.published_at || new Date().toISOString(),
          link: post.post_url || post.canonical_url || `${publicationUrl}/p/${post.slug}`,
          author: author,
          authorImage: post.author?.photo_url || post.author?.avatar_url || post.publication?.logo_url || undefined,
          category: post.tags?.[0] || undefined,
          readTime: readTime,
          image: post.cover_image || post.thumbnail_image || undefined,
          content: post.body_html || post.content_html || post.description || "",
        }
      })
    }
    
    return []
  } catch (error: any) {
    // Only log unexpected errors, not rate limits or auth failures
    if (!error.message?.includes('403') && !error.message?.includes('429') && !error.message?.includes('401')) {
      console.error("Error fetching from Substack API:", error)
    }
    // Return null to indicate API should be skipped
    return null
  }
}

export async function GET(request: Request) {
  try {
    const substackUrl = process.env.NEXT_PUBLIC_SUBSTACK_URL || "https://yash102244.substack.com"
    
    // Check for cache-busting query parameter
    const { searchParams } = new URL(request.url)
    const forceRefresh = searchParams.get('refresh') === 'true'
    
    // Check if API key is provided (try both environment variable names)
    const apiKey = process.env.SUBSTACK_API_KEY || process.env.NEXT_PUBLIC_SUBSTACK_API_KEY
    
    // Try to use API if key is provided (but only if not forcing refresh, to avoid rate limits)
    // For forced refresh, skip API and go straight to RSS to avoid hitting rate limits
    if (apiKey && !forceRefresh) {
      const articles = await fetchFromSubstackAPI(apiKey, substackUrl, false)
      
      // If articles were successfully fetched from API, return them
      if (articles && articles.length > 0) {
        return NextResponse.json({ articles, source: "api" }, {
          headers: {
            "Content-Type": "application/json",
            "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
          },
        })
      }
      // If null was returned, API failed with 403/429, so fall through to RSS
      // If empty array, API worked but no articles, also fall through
    }

    // Use RSS feed (reliable and doesn't require API key)
    const rssUrl = `${substackUrl}/feed`
    
    const response = await fetch(rssUrl, {
      headers: {
        Accept: "application/rss+xml, application/xml, text/xml",
        "User-Agent": "Mozilla/5.0 (compatible; Elysium/1.0)",
      },
      // Cache for 10 minutes normally, or 1 minute if forcing refresh
      next: forceRefresh ? { revalidate: 60 } : { revalidate: 600 },
      cache: forceRefresh ? 'no-store' : 'default',
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch RSS feed: ${response.statusText}`)
    }

    const rssText = await response.text()
    const articles = parseRSSServer(rssText)

    return NextResponse.json({ articles, source: "rss" }, {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": forceRefresh 
          ? "public, s-maxage=60, stale-while-revalidate=300"
          : "public, s-maxage=600, stale-while-revalidate=3600",
      },
    })
  } catch (error) {
    console.error("Error fetching Substack content:", error)
    return NextResponse.json({ error: "Failed to fetch articles", articles: [] }, { status: 500 })
  }
}

