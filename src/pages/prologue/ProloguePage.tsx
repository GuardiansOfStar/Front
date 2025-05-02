import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Background from '../../components/ui/Background';
import BackButton from '../../components/ui/BackButton';

// 이미지 임포트
const scenario1FullMap = '/assets/images/scenario1_full_map.png';
const grandson = '/assets/images/grandson.png';
const granddaughter = '/assets/images/granddaughter.png';
const departButton = '/assets/images/depart_button.png';

// 프롤로그 단계 정의
type PrologueStep = 'mission' | 'map' | 'encouragement';

const ProloguePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [step, setStep] = useState<PrologueStep>('mission');
  const [scenarioId, setScenarioId] = useState<string | null>(null);
  
  // URL 쿼리 파라미터에서 시나리오 ID 가져오기
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const id = searchParams.get('scenario');
    setScenarioId(id);
  }, [location]);

  // 각 단계별 자동 진행 (고령 사용자를 위해 속도 조절)
  useEffect(() => {
    if (step === 'mission') {
      const timer = setTimeout(() => {
        setStep('map');
      }, 3000); // 3초 후 다음 단계로
      return () => clearTimeout(timer);
    } else if (step === 'map') {
      const timer = setTimeout(() => {
        setStep('encouragement');
      }, 3000); // 3초 후 다음 단계로
      return () => clearTimeout(timer);
    }
  }, [step]);

  // 출발하기 버튼 클릭 핸들러
  const handleDepartClick = () => {
    navigate(`/driving-prep?scenario=${scenarioId}`);
  };

  // 미션 소개 컴포넌트
  const MissionIntro = () => (
    <div className="absolute inset-0 flex flex-col items-center justify-center">
      <div className="flex items-center justify-center w-full mb-8">
        <img src={grandson} alt="손자" className="w-48 h-auto mr-12" />
        <div className="bg-yellow-100 border-4 border-green-600 rounded-2xl p-6 max-w-lg shadow-lg">
          <h2 className="text-3xl font-bold text-green-800 mb-4 text-center">
            [논밭 수확하러 가기]
          </h2>
          <p className="text-2xl text-center leading-relaxed">
            오늘은 이륜차 타고 논밭까지 작업하러 가는 날입니다. 
            <br />
            안전하게 우리 집까지 도착하세요!
          </p>
        </div>
        <img src={granddaughter} alt="손녀" className="w-48 h-auto ml-12" />
      </div>
    </div>
  );

  // 약도 컴포넌트
  const MapDisplay = () => (
    <div className="absolute inset-0 flex flex-col items-center justify-center">
      <div className="w-4/5 bg-white border-4 border-green-600 rounded-2xl p-6 shadow-lg">
        <h2 className="text-3xl font-bold text-green-800 mb-4 text-center">
          오늘 갈 경로입니다
        </h2>
        <div className="flex justify-center">
          <img 
            src={scenario1FullMap} 
            alt="경로 지도" 
            className="w-4/5 h-auto rounded-lg" 
          />
        </div>
      </div>
    </div>
  );

  // 격려 메시지 컴포넌트
  const EncouragementMessage = () => (
    <div className="absolute inset-0 flex flex-col items-center justify-center">
      <div className="flex items-center justify-center w-full mb-8">
        <img src={grandson} alt="손자" className="w-48 h-auto mr-12" />
        <div className="bg-green-100 border-4 border-green-600 rounded-2xl p-6 text-center shadow-lg">
          <p className="text-3xl font-bold text-green-800">
            할머니 / 할아버지<br />
            이륜차 안전운전 하세요!
          </p>
        </div>
        <img src={granddaughter} alt="손녀" className="w-48 h-auto ml-12" />
      </div>
      <img 
        src={departButton} 
        alt="출발하기" 
        className="w-64 cursor-pointer hover:scale-105 transition-transform duration-300"
        onClick={handleDepartClick}
      />
    </div>
  );

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <Background />
      <BackButton />
      
      {/* 단계별 컴포넌트 조건부 렌더링 */}
      {step === 'mission' && <MissionIntro />}
      {step === 'map' && <MapDisplay />}
      {step === 'encouragement' && <EncouragementMessage />}
    </div>
  );
};

export default ProloguePage;