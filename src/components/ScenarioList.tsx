import ScenarioItem from "./ScenarioItem";

const scenarios = [
    { id: 1, title: '수확하러 가기', image: '/scenario1.png' },
    { id: 2, title: '시내로 나가기', image: '/scenario2.png' },
    { id: 3, title: '시장 들리기', image: '/scenario3.png' }, // 시나리오 3개 임시
];

const ScenarioList = () => {
    return (
        <div className="flex space-x-8 px-10 justify-center">
            {scenarios.map((scenario) => (
                <ScenarioItem key={scenario.id} scenario={scenario} />
            ))}
        </div>
    );
};

export default ScenarioList;
