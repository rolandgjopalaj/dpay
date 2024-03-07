import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider, http, createConfig } from 'wagmi'
import { polygonMumbai } from 'wagmi/chains'
import { metaMask } from 'wagmi/connectors'

const config = createConfig({
  chains: [polygonMumbai],
  connectors: [
    metaMask(),
  ],
  transports: {
    [polygonMumbai.id]: http("https://polygon-mumbai.g.alchemy.com/v2/L3VKKXeMAyAIKDIH60v46gDcYShnVkbo"),
  },
})

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}> 
        <App />
      </QueryClientProvider> 
    </WagmiProvider>
  </React.StrictMode>,
)
