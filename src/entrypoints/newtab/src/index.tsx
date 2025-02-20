import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import * as React from 'react'
import { createRoot } from 'react-dom/client'
import { WagmiProvider } from 'wagmi'
import { initAnalytics } from '@/utils/analytics'
import { config } from './config'
import './index.css'
import NewTab from './NewTab'

// Initialize PostHog
initAnalytics()

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
