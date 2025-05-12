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
  
  useEffect(() => {
    console.log("DrivingBaseScreen - URL:", location.search);
    const searchParams = new URLSearchParams(location.search);
    const sId = searchParams.get('scenario');
    const nqId = searchParams.get('nextQuest');
    
    console.log("DrivingBaseScreen - 파라미터:", { scenario: sId, nextQuest: nqId });
    
    setScenarioId(sId);
    setNextQuestId(nqId);
    
    // 미션 1→미션 2 전환일 때만 "주행 시작" 텍스트 표시
    if (nqId === '2') {
      // 3초 후 텍스트 표시
      setTimeout(() => {
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
        navigate(`/path-choice-quest?scenario=${sId}&quest=5`);
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
      <div className="absolute top-4 right-4 z-10">
        <img
          src={homeButton}
          alt="홈으로"
          className="w-16 h-16 cursor-pointer"
          onClick={handleGoHome}
        />
      </div>
      
      {/* 주행 시작 텍스트 - 미션 2로 이동할 때만 표시 */}
      {showStartText && (
        <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
          <h2 className="text-8xl font-bold">
              <span className="inline-block text-green-600 px-1 rounded [paint-order:stroke] [-webkit-text-stroke:10px_white] [text-stroke:2px_white]">주</span>
              <span className="inline-block text-green-600 px-1 rounded [paint-order:stroke] [-webkit-text-stroke:10px_white] [text-stroke:2px_white]">행</span>
              <span className="inline-block text-green-600 px-1 rounded [paint-order:stroke] [-webkit-text-stroke:10px_white] [text-stroke:2px_white]">시</span>
              <span className="inline-block text-green-600 px-1 rounded [paint-order:stroke] [-webkit-text-stroke:10px_white] [text-stroke:2px_white]">작</span>
            </h2>
        </div>
      )}
      
      {/* 오토바이 */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 z-10 w-full flex justify-center">
        <img
          src={motorcycle}
          alt="이륜차"
          style={{
            width: '60%',
            maxHeight: '50vh',
            objectFit: 'contain',
            objectPosition: 'bottom'
          }}
        />
      </div>
    </div>
  );
};

export default DrivingBaseScreen;