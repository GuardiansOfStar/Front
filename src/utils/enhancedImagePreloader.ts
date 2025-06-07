// src/utils/enhancedImagePreloader.ts - crossorigin 수정 버전
export const CRITICAL_IMAGES = [
  '/assets/images/background.png',
  '/assets/images/star_character.png',
  '/assets/images/title.png',
  '/assets/images/team_name.png',
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

export const PAGE_IMAGES = {
  prologue: [
    '/assets/images/scenario1_full_map.png',
    '/assets/images/grandchildren.png',
    '/assets/images/letter_envelope.png',
    '/assets/images/depart_button.png'
  ],
  quest1: [
    '/assets/images/pre_drive_background.png',
    '/assets/images/helmet_card.png',
    '/assets/images/straw_hat_card.png',
    '/assets/images/cap_hat_card.png',
    '/assets/images/card_back.png',
    '/assets/images/gift.png',
    '/assets/images/helmet.png',
    '/assets/images/gift_open.png'
  ],
  quest2: [
    '/assets/images/driving_road.png',
    '/assets/images/small_pothole.png',
    '/assets/images/grandfather_pothole_accident.png',
    '/assets/images/grandmother_pothole_accident.png',
    '/assets/images/mission2_success_grandfather.png',
    '/assets/images/mission2_success_grandmother.png'
  ],
  quest3: [
    '/assets/images/orchard_driving_road.png',
    '/assets/images/makgeolli_game_tray.png',
    '/assets/images/makgeolli.png',
    '/assets/images/kimchi.png',
    '/assets/images/noodles.png'
  ],
  quest4: [
    '/assets/images/work_complete_with_applebox.png',
    '/assets/images/apple_box.png',
    '/assets/images/success_circle.png'
  ],
  quest5: [
    '/assets/images/homecoming_time_setting_tree_road.png',
    '/assets/images/homecoming_time_clocks.png',
    '/assets/images/drag_button.png'
  ]
};

interface LoadingStats {
  total: number;
  loaded: number;
  failed: number;
  cached: number;
}

class EnhancedImagePreloader {
  private cache = new Map<string, HTMLImageElement>();
  private loadPromises = new Map<string, Promise<HTMLImageElement>>();
  private priorityQueue: { src: string; priority: number }[] = [];
  private isProcessing = false;
  private maxConcurrent = 3; // 수정: 4 → 3 (안정성 향상)
  private activeLoads = new Set<string>();
  private stats: LoadingStats = { total: 0, loaded: 0, failed: 0, cached: 0 };
  
  constructor() {
    this.initializeCriticalImages();
  }

  private async initializeCriticalImages() {
    console.log('[ImagePreloader] Critical 이미지 로딩 시작');
    
    CRITICAL_IMAGES.forEach(src => {
      this.addToPriorityQueue(src, 10);
    });
    
    HIGH_PRIORITY_IMAGES.forEach(src => {
      this.addToPriorityQueue(src, 8);
    });
    
    this.processQueue();
  }

  private addToPriorityQueue(src: string, priority: number) {
    if (!this.cache.has(src) && !this.loadPromises.has(src)) {
      this.priorityQueue.push({ src, priority });
      this.priorityQueue.sort((a, b) => b.priority - a.priority);
    }
  }

  private async processQueue() {
    if (this.isProcessing) return;
    this.isProcessing = true;

    while (this.priorityQueue.length > 0 && this.activeLoads.size < this.maxConcurrent) {
      const item = this.priorityQueue.shift();
      if (!item) break;

      this.activeLoads.add(item.src);
      this.loadImageWithOptimization(item.src)
        .then(() => {
          this.activeLoads.delete(item.src);
          this.stats.loaded++;
          this.processQueue();
        })
        .catch(() => {
          this.activeLoads.delete(item.src);
          this.stats.failed++;
          this.processQueue();
        });
    }

    if (this.priorityQueue.length === 0 && this.activeLoads.size === 0) {
      this.isProcessing = false;
      console.log('[ImagePreloader] 모든 이미지 로딩 완료:', this.stats);
    }
  }

  private async loadImageWithOptimization(src: string): Promise<HTMLImageElement> {
    if (this.cache.has(src)) {
      this.stats.cached++;
      return this.cache.get(src)!;
    }

    if (this.loadPromises.has(src)) {
      return this.loadPromises.get(src)!;
    }

    const promise = new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      
      // 수정: crossorigin 설정 추가
      img.crossOrigin = 'anonymous';
      img.loading = 'eager';
      img.decoding = 'async';
      
      // 수정: 타임아웃 시간 단축 (15초 → 10초)
      const timeoutId = setTimeout(() => {
        console.warn(`[ImagePreloader] 타임아웃: ${src}`);
        reject(new Error(`Image load timeout: ${src}`));
      }, 10000);

      img.onload = () => {
        clearTimeout(timeoutId);
        this.cache.set(src, img);
        console.log(`[ImagePreloader] 로딩 완료: ${src}`);
        resolve(img);
      };

      img.onerror = (error) => {
        clearTimeout(timeoutId);
        console.error(`[ImagePreloader] 로딩 실패: ${src}`, error);
        reject(error);
      };

      img.src = src;
    });

    this.loadPromises.set(src, promise);
    this.stats.total++;
    return promise;
  }

  preloadPageImages(pageKey: keyof typeof PAGE_IMAGES) {
    if (!PAGE_IMAGES[pageKey]) return;
    
    console.log(`[ImagePreloader] 페이지 이미지 로딩: ${pageKey}`);
    PAGE_IMAGES[pageKey].forEach(src => {
      this.addToPriorityQueue(src, 5);
    });
    
    this.processQueue();
  }

  async preloadImage(src: string): Promise<HTMLImageElement> {
    return this.loadImageWithOptimization(src);
  }

  isLoaded(src: string): boolean {
    return this.cache.has(src);
  }

  getStats(): LoadingStats {
    return { ...this.stats };
  }

  clearCache() {
    console.log('[ImagePreloader] 캐시 클리어');
    this.cache.clear();
    this.loadPromises.clear();
    this.stats = { total: 0, loaded: 0, failed: 0, cached: 0 };
  }

  evictFromCache(srcs: string[]) {
    srcs.forEach(src => {
      this.cache.delete(src);
      this.loadPromises.delete(src);
    });
  }
}

export const enhancedImagePreloader = new EnhancedImagePreloader();