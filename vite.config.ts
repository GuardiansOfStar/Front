import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/', // 베이스 URL 경로 설정
  resolve: {
    alias: {
      assets: path.resolve(__dirname, 'src/assets'), // ← 이 줄이 핵심!
    },
  },
  build: {
    outDir: 'dist', // 출력 디렉토리 명시적 지정
    emptyOutDir: true, // 기존 출력 디렉토리 비우기
    sourcemap: false, // 프로덕션에서는 소스맵 생성 비활성화
  },
})