import { useState } from 'react';
// import filled_star from 'assets/images/filled_star.png';
// import empty_star from 'assets/images/empty_star.png';

const filled_star = '/assets/images/filled_star.png'
const empty_star = '/assets/images/empty_star.png'

const Star = ({ size = 100 }: { size?: number }) => {
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
            width: size,
            height: size,
            cursor: 'pointer',
            transition: 'all 0.3s ease',
        }}
        />
    );
};

export default Star;
