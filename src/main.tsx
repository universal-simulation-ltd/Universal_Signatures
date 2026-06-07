import React from 'react'
import ReactDOM from 'react-dom/client'
import { UniversalProvider } from '@unisim/sdk'
import type { ProductCode } from '@unisim/sdk'
import App from './App'
import './index.css'

// Universal Signatures: the signature studio + sign-a-PDF flow run entirely
// client-side (documents never leave the browser). Saving a *verified*
// signature to the cloud uses the Universal ID session (cookie SSO on
// .unisim.co.uk) and is gated by the org's entitlements — see lib/cloud.ts.
const universalConfig = {
  supabaseUrl: import.meta.env.VITE_PLATFORM_SUPABASE_URL || 'https://placeholder.supabase.co',
  supabaseAnonKey: import.meta.env.VITE_PLATFORM_SUPABASE_ANON_KEY || 'public-anon-placeholder',
  // 'signatures' is added to the SDK ProductCode union in this same change but
  // isn't in the published package yet — cast until the SDK is republished
  // (mirrors how QR/Charts shipped).
  product: 'signatures' as unknown as ProductCode,
  cookieDomain: import.meta.env.PROD ? '.unisim.co.uk' : undefined,
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <UniversalProvider config={universalConfig}>
      <App />
    </UniversalProvider>
  </React.StrictMode>
)
