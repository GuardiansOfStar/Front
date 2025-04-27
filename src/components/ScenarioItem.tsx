import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const ScenarioItem = ({ scenario }: { scenario: { id: number; title: string; image: string } }) => {
    const navigate = useNavigate();
    const [isSelected, setIsSelected] = useState(false); // 확대 상태 관리

    const handleClick = () => {
        setIsSelected(true); // 이미지 확대 시작
        setTimeout(() => {
            navigate(`/map?scenario=${scenario.id}`); // 2초 후 페이지 이동!
        }, 2000);
    };

    return (
        <div className="flex flex-col items-center">
            {/* 이미지 */}
            <div className="w-64 aspect-[2/3]">
                <img 
                    src={scenario.image} 
                    alt={scenario.title} 
                    onClick={handleClick}
                    className={`w-full h-full object-contain rounded-lg block 
                    cursor-pointer 
                    transition-transform duration-[2000ms] 
                    ${isSelected ? 'scale-110' : ''}`}
                />
                <div className="w-64 bg-black bg-opacity-40 text-white text-center py-2 font-bold">
                    {scenario.title}
                </div>
            </div>            
        </div>
    );
};

export default ScenarioItem;
