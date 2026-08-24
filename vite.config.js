import { defineConfig } from 'vite' // Halos V2 Deployment
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  base: process.env.NETLIFY ? '/' : '/halos/',
  server: {
    host: true, // Expose to local network automatically
    port: 5178, // Bypassing Redly's cached port
  },
  plugins: [
    tailwindcss(),
    react(),
  ],
})
