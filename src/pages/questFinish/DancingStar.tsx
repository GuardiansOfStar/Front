// Front/src/pages/questFinish/DancingStar.tsx 수정
import { useEffect, useState } from 'react';

// 이미지 목록
const starImages = [
    '/assets/images/dancing_star1.png',
    '/assets/images/dancing_star2.png',
    '/assets/images/dancing_star3.png',
    '/assets/images/dancing_star4.png',
];

const DancingStar = () => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prevIndex) => (prevIndex + 1) % starImages.length);
        }, 800); // 800ms마다 이미지 변경

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="w-full h-full flex justify-center items-center">
            <img
                src={starImages[currentImageIndex]}
                alt={`Dancing Star ${currentImageIndex}`}
                className="absolute bottom-[5%] w-[22%] object-contain z-40"
            />
        </div>
    );
};

export default DancingStar;