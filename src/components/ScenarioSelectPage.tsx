// src/pages/ScenarioSelectPage.tsx
import ScenarioList from './ScenarioList';

const ScenarioSelectPage = () => {
    return (
        <div className="w-full h-screen flex flex-col items-center justify-center bg-gray-400">
            <h1 className="text-4xl font-bold mb-8">시나리오를 선택하세요</h1>
            <ScenarioList />
        </div>
    );
};

export default ScenarioSelectPage;
