import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// ngrok 호스트를 명시하거나 와일드카드로 전체 허용 가능
const allowedHosts = ['.ngrok-free.app'] 

export default defineConfig({
  plugins: [react()],
  base: '/', 
  resolve: {
    alias: {
      assets: path.resolve(__dirname, 'src/assets'),
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: false,
  },
  server: {
    allowedHosts,
  },
})
