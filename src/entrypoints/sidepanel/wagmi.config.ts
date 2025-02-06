import provider from 'metamask-extension-provider'
import { createConfig, http } from 'wagmi'
import { mainnet, sepolia } from 'wagmi/chains'
import { injected } from 'wagmi/connectors'

export const config = createConfig({
  ssr: false,
  chains: [mainnet, sepolia],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
  connectors: [
    injected({
      target: {
        id: 'metaMask',
        name: 'MetaMask',
        icon: '',
        provider: provider as any,
      },
    }),
  ],
})
