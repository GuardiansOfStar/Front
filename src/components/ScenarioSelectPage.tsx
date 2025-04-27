// src/pages/ScenarioSelectPage.tsx
import ScenarioList from './ScenarioList';
import Background from './Background';

const ScenarioSelectPage = () => {
    return (
        <div className="relative w-full h-screen overflow-hidden">
        <Background />
        <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="bg-green-500 border-8 border-green-700 rounded-3xl px-9 py-6 mb-9">
                <h1 className="text-4xl font-bold text-white">
                    원하는 안전 교육 게임을 선택하세요
                </h1>
            </div>
            <ScenarioList />
        </div>
    </div>
    );
};

export default ScenarioSelectPage;
