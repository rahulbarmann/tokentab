import { useEffect, useState } from 'react'
import { useAccount, useChainId, useDisconnect, useConnect } from 'wagmi'
import { Pencil, ChevronDown } from 'lucide-react'
import { NetworkSwitcher } from '@/components/web3/SwitchNetworks'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import metamaskFox from '../../../../assets/metamask-fox.svg'
import metamaskIcon from '../../../../assets/metamask-icon.png'

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
  const [pendingConnectorId, setPendingConnectorId] = useState('')

  const { address, isConnected, chain } = useAccount()
  const { disconnect } = useDisconnect()
  const { connectAsync, connectors, isPending } = useConnect()

  const handleConnectWallet = async () => {
    const connector = connectors[0] // Usually MetaMask is the first connector
    if (connector) {
      setPendingConnectorId(connector.id)
      await connectAsync({ connector })
    }
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

  const handleNameChange = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const newName = (e.target as HTMLInputElement).value.trim()
      if (newName) {
        setName(newName)
        localStorage.setItem('userName', newName)
      }
      setIsEditing(false)
    }
  }

  return (
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
                onKeyDown={handleNameChange}
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
        <p className="text-sm text-gray-400">some heading text comes here</p>
      </div>

      <div className="flex items-center gap-3">
        {/* <div className="flex items-center -space-x-5">
    //       <div className="z-10 size-12 overflow-visible rounded-full">
    //         <img src={profile} alt="Profile" width={28} height={28} className="size-full
    //         object-cover" />
    //       </div>
    //       <div className="z-0 flex w-24 gap-2 rounded-full bg-[#232434] py-1.5 pl-7 backdrop-blur">
    //         <div className="text-sm font-semibold text-white">566T</div>
    //         <div className="flex size-5 items-center justify-center rounded-full">
    //           <img src={info} alt="asd" width={15} height={15} />
    //         </div>
    //       </div>
    //     </div> */}
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
                onClick={() => disconnect()}
                className="text-red-500 hover:text-red-400 hover:bg-[#17172A] cursor-pointer rounded-lg"
              >
                Disconnect
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button
            variant="ghost"
            className="p-0 bg-transparent hover:bg-transparent border-none"
            onClick={handleConnectWallet}
            disabled={isPending}
          >
            {isPending ? (
              <span className="i-line-md:loading-twotone-loop h-4 w-4 inline-flex text-white" />
            ) : (
              <img src={metamaskFox} alt="MetaMask" width={160} height={60} className="rounded-none" />
            )}
          </Button>
        )}
      </div>
    </div>
  )
}
