import { useState, useEffect } from 'react';
import { useScale } from '../../hooks/useScale';

interface LoadingScreenProps {
  onLoadComplete: () => void;
  images: string[];
  minLoadTime?: number;
}

const LoadingScreen = ({ onLoadComplete, images, minLoadTime = 2000 }: LoadingScreenProps) => {
  const [loadedCount, setLoadedCount] = useState(0);
  const [showScreen, setShowScreen] = useState(true);
  const scale = useScale();
  
  const progress = (loadedCount / images.length) * 100;

  useEffect(() => {
    const startTime = Date.now();
    
    const loadImages = async () => {
      let loaded = 0;
      
      for (const imageSrc of images) {
        try {
          await new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
              loaded++;
              setLoadedCount(loaded);
              resolve(img);
            };
            img.onerror = reject;
            img.src = imageSrc;
          });
        } catch (error) {
          console.warn(`이미지 로딩 실패: ${imageSrc}`);
          loaded++;
          setLoadedCount(loaded);
        }
      }
      
      // 최소 로딩 시간 보장
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, minLoadTime - elapsed);
      
      setTimeout(() => {
        setShowScreen(false);
        setTimeout(onLoadComplete, 300);
      }, remaining);
    };

    loadImages();
  }, [images, minLoadTime, onLoadComplete]);

  if (!showScreen) return null;

  return (
    <div className="fixed inset-0 bg-[#FFF9C4] flex flex-col items-center justify-center z-[9999]">
      <img
        src="/assets/images/star_character.png"
        alt="로딩 캐릭터"
        className="animate-bounce"
        style={{
          width: `calc(200px * ${scale})`,
          height: 'auto',
          marginBottom: `calc(40px * ${scale})`
        }}
      />
      
      <div 
        className="bg-white rounded-full overflow-hidden"
        style={{
          width: `calc(300px * ${scale})`,
          height: `calc(20px * ${scale})`,
          marginBottom: `calc(20px * ${scale})`
        }}
      >
        <div
          className="h-full bg-[#0DA429] transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      
      <p 
        className="font-black text-[#0DA429]"
        style={{ fontSize: `calc(24px * ${scale})` }}
      >
        게임을 준비하고 있어요... {Math.round(progress)}%
      </p>
    </div>
  );
};

export default LoadingScreen;