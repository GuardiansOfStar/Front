// src/pages/scenarioSelect/ScenarioSelectPage.tsx
import ScenarioList from './ScenarioList';
import Background from '../../components/ui/Background';
import BackButton from '../../components/ui/BackButton';

const ScenarioSelectPage = () => {
    return (
        <div className="relative w-full h-full">
            <Background />
            <div className="absolute top-0 left-0 right-0 p-4 z-10">
                <BackButton />
            </div>

            <div className="absolute inset-x-0 top-32 bottom-0 flex flex-col items-center justify-center">
                <ScenarioList />
            </div>
        </div>
    );
};

export default ScenarioSelectPage;