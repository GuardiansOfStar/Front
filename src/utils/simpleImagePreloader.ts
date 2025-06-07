// src/utils/simpleImagePreloader.ts - 근본적 재설계
export const CRITICAL_IMAGES = [
  '/assets/images/background.png',
  '/assets/images/star_character.png',
  '/assets/images/title.png',
  '/assets/images/start_button.png'
];

interface ImageCache {
  [key: string]: {
    element: HTMLImageElement;
    loaded: boolean;
    error: boolean;
  };
}

class SimpleImagePreloader {
  private cache: ImageCache = {};
  private loadPromises: Map<string, Promise<HTMLImageElement>> = new Map();

  constructor() {
    this.preloadCriticalImages();
  }

  private async preloadCriticalImages() {
    console.log('[SimpleImagePreloader] Critical 이미지 즉시 로딩 시작');
    
    const promises = CRITICAL_IMAGES.map(src => this.loadImage(src));
    
    try {
      await Promise.allSettled(promises);
      console.log('[SimpleImagePreloader] Critical 이미지 로딩 완료');
    } catch (error) {
      console.warn('[SimpleImagePreloader] 일부 critical 이미지 로딩 실패:', error);
    }
  }

  async loadImage(src: string): Promise<HTMLImageElement> {
    // 캐시에서 이미 로드된 이미지 반환
    if (this.cache[src]?.loaded) {
      return this.cache[src].element;
    }

    // 진행 중인 로딩이 있으면 대기
    if (this.loadPromises.has(src)) {
      return this.loadPromises.get(src)!;
    }

    const promise = new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      
      // 중요: crossOrigin 설정 제거 (CORS 문제 방지)
      img.loading = 'eager';
      img.decoding = 'sync'; // 중요: 동기 디코딩으로 변경
      
      const timeoutId = setTimeout(() => {
        console.warn(`[SimpleImagePreloader] 타임아웃: ${src}`);
        this.cache[src] = { element: img, loaded: false, error: true };
        reject(new Error(`Image load timeout: ${src}`));
      }, 8000);

      img.onload = () => {
        clearTimeout(timeoutId);
        this.cache[src] = { element: img, loaded: true, error: false };
        console.log(`[SimpleImagePreloader] 로딩 성공: ${src}`);
        resolve(img);
      };

      img.onerror = (error) => {
        clearTimeout(timeoutId);
        this.cache[src] = { element: img, loaded: false, error: true };
        console.error(`[SimpleImagePreloader] 로딩 실패: ${src}`, error);
        reject(error);
      };

      // 중요: src 설정을 마지막에
      img.src = src;
    });

    this.loadPromises.set(src, promise);
    return promise;
  }

  isLoaded(src: string): boolean {
    return this.cache[src]?.loaded || false;
  }

  getImage(src: string): HTMLImageElement | null {
    return this.cache[src]?.element || null;
  }

  clearCache() {
    this.cache = {};
    this.loadPromises.clear();
  }
}

export const simpleImagePreloader = new SimpleImagePreloader();