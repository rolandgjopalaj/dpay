import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider, http, createConfig } from 'wagmi'
import { polygonMumbai } from 'wagmi/chains'
import { metaMask } from 'wagmi/connectors'

import dotenv from 'dotenv'
dotenv.config();

const config = createConfig({
  chains: [polygonMumbai],
  connectors: [
    metaMask(),
  ],
  transports: {
    [polygonMumbai.id]: http(process.env.HTTP_API),
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
