// src/components/CharacterAnimation.tsx
import { useEffect, useState } from 'react';
import star_character from 'assets/images/star_character.png'

const CharacterAnimation = () => {
    const [animate, setAnimate] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setAnimate(false), 10000); // 3초 뒤 애니메이션 종료
        return () => clearTimeout(timer);
    }, []);

    return (
        <img
        src={star_character}
        alt="캐릭터"
        className={`absolute top-1/2 left-[230px] transform -translate-y-1/2
        w-[300px] h-auto z-50
        ${animate ? 'animate-move-diagonal' : ''}`}
        />
    );
};

export default CharacterAnimation;
