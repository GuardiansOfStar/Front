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
  const [motorcyclePosition, setMotorcyclePosition] = useState(20);
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
  
  // 오토바이 애니메이션 효과
  useEffect(() => {
    const animationInterval = setInterval(() => {
      setMotorcyclePosition(prev => {
        if (prev >= 50) {
          clearInterval(animationInterval);
          return prev;
        }
        return prev + 0.5;
      });
    }, 50);
    
    return () => clearInterval(animationInterval);
  }, []);
  
  // 홈으로 이동 핸들러
  const handleGoHome = () => {
    navigate('/');
  };

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
      
      {/* 주행 시작 텍스트 */}
      {showStartText && (
        <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
          <div className="bg-green-600 py-4 px-12 rounded-xl shadow-lg">
            <h1 className="text-4xl font-bold text-white text-center">주행 시작</h1>
          </div>
        </div>
      )}
      
      {/* 오토바이 - 위치 및 크기 수정 */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 z-10 w-full flex justify-center">
        <img
          src={motorcycle}
          alt="이륜차"
          style={{
            width: '60%', // 화면의 60% 크기로 설정
            maxHeight: '50vh', // 화면 높이의 50%로 최대 높이 제한
            transform: `translateX(${motorcyclePosition - 50}%)`, // 애니메이션 적용하면서 중앙 정렬
            objectFit: 'contain',
            objectPosition: 'bottom'
          }}
        />
      </div>
    </div>
  );
};

export default DrivingBaseScreen;