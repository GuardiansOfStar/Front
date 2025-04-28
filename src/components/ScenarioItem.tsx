import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const ScenarioItem = ({ scenario, isCenter }: { 
    scenario: { id: number; title: string; image: string }, 
    isCenter?: boolean 
    }) => {
    const navigate = useNavigate();
    const [isSelected, setIsSelected] = useState(false); // 확대 상태 관리

    const handleClick = () => {
        setIsSelected(true); // 이미지 확대 시작
        setTimeout(() => {
            navigate(`/map?scenario=${scenario.id}`); // 1.5초 후 페이지 이동!
        }, 1500);
    };

    return (
        <div 
            className={`flex flex-col items-center 
            transition-transform duration-500 
            ${isCenter ? 'scale-105' : 'scale-100'} 
            hover:scale-110`} // Hover 시 확대
        >
            <img 
                src={scenario.image} 
                alt={scenario.title} 
                onClick={handleClick}
                className={`object-contain rounded-lg 
                cursor-pointer 
                transition-transform duration-[1500ms]
                ${isCenter ? 'w-84 h-60' : 'w-64'} 
                ${isSelected ? 'border-8 border-green-700' : 'border-4 border-transparent'}`}
            />
            <div className={`text-center bg-black bg-opacity-60 text-white 
                rounded-lg py-2 font-bold mt-5 
                ${isCenter ? 'text-xl w-80 bg-green-600 bg-opacity-100' : 'text-lg w-64'}`}>
                {scenario.title}
            </div>
        </div>
    );    
};

export default ScenarioItem;
