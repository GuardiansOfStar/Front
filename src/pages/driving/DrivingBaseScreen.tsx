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
  
  // URL 쿼리 파라미터에서 시나리오 ID와 다음 퀘스트 ID 가져오기
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const sId = searchParams.get('scenario');
    const qId = searchParams.get('nextQuest');
    setScenarioId(sId);
    setNextQuestId(qId || '2');
    
    // 3초 후 '주행 시작' 텍스트 표시
    const textTimer = setTimeout(() => {
      setShowStartText(true);
      
      // 텍스트 표시 후 3초 더 기다린 뒤 사라짐
      const hideTextTimer = setTimeout(() => {
        setShowStartText(false);
        
        // 텍스트 사라진 후 2초 후 미션 2로 이동
        const navigationTimer = setTimeout(() => {
          navigate(`/pothole-quest?scenario=${sId}&quest=${qId || '2'}`);
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

  // 타이틀 텍스트 렌더링 함수 - PotholeQuest에서 가져온 스타일
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
    <div className="relative w-full h-screen overflow-hidden">
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