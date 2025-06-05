// src/hooks/usePagePreloader.ts (새 파일)
import { useEffect } from 'react';
import { imagePreloader, PAGE_IMAGES } from '../utils/imagePreloader';

export const usePagePreloader = (pageKey: keyof typeof PAGE_IMAGES) => {
  useEffect(() => {
    // 현재 페이지 진입 시 다음 페이지 이미지 백그라운드 로딩
    imagePreloader.preloadPageImages(pageKey);
  }, [pageKey]);
};