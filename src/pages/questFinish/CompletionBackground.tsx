import { useEffect, useState } from 'react';
import { useWindowSize } from 'react-use';
import Confetti from 'react-confetti';


const completion_background = '/assets/images/completion_background.png'

const CompletionBackground = () => {
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
            src={completion_background}
            alt="주행 완료 후 배경"
            className="w-full h-full object-contain"
        />
        {showConfetti && (
            <Confetti
            width={width}
            height={height}
            numberOfPieces={600}
            gravity={0.1}
            recycle={false} // 반복 없이
            />
        )}
        </div>
    );
};

export default CompletionBackground;