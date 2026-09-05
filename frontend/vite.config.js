import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        // target: 'http://localhost:8000',
        target: 'https://tubemind-yt-chatbot.onrender.com',
        changeOrigin: true,
      }
    }
  }
})
