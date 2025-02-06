import bitcoin from '@/assets/bitcoin.svg'
import downline from '@/assets/downline.svg'
import upline from '@/assets/upline.svg'
import { Button } from '@/entrypoints/newtab/src/components/ui/button'
import { Card } from '@/entrypoints/newtab/src/components/ui/card'
import type { CryptoPrice } from '@/entrypoints/newtab/src/types/dashboard'
import { X } from 'lucide-react'
import type { ChangeEvent } from 'react'
import { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog'
import { Input } from './ui/input'

const DEFAULT_PINNED_TOKEN_IDS = [
  'ee9702a0-c587-4c69-ac0c-ce820a50c95b', // Bitcoin
  'eth', // Ethereum
  '0xb8c77482e45f1f44de1745f52c74426c631bdd52', // BNB
  null, // Empty slot for user's choice
]

// Fixed positions for tokens
const TOKEN_POSITIONS = [0, 1, 2, 3] as const

interface ZerionToken {
  id: string
  attributes: {
    name: string
    symbol: string
    icon?: {
      url: string
    }
    market_data: {
      price: number
      changes: {
        percent_1d: number
      }
    }
  }
}

export function MarketSection() {
  const [cryptoPrices, setCryptoPrices] = useState<(CryptoPrice | null)[]>([null, null, null, null])
  const [allTokens, setAllTokens] = useState<ZerionToken[]>([])
  const [showTokenSelector, setShowTokenSelector] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedPosition, setSelectedPosition] = useState<number>(0)
  const [pinnedTokens, setPinnedTokens] = useState<(string | null)[]>(() => {
    const savedTokens = localStorage.getItem('pinnedTokens')
    if (savedTokens) {
      return JSON.parse(savedTokens)
    }
    return DEFAULT_PINNED_TOKEN_IDS.concat(Array(4 - DEFAULT_PINNED_TOKEN_IDS.length).fill(null))
  })

  const fetchTokens = async () => {
    try {
      const response = await fetch(
        'https://api.tokentab.io/getPrices',
        
      )
      const data = await response.json()
      setAllTokens(data)

      const pinnedData = pinnedTokens.map((tokenId) => {
        if (!tokenId) return null
        const token = data.find((t: ZerionToken) => t.id === tokenId)
        if (!token) return null
        return {
          symbol: token.attributes.symbol,
          price: token.attributes.market_data.price,
          change: token.attributes.market_data.changes.percent_1d,
          icon: token.attributes.icon?.url || bitcoin,
          line: token.attributes.market_data.changes.percent_1d > 0 ? upline : downline,
        }
      })

      setCryptoPrices(pinnedData)
    } catch (error) {
      console.error('Error fetching token data:', error)
    }
  }

  useEffect(() => {
    fetchTokens()
    const interval = setInterval(fetchTokens, 30000) // Refresh every 30 seconds
    return () => clearInterval(interval)
  }, [pinnedTokens])

  useEffect(() => {
    localStorage.setItem('pinnedTokens', JSON.stringify(pinnedTokens))
  }, [pinnedTokens])

  const handleAddToken = (tokenId: string) => {
    const newPinnedTokens = [...pinnedTokens]
    newPinnedTokens[selectedPosition] = tokenId
    setPinnedTokens(newPinnedTokens)
    setShowTokenSelector(false)
    setSearchQuery('')
  }

  const handleRemoveToken = (position: number) => {
    const newPinnedTokens = [...pinnedTokens]
    newPinnedTokens[position] = null
    setPinnedTokens(newPinnedTokens)
  }

  const filteredTokens = allTokens.filter(
    (token) =>
      !pinnedTokens.includes(token.id) &&
      (token.attributes.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        token.attributes.symbol.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  return (
    <div className="mb-8">
      <h2 className="mb-4 text-sm font-medium !text-gray-400">MARKET</h2>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 lg:gap-4">
        {TOKEN_POSITIONS.map((position) => {
          const crypto = cryptoPrices[position]
          return crypto ? (
            <Card
              key={position}
              className="relative rounded-xl border-0 bg-[#0D0B21] p-4 outline outline-1 outline-[#312F62]"
            >
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-2 text-gray-400 hover:bg-[#17172A] hover:text-gray-200"
                onClick={() => handleRemoveToken(position)}
              >
                <X />
              </Button>
              <div className="flex items-center gap-3">
                <span className="text-2xl">
                  <img src={crypto.icon} alt={crypto.symbol} width={30} height={30} className="rounded-lg" />
                </span>
                <div>
                  <div className="text-xl font-medium text-white">{crypto.price.toFixed(4)}</div>
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-medium text-gray-400">{crypto.symbol}</span>
                    <span className={`text-sm ${crypto.change > 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {crypto.change > 0 ? '+' : ''}
                      {crypto.change.toFixed(2)}%
                    </span>
                  </div>
                </div>
                <img src={crypto.line} alt={crypto.symbol} width={50} height={20} className="rounded-lg" />
              </div>
            </Card>
          ) : (
            <Button
              key={position}
              variant="ghost"
              className="flex size-full cursor-pointer items-center justify-center rounded-xl border-0 border-dashed border-gray-700 bg-[#0D0B21] p-4 outline-dashed outline-1 outline-[#312F62] hover:bg-[#17172A]"
              onClick={() => {
                setSelectedPosition(position)
                setShowTokenSelector(true)
              }}
            >
              <span className="text-gray-400">+ Add Currency</span>
            </Button>
          )
        })}
      </div>

      <Dialog open={showTokenSelector} onOpenChange={setShowTokenSelector}>
        <DialogContent className="max-h-[80vh] bg-[#0D0B21] text-white sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-lg font-medium text-white">Select Token</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <Input
              type="text"
              placeholder="Search tokens..."
              value={searchQuery}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
              className="mb-4 bg-[#17172A] text-white placeholder:text-gray-400"
            />
            <div className="[&::-webkit-scrollbar-track]:transparent max-h-[50vh] space-y-2 overflow-y-auto pr-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-700 [&::-webkit-scrollbar]:w-[6px]">
              {filteredTokens.map((token) => (
                <Button
                  key={token.id}
                  variant="ghost"
                  className="h-14 w-full justify-start rounded-lg p-3 text-left hover:bg-[#17172A]"
                  onClick={() => handleAddToken(token.id)}
                >
                  <img
                    src={token.attributes.icon?.url || bitcoin}
                    alt={token.attributes.symbol}
                    width={28}
                    height={28}
                    className="rounded-full"
                  />
                  <div className="ml-3 flex flex-col items-start">
                    <span className="text-sm text-white">{token.attributes.name}</span>
                    <span className="text-xs text-gray-400">{token.attributes.symbol}</span>
                  </div>
                </Button>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
