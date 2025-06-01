// Front/src/pages/quest/MakgeolliQuest.tsx
import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import FieldRoadSliding from './FieldRoadSliding';
import { postQuestAttempt, AttemptPayload } from '../../services/endpoints/attempts';
import GameTitle from '../../components/ui/GameTitle';
import { useScale } from '../../hooks/useScale';
// import { useScore } from '../../context/ScoreContext';

// 이미지 임포트
const orchardWorkBackground = '/assets/images/mission3_working_screen.png';
const mealLadyBackground = '/assets/images/meal_lady_background.png';
const sparrow = '/assets/images/sparrow.png';
const mealLady = '/assets/images/meal_lady.png';
const makgeolliGameTray = '/assets/images/makgeolli_game_tray.png';
const makgeolliCup = '/assets/images/makgeolli_cup.png';
const kimchi = '/assets/images/kimchi.png';
const noodles = '/assets/images/noodles.png';
const makgeolli = '/assets/images/makgeolli.png';
const startButton = '/assets/images/start_button.png';
const mission3Success = '/assets/images/mission3_success.png';
const starCharacter = '/assets/images/star_character.png';
const nextButton = '/assets/images/next_button.png';
const confirmButton = '/assets/images/confirm_button.png';

// 파일 상단에 기준 해상도 상수 추가
const BASE_WIDTH = 1024;
const BASE_HEIGHT = 768;

// 게임 단계 정의
type GamePhase = 
  | 'roadToField' | 'fieldArrival' | 'working' | 'mealLadyArrival' | 'mealLadyIntro'
  | 'mealTray' | 'missionIntro' | 'options' | 'gameInstruction'
  |'gamePlay' | 'success' | 'timeOver' | 'score';

// 공통 위치 타입 정의 - 상대적 위치 비율 사용
interface ItemPosition {
  xRatio: number; // 화면 너비 대비 비율 (0~1)
  yRatio: number; // 화면 높이 대비 비율 (0~1)
  rotation: number;
  scale: number;
  zIndex: number;
}

// 막걸리 아이템 인터페이스
interface MakgeolliItem {
  id: number;
  position: ItemPosition;
  found: boolean;
  type: 'makgeolli' | 'noodles' | 'kimchi';
}

// 트레이 아이템 인터페이스
interface TrayItem {
  id: number;
  position: ItemPosition;
  type: 'noodles' | 'kimchi' | 'bottle' | 'cup';
}

// 상수 - 트레이 아이템 위치 정의 (상대적 비율)
const TRAY_ITEM_POSITIONS: { type: TrayItem['type'], xRatio: number, yRatio: number, rotation: number, scale: number, zIndex: number }[] = [
  // 국수 3개
  { type: 'noodles', xRatio: 0.21, yRatio: 0.76, rotation: 0, scale: 2.4, zIndex: 6 },
  { type: 'noodles', xRatio: 0.43, yRatio: 0.63, rotation: 0, scale: 2.4, zIndex: 5 },
  { type: 'noodles', xRatio: 0.42, yRatio: 0.85, rotation: 0, scale: 2.4, zIndex: 8 },
  
  // 김치 2개
  { type: 'kimchi', xRatio: 0.61, yRatio: 0.71, rotation: 0, scale: 1.4, zIndex: 4 },
  { type: 'kimchi', xRatio: 0.66, yRatio: 0.80, rotation: 0, scale: 1.4, zIndex: 4 },
  
  // 막걸리 병과 잔
  { type: 'bottle', xRatio: 0.8, yRatio: 0.56, rotation: 0, scale: 2.4, zIndex: 5 },
  { type: 'cup', xRatio: 0.82, yRatio: 0.78, rotation: 0, scale: 1.6, zIndex: 6 },
];

// 상수 - 숨겨진 막걸리 위치 정의 (상대적 비율)
const HIDDEN_MAKGEOLLI_POSITIONS: { xRatio: number, yRatio: number, rotation: number, scale: number, zIndex: number }[] = [
  { xRatio: 0.8, yRatio: 0.56, rotation: -90, scale: 2.4, zIndex: 5 },
  { xRatio: 0.40, yRatio: 0.61, rotation: 0, scale: 2.4, zIndex: 7 },
  { xRatio: 0.23, yRatio: 0.76, rotation: -10, scale: 1.8, zIndex: 2 },
  { xRatio: 0.66, yRatio: 0.80, rotation: 15, scale: 2.0, zIndex: 3 },
  { xRatio: 0.85, yRatio: 0.35, rotation: 0, scale: 3.0, zIndex: 4 },
];

const MakgeolliQuest = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const trayContainerRef = useRef<HTMLDivElement>(null);

  const [scenarioId, setScenarioId] = useState<string | null>(null);
  const [questId, setQuestId] = useState<string | null>(null);
  const [gamePhase, setGamePhase] = useState<GamePhase>('roadToField');
  const [selectedOption, setSelectedOption] = useState<'A' | 'B' | null>(null);
  const [mealLadyOpacity, setMealLadyOpacity] = useState(0);
  const [makgeolliItems, setMakgeolliItems] = useState<MakgeolliItem[]>([]);
  const [trayItems, setTrayItems] = useState<TrayItem[]>([]);
  const [foundCount, setFoundCount] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(300); // 5분 = 300초
  const [gameScore, setGameScore] = useState(0);
  const [gameStartTime, setGameStartTime] = useState<number | null>(null);
  const [showTrayBackground, setShowTrayBackground] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  const scale = useScale();
  // const { updateQuestScore } = useScore();
  
  // URL 쿼리 파라미터 처리
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const sId = searchParams.get('scenario');
    const qId = searchParams.get('quest');
    setScenarioId(sId);
    setQuestId('3');
  }, [location]);

  // 단계별 자동 진행 - 스케일 적용된 타이밍
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    
    // 스케일에 따른 타이밍 조정 함수
    const getScaledDuration = (baseDuration: number) => {
      return baseDuration * Math.max(0.8, scale);
    };
    
    if (gamePhase === 'roadToField') {
      timer = setTimeout(() => {
        setGamePhase('fieldArrival');
      }, getScaledDuration(5000));
    }
    else if (gamePhase === 'fieldArrival') {
      timer = setTimeout(() => {
        setGamePhase('working');
      }, getScaledDuration(3000));
    }
    else if (gamePhase === 'working') {
      timer = setTimeout(() => {
        setGamePhase('mealLadyArrival');
      }, getScaledDuration(5000));
    }
    else if (gamePhase === 'mealLadyArrival') {
      const mealLadyAnimation = setInterval(() => {
        setMealLadyOpacity(prev => {
          if (prev >= 1) {
            clearInterval(mealLadyAnimation);
            return 1;
          }
          return prev + (0.05 * Math.min(1.5, scale)); // 스케일에 따른 애니메이션 속도 조정
        });
      }, getScaledDuration(1000));
      
      timer = setTimeout(() => {
        setGamePhase('mealLadyIntro');
      }, getScaledDuration(1500));
      
      return () => clearInterval(mealLadyAnimation);
    }
    else if (gamePhase === 'mealTray') {
      setShowTrayBackground(true);
      
      if (trayItems.length === 0) {
        initTrayItems();
      }
      
      timer = setTimeout(() => {
        setGamePhase('missionIntro');
      }, getScaledDuration(5000));
    }
    else if (gamePhase === 'missionIntro') {
      setShowTrayBackground(false);
    }
    else if (gamePhase === 'gamePlay') {
      setGameStartTime(Date.now());
      
      // 타이머 간격도 스케일 적용
      const timerInterval = 1000 / Math.max(0.8, scale);
      timerRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 0) {
            if (timerRef.current) clearInterval(timerRef.current);
            setGamePhase('timeOver');
            setGameScore(5);
            return 0;
          }
          return prev - 1;
        });
      }, timerInterval);
      
      return () => {
        if (timerRef.current) clearInterval(timerRef.current);
      };
    }
    else if (gamePhase === 'success' || gamePhase === 'timeOver') {
      setShowTrayBackground(false);
      
      if (gamePhase === 'success' && gameStartTime) {
        const elapsedTime = (Date.now() - gameStartTime) / 1000;
        
        let score = 0;
        if (elapsedTime <= 30) score = 20;
        else if (elapsedTime <= 60) score = 18;
        else if (elapsedTime <= 120) score = 15;
        else if (elapsedTime <= 180) score = 12;
        else if (elapsedTime <= 240) score = 10;
        else score = 8;
        
        setGameScore(score);
      }
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [gamePhase, navigate, scenarioId, questId, gameScore, gameStartTime, trayItems.length, scale]);

  // gamePhase가 mealTray일 때 trayItems 자동 초기화
  useEffect(() => {
    if (gamePhase === 'mealTray' && trayItems.length === 0) {
      console.log('mealTray 단계 자동 초기화');
      initTrayItems();
      setShowTrayBackground(true);
    }
  }, [gamePhase, trayItems.length]);

  useEffect(() => {
    if (gamePhase !== 'success' && gamePhase !== 'timeOver') return;

    const sessionId = localStorage.getItem('session_id')!;
    const elapsedTime = Math.floor((Date.now() - (gameStartTime ?? Date.now())) / 1000);

    let finalScore = 0;
    if (gamePhase === 'success' && gameStartTime) {
      const elapsed = (Date.now() - gameStartTime) / 1000;
      if (elapsed <= 30) finalScore = 20;
      else if (elapsed <= 60) finalScore = 18;
      else if (elapsed <= 120) finalScore = 15;
      else if (elapsed <= 180) finalScore = 12;
      else if (elapsed <= 240) finalScore = 10;
      else finalScore = 5;
    } else {
      finalScore = 5;
    }

    const payload: AttemptPayload = {
      attempt_number: 1,
      score_awarded: finalScore,
      selected_option: '',
      is_correct: gamePhase === 'success',
      response_time: elapsedTime,
    };

    postQuestAttempt(sessionId, "Makgeolli", payload)
      .then((res) => {
        console.log('✅ 시도 기록 완료:', res.data.attempt_id);
        // updateQuestScore("Makgeolli", finalScore);
      })
      .catch(err => console.error("❌ 시도 기록 실패", err));
  }, [gamePhase]);

  // 트레이 아이템 초기화 함수
  const initTrayItems = () => {
    const items: TrayItem[] = TRAY_ITEM_POSITIONS.map((pos, index) => ({
      id: Date.now() + index,
      position: {
        xRatio: pos.xRatio,
        yRatio: pos.yRatio,
        rotation: pos.rotation,
        scale: pos.scale,
        zIndex: pos.zIndex
      },
      type: pos.type
    }));
    
    setTrayItems(items);
  };

  const handleConfirmClick = () => {
    if (gamePhase === 'success' || gamePhase === 'timeOver') {
      navigate(`/score?scenario=${scenarioId}&quest=${questId}&score=${gameScore}&correct=true`);
    }
  };

  // 게임 초기화 함수
  const initializeGame = () => {
    const makgeolliItems = HIDDEN_MAKGEOLLI_POSITIONS.map((pos, index) => ({
      id: index,
      position: {
        xRatio: pos.xRatio,
        yRatio: pos.yRatio,
        rotation: pos.rotation,
        scale: pos.scale,
        zIndex: pos.zIndex
      },
      found: false,
      type: 'makgeolli' as const
    }));
    
    setMakgeolliItems(makgeolliItems);
    setFoundCount(0);
    setTimeRemaining(300);
    setGameScore(0);
  };

  // 배경 이미지 선택 함수
  const getBackground = () => {
    if (gamePhase === 'roadToField') {
      return '';
    }
    if (['fieldArrival'].includes(gamePhase)) {
      return '/assets/images/orchard_arrival_screen.png';
    }
    if (['working'].includes(gamePhase)) {
      return orchardWorkBackground;
    }
    if (['mealLadyArrival', 'mealLadyIntro'].includes(gamePhase)) {
      return mealLadyBackground;
    }
    if (['mealTray', 'missionIntro', 'options', 'gameInstruction', 'gamePlay'].includes(gamePhase)) {
      return makgeolliGameTray;
    }
    if (['success', 'timeOver'].includes(gamePhase)) {
      return mission3Success;
    }
    return orchardWorkBackground;
  };

  // 옵션 선택 핸들러
  const handleOptionSelect = (option: 'A' | 'B') => {
    setSelectedOption(option);
    setShowTrayBackground(false);
    
    setTimeout(() => {
      setGamePhase('gameInstruction');
    }, 300 * Math.max(0.8, scale)); // 스케일 적용
  };
  
  // 아이템 클릭 핸들러
  const handleItemClick = (id: number) => {
    const item = makgeolliItems.find(e => e.id === id);
    if (!item || item.found || item.type !== 'makgeolli') return;
    
    setMakgeolliItems(prev => prev.map(e => e.id === id ? {...e, found: true} : e));
    
    setFoundCount(count => {
      const newCount = count + 1;
      
      if (newCount === 5) {
        if (timerRef.current) clearInterval(timerRef.current);
        setGamePhase('success');
      }
      
      return newCount;
    });
  };

  // 다음 단계로 이동 핸들러
  const handleNextPhase = () => {
    if (gamePhase === 'mealLadyIntro') {
      initTrayItems();
      setGamePhase('mealTray');
    } else if (gamePhase === 'mealTray') {
      setGamePhase('missionIntro');
    } else if (gamePhase === 'gameInstruction') {
      initializeGame();
      setGamePhase('gamePlay');
    }
  };
  
  // 트레이 컨테이너 렌더링 함수
  const renderTrayContainer = (children: React.ReactNode, additionalClassNames = "") => (
    <div 
      ref={trayContainerRef}
      className={`relative w-full max-w-5xl mx-auto ${additionalClassNames}`}
      style={{ 
        aspectRatio: `${BASE_WIDTH}/${BASE_HEIGHT}`,
        overflow: 'hidden'
      }}
    >
      <img 
        src={makgeolliGameTray} 
        alt="트레이" 
        className="absolute inset-0 w-full h-full object-cover"
      />
      {children}
    </div>
  );
  
  return (
    <div className="relative w-full h-full">
      {/* 배경 */}
      {gamePhase === 'roadToField' ? (
        <FieldRoadSliding />
      ) : (
        <img
          src={getBackground()}
          alt="배경"
          className="absolute w-full h-full object-cover"
        />
      )}
      
      {/* 배경 오버레이 레이어 */}
      {(gamePhase === 'missionIntro' || gamePhase === 'gameInstruction' || gamePhase === 'gamePlay') && (
        <div className="absolute inset-0 bg-white bg-opacity-20 z-5"></div>
      )}
      
      {/* 헤더 영역 */}
      <div 
        className="absolute z-50"
        style={{
          top: `calc(16px * ${scale})`,
          right: `calc(16px * ${scale})`
        }}
      >
      </div>
      
      {/* 논밭 도착 화면 */}
      {gamePhase === 'fieldArrival' && (
        <div className="absolute inset-0 flex items-center justify-center">
          <GameTitle 
            text="과수원 도착" 
            fontSize={`calc(5rem * ${scale})`}
            strokeWidth={`calc(12px * ${scale})`}
          />
        </div>
      )}
      
      {/* 작업 중 화면 */}
      {gamePhase === 'working' && (
        <div className="absolute inset-0 flex items-center justify-center z-50">
          <div 
            className="bg-green-600/90 border-green-700 rounded-full text-center"
            style={{
              borderWidth: `calc(12px * ${scale})`,
              width: `calc(600px * ${scale})`,
              paddingLeft: `calc(48px * ${scale})`,
              paddingRight: `calc(48px * ${scale})`,
              paddingTop: `calc(16px * ${scale})`,
              paddingBottom: `calc(16px * ${scale})`
            }}
          >
            <h1 
              className="font-black text-white text-center tracking-wide"
              style={{ fontSize: `calc(6rem * ${scale})` }}
            >
              작업 중
            </h1>
          </div>
          
          {/* 참새 애니메이션 - 스케일 적용 */}
          <motion.img
            src={sparrow}
            alt="참새"
            className="absolute"
            style={{
              top: `calc(27% * ${scale})`,
              width: `calc(150px * ${scale})`,
              height: 'auto'
            }}
            initial={{ x: `calc(-150px * ${scale})` }}
            animate={{ 
              x: `calc(${(window.innerWidth + 150) * scale}px)`,
              y: [
                0, 
                `calc(-20px * ${scale})`, 
                `calc(10px * ${scale})`, 
                `calc(-15px * ${scale})`, 
                `calc(5px * ${scale})`, 
                0
              ],
              rotate: [0, 5, -3, 2, 0]
            }}
            transition={{
              x: { duration: 5 * Math.max(0.8, scale), ease: "easeInOut" },
              y: { duration: 2.5 * Math.max(0.8, scale), repeat: 1, ease: "easeInOut" },
              rotate: { duration: 2.5 * Math.max(0.8, scale), repeat: 1, ease: "easeInOut" }
            }}
          />
        </div>
      )}

      {/* 새참 아주머니 등장 화면 */}
      {gamePhase === 'mealLadyArrival' && (
        <div className="absolute inset-0">
          <div className="absolute inset-x-0 bottom-0 flex justify-center">
            <div 
              style={{
                transform: `scale(${1.7 * scale})`,
                transformOrigin: 'center bottom',
                height: '100vh', 
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'flex-end'
              }}
            >
              <img
                src={mealLady}
                alt="새참 아주머니"
                className="w-auto h-auto max-h-[120vh] object-contain object-bottom"
                style={{ 
                  marginBottom: '0',
                  animation: `slideUp ${1 * Math.max(0.8, scale)}s ease-out forwards`
                }}
              />
            </div>
          </div>
        </div>
      )}

      {gamePhase === 'mealLadyIntro' && (
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-x-0 bottom-0 flex justify-center">
            <div 
              style={{
                transform: `scale(${1.7 * scale})`,
                transformOrigin: 'center bottom',
                height: '100vh', 
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'flex-end'
              }}
            >
              <img
                src={mealLady}
                alt="새참 아주머니"
                className="w-auto h-auto max-h-[120vh] object-contain object-bottom"
              />
            </div>
          </div>

          <motion.div 
            className="absolute inset-0 flex justify-center z-20"
            style={{ 
              alignItems: 'flex-end',
              paddingBottom: `calc(140px * ${scale})`
            }}
            initial={{ opacity: 0, y: `calc(-50px * ${scale})`, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ 
              duration: 0.8 * Math.max(0.8, scale),
              delay: 0.3 * Math.max(0.8, scale),
              ease: "easeOut"
            }}
          >
            <motion.div 
              className="bg-white/90 border-8 border-[#0E8E12] text-center shadow-lg"
              style={{
                width: `calc(834px * ${scale})`,
                padding: `calc(28px * ${scale})`,
                borderRadius: `calc(48px * ${scale})`,
                borderWidth: `calc(12px * ${scale})`
              }}
              transition={{ duration: 0.2 }}
            >
              <motion.p 
                className="font-black text-[#0E8E12] tracking-wider"
                style={{ fontSize: `calc(3.2rem * ${scale})` }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ 
                  duration: 0.6 * Math.max(0.8, scale),
                  delay: 0.6 * Math.max(0.8, scale)
                }}
              >
                새참 가져왔어요<br />
                다들 먹고 하셔요!
              </motion.p>
            </motion.div>
          </motion.div>

          <motion.div 
            className="absolute left-0 right-0 flex justify-center z-50"
            style={{ bottom: `calc(24px * ${scale})` }}
            initial={{ opacity: 0, y: `calc(30px * ${scale})` }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.6 * Math.max(0.8, scale),
              delay: 1.2 * Math.max(0.8, scale),
              ease: "easeOut"
            }}
          >
            <motion.img
              src={nextButton}
              alt="다음"
              onClick={handleNextPhase}
              style={{
                width: `calc(208px * ${scale})`,
                height: 'auto'
              }}
              className="cursor-pointer"
              whileHover={{ 
                scale: 1.05,
                y: `calc(-2px * ${scale})`
              }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            />
          </motion.div>
        </div>
      )}

      {/* 식사 트레이 표시 화면 */}
      {gamePhase === 'mealTray' && (
        <div className="absolute inset-0 flex items-center justify-center">
          {renderTrayContainer(
            <>
              {/* 트레이 아이템들 */}
              {trayItems.map(item => {
                let itemSrc = '';
                switch (item.type) {
                  case 'noodles': itemSrc = noodles; break;
                  case 'kimchi': itemSrc = kimchi; break;
                  case 'bottle': itemSrc = makgeolli; break;
                  case 'cup': itemSrc = makgeolliCup; break;
                }
                
                const leftPercent = item.position.xRatio * 100;
                const topPercent = item.position.yRatio * 100;
                const sizePercent = item.position.scale * 15 * scale;

                return (
                  <img
                    key={item.id}
                    src={itemSrc}
                    alt={item.type}
                    className="absolute"
                    style={{
                      left: `${leftPercent}%`, 
                      top: `${topPercent}%`,
                      width: `${sizePercent}%`,
                      height: 'auto',
                      transform: `translate(-50%, -50%) rotate(${item.position.rotation}deg)`,
                      zIndex: item.position.zIndex
                    }}
                  />
                );
              })}
              
              {/* 텍스트 레이어 */}
              <div className="absolute left-0 right-0 flex items-center justify-center z-50" style={{ top: `calc(230px * ${scale})` }}>
                <GameTitle 
                  text="새참 먹는 시간" 
                  fontSize={`calc(96px * ${scale})`}
                  strokeWidth={`calc(12px * ${scale})`}
                />
              </div>
            </>
          )}
        </div>
      )}
      
      {/* 미션 소개 화면 */}
      {gamePhase === 'missionIntro' && (
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[#FFF9C4]/60 z-10"></div>
          
          <div 
            className="absolute inset-0 flex flex-col items-center justify-center z-10"
            style={{ top: `calc(0px * ${scale})` }}
          >
            {/* 제목을 박스 밖으로 이동하고 GameTitle 적용 */}
            <div style={{ marginBottom: `calc(24px * ${scale})` }}>
              <GameTitle 
                text="새참을 먹어요" 
                fontSize={`${scale * 56}px`}
                strokeWidth={`calc(10px * ${scale})`}
              />
            </div>
            
            {/* 선택지 설명 */}
            <div 
              className="bg-[#FFFAFA] bg-opacity-75 border-[#0DA429] rounded-[30px] flex flex-col justify-center items-center text-center"
              style={{
                width: `calc(735px * ${scale})`,
                height: `calc(280px * ${scale})`,
                borderWidth: `calc(10px * ${scale})`,
                padding: `calc(24px * ${scale})`,
                marginBottom: `calc(32px * ${scale})`
              }}
            >
              <p 
                className="font-black text-black leading-snug"
                style={{ fontSize: `calc(2.5rem * ${scale})` }}
              >
                저런! 새참에 <span style={{ color: '#B91C1C' }}>막걸리</span>가 있어요.<br/>
                작업이 끝나면 <span style={{ color: '#B91C1C' }}>운전해야 하는데</span>…<br/>
                어떡하죠?
              </p>
            </div>
            
            {/* 선택지 버튼 */}
            <div 
              className="flex justify-between"
              style={{
                width: `calc(750px * ${scale})`,
                gap: `calc(16px * ${scale})`
              }}
            >
              <button
                className={`rounded-[20px] font-black text-black transition duration-300 cursor-pointer flex items-center justify-center
                  ${selectedOption === 'A' ? 
                    'bg-[#0DA429] bg-opacity-90 border-[#0DA429] scale-105' : 
                    'bg-[#FFFAFA] bg-opacity-70 border-[#0DA429] hover:bg-opacity-90'}
                `}
                style={{
                  width: `calc(355px * ${scale})`,
                  height: `calc(208px * ${scale})`,
                  fontSize: `calc(2.1rem * ${scale})`,
                  borderWidth: `calc(7px * ${scale})`,
                  boxSizing: 'border-box'
                }}
                onClick={() => handleOptionSelect('A')}
                disabled={!!selectedOption}
              >
                <span className="text-center leading-tight">
                  작업중 <span style={{ color: '#B91C1C' }}>막걸리</span>는<br/>보약!<br/> <span style={{ color: '#B91C1C' }}>적당히 마신다</span>
                </span>
              </button>
              
              <button
                className={`rounded-[20px] font-black text-black transition duration-300 cursor-pointer flex items-center justify-center
                  ${selectedOption === 'B' ? 
                    'bg-[#0DA429] bg-opacity-90 border-[#0DA429] scale-105' : 
                    'bg-[#FFFAFA] bg-opacity-70 border-[#0DA429] hover:bg-opacity-90'}
                `}
                style={{
                  width: `calc(355px * ${scale})`,
                  height: `calc(208px * ${scale})`,
                  fontSize: `calc(2.1rem * ${scale})`,
                  borderWidth: `calc(7px * ${scale})`,
                  boxSizing: 'border-box'
                }}
                onClick={() => handleOptionSelect('B')}
                disabled={!!selectedOption}
              >
                <span className="text-center leading-tight">
                  운전해야 하니<br/>막걸리는<br/><span style={{ color: '#B91C1C' }}>마시지 않는다</span>
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 게임 안내 화면 */}
      {gamePhase === 'gameInstruction' && (
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[#FFF9C4]/60 z-5"></div>
          
          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-start z-20"
            style={{ paddingTop: `calc(80px * ${scale})` }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 * Math.max(0.8, scale) }}
          >
            <motion.div
              className="relative z-10 w-4/5 max-w-4xl flex flex-col items-center"
              initial={{ y: `calc(-20px * ${scale})` }}
              animate={{ y: 0 }}
              transition={{ duration: 0.8 * Math.max(0.8, scale) }}
            >
              <GameTitle 
                text="새참 속 막걸리 치우기" 
                fontSize={`calc(64px * ${scale})`}
                strokeWidth={`calc(10px * ${scale})`}
              />
              <div 
                className="bg-white/80 border-8 border-green-600 w-full text-center"
                style={{ 
                  borderRadius: `calc(48px * ${scale})`,
                  paddingLeft: `calc(12px * ${scale})`,
                  paddingRight: `calc(12px * ${scale})`,
                  paddingTop: `calc(36px * ${scale})`,
                  paddingBottom: `calc(36px * ${scale})`,
                  marginBottom: `calc(16px * ${scale})`,
                  marginTop: `calc(24px * ${scale})`
                }}
              >
                <p 
                  className="font-black text-center leading-relaxed"
                  style={{
                    fontSize: `calc(2.8rem * ${scale})`,
                    lineHeight: 1.8
                }}
                >
                  {selectedOption === 'A' ? (
                    <>
                      <span className="text-green-600">잠깐!</span><br />
                      <span className="text-black"> 
                        막걸리의 유혹을 이겨내볼까요?<br />
                        새참 속 막걸리를 치우러 가요.
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="text-green-600">유혹을 참아내다니 멋져요!</span><br />
                      <span className="text-black">
                        다른 작업자들도 먹지 않도록<br />
                        막걸리를 모두 치워보아요.
                      </span>
                    </>
                  )}
                </p>
              </div>
            </motion.div>
          </motion.div>
          
          {/* 시작 버튼 */}
          <div className="absolute left-0 right-0 flex justify-center z-50" style={{ bottom: `calc(-50px * ${scale})` }}>
            <img
              src={startButton}
              alt="시작하기"
              onClick={handleNextPhase}
              style={{
                width: `calc(300px * ${scale})`,
                height: 'auto'
              }}
              className="cursor-pointer hover:scale-105 transition-transform"
            />
          </div>
        </div>
      )}
      
      {/* 게임 진행 화면 */}
      {gamePhase === 'gamePlay' && (
        <div className="absolute inset-0 flex items-center justify-center">
          {/* 남은 막걸리 카운터 */}
          <div 
            className="absolute bg-green-600/70 rounded-xl flex items-center z-50 shadow-lg"
            style={{
              top: `calc(32px * ${scale})`,
              right: `calc(32px * ${scale})`,
              padding: `calc(16px * ${scale})`
            }}
          >
            <span 
              className="text-white font-black"
              style={{ 
                fontSize: `calc(1.875rem * ${scale})`,
                marginRight: `calc(12px * ${scale})`
              }}
            >
              남은 막걸리
            </span>
            <img
              src={makgeolli}
              alt="막걸리"
              style={{
                width: `calc(48px * ${scale})`,
                height: `calc(48px * ${scale})`,
                marginRight: `calc(8px * ${scale})`
              }}
            />
            <span 
              className="text-white font-bold"
              style={{ fontSize: `calc(2.5rem * ${scale})` }}
            >
              {5-foundCount}/5
            </span>
          </div>
          
          {renderTrayContainer(
            <>
              {/* 트레이 아이템들 */}
              {trayItems.map(item => {
                if (item.type === 'bottle') return null;
                
                let itemSrc = '';
                switch (item.type) {
                  case 'noodles': itemSrc = noodles; break;
                  case 'kimchi': itemSrc = kimchi; break;
                  case 'cup': itemSrc = makgeolliCup; break;
                  default: return null;
                }
                
                const leftPercent = item.position.xRatio * 100;
                const topPercent = item.position.yRatio * 100;
                const sizePercent = item.position.scale * 15 * scale;
                
                return (
                  <img
                    key={item.id}
                    src={itemSrc}
                    alt={item.type}
                    className="absolute pointer-events-none"
                    style={{
                      left: `${leftPercent}%`,
                      top: `${topPercent}%`,
                      width: `${sizePercent}%`,
                      height: 'auto',
                      transform: `translate(-50%, -50%) rotate(${item.position.rotation}deg)`,
                      zIndex: item.position.zIndex
                    }}
                  />
                );
              })}
              
              {/* 숨겨진 막걸리 아이템들 */}
              {makgeolliItems.map(item => {
                if (item.found) return null;
                
                const leftPercent = item.position.xRatio * 100;
                const topPercent = item.position.yRatio * 100;
                const sizePercent = item.position.scale * 15 * scale;
                
                return (
                  <img
                    key={item.id}
                    src={makgeolli}
                    alt="숨겨진 막걸리"
                    className="absolute cursor-pointer hover:scale-110 transition-transform duration-200"
                    style={{
                      left: `${leftPercent}%`,
                      top: `${topPercent}%`,
                      width: `${sizePercent}%`,
                      height: 'auto',
                      transform: `translate(-50%, -50%) rotate(${item.position.rotation}deg)`,
                      zIndex: item.position.zIndex
                    }}
                    onClick={() => handleItemClick(item.id)}
                  />
                );
              })}
            </>,
            "z-30"
          )}
          
          {/* 게임 안내 텍스트 */}
          <div 
            className="absolute bg-white bg-opacity-90 border-4 border-green-600 rounded-xl shadow-lg z-50"
            style={{
              top: `calc(16px * ${scale})`,
              left: `calc(16px * ${scale})`,
              padding: `calc(16px * ${scale})`,
              maxWidth: `calc(512px * ${scale})`
            }}
          >
            <p 
              className="text-green-700 font-bold text-center"
              style={{ fontSize: `calc(1.25rem * ${scale})` }}
            >
              {foundCount === 0 
                ? "화면에서 막걸리 5개를 모두 찾아 치워주세요!" 
                : foundCount === 4
                ? "4개 찾았어요! 1개 더 찾아주세요!"
                : `${foundCount}개 찾았어요! ${5-foundCount}개 더 찾아주세요!`}
            </p>
          </div>
        </div>
      )}
      
      {/* 성공 화면 */}
      {gamePhase === 'success' && (
        <div className="absolute inset-0">
          {/* 배경 이미지 유지 */}
          <img
            src={mission3Success}
            alt="성공 배경"
            className="absolute inset-0 w-full h-full object-cover"
          />
          
          {/* 배경 오버레이 */}
          <motion.div
            className="absolute inset-0 bg-[#FFF9C4]/60 z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 * Math.max(0.8, scale), delay: 2.0 }}
          />
          
          {/* 메시지 콘텐츠 */}
          <div className="absolute inset-0 flex flex-col items-center justify-center z-30">
            <motion.div 
              className="absolute left-0 right-0 flex justify-center items-center"
              style={{ top: `calc(15% * ${scale})` }}
              initial={{ opacity: 0, y: `calc(-30px * ${scale})` }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 * Math.max(0.8, scale), delay: 2.0, ease: 'easeOut' }}
            >
              <GameTitle 
                text="막걸리 치우기 성공!" 
                fontSize={`${64 * scale}px`}
                strokeWidth={`calc(12px * ${scale})`}
                color="text-[#0E8E12]"
              />
            </motion.div>
            
            <motion.div 
              className="bg-[#0DA429]/90 border-[#0E8E12] border-8 w-[73%] mx-auto text-center relative"
              style={{ 
                marginTop: `calc(220px * ${scale})`,
                marginBottom: `calc(40px * ${scale})`,
                paddingTop: `calc(48px * ${scale})`,
                paddingBottom: `calc(48px * ${scale})`,
                paddingLeft: `calc(40px * ${scale})`,
                paddingRight: `calc(40px * ${scale})`,
                borderRadius: `calc(48px * ${scale})`
              }}
              initial={{ opacity: 0, scale: 0.8, y: `calc(30px * ${scale})` }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8 * Math.max(0.8, scale), delay: 2.0, ease: 'easeOut' }}
            >
              <p 
                className="font-black text-white leading-relaxed"
                style={{ fontSize: `${60 * scale}px` }}
              >
                음주운전을 예방한 당신이<br />
                마을의 영웅이에요
              </p>
            </motion.div>

            {/* 확인 버튼 */}
            <motion.button
              onClick={handleConfirmClick}
              className="cursor-pointer hover:scale-105 transition-transform duration-200 border-0 outline-none bg-transparent p-0"
              style={{
                marginTop: `calc(40px * ${scale})`,
                width: `calc(200px * ${scale})`,
                height: 'auto',
                marginBottom: `calc(20px * ${scale})`
              }}
              initial={{ opacity: 0, y: `calc(20px * ${scale})` }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 * Math.max(0.8, scale), delay: 2.5, ease: 'easeOut' }}
            >
              <img 
                src={confirmButton} 
                alt="확인 버튼" 
                className="w-full h-auto"
              />
            </motion.button>

            <motion.img 
              src={starCharacter} 
              alt="별별이" 
              className="absolute z-40"
              style={{
                bottom: `calc(15% * ${scale})`,
                left: `calc(3% * ${scale})`,
                width: `calc(23% * ${scale})`
              }}
              initial={{ opacity: 0, x: `calc(-30px * ${scale})`, y: `calc(10px * ${scale})` }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ duration: 0.8 * Math.max(0.8, scale), delay: 2.4, ease: 'easeOut' }}
            />
          </div>
        </div>
      )}
      
      {/* 시간 초과 화면 */}
      {gamePhase === 'timeOver' && (
        <div className="absolute inset-0">
          {/* 배경 이미지 유지 */}
          <img
            src={mission3Success}
            alt="배경"
            className="absolute inset-0 w-full h-full object-cover"
          />
          
          {/* 배경 오버레이 */}
          <motion.div
            className="absolute inset-0 bg-[#FFF9C4]/60 z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 * Math.max(0.8, scale), delay: 2.0}}
          />
          
          {/* 메시지 콘텐츠 */}
          <div className="absolute inset-0 flex flex-col items-center justify-center z-30">
            <motion.div 
              className="absolute left-0 right-0 flex justify-center items-center"
              style={{ top: `calc(15% * ${scale})` }}
              initial={{ opacity: 0, y: `calc(-30px * ${scale})` }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 * Math.max(0.8, scale), delay: 2.0, ease: 'easeOut' }}
            >
              <GameTitle 
                text="노력해주셔서 감사해요!" 
                fontSize={`calc(4rem * ${scale})`}
                strokeWidth={`calc(12px * ${scale})`}
                color="text-green-700"
              />
            </motion.div>
            
            <motion.div 
              className="bg-[#0DA429]/90 border-[#0E8E12] border-8 w-[73%] mx-auto text-center relative"
              style={{ 
                marginTop: `calc(220px * ${scale})`,
                marginBottom: `calc(40px * ${scale})`,
                paddingTop: `calc(48px * ${scale})`,
                paddingBottom: `calc(48px * ${scale})`,
                paddingLeft: `calc(40px * ${scale})`,
                paddingRight: `calc(40px * ${scale})`,
                borderRadius: `calc(48px * ${scale})`
              }}
              initial={{ opacity: 0, scale: 0.8, y: `calc(30px * ${scale})` }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8 * Math.max(0.8, scale), delay: 2.0, ease: 'easeOut' }}
            >
              <p 
                className="font-black text-white leading-relaxed"
                style={{ fontSize: `${60 * scale}px` }}
              >
                음주운전을 예방한 당신이<br />
                마을의 영웅이에요
              </p>
            </motion.div>

            {/* 확인 버튼 */}
            <motion.button
              onClick={handleConfirmClick}
              className="cursor-pointer hover:scale-105 transition-transform duration-200 border-0 outline-none bg-transparent p-0"
              style={{
                marginTop: `calc(40px * ${scale})`,
                width: `calc(200px * ${scale})`,
                height: 'auto',
                marginBottom: `calc(20px * ${scale})`
              }}
              initial={{ opacity: 0, y: `calc(20px * ${scale})` }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 * Math.max(0.8, scale), delay: 2.5, ease: 'easeOut' }}
            >
              <img 
                src={confirmButton} 
                alt="확인 버튼" 
                className="w-full h-auto"
              />
            </motion.button>

            <motion.img 
              src={starCharacter} 
              alt="별별이" 
              className="absolute z-40"
              style={{
                bottom: `calc(15% * ${scale})`,
                left: `calc(3% * ${scale})`,
                width: `calc(23% * ${scale})`
              }}
              initial={{ opacity: 0, x: `calc(-30px * ${scale})`, y: `calc(10px * ${scale})` }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ duration: 0.8 * Math.max(0.8, scale), delay: 2.4, ease: 'easeOut' }}
            />
          </div>
        </div>
      )}

    </div>
  );
};

export default MakgeolliQuest;