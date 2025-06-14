// src/components/ui/SimpleLoadingScreen.tsx - simpleImagePreloader 변경에 맞춘 수정본
import { useState, useEffect } from 'react';
import { useScale } from '../../hooks/useScale';
import { simpleImagePreloader, imagePaths } from '../../utils/simpleImagePreloader';

interface SimpleLoadingScreenProps {
  onLoadComplete: () => void;
  minLoadTime?: number;
  targetPercentage?: number; // 완료로 간주할 로딩 비율
}

const SimpleLoadingScreen = ({ 
  onLoadComplete, 
  minLoadTime = 1000,
  targetPercentage = 70 // 70% 로딩되면 완료로 간주
}: SimpleLoadingScreenProps) => {
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const scale = useScale();

  useEffect(() => {
    const startTime = Date.now();
    let progressValue = 0;

    const progressInterval = setInterval(() => {
      if (progressValue < 85) {
        progressValue += Math.random() * 8;
        setProgress(Math.min(progressValue, 85));
      }
    }, 100);

    const checkLoading = () => {
      const imageLoaded = imagePaths.filter((src: string) => 
        simpleImagePreloader.isLoaded(src)
      ).length;
      
      const loadProgress = (imageLoaded / imagePaths.length) * 100;
      const elapsed = Date.now() - startTime;
      
      console.log(`[LoadingScreen] 진행: ${imageLoaded}/${imagePaths.length} (${loadProgress.toFixed(1)}%)`);
      
      // 목표 비율에 도달하고 최소 시간이 지났으면 완료
      if (loadProgress >= targetPercentage && elapsed >= minLoadTime) {
        clearInterval(progressInterval);
        clearInterval(checkInterval);
        
        setProgress(100);
        setTimeout(() => {
          setIsComplete(true);
          setTimeout(onLoadComplete, 300);
        }, 200);
      } else {
        // 실제 로딩 진행률을 UI에 반영
        const uiProgress = Math.max(progressValue, (loadProgress * 0.85)); // 최대 85%까지
        setProgress(uiProgress);
      }
    };

    const checkInterval = setInterval(checkLoading, 150);

    // 최대 대기 시간 (8초)
    const maxTimeout = setTimeout(() => {
      console.warn('[LoadingScreen] 최대 대기 시간 초과, 강제 완료');
      clearInterval(progressInterval);
      clearInterval(checkInterval);
      setProgress(100);
      setIsComplete(true);
      onLoadComplete();
    }, 8000);

    return () => {
      clearInterval(progressInterval);
      clearInterval(checkInterval);
      clearTimeout(maxTimeout);
    };
  }, [onLoadComplete, minLoadTime, targetPercentage]);

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
      
      {/* 로딩 상태 표시 (개발 모드에서만) */}
      {process.env.NODE_ENV === 'development' && (
        <div 
          className="mt-2 text-center text-gray-600 text-sm"
          style={{ fontSize: `calc(12px * ${scale})` }}
        >
          이미지: {imagePaths.filter(src => simpleImagePreloader.isLoaded(src)).length}/{imagePaths.length}
        </div>
      )}
    </div>
  );
};

export default SimpleLoadingScreen;