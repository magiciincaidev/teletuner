import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['guitar.png', 'manifest.json'],
      manifest: {
        name: 'TeleTuner - ギターチューナー',
        short_name: 'TeleTuner',
        description: '高精度音声解析エンジン搭載のギターチューナー',
        start_url: '/',
        display: 'standalone',
        background_color: '#171f14',
        theme_color: '#8cd279',
        icons: [
          {
            src: 'guitar.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,svg}'],
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\//,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'google-fonts-stylesheets',
            }
          }
        ]
      }
    })
  ],
  server: {
    host: true
  }
})
