// src/pages/score/ScorePage.tsx
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Background from '../../components/ui/Background';

// 이미지 임포트
const grandchildrenHappy = '/assets/images/grandchildren_happy.png';
const grandchildrenSad = '/assets/images/grandchildren_sad.png';

const ScorePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [score, setScore] = useState(0);
  const [isCorrect, setIsCorrect] = useState(true);
  const [scenarioId, setScenarioId] = useState<string | null>(null);
  const [questId, setQuestId] = useState<string | null>(null);
  
  // URL 쿼리 파라미터에서 정보 가져오기
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const scoreParam = searchParams.get('score');
    const correctParam = searchParams.get('correct');
    const sId = searchParams.get('scenario');
    const qId = searchParams.get('quest');
    
    setScore(scoreParam ? parseInt(scoreParam) : 0);
    setIsCorrect(correctParam === 'true');
    setScenarioId(sId);
    setQuestId(qId);
    
    // 3초 후 다음 화면으로 자동 이동
    const timer = setTimeout(() => {
      // 미션 1이 끝났으면 주행 기본 화면으로 이동
      if (qId === '1') {
        navigate(`/driving-base?scenario=${sId}&nextQuest=2`);
      } 
      // 미션 2가 끝났으면 미션 3으로 이동 (추후 구현)
      else if (qId === '2') {
        navigate(`/driving-base?scenario=${sId}&nextQuest=3`);
      }
      // 그 외 미션은 추가 구현 필요
      else {
        navigate(`/`);
      }
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [location, navigate]);

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* 배경 컴포넌트 사용 */}
      <Background />
      
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="flex flex-col items-center">
          {/* 손자/손녀 이미지 */}
          <img
            src={isCorrect ? grandchildrenHappy : grandchildrenSad}
            alt={isCorrect ? "기쁜 손자손녀" : "슬픈 손자손녀"}
            className="w-44 h-auto mb-[-15px] z-10" // 크기 키우고 마이너스 마진 적용, z-index 추가
          />
          
          {/* 점수 표시 - 크기 키우고 스타일 조정 */}
          <div className="bg-green-500 border-8 border-green-700 rounded-[100px] px-64 py-10 shadow-lg flex items-center justify-center">
            <span className="text-8xl font-bold text-white">+{score}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScorePage;