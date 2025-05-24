// src/pages/quest/ReturnQuest.tsx
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import HomeButton from '../../components/ui/HomeButton';
import GameTitle from '../../components/ui/GameTitle';

// 이미지 임포트
const homecomingTimeSettingBackground = '/assets/images/homecoming_time_setting_tree_road.png';
const homecomingTimeClocks = '/assets/images/homecoming_time_clocks.png';
const dragButton = '/assets/images/drag_button.png';
const sunsetSceneMountain = '/assets/images/sunset_scene_mountain.png';
const sunsetSceneSun = '/assets/images/sunset_scene_sun.png';
const mission5SuccessGrandfather = '/assets/images/mission5_success_grandfather.png';
const mission5FailGrandfather = '/assets/images/mission5_fail_grandfather.png';
const missionFailEveningDriving = '/assets/images/mission_fail_evening_driving_grandfather.png';
const blurredVision = '/assets/images/blurred_vision.png';
const goraniFlash = '/assets/images/gorani_flash.png';
const goraniFace = '/assets/images/gorani_face.png';
const dangerWarning = '/assets/images/danger_warning.png';
const successCircle = '/assets/images/success_circle.png';
const starCharacter = '/assets/images/star_character.png';
const nextButton = '/assets/images/next_button.png';

// 게임 단계 정의
type GamePhase = 
  | 'sunsetAnimation'     // 해가 지는 애니메이션
  | 'gameIntro'          // 귀가시간 정하기 게임 안내
  | 'gamePlay'           // 귀가시간 정하기 게임
  | 'successResult'      // 정답 결과 (5~7시)
  | 'successMessage'     // 정답 메시지
  | 'failSequence1'      // 오답 시퀀스 1 (야간 운전)
  | 'failSequence2'      // 오답 시퀀스 2 (시야 흐림)
  | 'failSequence3'      // 오답 시퀀스 3 (고라니 등장)
  | 'failSequence4'      // 오답 시퀀스 4 (사고)
  | 'failResult'         // 오답 결과 화면
  | 'score';             // 점수 화면

// 시간별 배경색 정의
const getBackgroundColor = (hour: number): string => {
  switch(hour) {
    case 5: return 'linear-gradient(to bottom, #87CEEB 0%, #B0E0E6 100%)'; // 밝은 하늘색
    case 6: return 'linear-gradient(to bottom, #FFE4B5 0%, #FFA07A 100%)'; // 연한 노을색
    case 7: return 'linear-gradient(to bottom, #FF6347 0%, #FF4500 100%)'; // 노을색
    case 8: return 'linear-gradient(to bottom, #4B0082 0%, #2F4F4F 100%)'; // 어둑한 색
    case 9: return 'linear-gradient(to bottom, #191970 0%, #000000 100%)'; // 어두운 색
    default: return 'linear-gradient(to bottom, #FF6347 0%, #FF4500 100%)';
  }
};

const ReturnQuest = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [scenarioId, setScenarioId] = useState<string | null>(null);
  const [questId, setQuestId] = useState<string | null>(null);
  const [gamePhase, setGamePhase] = useState<GamePhase>('sunsetAnimation');
  const [selectedHour, setSelectedHour] = useState(7); // 기본값 7시
  const [showSun, setShowSun] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [currentFailSequence, setCurrentFailSequence] = useState(1);

  // URL 쿼리 파라미터 처리
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const sId = searchParams.get('scenario');
    const qId = searchParams.get('quest');
    setScenarioId(sId);
    setQuestId(qId || '5');
  }, [location]);

  // 단계별 자동 진행
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    
    if (gamePhase === 'sunsetAnimation') {
      // 해 애니메이션 시작
      timer = setTimeout(() => {
        setShowSun(true);
      }, 1000);
      
      // 게임 안내로 전환
      const nextTimer = setTimeout(() => {
        setGamePhase('gameIntro');
      }, 4000);
      
      return () => {
        if (timer) clearTimeout(timer);
        clearTimeout(nextTimer);
      };
    }
    else if (gamePhase === 'successResult') {
      timer = setTimeout(() => {
        setShowSuccessMessage(true);
        
        // 점수 화면으로 이동
        const scoreTimer = setTimeout(() => {
          navigate(`/score?scenario=${scenarioId}&quest=${questId}&score=20&correct=true`);
        }, 5000);
        
        return () => clearTimeout(scoreTimer);
      }, 4000);
    }
    else if (gamePhase === 'failSequence1') {
      timer = setTimeout(() => {
        setGamePhase('failSequence2');
      }, 3000);
    }
    else if (gamePhase === 'failSequence2') {
      timer = setTimeout(() => {
        setGamePhase('failSequence3');
      }, 2000);
    }
    else if (gamePhase === 'failSequence3') {
      timer = setTimeout(() => {
        setGamePhase('failSequence4');
      }, 3000);
    }
    else if (gamePhase === 'failSequence4') {
      timer = setTimeout(() => {
        setGamePhase('failResult');
      }, 3000);
    }
    else if (gamePhase === 'failResult') {
      timer = setTimeout(() => {
        setShowWarning(true);
      }, 2000);
      
      // 점수 화면으로 이동
      const scoreTimer = setTimeout(() => {
        navigate(`/score?scenario=${scenarioId}&quest=${questId}&score=10&correct=false`);
      }, 8000);
      
      return () => {
        if (timer) clearTimeout(timer);
        clearTimeout(scoreTimer);
      };
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [gamePhase, navigate, scenarioId, questId]);

  // 시간 선택 핸들러
  const handleTimeSelect = (hour: number) => {
    setSelectedHour(hour);
  };

  // 게임 시작 핸들러
  const handleStartGame = () => {
    if (selectedHour >= 5 && selectedHour <= 7) {
      setGamePhase('successResult');
    } else {
      setGamePhase('failSequence1');
    }
  };

  // 다음 단계로 이동 핸들러
  const handleNextPhase = () => {
    if (gamePhase === 'gameIntro') {
      setGamePhase('gamePlay');
    }
  };

  // 홈으로 이동 핸들러
  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* 동적 배경색 */}
      <div 
        className="absolute inset-0 transition-all duration-1000 ease-in-out"
        style={{ 
          background: gamePhase === 'gamePlay' ? getBackgroundColor(selectedHour) : 
                     gamePhase === 'successResult' ? getBackgroundColor(selectedHour) :
                     'linear-gradient(to bottom, #FFE4B5 0%, #FFA07A 100%)'
        }}
      />

      {/* 헤더 영역 */}
      {!gamePhase.includes('failSequence') && gamePhase !== 'failResult' && (
        <HomeButton />
      )}

      {/* 해가 지는 애니메이션 */}
      {gamePhase === 'sunsetAnimation' && (
        <div className="absolute inset-0">
          {/* 산 이미지 - 하단 고정 */}
          <img
            src={sunsetSceneMountain}
            alt="산"
            className="absolute bottom-0 w-full h-auto"
            style={{ objectFit: 'cover', objectPosition: 'bottom' }}
          />
          
          {/* 해 이미지 - 애니메이션 */}
          <motion.img
            src={sunsetSceneSun}
            alt="해"
            className="absolute w-auto h-auto"
            style={{ width: '632px', height: '627px' }}
            initial={{ x: window.innerWidth, y: -200 }}
            animate={showSun ? { 
              x: window.innerWidth * 0.7 - 316, // 중앙보다 약간 오른쪽
              y: window.innerHeight * 0.3 - 313 // 산 위쪽
            } : {}}
            transition={{ duration: 3, ease: 'easeOut' }}
          />
          
          {/* 타이틀 */}
          <div className="absolute top-20 left-1/2 transform -translate-x-1/2 z-20">
            <GameTitle text="해가 지고 있어요" fontSize="text-6xl" strokeWidth="12px" />
          </div>
        </div>
      )}

      {/* 게임 안내 화면 */}
      {gamePhase === 'gameIntro' && (
        <div className="absolute inset-0">
          {/* 배경 오버레이 */}
          <div className="absolute inset-0 bg-[#FFF9C4]/60 z-10"></div>
          
          <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
            <div className="relative w-4/5 max-w-4xl">
              <div className="mb-8">
                <GameTitle text="귀가 시간 정하기" fontSize="text-5xl" strokeWidth="10px" />
              </div>
              
              <div className="bg-white/90 border-8 border-green-600 rounded-xl p-8 text-center">
                <p className="text-4xl font-extrabold text-black">
                  해가 지기 시작해요<br/>
                  <span className="text-red-600">언제쯤</span><br/>
                  작업을 마치고 집으로 출발할까요?
                </p>
              </div>
            </div>
          </div>
          
          {/* 다음 버튼 */}
          <div className="absolute bottom-0 left-0 right-0 flex justify-center z-50">
            <img
              src={nextButton}
              alt="다음"
              onClick={handleNextPhase}
              className="w-52 h-auto cursor-pointer hover:scale-105 transition-transform"
            />
          </div>
        </div>
      )}

      {/* 게임 플레이 화면 */}
      {gamePhase === 'gamePlay' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {/* 배경 이미지 */}
          <img
            src={homecomingTimeSettingBackground}
            alt="귀가시간 설정 배경"
            className="absolute inset-0 w-full h-full object-cover z-0"
          />
          
          {/* 시계 선택 영역 - 하단 고정 */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
            {/* 시계 배경 */}
            <div className="relative">
              <img
                src={homecomingTimeClocks}
                alt="시계들"
                className="w-full h-auto"
                style={{ width: '976px', height: '215px' }}
              />
              
              {/* 드래그 버튼 */}
              <img
                src={dragButton}
                alt="선택 버튼"
                className="absolute cursor-pointer transition-all duration-300 hover:scale-110"
                style={{
                  width: '81px',
                  height: '108px',
                  left: `${20 + (selectedHour - 5) * 190}px`, // 5시부터 시작해서 190px씩 간격
                  top: '10px',
                  zIndex: 20
                }}
                onClick={() => {}} // 클릭 핸들러는 아래 투명 버튼들이 처리
              />
              
              {/* 투명 클릭 영역들 */}
              {[5, 6, 7, 8, 9].map((hour, index) => (
                <button
                  key={hour}
                  className="absolute bg-transparent cursor-pointer"
                  style={{
                    left: `${20 + index * 190}px`,
                    top: '10px',
                    width: '150px',
                    height: '195px',
                    zIndex: 15
                  }}
                  onClick={() => handleTimeSelect(hour)}
                />
              ))}
            </div>
            
            {/* 확인 버튼 */}
            <div className="flex justify-center mt-8">
              <button
                onClick={handleStartGame}
                className="bg-green-600 hover:bg-green-700 text-white font-extrabold py-4 px-8 rounded-xl text-2xl transition-colors duration-300 border-4 border-green-700"
              >
                {selectedHour}시에 출발하기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 정답 결과 화면 */}
      {gamePhase === 'successResult' && !showSuccessMessage && (
        <div className="absolute inset-0 flex items-center justify-center">
          {/* 배경 이미지 */}
          <img
            src={homecomingTimeSettingBackground}
            alt="배경"
            className="absolute inset-0 w-full h-full object-cover"
          />
          
          {/* 노란색 오버레이 */}
          <motion.div
            className="absolute inset-0 bg-[#FFF9C4]/60 z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          />
          
          {/* 성공 원과 캐릭터 */}
          <div className="absolute inset-0 flex items-center justify-center z-20">
            <motion.img
              src={successCircle}
              alt="성공 원"
              className="absolute w-full h-full object-contain"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
            
            <motion.img
              src={mission5SuccessGrandfather}
              alt="성공한 할아버지"
              className="absolute w-2/5 h-auto object-contain z-30"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
            />
          </div>
        </div>
      )}

      {/* 정답 메시지 화면 */}
      {gamePhase === 'successResult' && showSuccessMessage && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-30">
          {/* 정답입니다! 타이틀 */}
          <div className="absolute top-[20%] left-1/2 transform -translate-x-1/2">
            <GameTitle text="정답입니다!" fontSize="text-6xl" strokeWidth="12px" />
          </div>
          
          {/* 메시지 박스 */}
          <div className="mt-10 bg-green-600 bg-opacity-90 border-green-700 border-8 rounded-3xl p-8 w-[70%] mx-auto text-center relative">
            <p className="text-4xl font-extrabold text-white leading-relaxed">
              해가 지기 전이<br/>
              집 가기 딱 좋은 시간이에요
            </p>
            
            {/* 별별이 캐릭터 */}
            <img
              src={starCharacter}
              alt="별별이"
              className="absolute bottom-[-80px] left-[-60px] w-[200px] z-40"
            />
          </div>
        </div>
      )}

      {/* 오답 시퀀스 1 - 야간 운전 */}
      {gamePhase === 'failSequence1' && (
        <motion.img
          src={missionFailEveningDriving}
          alt="야간 운전"
          className="absolute inset-0 w-full h-full object-cover"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        />
      )}

      {/* 오답 시퀀스 2 - 시야 흐림 */}
      {gamePhase === 'failSequence2' && (
        <motion.img
          src={blurredVision}
          alt="시야 흐림"
          className="absolute inset-0 w-full h-full object-cover"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        />
      )}

      {/* 오답 시퀀스 3 - 고라니 등장 */}
      {gamePhase === 'failSequence3' && (
        <div className="absolute inset-0">
          {/* 플래시 효과 */}
          <motion.img
            src={goraniFlash}
            alt="플래시"
            className="absolute inset-0 w-full h-full object-cover z-10"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          />
          
          {/* 고라니 얼굴 */}
          <motion.img
            src={goraniFace}
            alt="고라니"
            className="absolute bottom-4 right-4 z-20"
            style={{ width: '500px', height: '500px' }}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          />
        </div>
      )}

      {/* 오답 시퀀스 4 - 사고 */}
      {gamePhase === 'failSequence4' && (
        <motion.img
          src={mission5FailGrandfather}
          alt="사고"
          className="absolute inset-0 w-full h-full object-cover"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        />
      )}

      {/* 오답 결과 화면 */}
      {gamePhase === 'failResult' && (
        <div className="absolute inset-0">
          <img
            src={mission5FailGrandfather}
            alt="사고 배경"
            className="absolute inset-0 w-full h-full object-cover"
          />
          
          {/* 경고 메시지 */}
          {showWarning && (
            <motion.div
              className="absolute inset-0 bg-[#FFF9C4]/60 flex flex-col items-center justify-end pb-32 z-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              <motion.img
                src={dangerWarning}
                alt="위험 경고"
                className="w-[16%] mb-4"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              />
              
              <motion.div
                className="w-[80%] bg-white bg-opacity-90 border-red-600 border-8 rounded-xl p-8 text-center"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <h2 className="text-6xl font-extrabold text-red-600 mb-4">
                  야생 동물과 부딪혀요!
                </h2>
                <p className="text-4xl font-extrabold text-black">
                  야간 주행 시 시야 확보가 어려워요<br/>
                  해가 지기 전에 집으로 돌아가요
                </p>
              </motion.div>
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
};

export default ReturnQuest;