// src/pages/ScenarioSelectPage.tsx
import ScenarioList from './ScenarioList';
import Background from './Background';
import BackButton from './BackButton';

const ScenarioSelectPage = () => {
    return (
        <div className="relative w-full h-screen overflow-hidden">
            <Background />
            <BackButton />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="w-3/5 bg-green-500 border-8 border-green-700 
                rounded-2xl px-14 py-[25px] mb-10">
                <h1 className="text-4xl font-bold text-white text-center">
                    원하는 안전교육 게임을 선택하세요
                </h1>
                </div>
                <ScenarioList />
            </div>
        </div>
    );
};

export default ScenarioSelectPage;

