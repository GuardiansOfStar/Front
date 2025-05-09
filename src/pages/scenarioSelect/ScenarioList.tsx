// src/pages/scenarioSelect/ScenarioList.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// 이미지 임포트
const leftArrowLight = '/assets/images/left_arrow_light.png';
const leftArrowDark = '/assets/images/left_arrow_dark.png';
const rightArrowLight = '/assets/images/right_arrow_light.png';
const rightArrowDark = '/assets/images/right_arrow_dark.png';

// 시나리오 데이터
const allScenarios = [
    { 
        id: 1, 
        title: '시내 이륜차 점검 센터 가기', 
        subtitle: '시내 이륜차 점검 센터 가기',
        image: '/assets/images/scenario2.png',
        locked: true,
        position: 'left'
    },
    { 
        id: 2, 
        title: '논밭 작업가는 날', 
        subtitle: '논밭 작업가는 날',
        image: '/assets/images/scenario1.png',
        locked: false,
        position: 'center'
    },
    { 
        id: 3, 
        title: '시장가서 장 보는 날', 
        subtitle: '시장가서 장 보는 날',
        image: '/assets/images/scenario3.png',
        locked: true,
        position: 'right'
    },
];

const ScenarioList = () => {
    const navigate = useNavigate();
    const [selectedScenarioIndex, setSelectedScenarioIndex] = useState(1); // 초기 선택: 논밭 작업가는 날(인덱스 1)
    const [visibleScenarios, setVisibleScenarios] = useState<Array<typeof allScenarios[0]>>([]);
    
    // 초기화 및 현재 선택에 따라 표시할 시나리오 설정
    useEffect(() => {
        // 현재 선택된 시나리오 인덱스에 따라 표시될 시나리오 결정
        if (selectedScenarioIndex === 0) {
            // 왼쪽 시나리오 선택 시 (시내 이륜차 점검 센터)
            setVisibleScenarios([
                { ...allScenarios[0], position: 'center' },  // 시내 이륜차 점검 -> 중앙으로
                { ...allScenarios[1], position: 'right' }    // 논밭 작업 -> 오른쪽으로
            ]);
        } else if (selectedScenarioIndex === 1) {
            // 중앙 시나리오 선택 시 (논밭 작업가는 날) - 기본값
            setVisibleScenarios([
                { ...allScenarios[0], position: 'left' },    // 시내 이륜차 점검 -> 왼쪽으로
                { ...allScenarios[1], position: 'center' },  // 논밭 작업 -> 중앙으로
                { ...allScenarios[2], position: 'right' }    // 시장가서 장보는 날 -> 오른쪽으로
            ]);
        } else if (selectedScenarioIndex === 2) {
            // 오른쪽 시나리오 선택 시 (시장가서 장 보는 날)
            setVisibleScenarios([
                { ...allScenarios[1], position: 'left' },    // 논밭 작업 -> 왼쪽으로
                { ...allScenarios[2], position: 'center' }   // 시장가서 장보는 날 -> 중앙으로
            ]);
        }
    }, [selectedScenarioIndex]);
    
    // 왼쪽 버튼 클릭 핸들러
    const handleLeftClick = () => {
        if (selectedScenarioIndex > 0) {
            setSelectedScenarioIndex(selectedScenarioIndex - 1);
        }
    };

    // 오른쪽 버튼 클릭 핸들러
    const handleRightClick = () => {
        if (selectedScenarioIndex < allScenarios.length - 1) {
            setSelectedScenarioIndex(selectedScenarioIndex + 1);
        }
    };

    // 시나리오 클릭 핸들러
    const handleScenarioClick = (scenario: typeof allScenarios[0]) => {
        if (!scenario.locked && scenario.position === 'center') {
            // 중앙에 있는 잠금 해제된 시나리오만 클릭 가능
            setTimeout(() => {
                navigate(`/prologue?scenario=${scenario.id}`);
            }, 300);
        }
    };

    return (
        <div className="flex flex-col items-center w-full">
            {/* 시나리오 카드 영역 */}
            <div className="flex justify-center items-center space-x-8 mb-10">
                {visibleScenarios.map((scenario) => (
                    <div 
                        key={scenario.id} 
                        className={`relative
                            transition-all duration-300
                        `}
                        onClick={() => handleScenarioClick(scenario)}
                    >
                        <div 
                            className={`w-80 h-56 rounded-lg overflow-hidden 
                                ${scenario.position === 'center' 
                                    ? 'border-8 border-green-600' 
                                    : 'border-2 border-gray-300'
                                }
                                ${scenario.locked ? 'grayscale' : ''}
                                transition-all duration-300
                                ${scenario.position === 'center' && !scenario.locked ? 'cursor-pointer' : ''}
                            `}
                        >
                            <img
                                src={scenario.image}
                                alt={scenario.title}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>
                ))}
            </div>
            
            {/* 시나리오 텍스트 버튼 */}
            <div className="flex justify-center items-center space-x-8 mb-12">
                {visibleScenarios.map((scenario) => (
                    <button 
                        key={`btn-${scenario.id}`}
                        disabled={scenario.position !== 'center' || scenario.locked}
                        className={`px-8 py-3 rounded-full text-center text-xl font-bold w-80
                            ${scenario.position === 'center'
                                ? scenario.locked
                                  ? 'bg-gray-600 text-gray-200'
                                  : 'bg-green-700 text-white cursor-pointer' 
                                : 'bg-gray-700 text-gray-200'
                            }
                            transition-all duration-300
                        `}
                        onClick={() => handleScenarioClick(scenario)}
                    >
                        {scenario.subtitle}
                    </button>
                ))}
            </div>
            
            {/* 하단 방향 버튼 */}
            <div className="flex justify-center space-x-16 mt-6">
                <img
                    src={selectedScenarioIndex > 0 ? leftArrowDark : leftArrowLight}
                    alt="왼쪽으로"
                    className={`w-32 h-32 ${selectedScenarioIndex > 0 ? 'cursor-pointer' : 'opacity-50 cursor-not-allowed'}`}
                    onClick={handleLeftClick}
                />
                
                <img
                    src={selectedScenarioIndex < allScenarios.length - 1 ? rightArrowDark : rightArrowLight}
                    alt="오른쪽으로"
                    className={`w-32 h-32 ${selectedScenarioIndex < allScenarios.length - 1 ? 'cursor-pointer' : 'opacity-50 cursor-not-allowed'}`}
                    onClick={handleRightClick}
                />
            </div>
        </div>
    );
};

export default ScenarioList;