// src/pages/prologue/ProloguePage.tsx (최종 수정본)
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
type PrologueStep = 'mission' | 'map' | 'mapToEncouragement' | 'encouragement';

const ProloguePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [step, setStep] = useState<PrologueStep>('mission');
  const [scenarioId, setScenarioId] = useState<string | null>(null);
  const [showMessage, setShowMessage] = useState(false);
  const [animationProgress, setAnimationProgress] = useState(0);
  
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
    
    // 애니메이션 진행 상태 관리
    if (step === 'mapToEncouragement') {
      // 초기 상태 설정
      setAnimationProgress(0);
      
      // 애니메이션 진행 시간
      const duration = 1500; // 1.5초
      const startTime = Date.now();
      
      const animationTimer = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        setAnimationProgress(progress);
        
        if (progress >= 1) {
          clearInterval(animationTimer);
          // 애니메이션 완료 후 encouragement 단계로 전환
          setTimeout(() => {
            setStep('encouragement');
          }, 500);
        }
      }, 16);
      
      return () => clearInterval(animationTimer);
    }
  }, [location, step]);

  // 다음 단계로 이동 핸들러
  const handleNextStep = () => {
    setShowMessage(false); // 다음 단계로 넘어갈 때 메시지 초기화
    if (step === 'mission') {
      setStep('map');
    } else if (step === 'map') {
      // 이제 map에서 바로 encouragement로 가지 않고 중간 애니메이션 단계를 거침
      setStep('mapToEncouragement');
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
        src="/assets/images/background.png"
        alt="미션 배경"
        className="absolute inset-0 w-full h-full object-cover z-0"
      />
      <div className="w-full h-full flex flex-col items-center justify-center z-10 relative">
        <h1 className="text-6xl font-extrabold text-green-600 mb-12 animate-[fadeIn_800ms_ease-out]">[ 논밭 작업 하는 날 ]</h1>
        <div className="relative bg-green-600 bg-opacity-90 border-8 border-green-600 rounded-xl p-8 w-4/5 max-w-4xl mx-auto animate-[fadeIn_1200ms_ease-out]">
          <p className="text-4xl text-center text-white font-extrabold">
            이륜차를 타고 논밭에 갔다가
            <br />
            집으로 안전하게 돌아오세요
          </p>
          
          {/* 별별이 캐릭터를 박스 모서리에 오버랩하여 배치 */}
          <img 
            src={starCharacter}
            alt="별별이 캐릭터" 
            className="absolute -bottom-24 -left-24 w-48 h-auto z-20 animate-[fadeIn_1500ms_ease-out]"
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
        
        {/* 2초 후 메시지 표시 */}
        {showMessage && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-4/5 max-w-4xl mx-auto">
              {/* 말풍선 형태로 메시지 표시 */}
              <div className="bg-white bg-opacity-90 border-8 border-green-600 rounded-xl p-8 w-full mx-auto text-center animate-[fadeIn_800ms_ease-out]">
                <div className="relative">
                  <p className="text-3xl text-black font-extrabold">
                    이륜차 운전 중 여러 상황이 벌어져요!<br />
                    안전 운전에 유의하여 문제를 해결해보아요
                  </p>
                  <img 
                    src={starCharacter}
                    alt="별별이 캐릭터" 
                    className="absolute -bottom-28 -left-28 w-48 h-48 animate-[fadeIn_1200ms_ease-out]"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // 맵에서 격려 메시지로 전환하는 애니메이션 컴포넌트
  const MapToEncouragementTransition = () => (
    <div className="absolute inset-0 flex items-center justify-center">
      {/* 배경에 지도 표시 */}
      <div className="absolute inset-0">
        <img 
          src={scenario1FullMap} 
          alt="배경 지도" 
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* 페이드 인 되는 노란색 배경 오버레이 */}
      <div 
        className="absolute inset-0" 
        style={{ 
          backgroundColor: '#FFFDE7', 
          opacity: animationProgress * 0.8, // 최대 80% 불투명도까지
          transition: 'opacity 1.5s ease-in-out' 
        }}
      />
      
      {/* 메시지 컨테이너와 손자손녀 이미지를 함께 그룹화 - 함께 애니메이션 적용 */}
      <div 
        className="relative w-4/5 max-w-4xl z-10"
        style={{ 
          opacity: Math.max(0, (animationProgress - 0.3) * 1.5), // 30% 진행 후 나타나기 시작
          transform: `translateY(${(1 - Math.min(1, animationProgress * 1.2)) * 30}px)`, // 함께 움직임
        }}
      >
        {/* 손자손녀 이미지 - 메시지 박스 위에 위치 */}
        <img 
          src={grandchildren} 
          alt="손자손녀" 
          className="absolute -top-48 left-1/2 transform -translate-x-1/2 w-64 h-auto z-20"
        />
        
        {/* 메시지 박스 */}
        <div className="bg-white bg-opacity-80 border-8 border-green-600 rounded-xl p-16 pt-20 w-full text-center">
          <p className="text-4xl font-extrabold text-black">
            무엇보다 할아버지가 제일 소중해요!<br />
            조심히 다녀오세요!
          </p>
        </div>
      </div>
    </div>
  );

  // 격려 메시지 컴포넌트
  const EncouragementMessage = () => (
    <div className="absolute inset-0 flex items-center justify-center bg-[#FFFDE7]">
      {/* 배경에 지도 흐리게 표시 */}
      <div className="absolute inset-0 opacity-20">
        <img 
          src={scenario1FullMap} 
          alt="배경 지도" 
          className="w-full h-full object-contain"
        />
      </div>
      
      {/* 메시지 컨테이너와 손자손녀 이미지를 함께 그룹화하여 애니메이션 적용 */}
      <div className="relative w-4/5 max-w-4xl z-10 animate-[fadeIn_800ms_ease-out]">
        {/* 손자손녀 이미지 - 메시지 박스 위에 위치 */}
        <img 
          src={grandchildren} 
          alt="손자손녀" 
          className="absolute -top-48 left-1/2 transform -translate-x-1/2 w-64 h-auto z-20"
        />
        
        {/* 메시지 박스 */}
        <div className="bg-white bg-opacity-80 border-8 border-green-600 rounded-xl p-16 pt-20 w-full text-center">
          <p className="text-4xl font-extrabold text-black">
            무엇보다 할아버지가 제일 소중해요!<br />
            조심히 다녀오세요!
          </p>
        </div>
      </div>
    </div>
  );

  // 네비게이션 버튼 컴포넌트
  const NavigationButtons = () => {
    // 시나리오 선택 화면으로 이동하는 핸들러
    const handleBackToScenarios = () => {
      navigate('/scenarios');
    };

    return (
      <>
        {/* 뒤로가기 버튼 - 미션 단계에서만 표시 */}
        {step === 'mission' && (
          <BackButton onClick={handleBackToScenarios} />
        )}
        
        {/* 홈 버튼 */}
        <img
          src={homeButton}
          alt="홈으로"
          onClick={handleGoHome}
          className="absolute top-4 right-4 z-20 w-16 h-16 cursor-pointer active:scale-90 transition-transform duration-150"
        />
      </>
    );
  };

  return (
    <div className="relative w-full h-full">
      <NavigationButtons />
      
      {/* 단계별 컴포넌트 조건부 렌더링 */}
      {step === 'mission' && <MissionIntro />}
      {step === 'map' && <MapDisplay />}
      {step === 'mapToEncouragement' && <MapToEncouragementTransition />}
      {step === 'encouragement' && <EncouragementMessage />}
      
      {/* 버튼 렌더링 - 고정 위치에 배치 */}
      {/* map 단계에서는 showMessage가 true일 때만 표시 */}
      {(step === 'mission' || 
        (step === 'map' && showMessage) || 
        step === 'encouragement') && (
        <div className="absolute bottom-1 left-0 right-0 flex justify-center items-center z-50">
          <img
            src={step === 'encouragement' ? departButton : nextButton}
            alt={step === 'encouragement' ? '출발하기' : '다음'}
            onClick={step === 'encouragement' ? handleDepartClick : handleNextStep}
            className="w-52 h-auto cursor-pointer hover:scale-105 transition-transform"
          />
        </div>
      )}
    </div>
  );
};

export default ProloguePage;