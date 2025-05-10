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

        // 8초 후 결과 화면으로 자동 이동
        const navigationTimer = setTimeout(() => {
            navigate('/result');
        }, 8000);

        return () => {
            clearTimeout(confettiTimer);
            clearTimeout(navigationTimer);
        };
    }, [navigate]);

    return (
        <div className="relative h-full aspect-[4/3] max-w-[100vw] max-h-[100vh] mx-auto overflow-hidden">
            {/* 배경 이미지 애니메이션 컨테이너 */}
            <div
                className={`transition-transform duration-[5000ms] ease-out`}
                style={{
                    transform: startAnimation ? 'translateY(-1%)' : 'translateY(-30%)',
                    maxWidth: '90vw',
                }}
            >
                <img
                    src={completion_background}
                    alt="주행 완료 후 배경"
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