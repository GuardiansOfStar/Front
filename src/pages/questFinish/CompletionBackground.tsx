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
    const [showConfetti] = useState(true);
    const [startAnimation, setStartAnimation] = useState(false);

    useEffect(() => {
        // 컴포넌트 마운트 시 애니메이션 시작
        setStartAnimation(true);
        console.log("CompletionBackground - 애니메이션 시작");

        // 8초 후 결과 화면으로 자동 이동
        const navigationTimer = setTimeout(() => {
            console.log("CompletionBackground - 결과 화면으로 이동");
            navigate('/result');
        }, 8000);

        return () => {
            clearTimeout(navigationTimer);
        };
    }, [navigate]);

    return (
        <div className="relative w-full h-full overflow-hidden">
            {/* 배경 이미지 애니메이션 컨테이너 - 수정됨 */}
            <div
                className="transition-transform duration-[6000ms] ease-out w-full h-full"
                style={{
                    transform: startAnimation ? 'translateY(-2%)' : 'translateY(-30%)'
                }}
            >
                <img
                    src={completion_background}
                    alt="주행 완료 후 배경"
                    className="w-full object-cover min-h-full"
                />
            </div>
            
            {/* 오토바이 이미지 - 위치 조정됨 */}
            <img
                src={motorcycle} 
                alt="이륜차" 
                className="absolute bottom-0 left-1/2 transform -translate-x-1/2
                w-[75%] max-h-[60%] mx-auto object-contain"
            />
            
            {/* 컨페티 이펙트 */}
            {showConfetti && (
                <div className="absolute top-0 left-0 w-screen z-50 pointer-events-none">
                    <Confetti
                    width={width}
                    height={height}
                    numberOfPieces={650}
                    gravity={0.1}
                    recycle={true}
                    />
                </div>
            )}
        </div>
    );
};

export default CompletionBackground;