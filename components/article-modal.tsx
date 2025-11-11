"use client"

import { useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
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

interface ArticleModalProps {
  article: Article | null
  isOpen: boolean
  onClose: () => void
  isLoading?: boolean
}

export function ArticleModal({ article, isOpen, onClose, isLoading = false }: ArticleModalProps) {
  const posthog = usePostHog()
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose()
      }
    }
    window.addEventListener("keydown", handleEsc)
    return () => {
      window.removeEventListener("keydown", handleEsc)
    }
  }, [onClose])

  useEffect(() => {
    if (isOpen && article) {
      posthog?.capture("article_modal_open", {
        id: article.id,
        title: article.title,
      })
    }
  }, [isOpen, article, posthog])

  if (!article) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl w-full h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold font-display sr-only">{article.title}</DialogTitle>
        </DialogHeader>
        <div className="overflow-y-auto p-6 flex-grow">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-foreground mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading article content...</p>
              </div>
            </div>
          ) : (
            <div className="prose dark:prose-invert max-w-none mx-auto">
              <h1 className="text-3xl sm:text-4xl font-display font-bold mb-4">{article.title}</h1>
              <div className="text-sm text-muted-foreground mb-8">
                <span>{new Date(article.pubDate).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                <span className="mx-2">•</span>
                <span>By {article.author}</span>
                <span className="mx-2">•</span>
                <span>{article.readTime}</span>
              </div>
              {article.image && <img src={article.image} alt={article.title} className="rounded-lg mb-8" />}
              {article.content ? (
                <div 
                  className="article-content"
                  dangerouslySetInnerHTML={{ __html: article.content }}
                  style={{
                    // Style for better readability of Substack content
                    lineHeight: '1.75',
                  }}
                />
              ) : (
                <div className="space-y-4">
                  <p className="text-foreground leading-relaxed">{article.excerpt}</p>
                  {article.link && (
                    <a
                      href={article.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => {
                        posthog?.capture("article_external_open", {
                          id: article.id,
                          link: article.link,
                        })
                      }}
                      className="inline-flex items-center gap-2 text-foreground hover:text-muted-foreground transition-colors underline"
                    >
                      Read full article on Substack
                      <span>→</span>
                    </a>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
