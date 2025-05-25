// Front/src/pages/quest/FieldRoadSliding.tsx
import { useEffect, useState } from 'react';
import { useScale } from '../../hooks/useScale';
import GameTitle from '../../components/ui/GameTitle';

const fieldRoad = '/assets/images/field_road.png';
const motorcycle = '/assets/images/motorcycle.png';

const FieldRoadSliding = () => {
    const [startAnimation, setStartAnimation] = useState(false);
    const [showTitle, setShowTitle] = useState(false);
    const scale = useScale();

    useEffect(() => {
        // 컴포넌트 마운트 시 애니메이션 시작
        setStartAnimation(true);
        
        // 스케일에 따른 타이틀 표시 지연
        const titleTimer = setTimeout(() => {
            setShowTitle(true);
        }, 2000 * Math.max(0.8, scale));
        
        return () => clearTimeout(titleTimer);
    }, [scale]);

    return (
        <div className="relative w-full h-full overflow-hidden">
            {/* 배경 도로 이미지 - 스케일 적용된 애니메이션 */}
            <div
                className="absolute inset-0 transition-transform ease-linear"
                style={{
                    transform: startAnimation 
                        ? `translateY(calc(-30% * ${scale}))` 
                        : `translateY(calc(-50% * ${scale}))`,
                    transitionDuration: `${5000 * Math.max(0.8, scale)}ms`,
                    willChange: 'transform',
                }}
            >
                <img
                    src={fieldRoad}
                    alt="과수원 가는 길"
                    className="w-full h-auto object-contain"
                    style={{
                        minHeight: `calc(120vh * ${scale})`,
                        objectPosition: 'center bottom'
                    }}
                />
            </div>
            
            {/* 제목 표시 - 스케일 적용 */}
            {showTitle && (
                <div 
                    className="absolute left-1/2 transform -translate-x-1/2 z-20"
                    style={{ 
                        top: `calc(20% * ${scale})`,
                        transition: 'opacity 800ms ease-out'
                    }}
                >
                    <GameTitle 
                        text="과수원으로 이동 중" 
                        fontSize={`calc(4rem * ${scale})`}
                        strokeWidth={`calc(10px * ${scale})`}
                    />
                </div>
            )}
            
            {/* 오토바이 이미지 - 스케일 적용 */}
            <div 
                className="absolute bottom-0 left-1/2 transform -translate-x-1/2 z-10"
                style={{
                    marginBottom: `calc(-5% * ${scale})`
                }}
            >
                <img 
                    src={motorcycle} 
                    alt="이륜차" 
                    className="object-contain"
                    style={{
                        width: `calc(70% * ${scale})`,
                        maxWidth: `calc(600px * ${scale})`,
                        height: 'auto',
                        maxHeight: `calc(50vh * ${scale})`
                    }}
                />
            </div>
        </div>
    );
};

export default FieldRoadSliding;