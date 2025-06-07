// src/components/ui/SimpleLoadingScreen.tsx - 단순하고 확실한 로딩
import { useState, useEffect } from 'react';
import { useScale } from '../../hooks/useScale';
import { simpleImagePreloader, CRITICAL_IMAGES } from '../../utils/simpleImagePreloader';

interface SimpleLoadingScreenProps {
  onLoadComplete: () => void;
  minLoadTime?: number;
}

const SimpleLoadingScreen = ({ 
  onLoadComplete, 
  minLoadTime = 1000 
}: SimpleLoadingScreenProps) => {
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const scale = useScale();

  useEffect(() => {
    const startTime = Date.now();
    let progressValue = 0;

    // 진행률 애니메이션
    const progressInterval = setInterval(() => {
      if (progressValue < 90) {
        progressValue += Math.random() * 10;
        setProgress(Math.min(progressValue, 90));
      }
    }, 100);

    // Critical 이미지 로딩 확인
    const checkLoading = () => {
      const loadedCount = CRITICAL_IMAGES.filter(src => 
        simpleImagePreloader.isLoaded(src)
      ).length;
      
      const loadProgress = (loadedCount / CRITICAL_IMAGES.length) * 100;
      const elapsed = Date.now() - startTime;
      
      console.log(`[SimpleLoadingScreen] 로딩 진행: ${loadedCount}/${CRITICAL_IMAGES.length} (${loadProgress.toFixed(1)}%)`);
      
      if (loadProgress >= 100 && elapsed >= minLoadTime) {
        clearInterval(progressInterval);
        clearInterval(checkInterval);
        
        setProgress(100);
        setTimeout(() => {
          setIsComplete(true);
          setTimeout(onLoadComplete, 300);
        }, 200);
      }
    };

    const checkInterval = setInterval(checkLoading, 100);

    // 최대 대기 시간 (5초)
    const maxTimeout = setTimeout(() => {
      console.warn('[SimpleLoadingScreen] 최대 대기 시간 초과, 강제 완료');
      clearInterval(progressInterval);
      clearInterval(checkInterval);
      setProgress(100);
      setIsComplete(true);
      onLoadComplete();
    }, 5000);

    return () => {
      clearInterval(progressInterval);
      clearInterval(checkInterval);
      clearTimeout(maxTimeout);
    };
  }, [onLoadComplete, minLoadTime]);

  if (isComplete) return null;

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-[#FFF9C4] to-[#F0E68C] flex flex-col items-center justify-center z-[9999]">
      {/* 캐릭터 이미지 */}
      <div className="relative mb-8">
        <img
          src="/assets/images/star_character.png"
          alt="로딩 캐릭터"
          className="animate-bounce"
          style={{
            width: `calc(200px * ${scale})`,
            height: 'auto',
            filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))'
          }}
          loading="eager"
          decoding="sync"
        />
      </div>
      
      {/* 진행률 바 */}
      <div 
        className="relative bg-white/30 backdrop-blur-sm rounded-full overflow-hidden border-2 border-white/50 shadow-lg"
        style={{
          width: `calc(320px * ${scale})`,
          height: `calc(20px * ${scale})`
        }}
      >
        <div 
          className="h-full bg-gradient-to-r from-blue-400 to-blue-600 transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      
      {/* 로딩 메시지 */}
      <div 
        className="mt-6 text-center font-bold text-gray-700"
        style={{ fontSize: `calc(18px * ${scale})` }}
      >
        게임을 준비하고 있어요... ({Math.round(progress)}%)
      </div>
    </div>
  );
};

export default SimpleLoadingScreen;