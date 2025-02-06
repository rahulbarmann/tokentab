import { createExternalExtensionProvider } from '@metamask/providers'
import { createConfig, http } from 'wagmi'
import { arbitrum, avalanche, base, bsc, mainnet, optimism, polygon, sepolia } from 'wagmi/chains'
import { injected } from 'wagmi/connectors'

export const config = createConfig({
  ssr: false,
  chains: [mainnet, polygon, base, optimism, arbitrum, avalanche, bsc],
  transports: {
    [mainnet.id]: http(),
    [polygon.id]: http(),
    [base.id]: http(),
    [optimism.id]: http(),
    [arbitrum.id]: http(),
    [avalanche.id]: http(),
    [bsc.id]: http(),
  },
  connectors: [
    injected({
      target: {
        id: 'metaMask',
        name: 'MetaMask',
        icon: '',
        provider: createExternalExtensionProvider() as any,
      },
    }),
  ],
})
