import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useScale } from '../../hooks/useScale';
import Confetti from 'react-confetti';
import { audioManager } from '../../utils/audioManager';

const completion_background = '/assets/images/completion_background_long.png';
const motorcycle = '/assets/images/motorcycle.png';

const CompletionBackground = () => {
    const navigate = useNavigate();
    const scale = useScale();
    const [showConfetti] = useState(true);
    const [startAnimation, setStartAnimation] = useState(false);

    useEffect(() => {
        // 컴포넌트 마운트 시 애니메이션 시작
        //환호성 효과음
        audioManager.playSound('goalIn', 0.8);

        setStartAnimation(true);
        console.log("CompletionBackground - 애니메이션 시작");

        // 8초 후 결과 화면으로 자동 이동 (스케일에 따라 시간 조정)
        const navigationTimer = setTimeout(() => {
            console.log("CompletionBackground - 결과 화면으로 이동");
            navigate('/result');
        }, 8000 * Math.max(0.8, scale));

        return () => {
            clearTimeout(navigationTimer);
        };
    }, [navigate, scale]);

    return (
        <div className="relative w-full h-full overflow-hidden">
            {/* 배경 이미지 애니메이션 컨테이너 - 수정됨 */}
            <div
                className="transition-transform ease-out w-full h-full"
                style={{
                    transform: startAnimation ? 'translateY(-2%)' : 'translateY(-30%)',
                    transitionDuration: `${6000 * Math.max(0.8, scale)}ms` // 애니메이션 지속시간 스케일 적용
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
                className="absolute bottom-0 left-1/2 transform -translate-x-1/2 mx-auto object-contain"
                style={{
                    width: `calc(75% * ${scale})`,
                    maxHeight: `calc(60% * ${scale})`
                }}
            />
            
            {/* 컨페티 이펙트 */}
            {showConfetti && (
                <div className="absolute top-0 left-0 w-full h-full z-50 pointer-events-none overflow-hidden">
                    <Confetti
                    width={1024 * scale}
                    height={768 * scale}
                    numberOfPieces={650 * Math.min(1.5, scale)}
                    gravity={0.1 * scale}
                    recycle={true}
                    confettiSource={{
                        x: 0,
                        y: 0,
                        w: 1024 * scale,
                        h: 100 * scale
                    }}
                    />
                </div>
                )}
        </div>
    );
};

export default CompletionBackground;