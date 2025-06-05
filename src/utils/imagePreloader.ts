// src/utils/imagePreloader.ts 수정
export const CRITICAL_IMAGES = [
  '/assets/images/background.png',
  '/assets/images/star_character.png',
  '/assets/images/title.png',
  '/assets/images/team_name.png',
  '/assets/images/start_button.png',
  '/assets/images/scenario1.png',
  '/assets/images/game_character_grandfather.png',
  '/assets/images/game_character_grandmother.png',
  // 추가: 자주 사용되는 이미지들
  '/assets/images/home_button.png',
  '/assets/images/back_button.png',
  '/assets/images/next_button.png',
  '/assets/images/confirm_button.png',
  '/assets/images/motorcycle.png',
  '/assets/images/success_circle.png',
  '/assets/images/danger_warning.png'
];

// 페이지별 이미지 그룹 정의
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

class ImagePreloader {
  private cache = new Map<string, HTMLImageElement>();
  private loadPromises = new Map<string, Promise<HTMLImageElement>>();
  private preloadQueue: string[] = [];
  private isPreloading = false;

  async preloadImage(src: string): Promise<HTMLImageElement> {
    if (this.cache.has(src)) {
      return this.cache.get(src)!;
    }

    if (this.loadPromises.has(src)) {
      return this.loadPromises.get(src)!;
    }

    const promise = new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      
      // 우선순위 높은 이미지는 즉시 로딩
      img.loading = 'eager';
      img.decoding = 'sync';
      
      img.onload = () => {
        this.cache.set(src, img);
        resolve(img);
      };
      img.onerror = reject;
      img.src = src;
    });

    this.loadPromises.set(src, promise);
    return promise;
  }

  // 백그라운드에서 다음 페이지 이미지 프리로드
  async preloadPageImages(pageKey: keyof typeof PAGE_IMAGES) {
    if (!PAGE_IMAGES[pageKey]) return;
    
    const images = PAGE_IMAGES[pageKey];
    this.preloadQueue.push(...images);
    
    if (!this.isPreloading) {
      this.processPreloadQueue();
    }
  }

  private async processPreloadQueue() {
    this.isPreloading = true;
    
    while (this.preloadQueue.length > 0) {
      const imageSrc = this.preloadQueue.shift()!;
      try {
        await this.preloadImage(imageSrc);
      } catch (error) {
        console.warn(`이미지 프리로드 실패: ${imageSrc}`);
      }
    }
    
    this.isPreloading = false;
  }

  preloadImages(srcs: string[]): Promise<HTMLImageElement[]> {
    return Promise.all(srcs.map(src => this.preloadImage(src)));
  }

  isLoaded(src: string): boolean {
    return this.cache.has(src);
  }
}

export const imagePreloader = new ImagePreloader();