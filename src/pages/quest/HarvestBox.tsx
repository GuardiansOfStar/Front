import { useEffect, useState } from 'react';

const NUM_BOXES = 4;

const HarvestBox = () => {
    const [visibleBoxes, setVisibleBoxes] = useState<boolean[]>(Array(NUM_BOXES).fill(false));

    // 사과박스의 위치와 크기 지정
    const boxData = [
        { top: '55%', left: '20%', width: '50%' },
        { top: '65%', left: '45%', width: '45%' },
        { top: '75%', left: '79%', width: '71%' },
        { top: '82%', left: '24%', width: '55%' },
    ];

    useEffect(() => {
        const timers = boxData.map((_, i) =>
        setTimeout(() => {
            setVisibleBoxes((prev) => {
            const updated = [...prev];
            updated[i] = true;
            return updated;
            });
        }, i * 500)
        );

        return () => timers.forEach(clearTimeout);
    }, []);

    return (
        <div className="w-full h-full">
        {boxData.map((box, index) => (
            <img
            key={index}
            src='/assets/images/apple_box.png'
            alt={`사과박스-${index}`}
            className={`absolute transition-all duration-500 ease-out
                ${visibleBoxes[index] ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`}
            style={{
                top: box.top,
                left: box.left,
                width: box.width,
                transform: 'translate(-50%, -50%)',
                zIndex: 10,
            }}
            />
        ))}
        </div>
    );
};

export default HarvestBox;
