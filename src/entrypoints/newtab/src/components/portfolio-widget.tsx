import { useState, useEffect } from 'react'
import { Button } from '@/entrypoints/newtab/src/components/ui/button'
import { Card } from '@/entrypoints/newtab/src/components/ui/card'
import { Settings } from 'lucide-react'

interface PortfolioData {
  total: {
    positions: number
  }
  changes: {
    absolute_1d: number
    percent_1d: number
  }
}

export function PortfolioWidget() {
  const [address, setAddress] = useState<string | null>(null)
  const [portfolioData, setPortfolioData] = useState<PortfolioData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showSettings, setShowSettings] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())

  useEffect(() => {
    const savedAddress = localStorage.getItem('walletAddress')
    if (savedAddress) {
      setAddress(savedAddress)
    }
  }, [])

  useEffect(() => {
    if (address) {
      fetchPortfolio(address)
    }
  }, [address])

  const fetchPortfolio = async (walletAddress: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch(`https://api.tokentab.io/getPortfolio?address=${walletAddress}`)
      if (!response.ok) throw new Error('Failed to fetch portfolio')
      const data = await response.json()
      setPortfolioData(data.data.attributes)
      setLastUpdated(new Date())
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch portfolio')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveAddress = (newAddress: string) => {
    localStorage.setItem('walletAddress', newAddress)
    setAddress(newAddress)
    setShowSettings(false)
  }

  if (!address || showSettings) {
    return (
      <Card className="mb-4 rounded-xl border-0 bg-[#141331] bg-[url(/union.svg)] bg-no-repeat p-6">
        <div className="relative text-center">
          <h3 className="mb-4 text-base !text-gray-400">Add Wallet Address</h3>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              const formData = new FormData(e.currentTarget)
              handleSaveAddress(formData.get('address') as string)
            }}
          >
            <input
              name="address"
              defaultValue={address || ''}
              placeholder="Enter wallet address"
              className="mb-4 w-full rounded-lg bg-gray-800 p-2 text-white focus:outline-none focus:ring-2 focus:ring-[#4E4BDE]"
            />
            <Button type="submit" className="w-24 rounded-xl bg-[#4E4BDE] hover:bg-[#6d6beb]">
              Save
            </Button>
          </form>
        </div>
      </Card>
    )
  }

  return (
    <Card className="relative mb-4 rounded-xl border-0 bg-[#141331] bg-[url(/union.svg)] bg-no-repeat p-6">
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-4 top-4 h-8 w-8 rounded-full text-gray-400 hover:bg-gray-700 hover:text-white"
        onClick={() => setShowSettings(true)}
      >
        <Settings className="h-4 w-4" />
      </Button>

      <div className="text-center">
        <h3 className="mb-4 text-base !text-gray-400">My Portfolio</h3>

        {isLoading ? (
          <div className="mb-2 text-4xl font-bold text-white">Loading...</div>
        ) : error ? (
          <div className="mb-2 text-red-500">{error}</div>
        ) : (
          <>
            <div className="mb-2 text-4xl font-bold text-white">
              {new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }).format(portfolioData?.total.positions || 0)}
            </div>
            <div className="mb-2 flex items-center justify-center gap-2">
              <span
                className={`text-sm ${portfolioData?.changes.absolute_1d! >= 0 ? 'text-green-500' : 'text-red-500'}`}
              >
                {portfolioData?.changes.absolute_1d! >= 0 ? '▲' : '▼'}{' '}
                {new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }).format(Math.abs(portfolioData?.changes.absolute_1d || 0))}
              </span>
              <span
                className={`text-sm ${portfolioData?.changes.percent_1d! >= 0 ? 'text-green-500' : 'text-red-500'}`}
              >
                ({portfolioData?.changes.percent_1d.toFixed(2)}%)
              </span>
            </div>
          </>
        )}

        <p className="mb-4 text-sm text-gray-400">
          {lastUpdated.toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          })}{' '}
          At {lastUpdated.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
        </p>

        <Button
          className="w-24 rounded-xl bg-[#4E4BDE] hover:bg-[#6d6beb]"
          onClick={() => fetchPortfolio(address)}
          disabled={isLoading}
        >
          {isLoading ? '...' : 'Refresh'}
        </Button>
      </div>
    </Card>
  )
}
