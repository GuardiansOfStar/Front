// Front/src/pages/questFinish/CompletionBackground.tsx 수정
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWindowSize } from 'react-use';
import Confetti from 'react-confetti';

const completion_background = '/assets/images/completion_background_long.png';
const motorcycle = '/assets/images/motorcycle.png';

const CompletionBackground = () => {
    const navigate = useNavigate();
    const { width, height } = useWindowSize();
    const [showConfetti, setShowConfetti] = useState(true);
    const [startAnimation, setStartAnimation] = useState(false);

    useEffect(() => {
        // 컨페티 8초 후 중단
        const confettiTimer = setTimeout(() => {
            setShowConfetti(false);
        }, 10000);

        // 컴포넌트 마운트 시 애니메이션 시작
        setStartAnimation(true);
        console.log("CompletionBackground - 애니메이션 시작");

        // 8초 후 결과 화면으로 자동 이동
        const navigationTimer = setTimeout(() => {
            console.log("CompletionBackground - 결과 화면으로 이동");
            navigate('/result');
        }, 8000);

        return () => {
            clearTimeout(confettiTimer);
            clearTimeout(navigationTimer);
        };
    }, [navigate]);

    return (
        <div className="relative w-full h-full overflow-hidden">
            {/* 배경 이미지 애니메이션 컨테이너 - 수정됨 */}
            <div
                className="transition-transform duration-[5000ms] ease-out w-full h-full"
                style={{
                    transform: startAnimation ? 'translateY(-15%)' : 'translateY(-35%)'
                }}
            >
                <img
                    src={completion_background}
                    alt="주행 완료 후 배경"
                    className="w-full object-cover min-h-full"
                />
            </div>
            
            {/* 오토바이 이미지 - 위치 조정됨 */}
            <div className="absolute bottom-[5%] left-1/2 transform -translate-x-1/2">
                <img 
                    src={motorcycle} 
                    alt="이륜차" 
                    className="w-[70%] max-h-[40vh] mx-auto object-contain"
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
        </div>
    );
};

export default CompletionBackground;