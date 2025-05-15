// src/pages/quest/MakgeolliQuest.tsx
import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import FieldRoadSliding from './FieldRoadSliding';

// 이미지 임포트
const fieldWorkBackground = '/assets/images/field_work_background.png';
const mealLadyBackground = '/assets/images/meal_lady_background.png';
const homeButton = '/assets/images/home_button.png';
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
  // 국수 3개 - 이미지 참고하여 배치
  { type: 'noodles', xRatio: 0.20, yRatio: 0.35, rotation: -5, scale: 1.8, zIndex: 3 },  // 왼쪽 국수
  { type: 'noodles', xRatio: 0.50, yRatio: 0.30, rotation: 10, scale: 1.8, zIndex: 3 },  // 중앙 국수
  { type: 'noodles', xRatio: 0.80, yRatio: 0.35, rotation: -8, scale: 1.8, zIndex: 3 },  // 오른쪽 국수
  
  // 김치 2개
  { type: 'kimchi', xRatio: 0.70, yRatio: 0.65, rotation: 5, scale: 1.6, zIndex: 4 },    // 오른쪽 김치
  { type: 'kimchi', xRatio: 0.30, yRatio: 0.65, rotation: -10, scale: 1.6, zIndex: 4 },  // 왼쪽 김치
  
  // 막걸리 병과 잔
  { type: 'bottle', xRatio: 0.75, yRatio: 0.45, rotation: 0, scale: 2.0, zIndex: 5 },    // 막걸리 병
  { type: 'cup', xRatio: 0.85, yRatio: 0.55, rotation: 0, scale: 1.5, zIndex: 4 },       // 오른쪽 잔
];

// 상수 - 숨겨진 막걸리 위치 정의 (상대적 비율)
const HIDDEN_MAKGEOLLI_POSITIONS: { xRatio: number, yRatio: number, rotation: number, scale: number, zIndex: number }[] = [
  // 이미지 참고하여 적절히 은쟁반 위 다른 음식 사이에 숨김
  { xRatio: 0.20, yRatio: 0.40, rotation: -12, scale: 1.2, zIndex: 2 },  // 왼쪽 국수 옆
  { xRatio: 0.80, yRatio: 0.40, rotation: 8, scale: 1.2, zIndex: 2 },    // 오른쪽 국수 뒤
  { xRatio: 0.35, yRatio: 0.70, rotation: 15, scale: 1.2, zIndex: 2 },   // 왼쪽 김치 근처
  { xRatio: 0.65, yRatio: 0.70, rotation: -5, scale: 1.2, zIndex: 2 },   // 오른쪽 김치 뒤
  { xRatio: 0.50, yRatio: 0.60, rotation: 20, scale: 1.2, zIndex: 2 },   // 중앙 하단
];

const MakgeolliQuest = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const windowSize = useRef({ width: window.innerWidth, height: window.innerHeight });

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
  
  // 화면 크기 변경 감지 이벤트 리스너
  useEffect(() => {
    const handleResize = () => {
      windowSize.current = {
        width: window.innerWidth,
        height: window.innerHeight
      };
      // 화면 크기 변경 시 트레이 아이템 위치 갱신
      if (gamePhase === 'mealTray' || gamePhase === 'gamePlay') {
        initTrayItems();
        if (gamePhase === 'gamePlay') {
          initializeGame();
        }
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [gamePhase]);

  // URL 쿼리 파라미터 처리
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const sId = searchParams.get('scenario');
    const qId = searchParams.get('quest');
    setScenarioId(sId);
    setQuestId('3');
  }, [location]);

  // 단계별 자동 진행
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    
    if (gamePhase === 'roadToField') {
      timer = setTimeout(() => {
        setGamePhase('fieldArrival');
      }, 5000);
    }
    else if (gamePhase === 'fieldArrival') {
      timer = setTimeout(() => {
        setGamePhase('working');
      }, 3000);
    }
    else if (gamePhase === 'working') {
      timer = setTimeout(() => {
        setGamePhase('mealLadyArrival');
      }, 5000);
    }
    else if (gamePhase === 'mealLadyArrival') {
      const mealLadyAnimation = setInterval(() => {
        setMealLadyOpacity(prev => {
          if (prev >= 1) {
            clearInterval(mealLadyAnimation);
            return 1;
          }
          return prev + 0.05;
        });
      }, 1000);
      
      timer = setTimeout(() => {
        setGamePhase('mealLadyIntro');
      }, 1500);
      
      return () => clearInterval(mealLadyAnimation);
    }
    else if (gamePhase === 'mealTray') {
      setShowTrayBackground(true);
      
      timer = setTimeout(() => {
        setGamePhase('missionIntro');
      }, 5000);
    }
    else if (gamePhase === 'missionIntro') {
      setShowTrayBackground(false);
    }
    else if (gamePhase === 'gamePlay') {
      setGameStartTime(Date.now());
      
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
      }, 1000);
      
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
      
      timer = setTimeout(() => {
        navigate(`/score?scenario=${scenarioId}&quest=${questId}&score=${gameScore}&correct=true`);
      }, 5000);
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [gamePhase, navigate, scenarioId, questId, gameScore, gameStartTime]);

  // 상대적 비율을 실제 픽셀 좌표로 변환하는 함수
  const getRealPosition = (position: ItemPosition) => {
    const { width, height } = windowSize.current;
    return {
      x: width * position.xRatio,
      y: height * position.yRatio,
      rotation: position.rotation,
      scale: position.scale,
      zIndex: position.zIndex
    };
  };

  // 트레이 아이템 초기화 함수 - 상대적 비율 사용
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

  // 게임 초기화 함수 - 숨겨진 막걸리 위치 설정
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
      return '/assets/images/farmland.png';
    }
    if (['working'].includes(gamePhase)) {
      return fieldWorkBackground;
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
    return fieldWorkBackground;
  };

  // 옵션 선택 핸들러
  const handleOptionSelect = (option: 'A' | 'B') => {
    setSelectedOption(option);
    setShowTrayBackground(false);
    
    setTimeout(() => {
      setGamePhase('gameInstruction');
    }, 300);
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
  
  // 홈으로 이동 핸들러
  const handleGoHome = () => {
    navigate('/');
  };
  
  // 타이틀 텍스트 렌더링 함수
  const renderTitleText = (text: string, fontSize = "text-6xl") => (
    <h2 className={`${fontSize} font-extrabold whitespace-nowrap`}>
      {text.split('').map((ch, i) => (
        ch === ' ' ? ' ' :
        <span key={i} className="inline-block text-green-600 px-1 rounded [paint-order:stroke] [-webkit-text-stroke:10px_white] [text-stroke:2px_white]">{ch}</span>
      ))}
    </h2>
  );
  
  // 식사 시간 타이틀 렌더링 함수
  const renderMealTimeTitle = () => (
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
      <h3 className="text-8xl font-bold whitespace-nowrap">
        <span className="inline-block text-green-600 px-1 rounded [paint-order:stroke] [-webkit-text-stroke:10px_white] [text-stroke:2px_white]">새</span>
        <span className="inline-block text-green-600 px-1 rounded [paint-order:stroke] [-webkit-text-stroke:10px_white] [text-stroke:2px_white]">참</span>
        {' '}
        <span className="inline-block text-green-600 px-1 rounded [paint-order:stroke] [-webkit-text-stroke:10px_white] [text-stroke:2px_white]">먹</span>
        <span className="inline-block text-green-600 px-1 rounded [paint-order:stroke] [-webkit-text-stroke:10px_white] [text-stroke:2px_white]">는</span>
        {' '}
        <span className="inline-block text-green-600 px-1 rounded [paint-order:stroke] [-webkit-text-stroke:10px_white] [text-stroke:2px_white]">시</span>
        <span className="inline-block text-green-600 px-1 rounded [paint-order:stroke] [-webkit-text-stroke:10px_white] [text-stroke:2px_white]">간</span>
      </h3>
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
      
      {/* 은쟁반 배경 레이어 */}
      {showTrayBackground && gamePhase !== 'mealTray' && gamePhase !== 'success' && gamePhase !== 'timeOver' && (
        <div className="absolute inset-0 z-5">
          {/* 트레이 아이템들 */}
          {trayItems.map(item => {
            let itemSrc = '';
            switch (item.type) {
              case 'noodles': itemSrc = noodles; break;
              case 'kimchi': itemSrc = kimchi; break;
              case 'bottle': itemSrc = makgeolli; break;
              case 'cup': itemSrc = makgeolliCup; break;
            }
            
            const realPos = getRealPosition(item.position);
            const baseSize = item.type === 'bottle' ? 120 : item.type === 'cup' ? 70 : 100;
            const finalSize = baseSize * realPos.scale;
            
            return (
              <div
                key={item.id}
                className="absolute pointer-events-none"
                style={{
                  left: `${realPos.x}px`,
                  top: `${realPos.y}px`,
                  width: `${finalSize}px`,
                  height: `${finalSize}px`,
                  zIndex: realPos.zIndex,
                  transform: `translate(-50%, -50%) rotate(${realPos.rotation}deg)`, // 중심 기준 배치
                }}
              >
                <img 
                  src={itemSrc}
                  alt={item.type}
                  className="w-full h-full object-contain"
                />
              </div>
            );
          })}
        </div>
      )}
      
      {/* 헤더 영역 */}
      <div className="absolute top-4 right-4 z-50">
        <img
          src={homeButton}
          alt="홈으로"
          className="w-16 h-16 cursor-pointer"
          onClick={handleGoHome}
        />
      </div>
      
      {/* 논밭 도착 화면 */}
      {gamePhase === 'fieldArrival' && (
        <div className="absolute inset-0 flex items-center justify-center">
          {renderTitleText("논밭 도착", "text-8xl")}
        </div>
      )}
      
      {/* 작업 중 화면 */}
      {gamePhase === 'working' && (
        <div className="absolute inset-0 flex items-center justify-center z-50">
          <div className="bg-green-600/90 border-[0.8rem] border-green-700 rounded-full w-[600px] px-12 py-4">
            <h1 className="text-[6rem] font-extrabold text-white text-center tracking-wide">작업 중</h1>
          </div>
          
          {/* 참새 애니메이션 */}
          <motion.img
            src={sparrow}
            alt="참새"
            className="absolute top-[27%] w-[150px] h-auto"
            initial={{ x: -150 }}
            animate={{ 
              x: window.innerWidth + 150,
              y: [0, -20, 10, -15, 5, 0],
              rotate: [0, 5, -3, 2, 0]
            }}
            transition={{
              x: { duration: 5, ease: "easeInOut" },
              y: { duration: 2.5, repeat: 1, ease: "easeInOut" },
              rotate: { duration: 2.5, repeat: 1, ease: "easeInOut" }
            }}
          />
        </div>
      )}

      {/* 새참 아주머니 등장 화면 */}
      {gamePhase === 'mealLadyArrival' && (
        <div className="absolute inset-x-0 flex justify-center items-end">
          <img
            src={mealLady}
            alt="새참 아주머니"
            className="h-[80vh] object-contain animate-[slideUp_1s_ease-out_forwards]"
          />
        </div>
      )}

      {/* 새참 아주머니 소개 화면 */}
      {gamePhase === 'mealLadyIntro' && (
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute w-full flex justify-center">
            <img
              src={mealLady}
              alt="새참 아주머니"
              className="h-[80vh] object-contain"
            />
          </div>

          <div className="absolute top-[65%] left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="w-[110vw] max-w-2xl bg-white/90 border-8 border-green-600 rounded-[2.2rem] p-10 text-center shadow-lg">
              <p className="text-[2.7rem] font-extrabold text-black leading-tight tracking-wider">
                새참 가져왔어요<br />
                다들 먹고 하셔요!
              </p>
            </div>
          </div>

          <div className="absolute -bottom-6 left-0 right-0 flex justify-center z-50">
            <img
              src={nextButton}
              alt="다음"
              onClick={handleNextPhase}
              className="w-52 h-auto cursor-pointer hover:scale-105 transition-transform"
            />
          </div>
        </div>
      )}

      {/* 식사 트레이 표시 화면 */}
      {gamePhase === 'mealTray' && (
        <div className="absolute inset-0">
          {renderMealTimeTitle()}
          
          <div className="absolute inset-0 z-10">
            {trayItems.map(item => {
              let itemSrc = '';
              switch (item.type) {
                case 'noodles': itemSrc = noodles; break;
                case 'kimchi': itemSrc = kimchi; break;
                case 'bottle': itemSrc = makgeolli; break;
                case 'cup': itemSrc = makgeolliCup; break;
              }
              
              const realPos = getRealPosition(item.position);
              const baseSize = item.type === 'bottle' ? 120 : item.type === 'cup' ? 70 : 100;
              const finalSize = baseSize * realPos.scale;
              
              return (
                <div
                  key={item.id}
                  className="absolute"
                  style={{
                    left: `${realPos.x}px`,
                    top: `${realPos.y}px`,
                    width: `${finalSize}px`,
                    height: `${finalSize}px`,
                    zIndex: realPos.zIndex,
                    transform: `translate(-50%, -50%) rotate(${realPos.rotation}deg)`,
                  }}
                >
                  <img 
                    src={itemSrc}
                    alt={item.type}
                    className="w-full h-full object-contain"
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}
      
      {/* 미션 소개 화면 */}
      {gamePhase === 'missionIntro' && (
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[#FFF9C4]/60 z-10"></div>
          
          <div className="absolute inset-0 flex flex-col items-center justify-center top-4 z-10">
            <h2 className="text-[3.2rem] font-extrabold text-green-600 text-center mb-8">
              새참을 먹어요
            </h2>

            <div className="bg-white bg-opacity-90 border-8 border-green-600 rounded-3xl p-6 mb-8 w-[75%]">
              <p className="text-[2.6rem] font-extrabold text-black text-center">
                저런! 새참에 막걸리가 있어요.<br/>
                작업이 끝나면 운전해야 하는데…<br/>
                어떡하죠?
              </p>
            </div>

            <div className="flex justify-between w-[75%]">
              <button
                className={`w-[48%] bg-green-600 bg-opacity-80
                border-8 border-green-600 rounded-xl p-4
                text-3xl font-extrabold text-white 
                transition duration-300 
                ${selectedOption === 'A' ? 'bg-green-600 scale-105 bg-opacity-95' : 'hover:bg-green-600'}`}
                onClick={() => handleOptionSelect('A')}
                disabled={!!selectedOption}
              >
                작업중 막걸리는 보약!<br />
                적당히 마신다
              </button>
              
              <button
                className={`w-[48%] bg-green-600 bg-opacity-80
                border-8 border-green-600 rounded-xl p-4
                text-3xl font-extrabold text-white
                transition duration-300 
                ${selectedOption === 'B' ? 'bg-green-600 scale-105 bg-opacity-95' : 'hover:bg-green-600'}`}
                onClick={() => handleOptionSelect('B')}
                disabled={!!selectedOption}
              >
                운전해야 하니<br />
                막걸리는<br />
                마시지 않는다
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 게임 안내 화면 - UI 개선 */}
      {gamePhase === 'gameInstruction' && (
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[#FFF9C4]/60 z-5"></div>
          
          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-start pt-20 z-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="relative z-10 w-4/5 max-w-4xl flex flex-col items-center"
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-6xl font-extrabold text-center text-green-600 mb-8">
                새참 속 막걸리 치우기
              </h2>
              <div className="bg-white/80 border-8 border-green-600 rounded-3xl px-6 py-12 mb-4 w-full">
                <p className="text-[2.8rem] font-extrabold text-center leading-relaxed">
                  {selectedOption === 'A' ? (
                    <>
                      <span className="text-green-600">잠깐!</span><br />
                      막걸리의 유혹을 이겨내볼까요?<br />
                      새참 속 막걸리를 치우러 가요.
                    </>
                  ) : (
                    <>
                      <span className="text-green-600">유혹을 참아내다니 멋져요!</span><br />
                      다른 작업자들도 먹지 않도록<br />
                      막걸리를 모두 치워보아요.
                    </>
                  )}
                </p>
              </div>
            </motion.div>
          </motion.div>
          
          {/* 시작 버튼 - 하단 가운데 고정 */}
          <div className="absolute bottom-0 left-0 right-0 flex justify-center z-50">
            <img
              src={startButton}
              alt="시작하기"
              onClick={handleNextPhase}
              className="w-52 h-auto cursor-pointer hover:scale-105 transition-transform"
            />
          </div>
        </div>
      )}
      
      {/* 게임 진행 화면 */}
      {gamePhase === 'gamePlay' && (
        <div className="absolute inset-0">
          {/* 남은 막걸리 카운터 */}
          <div className="absolute top-24 right-16 bg-green-600 rounded-xl p-4 flex items-center z-50 shadow-lg">
            <span className="text-3xl font-bold text-white mr-3">남은 막걸리</span>
            <img
              src={makgeolli}
              alt="막걸리"
              className="w-12 h-12 mr-2"
            />
            <span className="text-4xl font-bold text-white">{5-foundCount}/5</span>
          </div>
          
          {/* 아이템들 */}
          <div className="absolute inset-0 z-30">
            {makgeolliItems.map(item => {
              if (item.type === 'makgeolli' && item.found) return null;
              
              const itemSrc = item.type === 'makgeolli' ? makgeolli :
                              item.type === 'noodles' ? noodles : kimchi;
              
              const realPos = getRealPosition(item.position);
              const baseSize = item.type === 'makgeolli' ? 120 : 100;
              const finalSize = baseSize * realPos.scale;
              
              return (
                <div
                  key={item.id}
                  className={`absolute cursor-pointer transition-transform duration-200 ${item.type === 'makgeolli' ? 'hover:scale-110' : ''}`}
                  style={{
                    left: `${realPos.x}px`,
                    top: `${realPos.y}px`,
                    width: `${finalSize}px`,
                    height: `${finalSize}px`,
                    zIndex: realPos.zIndex,
                    transform: `translate(-50%, -50%) rotate(${realPos.rotation}deg)`,
                  }}
                  onClick={() => handleItemClick(item.id)}
                >
                  <img 
                    src={itemSrc}
                    alt={item.type}
                    className="w-full h-full object-contain"
                  />
                </div>
              );
            })}
          </div>
          
          {/* 트레이 아이템들 - mealTray와 동일한 위치 */}
          <div className="absolute inset-0 z-10">
            {trayItems.map(item => {
              let itemSrc = '';
              switch (item.type) {
                case 'noodles': itemSrc = noodles; break;
                case 'kimchi': itemSrc = kimchi; break;
                case 'bottle': itemSrc = makgeolli; break;
                case 'cup': itemSrc = makgeolliCup; break;
              }
              
              const realPos = getRealPosition(item.position);
              const baseSize = item.type === 'bottle' ? 120 : 
                               item.type === 'cup' ? 70 : 100;
              const finalSize = baseSize * realPos.scale;
              
              return (
                <div
                  key={item.id}
                  className="absolute pointer-events-none"
                  style={{
                    left: `${realPos.x}px`,
                    top: `${realPos.y}px`,
                    width: `${finalSize}px`,
                    height: `${finalSize}px`,
                    zIndex: realPos.zIndex,
                    transform: `translate(-50%, -50%) rotate(${realPos.rotation}deg)`,
                  }}
                >
                  <img 
                    src={itemSrc}
                    alt={item.type}
                    className="w-full h-full object-contain"
                  />
                </div>
              );
            })}
          </div>
          
          {/* 게임 안내 텍스트 */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-white bg-opacity-90 border-4 border-green-600 rounded-xl p-4 max-w-2xl shadow-lg z-50">
            <p className="text-2xl text-green-700 font-bold text-center">
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
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="absolute inset-0 bg-white bg-opacity-30 z-0"></div>
          
          <div className="relative z-20 text-center">
            <h2 className="text-5xl font-bold text-green-600 mb-8">
              막걸리 치우기 성공!
            </h2>
            
            <div className="relative bg-green-600/80 border-8 border-green-700 rounded-xl p-8 w-[600px] mx-auto text-center">
              <p className="text-4xl text-white font-extrabold">
                음주운전을 예방한 당신이<br />
                마을의 영웅이에요
              </p>
              
              <img
                src={starCharacter}
                alt="별별이 캐릭터"
                className="absolute -bottom-8 -left-8 w-32 h-32"
              />
            </div>
          </div>
        </div>
      )}
      
      {/* 시간 초과 화면 */}
      {gamePhase === 'timeOver' && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="absolute inset-0 bg-white bg-opacity-30 z-0"></div>
          
          <div className="relative z-20 text-center">
            <h2 className="text-5xl font-bold text-green-600 mb-8">
              노력해주셔서 감사해요!
            </h2>
            
            <div className="relative bg-green-600/80 border-8 border-green-700 rounded-xl p-8 w-[600px] mx-auto">
              <p className="text-4xl text-white font-extrabold">
                음주운전을 예방한 당신이<br />
                마을의 영웅이에요
              </p>
              
              <img
                src={starCharacter}
                alt="별별이 캐릭터"
                className="absolute -bottom-8 -left-8 w-32 h-32"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MakgeolliQuest;