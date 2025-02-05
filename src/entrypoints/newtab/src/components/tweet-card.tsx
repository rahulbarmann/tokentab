/* eslint-disable @stylistic/jsx-self-closing-comp */
/* eslint-disable unicorn/prefer-string-replace-all */

import { Button } from '@/entrypoints/newtab/src/components/ui/button'
import { Card } from '@/entrypoints/newtab/src/components/ui/card'
import type { Card as ContentCardType } from '@/entrypoints/newtab/src/types/dashboard'
import { ExternalLink, Calendar, Eye, Heart, MessageCircle, Repeat, Bookmark } from 'lucide-react'
import { cn } from '@/entrypoints/newtab/src/lib/utils'

// Helper function to extract first image from HTML content
const extractFirstImage = (html: string): string | null => {
  const parser = new DOMParser()
  const doc = parser.parseFromString(html, 'text/html')
  const firstImage = doc.querySelector('img')
  return firstImage?.src || null
}

export function ContentCard({ card, isExpanded = false }: { card: ContentCardType; isExpanded?: boolean }) {
  if (card.type === 'tweet') {
    const htmlImage = extractFirstImage(card.html)
    const imageToShow = card.media?.url || htmlImage
    const contentWithoutImages = card.html.replace(/<img[^>]*>/g, '')

    return (
      <Card
        className={cn(
          'rounded-xl border-0 bg-gray-900/50 p-4 w-full transition-all duration-300',
          isExpanded && 'md:col-span-2'
        )}
      >
        <div className="mb-3 flex items-start justify-between">
          <div className="flex items-start gap-2">
            <div className="size-8 shrink-0 overflow-hidden rounded-full">
              <img
                src={card.user.profilePhoto}
                alt={card.user.displayName}
                width={32}
                height={32}
                className="size-full object-cover"
                loading="lazy"
              />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">{card.user.displayName}</h3>
              <div className="flex items-center gap-1">
                <svg className="size-3 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.643 4.937c-.835.37-1.732.62-2.675.733.962-.576 1.7-1.49 2.048-2.578-.9.534-1.897.922-2.958 1.13-.85-.904-2.06-1.47-3.4-1.47-2.572 0-4.658 2.086-4.658 4.66 0 .364.042.718.12 1.06-3.873-.195-7.304-2.05-9.602-4.868-.4.69-.63 1.49-.63 2.342 0 1.616.823 3.043 2.072 3.878-.764-.025-1.482-.234-2.11-.583v.06c0 2.257 1.605 4.14 3.737 4.568-.392.106-.803.162-1.227.162-.3 0-.593-.028-.877-.082.593 1.85 2.313 3.198 4.352 3.234-1.595 1.25-3.604 1.995-5.786 1.995-.376 0-.747-.022-1.112-.065 2.062 1.323 4.51 2.093 7.14 2.093 8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602.91-.658 1.7-1.477 2.323-2.41z"></path>
                </svg>
                <span className="text-xs text-gray-400">@{card.user.username}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1 text-gray-400">
            <Calendar className="size-2.5" />
            <span className="text-[10px] text-gray-400">{new Date(card.timestamp).toLocaleDateString()}</span>
          </div>
        </div>
        <div className="mb-3 text-sm text-gray-300" dangerouslySetInnerHTML={{ __html: contentWithoutImages }} />
        {imageToShow && (
          <div className={cn('mb-3 overflow-hidden rounded-xl', isExpanded && 'aspect-[16/9]')}>
            <img
              src={imageToShow}
              alt="Tweet media"
              className={cn('w-full object-cover', isExpanded && 'h-full')}
              loading="lazy"
            />
          </div>
        )}
        <div className="flex flex-wrap pt-4 items-center gap-4 text-gray-400">
          <div className="flex items-center gap-1.5">
            <Eye className="size-3.5" />
            <span className="text-xs">{card.engagement.views}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Heart className="size-3.5" />
            <span className="text-xs">{card.engagement.likes}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <MessageCircle className="size-3.5" />
            <span className="text-xs">{card.engagement.replies}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Repeat className="size-3.5" />
            <span className="text-xs">{card.engagement.retweets}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Bookmark className="size-3.5" />
            <span className="text-xs">{card.engagement.bookmarks}</span>
          </div>
        </div>
      </Card>
    )
  }

  if (card.type === 'blog') {
    return (
      <Card
        className={cn(
          'h-fit rounded-xl border-0 bg-gray-900/50 p-6 transition-all duration-300 hover:scale-[1.02]',
          isExpanded && 'md:col-span-2'
        )}
      >
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-white">{card.title}</h3>
          <p className="text-sm text-gray-400">{card.description}</p>
          {card.media && (
            <div className={cn('overflow-hidden rounded-xl', isExpanded && 'aspect-[16/9]')}>
              <img
                src={card.media.url}
                alt={card.title}
                className={cn('w-full object-cover transition-transform hover:scale-105', isExpanded && 'h-full')}
                loading="lazy"
              />
            </div>
          )}
          <div className="flex items-center justify-between">
            <div className="text-xs text-gray-400">{new Date(card.publishedAt).toLocaleDateString()}</div>
            <Button
              variant="ghost"
              size="sm"
              className="text-blue-400 hover:bg-blue-400/10"
              onClick={() => window.open(card.websiteUrl, '_blank')}
            >
              <ExternalLink className="mr-2 size-4" />
              Read More
            </Button>
          </div>
        </div>
      </Card>
    )
  }

  return null
}
