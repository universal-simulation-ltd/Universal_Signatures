import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'
import pkg from './package.json' with { type: 'json' }

// Universal Signatures is served at opensource.unisim.co.uk/signatures in
// production. `base` + PWA scope derive from Vite's `mode`; local dev stays `/`.
export default defineConfig(({ mode }) => {
  const BASE_PATH = mode === 'production' ? '/signatures/' : '/'
  return {
    base: BASE_PATH,
    define: {
      __APP_VERSION__: JSON.stringify(pkg.version)
    },
    resolve: {
      // Single React instance so @unisim/sdk hooks share the host dispatcher.
      dedupe: ['react', 'react-dom']
    },
    optimizeDeps: {
      exclude: ['@unisim/sdk']
    },
    plugins: [
      react(),
      tailwindcss(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.svg', 'unisim-icon.png'],
        manifest: {
          name: 'Universal Signatures',
          short_name: 'UniSign',
          description: 'Draw or type a signature and sign PDFs — in your browser',
          theme_color: '#0f172a',
          background_color: '#f8fafc',
          display: 'standalone',
          start_url: BASE_PATH,
          scope: BASE_PATH,
          icons: [
            { src: 'favicon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' },
            { src: 'unisim-icon.png', sizes: '128x128', type: 'image/png', purpose: 'any' }
          ]
        },
        workbox: {
          navigateFallback: `${BASE_PATH}index.html`,
        },
        devOptions: { enabled: false }
      })
    ]
  }
})
