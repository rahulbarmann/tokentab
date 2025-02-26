import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { NetworkSwitcher } from '@/components/web3/SwitchNetworks'
import { ChevronDown, Download, Pencil, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useAccount, useConnect, useDisconnect } from 'wagmi'
import metamaskFox from '../../../../assets/metamask-fox.svg'
import metamaskIcon from '../../../../assets/metamask-icon.png'
import provider from 'metamask-extension-provider'
import { trackError, trackEvent } from '@/utils/analytics'

const getGreeting = () => {
  const hour = new Date().getHours()
  if (hour >= 5 && hour < 12) return 'Good Morning'
  if (hour >= 12 && hour < 17) return 'Good Afternoon'
  if (hour >= 17 && hour < 22) return 'Good Evening'
  return 'Good Night'
}

export function Header() {
  const [greeting, setGreeting] = useState(getGreeting())
  const [name, setName] = useState('anon')
  const [isEditing, setIsEditing] = useState(false)
  const [showMetaMaskNotification, setShowMetaMaskNotification] = useState(false)
  const [isAttemptingConnection, setIsAttemptingConnection] = useState(false)

  const { address, isConnected, chain } = useAccount()
  const { disconnect } = useDisconnect()
  const { connectAsync, connectors } = useConnect()

  const checkMetaMaskAvailability = async () => {
    const metaMaskProvider = provider()

    return new Promise<boolean>((resolve) => {
      const handleError = () => {
        metaMaskProvider.removeListener('error', handleError)
        resolve(false)
      }

      metaMaskProvider.on('error', handleError)

      metaMaskProvider.sendAsync(
        {
          method: 'eth_accounts',
          params: [],
          id: null,
          jsonrpc: '2.0',
        },
        (error) => {
          metaMaskProvider.removeListener('error', handleError)
          if (error) {
            resolve(false)
          } else {
            resolve(true)
          }
        }
      )
    })
  }

  const handleConnect = async () => {
    setIsAttemptingConnection(true)
    try {
      const isMetaMaskAvailable = await checkMetaMaskAvailability()
      if (!isMetaMaskAvailable) {
        setShowMetaMaskNotification(true)
        trackEvent('wallet_connection_failed', { reason: 'metamask_not_available' })
        return
      }

      const result = await connectAsync({ connector: connectors[0] })
      trackEvent('wallet_connected', {
        address: result.accounts[0],
        chain_id: result.chainId,
      })
    } catch (error) {
      console.error('Connection error:', error)
      trackError(error as Error, { context: 'wallet_connection' })
    } finally {
      setIsAttemptingConnection(false)
    }
  }

  const handleDisconnect = () => {
    disconnect()
    trackEvent('wallet_disconnected')
  }

  const handleNameChange = (newName: string) => {
    setName(newName)
    setIsEditing(false)
    localStorage.setItem('userName', newName)
    trackEvent('name_updated', { new_name: newName })
  }

  useEffect(() => {
    // Update greeting every minute
    const interval = setInterval(() => {
      setGreeting(getGreeting())
    }, 60000)

    // Load name from local storage
    const savedName = localStorage.getItem('userName')
    if (savedName) {
      setName(savedName)
    }

    return () => clearInterval(interval)
  }, [])

  return (
    <>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-semibold !text-white">
              {greeting},{' '}
              {isEditing ? (
                <input
                  type="text"
                  defaultValue={name}
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      const newName = (e.target as HTMLInputElement).value.trim()
                      if (newName) {
                        handleNameChange(newName)
                      }
                    }
                  }}
                  onBlur={() => setIsEditing(false)}
                  className="bg-transparent outline-none border-b border-gray-500 focus:border-blue-500"
                />
              ) : (
                <span>{name}</span>
              )}
            </h1>
            <button onClick={() => setIsEditing(true)} className="text-gray-400 hover:text-white transition-colors">
              <Pencil size={16} />
            </button>
          </div>
          <p className="text-sm text-gray-400">Your daily dose of crypto chaos</p>
        </div>

        <div className="flex items-center gap-3">
          {isConnected ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center gap-3 px-4 py-6 bg-[#0D0B21] hover:bg-[#17172A] border border-[#312F62] rounded-full"
                >
                  <img src={metamaskIcon} alt="MetaMask" width={28} height={28} />
                  <div className="flex flex-col items-start gap-0.5">
                    <span className="text-sm font-medium text-white">
                      {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : ''}
                    </span>
                    <span className="text-xs text-gray-400">{chain?.name}</span>
                  </div>
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-56 bg-[#0D0B21] border border-[#312F62] text-white p-2 rounded-xl"
              >
                <div className="mb-2">
                  <NetworkSwitcher />
                </div>
                <DropdownMenuItem
                  onClick={handleDisconnect}
                  className="text-red-500 hover:text-red-400 hover:bg-[#17172A] cursor-pointer rounded-lg"
                >
                  Disconnect
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              variant="ghost"
              className="p-0 bg-transparent hover:bg-transparent border-none transition-opacity hover:opacity-80"
              onClick={handleConnect}
              disabled={isAttemptingConnection}
            >
              {isAttemptingConnection ? (
                <span className="i-line-md:loading-twotone-loop h-4 w-4 inline-flex text-white" />
              ) : (
                <img src={metamaskFox} alt="MetaMask" width={160} height={60} className="rounded-none" />
              )}
            </Button>
          )}
        </div>
      </div>

      {showMetaMaskNotification && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
          <div className="relative w-full max-w-md transform overflow-hidden rounded-2xl bg-[#0D0B21] p-6 text-left align-middle shadow-xl transition-all border border-[#312F62]">
            <div className="absolute right-4 top-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowMetaMaskNotification(false)}
                className="rounded-full hover:bg-[#17172A] text-gray-400 hover:text-white"
              >
                <X className="size-4" />
              </Button>
            </div>

            <div className="flex flex-col items-center text-center">
              <img src={metamaskIcon} alt="MetaMask" width={64} height={64} className="mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">MetaMask Required</h3>
              <p className="text-gray-400 text-sm mb-6">
                To use TokenTab, you need to have MetaMask installed. MetaMask is a secure wallet for accessing Web3
                applications.
              </p>
              <Button
                onClick={() => window.open('https://metamask.io/download/', '_blank')}
                className="bg-[#4E4BDE] hover:bg-[#6d6beb] text-white rounded-xl px-6 py-3 flex items-center gap-2"
              >
                <Download className="size-4" />
                Install MetaMask
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
