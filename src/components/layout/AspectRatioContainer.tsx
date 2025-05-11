// src/components/layout/AspectRatioContainer.tsx
import { ReactNode, useEffect, useState } from 'react';

interface AspectRatioContainerProps {
  children: ReactNode;
  targetRatio?: number; // 4/3 = 1.333...
  fillMode?: 'fit' | 'fill'; // fit: 비율 유지, fill: 화면 채우기(욱여넣기)
}

const AspectRatioContainer = ({ 
  children, 
  targetRatio = 4/3,
  fillMode = 'fill' // 기본값을 'fill'로 설정
}: AspectRatioContainerProps) => {
  const [containerSize, setContainerSize] = useState({ width: 1024, height: 768 });
  const [contentStyle, setContentStyle] = useState({});

  // 화면 크기가 변경될 때마다 컨테이너 크기와 스타일을 조정
  useEffect(() => {
    const calculateSize = () => {
      const windowWidth = window.innerWidth * 0.95; // 화면의 95%까지 사용
      const windowHeight = window.innerHeight * 0.95; // 화면의 95%까지 사용
      
      // 창 비율
      const windowRatio = windowWidth / windowHeight;
      
      let newWidth, newHeight;
      
      if (windowRatio > targetRatio) {
        // 화면이 더 넓은 경우: 높이에 맞추고 너비는 비율에 맞게 계산
        newHeight = windowHeight;
        newWidth = windowHeight * targetRatio;
      } else {
        // 화면이 더 좁은 경우: 너비에 맞추고 높이는 비율에 맞게 계산
        newWidth = windowWidth;
        newHeight = windowWidth / targetRatio;
      }
      
      setContainerSize({ width: newWidth, height: newHeight });
      
      // 콘텐츠 스타일 설정
      if (fillMode === 'fill') {
        // 욱여넣기 모드: 컨테이너를 항상 꽉 채움
        setContentStyle({
          width: '100%',
          height: '100%',
          // transform 제거하고 크기를 비율에 맞게 조정
        });
      } else {
        // 맞춤 모드: 비율 유지하면서 스케일링
        const scale = Math.min(newWidth / 1024, newHeight / 768);
        setContentStyle({
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
          width: '1024px',
          height: '768px',
        });
      }
    };

    // 초기 계산
    calculateSize();
    
    // 창 크기 변경 시 다시 계산
    window.addEventListener('resize', calculateSize);
    return () => window.removeEventListener('resize', calculateSize);
  }, [targetRatio, fillMode]);

  return (
    <div className="w-full h-screen flex items-center justify-center bg-gray-100 overflow-hidden">
      <div 
        className="relative bg-white shadow-lg overflow-hidden"
        style={{ 
          width: `${containerSize.width}px`,
          height: `${containerSize.height}px`,
        }}
      >
        <div 
          className="relative"
          style={contentStyle}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default AspectRatioContainer;