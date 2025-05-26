// src/components/layout/AspectRatioContainer.tsx
import { ReactNode, useEffect, useState } from 'react';

interface AspectRatioContainerProps {
  children: ReactNode;
  targetRatio?: number;
  fillMode?: 'fit' | 'fill';
}

const AspectRatioContainer = ({ 
  children, 
  targetRatio = 4/3,
  fillMode = 'fit' // 'fill'에서 'fit'로 변경
}: AspectRatioContainerProps) => {
  const [containerSize, setContainerSize] = useState({ width: 1024, height: 768 });
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const calculateSize = () => {
      const windowWidth = window.innerWidth * 0.95;
      const windowHeight = window.innerHeight * 0.95;
      const windowRatio = windowWidth / windowHeight;
      
      let newWidth, newHeight, newScale;
      
      if (windowRatio > targetRatio) {
        newHeight = windowHeight;
        newWidth = windowHeight * targetRatio;
      } else {
        newWidth = windowWidth;
        newHeight = windowWidth / targetRatio;
      }
      
      // 스케일 계산 추가
      newScale = Math.min(newWidth / 1024, newHeight / 768);
      
      setContainerSize({ width: newWidth, height: newHeight });
      setScale(newScale);
    };

    calculateSize();
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
          className="relative"
          style={{
            width: '1024px',
            height: '768px',
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
            // CSS 변수로 스케일 전달
            '--scale': scale.toString(),
          } as React.CSSProperties}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default AspectRatioContainer;