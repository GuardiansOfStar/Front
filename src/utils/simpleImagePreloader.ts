// src/utils/simpleImagePreloader.ts - 기존 파일 완전 교체
export const CRITICAL_IMAGES = [
  '/assets/images/background.png',
  '/assets/images/star_character.png',
  '/assets/images/title.png',
  '/assets/images/start_button.png'
];

export const HIGH_PRIORITY_IMAGES = [
  '/assets/images/home_button.png',
  '/assets/images/back_button.png',
  '/assets/images/next_button.png',
  '/assets/images/confirm_button.png',
  '/assets/images/scenario1.png',
  '/assets/images/scenario2.png',
  '/assets/images/scenario3.png',
  '/assets/images/game_character_grandfather.png',
  '/assets/images/game_character_grandmother.png'
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
  private loadQueue: string[] = [];
  private isProcessing = false;

  constructor() {
    this.preloadCriticalImages();
    setTimeout(() => this.preloadHighPriorityImages(), 1000);
  }

  private async preloadCriticalImages() {
    console.log('[Preloader] Critical 이미지 로딩 시작');
    const promises = CRITICAL_IMAGES.map(src => this.loadImage(src));
    await Promise.allSettled(promises);
    console.log('[Preloader] Critical 이미지 로딩 완료');
  }

  private async preloadHighPriorityImages() {
    console.log('[Preloader] High priority 이미지 백그라운드 로딩');
    this.loadQueue.push(...HIGH_PRIORITY_IMAGES);
    this.processQueue();
  }

  private async processQueue() {
    if (this.isProcessing || this.loadQueue.length === 0) return;
    
    this.isProcessing = true;
    while (this.loadQueue.length > 0) {
      const src = this.loadQueue.shift()!;
      try {
        await this.loadImage(src);
        await new Promise(resolve => setTimeout(resolve, 100)); // 100ms 간격
      } catch (error) {
        console.warn(`[Preloader] 백그라운드 로딩 실패: ${src}`);
      }
    }
    this.isProcessing = false;
  }

  async loadImage(src: string): Promise<HTMLImageElement> {
    if (this.cache[src]?.loaded) {
      return this.cache[src].element;
    }

    if (this.loadPromises.has(src)) {
      return this.loadPromises.get(src)!;
    }

    const promise = new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.loading = 'eager';
      img.decoding = 'sync';
      
      const timeoutId = setTimeout(() => {
        reject(new Error(`Timeout: ${src}`));
      }, 10000);

      img.onload = () => {
        clearTimeout(timeoutId);
        this.cache[src] = { element: img, loaded: true, error: false };
        console.log(`[Preloader] 로딩 성공: ${src}`);
        resolve(img);
      };

      img.onerror = (error) => {
        clearTimeout(timeoutId);
        this.cache[src] = { element: img, loaded: false, error: true };
        reject(error);
      };

      img.src = src;
    });

    this.loadPromises.set(src, promise);
    return promise;
  }

  // 페이지별 이미지 프리로드
  preloadImages(imageSrcs: string[]) {
    console.log(`[Preloader] 수동 프리로드: ${imageSrcs.length}개`);
    imageSrcs.forEach(src => {
      if (!this.cache[src] && !this.loadQueue.includes(src)) {
        this.loadQueue.push(src);
      }
    });
    this.processQueue();
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