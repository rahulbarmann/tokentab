/* eslint-disable @stylistic/jsx-self-closing-comp */
/* eslint-disable unicorn/prefer-string-replace-all */

import { Button } from '@/entrypoints/newtab/src/components/ui/button'
import { Card } from '@/entrypoints/newtab/src/components/ui/card'
import type { Card as ContentCardType } from '@/entrypoints/newtab/src/types/dashboard'
import { ExternalLink, Calendar, Eye, Heart, MessageCircle, Repeat, Bookmark } from 'lucide-react'
import { cn } from '@/entrypoints/newtab/src/lib/utils'
import { useEffect, useRef, useState } from 'react'

// Helper function to extract first image from HTML content
const extractFirstImage = (html: string): string | null => {
  const parser = new DOMParser()
  const doc = parser.parseFromString(html, 'text/html')
  const firstImage = doc.querySelector('img')
  return firstImage?.src || null
}

export function ContentCard({
  card,
  isExpanded = false,
  className,
}: {
  card: ContentCardType
  isExpanded?: boolean
  className?: string
}) {
  if (card.type === 'tweet') {
    const htmlImage = extractFirstImage(card.html)
    const imageToShow = card.media?.url || htmlImage
    const contentWithoutImages = card.html.replace(/<img[^>]*>/g, '')

    // Inside the ContentCard component, add these before the return statement:
    const timestampRef = useRef<HTMLDivElement>(null)
    const [showFullDate, setShowFullDate] = useState(true)

    // Inside the ContentCard component, before the return statement:
    const statsRef = useRef<HTMLDivElement>(null)
    const [visibleStatsCount, setVisibleStatsCount] = useState(5) // Start with all visible
    const [hiddenStatsCount, setHiddenStatsCount] = useState(0)

    // Update the timestamp useEffect hook
    useEffect(() => {
      const updateDateVisibility = () => {
        const container = timestampRef.current
        if (!container) return

        // Get the total available width considering padding
        const containerStyle = window.getComputedStyle(container)
        const padding = parseFloat(containerStyle.paddingLeft) + parseFloat(containerStyle.paddingRight)
        const availableWidth = container.offsetWidth - padding

        // Measure text widths
        const fullDateText = new Date(card.timestamp).toLocaleDateString()
        const tempSpan = document.createElement('span')
        tempSpan.className = 'text-[10px] whitespace-nowrap'
        tempSpan.textContent = fullDateText
        document.body.appendChild(tempSpan)
        const fullTextWidth = tempSpan.offsetWidth
        document.body.removeChild(tempSpan)

        // Check if full date fits with icon
        const iconWidth = 14 // size-2.5 (10px) + 4px gap
        setShowFullDate(iconWidth + fullTextWidth <= availableWidth)
      }

      // Add debounce for better performance
      const debouncedUpdate = debounce(updateDateVisibility, 100)
      updateDateVisibility()
      window.addEventListener('resize', debouncedUpdate)
      return () => {
        window.removeEventListener('resize', debouncedUpdate)
      }
    }, [card.timestamp]) // Add card.timestamp as dependency

    // Add this debounce utility function
    function debounce(func: (...args: any[]) => void, wait: number) {
      let timeout: NodeJS.Timeout
      return (...args: any[]) => {
        clearTimeout(timeout)
        timeout = setTimeout(() => func(...args), wait)
      }
    }

    useEffect(() => {
      const calculateVisibleStats = () => {
        const container = statsRef.current
        if (!container) return

        const stats = Array.from(container.children) as HTMLElement[]
        if (stats.length === 0) return

        const containerWidth = container.offsetWidth
        const moreButtonWidth = 48 // Approximate width of "+X" button
        const firstStat = stats[0]
        const statWidth = firstStat?.offsetWidth || 0

        // Calculate how many stats can fit including potential more button
        let availableWidth = containerWidth
        let visibleCount = 0

        while (availableWidth > 0 && visibleCount < stats.length) {
          const neededWidth = (visibleCount + 1) * statWidth + (visibleCount === stats.length - 1 ? 0 : moreButtonWidth)
          if (neededWidth <= containerWidth) {
            visibleCount++
            availableWidth = containerWidth - visibleCount * statWidth
          } else {
            break
          }
        }

        setVisibleStatsCount(visibleCount)
        setHiddenStatsCount(stats.length - visibleCount)
      }

      calculateVisibleStats()
      window.addEventListener('resize', calculateVisibleStats)
      return () => window.removeEventListener('resize', calculateVisibleStats)
    }, [])

    // Utility function to format numbers
    const formatNumber = (num: number): string => {
      if (num >= 1000000) {
        return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M'
      }
      if (num >= 1000) {
        return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K'
      }
      return num.toString()
    }

    return (
      <Card
        className={cn(
          'rounded-xl border-0 bg-gray-900/50 p-4 w-full transition-all duration-300',
          isExpanded && 'md:col-span-2',
          className
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
              <h3 className="text-sm font-semibold !text-white">{card.user.displayName}</h3>
              <div className="flex items-center gap-1">
                <svg className="size-3 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.643 4.937c-.835.37-1.732.62-2.675.733.962-.576 1.7-1.49 2.048-2.578-.9.534-1.897.922-2.958 1.13-.85-.904-2.06-1.47-3.4-1.47-2.572 0-4.658 2.086-4.658 4.66 0 .364.042.718.12 1.06-3.873-.195-7.304-2.05-9.602-4.868-.4.69-.63 1.49-.63 2.342 0 1.616.823 3.043 2.072 3.878-.764-.025-1.482-.234-2.11-.583v.06c0 2.257 1.605 4.14 3.737 4.568-.392.106-.803.162-1.227.162-.3 0-.593-.028-.877-.082.593 1.85 2.313 3.198 4.352 3.234-1.595 1.25-3.604 1.995-5.786 1.995-.376 0-.747-.022-1.112-.065 2.062 1.323 4.51 2.093 7.14 2.093 8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602.91-.658 1.7-1.477 2.323-2.41z"></path>
                </svg>
                <span className="text-xs text-gray-400">@{card.user.username}</span>
              </div>
            </div>
          </div>
          <div ref={timestampRef} className="flex items-center gap-1 text-gray-400">
            <Calendar className="size-2.5 shrink-0" />
            <span className="text-[10px] text-gray-400 whitespace-nowrap">
              {showFullDate
                ? new Date(card.timestamp).toLocaleDateString()
                : new Date(card.timestamp).toLocaleDateString('en-US', {
                    month: '2-digit',
                    day: '2-digit',
                    year: '2-digit',
                  })}
            </span>
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
        <div ref={statsRef} className="flex pt-4 items-center gap-4 text-gray-400 overflow-hidden">
          {[
            { icon: Eye, value: card.engagement.views },
            { icon: Heart, value: card.engagement.likes },
            { icon: MessageCircle, value: card.engagement.replies },
            { icon: Repeat, value: card.engagement.retweets },
            { icon: Bookmark, value: card.engagement.bookmarks },
          ]
            .slice(0, visibleStatsCount)
            .map((stat, index) => (
              <div key={index} className="flex items-center gap-1.5 shrink-0">
                <stat.icon className="size-3.5 min-w-[14px]" />
                <span className="text-xs whitespace-nowrap">{formatNumber(stat.value)}</span>
              </div>
            ))}

          {hiddenStatsCount > 0 && (
            <div className="flex items-center gap-1.5 shrink-0 text-gray-400">
              <span className="text-xs">+{hiddenStatsCount}</span>
            </div>
          )}
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
