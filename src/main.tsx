// src/main.tsx - 전체 수정본

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { CharacterProvider } from './context/CharacterContext'
import { simpleImagePreloader, CRITICAL_IMAGES, HIGH_PRIORITY_IMAGES } from './utils/simpleImagePreloader'

ReactDOM.createRoot(document.getElementById('root')!).render(
 <React.StrictMode>
   <BrowserRouter>
     <CharacterProvider>
         <App />
     </CharacterProvider>
   </BrowserRouter>
 </React.StrictMode>,
)

// 디버깅용 전역 함수 추가 (개발 환경에서만)
if (process.env.NODE_ENV === 'development') {
 (window as any).imageDebug = {
   // 현재 로딩 상태 확인
   status: () => {
     const criticalLoaded = CRITICAL_IMAGES.filter(src => simpleImagePreloader.isLoaded(src));
     const highPriorityLoaded = HIGH_PRIORITY_IMAGES.filter(src => simpleImagePreloader.isLoaded(src));
     
     console.group('🖼️ 이미지 로딩 상태');
     console.log(`Critical: ${criticalLoaded.length}/${CRITICAL_IMAGES.length} loaded`);
     console.log(`High Priority: ${highPriorityLoaded.length}/${HIGH_PRIORITY_IMAGES.length} loaded`);
     console.log('✅ Critical 로딩 완료:', criticalLoaded);
     console.log('⚡ High Priority 로딩 완료:', highPriorityLoaded);
     
     const notLoaded = CRITICAL_IMAGES.filter(src => !simpleImagePreloader.isLoaded(src));
     if (notLoaded.length > 0) {
       console.warn('❌ 로딩 실패/대기 중:', notLoaded);
     }
     console.groupEnd();
     
     return {
       critical: { loaded: criticalLoaded.length, total: CRITICAL_IMAGES.length },
       highPriority: { loaded: highPriorityLoaded.length, total: HIGH_PRIORITY_IMAGES.length }
     };
   },
   
   // 수동 이미지 프리로드
   preload: (images: string[]) => {
     console.log(`🚀 수동 프리로드 시작: ${images.length}개`);
     simpleImagePreloader.preloadImages(images);
     
     // 1초 후 결과 확인
     setTimeout(() => {
       const loaded = images.filter(src => simpleImagePreloader.isLoaded(src));
       console.log(`✅ 프리로드 완료: ${loaded.length}/${images.length}`);
     }, 1000);
   },
   
   // 캐시 클리어
   clear: () => {
     simpleImagePreloader.clearCache();
     console.log('🗑️ 이미지 캐시 클리어 완료');
   },
   
   // 특정 이미지 로딩 상태 확인
   check: (src: string) => {
     const isLoaded = simpleImagePreloader.isLoaded(src);
     const image = simpleImagePreloader.getImage(src);
     
     console.log(`🔍 이미지 체크: ${src}`);
     console.log(`  - 로딩됨: ${isLoaded}`);
     console.log(`  - 캐시됨: ${!!image}`);
     
     if (image) {
       console.log(`  - 크기: ${image.naturalWidth}x${image.naturalHeight}`);
     }
     
     return { loaded: isLoaded, cached: !!image, element: image };
   },
   
   // 성능 테스트
   test: async () => {
     console.log('⚡ 이미지 로딩 성능 테스트 시작...');
     
     const testImages = [
       '/assets/images/test1.png',
       '/assets/images/test2.png'
     ];
     
     const startTime = Date.now();
     
     try {
       await Promise.all(testImages.map(src => simpleImagePreloader.loadImage(src)));
       const endTime = Date.now();
       console.log(`✅ 테스트 완료: ${endTime - startTime}ms`);
     } catch (error) {
       console.error('❌ 테스트 실패:', error);
     }
   },
   
   // 도움말
   help: () => {
     console.log(`
🖼️ 이미지 디버깅 도구 사용법:

window.imageDebug.status()     - 현재 로딩 상태 확인
window.imageDebug.preload([])  - 이미지 수동 프리로드
window.imageDebug.clear()      - 캐시 클리어
window.imageDebug.check(url)   - 특정 이미지 상태 확인
window.imageDebug.test()       - 성능 테스트
window.imageDebug.help()       - 이 도움말

예시:
window.imageDebug.status()
window.imageDebug.preload(['/assets/images/test.png'])
window.imageDebug.check('/assets/images/background.png')
     `);
   }
 };
 
 // 초기 상태 자동 출력
 setTimeout(() => {
   console.log('🚀 이미지 프리로더 초기화 완료');
   console.log('💡 window.imageDebug.help() 입력으로 사용법 확인');
   (window as any).imageDebug.status();
 }, 2000);
 
 // 주기적 상태 모니터링 (30초마다)
 setInterval(() => {
   const critical = CRITICAL_IMAGES.filter(src => simpleImagePreloader.isLoaded(src));
   if (critical.length < CRITICAL_IMAGES.length) {
     console.warn(`⚠️ Critical 이미지 로딩 미완료: ${critical.length}/${CRITICAL_IMAGES.length}`);
   }
 }, 30000);
}