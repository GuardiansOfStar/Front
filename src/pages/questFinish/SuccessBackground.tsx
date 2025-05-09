import { useEffect, useState } from 'react';
import { useWindowSize } from 'react-use';
import Confetti from 'react-confetti';
import DancingStar from './DancingStar'; // DancingStar 컴포넌트 임포트

const success_background = '/assets/images/success_background.png';

const SuccessBackground = () => {
    const { width, height } = useWindowSize();
    const [showConfetti, setShowConfetti] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowConfetti(false);
        }, 8000); // 8초 후 컨페티 멈춤

        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="absolute inset-0 z-0">
            <img
                src={success_background}
                alt="주행 성공 후 배경"
                className="w-full h-full object-contain"
            />
            {showConfetti && (
                <Confetti
                    width={width}
                    height={height}
                    numberOfPieces={600}
                    gravity={0.1}
                    recycle={false}
                />
            )}

            {/* 중앙 하단에 DancingStar 컴포넌트 추가 */}
            <div className="absolute bottom-10 w-full flex justify-center">
                <DancingStar />
            </div>
        </div>
    );
};

export default SuccessBackground;
