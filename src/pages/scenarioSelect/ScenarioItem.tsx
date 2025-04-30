import { useNavigate } from 'react-router-dom';

const scenario1 = '/assets/images/scenario1.png'
const scenario2 = '/assets/images/scenario2.png'
const scenario3 = '/assets/images/scenario3.png'

// id에 따라 이미지 매핑
const imageMap: Record<number, string> = {
    1: scenario1,
    2: scenario2,
    3: scenario3,
};

const ScenarioItem = ({
    scenario,
    isCenter
    }: {
    scenario: { id: number; title: string }; //image는 이제 필요 없음
    isCenter?: boolean;
    }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        setTimeout(() => {
        navigate(`/map?scenario=${scenario.id}`); // 1초 후 페이지 이동
        }, 1000);
    };

    return (
        <div
        className={`flex flex-col items-center 
            transition-transform duration-500 
            ${isCenter ? 'scale-105' : 'scale-100'} 
            hover:scale-110`} // Hover 시 확대
        >
            <img
                src={imageMap[scenario.id]}
                alt={scenario.title}
                onClick={handleClick}
                className={`object-contain rounded-lg 
                cursor-pointer 
                ${isCenter ? 'w-84 h-60 border-8 border-green-700' : 'w-64'}`}
            />
            <div
                className={`text-center bg-black bg-opacity-60 text-white 
                rounded-lg py-2 font-bold mt-5 
                ${isCenter ? 'text-xl w-80 bg-green-600' : 'text-lg w-60'}`}
            >
                {scenario.title}
            </div>
        </div>
    );
};

export default ScenarioItem;
