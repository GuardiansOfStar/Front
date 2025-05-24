// src/pages/driving/DrivingBaseScreen.tsx
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useScale } from '../../hooks/useScale';
import GameTitle from '../../components/ui/GameTitle';

// 이미지 임포트
const basicRoad = '/assets/images/driving_road.png';
const motorcycle = '/assets/images/motorcycle.png';
const homeButton = '/assets/images/home_button.png';

const DrivingBaseScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const scale = useScale();
  const [scenarioId, setScenarioId] = useState<string | null>(null);
  const [nextQuestId, setNextQuestId] = useState<string | null>(null);
  const [showStartText, setShowStartText] = useState(false);
  
  useEffect(() => {
    console.log("DrivingBaseScreen - URL:", location.search);
    const searchParams = new URLSearchParams(location.search);
    const sId = searchParams.get('scenario');
    const nqId = searchParams.get('nextQuest');
    
    console.log("DrivingBaseScreen - 파라미터:", { scenario: sId, nextQuest: nqId });
    
    setScenarioId(sId);
    setNextQuestId(nqId);
    
    // 미션 1→미션 2 전환일 때만 "주행 시작" 텍스트 표시 (수정: 바로 표시하도록 변경)
    if (nqId === '2') {
      // 즉시 텍스트 표시 (3초 대기 제거)
      console.log("주행 시작 텍스트 표시");
      setShowStartText(true);
      
      // 3초 후 텍스트 숨김
      setTimeout(() => {
        setShowStartText(false);
        
        // 2초 후 다음 미션으로 이동
        setTimeout(() => {
          handleNextMission(sId, nqId);
        }, 2000);
      }, 3000);
    } else {
      // 다른 미션에서는 5초 후 바로 다음 미션으로 이동
      setTimeout(() => {
        handleNextMission(sId, nqId);
      }, 5000);
    }
  }, [location, navigate]);
  
  // 다음 미션으로 이동하는 함수
  const handleNextMission = (sId: string | null, nqId: string | null) => {
    console.log("다음 미션으로 이동:", nqId);
    
    switch(nqId) {
      case '1':
        navigate(`/quest?scenario=${sId}&quest=1`);
        break;
      case '2':
        navigate(`/pothole-quest?scenario=${sId}&quest=2`);
        break;
      case '3':
        navigate(`/makgeolli-quest?scenario=${sId}&quest=3`);
        break;
      case '4':
        navigate(`/harvest-quest?scenario=${sId}&quest=4`);
        break;
      case '5':
        navigate(`/return-quest?scenario=${sId}&quest=5`);
        break;
      default:
        navigate('/');
    }
  };
  
  // 홈으로 이동 핸들러
  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className="relative w-full h-full">
      {/* 배경 */}
      <img
        src={basicRoad}
        alt="주행 배경"
        className="absolute w-full h-full object-cover"
      />
      
      {/* 헤더 영역 */}
      <div 
        className="absolute z-10"
        style={{
          top: `calc(16px * ${scale})`,
          right: `calc(16px * ${scale})`
        }}
      >
        <img
          src={homeButton}
          alt="홈으로"
          className="cursor-pointer"
          style={{
            width: `calc(64px * ${scale})`,
            height: `calc(64px * ${scale})`
          }}
          onClick={handleGoHome}
        />
      </div>
      
      {/* 주행 시작 텍스트 - 미션 2로 이동할 때만 표시 */}
      {showStartText && (
        <div 
          className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20"
          style={{ top: '25%' }}
        >
          <GameTitle 
            text="주행 시작" 
            fontSize={`calc(5.5rem * ${scale})`}
            strokeWidth={`calc(12px * ${scale})`}
          />
        </div>
      )}
      
      {/* 오토바이 - 크기 확대 */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 z-10 w-full flex justify-center">
        <img
          src={motorcycle}
          alt="이륜차"
          style={{
            width: `calc(80% * ${scale})`, // 80%에 스케일 적용
            maxHeight: `calc(60vh * ${scale})`, // 60vh에 스케일 적용
            objectFit: 'contain',
            objectPosition: 'bottom'
          }}
        />
      </div>
    </div>
  );
};

export default DrivingBaseScreen;