// src/pages/score/ScorePage.tsx
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

// 이미지 임포트
const scoreBackground = '/assets/images/score_background.png';
const grandchildren = '/assets/images/grandchildren.png';
const homeButton = '/assets/images/home_button.png';

interface ScoreProps {
  score: number;
  questId: string;
  scenarioId: string;
  isCorrect: boolean;
}

const ScorePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [scoreData, setScoreData] = useState<ScoreProps>({
    score: 0,
    questId: '1',
    scenarioId: '2',
    isCorrect: true
  });
  
  useEffect(() => {
    // URL 쿼리 파라미터에서 데이터 가져오기
    const searchParams = new URLSearchParams(location.search);
    const score = parseInt(searchParams.get('score') || '0');
    const questId = searchParams.get('quest') || '1';
    const scenarioId = searchParams.get('scenario') || '2';
    const isCorrect = searchParams.get('correct') === 'true';
    
    setScoreData({
      score,
      questId,
      scenarioId,
      isCorrect
    });
    
    // 3초 후 다음 화면으로 자동 이동
    const timer = setTimeout(() => {
      handleContinue();
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [location]);
  
  // 계속하기 버튼 클릭 핸들러
  const handleContinue = () => {
    const nextQuestId = parseInt(scoreData.questId) + 1;
    
    // 다음 퀘스트가 있으면 이동, 없으면 결과 화면으로 이동
    if (nextQuestId <= 5) {
      navigate(`/quest?scenario=${scoreData.scenarioId}&quest=${nextQuestId}`);
    } else {
      navigate(`/completion?scenario=${scoreData.scenarioId}`);
    }
  };
  
  // 홈으로 이동 핸들러
  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* 배경 이미지 */}
      <img
        src={scoreBackground}
        alt="점수 배경"
        className="absolute w-full h-full object-cover"
      />
      
      {/* 홈 버튼 */}
      <div className="absolute top-4 right-4 z-10">
        <img
          src={homeButton}
          alt="홈으로"
          className="w-16 h-16 cursor-pointer"
          onClick={handleGoHome}
        />
      </div>
      
      {/* 매우 단순화된 점수 표시 */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {/* 손주 이미지 */}
        <img 
          src={grandchildren} 
          alt="손자손녀" 
          className="w-48 h-auto mb-6"
        />
        
        {/* 점수 표시 - 녹색 원형 박스 */}
        <div className="bg-green-600 rounded-full py-5 px-16 shadow-lg">
          <span className="text-6xl font-bold text-white">+ {scoreData.score}</span>
        </div>
      </div>
    </div>
  );
};

export default ScorePage;