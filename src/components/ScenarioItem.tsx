import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const ScenarioItem = ({ scenario }: { scenario: { id: number; title: string; image: string } }) => {
    const navigate = useNavigate();
    const [isSelected, setIsSelected] = useState(false); // 확대 상태 관리

    const handleClick = () => {
        setIsSelected(true); // 이미지 확대 시작
        setTimeout(() => {
            navigate(`/map?scenario=${scenario.id}`); // 2초 후 페이지 이동!
        }, 1500);
    };

    return (
        <div className="flex flex-col items-center">
            <img 
                src={scenario.image} 
                alt={scenario.title} 
                onClick={handleClick}
                className={`w-64 object-contain 
                rounded-lg cursor-pointer 
                transition-transform duration-[1500ms] 
                ${isSelected ? 'scale-110 border-4 border-red-500' : 'border-4 border-transparent'}`}
            />
            <div className="w-64 bg-black bg-opacity-40 text-white text-center 
            rounded-lg py-2 font-bold mt-5">
                {scenario.title}
            </div>
        </div>
    );
};

export default ScenarioItem;
