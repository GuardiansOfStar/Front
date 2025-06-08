// src/utils/simpleImagePreloader.ts - 기존 API 호환 + WebP 지원
export const CRITICAL_IMAGES = [
  '/assets/images/background.png',
  '/assets/images/star_character.png',
  '/assets/images/title.png',
  '/assets/images/start_button.png'
];

export const HIGH_PRIORITY_IMAGES = [
  '/assets/images/scenario1.png',
  '/assets/images/game_character_grandfather.png',
  '/assets/images/game_character_grandmother.png',
  '/assets/images/home_button.png',
  '/assets/images/back_button.png',
  '/assets/images/next_button.png',
  '/assets/images/confirm_button.png',
  '/assets/images/motorcycle.png',
  '/assets/images/success_circle.png',
  '/assets/images/danger_warning.png'
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
  private webpSupport: boolean | null = null;

  constructor() {
    this.detectWebPSupport();
    this.preloadCriticalImages();
  }

  private detectWebPSupport(): boolean {
    if (this.webpSupport !== null) return this.webpSupport;
    
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    this.webpSupport = canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    console.log(`[SimpleImagePreloader] WebP 지원: ${this.webpSupport}`);
    return this.webpSupport;
  }

  private getOptimizedSrc(originalSrc: string): string {
    if (!this.detectWebPSupport()) return originalSrc;
    
    // .png를 .webp로 변경
    return originalSrc.replace(/\.png$/i, '.webp');
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
      
      img.loading = 'eager';
      img.decoding = 'sync';
      
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
        
        // WebP 실패시 원본 PNG로 fallback
        if (src.includes('.webp')) {
          console.warn(`[SimpleImagePreloader] WebP 실패, PNG로 fallback: ${src}`);
          const pngSrc = src.replace(/\.webp$/i, '.png');
          
          // 원본 PNG로 재시도
          const fallbackImg = new Image();
          fallbackImg.loading = 'eager';
          fallbackImg.decoding = 'sync';
          
          fallbackImg.onload = () => {
            this.cache[pngSrc] = { element: fallbackImg, loaded: true, error: false };
            console.log(`[SimpleImagePreloader] PNG fallback 성공: ${pngSrc}`);
            resolve(fallbackImg);
          };
          
          fallbackImg.onerror = (fallbackError) => {
            this.cache[src] = { element: img, loaded: false, error: true };
            console.error(`[SimpleImagePreloader] PNG fallback도 실패: ${pngSrc}`, fallbackError);
            reject(fallbackError);
          };
          
          fallbackImg.src = pngSrc;
          return;
        }
        
        this.cache[src] = { element: img, loaded: false, error: true };
        console.error(`[SimpleImagePreloader] 로딩 실패: ${src}`, error);
        reject(error);
      };

      // WebP 우선, fallback은 PNG
      const optimizedSrc = this.getOptimizedSrc(src);
      img.src = optimizedSrc;
    });

    this.loadPromises.set(src, promise);
    return promise;
  }

  // 🔥 기존 API 호환: preloadImages 메서드 추가
  async preloadImages(srcs: string[]): Promise<void> {
    console.log(`[SimpleImagePreloader] 이미지 배치 로딩 시작: ${srcs.length}개`);
    
    const promises = srcs.map(src => this.loadImage(src));
    
    try {
      await Promise.allSettled(promises);
      console.log(`[SimpleImagePreloader] 배치 로딩 완료: ${srcs.length}개`);
    } catch (error) {
      console.warn('[SimpleImagePreloader] 일부 이미지 배치 로딩 실패:', error);
    }
  }

  isLoaded(src: string): boolean {
    // WebP 버전도 확인
    const webpSrc = this.getOptimizedSrc(src);
    return this.cache[src]?.loaded || this.cache[webpSrc]?.loaded || false;
  }

  getImage(src: string): HTMLImageElement | null {
    // WebP 버전 우선 반환
    const webpSrc = this.getOptimizedSrc(src);
    return this.cache[webpSrc]?.element || this.cache[src]?.element || null;
  }

  clearCache() {
    this.cache = {};
    this.loadPromises.clear();
  }

  // 🔥 추가: WebP 지원 여부 확인 메서드
  supportsWebP(): boolean {
    return this.detectWebPSupport();
  }

  // 🔥 추가: 로딩 상태 확인 메서드
  getLoadingStats(): { total: number; loaded: number; failed: number } {
    const entries = Object.values(this.cache);
    return {
      total: entries.length,
      loaded: entries.filter(entry => entry.loaded).length,
      failed: entries.filter(entry => entry.error).length
    };
  }
}

export const simpleImagePreloader = new SimpleImagePreloader();