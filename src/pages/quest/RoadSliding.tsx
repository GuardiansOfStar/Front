import { useEffect, useState } from 'react';
//import { useNavigate } from 'react-router-dom';

const background = '/assets/images/basic_road_long.png';
const motorcycle = '/assets/images/motorcycle.png';

const RoadSliding = () => {
    const [startAnimation, setStartAnimation] = useState(false);

    useEffect(() => {
        // 컴포넌트 마운트 시 애니메이션 시작
        setStartAnimation(true);
    },[]);

    return (
        <div className="relative h-full aspect-[4/3] max-w-[100vw] max-h-[100vh] mx-auto overflow-hidden">
            {/* 배경 이미지 애니메이션 컨테이너 */}
            <div
                className={`transition-transform duration-[5000ms] ease-out`}
                style={{
                    transform: startAnimation ? 'translateY(-20%)' : 'translateY(-35%)',
                    maxWidth: '90vw',
                    willChange: 'transform',
                }}
            >
                <img
                    src={background}
                    alt="주행 중 배경"
                    className="w-full h-auto object-contain"
                />
            </div>
            <div className="absolute bottom-0 w-full flex justify-center">
                <img 
                    src={motorcycle} 
                    alt="이륜차" 
                    className="w-4/5 max-h-[50vh] object-contain object-bottom"
                />
            </div>
        </div>
    );
};

export default RoadSliding;