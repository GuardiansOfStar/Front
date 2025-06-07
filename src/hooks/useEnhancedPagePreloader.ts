// src/hooks/useEnhancedPagePreloader.ts
import { useEffect } from 'react';
import { enhancedImagePreloader, PAGE_IMAGES } from '../utils/enhancedImagePreloader';

export const useEnhancedPagePreloader = (pageKey: keyof typeof PAGE_IMAGES) => {
  useEffect(() => {
    // 현재 페이지 진입 시 다음 페이지 이미지 백그라운드 로딩
    enhancedImagePreloader.preloadPageImages(pageKey);
  }, [pageKey]);
};