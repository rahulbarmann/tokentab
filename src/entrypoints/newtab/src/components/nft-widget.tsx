/* eslint-disable unicorn/no-unused-properties */

import { Card } from '@/entrypoints/newtab/src/components/ui/card'
import { BadgeCheck, CheckCircle, Loader2 } from 'lucide-react'
import brightEth from '@/assets/eth-bright.svg'
import { useEffect, useState } from 'react'

interface NFTData {
  node: {
    name: string
    banner: string
    verificationStatus: string
    statsV2: {
      totalSupply: number
    }
    windowCollectionStats: {
      floorPrice: {
        unit: string
        symbol: string
      }
      volume: {
        unit: string
        symbol: string
      }
    }
    slug: string
  }
}

export function NFTWidget() {
  const [nftData, setNftData] = useState<NFTData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchNFT = async () => {
      try {
        const response = await fetch('https://api.tokentab.io/getDailyNFT')
        if (!response.ok) {
          throw new Error('Failed to fetch NFT data')
        }
        const data = await response.json()
        setNftData(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch NFT')
      } finally {
        setIsLoading(false)
      }
    }

    fetchNFT()
  }, [])

  if (error) {
    return (
      <Card className="rounded-xl border-0 bg-gray-900/50 p-4">
        <div className="flex min-h-[200px] items-center justify-center text-red-400">
          <p>Failed to load NFT of the day</p>
        </div>
      </Card>
    )
  }

  if (isLoading || !nftData) {
    return (
      <Card className="rounded-xl border-0 bg-gray-900/50 p-4">
        <div className="flex min-h-[200px] items-center justify-center">
          <Loader2 className="size-6 animate-spin text-[#4E4BDE]" />
        </div>
      </Card>
    )
  }

  const { node } = nftData
  const floorPrice = parseFloat(node.windowCollectionStats.floorPrice.unit).toFixed(4)
  const volume = parseFloat(node.windowCollectionStats.volume.unit).toFixed(2)

  return (
    <Card className="rounded-xl border-0 bg-gray-900/50 p-4 hover:bg-gray-900/60 transition-colors duration-300">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold text-base !text-white">NFT of the day</h3>
        <a
          href={`https://opensea.io/collection/${node.slug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[13px] text-[#4E4BDE] hover:text-[#6d6beb] transition-colors"
        >
          View on OpenSea ↗
        </a>
      </div>
      <div className="space-y-4">
        <div className="relative aspect-square w-full overflow-hidden rounded-lg">
          <img
            src={node.banner}
            alt={node.name}
            className="h-full w-full object-cover transform hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className="p-2">
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-1">
              <h4 className="font-semibold text-sm !text-white">{node.name}</h4>
              {node.verificationStatus === 'VERIFIED' && <BadgeCheck className="size-4 text-green-600" />}
            </div>
          </div>
          <div className="flex items-center gap-2 text-gray-400">
            <span>Supply: {node.statsV2.totalSupply.toLocaleString()}</span>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <div>
              <div className="text-gray-400 mb-1">Floor Price</div>
              <div className="flex items-center gap-2 font-semibold text-white">
                <img src={brightEth} alt="eth" className="size-5" />
                <span>{floorPrice} ETH</span>
              </div>
            </div>
            <div>
              <div className="text-gray-400 mb-1">24h Volume</div>
              <div className="flex items-center gap-2 font-semibold text-white">
                <img src={brightEth} alt="eth" className="size-5" />
                <span>{volume} ETH</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
