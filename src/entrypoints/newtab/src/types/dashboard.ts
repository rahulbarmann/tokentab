export interface CryptoPrice {
  symbol: string
  price: number
  change: number
  icon: string
  line: string
}

interface User {
  username: string
  profilePhoto: string
  displayName: string
  smartFollowerCount: number
}

interface Media {
  type: string
  url: string
  thumbnail?: string
}

interface Engagement {
  likes: number
  replies: number
  retweets: number
  views: number
  bookmarks: number
}

interface EngagementScore {
  score: number
  size: 'small' | 'medium' | 'large'
}

interface TweetMetadata {
  isReply: boolean
  isRetweet: boolean
  isQuote: boolean
  isSelfThread: boolean
  isPin: boolean
  hashtags: string[]
  urls: string[]
  sensitive: boolean
}

export interface BaseCard {
  id: string
  type: 'tweet' | 'blog'
  media?: Media | null
}

export interface Tweet extends BaseCard {
  type: 'tweet'
  user: User
  content: string
  html: string
  timestamp: string
  engagement: Engagement
  engagementScore: EngagementScore
  metadata: TweetMetadata
}

export interface Blog extends BaseCard {
  type: 'blog'
  websiteUrl: string
  title: string
  description: string
  publishedAt: string
}

export type Card = Tweet | Blog

export interface APIResponse {
  cards: Card[]
  page: number
  pageSize: number
  totalItems: number
  totalPages: number
}

export interface NFT {
  title: string
  creator: string
  image: string
  price: string
  endTime: string
  verified?: boolean
}
