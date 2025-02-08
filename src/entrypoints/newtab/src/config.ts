import provider from 'metamask-extension-provider'
import { createConfig, http } from 'wagmi'
import { mainnet, sepolia } from 'wagmi/chains'
import { injected } from 'wagmi/connectors'

// Create a stream to a remote provider:
// const metamaskStream = new LocalMessageDuplexStream({
//   name: 'inpage',
//   target: 'contentscript',
// });

// this will initialize the provider and set it as window.ethereum
// initializeProvider({
//   connectionStream: metamaskStream,
// });

// const { ethereum } = window;

export const config = createConfig({
  ssr: false,
  chains: [mainnet, sepolia],
  transports: {
    [sepolia.id]: http('wss://sepolia.gateway.tenderly.co'),
    [mainnet.id]: http(),
    // [polygon.id]: http(),
    // [base.id]: http(),
    // [optimism.id]: http(),
    // [arbitrum.id]: http(),
    // [avalanche.id]: http(),
    // [bsc.id]: http(),
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
