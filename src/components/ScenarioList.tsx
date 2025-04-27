import ScenarioItem from "./ScenarioItem";

const scenarios = [
    { id: 1, title: '시나리오 1', image: '/scenario1.png' },
    { id: 2, title: '시나리오 2', image: '/scenario2.png' },
];

const ScenarioList = () => {
    return (
        <div className="flex overflow-x-scroll space-x-8 px-10 scroll-snap-type-x-mandatory">
        {scenarios.map((scenario) => (
            <ScenarioItem key={scenario.id} scenario={scenario} />
        ))}
        </div>
    );
};

export default ScenarioList;
