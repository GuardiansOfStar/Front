// src/pages/prologue/ProloguePage.tsx
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

// 이미지 임포트
const scenario1FullMap = '/assets/images/scenario1_full_map.png';
const starCharacter = '/assets/images/star_character.png';
const departButton = '/assets/images/depart_button.png';
const grandchildren = '/assets/images/grandchildren.png';
const homeButton = '/assets/images/home_button.png';
const nextButton = '/assets/images/next_button.png';
import BackButton from '../../components/ui/BackButton';

// 프롤로그 단계 정의
type PrologueStep = 'mission' | 'map' | 'encouragement';

const ProloguePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [step, setStep] = useState<PrologueStep>('mission');
  const [scenarioId, setScenarioId] = useState<string | null>(null);
  const [showMessage, setShowMessage] = useState(false);
  
  // URL 쿼리 파라미터에서 시나리오 ID 가져오기
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const id = searchParams.get('scenario');
    setScenarioId(id);
    
    // 각 단계별로 2초 후 메시지 표시
    if (step === 'map') {
      const timer = setTimeout(() => {
        setShowMessage(true);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [location, step]);

  // 다음 단계로 이동 핸들러
  const handleNextStep = () => {
    setShowMessage(false); // 다음 단계로 넘어갈 때 메시지 초기화
    if (step === 'mission') {
      setStep('map');
    } else if (step === 'map') {
      setStep('encouragement');
    }
  };

  // 홈으로 이동 핸들러
  const handleGoHome = () => {
    navigate('/');
  };

  // 주행 준비 페이지로 이동
  const handleDepartClick = () => {
    console.log("ProloguePage - 출발하기 버튼 클릭: 주행 준비 페이지로 이동", { scenarioId });
    navigate(`/driving-prep?scenario=${scenarioId}&nextQuest=1`);
  };

  // 미션 소개 컴포넌트
  const MissionIntro = () => (
    <div className="absolute inset-0 flex flex-col items-center justify-center">
      {/* 배경 이미지 직접 추가 */}
      <img
        src="/assets/images/background.png" // 사용할 배경 이미지 경로
        alt="미션 배경"
        className="absolute inset-0 w-full h-full object-cover z-0" // 배경으로 깔리도록 스타일링
      />
      <div className="w-full h-full flex flex-col items-center justify-center z-10 relative mt-40"> {/* 콘텐츠가 배경 위에 오도록 z-10 및 relative 추가 */}
        <h1 className="text-6xl font-bold text-green-600 mb-12">[ 논밭 작업 하는 날 ]</h1>
        <div className="relative bg-green-500 bg-opacity-90 border-8 border-green-600 rounded-2xl p-10 w-3/4 max-w-2xl h-1/2 mt-10">
          <p className="text-4xl text-center text-white leading-relaxed font-bold">
            이륜차를 타고 논밭에 갔다가<br />
            집으로 안전하게 돌아오세요
          </p>
          
          {/* 별별이 캐릭터를 박스 모서리에 오버랩하여 배치 */}
          <img 
            src={starCharacter}
            alt="별별이 캐릭터" 
            className="absolute -bottom-14 -left-14 w-36 h-auto z-20"
          />
        </div>
        
        {/* 다음 버튼 추가 */}
        <div>
          <img
            src={nextButton}
            alt="다음"
            onClick={handleNextStep}
            className="w-48 cursor-pointer hover:scale-105 transition-transform"
          />
        </div>
      </div>
    </div>
  );

  // 약도 컴포넌트
  const MapDisplay = () => (
    <div className="absolute inset-0">
      {/* 전체 배경으로 지도 사용 - object-cover로 변경하여 전체화면 꽉 채우기 */}
      <div className="w-full h-full relative">
        <img 
          src={scenario1FullMap} 
          alt="경로 지도" 
          className="w-full h-full object-cover"
        />
        
        {/* 2초 후 메시지와 다음 버튼 함께 표시 */}
        {showMessage && (
          <>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center">
              <div className="relative">
                {/* 말풍선 형태로 메시지 표시 - 흰색 배경, 녹색 테두리 */}
                <div className="bg-white bg-opacity-90 border-8 border-green-600 rounded-xl p-6 max-w-3xl">
                  <div className="flex items-center">
                    {/* 별별이 캐릭터 박스 모서리에 위치 */}
                    <div className="relative w-full">
                      <p className="text-2xl text-black text-center font-bold leading-relaxed">
                        이륜차 운전 중 여러 상황이 벌어져요!<br />
                        안전 운전에 유의하여 문제를 해결해보아요
                      </p>
                      <img 
                        src={starCharacter}
                        alt="별별이 캐릭터" 
                        className="absolute -bottom-14 -left-10 w-24 h-24"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* 다음 버튼 - 메시지와 함께 표시 */}
            <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2">
              <img
                src={nextButton}
                alt="다음"
                onClick={handleNextStep}
                className="w-48 cursor-pointer hover:scale-105 transition-transform z-30"
              />
            </div>
          </>
        )}
      </div>
    </div>
  );

  // 격려 메시지 컴포넌트
  const EncouragementMessage = () => (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#FFFDE7]">
      <div className="w-full h-full flex flex-col items-center justify-center relative">
        {/* 배경에 지도 흐리게 표시 - object-contain 유지 */}
        <div className="absolute inset-0 opacity-20">
          <img 
            src={scenario1FullMap} 
            alt="배경 지도" 
            className="w-full h-full object-contain"
          />
        </div>
        
        <div className="relative z-10 flex flex-col items-center">
          {/* 손자손녀 이미지 - grandchildren.png 사용 */}
          <div className="flex items-center justify-center mb-4">
            <img src={grandchildren} alt="손자손녀" className="w-48 h-auto" />
          </div>
          
          {/* 메시지 박스 - 흰색 배경, 녹색 테두리 */}
          <div className="bg-white border-8 border-green-600 rounded-2xl p-5 max-w-lg mb-8">
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
    <div className="relative w-full h-full">
      <NavigationButtons />
      
      {/* 단계별 컴포넌트 조건부 렌더링 */}
      {step === 'mission' && <MissionIntro />}
      {step === 'map' && <MapDisplay />}
      {step === 'encouragement' && <EncouragementMessage />}
    </div>
  );
};

export default ProloguePage;