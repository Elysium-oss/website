/**
 * API Route to fetch Substack RSS feed and return parsed articles
 * This avoids CORS issues when fetching from client-side
 */

import { NextResponse } from "next/server"

// Simple RSS parser for Node.js
function parseRSSServer(rssText: string) {
  const articles: any[] = []
  const itemMatches = rssText.match(/<item[^>]*>([\s\S]*?)<\/item>/gi)

  if (!itemMatches) return articles

  itemMatches.forEach((itemXml, index) => {
    const titleMatch = itemXml.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>|<title>(.*?)<\/title>/i)
    const linkMatch = itemXml.match(/<link>(.*?)<\/link>/i)
    const pubDateMatch = itemXml.match(/<pubDate>(.*?)<\/pubDate>/i)
    const descMatch = itemXml.match(/<description><!\[CDATA\[([\s\S]*?)\]\]><\/description>|<description>([\s\S]*?)<\/description>/i)
    const creatorMatch = itemXml.match(/<dc:creator>(.*?)<\/dc:creator>|<creator>(.*?)<\/creator>|<author>(.*?)<\/author>/i)
    const categoryMatch = itemXml.match(/<category>(.*?)<\/category>/i)

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

    const imageMatch = description.match(/<img[^>]+src=["']([^"']+)["']/i)
    const image = imageMatch ? imageMatch[1] : undefined

    // Use full description as content
    const content = description

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

export async function GET() {
  try {
    const substackUrl = process.env.NEXT_PUBLIC_SUBSTACK_URL || "https://elysium.substack.com"
    const rssUrl = `${substackUrl}/feed`

    const response = await fetch(rssUrl, {
      headers: {
        Accept: "application/rss+xml, application/xml, text/xml",
        "User-Agent": "Mozilla/5.0 (compatible; Elysium/1.0)",
      },
      next: { revalidate: 3600 }, // Revalidate every hour
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch RSS feed: ${response.statusText}`)
    }

    const rssText = await response.text()
    const articles = parseRSSServer(rssText)

    return NextResponse.json({ articles }, {
      headers: {
        "Content-Type": "application/json",
      },
    })
  } catch (error) {
    console.error("Error fetching Substack RSS:", error)
    return NextResponse.json({ error: "Failed to fetch RSS feed", articles: [] }, { status: 500 })
  }
}

