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

  // 스크롤 전파 방지
  const preventScrollPropagation = (e: React.WheelEvent) => {
    e.stopPropagation();
  };

  const preventTouchMove = (e: React.TouchEvent) => {
    // 게임 컨테이너 내부에서만 터치 이벤트 허용
    e.stopPropagation();
  };

  return (
    <div 
      className="w-full h-screen flex items-center justify-center bg-gray-100 game-container no-drag"
      style={{
        overflow: 'hidden',
        overscrollBehavior: 'contain',
        touchAction: 'manipulation'
      }}
      onDragStart={preventDragEvents}
      onDrag={preventDragEvents}
      onDragEnd={preventDragEvents}
      onContextMenu={preventContextMenu}
      onWheel={preventScrollPropagation}
      onTouchMove={preventTouchMove}
    >
      <div 
        className="relative bg-white shadow-lg game-container no-drag"
        style={{ 
          width: `${containerSize.width}px`,
          height: `${containerSize.height}px`,
          overflow: 'hidden',
          overscrollBehavior: 'contain',
          touchAction: 'manipulation'
        }}
        onDragStart={preventDragEvents}
        onDrag={preventDragEvents}
        onDragEnd={preventDragEvents}
        onWheel={preventScrollPropagation}
        onTouchMove={preventTouchMove}
      >
        <div 
          className="relative no-drag"
          style={{
            width: '1024px',
            height: '768px',
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
            '--scale': scale.toString(),
            overflow: 'hidden',
            overscrollBehavior: 'contain',
            touchAction: 'manipulation'
          } as React.CSSProperties}
          onDragStart={preventDragEvents}
          onDrag={preventDragEvents}
          onDragEnd={preventDragEvents}
          onWheel={preventScrollPropagation}
          onTouchMove={preventTouchMove}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default AspectRatioContainer;