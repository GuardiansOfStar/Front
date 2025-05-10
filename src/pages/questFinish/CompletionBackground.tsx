import { useEffect, useState } from 'react';
import { useWindowSize } from 'react-use';
import Confetti from 'react-confetti';

const completion_background = '/assets/images/completion_background_long.png';
const motorcycle = '/assets/images/motorcycle.png';
//const completion_background_conf = '/assets/images/completion_background_conf.png';

const CompletionBackground = () => {
    const { width, height } = useWindowSize();
    const [showConfetti, setShowConfetti] = useState(true);
    const [startAnimation, setStartAnimation] = useState(false); // 애니메이션 시작 여부

    useEffect(() => {
        // 컨페티 8초 후 중단
        const confettiTimer = setTimeout(() => {
        setShowConfetti(false);
        }, 10000);

        // 컴포넌트 마운트 시 애니메이션 시작
        setStartAnimation(true);

        return () => {
        clearTimeout(confettiTimer);
        };
    }, []);

    return (
        <div className="relative h-full aspect-[4/3] max-w-[100vw] max-h-[100vh] mx-auto overflow-hidden">
        {/* 배경 이미지 애니메이션 컨테이너 */}
        <div
            className={`transition-transform duration-[5000ms] ease-out`} // 4초간 부드럽게 이동
            style={{
            transform: startAnimation ? 'translateY(-1%)' : 'translateY(-30%)', // 처음엔 위->아래로 이동
            maxWidth: '90vw', // 최대 너비 제한
            }}
        >
            <img
            src={completion_background}
            alt="주행 완료 후 배경"
            className="w-full h-auto object-contain" // 이미지가 컨테이너 너비에 맞게 표시됨
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
            recycle={false} // 반복 없음
            />
        )}
        </div>
    );
};

export default CompletionBackground;
