// src/components/ui/EnhancedLoadingScreen.tsx - 로딩 로직 개선 버전
import { useState, useEffect, useRef } from 'react';
import { useScale } from '../../hooks/useScale';
import { enhancedImagePreloader, CRITICAL_IMAGES, HIGH_PRIORITY_IMAGES } from '../../utils/enhancedImagePreloader';

interface EnhancedLoadingScreenProps {
  onLoadComplete: () => void;
  minLoadTime?: number;
  maxLoadTime?: number;
}

const EnhancedLoadingScreen = ({ 
  onLoadComplete, 
  minLoadTime = 1500, // 수정: 2000 → 1500
  maxLoadTime = 6000 // 수정: 8000 → 6000
}: EnhancedLoadingScreenProps) => {
  const [progress, setProgress] = useState(0);
  const [loadingMessage, setLoadingMessage] = useState('게임을 준비하고 있어요...');
  const [showScreen, setShowScreen] = useState(true);
  const scale = useScale();
  const startTimeRef = useRef(Date.now());
  const animationFrameRef = useRef<number | undefined>(undefined);
  const checkIntervalRef = useRef<number | undefined>(undefined); // 추가

  const loadingMessages = [
    '게임을 준비하고 있어요...',
    '안전한 농촌 길을 만들고 있어요...',
    '할아버지, 할머니를 기다리고 있어요...',
    '오토바이를 점검하고 있어요...',
    '곧 시작됩니다!'
  ];

  const animateProgress = (targetProgress: number) => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    
    const animate = () => {
      setProgress(current => {
        const diff = targetProgress - current;
        if (Math.abs(diff) < 0.5) {
          return targetProgress;
        }
        return current + diff * 0.15; // 수정: 더 빠른 애니메이션
      });

      if (Math.abs(progress - targetProgress) > 0.5) {
        animationFrameRef.current = requestAnimationFrame(animate);
      }
    };
    animate();
  };

  useEffect(() => {
    const messageInterval = setInterval(() => {
      const messageIndex = Math.min(
        Math.floor(progress / 20),
        loadingMessages.length - 1
      );
      setLoadingMessage(loadingMessages[messageIndex]);
    }, 1200); // 수정: 1500 → 1200

    return () => clearInterval(messageInterval);
  }, [progress, loadingMessages]);

  useEffect(() => {
    const startTime = startTimeRef.current;
    const totalImages = CRITICAL_IMAGES.length + HIGH_PRIORITY_IMAGES.length;
    let isCompleted = false;
    
    // 초기 프로그레스
    animateProgress(5);

    const checkProgress = () => {
      if (isCompleted) return;
      
      const stats = enhancedImagePreloader.getStats();
      const elapsed = Date.now() - startTime;
      
      // 수정: 더 빠른 진행률 계산
      const imageProgress = Math.min((stats.loaded / Math.max(1, totalImages)) * 60, 60);
      const timeProgress = Math.min((elapsed / maxLoadTime) * 35, 35);
      
      const totalProgress = Math.min(5 + imageProgress + timeProgress, 100);
      animateProgress(totalProgress);

      // Critical 이미지 로딩 완료 확인
      const criticalLoadedCount = CRITICAL_IMAGES.filter(src => 
        enhancedImagePreloader.isLoaded(src)
      ).length;
      
      const criticalProgress = (criticalLoadedCount / CRITICAL_IMAGES.length) * 100;
      
      // 수정: 더 관대한 완료 조건
      const shouldComplete = (
        criticalProgress >= 80 && elapsed >= minLoadTime // 80% 이상 + 최소 시간
      ) || elapsed >= maxLoadTime; // 또는 최대 시간 초과
      
      if (shouldComplete && !isCompleted) {
        isCompleted = true;
        console.log(`[LoadingScreen] 로딩 완료 - Critical: ${criticalProgress}%, Total: ${stats.loaded}/${totalImages}, Elapsed: ${elapsed}ms`);
        
        animateProgress(100);
        setTimeout(() => {
          setShowScreen(false);
          setTimeout(onLoadComplete, 200);
        }, 300);
      }
    };

    // 수정: 더 빈번한 체크 (100ms)
    checkIntervalRef.current = window.setInterval(checkProgress, 100);

    return () => {
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current);
      }
      if (animationFrameRef.current !== undefined) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [onLoadComplete, minLoadTime, maxLoadTime]);

  if (!showScreen) return null;

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-[#FFF9C4] to-[#F0E68C] flex flex-col items-center justify-center z-[9999]">
      <div className="relative mb-8">
        <img
          src="/assets/images/star_character.png"
          alt="로딩 캐릭터"
          className="animate-bounce"
          crossOrigin="anonymous" // 추가
          style={{
            width: `calc(200px * ${scale})`,
            height: 'auto',
            filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))'
          }}
        />
        
        <div 
          className="absolute top-0 left-0 w-full h-full animate-ping opacity-30"
          style={{
            background: 'radial-gradient(circle, rgba(255,255,255,0.8) 0%, transparent 70%)',
            animation: 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite'
          }}
        />
      </div>
      
      <div 
        className="relative bg-white/30 backdrop-blur-sm rounded-full overflow-hidden border-2 border-white/50 shadow-lg"
        style={{
          width: `calc(320px * ${scale})`,
          height: `calc(24px * ${scale})`,
          marginBottom: `calc(24px * ${scale})`
        }}
      >
        <div
          className="absolute inset-0 bg-gradient-to-r from-green-400 to-green-600 transition-all duration-300 ease-out" // 수정: 더 빠른 transition
          style={{ 
            width: `${progress}%`,
            background: 'linear-gradient(90deg, #10B981 0%, #059669 50%, #047857 100%)',
            boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.2)'
          }}
        />
        
        <div
          className="absolute top-0 left-0 h-1/2 bg-gradient-to-r from-white/50 to-transparent transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
        
        <div className="absolute inset-0 flex items-center justify-center">
          <span 
            className="font-bold text-white drop-shadow-md"
            style={{ fontSize: `calc(12px * ${scale})` }}
          >
            {Math.round(progress)}%
          </span>
        </div>
      </div>
      
      <p 
        className="font-bold text-green-700 text-center transition-all duration-300 opacity-90"
        style={{ 
          fontSize: `calc(20px * ${scale})`,
          textShadow: '0 2px 4px rgba(255,255,255,0.8)'
        }}
      >
        {loadingMessage}
      </p>
      
      <p 
        className="mt-4 text-green-600/70 text-center font-medium"
        style={{ fontSize: `calc(14px * ${scale})` }}
      >
        잠시만 기다려주세요 🚜
      </p>
      
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full animate-float"
            style={{
              left: `${20 + i * 15}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${3 + i * 0.5}s`
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default EnhancedLoadingScreen;