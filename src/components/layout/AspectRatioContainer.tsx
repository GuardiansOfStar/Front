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
  fillMode = 'fit'
}: AspectRatioContainerProps) => {
  const [containerSize, setContainerSize] = useState({ width: 1024, height: 768 });
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const calculateSize = () => {
      const windowWidth = window.innerWidth * 0.95;
      
      // 모바일 기기 감지
      const isMobile = window.innerWidth <= 768;
      const heightRatio = isMobile ? 0.75 : 0.95; // 모바일: 75%, 데스크톱: 95%
      
      const windowHeight = window.innerHeight * heightRatio;
      const windowRatio = windowWidth / windowHeight;
      
      let newWidth, newHeight, newScale;
      
      if (windowRatio > targetRatio) {
        newHeight = windowHeight;
        newWidth = windowHeight * targetRatio;
      } else {
        newWidth = windowWidth;
        newHeight = windowWidth / targetRatio;
      }
      
      if (isMobile && newHeight > window.innerHeight * 0.75) {
        newHeight = window.innerHeight * 0.75;
        newWidth = newHeight * targetRatio;
      }
      
      newScale = Math.min(newWidth / 1024, newHeight / 768);
      
      setContainerSize({ width: newWidth, height: newHeight });
      setScale(newScale);
    };

    calculateSize();
    window.addEventListener('resize', calculateSize);
    return () => window.removeEventListener('resize', calculateSize);
  }, [targetRatio]);

  // 드래그 방지 이벤트 핸들러
  const preventDragEvents = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    return false;
  };

  const preventContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    return false;
  };

  return (
    <div 
      className="w-full h-screen flex items-center justify-center bg-gray-100 overflow-hidden no-drag"
      onDragStart={preventDragEvents}
      onDrag={preventDragEvents}
      onDragEnd={preventDragEvents}
      onContextMenu={preventContextMenu}
    >
      <div 
        className="relative bg-white shadow-lg overflow-hidden no-drag"
        style={{ 
          width: `${containerSize.width}px`,
          height: `${containerSize.height}px`,
        }}
        onDragStart={preventDragEvents}
        onDrag={preventDragEvents}
        onDragEnd={preventDragEvents}
      >
        <div 
          className="relative no-drag"
          style={{
            width: '1024px',
            height: '768px',
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
            '--scale': scale.toString(),
          } as React.CSSProperties}
          onDragStart={preventDragEvents}
          onDrag={preventDragEvents}
          onDragEnd={preventDragEvents}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default AspectRatioContainer;