import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true, // or '0.0.0.0' or your local IP
    port: 5173, // default port
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-redux': ['@reduxjs/toolkit', 'react-redux', 'zustand'],
          'vendor-appwrite': ['appwrite'],
          'vendor-motion': ['motion', 'framer-motion'],
          'vendor-image': ['heic2any', 'browser-image-compression'],
          'vendor-ui': ['@material-tailwind/react', 'lucide-react', 'react-loading-indicators'],
        },
      },
    },
  },
})
