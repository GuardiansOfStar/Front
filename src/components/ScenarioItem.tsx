import { useNavigate } from 'react-router-dom';

const ScenarioItem = ({ scenario }: { scenario: { id: number; title: string; image: string } }) => {
    const navigate = useNavigate();

    return (
        <div
            className="cursor-pointer"
            onClick={() => navigate(`/map?scenario=${scenario.id}`)}
        >
            <div className="flex flex-col items-center">
                {/* 이미지 */}
                <div className="w-64 aspect-[2/3]">
                    <img 
                    src={scenario.image} 
                    alt={scenario.title} 
                    className="w-full h-full object-contain rounded-lg block"
                    />
                
                <div className="w-64 bg-black bg-opacity-40 text-white text-center py-2 font-bold">
                    {scenario.title}
                </div>
                </div>
            </div>
        </div>
    );
};

export default ScenarioItem;
