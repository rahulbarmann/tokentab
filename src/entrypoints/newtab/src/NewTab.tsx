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

// Define widget types
interface Widget {
  id: string
  name: string
  icon: string
  component: React.ReactNode
}

const NewTab = () => {
  const [isExpanded, setIsExpanded] = useState(() => {
    // Retrieve the saved state from local storage or default to true
    const savedState = localStorage.getItem('sidebarExpanded')
    return savedState !== null ? JSON.parse(savedState) : true
  })
  const [provider, setProvider] = useState<any>(null);
  const [showWidgetDialog, setShowWidgetDialog] = useState(false)
  const [selectedWidgets, setSelectedWidgets] = useState<string[]>(() => {
    const saved = localStorage.getItem('selectedWidgets')
    return saved ? JSON.parse(saved) : ['portfolio', 'cowswap', 'crypto-bubbles', 'nft']
  })

  const {connector} = useAccount();

  useEffect(() => {
    if (connector) {
    connector.getProvider()
    .then((_provider: any) => {
      console.log("wagmi provider: ", _provider)
      setProvider(_provider);
    })
    .catch((error: any) => {
      console.error("Error getting provider: ", error);
    })
      
    }
  }, [connector]);

  // const provider = connector?.getProvider();


  useEffect(() => {
    // Save the current state to local storage whenever it changes
    localStorage.setItem('sidebarExpanded', JSON.stringify(isExpanded))
  }, [isExpanded])

  useEffect(() => {
    localStorage.setItem('selectedWidgets', JSON.stringify(selectedWidgets))
  }, [selectedWidgets])

  const handleWidgetClick = () => {
    if (!isExpanded) {
      setIsExpanded(true)
    }
  }

  const toggleWidget = (widgetId: string) => {
    setSelectedWidgets((prev) =>
      prev.includes(widgetId) ? prev.filter((id) => id !== widgetId) : [...prev, widgetId],
    )
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
    },
    {
      id: 'cowswap',
      name: 'CowSwap',
      icon: stats,
      component: <CowSwapWidget params={params} provider={provider} />,
    },
    {
      id: 'crypto-bubbles',
      name: 'Crypto Bubbles',
      icon: globe,
      component: <CryptoBubblesWidget />,
    },
    {
      id: 'nft',
      name: 'NFT Gallery',
      icon: nft,
      component: <NFTWidget />,
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
              <Button className="mb-4 h-16 w-full rounded-2xl bg-[#17172A] text-white hover:bg-gray-700" onClick={() => setShowWidgetDialog(true)}>
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
        <DialogContent className="bg-[#0D0B21] text-white sm:max-w-[425px] rounded-3xl border-[#312F62]">
          <DialogHeader>
            <DialogTitle className="text-xl">Customize Widgets</DialogTitle>
          </DialogHeader>
          <div className="mt-4 space-y-3">
            {AVAILABLE_WIDGETS.map((widget) => (
              <div
                key={widget.id}
                className="flex items-center justify-between rounded-2xl bg-[#17172A] p-4 hover:bg-[#1F1F35] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center size-10 rounded-xl bg-[#1F1F35]">
                    <img src={widget.icon} alt={widget.name} className="size-5" />
                  </div>
                  <span className="font-medium">{widget.name}</span>
                </div>
                <Button
                  variant={selectedWidgets.includes(widget.id) ? 'default' : 'secondary'}
                  onClick={() => toggleWidget(widget.id)}
                  className="rounded-xl px-6"
                >
                  {selectedWidgets.includes(widget.id) ? 'Remove' : 'Add'}
                </Button>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default NewTab
