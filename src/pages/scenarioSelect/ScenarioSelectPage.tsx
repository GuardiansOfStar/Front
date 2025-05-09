// src/pages/scenarioSelect/ScenarioSelectPage.tsx
import ScenarioList from './ScenarioList';
import Background from '../../components/ui/Background';
import BackButton from '../../components/ui/BackButton';

const ScenarioSelectPage = () => {
    return (
        <div className="relative w-full h-screen overflow-hidden">
            <Background />
            <BackButton />
            
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="bg-green-600 border-4 border-green-700 rounded-full px-12 py-4 mb-10">
                    <h1 className="text-3xl font-bold text-white text-center">
                        원하는 안전 교육 게임을 선택하세요
                    </h1>
                </div>
                
                <ScenarioList />
            </div>
        </div>
    );
};

export default ScenarioSelectPage;