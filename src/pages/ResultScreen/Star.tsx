import { useState } from 'react';
import { useScale } from '../../hooks/useScale';

const filled_star = '/assets/images/filled_star.png'
const empty_star = '/assets/images/empty_star.png'

interface StarProps {
  size?: number;
}

const Star = ({ size = 100 }: StarProps) => {
    const [isClicked, setIsClicked] = useState(true);
    const scale = useScale();

    const handleClick = () => {
        setIsClicked(!isClicked);
    };

    // size가 이미 스케일이 적용된 값인지 확인하고, 그렇지 않다면 스케일 적용
    const finalSize = size === 100 ? size * scale : size;

    return (
        <img
            src={isClicked ? filled_star : empty_star}
            alt="별 이미지"
            onClick={handleClick}
            style={{
                width: finalSize,
                height: finalSize,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
            }}
        />
    );
};

export default Star;