import { useState } from 'react';

const filled_star = '/assets/images/filled_star.png';
const empty_star = '/assets/images/empty_star.png';

const Star = () => {  // ⬅ 더 이상 props 받지 않음
    const [isClicked, setIsClicked] = useState(true);

    const handleClick = () => {
        setIsClicked(!isClicked);
    };

    return (
        <img
        src={isClicked ? filled_star : empty_star}
        alt="별 이미지"
        onClick={handleClick}
        style={{
            width: '120px',     // ⬅ 고정
            cursor: 'pointer',
            transition: 'all 0.3s ease',
        }}
        />
    );
};

export default Star;
