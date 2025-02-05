/* eslint-disable unused-imports/no-unused-vars */

import type { APIResponse, Card } from '@/entrypoints/newtab/src/types/dashboard'
import { useCallback, useEffect, useRef, useState } from 'react'
import { ContentCard } from './tweet-card'
import Masonry from 'react-masonry-css'

// Helper function to determine if a card should be expanded
const shouldExpandCard = (card: Card, index: number) => {
  // Only expand every 5th card if it has media
  return index % 5 === 0
}

// Helper function to calculate dynamic bottom padding
const getBottomPadding = (index: number, columnCount: number) => {
  const row = Math.floor(index / columnCount)
  return row % 2 === 0 ? '0px' : '8px' // Alternate row padding
}

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
    default: 5, // 5 columns by default
    2560: 5, // 5 columns for 4K
    1920: 4, // 4 columns for 1080p
    1440: 3, // 3 columns for smaller desktop
    1024: 2, // 2 columns for tablet landscape
    768: 1, // 1 column for mobile
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
      <div className="lg:scale-90 xl:scale-95 2xl:scale-100">
        <h2 className="mb-4 text-sm font-medium text-gray-400">UPDATES</h2>
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="flex w-full gap-4"
          columnClassName="flex flex-col gap-4 flex-grow"
        >
          {cards.map((card, index) => {
            const isExpanded = shouldExpandCard(card, index)
            const bottomPadding = getBottomPadding(index, breakpointColumnsObj.default)

            return (
              <div
                key={card.id}
                ref={index === cards.length - 1 ? lastCardRef : undefined}
                className={`transition-all duration-300 ease-in-out ${isExpanded ? 'col-span-2' : ''}`}
                style={{
                  marginBottom: bottomPadding,
                  width: '100%',
                  breakInside: 'avoid',
                }}
              >
                <ContentCard card={card} isExpanded={isExpanded} />
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
