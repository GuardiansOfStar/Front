// src/components/layout/AspectRatioContainer.tsx
import { ReactNode, useEffect, useState } from 'react';

interface AspectRatioContainerProps {
  children: ReactNode;
  targetRatio?: number; // 4/3 = 1.333...
}

const AspectRatioContainer = ({ children, targetRatio = 4/3 }: AspectRatioContainerProps) => {
  const [scale, setScale] = useState(1);
  const [containerSize, setContainerSize] = useState({ width: 1024, height: 768 });

  // 화면 크기가 변경될 때마다 컨테이너 크기와 스케일을 조정
  useEffect(() => {
    const calculateSize = () => {
      const windowWidth = window.innerWidth * 0.9; // 화면의 90%까지 사용
      const windowHeight = window.innerHeight * 0.9; // 화면의 90%까지 사용
      
      // 창 비율
      const windowRatio = windowWidth / windowHeight;
      
      let newWidth, newHeight, newScale;
      
      if (windowRatio > targetRatio) {
        // 화면이 더 넓은 경우: 높이에 맞추고 너비는 비율에 맞게 계산
        newHeight = windowHeight;
        newWidth = windowHeight * targetRatio;
        newScale = windowHeight / 768;
      } else {
        // 화면이 더 좁은 경우: 너비에 맞추고 높이는 비율에 맞게 계산
        newWidth = windowWidth;
        newHeight = windowWidth / targetRatio;
        newScale = windowWidth / 1024;
      }
      
      setContainerSize({ width: newWidth, height: newHeight });
      setScale(newScale);
    };

    // 초기 계산
    calculateSize();
    
    // 창 크기 변경 시 다시 계산
    window.addEventListener('resize', calculateSize);
    return () => window.removeEventListener('resize', calculateSize);
  }, [targetRatio]);

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
          style={{ 
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
            width: '1024px',
            height: '768px',
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default AspectRatioContainer;