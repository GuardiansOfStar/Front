// src/pages/prologue/ProloguePage.tsx
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

// 이미지 임포트
const scenario1FullMap = '/assets/images/scenario1_full_map.png';
const starCharacter = '/assets/images/star_character.png';
const departButton = '/assets/images/depart_button.png';
const grandson = '/assets/images/grandson.png';
const granddaughter = '/assets/images/granddaughter.png';
const homeButton = '/assets/images/home_button.png';
// const BackButton = '/assets/images/back_button.png';
import BackButton from '../../components/ui/BackButton'
import Background from '../../components/ui/Background';

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
      }, 4000); // 4초 후 다음 단계로
      return () => clearTimeout(timer);
    } else if (step === 'map') {
      const timer = setTimeout(() => {
        setStep('encouragement');
      }, 4000); // 4초 후 다음 단계로
      return () => clearTimeout(timer);
    }
  }, [step]);

  // 홈으로 이동 핸들러
  const handleGoHome = () => {
    navigate('/');
  };

  // 뒤로 가기 핸들러
  const handleGoBack = () => {
    navigate(-1);
  };

  const handleDepartClick = () => {
    navigate(`/driving-prep?scenario=${scenarioId}&nextQuest=1`);
  };

  // 미션 소개 컴포넌트
  const MissionIntro = () => (
    <div className="absolute inset-0 flex items-center justify-center">
      <Background/>
      <div className="w-full h-full flex flex-col items-center justify-center z-10">
        <h1 className="text-4xl font-bold text-green-700 mb-12">[ 논밭 작업 하는 날 ]</h1>
          <div className="relative bg-green-600 border-8 border-green-700 rounded-2xl p-10 w-3/4 h- mx-w-5xl">
            <p className="text-3xl text-white text-center leading-relaxed">
              이륜차를 타고 논밭에 갔다가<br />
              집으로 안전하게 돌아오세요
            </p>
            
            {/* 캐릭터가 박스와 겹치도록 배치 */}
            <img 
              src={starCharacter}
              alt="별별이 캐릭터" 
              className="absolute -bottom-24 -left-24 w-48 h-auto"
            />
          </div>
      </div>
    </div>
  );

  // 약도 컴포넌트
  const MapDisplay = () => (
    <div className="absolute inset-0">
      {/* 전체 배경으로 지도 사용 */}
      <div className="w-full h-full relative">
        <img 
          src={scenario1FullMap} 
          alt="경로 지도" 
          className="w-full h-full object-cover"
        />
        
        {/* 말풍선 형태로 메시지 표시 */}
        <div className="absolute bottom-12 right-12 bg-green-600 rounded-xl p-4 max-w-md">
          <div className="flex items-center">
            <img 
              src={starCharacter}
              alt="별별이 캐릭터" 
              className="w-16 h-16 mr-3"
            />
            <p className="text-white text-xl">
              이륜차 운전 중 여러 상황이 벌어져요!<br />
              안전 운전에 유의하여 문제를 해결해보아요
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  // 격려 메시지 컴포넌트
  const EncouragementMessage = () => (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#FFFDE7]">
      <div className="w-full h-full flex flex-col items-center justify-center relative">
        {/* 배경에 지도 흐리게 표시 */}
        <div className="absolute inset-0 opacity-20">
          <img 
            src={scenario1FullMap} 
            alt="배경 지도" 
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="relative z-10 flex flex-col items-center">
          {/* 손자/손녀 이미지 */}
          <div className="flex items-center justify-center mb-4">
            <img src={grandson} alt="손자" className="w-24 h-auto" />
            <img src={granddaughter} alt="손녀" className="w-24 h-auto ml-3" />
          </div>
          
          {/* 메시지 박스 */}
          <div className="bg-white border-4 border-green-600 rounded-2xl p-5 max-w-lg mb-8">
            <p className="text-2xl font-bold text-center text-green-700">
              무엇보다 할아버지가 제일 소중해요!<br />
              조심히 다녀오세요!
            </p>
          </div>
          
          {/* 출발하기 버튼 */}
          <img
            src={departButton}
            alt="출발하기"
            onClick={handleDepartClick}
            className="w-48 cursor-pointer hover:scale-105 transition-transform"
          />
        </div>
      </div>
    </div>
  );

  // 네비게이션 버튼 컴포넌트
  const NavigationButtons = () => (
    <>
      {/* 뒤로가기 버튼 */}
      <div className="absolute top-4 left-4 z-20">
        <BackButton/>
      </div>
      
      {/* 홈 버튼 */}
      <img
      src={homeButton}
      alt="홈으로"
      onClick={handleGoHome}
      className="absolute top-4 right-4 z-20 w-16 h-16 cursor-pointer active:scale-90 transition-transform duration-150"
    />
    </>
  );

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <NavigationButtons />
      
      {/* 단계별 컴포넌트 조건부 렌더링 */}
      {step === 'mission' && <MissionIntro />}
      {step === 'map' && <MapDisplay />}
      {step === 'encouragement' && <EncouragementMessage />}
    </div>
  );
};

export default ProloguePage;