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
        }, 800); // 2초마다 이미지 변경

        return () => clearInterval(interval); // 컴포넌트 언마운트 시 interval 정리
    }, []);

    return (
        <div className="flex justify-center items-center">
            <img
                src={starImages[currentImageIndex]}
                alt={`Dancing Star ${currentImageIndex}`}
                className="absolute bottom-[2%] w-[22%] object-contain z-40"
            />
        </div>
    );
};

export default DancingStar;
