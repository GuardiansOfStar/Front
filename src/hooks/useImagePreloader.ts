import { useState, useEffect } from 'react';
import { imagePreloader } from '../utils/imagePreloader';

export const useImagePreloader = (images: string[]) => {
  const [isLoading, setIsLoading] = useState(true);
  const [loadedCount, setLoadedCount] = useState(0);

  useEffect(() => {
    const loadImages = async () => {
      setIsLoading(true);
      let loaded = 0;

      for (const image of images) {
        try {
          await imagePreloader.preloadImage(image);
          loaded++;
          setLoadedCount(loaded);
        } catch (error) {
          console.warn(`이미지 로딩 실패: ${image}`);
          loaded++;
          setLoadedCount(loaded);
        }
      }

      setIsLoading(false);
    };

    loadImages();
  }, [images]);

  return {
    isLoading,
    loadedCount,
    progress: (loadedCount / images.length) * 100
  };
};