// src/pages/prologue/ProloguePage.tsx (간소화된 버전)
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

// import { createGuestUser } from '../../services/endpoints/user';
import { createSession } from '../../services/endpoints/session';

import { useScale } from '../../hooks/useScale';

import { audioManager } from '../../utils/audioManager';

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

// 프롤로그 단계 정의 (간소화)
type PrologueStep = 'mission' | 'map' | 'letterMessage' | 'encouragement';

const ProloguePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const scale = useScale();
  const [step, setStep] = useState<PrologueStep>('mission');
  const [scenarioId, setScenarioId] = useState<string | null>(null);
  const [showMessage, setShowMessage] = useState(false);
  
  // URL 쿼리 파라미터에서 시나리오 ID 가져오기
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const id = searchParams.get('scenario');
    setScenarioId(id);
    console.log("id : ", id);

    // map 단계에서 2초 후 메시지 표시
    if (step === 'map') {
      const timer = setTimeout(() => {
        //약도 문구 효과음
        audioManager.playSound('mapGuide', 0.7);
        setShowMessage(true);
      }, 2000);
      
      return () => clearTimeout(timer);
    }

    // letterMessage 단계에서 3초 후 encouragement로 자동 전환
    if (step === 'letterMessage') {
      audioManager.playMessageAlarm();
      const timer = setTimeout(() => {
        setStep('encouragement');
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [location, step]);

  //미션 제공 효과음
  useEffect(() => {
    if (step === 'mission') {
      audioManager.playSound('missionGuide', 0.7);
    }
  },[step]);

  useEffect(() =>{
    // const alreadyHasUser = localStorage.getItem("user_id");
    const alreadyHasSession = localStorage.getItem("session_id");
    const vid = localStorage.getItem("village_id");
    // console.log("(O) user_id : ", alreadyHasUser);
    console.log("(O) session_id : ", alreadyHasSession);
    // 한 번만 생성
    if (!alreadyHasSession) {
      createSession(vid!)
      .then((sessionRes) => {
        const sessionId = sessionRes.data.session_id;
        localStorage.setItem("session_id", sessionId);
        console.log("✅ 세션 생성 완료", { sessionId });
      })
      .catch((err) => {
        console.error("❌ 세션 생성 실패", err);
      });
    }
  }, []);

  // 다음 단계로 이동 핸들러
  const handleNextStep = () => {
    if (step === 'mission') {
      setStep('map');
    } else if (step === 'map' && showMessage) {
      setStep('letterMessage');
    }
  };

  // 홈으로 이동 핸들러
  const handleGoHome = () => {
    navigate('/');
  };

  // 주행 준비 페이지로 이동
  const handleDepartClick = () => {
    //기본 알림음
    audioManager.playSound('etcSound', 0.5);

    console.log("ProloguePage - 출발하기 버튼 클릭: 주행 준비 페이지로 이동", { scenarioId });
    navigate(`/driving-prep?scenario=${scenarioId}&nextQuest=1`);
  };

  // 미션 소개 컨텐츠
  const MissionContent = () => (
    <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
      <h1 
        className="text-green-600 font-black animate-[fadeIn_800ms_ease-out]"
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
          className="text-center text-white font-black"
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

  // 맵 + 안내 메시지 컨텐츠
  const MapContent = () => (
    <>
      {showMessage && (
        <div className="absolute inset-0 flex items-center justify-center z-20">
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
                  className="text-black font-black"
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

  // 편지 메시지 컨텐츠
  const LetterMessageContent = () => (
  <div className="absolute inset-0 flex items-center justify-center z-20">
    <div className="flex flex-col items-center justify-center">
      {/* 응원 메시지 타이틀 */}
      <motion.div
        initial={{ opacity: 0, y: `calc(-40px * ${scale})` }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        
        style={{
          marginBottom: `calc(-80px * ${scale})`,
          padding: `calc(20px * ${scale})`,
          borderRadius: `calc(20px * ${scale})`
        }}
      >
        <GameTitle text="응원 메시지가 도착했어요!" fontSize="text-5xl" strokeWidth="8px" />
      </motion.div>
      
      {/* 편지 봉투 애니메이션 - 중앙 정렬 수정 */}
      <motion.div
        className="flex items-center justify-center"
        style={{
          width: `calc(520px * ${scale})`,
          height: `calc(520px * ${scale})`,
        }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
      >
        <motion.img
          src={letterEnvelope}
          alt="편지 봉투"
          className="object-contain"
          style={{
            width: `calc(720px * ${scale})`,
            height: 'auto'
          }}
          initial={{ rotate: -5 }}
          animate={{ 
            scale: [1, 1.1, 0.9, 1], 
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
      </motion.div>
    </div>
  </div>
);

  // 격려 메시지 컨텐츠
  const EncouragementContent = () => (
    <div className="absolute inset-0 flex items-center justify-center z-20">
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
            top: `calc(-168px * ${scale})`,
            width: `calc(380px * ${scale})`,
            height: 'auto'
          }}
        />
        
        <div 
          className="bg-white bg-opacity-90 border-green-600 rounded-xl w-full text-center"
          style={{
            borderWidth: `calc(8px * ${scale})`,
            borderRadius: `calc(36px * ${scale})`,
            padding: `calc(64px * ${scale})`,
            paddingTop: `calc(80px * ${scale})`
          }}
        >
          <p 
            className="font-black text-black"
            style={{ fontSize: `${2.6 * scale}rem` }}
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
    const handleBackToCharacterSelect = () => {
      navigate('/character-select');
    };

    return (
      <>
        {step === 'mission' && (
          <BackButton onClick={handleBackToCharacterSelect} />
        )}
      </>
    );
  };

  return (
    <div className="relative w-full h-full">
      <NavigationButtons />
      
      {/* 배경 이미지 */}
      <div className="absolute inset-0">
          {step === 'mission' ? (
            <img
              src="/assets/images/background.png"
              alt="미션 배경"
              className="absolute inset-0 w-full h-full object-cover z-0"
            />
          ) : (
            <motion.img 
              src={scenario1FullMap} 
              alt="경로 지도" 
              className="w-full h-full object-cover"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
            />
          )}
        </div>
      
      {/* 노란색 오버레이 - map에서 메시지 표시 시와 encouragement에서만 */}
      {((step === 'map' && showMessage) || step === 'letterMessage' || step === 'encouragement') && (
        <motion.div 
          className="absolute inset-0 bg-[#FFF9C4]/60 z-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        />
      )}
      
      {/* 단계별 컨텐츠 */}
      {step === 'mission' && <MissionContent />}
      {step === 'map' && <MapContent />}
      {step === 'letterMessage' && <LetterMessageContent />}
      {step === 'encouragement' && <EncouragementContent />}
      
      {/* 버튼 렌더링 - 모든 단계에서 동일한 위치와 크기 */}
      {(step === 'mission' || 
        (step === 'map' && showMessage) || 
        step === 'encouragement') && (
        <div 
          className="absolute left-0 right-0 flex justify-center items-center z-50"
          style={{ 
            bottom: step === 'encouragement' ? `calc(-20px * ${scale})` : `calc(48px * ${scale})` 
          }}
        >
          <img
            src={step === 'encouragement' ? departButton : nextButton}
            alt={step === 'encouragement' ? '출발하기' : '다음'}
            onClick={step === 'encouragement' ? handleDepartClick : handleNextStep}
            className="h-auto cursor-pointer hover:scale-105 transition-transform"
            style={{ 
              width: step === 'encouragement' ? `calc(240px * ${scale})` : `calc(192px * ${scale})` 
            }}
          />
        </div>
      )}
    </div>
  );
};

export default ProloguePage;