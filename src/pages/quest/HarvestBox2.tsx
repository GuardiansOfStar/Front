//import { useEffect, useState } from 'react';

const HarvestBox2 = () => {
    // 애니메이션 없이 고정된 상태로 모든 박스를 보이게 함
    //const visibleBoxes = Array(NUM_BOXES).fill(true);

    // 사과박스의 위치와 크기 지정
    const boxData = [
        { top: '50%', left: '10%', width: '45vw' },
        { top: '60%', left: '50%', width: '40vw' },
        { top: '75%', left: '80%', width: '65vw' },
        { top: '75%', left: '15%', width: '48vw' },
    ];

    return (
        <div className="relative h-full aspect-[4/3] max-w-[100vw] max-h-[100vh] mx-auto overflow-hidden">
            {boxData.map((box, index) => (
                <img
                    key={index}
                    src="/assets/images/apple_box.png"
                    alt={`사과박스-${index}`}
                    className="absolute"
                    style={{
                        top: box.top,
                        left: box.left,
                        width: box.width,
                        transform: 'translate(-50%, -50%)',
                        zIndex: 10,
                        opacity: 1, // 명시적으로
                        scale: 1,   // 명시적으로
                        transition: 'none', // 애니메이션 제거
                    }}
                />
            ))}
        </div>
    );
};

export default HarvestBox2;
