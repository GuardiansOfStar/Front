// Front/src/pages/questFinish/SuccessBackground.tsx 수정
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWindowSize } from 'react-use';
import Confetti from 'react-confetti';
import DancingStar from './DancingStar';

const success_background = '/assets/images/success_background_long.png';
const motorcycle = '/assets/images/motorcycle.png';

const SuccessBackground = () => {
    const navigate = useNavigate();
    const { width, height } = useWindowSize();
    const [showConfetti] = useState(true);
    const [startAnimation, setStartAnimation] = useState(false);
    const [showDancingStar, setShowDancingStar] = useState(false);
    const [hideMotorcycle, setHideMotorcycle] = useState(false);

    useEffect(() => {
        // 애니메이션 시작
        setStartAnimation(true);

        // 4초 뒤 댄싱스타 등장 및 오토바이 페이드아웃
        const transitionTimer = setTimeout(() => {
            setShowDancingStar(true);
            setHideMotorcycle(true);
        }, 7400);
        
        // 8초 후 결과 화면으로 자동 이동
        const navigationTimer = setTimeout(() => {
            navigate('/result');
        }, 15000);

        return () => {
            clearTimeout(transitionTimer);
            clearTimeout(navigationTimer);
        };
    }, [navigate]);

    return (
        <div className="relative w-full h-full overflow-hidden">
            {/* 배경 이미지 애니메이션 컨테이너 - 수정됨 */}
            <div
                className="transition-transform duration-[7500ms] ease-out w-full h-full"
                style={{
                transform: startAnimation ? 'translateY(-6%)' : 'translateY(-35%)',
                }}
            >
                <img
                    src={success_background}
                    alt="주행 성공 후 배경"
                    className="w-full object-cover min-h-full"
                />
            </div>

            {/* 오토바이 이미지: 4초 후 페이드아웃 - 위치 조정됨 */}
            <img 
                src={motorcycle} 
                alt="이륜차" 
                className={`absolute bottom-0 left-1/2 transform -translate-x-1/2
                w-[75%] max-h-[60%] mx-auto object-contain  transition-opacity duration-1000 ${hideMotorcycle ? 'opacity-0' : 'opacity-100'}
                z-50`}
            />
            
            {/* 컨페티 이펙트 */}
            {showConfetti && (
                <Confetti
                    width={width}
                    height={height}
                    numberOfPieces={600}
                    gravity={0.1}
                    recycle={true}
                />
            )}

            {/* 댄싱스타: 4초 후 등장 - 위치 조정됨 */}
            {showDancingStar && <DancingStar />}
        </div>
    );
};

export default SuccessBackground;