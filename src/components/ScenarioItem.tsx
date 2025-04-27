import { useNavigate } from 'react-router-dom';

const ScenarioItem = ({ scenario }: { scenario: { id: number; title: string; image: string } }) => {
    const navigate = useNavigate();

    return (
        <div
        className="flex-shrink-0 w-64 h-80 bg-white 
        rounded-lg 
        shadow-lg 
        scroll-snap-align-center 
        cursor-pointer"
        onClick={() => navigate(`/map?scenario=${scenario.id}`)}
        >
        <img src={scenario.image} alt={scenario.title} className="w-full h-2/3 object-cover rounded-t-lg" />
        <div className="p-4 text-center font-bold">{scenario.title}</div>
        </div>
    );
};

export default ScenarioItem;
