/**
 * API Route to fetch full Substack article content
 * Fetches the actual article page and extracts the main content
 */

import { NextResponse } from "next/server"

/**
 * Extract main article content from Substack HTML
 * Substack articles typically have content in specific div classes
 */
function extractArticleContent(html: string): string {
  // Substack-specific patterns - prioritize these
  const substackPatterns = [
    /<div[^>]*class="[^"]*post-body[^"]*"[\s\S]*?>([\s\S]*?)<\/div>/i,
    /<div[^>]*class="[^"]*body-markup[^"]*"[\s\S]*?>([\s\S]*?)<\/div>/i,
    /<div[^>]*data-module="PostBody"[\s\S]*?>([\s\S]*?)<\/div>/i,
    /<section[^>]*class="[^"]*post-content[^"]*"[\s\S]*?>([\s\S]*?)<\/section>/i,
  ]

  // Generic patterns as fallback
  const genericPatterns = [
    /<article[^>]*>([\s\S]*?)<\/article>/i,
    /<main[^>]*>([\s\S]*?)<\/main>/i,
    /<div[^>]*class="[^"]*content[^"]*"[\s\S]*?>([\s\S]*?)<\/div>/i,
  ]

  // Try Substack-specific patterns first
  for (const pattern of substackPatterns) {
    const match = html.match(pattern)
    if (match && match[1]) {
      let content = cleanHtmlContent(match[1])
      if (content.length > 500) { // Only return if we got substantial content
        return content
      }
    }
  }

  // Fallback to generic patterns
  for (const pattern of genericPatterns) {
    const match = html.match(pattern)
    if (match && match[1]) {
      let content = cleanHtmlContent(match[1])
      if (content.length > 500) {
        return content
      }
    }
  }

  // Last resort: extract from body but clean it thoroughly
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i)
  if (bodyMatch) {
    return cleanHtmlContent(bodyMatch[1])
  }

  return ''
}

/**
 * Clean HTML content by removing unwanted elements
 * IMPORTANT: Preserves images and their proper structure
 */
function cleanHtmlContent(content: string): string {
  // Remove scripts and styles
  content = content.replace(/<script[\s\S]*?<\/script>/gi, '')
  content = content.replace(/<style[\s\S]*?<\/style>/gi, '')
  content = content.replace(/<noscript[\s\S]*?<\/noscript>/gi, '')
  
  // Remove navigation and UI elements
  content = content.replace(/<nav[\s\S]*?<\/nav>/gi, '')
  content = content.replace(/<header[\s\S]*?<\/header>/gi, '')
  content = content.replace(/<footer[\s\S]*?<\/footer>/gi, '')
  content = content.replace(/<aside[\s\S]*?<\/aside>/gi, '')
  
  // Remove Substack-specific UI elements (but preserve content divs that might contain images)
  content = content.replace(/<div[^>]*class="[^"]*subscribe[^"]*"[\s\S]*?<\/div>/gi, '')
  content = content.replace(/<div[^>]*class="[^"]*share[^"]*"[\s\S]*?<\/div>/gi, '')
  content = content.replace(/<div[^>]*class="[^"]*header[^"]*"[\s\S]*?<\/div>/gi, '')
  content = content.replace(/<div[^>]*class="[^"]*sidebar[^"]*"[\s\S]*?<\/div>/gi, '')
  content = content.replace(/<div[^>]*class="[^"]*footer[^"]*"[\s\S]*?<\/div>/gi, '')
  content = content.replace(/<div[^>]*class="[^"]*navigation[^"]*"[\s\S]*?<\/div>/gi, '')
  
  // Remove ads and tracking
  content = content.replace(/<div[^>]*class="[^"]*ad[^"]*"[\s\S]*?<\/div>/gi, '')
  content = content.replace(/<div[^>]*id="[^"]*ad[^"]*"[\s\S]*?<\/div>/gi, '')
  
  // Process images to ensure they have proper src attributes
  // Handle Substack's CDN URLs and ensure proper formatting
  content = content.replace(/<img([^>]*?)>/gi, (match) => {
    // Extract src from the image tag
    const srcMatch = match.match(/src=["']([^"']*)["']/i)
    if (!srcMatch || !srcMatch[1]) {
      return match // No src, skip
    }
    
    let src = srcMatch[1]
    
    // Handle Substack CDN URLs - they use a special format
    // Example: https://substackcdn.com/image/fetch/w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2F...
    if (src.includes('substackcdn.com/image/fetch')) {
      // These are already absolute and properly formatted
      console.log('Found Substack CDN image:', src.substring(0, 100))
    } else if (!src.startsWith('http') && !src.startsWith('//') && !src.startsWith('data:')) {
      // Relative URL - make it absolute (shouldn't happen with Substack)
      console.log('Warning: Found relative image URL:', src)
    }
    
    // Extract other attributes
    const altMatch = match.match(/alt=["']([^"']*)["']/i)
    const alt = altMatch ? altMatch[1] : 'Article image'
    
    // Rebuild image tag with proper styling and attributes
    return `<img src="${src}" alt="${alt}" loading="lazy" style="display: block !important; max-width: 100% !important; width: 100% !important; height: auto !important; margin: 1.5rem auto !important; border-radius: 0.5rem !important; object-fit: contain !important;" />`
  })
  
  // Process picture elements and source tags
  content = content.replace(/<picture([^>]*?)>([\s\S]*?)<\/picture>/gi, (match, attrs, inner) => {
    // Preserve picture elements as they contain responsive images
    return `<picture${attrs}>${inner}</picture>`
  })
  
  // Clean up empty divs (but not ones that might contain images)
  content = content.replace(/<div[^>]*>\s*<\/div>/gi, '')
  
  // Don't collapse whitespace too aggressively as it might break image spacing
  content = content.replace(/\s{3,}/g, ' ')
  
  return content.trim()
}

/**
 * Fetch article content from Substack API by slug/ID
 */
async function fetchArticleFromAPI(apiKey: string, articleSlug: string): Promise<string | null> {
  try {
    const apiBaseUrl = process.env.SUBSTACK_API_BASE_URL || "https://api.substackapi.dev"
    const response = await fetch(`${apiBaseUrl}/posts/${articleSlug}`, {
      headers: {
        "X-API-Key": apiKey,
        "Content-Type": "application/json",
      },
      next: { revalidate: 3600 },
    })

    if (!response.ok) {
      return null
    }

    const data = await response.json()
    // Return the full HTML content from API
    return data.body_html || data.content_html || data.body || null
  } catch (error) {
    console.error("Error fetching article from API:", error)
    return null
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const articleUrl = searchParams.get('url')
    const articleSlug = searchParams.get('slug') // Optional: if slug is provided, try API first

    // Check if API key is provided
    const apiKey = process.env.SUBSTACK_API_KEY || process.env.NEXT_PUBLIC_SUBSTACK_API_KEY

    // If API key and slug are provided, try API first
    if (apiKey && articleSlug) {
      const apiContent = await fetchArticleFromAPI(apiKey, articleSlug)
      if (apiContent) {
        return NextResponse.json({
          content: apiContent,
          extracted: true,
          source: "api",
        }, {
          headers: {
            "Content-Type": "application/json",
          },
        })
      }
    }

    // Fallback to URL fetching (original method)
    if (!articleUrl) {
      return NextResponse.json(
        { error: "Article URL is required. Use ?url=<substack-article-url>" },
        { status: 400 }
      )
    }

    // Validate that it's a Substack URL for security
    const substackUrl = process.env.NEXT_PUBLIC_SUBSTACK_URL || "https://yash102244.substack.com"
    if (!articleUrl.startsWith(substackUrl) && !articleUrl.includes('.substack.com')) {
      return NextResponse.json(
        { error: "Invalid article URL. Must be a Substack URL." },
        { status: 400 }
      )
    }

    // Extract slug from URL for potential API retry
    const urlSlugMatch = articleUrl.match(/\/p\/([^/?]+)/)
    const slugFromUrl = urlSlugMatch ? urlSlugMatch[1] : null

    // Try API if we have key and slug
    if (apiKey && slugFromUrl) {
      const apiContent = await fetchArticleFromAPI(apiKey, slugFromUrl)
      if (apiContent) {
        return NextResponse.json({
          content: apiContent,
          extracted: true,
          source: "api",
        }, {
          headers: {
            "Content-Type": "application/json",
          },
        })
      }
    }

    // Fallback: Fetch the article page HTML
    const response = await fetch(articleUrl, {
      headers: {
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "User-Agent": "Mozilla/5.0 (compatible; Elysium/1.0)",
      },
      next: { revalidate: 3600 }, // Cache for 1 hour
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch article: ${response.statusText}`)
    }

    const html = await response.text()
    const content = extractArticleContent(html)

    if (!content) {
      // If we couldn't extract content, return the full HTML (client can handle it)
      return NextResponse.json({
        content: html,
        extracted: false,
        source: "html-scraping",
        message: "Could not extract article content. Full HTML returned."
      })
    }

    return NextResponse.json({
      content,
      extracted: true,
      source: "html-scraping",
    }, {
      headers: {
        "Content-Type": "application/json",
      },
    })
  } catch (error) {
    console.error("Error fetching Substack article:", error)
    return NextResponse.json(
      { error: "Failed to fetch article content", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
}

