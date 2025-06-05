class ImagePreloader {
  private cache = new Map<string, HTMLImageElement>();
  private loadPromises = new Map<string, Promise<HTMLImageElement>>();

  async preloadImage(src: string): Promise<HTMLImageElement> {
    if (this.cache.has(src)) {
      return this.cache.get(src)!;
    }

    if (this.loadPromises.has(src)) {
      return this.loadPromises.get(src)!;
    }

    const promise = new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
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

  async preloadImages(srcs: string[]): Promise<HTMLImageElement[]> {
    return Promise.all(srcs.map(src => this.preloadImage(src)));
  }

  isLoaded(src: string): boolean {
    return this.cache.has(src);
  }
}

export const imagePreloader = new ImagePreloader();

// 핵심 이미지 목록
export const CRITICAL_IMAGES = [
  '/assets/images/background.png',
  '/assets/images/star_character.png',
  '/assets/images/title.png',
  '/assets/images/team_name.png',
  '/assets/images/start_button.png',
  '/assets/images/scenario1.png',
  '/assets/images/game_character_grandfather.png',
  '/assets/images/game_character_grandmother.png'
];

// 퀘스트별 이미지 맵
export const QUEST_IMAGES = {
  quest1: [
    '/assets/images/pre_drive_background.png',
    '/assets/images/helmet_card.png',
    '/assets/images/straw_hat_card.png',
    '/assets/images/cap_hat_card.png',
    '/assets/images/card_back.png',
    '/assets/images/gift.png',
    '/assets/images/helmet.png'
  ],
  quest2: [
    '/assets/images/driving_road.png',
    '/assets/images/motorcycle.png',
    '/assets/images/small_pothole.png',
    '/assets/images/success_circle.png'
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