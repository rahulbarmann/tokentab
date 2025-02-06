import { useAccount, useSwitchChain } from 'wagmi'
import { useMemo, useState } from 'react'
import { cn } from '@/utils'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../ui/select'

export function NetworkSwitcher() {
  const { chains, switchChain, isPending } = useSwitchChain()
  const { chain, isConnected } = useAccount()
  const defaultValue = useMemo(() => chain?.id.toString(), [chain?.id])

  const [pendingChainId, setPendingChainId] = useState<number>()

  return (
    <Select
      onValueChange={(val) => {
        setPendingChainId(+val)
        switchChain({
          chainId: Number(val),
        })
      }}
      defaultValue={defaultValue}
      value={defaultValue}
    >
      <SelectTrigger
        className={cn(
          'w-full h-10 bg-[#0D0B21] hover:bg-[#17172A] border border-[#312F62] rounded-lg text-white',
          isConnected && !chain?.name ? 'text-red-500 border-red-500' : ''
        )}
      >
        <SelectValue>
          <span className="flex items-center gap-2">
            {isPending && <span className="i-line-md:loading-twotone-loop h-4 w-4 inline-flex text-white" />}
            {isConnected ? chain?.name ?? 'Error Network' : 'Select Network'}
          </span>
        </SelectValue>
      </SelectTrigger>
      <SelectContent className="bg-[#0D0B21] border border-[#312F62] text-white">
        <SelectGroup>
          {chains.map((x) =>
            x.id === chain?.id ? null : (
              <SelectItem
                value={`${x.id}`}
                key={x.id}
                className="hover:bg-[#17172A] cursor-pointer rounded-lg text-white focus:bg-[#17172A] focus:text-white"
              >
                <span className="flex items-center gap-2">
                  {isPending && x.id === pendingChainId && (
                    <span className="i-line-md:loading-twotone-loop h-4 w-4 inline-flex text-white" />
                  )}
                  {x.name}
                </span>
              </SelectItem>
            )
          )}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
