// src/pages/prologue/ProloguePage.tsx (수정된 버전)
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

import { createGuestUser } from '../../services/endpoints/user';
import { createSession } from '../../services/endpoints/session';

import { useScale } from '../../hooks/useScale';

// 이미지 임포트
const scenario1FullMap = '/assets/images/scenario1_full_map.png';
const starCharacter = '/assets/images/star_character.png';
const departButton = '/assets/images/depart_button.png';
const grandchildren = '/assets/images/grandchildren.png';
const homeButton = '/assets/images/home_button.png';
const nextButton = '/assets/images/next_button.png';
const letterEnvelope = '/assets/images/letter_envelope.png';
import BackButton from '../../components/ui/BackButton';
import GameTitle from '../../components/ui/GameTitle';

// 프롤로그 단계 정의 (수정: letterMessage 단계 추가)
type PrologueStep = 'mission' | 'map' | 'mapToEncouragement' | 'letterMessage' | 'encouragement';

const ProloguePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const scale = useScale();
  const [step, setStep] = useState<PrologueStep>('mission');
  const [scenarioId, setScenarioId] = useState<string | null>(null);
  const [showMessage, setShowMessage] = useState(false);
  const [animationProgress, setAnimationProgress] = useState(0);
  
  // URL 쿼리 파라미터에서 시나리오 ID 가져오기
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const id = searchParams.get('scenario');
    setScenarioId(id);
    console.log("id : ", id);

    const alreadyHasUser = localStorage.getItem("user_id");
    const alreadyHasSession = localStorage.getItem("session_id");
    
    // 한 번만 생성
    if (id && !alreadyHasUser && !alreadyHasSession) {
      createGuestUser("0") // 예산군 villageId : 0
        .then((userRes) => {
          const userId = userRes.data.user_id;
          console.log("!!!", userRes.data);
          console.log( "user_id : ", userId);
          localStorage.setItem("user_id", userId);
          return createSession(userId);
        })
        .then((sessionRes) => {
          const sessionId = sessionRes.data.session_id;
          localStorage.setItem("session_id", sessionId);
          console.log("✅ 사용자 및 세션 생성 완료", { sessionId });
        })
        .catch((err) => {
          console.error("❌ 사용자 또는 세션 생성 실패", err);
        });
    }

    // 각 단계별로 2초 후 메시지 표시
    if (step === 'map') {
      const timer = setTimeout(() => {
        setShowMessage(true);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
    
    // 애니메이션 진행 상태 관리
    if (step === 'mapToEncouragement') {
      setAnimationProgress(0);
      
      const duration = 1500; // 1.5초
      const startTime = Date.now();
      
      const animationTimer = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        setAnimationProgress(progress);
        
        if (progress >= 1) {
          clearInterval(animationTimer);
          // letterMessage 단계로 전환
          setStep('letterMessage');
        }
      }, 16);
      
      return () => clearInterval(animationTimer);
    }

    // letterMessage 단계에서 3초 후 encouragement로 자동 전환
    if (step === 'letterMessage') {
      const timer = setTimeout(() => {
        setStep('encouragement');
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [location, step]);

  // 다음 단계로 이동 핸들러
  const handleNextStep = () => {
    setShowMessage(false);
    if (step === 'mission') {
      setStep('map');
    } else if (step === 'map') {
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

  // 미션 소개 컨텐츠 (배경 제거)
  const MissionContent = () => (
    <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
      <h1 
        className="text-green-600 font-extrabold animate-[fadeIn_800ms_ease-out]"
        style={{ 
          fontSize: `calc(6xl * ${scale})`,
          marginBottom: `${60 * scale}px`
        }}
      >
        <GameTitle text="과수원 작업 하는 날" fontSize="text-6xl" strokeWidth="8px"/>
      </h1>
      <div 
        className="relative bg-green-600 bg-opacity-80 border-green-600 w-4/5 max-w-4xl mx-auto animate-[fadeIn_1200ms_ease-out]"
        style={{
          borderWidth: `calc(8px * ${scale})`,
          paddingTop: `${scale * 72}px`,
          paddingBottom: `${scale * 72}px`,
          borderRadius: `calc(36px * ${scale})`,
          paddingLeft: `calc(32px * ${scale})`,
          paddingRight: `calc(32px * ${scale})`
        }}
      >
        <p 
          className="text-center text-white font-extrabold"
          style={{
            fontSize: `${3.0 * scale}rem`,
            letterSpacing: `${0.07 * scale}em`
          }}
        >
          이륜차를 타고 과수원에 갔다가
          <br />
          집으로 안전하게 돌아오세요
        </p>
        
        <img 
          src={starCharacter}
          alt="별별이 캐릭터" 
          className="absolute animate-[fadeIn_1500ms_ease-out]"
          style={{
            bottom: `calc(-96px * ${scale})`,
            left: `calc(-96px * ${scale})`,
            width: `calc(192px * ${scale})`,
            height: 'auto',
            zIndex: 20
          }}
        />
      </div>
    </div>
  );

  // 약도 컨텐츠 (배경 제거)
  const MapContent = () => (
    <>
      {showMessage && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div 
            className="w-4/5 max-w-4xl mx-auto"
            style={{ maxWidth: `calc(1024px * ${scale})` }}
          >
            <motion.div 
              className="bg-white bg-opacity-90 border-green-600 rounded-xl w-full mx-auto text-center"
              style={{
                borderWidth: `calc(8px * ${scale})`,
                borderRadius: `calc(24px * ${scale})`,
                padding: `calc(32px * ${scale})`
              }}
              initial={{ opacity: 0, y: `calc(20px * ${scale})` }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="relative">
                <p 
                  className="text-black font-extrabold"
                  style={{
                    fontSize: `${2.1 * scale}rem`,
                    letterSpacing: `${0.07 * scale}em`
                  }}
                >
                  이륜차 운전 중 여러 상황이 벌어져요!<br />
                  안전 운전에 유의하여 문제를 해결해보아요
                </p>
                <img 
                  src={starCharacter}
                  alt="별별이 캐릭터" 
                  className="absolute"
                  style={{
                    bottom: `calc(-80px * ${scale})`,
                    left: `calc(-160px * ${scale})`,
                    width: `calc(212px * ${scale})`,
                    height: `calc(212px * ${scale})`
                  }}
                />
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </>
  );

  // 맵에서 격려 메시지로 전환 컨텐츠 (배경 제거)
  const MapToEncouragementContent = () => (
    <motion.div 
      className="absolute inset-0 flex items-center justify-center z-10"
      initial={{ opacity: 0, y: `calc(30px * ${scale})` }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div 
        className="relative w-4/5"
        style={{ maxWidth: `calc(1024px * ${scale})` }}
      >
        <img 
          src={grandchildren} 
          alt="손자손녀" 
          className="absolute left-1/2 transform -translate-x-1/2 z-20"
          style={{
            top: `calc(-144px * ${scale})`,
            width: `calc(288px * ${scale})`,
            height: 'auto'
          }}
        />
        
        <div 
          className="bg-white bg-opacity-80 border-green-600 rounded-xl w-full text-center"
          style={{
            borderWidth: `calc(8px * ${scale})`,
            borderRadius: `calc(12px * ${scale})`,
            padding: `calc(64px * ${scale})`,
            paddingTop: `calc(80px * ${scale})`
          }}
        >
          <p 
            className="font-extrabold text-black"
            style={{ fontSize: `calc(4xl * ${scale})` }}
          >
            무엇보다 할아버지가 제일 소중해요!<br />
            조심히 다녀오세요!
          </p>
        </div>
      </div>
    </motion.div>
  );

  // 편지 메시지 컨텐츠 (배경 제거)
  const LetterMessageContent = () => (
    <div className="absolute inset-0 flex items-center justify-center z-10">
      <div className="flex flex-col items-center justify-center">
        {/* 응원 메시지 타이틀 */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: `calc(-20px * ${scale})` }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <GameTitle text="응원 메시지가 도착했어요!" fontSize="text-5xl" strokeWidth="8px" />
        </motion.div>
        
        {/* 편지 봉투 애니메이션 */}
        <motion.img
          src={letterEnvelope}
          alt="편지 봉투"
          className="object-contain"
          style={{
            width: `calc(240px * ${scale})`,
            height: 'auto'
          }}
          initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
          animate={{ 
            opacity: 1, 
            scale: [0.8, 1.1, 0.9, 1], 
            rotate: [-5, 5, -2, 0],
            y: [0, `calc(-10px * ${scale})`, `calc(5px * ${scale})`, 0]
          }}
          transition={{ 
            duration: 2,
            times: [0, 0.3, 0.6, 1],
            ease: "easeOut",
            repeat: Infinity,
            repeatType: "reverse",
            repeatDelay: 1
          }}
        />
      </div>
    </div>
  );

  // 격려 메시지 컨텐츠 (배경 제거)
  const EncouragementContent = () => (
    <div className="absolute inset-0 flex items-center justify-center z-10">
      <motion.div 
        className="relative w-4/5"
        style={{ maxWidth: `calc(1024px * ${scale})` }}
        initial={{ opacity: 0, y: `calc(20px * ${scale})` }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <img 
          src={grandchildren} 
          alt="손자손녀" 
          className="absolute left-1/2 transform -translate-x-1/2 z-20"
          style={{
            top: `calc(-144px * ${scale})`,
            width: `calc(288px * ${scale})`,
            height: 'auto'
          }}
        />
        
        <div 
          className="bg-white bg-opacity-80 border-green-600 rounded-xl w-full text-center"
          style={{
            borderWidth: `calc(8px * ${scale})`,
            borderRadius: `calc(12px * ${scale})`,
            padding: `calc(64px * ${scale})`,
            paddingTop: `calc(80px * ${scale})`
          }}
        >
          <p 
            className="font-extrabold text-black"
            style={{ fontSize: `calc(4xl * ${scale})` }}
          >
            무엇보다 할아버지가 제일 소중해요!<br />
            조심히 다녀오세요!
          </p>
        </div>
      </motion.div>
    </div>
  );

  // 네비게이션 버튼 컴포넌트
  const NavigationButtons = () => {
    const handleBackToScenarios = () => {
      navigate('/scenarios');
    };

    return (
      <>
        {step === 'mission' && (
          <BackButton onClick={handleBackToScenarios} />
        )}
        
        {step === 'encouragement' && (
          <img
            src={homeButton}
            alt="홈으로"
            onClick={handleGoHome}
            className="absolute z-20 cursor-pointer active:scale-90 transition-transform duration-150"
            style={{
              top: `calc(16px * ${scale})`,
              right: `calc(16px * ${scale})`,
              width: `calc(64px * ${scale})`,
              height: `calc(64px * ${scale})`
            }}
          />
        )}
      </>
    );
  };

  return (
    <div className="relative w-full h-full">
      <NavigationButtons />
      
      {/* 공통 배경 - 항상 유지 */}
      <div className="absolute inset-0">
        {step === 'mission' ? (
          <img
            src="/assets/images/background.png"
            alt="미션 배경"
            className="absolute inset-0 w-full h-full object-cover z-0"
          />
        ) : (
          <img 
            src={scenario1FullMap} 
            alt="경로 지도" 
            className="w-full h-full object-cover"
          />
        )}
      </div>
      
      {/* opacity 오버레이 - map 이후 단계에서만 표시 */}
      {(step === 'map' && showMessage) || 
       step === 'mapToEncouragement' || 
       step === 'letterMessage' || 
       step === 'encouragement' ? (
        <motion.div 
          className="absolute inset-0 bg-[#FFF9C4]/60 z-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        />
      ) : null}
      
      {/* 단계별 컨텐츠 */}
      {step === 'mission' && <MissionContent />}
      {step === 'map' && <MapContent />}
      {step === 'mapToEncouragement' && <MapToEncouragementContent />}
      {step === 'letterMessage' && <LetterMessageContent />}
      {step === 'encouragement' && <EncouragementContent />}
      
      {/* 버튼 렌더링 - 일관된 위치로 수정 */}
      {(step === 'mission' || 
        (step === 'map' && showMessage) || 
        step === 'encouragement') && (
        <div 
          className="absolute left-0 right-0 flex justify-center items-center z-50"
          style={{ bottom: `calc(48px * ${scale})` }}
        >
          <img
            src={step === 'encouragement' ? departButton : nextButton}
            alt={step === 'encouragement' ? '출발하기' : '다음'}
            onClick={step === 'encouragement' ? handleDepartClick : handleNextStep}
            className="h-auto cursor-pointer hover:scale-105 transition-transform"
            style={{ width: `calc(192px * ${scale})` }}
          />
        </div>
      )}
    </div>
  );
};

export default ProloguePage;