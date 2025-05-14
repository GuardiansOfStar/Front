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
        locked: true
    },
    { 
        id: 2, 
        title: '논밭 작업가는 날', 
        subtitle: '논밭 작업가는 날',
        image: '/assets/images/scenario1.png',
        locked: false
    },
    { 
        id: 3, 
        title: '시장가서 장 보는 날', 
        subtitle: '시장가서 장 보는 날',
        image: '/assets/images/scenario3.png',
        locked: true
    },
];

const ScenarioList = () => {
    const navigate = useNavigate();
    const [selectedScenarioIndex, setSelectedScenarioIndex] = useState(0);
    const [frameColor, setFrameColor] = useState('bg-green-600'); // 초기 녹색 프레임
    
    // 시나리오 잠금 여부에 따라 프레임 색상 업데이트
    useEffect(() => {
        setFrameColor(allScenarios[selectedScenarioIndex].locked ? '#718096' : '#48BB78');
    }, [selectedScenarioIndex]);
    
    // 왼쪽 버튼 클릭 핸들러
    const handleLeftClick = () => {
        if (selectedScenarioIndex > 0) {
            setSelectedScenarioIndex(prev => prev - 1);
        }
    };

    // 오른쪽 버튼 클릭 핸들러
    const handleRightClick = () => {
        if (selectedScenarioIndex < allScenarios.length - 1) {
            setSelectedScenarioIndex(prev => prev + 1);
        }
    };

    // 시나리오 선택 핸들러
    const handleScenarioSelect = () => {
        const scenario = allScenarios[selectedScenarioIndex];
        if (scenario.locked) return;
        
        setTimeout(() => {
            navigate(`/prologue?scenario=${scenario.id}`);
        }, 300);
    };

    // 시나리오 이미지 고정 너비 - 제목 박스 너비와 일치시키기 위해 사용
    const SELECTED_SCALE = 1.2;
    const SCENARIO_WIDTH = 320;

    return (
        <div className="flex flex-col items-center justify-between h-full px-4 py-4 space-y-0">
            {/* 타이틀 - 패딩 최소화하고 상단 여백 적절히 조정 */}
            <div className="bg-green-600 border-8 border-green-700 rounded-xl px-24 py-8 w-full max-w-5xl mb-0">
                <h1 className="text-4xl font-extrabold text-white text-center">
                    원하는 안전 교육 게임을 선택하세요
                </h1>
            </div>
            
            {/* 메인 컨텐츠 영역 - 시나리오 선택 (간격 축소) */}
            <div className="flex-grow flex flex-col items-center justify-center w-full mt-0 mb-0">
                {/* 시나리오 표시 영역 */}
                <div className="relative flex justify-center items-center w-full h-[230px] mb-0">
                    {/* 시나리오 이미지들 */}
                    <div className="relative flex justify-center items-center w-full h-[230px]">
                        {allScenarios.map((scenario, index) => {
                            // 선택된 시나리오 여부 확인
                            const isSelected = selectedScenarioIndex === index;
                            
                            // 시나리오 위치 계산 (간격 축소)
                            let translateX = (index - selectedScenarioIndex) * 350;
                            let scale = isSelected ? SELECTED_SCALE : 0.9;
                            let opacity = isSelected ? 1 : 0.6;
                            
                            return (
                                <div
                                    key={scenario.id}
                                    className="absolute transition-all duration-500 ease-in-out"
                                    style={{
                                        transform: `translateX(${translateX}px) scale(${scale})`,
                                        zIndex: isSelected ? 15 : 5,
                                        opacity,
                                    }}
                                    onClick={() => isSelected && !scenario.locked && handleScenarioSelect()}
                                > 
                                    <div 
                                        className="overflow-hidden rounded-xl transition-all duration-300"
                                        style={{
                                            width: `${SCENARIO_WIDTH}px`,
                                            height: '200px',
                                            filter: scenario.locked ? 'grayscale(1) brightness(0.75)' : 'none',
                                            border: isSelected ? `12px solid ${frameColor}` : 'none',
                                            boxSizing: 'border-box',
                                            boxShadow: isSelected ? '0 4px 6px -1px rgba(0, 0, 0, 0.1)' : 'none',
                                            cursor: isSelected && !scenario.locked ? 'pointer' : 'default'
                                        }}
                                    >
                                        <img
                                            src={scenario.image}
                                            alt={scenario.title}
                                            className="w-full h-full object-cover"
                                        />
                                        
                                        {/* 잠금 표시 - 잠금된 시나리오만 */}
                                        {scenario.locked && (
                                            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-80">
                                                <div className="rounded-full p-3">
                                                    <svg 
                                                        xmlns="http://www.w3.org/2000/svg" 
                                                        className="h-14 w-14 text-white" 
                                                        fill="none" 
                                                        viewBox="0 0 24 24" 
                                                        stroke="currentColor"
                                                    >
                                                        <path 
                                                            strokeLinecap="round" 
                                                            strokeLinejoin="round" 
                                                            strokeWidth={2} 
                                                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" 
                                                        />
                                                    </svg>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
                
                {/* subtitle 박스 - 선택된 시나리오에 맞춰 스케일 동기화 */}
                <div 
                    className="rounded-full text-center overflow-hidden mt-4 mb-0 px-6 py-2 pointer-events-none text-white font-extrabold whitespace-nowrap"
                    style={{ 
                        width: `${SCENARIO_WIDTH}px`,
                        backgroundColor: allScenarios[selectedScenarioIndex].locked ? '#718096' : '#48BB78',
                        transformOrigin: 'top',
                        boxSizing: 'border-box',
                    }}
                >
                    <p className="text-xl truncate">
                        {allScenarios[selectedScenarioIndex].subtitle}
                    </p>
                </div>
            </div>
            
            {/* 하단 방향 버튼 - 간격 최소화 */}
            <div className="flex justify-center space-x-4">
                <img
                    src={selectedScenarioIndex > 0 ? leftArrowDark : leftArrowLight}
                    alt="왼쪽으로"
                    className={`w-28 h-28 ${selectedScenarioIndex > 0 ? 'cursor-pointer hover:scale-105 transition-transform' : 'opacity-50 cursor-not-allowed'}`}
                    onClick={handleLeftClick}
                />
                
                <img
                    src={selectedScenarioIndex < allScenarios.length - 1 ? rightArrowDark : rightArrowLight}
                    alt="오른쪽으로"
                    className={`w-28 h-28 ${allScenarios.length - 1 > selectedScenarioIndex ? 'cursor-pointer hover:scale-105 transition-transform' : 'opacity-50 cursor-not-allowed'}`}
                    onClick={handleRightClick}
                />
            </div>
        </div>
    );
};

export default ScenarioList;