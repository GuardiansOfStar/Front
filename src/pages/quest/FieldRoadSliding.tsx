// src/pages/quest/FieldRoadSliding.tsx
import { useEffect, useState } from 'react';

// 필드로 가는 배경 이미지 사용
const background = '/assets/images/orchard_driving_road.png';
const motorcycle = '/assets/images/motorcycle.png';

const FieldRoadSliding = () => {
    const [startAnimation, setStartAnimation] = useState(false);

    useEffect(() => {
        // 약간의 지연 후 애니메이션 시작 (더 자연스러운 효과를 위해)
        const timer = setTimeout(() => {
            setStartAnimation(true);
        }, 500); // 지연시간 300ms에서 500ms로 늘림
        
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="w-full h-full relative overflow-hidden">
            {/* 배경 이미지 애니메이션 컨테이너 */}
            <div
                className="absolute inset-0 w-full"
                style={{
                    height: '200%', // 이미지 높이를 화면의 2배로 설정하여 스크롤 효과를 위한 여유 공간 확보
                    transition: 'transform 7000ms cubic-bezier(0.22, 1, 0.36, 1)', // 5000ms에서 7000ms로 늘려 속도 감소
                    transform: startAnimation ? 'translateY(0%)' : 'translateY(-25%)', // 방향 전환: 위에서 아래로
                    willChange: 'transform'
                }}
            >
                <img
                    src={background}
                    alt="논밭으로 주행 중"
                    className="w-full h-full object-cover"
                    style={{ objectPosition: 'center top' }} // 이미지 상단부터 표시되도록 변경
                />
            </div>
            
            {/* 오토바이 이미지 */}
            <div className="absolute bottom-0 w-full flex justify-center z-10">
                <img 
                    src={motorcycle} 
                    alt="이륜차" 
                    style={{
                        width: '80%',
                        maxHeight: '60vh',
                        objectFit: 'contain',
                        objectPosition: 'bottom'
                    }}
                />
            </div>
        </div>
    );
};

export default FieldRoadSliding;