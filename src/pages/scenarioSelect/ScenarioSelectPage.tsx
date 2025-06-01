// src/pages/scenarioSelect/ScenarioSelectPage.tsx
import ScenarioList from './ScenarioList';
import Background from '../../components/ui/Background';
import BackButton from '../../components/ui/BackButton';

const ScenarioSelectPage = () => {
    return (
        <div className="relative w-full h-full">
            <Background />
            <BackButton />

            <div className="absolute inset-x-0 top-32 bottom-0 flex flex-col items-center justify-center">
                <ScenarioList />
            </div>
        </div>
    );
};

export default ScenarioSelectPage;