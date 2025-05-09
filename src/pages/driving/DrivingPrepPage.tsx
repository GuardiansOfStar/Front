// src/pages/driving/DrivingPrepPage.tsx 수정 부분
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

// 이미지 임포트
const drivingBackground = '/assets/images/driving_background.png';
const motorcycleSideView = '/assets/images/motorcycle_side_view.png';

const DrivingPrepPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [motorcyclePosition, setMotorcyclePosition] = useState(-100);
  const [scenarioId, setScenarioId] = useState<string | null>(null);
  const [nextQuestId, setNextQuestId] = useState<string | null>(null);
  
  // URL 쿼리 파라미터에서 시나리오 ID와 다음 퀘스트 ID 가져오기
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const sId = searchParams.get('scenario');
    const qId = searchParams.get('nextQuest');
    setScenarioId(sId);
    setNextQuestId(qId);
    
    // 다음 화면으로 자동 이동 타이머
    const timer = setTimeout(() => {
      navigate(`/quest?scenario=${sId}&quest=${qId}`);
    }, 4000);
    
    return () => clearTimeout(timer);
  }, [location, navigate]);
  
  // 이륜차 애니메이션
  useEffect(() => {
    const animationInterval = setInterval(() => {
      setMotorcyclePosition(prev => {
        // 화면을 넘어가면 인터벌 클리어
        if (prev > window.innerWidth) {
          clearInterval(animationInterval);
          return prev;
        }
        // 이동 속도 (픽셀 단위)
        return prev + 5;
      });
    }, 16); // 약 60fps
    
    return () => clearInterval(animationInterval);
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* 배경 */}
      <img
        src={drivingBackground}
        alt="주행 배경"
        className="absolute w-full h-full object-cover"
      />
      
      {/* 이륜차 애니메이션 */}
      <img
        src={motorcycleSideView}
        alt="이륜차"
        style={{ 
          position: 'absolute',
          left: `${motorcyclePosition}px`,
          bottom: '20%',
          width: '280px',
          height: 'auto',
        }}
      />
      
      {/* 로딩 표시 */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2">
        <p className="text-2xl text-white bg-green-600 px-8 py-3 rounded-full shadow-lg">
          주행 준비 중...
        </p>
      </div>
    </div>
  );
};

export default DrivingPrepPage;