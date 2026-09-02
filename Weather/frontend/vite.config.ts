import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  server: {
    host: true, // Listen on all local IP addresses (0.0.0.0) so mobile phones can connect
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
      },
      '/ws': {
        target: 'ws://127.0.0.1:8000',
        ws: true,
      },
    },
  },

  build: {
    // Target modern browsers for smaller output
    target: 'es2020',

    // Enable CSS code splitting per chunk
    cssCodeSplit: true,

    // Minification
    minify: 'esbuild',

    // Split vendor libraries into separate cacheable chunks
    rollupOptions: {
      output: {
        manualChunks: {
          // Core React runtime — changes rarely, cached long-term
          'vendor-react': ['react', 'react-dom'],

          // Router — separate so page-level changes don't bust React cache
          'vendor-router': ['react-router-dom'],

          // Charting library — heaviest dependency, isolate it
          'vendor-charts': ['recharts'],

          // Map library — only needed on /map page
          'vendor-maps': ['leaflet', 'react-leaflet'],

          // Icons — used across many pages
          'vendor-icons': ['lucide-react'],

          // PDF generation — only needed on /reports
          'vendor-pdf': ['jspdf', 'jspdf-autotable'],
        },
      },
    },

    // Raise the warning limit since we've split chunks properly
    chunkSizeWarningLimit: 300,

    // Enable source maps for debugging (disabled in prod for speed)
    sourcemap: false,
  },

  // Pre-bundle heavy deps for faster dev server cold start
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'recharts',
      'leaflet',
      'react-leaflet',
      'lucide-react',
    ],
  },

  // Performance: disable full-page reloads on CSS changes
  css: {
    devSourcemap: true,
  },
})

