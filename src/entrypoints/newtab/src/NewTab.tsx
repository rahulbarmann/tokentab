import globe from '@/assets/globe.svg'
import nft from '@/assets/nft.svg'
import portfolio from '@/assets/portfolio.svg'
import stats from '@/assets/stats.svg'
import widget from '@/assets/widget.svg'
import { CryptoBubblesWidget } from '@/entrypoints/newtab/src/components/crypto-bubbles-widget'
import { Header } from '@/entrypoints/newtab/src/components/header'
import { MarketSection } from '@/entrypoints/newtab/src/components/market-section'
import { NFTWidget } from '@/entrypoints/newtab/src/components/nft-widget'
import { PortfolioWidget } from '@/entrypoints/newtab/src/components/portfolio-widget'
import { Button } from '@/entrypoints/newtab/src/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/entrypoints/newtab/src/components/ui/dialog'
import { UpdatesSection } from '@/entrypoints/newtab/src/components/updates-section'
import '@/entrypoints/newtab/src/NewTab.css'
import '@/entrypoints/newtab/src/NewTab.scss'
import { CowSwapWidget, CowSwapWidgetParams, TradeType } from '@cowprotocol/widget-react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useAccount } from 'wagmi'
import { OfflinePage } from './components/offline-page'

// Define widget types
interface Widget {
  id: string
  name: string
  icon: string
  component: React.ReactNode
  description: string
  category: string
}

const NewTab = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [isExpanded, setIsExpanded] = useState(() => {
    // Retrieve the saved state from local storage or default to true
    const savedState = localStorage.getItem('sidebarExpanded')
    return savedState !== null ? JSON.parse(savedState) : true
  })
  const [provider, setProvider] = useState<any>(null)
  const [showWidgetDialog, setShowWidgetDialog] = useState(false)
  const [selectedWidgets, setSelectedWidgets] = useState<string[]>(() => {
    const saved = localStorage.getItem('selectedWidgets')
    return saved ? JSON.parse(saved) : ['portfolio', 'cowswap', 'crypto-bubbles', 'nft']
  })
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')

  const { connector } = useAccount()

  // Add online/offline detection
  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  useEffect(() => {
    if (connector) {
      connector
        .getProvider()
        .then((_provider: any) => {
          console.log('wagmi provider: ', _provider)
          setProvider(_provider)
        })
        .catch((error: any) => {
          console.error('Error getting provider: ', error)
        })
    }
  }, [connector])

  // const provider = connector?.getProvider();

  useEffect(() => {
    // Save the current state to local storage whenever it changes
    localStorage.setItem('sidebarExpanded', JSON.stringify(isExpanded))
  }, [isExpanded])

  useEffect(() => {
    localStorage.setItem('selectedWidgets', JSON.stringify(selectedWidgets))
  }, [selectedWidgets])

  if (!isOnline) {
    return <OfflinePage />
  }

  const handleWidgetClick = () => {
    if (!isExpanded) {
      setIsExpanded(true)
    }
  }

  const toggleWidget = (widgetId: string) => {
    setSelectedWidgets((prev) => (prev.includes(widgetId) ? prev.filter((id) => id !== widgetId) : [...prev, widgetId]))
  }

  //  Fill this form https://cowprotocol.typeform.com/to/rONXaxHV once you pick your "appCode"
  const params: CowSwapWidgetParams = {
    appCode: 'My Cool App', // Name of your app (max 50 characters)
    width: '100%', // Width in pixels (or 100% to use all available space)
    // height: '640px',
    chainId: 1, // 1 (Mainnet), 100 (Gnosis), 11155111 (Sepolia)
    tokenLists: [
      // All default enabled token lists. Also see https://tokenlists.org
      'https://raw.githubusercontent.com/cowprotocol/token-lists/main/src/public/CoinGecko.1.json',
      'https://files.cow.fi/tokens/CowSwap.json',
    ],
    tradeType: TradeType.SWAP, // TradeType.SWAP, TradeType.LIMIT or TradeType.ADVANCED
    sell: {
      // Sell token. Optionally add amount for sell orders
      asset: 'USDC',
      amount: '100000',
    },
    buy: {
      // Buy token. Optionally add amount for buy orders
      asset: 'COW',
      amount: '0',
    },
    enabledTradeTypes: [
      // TradeType.SWAP, TradeType.LIMIT and/or TradeType.ADVANCED
      TradeType.SWAP,
      TradeType.LIMIT,
      TradeType.ADVANCED,
      TradeType.YIELD,
    ],
    theme: 'dark', // light/dark or provide your own color palette
    standaloneMode: false,
    disableToastMessages: false,
    disableProgressBar: false,
    hideBridgeInfo: false,
    hideOrdersTable: false,
    images: {},
    sounds: {},
    customTokens: [],
  }

  // Ethereum EIP-1193 provider. For a quick test, you can pass `window.ethereum`, but consider using something like https://web3modal.com
  // const provider = window.ethereum

  const AVAILABLE_WIDGETS: Widget[] = [
    {
      id: 'portfolio',
      name: 'Portfolio',
      icon: portfolio,
      component: <PortfolioWidget />,
      description: 'Track your crypto portfolio value and performance in real-time',
      category: 'Finance',
    },
    {
      id: 'cowswap',
      name: 'CowSwap',
      icon: stats,
      component: <CowSwapWidget params={params} provider={provider} />,
      description: 'Swap tokens with zero price impact and MEV protection',
      category: 'Trading',
    },
    {
      id: 'crypto-bubbles',
      name: 'Crypto Bubbles',
      icon: globe,
      component: <CryptoBubblesWidget />,
      description: 'Visualize crypto market movements with interactive bubbles',
      category: 'Analytics',
    },
    {
      id: 'nft',
      name: 'NFT Gallery',
      icon: nft,
      component: <NFTWidget />,
      description: 'Browse and showcase your NFT collection',
      category: 'NFTs',
    },
  ]

  return (
    <div className="flex h-screen overflow-hidden bg-[#0D0B21]">
      {/* Main Content Area */}
      <div className="h-screen flex-1 overflow-y-auto [-ms-overflow-style:'none'] [scrollbar-width:'none'] [&::-webkit-scrollbar]:hidden">
        <div className="p-8">
          <Header />
          <MarketSection />
          <UpdatesSection />
        </div>
      </div>

      {/* Divider */}
      <div className="relative w-8 shrink-0">
        <div className="absolute inset-y-0 left-1/2 w-px bg-gray-800/50" />
        <div className="sticky top-1/2 -translate-y-1/2">
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-1/2 flex size-8 -translate-x-1/2 cursor-pointer items-center justify-center rounded-full bg-blue-600 text-white hover:bg-blue-700"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? <ChevronRight className="size-4" /> : <ChevronLeft className="size-4" />}
          </Button>
        </div>
      </div>

      {/* Widgets Area */}
      <div
        className={`h-screen shrink-0 overflow-y-auto bg-[#0D0B21] transition-all duration-300 [-ms-overflow-style:'none'] [scrollbar-width:'none'] [&::-webkit-scrollbar]:hidden ${
          isExpanded ? 'w-[350px]' : 'w-[80px]'
        }`}
      >
        <div className={`${isExpanded ? 'p-4' : 'space-y-4 py-4 pl-2 pr-4'}`}>
          {isExpanded ? (
            <>
              <Button
                className="mb-4 h-16 w-full rounded-2xl bg-[#17172A] text-white hover:bg-gray-700"
                onClick={() => setShowWidgetDialog(true)}
              >
                <div className="font-semibold">Add more widgets</div>
                <img src={widget} alt="widget" width={50} height={20} className="mr-2 size-4" />
              </Button>
              {AVAILABLE_WIDGETS.filter((widget) => selectedWidgets.includes(widget.id)).map((widget) => (
                <div key={widget.id}>{widget.component}</div>
              ))}
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="flex h-12 w-full items-center justify-center rounded-xl bg-[#17172A] text-white hover:bg-[#1F1F35]"
                onClick={handleWidgetClick}
              >
                <img src={widget} alt="widget" width={50} height={20} className="size-4" />
              </Button>
              {AVAILABLE_WIDGETS.filter((widget) => selectedWidgets.includes(widget.id)).map((widget) => (
                <Button
                  key={widget.id}
                  variant="ghost"
                  size="icon"
                  className="flex h-12 w-full items-center justify-center rounded-xl bg-[#141331] text-white hover:bg-[#1F1F35]"
                  onClick={handleWidgetClick}
                >
                  <img src={widget.icon} alt={widget.name} width={50} height={50} className="size-4" />
                </Button>
              ))}
            </>
          )}
        </div>
      </div>

      <Dialog open={showWidgetDialog} onOpenChange={setShowWidgetDialog}>
        <DialogContent className="bg-[#080816] text-white max-w-full h-screen !rounded-none !border-0 p-0 flex flex-col [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-[#312F62]/50 [&::-webkit-scrollbar-thumb]:rounded-full">
          {/* Close button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-6 top-6 z-10 size-8 rounded-full bg-[#1F1F35] hover:bg-[#2a2a4a] text-white border border-[#312F62]/30 cursor-pointer"
            onClick={() => setShowWidgetDialog(false)}
          >
            ✕
          </Button>

          {/* Fixed Header Section */}
          <div className="flex-shrink-0 relative bg-[#0D0B21] border-b border-[#312F62]/30">
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -top-10 -left-10 size-72 rounded-full bg-[#4E4BDE]/5 blur-[80px]"></div>
              <div className="absolute -top-20 left-40 size-72 rounded-full bg-[#4E4BDE]/3 blur-[80px]"></div>
              <div className="absolute -top-10 right-0 size-72 rounded-full bg-[#4E4BDE]/5 blur-[80px]"></div>
            </div>

            <div className="relative max-w-[1200px] mx-auto px-6 py-6">
              <DialogHeader className="mb-0">
                <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent mb-1">
                  Widget Marketplace
                </DialogTitle>
                <p className="text-gray-400 text-sm max-w-2xl">
                  Customize your dashboard with powerful widgets. Each widget is designed to enhance your crypto
                  experience.
                </p>
              </DialogHeader>
            </div>
          </div>

          {/* Search and Categories - Fixed */}
          <div className="flex-shrink-0 sticky top-0 z-10 bg-[#080816] px-6 py-4 border-b border-[#312F62]/30">
            <div className="max-w-[1200px] mx-auto">
              {/* Categories */}
              <div className="flex gap-2 overflow-x-auto pb-1 [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-[#312F62]/50 [&::-webkit-scrollbar-thumb]:rounded-full">
                {['All', 'Finance', 'Trading', 'Analytics', 'NFTs'].map((category) => (
                  <Button
                    key={category}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                    className={`rounded-full px-5 py-4 whitespace-nowrap text-sm font-medium transition-all duration-200 cursor-pointer ${
                      category === selectedCategory
                        ? 'bg-[#4E4BDE] text-white hover:bg-[#6d6beb] shadow-lg shadow-[#4E4BDE]/20'
                        : 'bg-[#141428]/50 text-gray-400 hover:text-white hover:bg-[#1F1F35] hover:shadow-lg hover:shadow-[#4E4BDE]/10'
                    }`}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Scrollable Content Section */}
          <div className="flex-1 overflow-y-auto min-h-0 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-[#312F62]/50 [&::-webkit-scrollbar-thumb]:rounded-full">
            <div className="max-w-[1200px] mx-auto px-6 py-6">
              {/* Widgets Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {AVAILABLE_WIDGETS.filter(
                  (widget) =>
                    (selectedCategory === 'All' || widget.category === selectedCategory) &&
                    (widget.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      widget.description.toLowerCase().includes(searchQuery.toLowerCase()))
                ).map((widget) => (
                  <div
                    key={widget.id}
                    className="group flex flex-col rounded-2xl bg-[#141428]/50 backdrop-blur-sm p-6 transition-all duration-300 border border-[#312F62]/30 hover:border-[#4E4BDE]/50 hover:shadow-lg hover:shadow-[#4E4BDE]/5"
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex items-center justify-center size-12 rounded-2xl bg-[#1F1F35] group-hover:bg-[#4E4BDE]/10 transition-colors duration-300">
                        <img src={widget.icon} alt={widget.name} className="size-6" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg text-white/90 mb-1">{widget.name}</h3>
                        <span className="text-xs text-gray-400 bg-[#1F1F35] px-2 py-0.5 rounded-full">
                          {widget.category}
                        </span>
                      </div>
                    </div>

                    <p className="text-gray-400 text-sm mb-6 flex-grow leading-relaxed">{widget.description}</p>

                    <Button
                      variant={selectedWidgets.includes(widget.id) ? 'default' : 'secondary'}
                      onClick={() => toggleWidget(widget.id)}
                      className={`w-full h-11 rounded-xl font-medium transition-all duration-300 cursor-pointer flex items-center justify-center ${
                        selectedWidgets.includes(widget.id)
                          ? 'bg-[#4E4BDE] hover:bg-[#6d6beb] shadow-lg shadow-[#4E4BDE]/20'
                          : 'bg-[#1F1F35] hover:bg-[#2a2a4a] hover:shadow-lg hover:shadow-[#4E4BDE]/10'
                      }`}
                    >
                      {selectedWidgets.includes(widget.id) ? 'Installed' : 'Install'}
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default NewTab
