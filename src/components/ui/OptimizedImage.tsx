// src/components/ui/OptimizedImage.tsx
import { useState, useEffect } from 'react';
import { simpleImagePreloader } from '../../utils/simpleImagePreloader';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
  priority?: boolean;
  onClick?: () => void;
  onLoad?: () => void;
  onError?: (error: Error) => void;
}

const OptimizedImage = ({ 
  src, 
  alt, 
  className = '', 
  style, 
  priority = false,
  onClick,
  onLoad,
  onError
}: OptimizedImageProps) => {
  const [loadState, setLoadState] = useState<'loading' | 'loaded' | 'error'>('loading');
  const [imageSrc, setImageSrc] = useState<string>('');

  // WebP 지원 감지
  const supportsWebP = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
  };

  // 이미지 소스 결정
  const getOptimizedSrc = (originalSrc: string) => {
    const basePath = originalSrc.replace(/\.[^/.]+$/, '');
    
    if (supportsWebP()) {
      return `${basePath}.webp`;
    }
    return originalSrc;
  };

  useEffect(() => {
    let isCancelled = false;
    
    const loadImage = async () => {
      try {
        const optimizedSrc = getOptimizedSrc(src);
        
        if (priority) {
          // Critical 이미지는 즉시 로드
          await simpleImagePreloader.loadImage(optimizedSrc);
        } else {
          // 일반 이미지는 Intersection Observer 활용
          const observer = new IntersectionObserver(
            async (entries) => {
              if (entries[0].isIntersecting) {
                observer.disconnect();
                try {
                  await simpleImagePreloader.loadImage(optimizedSrc);
                } catch (error) {
                  // WebP 실패시 원본으로 fallback
                  await simpleImagePreloader.loadImage(src);
                }
              }
            },
            { rootMargin: '50px' }
          );
          
          // 임시 요소 생성하여 observe
          const placeholder = document.createElement('div');
          observer.observe(placeholder);
          return;
        }
        
        if (!isCancelled) {
          setImageSrc(optimizedSrc);
          setLoadState('loaded');
          onLoad?.();
        }
      } catch (error) {
        if (!isCancelled) {
          console.warn(`WebP 로딩 실패, 원본으로 fallback: ${src}`);
          try {
            await simpleImagePreloader.loadImage(src);
            setImageSrc(src);
            setLoadState('loaded');
            onLoad?.();
          } catch (fallbackError) {
            setLoadState('error');
            onError?.(fallbackError as Error);
          }
        }
      }
    };

    loadImage();

    return () => {
      isCancelled = true;
    };
  }, [src, priority, onLoad, onError]);

  if (loadState === 'loading') {
    return (
      <div 
        className={`image-skeleton ${className}`}
        style={style}
        onClick={onClick}
      >
        <div className="w-full h-full flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (loadState === 'error') {
    return (
      <div 
        className={`bg-red-100 border border-red-300 flex items-center justify-center ${className}`}
        style={style}
        onClick={onClick}
      >
        <span className="text-red-500 text-xs">로딩 실패</span>
      </div>
    );
  }

  return (
    <img
      src={imageSrc}
      alt={alt}
      className={`transition-opacity duration-300 ${className}`}
      style={style}
      onClick={onClick}
      loading={priority ? 'eager' : 'lazy'}
      decoding={priority ? 'sync' : 'async'}
      fetchPriority={priority ? 'high' : 'low'} // ✅ fetchPriority (camelCase)
      draggable={false}
      onLoad={() => {
        setLoadState('loaded');
        onLoad?.();
      }}
      onError={(e) => {
        console.error(`IMG 태그 로딩 실패: ${src}`, e);
        setLoadState('error');
        onError?.(new Error(`Image load failed: ${src}`));
      }}
    />
  );
};

export default OptimizedImage;