// src/components/ui/OptimizedImage.tsx (새 파일)
import { useState, useEffect } from 'react';
import { imagePreloader } from '../../utils/imagePreloader';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
  fallback?: string;
}

const OptimizedImage = ({ src, alt, className, style, fallback }: OptimizedImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    imagePreloader.preloadImage(src)
      .then(() => setIsLoaded(true))
      .catch(() => setError(true));
  }, [src]);

  if (error && fallback) {
    return (
      <img 
        src={fallback} 
        alt={alt} 
        className={className} 
        style={style}
      />
    );
  }

  return (
    <img 
      src={src} 
      alt={alt} 
      className={`${className} ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
      style={style}
      onLoad={() => setIsLoaded(true)}
      onError={() => setError(true)}
    />
  );
};

export default OptimizedImage;