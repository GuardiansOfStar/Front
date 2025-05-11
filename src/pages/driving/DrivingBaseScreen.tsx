// src/pages/driving/DrivingBaseScreen.tsx
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

// 이미지 임포트
const basicRoad = '/assets/images/basic_road.png';
const motorcycle = '/assets/images/motorcycle.png';
const homeButton = '/assets/images/home_button.png';

const DrivingBaseScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [scenarioId, setScenarioId] = useState<string | null>(null);
  const [nextQuestId, setNextQuestId] = useState<string | null>(null);
  const [showStartText, setShowStartText] = useState(false);
  
  // DrivingBaseScreen.tsx의 useEffect 부분 수정
  useEffect(() => {
    console.log("DrivingBaseScreen - URL:", location.search);
    const searchParams = new URLSearchParams(location.search);
    const sId = searchParams.get('scenario');
    const nqId = searchParams.get('nextQuest');
    
    console.log("DrivingBaseScreen - 파라미터:", { scenario: sId, nextQuest: nqId });
    
    setScenarioId(sId);
    setNextQuestId(nqId);
    
    // 3초 후 '주행 시작' 텍스트 표시
    const textTimer = setTimeout(() => {
      setShowStartText(true);
      
      // 텍스트 표시 후 3초 후 사라짐
      const hideTextTimer = setTimeout(() => {
        setShowStartText(false);
        
        // 텍스트 사라진 후 2초 후 다음 미션으로 이동
        const navigationTimer = setTimeout(() => {
          // 미션 번호에 따른 분기 처리 확장
          switch(nqId) {
              case '1':
              // 미션 1 (안전모 미션)으로 이동 (추가)
              console.log("→→→ 미션1(안전모)으로 이동합니다:", `/quest?scenario=${sId}&quest=1`);
              navigate(`/quest?scenario=${sId}&quest=1`);
              break;
            case '2':
              // 미션2 (포트홀 미션)으로 이동
              console.log("→→→ 미션2(포트홀)으로 이동합니다:", `/pothole-quest?scenario=${sId}&quest=2`);
              navigate(`/pothole-quest?scenario=${sId}&quest=2`);
              break;
            case '3':
              // 미션3 (막걸리 미션)으로 이동
              console.log("→→→ 미션3(막걸리)으로 이동합니다:", `/makgeolli-quest?scenario=${sId}&quest=3`);
              navigate(`/makgeolli-quest?scenario=${sId}&quest=3`);
              break;
            case '4':
              // 미션4 (농작물 미션)으로 이동
              console.log("→→→ 미션4(농작물)으로 이동합니다:", `/harvest-quest?scenario=${sId}&quest=4`);
              navigate(`/harvest-quest?scenario=${sId}&quest=4`);
              break;
            case '5':
              // 미션5 (경로 선택 미션)으로 이동
              console.log("→→→ 미션5(경로 선택)으로 이동합니다:", `/path-choice-quest?scenario=${sId}&quest=5`);
              navigate(`/path-choice-quest?scenario=${sId}&quest=5`);
              break;
            default:
              // 기본값: 홈으로 이동
              console.log("→→→ 알 수 없는 미션입니다. 홈으로 이동합니다.");
              navigate('/');
          }
        }, 2000);
        
        return () => clearTimeout(navigationTimer);
      }, 3000);
      
      return () => clearTimeout(hideTextTimer);
    }, 3000);
    
    return () => clearTimeout(textTimer);
  }, [location, navigate]);
  
  // 홈으로 이동 핸들러
  const handleGoHome = () => {
    navigate('/');
  };

  // 타이틀 텍스트 렌더링 함수
  const renderTitleText = (text: string) => (
    <div className="relative inline-block">
      <h1 className="text-6xl font-extrabold text-green-600 px-12 py-4"
          style={{ 
            textShadow: '2px 2px 0 #FFF, -2px -2px 0 #FFF, 2px -2px 0 #FFF, -2px 2px 0 #FFF',
            WebkitTextStroke: '1px white'
          }}>
        {text}
      </h1>
    </div>
  );

  return (
    <div className="relative w-full h-full">
      {/* 배경 */}
      <img
        src={basicRoad}
        alt="주행 배경"
        className="absolute w-full h-full object-cover"
      />
      
      {/* 헤더 영역 */}
      <div className="absolute top-4 right-4 z-10">
        <img
          src={homeButton}
          alt="홈으로"
          className="w-16 h-16 cursor-pointer"
          onClick={handleGoHome}
        />
      </div>
      
      {/* 주행 시작 텍스트 - 더 크게, 중앙 상단에 표시 */}
      {showStartText && (
        <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
          {renderTitleText('주행 시작')}
        </div>
      )}
      
      {/* 디버그 정보 (개발 중에만 표시) */}
      {/* <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white p-2 text-sm z-50">
        다음 미션: {nextQuestId === '3' ? '막걸리 미션(3)' : '포트홀 미션(2)'}
      </div> */}
      
      {/* 오토바이 - 애니메이션 없이 고정 위치에 표시 */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 z-10 w-full flex justify-center">
        <img
          src={motorcycle}
          alt="이륜차"
          style={{
            width: '60%', // 화면의 60% 크기로 설정
            maxHeight: '50vh', // 화면 높이의 50%로 최대 높이 제한
            objectFit: 'contain',
            objectPosition: 'bottom'
          }}
        />
      </div>
    </div>
  );
};

export default DrivingBaseScreen;