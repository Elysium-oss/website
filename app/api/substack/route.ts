/**
 * API Route to fetch Substack articles
 * Supports both Substack API (with API key) and RSS feed (fallback)
 * This avoids CORS issues when fetching from client-side
 */

import { NextResponse } from "next/server"

// Simple RSS parser for Node.js
function parseRSSServer(rssText: string) {
  const articles: any[] = []
  
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
    console.log('No items found in RSS feed')
    return articles
  }
  
  console.log(`Found ${itemMatches.length} items in RSS feed`)

  itemMatches.forEach((itemXml, index) => {
    const titleMatch = itemXml.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>|<title>(.*?)<\/title>/i)
    const linkMatch = itemXml.match(/<link>(.*?)<\/link>/i)
    const pubDateMatch = itemXml.match(/<pubDate>(.*?)<\/pubDate>/i)
    const descMatch = itemXml.match(/<description><!\[CDATA\[([\s\S]*?)\]\]><\/description>|<description>([\s\S]*?)<\/description>/i)
    const creatorMatch = itemXml.match(/<dc:creator>(.*?)<\/dc:creator>|<creator>(.*?)<\/creator>|<author>(.*?)<\/author>/i)
    const categoryMatch = itemXml.match(/<category>(.*?)<\/category>/i)
    
    // Substack puts full content (including images) in content:encoded, not description
    const contentMatch = itemXml.match(/<content:encoded><!\[CDATA\[([\s\S]*?)\]\]><\/content:encoded>/i)
    const fullContent = contentMatch ? contentMatch[1] : ""
    
    // Also check for enclosure tag (featured image)
    const enclosureMatch = itemXml.match(/<enclosure[^>]+url=["']([^"']+)["']/i)

    const title = (titleMatch?.[1] || titleMatch?.[2] || "").trim()
    const link = (linkMatch?.[1] || "").trim()
    const pubDate = (pubDateMatch?.[1] || "").trim()
    const description = (descMatch?.[1] || descMatch?.[2] || "").trim()
    const creator = (creatorMatch?.[1] || creatorMatch?.[2] || creatorMatch?.[3] || "").trim()
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

    const wordCount = description.replace(/<[^>]*>/g, "").split(/\s+/).filter(Boolean).length
    const readTime = Math.max(1, Math.ceil(wordCount / 200))

    articles.push({
      id: `article-${index}`,
      title,
      excerpt: excerpt || "No description available.",
      pubDate: pubDate || new Date().toISOString(),
      link,
      author: creator || "Elysium",
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
 */
async function fetchFromSubstackAPI(apiKey: string, publicationUrl: string): Promise<any[]> {
  try {
    // Try SubstackAPI.dev service
    const apiBaseUrl = process.env.SUBSTACK_API_BASE_URL || "https://api.substackapi.dev"
    const response = await fetch(`${apiBaseUrl}/posts/latest`, {
      headers: {
        "X-API-Key": apiKey,
        "Content-Type": "application/json",
      },
      next: { revalidate: 3600 }, // Cache for 1 hour
    })

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`)
    }

    const data = await response.json()
    
    // Transform API response to our article format
    if (Array.isArray(data)) {
      return data.map((post: any, index: number) => ({
        id: post.id || post.slug || `article-${index}`,
        title: post.title || "",
        excerpt: post.subtitle || post.description || "",
        pubDate: post.created_at || post.published_at || new Date().toISOString(),
        link: post.post_url || post.canonical_url || `${publicationUrl}/p/${post.slug}`,
        author: post.author?.name || "Elysium",
        category: post.tags?.[0] || undefined,
        readTime: post.read_time ? `${post.read_time} min read` : "5 min read",
        image: post.cover_image || post.thumbnail_image || undefined,
        content: post.body_html || post.content_html || post.description || "",
      }))
    }
    
    return []
  } catch (error) {
    console.error("Error fetching from Substack API:", error)
    throw error
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
    
    // Try to use API if key is provided
    if (apiKey) {
      try {
        const articles = await fetchFromSubstackAPI(apiKey, substackUrl)
        if (articles.length > 0) {
          return NextResponse.json({ articles, source: "api" }, {
            headers: {
              "Content-Type": "application/json",
            },
          })
        }
      } catch (apiError) {
        console.error("API fetch failed, falling back to RSS:", apiError)
        // Fall through to RSS feed
      }
    }

    // Fallback to RSS feed (always available)
    const rssUrl = `${substackUrl}/feed`
    
    const response = await fetch(rssUrl, {
      headers: {
        Accept: "application/rss+xml, application/xml, text/xml",
        "User-Agent": "Mozilla/5.0 (compatible; Elysium/1.0)",
      },
      // Reduce cache time to 5 minutes for faster updates, or skip cache if refresh=true
      next: forceRefresh ? { revalidate: 0 } : { revalidate: 300 }, // Revalidate every 5 minutes
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
      },
    })
  } catch (error) {
    console.error("Error fetching Substack content:", error)
    return NextResponse.json({ error: "Failed to fetch articles", articles: [] }, { status: 500 })
  }
}

