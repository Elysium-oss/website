"use client"

import { useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

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
}

export function ArticleModal({ article, isOpen, onClose }: ArticleModalProps) {
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

  if (!article) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl w-full h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold font-display sr-only">{article.title}</DialogTitle>
        </DialogHeader>
        <div className="overflow-y-auto p-6 flex-grow">
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
            <div dangerouslySetInnerHTML={{ __html: article.content || article.excerpt }} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
