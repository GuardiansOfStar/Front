// Front/src/pages/scenarioSelect/ScenarioList.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useScale } from '../../hooks/useScale';

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
        title: '과수원 작업가는 날', 
        subtitle: '과수원 작업가는 날',
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
    const scale = useScale();
    const [selectedScenarioIndex, setSelectedScenarioIndex] = useState(1);
    const [frameColor, setFrameColor] = useState('#0DA429'); // 초기 녹색 프레임
    
    // 스케일 적용된 상수들
    const SELECTED_SCALE = 1.2;
    const SCENARIO_WIDTH = 320 * scale;
    const SCENARIO_SPACING = 350 * scale; // 시나리오 간격에 스케일 적용
    const FRAME_BORDER_WIDTH = 12 * scale;
    
    // 시나리오 잠금 여부에 따라 프레임 색상 업데이트
    useEffect(() => {
        setFrameColor(allScenarios[selectedScenarioIndex].locked ? '#718096' : '#0DA429');
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
            navigate(`/character-select?scenario=${scenario.id}`); // sscenario -> scenario 수정
        }, 300 * Math.max(0.8, scale)); // 스케일 적용된 지연시간
    };

    return (
        <div 
            className="flex flex-col items-center justify-between h-full px-4 py-4 space-y-0"
            style={{
                paddingLeft: `calc(16px * ${scale})`,
                paddingRight: `calc(16px * ${scale})`,
                paddingTop: `calc(0px * ${scale})`,
                paddingBottom: `calc(16px * ${scale})`
            }}
        >
            {/* 타이틀 - 패딩 최소화하고 상단 여백 적절히 조정 */}
            <div 
                className="bg-green-600 border-green-700 w-full max-w-5xl mb-0"
                style={{
                    borderWidth: `calc(8px * ${scale})`,
                    borderRadius: `calc(36px * ${scale})`,
                    paddingLeft: `calc(72px * ${scale})`,
                    paddingRight: `calc(72px * ${scale})`,
                    paddingTop: `calc(24px * ${scale})`,
                    paddingBottom: `calc(24px * ${scale})`,
                    marginBottom: `calc(16px * ${scale})` // 타이틀과 메인 컨텐츠의 간격
                }}
            >
                <h1 
                    className="font-black text-white text-center"
                    style={{ fontSize: `${2.7 * scale}rem` }}
                >
                    원하는 안전 교육 게임을 선택하세요
                </h1>
            </div>
            
            {/* 메인 컨텐츠 영역 - 시나리오 선택 */}
            <div 
                className="flex-grow flex flex-col items-center justify-center w-full mt-0 mb-0"
                style={{
                    marginTop: `calc(10px * ${scale})`,
                    marginBottom: `calc(10px * ${scale})`
                }}
            >
                {/* 시나리오 표시 영역 */}
                <div 
                    className="relative flex justify-center items-center w-full"
                    style={{ 
                        height: `calc(230px * ${scale})`,
                        marginBottom: `calc(5px * ${scale})` // 스케일 적용된 여백
                    }}
                >
                    {/* 시나리오 이미지들 */}
                    <div 
                        className="relative flex justify-center items-center w-full"
                        style={{ height: `calc(230px * ${scale})` }}
                    >
                        {allScenarios.map((scenario, index) => {
                            // 선택된 시나리오 여부 확인
                            const isSelected = selectedScenarioIndex === index;
                            
                            // 시나리오 위치 계산 - 스케일 적용된 간격
                            let translateX = (index - selectedScenarioIndex) * SCENARIO_SPACING;
                            let scaleValue = isSelected ? SELECTED_SCALE : 0.9;
                            let opacity = isSelected ? 1 : 0.6;
                            
                            return (
                                <div
                                    key={scenario.id}
                                    className="absolute transition-all ease-in-out"
                                    style={{
                                        transform: `translateX(${translateX}px) scale(${scaleValue})`,
                                        zIndex: isSelected ? 15 : 5,
                                        opacity,
                                        transitionDuration: `${500 * Math.max(0.8, scale)}ms` // 스케일 적용된 전환시간
                                    }}
                                    onClick={() => isSelected && !scenario.locked && handleScenarioSelect()}
                                > 
                                    <div 
                                        className="overflow-hidden rounded-xl transition-all duration-300"
                                        style={{
                                            width: `${SCENARIO_WIDTH}px`,
                                            height: `calc(200px * ${scale})`,
                                            filter: scenario.locked ? 'grayscale(1) brightness(0.75)' : 'none',
                                            border: isSelected ? `${FRAME_BORDER_WIDTH}px solid ${frameColor}` : 'none',
                                            boxSizing: 'border-box',
                                            boxShadow: isSelected ? `0 ${4 * scale}px ${6 * scale}px ${-1 * scale}px rgba(0, 0, 0, 0.1)` : 'none',
                                            cursor: isSelected && !scenario.locked ? 'pointer' : 'default',
                                            borderRadius: `calc(12px * ${scale})`
                                        }}
                                    >
                                        <img
                                            src={scenario.image}
                                            alt={scenario.title}
                                            className="w-full h-full object-cover"
                                        />
                                        
                                        {/* 잠금 표시 - 잠금된 시나리오만 */}
                                        {scenario.locked && (
                                            <div 
                                                className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-80"
                                                // style={{
                                                //     borderRadius: `calc(12px * ${scale})`
                                                // }}
                                            >
                                                <div 
                                                    className="rounded-full"
                                                    style={{ padding: `calc(12px * ${scale})` }}
                                                >
                                                    <svg 
                                                        xmlns="http://www.w3.org/2000/svg" 
                                                        className="text-white" 
                                                        fill="none" 
                                                        viewBox="0 0 24 24" 
                                                        stroke="currentColor"
                                                        style={{
                                                            width: `calc(56px * ${scale})`,
                                                            height: `calc(56px * ${scale})`
                                                        }}
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
                    className="rounded-lg text-center overflow-hidden pointer-events-none text-white font-black whitespace-nowrap transition-all duration-300"
                    style={{ 
                        width: `${SCENARIO_WIDTH + 68 * scale}px`,
                        backgroundColor: allScenarios[selectedScenarioIndex].locked ? '#718096' : '#0DA429',
                        transformOrigin: 'top',
                        boxSizing: 'border-box',
                        marginTop: `calc(16px * ${scale})`,
                        marginBottom: `calc(5px * ${scale})`, // 스케일 적용된 여백
                        paddingLeft: `calc(24px * ${scale})`,
                        paddingRight: `calc(24px * ${scale})`,
                        paddingTop: `calc(8px * ${scale})`,
                        paddingBottom: `calc(8px * ${scale})`
                    }}
                >
                    <p 
                        className="truncate"
                        style={{ fontSize: `calc(1.55rem * ${scale})` }}
                    >
                        {allScenarios[selectedScenarioIndex].subtitle}
                    </p>
                </div>
            </div>
            
            {/* 하단 방향 버튼 - 간격 최소화 */}
            <div 
                className="flex justify-center"
                style={{ 
                    gap: `calc(64px * ${scale})`,
                }}
            >
                <img
                    src={leftArrowDark}
                    alt="왼쪽으로"
                    className={`transition-transform ${selectedScenarioIndex > 0 ? 'cursor-pointer hover:scale-105' : 'opacity-50 cursor-not-allowed'}`}
                    style={{
                        width: `calc(144px * ${scale})`,
                        height: `calc(144px * ${scale})`,
                        transitionDuration: `${200 * Math.max(0.8, scale)}ms` // 스케일 적용된 전환시간
                    }}
                    onClick={handleLeftClick}
                />
                
                <img
                    src={rightArrowDark}
                    alt="오른쪽으로"
                    className={`transition-transform ${allScenarios.length - 1 > selectedScenarioIndex ? 'cursor-pointer hover:scale-105' : 'opacity-50 cursor-not-allowed'}`}
                    style={{
                        width: `calc(144px * ${scale})`,
                        height: `calc(144px * ${scale})`,
                        transitionDuration: `${200 * Math.max(0.8, scale)}ms` // 스케일 적용된 전환시간
                    }}
                    onClick={handleRightClick}
                />
            </div>
        </div>
    );
};

export default ScenarioList;