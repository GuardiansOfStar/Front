// src/components/ui/EnhancedOptimizedImage.tsx - 수정된 버전
import { useState, useEffect, useRef, useCallback } from 'react';
import { enhancedImagePreloader } from '../../utils/enhancedImagePreloader';

interface EnhancedOptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
  fallback?: string;
  priority?: 'critical' | 'high' | 'normal' | 'low';
  skeleton?: boolean;
  onLoad?: () => void;
  onError?: (error: Error) => void;
  onClick?: () => void; // 추가: onClick 속성
}

const EnhancedOptimizedImage = ({ 
  src, 
  alt, 
  className = '', 
  style, 
  fallback,
  priority = 'normal',
  skeleton = true,
  onLoad,
  onError,
  onClick // 추가: onClick 속성
}: EnhancedOptimizedImageProps) => {
  const [loadState, setLoadState] = useState<'loading' | 'loaded' | 'error'>('loading');
  const [imageSrc, setImageSrc] = useState<string>('');
  const imgRef = useRef<HTMLImageElement>(null);
  const intersectionRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority === 'critical' || priority === 'high') {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { 
        rootMargin: '50px',
        threshold: 0.1 
      }
    );

    if (intersectionRef.current) {
      observer.observe(intersectionRef.current);
    }

    return () => observer.disconnect();
  }, [priority]);

  // 이미지 로딩 처리
  useEffect(() => {
    if (!isInView) return;

    let isCancelled = false;

    const loadImage = async () => {
      try {
        if (enhancedImagePreloader.isLoaded(src)) {
          if (!isCancelled) {
            setImageSrc(src);
            setLoadState('loaded');
            onLoad?.();
          }
          return;
        }

        await enhancedImagePreloader.preloadImage(src);
        
        if (!isCancelled) {
          setImageSrc(src);
          setLoadState('loaded');
          onLoad?.();
        }
      } catch (error) {
        if (!isCancelled) {
          console.warn(`이미지 로딩 실패: ${src}`, error);
          
          if (fallback) {
            setImageSrc(fallback);
            setLoadState('loaded');
          } else {
            setLoadState('error');
            onError?.(error as Error);
          }
        }
      }
    };

    loadImage();

    return () => {
      isCancelled = true;
    };
  }, [isInView, src, fallback, onLoad, onError]);

  const SkeletonPlaceholder = useCallback(() => (
    <div 
      className={`animate-pulse bg-gray-200 ${className}`}
      style={style}
      aria-label="이미지 로딩 중..."
      onClick={onClick} // 추가: 스켈레톤에도 onClick 적용
    >
      <div className="w-full h-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-shimmer" />
    </div>
  ), [className, style, onClick]);

  const ErrorPlaceholder = useCallback(() => (
    <div 
      className={`flex items-center justify-center bg-gray-100 text-gray-400 ${className}`}
      style={style}
      aria-label="이미지 로딩 실패"
      onClick={onClick} // 추가: 에러 플레이스홀더에도 onClick 적용
    >
      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
      </svg>
    </div>
  ), [className, style, onClick]);

  const commonProps = {
    className: `transition-all duration-300 ${className}`,
    style,
    'data-src': src,
    'data-priority': priority
  };

  if (!isInView) {
    return (
      <div ref={intersectionRef} {...commonProps} onClick={onClick}>
        {skeleton && <SkeletonPlaceholder />}
      </div>
    );
  }

  if (loadState === 'error' && !fallback) {
    return <ErrorPlaceholder />;
  }

  if (loadState === 'loading') {
    return skeleton ? <SkeletonPlaceholder /> : null;
  }

  return (
    <img
      ref={imgRef}
      src={imageSrc}
      alt={alt}
      {...commonProps}
      className={`${commonProps.className} ${loadState === 'loaded' ? 'opacity-100' : 'opacity-0'}`}
      draggable={false}
      onClick={onClick} // 추가: img 태그에 onClick 적용
      onLoad={() => {
        setLoadState('loaded');
        onLoad?.();
      }}
      onError={(e) => {
        console.error(`IMG 태그 로딩 실패: ${src}`, e);
        if (fallback) {
          setImageSrc(fallback);
        } else {
          setLoadState('error');
          onError?.(new Error(`Image load failed: ${src}`));
        }
      }}
    />
  );
};

export default EnhancedOptimizedImage;