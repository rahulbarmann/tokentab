import * as React from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import NewTab from './NewTab'
import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { config } from './config'

const queryClient = new QueryClient()

const root = createRoot(document.querySelector('#app')!)
root.render(
  <React.StrictMode>
    <WagmiProvider config={config} reconnectOnMount={false}>
      <QueryClientProvider client={queryClient}>
        <NewTab />
      </QueryClientProvider>
    </WagmiProvider>
  </React.StrictMode>
)
