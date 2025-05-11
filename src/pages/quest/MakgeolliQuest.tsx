// src/pages/quest/MakgeolliQuest.tsx
import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import BackButton from '../../components/ui/BackButton';

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
  | 'fieldArrival' | 'working' | 'mealLadyArrival' | 'mealLadyIntro'
  | 'mealTray' | 'missionIntro' | 'options' | 'gameInstruction'
  |'gamePlay' | 'success' | 'timeOver' | 'score';

// 막걸리 아이템 인터페이스
interface MakgeolliItem {
  id: number;
  x: number;
  y: number;
  found: boolean;
  type: 'makgeolli' | 'noodles' | 'kimchi';
  zIndex: number;
  rotation: number;
  scale: number;
}

// 트레이 아이템 인터페이스
interface TrayItem {
  id: number;
  x: number;
  y: number;
  type: 'noodles' | 'kimchi' | 'bottle' | 'cup';
  rotation: number;
  scale: number;
  zIndex: number;
}

const MakgeolliQuest = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [scenarioId, setScenarioId] = useState<string | null>(null);
  const [questId, setQuestId] = useState<string | null>(null);
  const [gamePhase, setGamePhase] = useState<GamePhase>('fieldArrival');
  const [selectedOption, setSelectedOption] = useState<'A' | 'B' | null>(null);
  const [sparrowPosition, setSparrowPosition] = useState(-100); // 참새 위치
  const [mealLadyOpacity, setMealLadyOpacity] = useState(0); // 새참 아주머니 투명도
  const [makgeolliItems, setMakgeolliItems] = useState<MakgeolliItem[]>([]);
  const [trayItems, setTrayItems] = useState<TrayItem[]>([]); // 트레이 아이템 상태 추가
  const [foundCount, setFoundCount] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(300); // 5분 = 300초
  const [gameScore, setGameScore] = useState(0);
  const [gameStartTime, setGameStartTime] = useState<number | null>(null);
  const [showTrayBackground, setShowTrayBackground] = useState(false); // 트레이 배경 표시 여부
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  // URL 쿼리 파라미터에서 시나리오 ID와 퀘스트 ID 가져오기
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    
    const sId = searchParams.get('scenario');
    const qId = searchParams.get('quest');
    
    setScenarioId(sId);
    setQuestId('3'); // 항상 3으로 강제 설정 (미션3)
  }, [location]);

  // 단계별 자동 진행
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    
    if (gamePhase === 'fieldArrival') {
      // 3초 후 작업 중 단계로
      timer = setTimeout(() => {
        setGamePhase('working');
      }, 3000);
    } 
    else if (gamePhase === 'working') {
      // 참새 애니메이션 (5초간)
      const sparrowAnimation = setInterval(() => {
        setSparrowPosition(prev => {
          if (prev > window.innerWidth) {
            clearInterval(sparrowAnimation);
            return prev;
          }
          return prev + 5;
        });
      }, 50);
      
      // 5초 후 새참 시간으로
      timer = setTimeout(() => {
        setGamePhase('mealLadyArrival');
      }, 5000);
      
      return () => clearInterval(sparrowAnimation);
    }
    else if (gamePhase === 'mealLadyArrival') {
      // 새참 아주머니 등장 애니메이션
      const mealLadyAnimation = setInterval(() => {
        setMealLadyOpacity(prev => {
          if (prev >= 1) {
            clearInterval(mealLadyAnimation);
            return 1;
          }
          return prev + 0.05;
        });
      }, 100);
      
      // 3초 후 자동으로 새참 아주머니 안내 표시
      timer = setTimeout(() => {
        setGamePhase('mealLadyIntro');
      }, 1500);
      
      return () => clearInterval(mealLadyAnimation);
    }
    // 밀 레이디 인트로는 자동 전환 없음 - 다음 버튼 클릭해야 진행
    // else if (gamePhase === 'mealLadyIntro') {
    //   timer = setTimeout(() => {
    //     initTrayItems();
    //     setGamePhase('mealTray');
    //   }, 5000);
    // }
    else if (gamePhase === 'mealTray') {
      // 은쟁반 배경 표시 활성화
      setShowTrayBackground(true);
      
      // 5초 후 자동으로 missionIntro로 전환
      timer = setTimeout(() => {
        setGamePhase('missionIntro');
      }, 5000);
    }
    else if (gamePhase === 'missionIntro') {
      setShowTrayBackground(false);
    }
    else if (gamePhase === 'gamePlay') {
      // 타이머 시작 (UI에는 표시하지 않지만 내부적으로 카운팅)
      setGameStartTime(Date.now());
      
      timerRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 0) {
            if (timerRef.current) clearInterval(timerRef.current);
            setGamePhase('timeOver');
            setGameScore(5); // 시간 초과시 5점
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
      // 배경 숨기기
      setShowTrayBackground(false);
      
      // 게임 종료 시 경과 시간에 따른 점수 계산
      if (gamePhase === 'success' && gameStartTime) {
        const elapsedTime = (Date.now() - gameStartTime) / 1000; // 초 단위
        
        // 경과 시간에 따른 점수 계산
        let score = 0;
        if (elapsedTime <= 30) score = 20;
        else if (elapsedTime <= 60) score = 18;
        else if (elapsedTime <= 120) score = 15;
        else if (elapsedTime <= 180) score = 12;
        else if (elapsedTime <= 240) score = 10;
        else score = 8;
        
        setGameScore(score);
        console.log("MakgeolliQuest - 게임 성공, 점수 계산:", { elapsedTime, score });
      }
      
      // 5초 후 점수 화면으로 이동 (여기에 로그 추가)
      const timer = setTimeout(() => {
        console.log("MakgeolliQuest - 점수 화면으로 이동:", { scenarioId, questId: "3", gameScore });
        navigate(`/score?scenario=${scenarioId}&quest=${questId}&score=${gameScore}&correct=true`);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [gamePhase, navigate, scenarioId, questId, gameScore, gameStartTime]);

  // 배경 이미지 선택 함수
  const getBackground = () => {
    if (['fieldArrival', 'working'].includes(gamePhase)) {
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

  // 트레이 아이템 초기화 함수 - 직접 위치를 지정하여 배치
  const initTrayItems = () => {
    // 화면 중앙 좌표 계산
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    
    // 아이템 위치 고정 (여기에서 직접 위치를 조정할 수 있음)
    // x, y: 픽셀 좌표 (centerX, centerY에서 상대적 위치로 지정)
    // rotation: 회전 각도 (도 단위, 양수는 시계방향)
    // scale: 크기 배율 (2.0은 2배 크기)
    const fixedPositions = [
      // 국수 3개 - 첫번째 이미지처럼 배치
      { type: 'noodles', x: centerX - 140, y: centerY - 70, rotation: -5, scale: 2.5 },  // 왼쪽 국수
      { type: 'noodles', x: centerX - 30, y: centerY - 130, rotation: 10, scale: 2.5 },  // 중앙 위 국수
      { type: 'noodles', x: centerX + 150, y: centerY - 80, rotation: -8, scale: 2.5 },  // 오른쪽 국수
      
      // 김치 2개
      { type: 'kimchi', x: centerX + 140, y: centerY + 90, rotation: 5, scale: 2.2 },    // 오른쪽 김치
      { type: 'kimchi', x: centerX - 120, y: centerY + 100, rotation: -10, scale: 2.2 }, // 왼쪽 김치
      
      // 막걸리 병과 잔
      { type: 'bottle', x: centerX + 120, y: centerY - 20, rotation: 0, scale: 3.0 },    // 막걸리 병
      { type: 'cup', x: centerX + 160, y: centerY + 30, rotation: 0, scale: 2.0 },       // 오른쪽 잔
      { type: 'cup', x: centerX - 60, y: centerY + 40, rotation: 0, scale: 2.0 }         // 왼쪽 잔
    ];
    
    // 고정 위치를 기반으로 아이템 생성
    const items: TrayItem[] = fixedPositions.map((pos, index) => ({
      id: Date.now() + index,
      x: pos.x,
      y: pos.y,
      type: pos.type as TrayItem['type'],
      rotation: pos.rotation,
      scale: pos.scale,
      zIndex: pos.type === 'bottle' ? 5 : (pos.type === 'cup' ? 4 : 3)
    }));
    
    setTrayItems(items);
  };

  // 게임 초기화 함수
  const initializeGame = () => {
    const screenW = window.innerWidth, screenH = window.innerHeight;
    const centerX = screenW / 2;
    const centerY = screenH / 2;
    const trayRadius = Math.min(screenW, screenH) * 0.3;

    const items: MakgeolliItem[] = [];
    
    // 아이템을 트레이 근처에 배치하는 함수
    const createItems = (type: 'makgeolli' | 'noodles' | 'kimchi', count: number, zBaseline: number) => {
      const result: MakgeolliItem[] = [];
      
      for (let i = 0; i < count; i++) {
        // 원 주변의 랜덤 위치 계산
        const angle = Math.random() * Math.PI * 2;
        const radius = trayRadius * (0.5 + Math.random() * 0.5); // 반지름의 50~100% 위치
        
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;
        
        result.push({
          id: items.length + i,
          x,
          y,
          found: false,
          type,
          zIndex: zBaseline + Math.floor(Math.random() * 3),
          rotation: Math.random() * 45 - 22.5,
          scale: 3.0 + Math.random() * 0.5 // 크기 3배 증가
        });
      }
      
      return result;
    };
    
    // 각 타입별로 아이템 생성
    items.push(...createItems('makgeolli', 5, 10));
    items.push(...createItems('noodles', 10, 5));
    items.push(...createItems('kimchi', 8, 5));
    
    setMakgeolliItems(items);
    setFoundCount(0);
    setTimeRemaining(300);
    setGameScore(0);
  };

  // 옵션 선택 핸들러
  const handleOptionSelect = (option: 'A' | 'B') => {
    // 이벤트 작동 확인용 콘솔 로그
    console.log(`선택된 옵션: ${option}`);
    
    // 상태 업데이트
    setSelectedOption(option);
    
    // 의도치 않은 배경 변경 방지
    setShowTrayBackground(false);
    
    // 작은 딜레이 후 다음 단계로 전환
    setTimeout(() => {
      console.log(`게임 단계 변경: gameInstruction`);
      setGamePhase('gameInstruction');
    }, 300); // 더 빠른 전환을 위해 시간 단축
  };
  
  // 아이템 클릭 핸들러
  const handleItemClick = (id: number) => {
    const item = makgeolliItems.find(e => e.id === id);
    if (!item || item.found || item.type !== 'makgeolli') return;
    
    // 클릭한 막걸리를 찾은 상태로 변경
    setMakgeolliItems(prev => prev.map(e => e.id === id ? {...e, found: true} : e));
    
    // 찾은 막걸리 개수 증가
    setFoundCount(count => {
      const newCount = count + 1;
      
      // 모든 막걸리를 찾았으면 성공 화면으로 전환
      if (newCount === 5) {
        if (timerRef.current) clearInterval(timerRef.current);
        setGamePhase('success');
      }
      
      return newCount;
    });
  };

  // 다음 단계로 이동 핸들러 (수동 조작용)
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
  const renderTitleText = (text: string, size = "text-5xl", color = "text-green-600") => (
    <div className="relative inline-block">
      <h1 className={`${size} font-extrabold ${color} px-8 py-3`}
          style={{
            textShadow: '2px 2px 0 #FFF, -2px -2px 0 #FFF, 2px -2px 0 #FFF, -2px 2px 0 #FFF',
            WebkitTextStroke: '1px white'
          }}>
        {text}
      </h1>
    </div>
  );
  
  // 식사 시간 타이틀 렌더링 함수 - 색상 반전
  const renderMealTimeTitle = () => (
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
      <h1 className="text-8xl font-bold text-green-600" 
          style={{
            textShadow: '4px 4px 0 #FFF, -4px -4px 0 #FFF, 4px -4px 0 #FFF, -4px 4px 0 #FFF',
            WebkitTextStroke: '2px #FFF'
          }}>
        새참 먹는 시간
      </h1>
    </div>
  );

  return (
    <div className="relative w-full h-full">
      {/* 배경 */}
      <img
        src={getBackground()}
        alt="배경"
        className="absolute w-full h-full object-cover"
      />
      
      {/* 배경 오버레이 레이어 - 미션 인트로 단계와 게임 관련 단계에서만 적용 */}
      {(gamePhase === 'missionIntro' || gamePhase === 'gameInstruction' || gamePhase === 'gamePlay') && (
        <div className="absolute inset-0 bg-white bg-opacity-20 z-5"></div> // z-10에서 z-5로 낮춤
      )}
      
      {/* 은쟁반 배경 레이어 - 활성화 되면 계속 표시됨, 단 성공/실패 화면에서는 제외 */}
      {showTrayBackground && gamePhase !== 'mealTray' && gamePhase !== 'success' && gamePhase !== 'timeOver' && (
        <div className="absolute inset-0 z-5">
          {/* 트레이 아이템들 (배경 아이템) */}
          <div className="absolute inset-0 z-5">
            {trayItems.map(item => {
              let itemSrc = '';
              
              // 아이템 타입에 따라 이미지 소스 설정
              switch (item.type) {
                case 'noodles':
                  itemSrc = noodles;
                  break;
                case 'kimchi':
                  itemSrc = kimchi;
                  break;
                case 'bottle':
                  itemSrc = makgeolli;
                  break;
                case 'cup':
                  itemSrc = makgeolliCup;
                  break;
              }
              
              // 아이템 크기 계수
              const baseSize = item.type === 'bottle' ? 120 : 
                             item.type === 'cup' ? 70 : 100;
              const finalSize = baseSize * item.scale;
              
              return (
                <div
                  key={item.id}
                  className="absolute pointer-events-none"
                  style={{
                    left: `${item.x}px`,
                    top: `${item.y}px`,
                    width: `${finalSize}px`,
                    height: `${finalSize}px`,
                    zIndex: item.zIndex,
                    transform: `rotate(${item.rotation}deg)`,
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
      
      {/* 헤더 영역 */}
      <div className="absolute top-4 right-4 z-50">
        <img
          src={homeButton}
          alt="홈으로"
          className="w-16 h-16 cursor-pointer"
          onClick={handleGoHome}
        />
      </div>
      <BackButton />
      
      {/* 논밭 도착 화면 */}
      {gamePhase === 'fieldArrival' && (
        <div className="absolute inset-0 flex items-center justify-center">
          {renderTitleText('논밭 도착', 'text-6xl', 'text-green-600')}
        </div>
      )}
      
      {/* 작업 중 화면 */}
      {gamePhase === 'working' && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-green-600 rounded-xl px-12 py-4">
            <h2 className="text-4xl font-bold text-white">작업중</h2>
          </div>
          
          {/* 참새 애니메이션 */}
          <img
            src={sparrow}
            alt="참새"
            style={{ 
              position: 'absolute',
              left: `${sparrowPosition}px`,
              top: '30%',
              width: '60px',
              height: 'auto',
              transform: 'translateY(-50%)'
            }}
          />
        </div>
      )}

      {/* 새참 아주머니 등장 화면 */}
      {gamePhase === 'mealLadyArrival' && (
        <div className="absolute inset-x-0 bottom-0 flex justify-center items-end">
          <img
            src={mealLady}
            alt="새참 아주머니"
            className="h-[80vh] object-contain animate-[slideUp_1s_ease-out_forwards]"
            // style={{ opacity: mealLadyOpacity }}
          />
        </div>
      )}

      {/* 새참 아주머니 소개 화면 - 다음 버튼 제거 (자동 전환) */}
      {gamePhase === 'mealLadyIntro' && (
        <div className="absolute inset-0 overflow-hidden">
          {/* 할머니: 화면 아래 고정 */}
          <div className="absolute bottom-0 w-full flex justify-center">
            <img
              src={mealLady}
              alt="새참 아주머니"
              className="h-[80vh] object-contain"
            />
          </div>

          {/* 말풍선 */}
          <div className="absolute top-[80%] left-1/2 transform -translate-x-1/2 -translate-y-1/2">

            <div className="w-[90vw] max-w-2xl bg-white/80 border-8 border-green-600 rounded-xl p-6 text-center shadow-lg">
              <p className="text-4xl font-extrabold text-green-800 leading-tight">
                새참 가져왔어요<br />
                다들 먹고 하셔요!
              </p>
            </div>

            {/* 다음 버튼 */}
            <div className="flex justify-center mt-4 z-50">
              <img
                src={nextButton}
                alt="다음"
                onClick={handleNextPhase}
                className="w-40 cursor-pointer hover:scale-105 transition-transform relative z-50"
              />
            </div>
          </div>
        </div>
      )}

      {/* 식사 트레이 표시 화면 - 아이템 크기 증가 및 중앙 배치 */}
      {gamePhase === 'mealTray' && (
        <div className="absolute inset-0">
          {/* 중앙에 크게 표시되는 타이틀 */}
          {renderMealTimeTitle()}
          
          {/* 트레이 위의 아이템들 - 고르게 배치 */}
          <div className="absolute inset-0 z-10">
            {trayItems.map(item => {
              let itemSrc = '';
              
              // 아이템 타입에 따라 이미지 소스 설정
              switch (item.type) {
                case 'noodles':
                  itemSrc = noodles;
                  break;
                case 'kimchi':
                  itemSrc = kimchi;
                  break;
                case 'bottle':
                  itemSrc = makgeolli;
                  break;
                case 'cup':
                  itemSrc = makgeolliCup;
                  break;
              }
              
              // 아이템 크기 계수 설정 - 더 크게 표시
              const baseSize = item.type === 'bottle' ? 120 : 
                             item.type === 'cup' ? 70 : 100;
              const finalSize = baseSize * item.scale;
              
              return (
                <div
                  key={item.id}
                  className="absolute"
                  style={{
                    left: `${item.x}px`,
                    top: `${item.y}px`,
                    width: `${finalSize}px`,
                    height: `${finalSize}px`,
                    zIndex: item.zIndex,
                    transform: `rotate(${item.rotation}deg)`,
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
      
      {/* 미션 소개 화면 - 선택지 버튼을 텍스트 박스 밖으로 분리 */}
      {gamePhase === 'missionIntro' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {/* 상단 타이틀 */}
          <h2 className="text-3xl font-bold text-green-600 px-8 py-2 rounded-full mb-6 z-40">새참을 먹어요</h2>
          
          {/* 중앙 대화 상자 */}
          <div className="w-4/5 max-w-xl bg-white/90 border-8 border-green-600 rounded-xl p-6 mb-8 z-40">
            <p className="text-2xl text-center">
              저런! 새참에 막걸리가 있어요.<br/>
              작업이 끝나면 운전해야 하는데…<br/>
              어떡하죠?
            </p>
          </div>
          
          {/* 선택지 버튼 (z-index 증가 및 이벤트 버블링 방지) */}
          <div className="w-4/5 max-w-xl flex justify-between gap-8 z-50 relative pointer-events-auto">
            <button
              className="w-1/2 bg-green-400 border-8 border-green-600 rounded-xl p-4 text-xl font-bold text-white transition-all duration-300 hover:bg-green-500 relative z-50"
              onClick={(e) => {
                e.stopPropagation(); // 이벤트 버블링 방지
                handleOptionSelect('A');
              }}
            >
              작업중 막걸리는 보약!<br />
              적당히 마신다
            </button>
            
            <button
              className="w-1/2 bg-green-400 border-8 border-green-600 rounded-xl p-4 text-xl font-bold text-white transition-all duration-300 hover:bg-green-500 relative z-50"
              onClick={(e) => {
                e.stopPropagation(); // 이벤트 버블링 방지
                handleOptionSelect('B');
              }}
            >
              운전해야 하니<br />
              막걸리는<br />
              마시지 않는다
            </button>
          </div>
        </div>
      )}
      
      {/* 게임 안내 화면 */}
      {gamePhase === 'gameInstruction' && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4/5 max-w-xl z-20">
            <h2 className="text-3xl font-bold text-white bg-green-600 px-12 py-3 rounded-full mb-6 text-center mx-auto w-fit">
              새참 속 막걸리 치우기
            </h2>
            
            <div className="bg-white border-4 border-green-600 rounded-xl p-6 mb-8">
              <p className="text-2xl text-center">
                {selectedOption === 'A' ? (
                  <span>
                    <span className="text-green-600 font-bold">잠깐!</span><br />
                    막걸리의 유혹을 이겨내볼까요?<br />
                    새참 속 막걸리를 치우러 가요.
                  </span>
                ) : (
                  <span>
                    <span className="text-green-600 font-bold">유혹을 참아내다니 멋져요!</span><br />
                    다른 작업자들도 먹지 않도록<br />
                    막걸리를 모두 치워보아요.
                  </span>
                )}
              </p>
            </div>
            
            <div className="flex justify-center">
              <img
                src={startButton}
                alt="시작하기"
                onClick={handleNextPhase}
                className="w-48 cursor-pointer hover:scale-105 transition-transform"
              />
            </div>
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
              // 이미 찾은 막걸리는 표시하지 않음
              if (item.type === 'makgeolli' && item.found) return null;
              
              // 아이템 타입에 따라 이미지 결정
              const itemSrc = 
                item.type === 'makgeolli' ? makgeolli :
                item.type === 'noodles' ? noodles : kimchi;
              
              // 아이템 크기 계수
              const baseSize = item.type === 'makgeolli' ? 120 : 100;
              const finalSize = baseSize * item.scale;
              
              return (
                <div
                  key={item.id}
                  className={`absolute cursor-pointer transition-transform duration-200 ${item.type === 'makgeolli' ? 'hover:scale-110' : ''}`}
                  style={{
                    left: `${item.x}px`,
                    top: `${item.y}px`,
                    width: `${finalSize}px`,
                    height: `${finalSize}px`,
                    zIndex: item.zIndex,
                    transform: `rotate(${item.rotation}deg)`,
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
          
          {/* 트레이 아이템들 (배경 아이템) */}
          <div className="absolute inset-0 z-10">
            {trayItems.map(item => {
              let itemSrc = '';
              
              // 아이템 타입에 따라 이미지 소스 설정
              switch (item.type) {
                case 'noodles':
                  itemSrc = noodles;
                  break;
                case 'kimchi':
                  itemSrc = kimchi;
                  break;
                case 'bottle':
                  itemSrc = makgeolli;
                  break;
                case 'cup':
                  itemSrc = makgeolliCup;
                  break;
              }
              
              // 아이템 크기 계수
              const baseSize = item.type === 'bottle' ? 120 : 
                             item.type === 'cup' ? 70 : 100;
              const finalSize = baseSize * item.scale;
              
              return (
                <div
                  key={item.id}
                  className="absolute pointer-events-none"
                  style={{
                    left: `${item.x}px`,
                    top: `${item.y}px`,
                    width: `${finalSize}px`,
                    height: `${finalSize}px`,
                    zIndex: item.zIndex,
                    transform: `rotate(${item.rotation}deg)`,
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
            <h2 className="text-4xl font-bold text-green-600 mb-6">
              막걸리 치우기 성공!
            </h2>
            
            <div className="relative bg-green-400 border-8 border-green-600 rounded-xl p-8 max-w-lg mx-auto">
              <p className="text-2xl text-white font-bold">
                음주운전을 예방한 당신이<br />
                마을의 영웅이에요
              </p>
              
              <img
                src={starCharacter}
                alt="별별이 캐릭터"
                className="absolute -bottom-4 -left-4 w-16 h-16"
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
            <h2 className="text-4xl font-bold text-green-600 mb-6">
              노력해주셔서 감사해요!
            </h2>
            
            <div className="relative bg-green-400 border-8 border-green-600 rounded-xl p-8 max-w-lg mx-auto">
              <p className="text-2xl text-white font-bold">
                음주운전을 예방한 당신이<br />
                마을의 영웅이에요
              </p>
              
              <img
                src={starCharacter}
                alt="별별이 캐릭터"
                className="absolute -bottom-4 -left-4 w-16 h-16"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MakgeolliQuest;