// src/components/ui/ReliableImage.tsx - 기존 파일 개선
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
  priority?: 'critical' | 'high' | 'normal';
}

const ReliableImage = ({ 
  src, 
  alt, 
  className = '', 
  style, 
  onClick,
  onLoad,
  onError,
  priority = 'normal'
}: ReliableImageProps) => {
  const [loadState, setLoadState] = useState<'loading' | 'loaded' | 'error'>('loading');
  const [imageSrc, setImageSrc] = useState<string>('');
  const imgRef = useRef<HTMLImageElement>(null);
  const isCritical = CRITICAL_IMAGES.includes(src) || priority === 'critical';

  useEffect(() => {
    let isCancelled = false;

    const loadImage = async () => {
      try {
        // Critical 이미지는 즉시 확인
        if (isCritical && simpleImagePreloader.isLoaded(src)) {
          if (!isCancelled) {
            setImageSrc(src);
            setLoadState('loaded');
            onLoad?.();
          }
          return;
        }

        // 이미지 로딩
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

  // 로딩 중 스켈레톤
  if (loadState === 'loading') {
    return (
      <div 
        className={`bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-shimmer flex items-center justify-center ${className}`}
        style={style}
        onClick={onClick}
        aria-label={`${alt} 로딩 중`}
      >
        <div className="w-6 h-6 rounded-full bg-gray-400 animate-pulse" />
      </div>
    );
  }

  // 에러 상태
  if (loadState === 'error') {
    return (
      <div 
        className={`bg-red-50 border border-red-200 flex items-center justify-center text-red-500 ${className}`}
        style={style}
        onClick={onClick}
        aria-label={`${alt} 로딩 실패`}
      >
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
        </svg>
      </div>
    );
  }

  // 정상 이미지
  return (
    <img
      ref={imgRef}
      src={imageSrc}
      alt={alt}
      className={`transition-opacity duration-300 opacity-100 ${className}`}
      style={style}
      draggable={false}
      onClick={onClick}
      loading={isCritical ? 'eager' : 'lazy'}
      decoding={isCritical ? 'sync' : 'async'}
    />
  );
};

export default ReliableImage;