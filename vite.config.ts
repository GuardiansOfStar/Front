// vite.config.ts 수정
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          motion: ['framer-motion'],
          audio: ['howler'],
          utils: ['axios'],
          ui: ['react-confetti']
        }
      }
    },
    chunkSizeWarningLimit: 1000
  },
  
  // 이미지 최적화
  assetsInclude: ['**/*.png', '**/*.jpg', '**/*.jpeg', '**/*.gif', '**/*.svg'],
  
  server: {
    allowedHosts: ['.ngrok-free.app'],
  },
  
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'framer-motion']
  }
})