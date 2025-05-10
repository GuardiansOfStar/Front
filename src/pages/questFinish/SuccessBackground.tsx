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
    const [showConfetti, setShowConfetti] = useState(true);
    const [startAnimation, setStartAnimation] = useState(false);
    const [showDancingStar, setShowDancingStar] = useState(false);
    const [hideMotorcycle, setHideMotorcycle] = useState(false);

    useEffect(() => {
        // 컨페티는 8초 후 중단
        const confettiTimer = setTimeout(() => {
            setShowConfetti(false);
        }, 10000);

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
        }, 8000);

        return () => {
            clearTimeout(confettiTimer);
            clearTimeout(transitionTimer);
            clearTimeout(navigationTimer);
        };
    }, [navigate]);

    return (
        <div className="relative h-full aspect-[4/3] max-w-[100vw] max-h-[100vh] mx-auto overflow-hidden">
            {/* 배경 이미지 애니메이션 컨테이너 */}
            <div
                className={`transition-transform duration-[7500ms] ease-out`}
                style={{
                    transform: startAnimation ? 'translateY(-3%)' : 'translateY(-30%)',
                    maxWidth: '90vw',
                }}
            >
                <img
                    src={success_background}
                    alt="주행 완료 후 배경"
                    className="w-full h-auto object-contain z-10"
                />
            </div>

            {/* 오토바이 이미지: 4초 후 페이드아웃 */}
            <div className="absolute bottom-0 w-full flex justify-center">
                <img 
                    src={motorcycle} 
                    alt="이륜차" 
                    className={`w-4/5 max-h-[50vh] object-contain object-bottom transition-opacity duration-1000 ${hideMotorcycle ? 'opacity-0' : 'opacity-100'} z-50`}
                />
            </div>

            {/* 컨페티 이펙트 */}
            {showConfetti && (
                <Confetti
                    width={width}
                    height={height}
                    numberOfPieces={700}
                    gravity={0.1}
                    recycle={false}
                />
            )}

            {/* 댄싱스타: 4초 후 등장 */}
            {showDancingStar && <DancingStar />}
        </div>
    );
};

export default SuccessBackground;