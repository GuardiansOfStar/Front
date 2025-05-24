// src/pages/quest/ReturnQuest.tsx
import { useState, useEffect, useRef, useCallback } from 'react';
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
  const clocksRef = useRef<HTMLDivElement>(null);
  const dragButtonRef = useRef<HTMLImageElement>(null);
  
  const [scenarioId, setScenarioId] = useState<string | null>(null);
  const [questId, setQuestId] = useState<string | null>(null);
  const [gamePhase, setGamePhase] = useState<GamePhase>('sunsetAnimation');
  const [selectedHour, setSelectedHour] = useState(7); // 기본값 7시
  const [showSun, setShowSun] = useState(false);
  const [showTitle, setShowTitle] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [hideSuccessImages, setHideSuccessImages] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  
  // 드래그 관련 상태
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragButtonPosition, setDragButtonPosition] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // URL 쿼리 파라미터 처리
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const sId = searchParams.get('scenario');
    const qId = searchParams.get('quest');
    setScenarioId(sId);
    setQuestId(qId || '5');
  }, [location]);

  // 드래그 버튼 초기 위치 계산
  useEffect(() => {
    if (gamePhase === 'gamePlay' && clocksRef.current) {
      updateDragButtonPosition(selectedHour);
    }
  }, [gamePhase, selectedHour]);

  // 드래그 버튼 위치 업데이트 함수
  const updateDragButtonPosition = useCallback((hour: number) => {
    if (!clocksRef.current) return;
    
    const clocksWidth = clocksRef.current.offsetWidth;
    const buttonWidth = 81; // drag_button.png 너비
    
    // 좌우 여백을 더 크게 설정하여 버튼이 화면 끝에 붙지 않도록 함
    const sideMargin = clocksWidth * 0.1; // 전체 너비의 10%씩 좌우 여백
    const availableWidth = clocksWidth - (sideMargin * 2);
    
    // 5시~9시까지 5개 구간으로 나누어 위치 계산
    const hourIndex = hour - 5; // 0~4 인덱스
    const position = sideMargin + (availableWidth * hourIndex / 4);
    
    setDragButtonPosition(position);
  }, []);

  // 위치로부터 시간 계산 함수
  const calculateHourFromPosition = useCallback((position: number): number => {
    if (!clocksRef.current) return 7;
    
    const clocksWidth = clocksRef.current.offsetWidth;
    const sideMargin = clocksWidth * 0.1; // 좌우 여백
    const availableWidth = clocksWidth - (sideMargin * 2);
    
    // 위치를 0~1 비율로 변환
    const ratio = Math.max(0, Math.min(1, (position - sideMargin) / availableWidth));
    
    // 비율을 5~9시 범위로 변환
    const exactHour = 5 + (ratio * 4);
    
    // 가장 가까운 정수 시간으로 반올림
    return Math.round(exactHour);
  }, []);

  // 드래그 시작 핸들러
  const handleDragStart = useCallback((clientX: number) => {
    if (isAnimating) return;
    
    setIsDragging(true);
    setDragStartX(clientX - dragButtonPosition);
  }, [dragButtonPosition, isAnimating]);

  // 드래그 중 핸들러
  const handleDragMove = useCallback((clientX: number) => {
    if (!isDragging || !clocksRef.current) return;
    
    const clocksWidth = clocksRef.current.offsetWidth;
    const sideMargin = clocksWidth * 0.1; // 좌우 여백
    
    let newPosition = clientX - dragStartX;
    
    // 드래그 범위 제한 - 여백을 고려한 범위로 제한
    newPosition = Math.max(sideMargin, Math.min(clocksWidth - sideMargin, newPosition));
    
    setDragButtonPosition(newPosition);
    
    // 실시간으로 시간 업데이트 (스냅 없이)
    const newHour = calculateHourFromPosition(newPosition);
    if (newHour !== selectedHour) {
      setSelectedHour(newHour);
    }
  }, [isDragging, dragStartX, selectedHour, calculateHourFromPosition]);

  // 드래그 종료 핸들러
  const handleDragEnd = useCallback(() => {
    if (!isDragging) return;
    
    setIsDragging(false);
    setIsAnimating(true);
    
    // 가장 가까운 시간으로 스냅
    const targetHour = calculateHourFromPosition(dragButtonPosition);
    setSelectedHour(targetHour);
    
    // 애니메이션과 함께 정확한 위치로 이동
    setTimeout(() => {
      updateDragButtonPosition(targetHour);
      setTimeout(() => setIsAnimating(false), 300);
    }, 50);
  }, [isDragging, dragButtonPosition, calculateHourFromPosition, updateDragButtonPosition]);

  // 마우스 이벤트 핸들러
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    handleDragStart(e.clientX);
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    handleDragMove(e.clientX);
  }, [handleDragMove]);

  const handleMouseUp = useCallback(() => {
    handleDragEnd();
  }, [handleDragEnd]);

  // 터치 이벤트 핸들러
  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    const touch = e.touches[0];
    handleDragStart(touch.clientX);
  };

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (e.touches.length > 0) {
      const touch = e.touches[0];
      handleDragMove(touch.clientX);
    }
  }, [handleDragMove]);

  const handleTouchEnd = useCallback(() => {
    handleDragEnd();
  }, [handleDragEnd]);

  // 글로벌 이벤트 리스너 등록/해제
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleTouchEnd);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove, handleTouchEnd]);

  // 단계별 자동 진행
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    
    if (gamePhase === 'sunsetAnimation') {
      timer = setTimeout(() => {
        setShowSun(true);
      }, 100);
      
      const titleTimer = setTimeout(() => {
        setShowTitle(true);
      }, 4000);
      
      const nextTimer = setTimeout(() => {
        setGamePhase('gameIntro');
      }, 6000);
      
      return () => {
        if (timer) clearTimeout(timer);
        clearTimeout(titleTimer);
        clearTimeout(nextTimer);
      };
    }
    else if (gamePhase === 'successResult') {
      timer = setTimeout(() => {
        // 먼저 이미지들을 숨김
        setHideSuccessImages(true);

        // 이미지가 사라진 후 메시지 표시
        const messageTimer = setTimeout(() => {
          setShowSuccessMessage(true);

          // 메시지 표시 후 점수 화면으로 이동
          const scoreTimer = setTimeout(() => {
            navigate(`/score?scenario=${scenarioId}&quest=${questId}&score=20&correct=true`);
          }, 5000);

          return () => clearTimeout(scoreTimer);
        }, 1000); // 이미지 사라지는 애니메이션 시가

        return () => clearTimeout(messageTimer);
      }, 3000); // 이미지 표시 시간을 3초로 단축
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

      {gamePhase === 'gameIntro' && (
        <div className="absolute top-6 right-6 z-[100] w-20 h-20">
          <HomeButton />
        </div>
      )}

      {/* 해가 지는 애니메이션 */}
      {gamePhase === 'sunsetAnimation' && (
        <div className="absolute inset-0">
          <img
            src={sunsetSceneMountain}
            alt="산"
            className="absolute bottom-0 w-full h-auto z-10"
            style={{ objectFit: 'cover', objectPosition: 'bottom' }}
          />
          
          <div className="absolute inset-0 flex items-center justify-center z-0">
            <motion.img
              src={sunsetSceneSun}
              alt="해"
              className="w-256 h-256"
              initial={{ 
                x: 400,
                y: -100
              }}
              animate={showSun ? { 
                x: 0,
                y: 80
              } : {}}
              transition={{ duration: 3, ease: 'easeOut' }}
            />
          </div>
          
          {showTitle && (
            <motion.div 
              className="absolute top-20 left-0 right-0 flex justify-center items-center z-20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: 'easeOut' }}
            >
              <GameTitle text="해가 지고 있어요" fontSize="text-[5.2rem]" strokeWidth="12px" />
            </motion.div>
          )}
        </div>
      )}

      {/* 게임 안내 화면 */}
      {gamePhase === 'gameIntro' && (
        <div className="absolute inset-0">
          <img
            src={sunsetSceneMountain}
            alt="산"
            className="absolute bottom-0 w-full h-auto z-10"
            style={{ objectFit: 'cover', objectPosition: 'bottom' }}
          />
          
          <div className="absolute inset-0 flex items-center justify-center z-0">
            <img
              src={sunsetSceneSun}
              alt="해"
              className="w-256 h-256"
              style={{
                transform: 'translate(0px, 80px)'
              }}
            />
          </div>
          
          <motion.div 
            className="absolute inset-0 bg-[#FFF9C4]/60 z-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          />
          
          <motion.div 
            className="absolute inset-0 flex flex-col items-center justify-center z-30"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            <div className="relative w-4/5 max-w-4xl">
              <div className="mb-8 flex justify-center items-center">
                <GameTitle text="귀가 시간 정하기" fontSize="text-6xl" strokeWidth="10px" />
              </div>
              
              <div className="bg-white/90 border-8 border-green-600 rounded-xl p-10 mb-16 text-center">
                <p className="text-4xl font-extrabold text-black leading-loose">
                  해가 지기 시작해요<br/>
                  <span className="text-red-600">언제쯤</span><br/>
                  작업을 마치고 집으로 출발할까요?
                </p>
              </div>
            </div>
          </motion.div>
          
          <div className="absolute -bottom-4 left-0 right-0 flex justify-center z-50">
            <img
              src={nextButton}
              alt="다음"
              onClick={handleNextPhase}
              className="w-52 h-auto cursor-pointer hover:scale-105 transition-transform"
            />
          </div>
        </div>
      )}

      {/* 게임 플레이 화면 - 드래그 기능 개선 */}
      {gamePhase === 'gamePlay' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {/* 배경 이미지 */}
          <img
            src={homecomingTimeSettingBackground}
            alt="귀가시간 설정 배경"
            className="absolute inset-0 w-full h-full object-cover z-0"
          />

          {/* 확인 버튼 */}
          <div className="flex justify-center mt-20 z-20">
            <button
              onClick={handleStartGame}
              disabled={isDragging || isAnimating}
              className="bg-green-600 hover:bg-green-700 text-white font-extrabold py-4 px-8 rounded-xl text-2xl transition-colors duration-300 border-4 border-green-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              {selectedHour}시에 출발하기
            </button>
          </div>
          
          {/* 시계 드래그 영역 - 하단 중앙 고정 */}
          <div className="absolute bottom-0 left-0 right-0 w-full z-10">
            {/* 시계 컨테이너 */}
            <div 
              ref={clocksRef}
              className="relative w-full"
            >
              {/* 시계 배경 이미지 - 반응형 */}
              <img
                src={homecomingTimeClocks}
                alt="시계들"
                className="w-full h-auto object-cover"
                style={{ 
                  aspectRatio: '976/215'
                }}
              />
              
              {/* 드래그 버튼 */}
              <img
                ref={dragButtonRef}
                src={dragButton}
                alt="드래그 버튼"
                className={`absolute cursor-grab transition-all duration-300 select-none
                  ${isDragging ? 'cursor-grabbing scale-110' : 'hover:scale-105'}
                  ${isAnimating ? 'transition-all duration-300 ease-out' : ''}`}
                style={{
                  width: '81px',
                  height: '108px',
                  left: `${dragButtonPosition}px`,
                  top: '72%',
                  transform: 'translate(-50%, -50%)',
                  zIndex: 30,
                  filter: isDragging ? 'drop-shadow(0 8px 16px rgba(0,0,0,0.3))' : 'none'
                }}
                onMouseDown={handleMouseDown}
                onTouchStart={handleTouchStart}
                draggable={false}
              />
              
              {/* 투명 드래그 영역 - 전체 시계 영역에서 드래그 가능 */}
              <div
                className="absolute inset-0 cursor-grab active:cursor-grabbing"
                style={{ zIndex: 20 }}
                onMouseDown={handleMouseDown}
                onTouchStart={handleTouchStart}
              />
            </div>
          </div>
        </div>
      )}

      {/* 정답 결과 화면 */}
      {gamePhase === 'successResult' && !showSuccessMessage && (
        <div className="absolute inset-0 flex items-center justify-center">
          <img
            src={homecomingTimeSettingBackground}
            alt="배경"
            className="absolute inset-0 w-full h-full object-cover"
          />
          
          <motion.div
            className="absolute inset-0 bg-[#FFF9C4]/60 z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          />
          
          <div className="absolute inset-0 flex items-center justify-center z-20">
            <motion.img
              src={successCircle}
              alt="성공 원"
              className="absolute w-full h-full object-contain"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={hideSuccessImages ? { scale: 0.3, opacity: 0 } : { scale: 1, opacity: 1 }}
              transition={hideSuccessImages ? { duration: 0.8, ease: 'easeIn' } : { duration: 1, ease: 'easeOut' }}
            />
            
            <motion.img
              src={mission5SuccessGrandfather}
              alt="성공한 할아버지"
              className="absolute w-1/2 h-auto object-contain z-30"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={hideSuccessImages ? { scale: 0.5, opacity: 0 } : { scale: 1, opacity: 1 }}
              transition={hideSuccessImages ? { duration: 0.8, ease: 'easeIn' } : { duration: 1, delay: 0.3, ease: 'easeOut' }}
            />
          </div>
        </div>
      )}

      {gamePhase === 'successResult' && showSuccessMessage && (
        <div className="absolute inset-0">
          {/* 배경 유지 */}
          <img
            src={homecomingTimeSettingBackground}
            alt="배경"
            className="absolute inset-0 w-full h-full object-cover"
          />
          
          <div className="absolute inset-0 bg-[#FFF9C4]/60 z-10" />
          
          <div className="absolute inset-0 flex flex-col items-center justify-center z-30">
            <motion.div 
              className="absolute top-[20%] left-1/2 transform -translate-x-1/2"
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            >
              <GameTitle text="정답입니다!" fontSize="text-6xl" strokeWidth="12px" />
            </motion.div>
            
            <motion.div 
              className="mt-10 bg-green-600 bg-opacity-90 border-green-700 border-8 rounded-3xl p-8 w-[70%] mx-auto text-center relative"
              initial={{ opacity: 0, scale: 0.8, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
            >
              <p className="text-4xl font-extrabold text-white leading-relaxed">
                해가 지기 전이<br/>
                집 가기 딱 좋은 시간이에요
              </p>
              
              <motion.img
                src={starCharacter}
                alt="별별이"
                className="absolute bottom-[-80px] left-[-60px] w-[200px] z-40"
                initial={{ opacity: 0, x: -30, y: 10 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6, ease: 'easeOut' }}
              />
            </motion.div>
          </div>
        </div>
      )}

      {/* 오답 시퀀스들 (기존 코드와 동일) */}
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

      {gamePhase === 'failSequence3' && (
        <div className="absolute inset-0">
          <motion.img
            src={goraniFlash}
            alt="플래시"
            className="absolute inset-0 w-full h-full object-cover z-10"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          />
          
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

      {gamePhase === 'failResult' && (
        <div className="absolute inset-0">
          <img
            src={mission5FailGrandfather}
            alt="사고 배경"
            className="absolute inset-0 w-full h-full object-cover"
          />
          
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