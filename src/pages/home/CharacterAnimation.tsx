import { useEffect, useState } from 'react';
const star_character = '/assets/images/star_character.png'

interface CharacterAnimationProps {
  onAnimationComplete?: () => void;
}

const CharacterAnimation = ({ onAnimationComplete }: CharacterAnimationProps) => {
    const [animationCompleted, setAnimationCompleted] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setAnimationCompleted(true);
            // 애니메이션 종료 후 콜백 호출
            if (onAnimationComplete) {
                onAnimationComplete();
            }
        }, 2000); // 2초 후 애니메이션 종료
        return () => clearTimeout(timer);
    }, [onAnimationComplete]);

    return (
        <img
        src={star_character}
        alt="캐릭터"
        className="absolute w-[18%] h-auto z-20"
        style={{
            // 초기 위치: 좌측 중앙
            // 종료 위치: 시작하기 버튼 오른쪽 하단
            top: animationCompleted ? '65%' : '50%', 
            left: animationCompleted ? '65%' : '10%',
            transform: 'translate(0, 0)', // 별도 transform 제거
            transition: 'all 2s ease-out'
        }}
        />
    );
};

export default CharacterAnimation;