import ScenarioItem from "./ScenarioItem";

const scenarios = [
    { id: 2, title: '시내로 나가기', image: '/scenario2.png' },
    { id: 1, title: '수확하러 가기', image: '/scenario1.png' },
    { id: 3, title: '시장 들리기', image: '/scenario3.png' }, 
];

const ScenarioList = () => {
    return (
        <div className="flex space-x-16 px-10 justify-center mt-16">
            {scenarios.map((scenario, index) => (
                <ScenarioItem 
                    key={scenario.id} 
                    scenario={scenario} 
                    isCenter={index === 1} // 두 번째 시나리오만 true
                />
            ))}
        </div>
    );
};


export default ScenarioList;
