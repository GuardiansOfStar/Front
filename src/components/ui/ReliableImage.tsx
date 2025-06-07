// src/components/ui/ReliableImage.tsx - 단순하고 확실한 이미지 컴포넌트
import { useState, useEffect, useRef } from 'react';
import { simpleImagePreloader, CRITICAL_IMAGES } from '../../utils/simpleImagePreloader';

interface ReliableImageProps {
  src: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
  onLoad?: () => void;
  onError?: (error: Error) => void;
}

const ReliableImage = ({ 
  src, 
  alt, 
  className = '', 
  style, 
  onClick,
  onLoad,
  onError
}: ReliableImageProps) => {
  const [loadState, setLoadState] = useState<'loading' | 'loaded' | 'error'>('loading');
  const [imageSrc, setImageSrc] = useState<string>('');
  const imgRef = useRef<HTMLImageElement>(null);
  const isCritical = CRITICAL_IMAGES.includes(src);

  useEffect(() => {
    let isCancelled = false;

    const loadImage = async () => {
      try {
        // Critical 이미지는 즉시 확인, 일반 이미지는 preloader 사용
        if (isCritical && simpleImagePreloader.isLoaded(src)) {
          if (!isCancelled) {
            setImageSrc(src);
            setLoadState('loaded');
            onLoad?.();
          }
          return;
        }

        // 이미지 로딩 시도
        await simpleImagePreloader.loadImage(src);
        
        if (!isCancelled) {
          setImageSrc(src);
          setLoadState('loaded');
          onLoad?.();
        }
      } catch (error) {
        if (!isCancelled) {
          console.warn(`이미지 로딩 실패: ${src}`, error);
          setLoadState('error');
          onError?.(error as Error);
        }
      }
    };

    loadImage();

    return () => {
      isCancelled = true;
    };
  }, [src, onLoad, onError, isCritical]);

  // 로딩 중일 때 placeholder
  if (loadState === 'loading') {
    return (
      <div 
        className={`bg-gray-200 animate-pulse flex items-center justify-center ${className}`}
        style={style}
        onClick={onClick}
        aria-label={`${alt} 로딩 중`}
      >
        <div className="w-8 h-8 rounded-full bg-gray-300" />
      </div>
    );
  }

  // 에러 상태일 때 fallback
  if (loadState === 'error') {
    return (
      <div 
        className={`bg-red-100 border-2 border-red-300 flex items-center justify-center text-red-600 ${className}`}
        style={style}
        onClick={onClick}
        aria-label={`${alt} 로딩 실패`}
      >
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
        </svg>
      </div>
    );
  }

  // 정상 로딩된 이미지
  return (
    <img
      ref={imgRef}
      src={imageSrc}
      alt={alt}
      className={`transition-opacity duration-300 ${className}`}
      style={style}
      draggable={false}
      onClick={onClick}
      loading={isCritical ? 'eager' : 'lazy'}
      decoding={isCritical ? 'sync' : 'async'}
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

export default ReliableImage;