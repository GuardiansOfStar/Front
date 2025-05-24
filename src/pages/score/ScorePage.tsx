// src/pages/score/ScorePage.tsx 수정
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Background from '../../components/ui/Background';
import { useScale } from '../../hooks/useScale';

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

  const scale = useScale();
  
  // URL 쿼리 파라미터에서 정보 가져오기
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const scoreParam = searchParams.get('score');
    const correctParam = searchParams.get('correct');
    const sId = searchParams.get('scenario');
    const qId = searchParams.get('quest');
    
    console.log("ScorePage - 받은 파라미터:", { score: scoreParam, correct: correctParam, scenario: sId, quest: qId });
    
    setScore(scoreParam ? parseInt(scoreParam) : 0);
    setIsCorrect(correctParam === 'true');
    setScenarioId(sId);
    setQuestId(qId);
    
    // 3초 후 다음 화면으로 자동 이동
    const timer = setTimeout(() => {
      // 미션별 분기 처리 확장
      console.log("ScorePage - 다음 화면 결정 중:", { questId: qId });

      switch(qId) {
        case '1':
          // 미션1 완료 → 미션2 준비로 이동
          console.log("미션1 완료 → 미션2 준비로 이동");
          navigate(`/driving-base?scenario=${sId}&nextQuest=2`);
          break;
        case '2':
          // 미션2 완료 → 미션3으로 직접 이동 (수정)
          console.log("미션2 완료 → 미션3으로 직접 이동");
          navigate(`/makgeolli-quest?scenario=${sId}&quest=3`);
          break;
        case '3':
          // 미션3 완료 → 미션4로 직접 이동 (수정)
          console.log("미션3 완료 → 미션4로 직접 이동");
          navigate(`/harvest-quest?scenario=${sId}&quest=4`);
          break;
        case '4':
          // 미션4 완료 → 미션5로 직접 이동 (수정)
          console.log("미션4 완료 → 미션5로 직접 이동");
          navigate(`/return-quest?scenario=${sId}&quest=5`);
          break;
        case '5':
          // 미션5 완료 → 성공 화면으로 이동
          console.log("미션5 완료 → 성공 화면으로 이동");
          navigate(`/completion?scenario=${sId}`);
          break;
        default:
          // 알 수 없는 미션 → 홈으로 이동
          console.log("알 수 없는 미션 ID입니다. 홈으로 이동합니다.");
          navigate('/');
      }
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [location, navigate]);

  return (
    <div className="relative w-full h-full">
      {/* 배경 컴포넌트 사용 */}
      <Background />
      
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="flex flex-col items-center">
          {/* 손자/손녀 이미지 */}
          <img
            src={isCorrect ? grandchildrenHappy : grandchildrenSad}
            alt={isCorrect ? "기쁜 손자손녀" : "슬픈 손자손녀"}
            className="relative z-20"
            style={{
              width: `calc(288px * ${scale})`,
              height: 'auto',
              marginBottom: `calc(-40px * ${scale})`
            }}
          />
          
          {/* 점수 표시 - 크기 키우고 스타일 조정 */}
          <div 
            className="transition-transform duration-300 bg-green-500/90 border-green-700 shadow-lg flex items-center justify-center"
            style={{
              transform: `scale(${1.05 * scale})`,
              borderWidth: `calc(16px * ${scale})`,
              borderRadius: `calc(80px * ${scale})`,
              paddingLeft: `calc(160px * ${scale})`,
              paddingRight: `calc(160px * ${scale})`,
              paddingTop: `calc(40px * ${scale})`,
              paddingBottom: `calc(40px * ${scale})`
            }}
          >
            <span className="text-8xl font-extrabold text-white">+{score}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScorePage;