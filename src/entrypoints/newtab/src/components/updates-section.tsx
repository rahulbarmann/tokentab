/* eslint-disable unused-imports/no-unused-vars */

import type { APIResponse, Card } from '@/entrypoints/newtab/src/types/dashboard'
import { useCallback, useEffect, useRef, useState } from 'react'
import { ContentCard } from './tweet-card'
import Masonry from 'react-masonry-css'
import { trackEvent } from '@/utils/analytics'

// Helper function to determine if a card should be expanded
const shouldExpandCard = (card: Card, index: number) => {
  // Only expand every 5th card if it has media
  return index % 5 === 0
}

// Helper function to construct tweet URL
const getTweetUrl = (cardId: string) => `https://x.com/jessepollak/status/${cardId}`

export function UpdatesSection() {
  const [cards, setCards] = useState<Card[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [totalPages, setTotalPages] = useState(1)
  const observer = useRef<IntersectionObserver | null>(null)

  // Responsive breakpoints with column counts
  const breakpointColumnsObj = {
    default: 4, // Changed from 1 to 4
    640: 1, // sm
    768: 2, // md
    1024: 3, // lg
    1440: 4, // xl
    1920: 4, // 2xl
  }

  const handleCardClick = (cardId: string) => {
    const tweetUrl = getTweetUrl(cardId)
    window.open(tweetUrl, '_blank')
    trackEvent('tweet_open', { url: tweetUrl })
  }

  const lastCardRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isLoading) return
      if (observer.current) observer.current.disconnect()

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setCurrentPage((prev) => prev + 1)
        }
      })

      if (node) observer.current.observe(node)
    },
    [isLoading, hasMore]
  )

  const fetchCards = useCallback(async (page: number) => {
    try {
      setIsLoading(true)
      const response = await fetch(`https://api.tokentab.io/getFeeds?page=${page}`)
      if (!response.ok) {
        throw new Error('Failed to fetch feeds')
      }
      const data: APIResponse = await response.json()
      setCards((prevCards) => (page === 1 ? data.cards : [...prevCards, ...data.cards]))
      setTotalPages(data.totalPages)
      setHasMore(data.page < data.totalPages)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch feeds')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchCards(currentPage)
  }, [currentPage, fetchCards])

  if (error && cards.length === 0) {
    return (
      <div className="flex min-h-[200px] items-center justify-center">
        <div className="text-red-400">{error}</div>
      </div>
    )
  }

  return (
    <div className="origin-top">
      <div className="w-full pr-2">
        <h2 className="mb-4 text-sm font-medium !text-gray-400">UPDATES</h2>
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="flex w-full gap-4"
          columnClassName="flex flex-col gap-4 flex-grow"
        >
          {cards.map((card, index) => {
            const isExpanded = shouldExpandCard(card, index)

            return (
              <div
                key={card.id}
                ref={index === cards.length - 1 ? lastCardRef : undefined}
                className={`transition-all duration-300 ease-in-out ${isExpanded ? 'col-span-2' : ''}`}
                style={{
                  width: '100%',
                  breakInside: 'avoid',
                }}
                onClick={() => handleCardClick(card.id)}
              >
                <ContentCard
                  card={card}
                  isExpanded={isExpanded}
                  className="hover:outline hover:outline-indigo-800 hover:outline-offset-2 cursor-pointer transition-all duration-200"
                />
              </div>
            )
          })}
        </Masonry>
        {isLoading && (
          <div className="mt-4 flex justify-center">
            <div className="text-gray-400">Loading more updates...</div>
          </div>
        )}
        {!hasMore && cards.length > 0 && (
          <div className="mt-4 flex justify-center">
            <div className="text-gray-400">No more updates to load</div>
          </div>
        )}
      </div>
    </div>
  )
}
