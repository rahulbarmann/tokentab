import { useEffect, useState, useRef } from 'react'
import { Card } from '@/entrypoints/newtab/src/components/ui/card'
import { Button } from '@/entrypoints/newtab/src/components/ui/button'
import { RefreshCw } from 'lucide-react'

interface CryptoData {
  id: string
  name: string
  symbol: string
  price: number
  dominance: number
  performance: {
    min1?: number
    min5?: number
    min15?: number
    hour?: number
    hour4?: number
    day?: number
    week?: number
    month?: number
    month3?: number
    year?: number
  }
  marketcap: number
}

type TimeFrame = 'hour' | 'day' | 'week' | 'month' | 'year'

export function CryptoBubblesWidget() {
  const [cryptoData, setCryptoData] = useState<CryptoData[]>([])
  const [loading, setLoading] = useState(true)
  const [timeFrame, setTimeFrame] = useState<TimeFrame>('day')
  const [allData, setAllData] = useState<CryptoData[]>([])
  const containerRef = useRef<HTMLDivElement>(null)

  const isValidPerformance = (value: number | undefined): value is number => {
    return typeof value === 'number' && !isNaN(value) && isFinite(value)
  }

  const fetchData = async () => {
    try {
      setLoading(true)
      const response = await fetch('https://cryptobubbles.net/backend/data/bubbles1000.usd.json')
      const data = await response.json()

      // Filter out any coins with missing or invalid performance data
      const validData = data.filter((coin: CryptoData) => {
        return (
          coin.performance &&
          isValidPerformance(coin.performance[timeFrame]) &&
          coin.symbol &&
          isValidPerformance(coin.price)
        )
      })

      setAllData(validData)
      updateTopPerformers(validData, timeFrame)
    } catch (error) {
      console.error('Error fetching crypto data:', error)
      setCryptoData([]) // Clear data on error
    } finally {
      setLoading(false)
    }
  }

  const updateTopPerformers = (data: CryptoData[], currentTimeFrame: TimeFrame) => {
    try {
      // Filter out coins with invalid performance for the current timeframe
      const validCoins = data.filter(
        (coin) => coin.performance && isValidPerformance(coin.performance[currentTimeFrame])
      )

      if (validCoins.length === 0) {
        console.warn(`No valid coins found for timeframe: ${currentTimeFrame}`)
        setCryptoData([])
        return
      }

      // Sort by absolute performance value (both positive and negative changes)
      const sortedData = [...validCoins].sort((a, b) => {
        const perfA = Math.abs(a.performance[currentTimeFrame] || 0)
        const perfB = Math.abs(b.performance[currentTimeFrame] || 0)
        return perfB - perfA
      })

      // Take top 12 performers
      setCryptoData(sortedData.slice(0, 12))
    } catch (error) {
      console.error('Error updating top performers:', error)
      setCryptoData([])
    }
  }

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 30000) // Refresh every 30 seconds
    return () => clearInterval(interval)
  }, [])

  // Update displayed data when timeframe changes
  useEffect(() => {
    if (allData.length > 0) {
      updateTopPerformers(allData, timeFrame)
    }
  }, [timeFrame, allData])

  const getBubbleSize = (performance: number) => {
    try {
      const minSize = 50 // Smaller minimum size
      const maxSize = 85 // Larger maximum size for more variation

      const absPerformance = Math.abs(performance)

      // Logarithmic scale for better distribution of sizes
      // This will make the size differences more noticeable for smaller percentages
      // while preventing extremely large bubbles for huge percentages
      const logBase = Math.log(100) // Base scale at 100%
      const logPerformance = Math.log(Math.max(absPerformance, 1))
      const normalizedSize = logPerformance / logBase

      const size = minSize + normalizedSize * (maxSize - minSize)
      return Math.min(maxSize, Math.max(minSize, size))
    } catch (error) {
      console.error('Error calculating bubble size:', error)
      return 50 // Return minimum size on error
    }
  }

  const getPerformanceColor = (performance: number) => {
    if (!isValidPerformance(performance)) return 'bg-[#1C1C1C] text-gray-400'
    if (performance > 0) return 'bg-[#133d1c] text-[#30FF4D]'
    if (performance < 0) return 'bg-[#3d1313] text-[#FF3030]'
    return 'bg-[#1C1C1C] text-gray-400'
  }

  const getPerformanceValue = (crypto: CryptoData): number => {
    const value = crypto.performance[timeFrame]
    return isValidPerformance(value) ? value : 0
  }

  return (
    <Card className="mb-4 rounded-xl border-0 bg-[#141331] bg-[url('/union.svg')] bg-no-repeat p-6">
      <div className="text-center">
        <div className="mb-4 flex items-center justify-center gap-2">
          <h3 className="text-gray-400 text-lg">Bubbles</h3>
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-400 hover:text-white"
            onClick={fetchData}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>

        <div className="mb-4 flex justify-center">
          <div className="flex rounded-lg bg-[#17172A] p-0.5">
            {(['hour', 'day', 'week', 'month', 'year'] as TimeFrame[]).map((tf) => (
              <Button
                key={tf}
                variant="ghost"
                size="sm"
                className={`h-6 px-3 py-1 text-xs ${
                  timeFrame === tf ? 'bg-[#4E4BDE] text-white' : 'text-gray-400 hover:bg-[#1F1F35]'
                }`}
                onClick={() => setTimeFrame(tf)}
              >
                {tf.charAt(0).toUpperCase() + tf.slice(1)}
              </Button>
            ))}
          </div>
        </div>

        <div ref={containerRef} className="grid h-[400px] w-full grid-cols-3 place-items-center gap-4 p-2">
          {cryptoData.map((crypto) => {
            const performance = getPerformanceValue(crypto)
            const bubbleSize = getBubbleSize(performance)
            const performanceClass = getPerformanceColor(performance)

            return (
              <div
                key={crypto.id}
                className={`flex cursor-pointer flex-col items-center justify-center rounded-full ${performanceClass} transition-all duration-300 hover:scale-105`}
                style={{
                  width: bubbleSize,
                  height: bubbleSize,
                }}
              >
                <div className="text-sm font-bold">{crypto.symbol}</div>
                <div className="text-xs">
                  ${crypto.price < 0.01 ? crypto.price.toFixed(4) : crypto.price.toFixed(2)}
                </div>
                <div className="text-xs font-medium">
                  {performance > 0 ? '+' : ''}
                  {performance.toFixed(1)}%
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </Card>
  )
}
