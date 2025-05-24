import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import BackButton from '../../components/ui/BackButton';
import { postQuestAttempt, AttemptPayload } from "../../services/endpoints/attempts";
import GameTitle from '../../components/ui/GameTitle';

// 이미지 임포트
const gameBackground = '/assets/images/pre_drive_background.png';
const gameCharacter = '/assets/images/game_character.png';
const helmetCard = '/assets/images/helmet_card.png';
const strawHatCard = '/assets/images/straw_hat_card.png';
const capHatCard = '/assets/images/cap_hat_card.png';
const cardBack = '/assets/images/card_back.png';
const characterWithHelmet = '/assets/images/character_with_helmet.png';
const homeButton = '/assets/images/home_button.png';
const giftBox = '/assets/images/gift.png';
const giftOpenHelmet = '/assets/images/gift_open.png';
const grandchildren = '/assets/images/grandchildren.png';
const helmet = '/assets/images/helmet.png';
const nextButton = '/assets/images/next_button.png';

const giftBoxVariants = {
  hidden:   { scale: 0.5, rotate: -30, opacity: 0 },
  visible:  {
    scale: [1, 1.2, 0.9, 1],                  // 4단계 키프레임
    rotate: [-15, 15, -5, 0],                 // 4단계 키프레임
    opacity: 1,
    transition: {
      duration: 1,                            // 전체 1초
      times: [0, 0.3, 0.6, 1],                // 키프레임 시점
      ease: ["easeOut", "easeIn", "easeOut"]  // 구간별 easing
    }
  }
}

const openBoxVariants = {
  hidden:  { scale: 0.8, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      type: "spring",                          // 간단한 spring
      stiffness: 200,
      damping: 20,
      duration: 0.8
    }
  }
}

const helmetVariants = {
  hidden:  { y: 30, opacity: 0, scale: 0.5, rotate: -10 },
  visible: {
    y: 0,
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: {
      type: "spring",                         // 헬멧은 부드러운 spring
      stiffness: 180,
      damping: 15,
      delay: 0.3,
    }
  }
}

// 카드 타입 정의
interface Card {
  id: number;
  type: 'helmet' | 'straw-hat' | 'cap';
  image: string;
  isFlipped: boolean;
  isMatched: boolean;
}

// 게임 단계 정의
type GamePhase =
  | 'intro1'
  | 'intro2'
  | 'intro3'
  | 'showCards'
  | 'game'
  | 'wrongPairFeedback'
  | 'wrongMatchFeedback'
  | 'tooManyAttempts'
  | 'showAnswer'
  | 'foundMatch'
  | 'showGift'
  | 'openGift'
  | 'helmetEquipped'
  | 'score';

const MemoryCardQuest: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // state
  const [scenarioId, setScenarioId] = useState<string | null>(null);
  const [questId, setQuestId] = useState<string | null>(null);
  const [cards, setCards] = useState<Card[]>([]);
  const [initialCardOrder, setInitialCardOrder] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<string[]>([]);
  const [attempts, setAttempts] = useState(0);
  const [gamePhase, setGamePhase] = useState<GamePhase>('intro1');
  const [feedbackMessage, setFeedbackMessage] = useState<string>('');
  const [giftAnimationStage, setGiftAnimationStage] = useState(0);
  const [finalScore, setFinalScore] = useState(20);
  const [showMessage, setShowMessage] = useState(false);
  const [showHintTitle, setShowHintTitle] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const [shouldShowHintMessage, setShouldShowHintMessage] = useState(false);

  // 타이머 refs
  const giftAnimationRef = useRef<number | null>(null);
  const autoTransitionTimerRef = useRef<number | null>(null);
  const feedbackTimerRef = useRef<number | null>(null);

  // URL 쿼리 파라미터
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setScenarioId(params.get('scenario'));
    setQuestId(params.get('quest') || '1');
  }, [location]);

  // 최초 게임 시작 시에만 카드 초기화
  useEffect(() => {
    if (gamePhase === 'showCards' && !isInitialized) {
      initializeCards();
      setIsInitialized(true);
    } else if (gamePhase === 'showCards' && isInitialized) {
      setFlippedCards([]);
      
      // 이미 초기화된 경우 저장된 카드 순서 사용
      setCards(initialCardOrder.map(card => ({
        ...card,
        isFlipped: true,
      })));

      // 힌트 메시지 숨기기
      setShouldShowHintMessage(false);

      // showCards 후 자동으로 game 단계로 전환
      window.setTimeout(() => {
        setGamePhase('game');
        setCards(prev => prev.map(c => ({
          ...c,
          isFlipped: false
        })));
      }, 3000);
    }

    if (gamePhase === 'intro2') {
      const timer = window.setTimeout(() => setShowMessage(true), 800);
      return () => clearTimeout(timer);
    }
  }, [gamePhase, isInitialized, initialCardOrder]);

  // 힌트 타이틀 표시 관리
  useEffect(() => {
    if (gamePhase === 'wrongPairFeedback' || gamePhase === 'wrongMatchFeedback' || gamePhase === 'tooManyAttempts') {
      setShowHintTitle(false);
    } else if (gamePhase === 'game') {
      setShowHintTitle(true);
    }
  }, [gamePhase]);

  // 자동 전환
  useEffect(() => {
    if (autoTransitionTimerRef.current != null) {
      clearTimeout(autoTransitionTimerRef.current);
    }

    if (gamePhase === 'intro1') {
      autoTransitionTimerRef.current = window.setTimeout(() => {
        setGamePhase('intro2');
      }, 3000);
    } 
    else if (gamePhase === 'wrongMatchFeedback') {
      // 정답이 아닌 같은 쌍 피드백 후 다시 카드 보여주기
      autoTransitionTimerRef.current = window.setTimeout(() => {
        if (attempts >= 5) {
          setShouldShowHintMessage(true);
          setFeedbackMessage("찾기 어려우신가요?\n정답을 알려드릴게요");
          setGamePhase('tooManyAttempts');
        } else {
          setGamePhase('showCards');
        }
      }, 3500);
    }
    else if (
      gamePhase === 'foundMatch' ||
      gamePhase === 'showGift' ||
      gamePhase === 'openGift' ||
      gamePhase === 'helmetEquipped'
    ) {
      autoTransitionTimerRef.current = window.setTimeout(() => {
        switch (gamePhase) {
          case 'foundMatch':   setGamePhase('showGift');       break;
          case 'showGift':     setGamePhase('openGift');       break;
          case 'openGift':     setGamePhase('helmetEquipped'); break;
          case 'helmetEquipped':
            navigate(
              `/score?scenario=${scenarioId}&quest=${questId}&score=${finalScore}&correct=true`
            );
            break;
        }
      }, 3000);
    }
    else if (gamePhase === 'wrongPairFeedback') {
      autoTransitionTimerRef.current = window.setTimeout(() => {
        if (attempts < 5) {
          setFlippedCards([]);
          setGamePhase('showCards');
        } else {
          setShouldShowHintMessage(true);
          setFeedbackMessage("찾기 어려우신가요?\n정답을 알려드릴게요");
          setGamePhase('tooManyAttempts');
        }
      }, 5000);
    }
    else if (gamePhase === 'tooManyAttempts') {
      autoTransitionTimerRef.current = window.setTimeout(() => {
        setShouldShowHintMessage(false);
        
        autoTransitionTimerRef.current = window.setTimeout(() => {
          setCards(prev =>
            prev.map(c =>
              c.type === 'helmet'
                ? { ...c, isFlipped: true }
                : { ...c, isFlipped: false }
            )
          );
          
          autoTransitionTimerRef.current = window.setTimeout(() => {
            setGamePhase('showAnswer');
          }, 1500);
        }, 500);
      }, 3000);
    } 
    else if (gamePhase === 'showAnswer') {
      autoTransitionTimerRef.current = window.setTimeout(() => {
        setGamePhase('helmetEquipped');
      }, 3000);
    }

    return () => {
      if (autoTransitionTimerRef.current != null) {
        clearTimeout(autoTransitionTimerRef.current);
      }
    };
  }, [gamePhase, navigate, scenarioId, questId, finalScore, flippedCards]);

  useEffect(() => {
    if (gamePhase === 'tooManyAttempts') {
      setShouldShowHintMessage(true);
    } else if (gamePhase === 'showAnswer') {
      setShouldShowHintMessage(false);
    }
  }, [gamePhase]);

  // 점수 계산
  useEffect(() => {
    let score = 20;
    if (attempts === 2) score = 16;
    else if (attempts === 3) score = 12;
    else if (attempts === 4) score = 8;
    else if (attempts >= 5) score = 4;
    setFinalScore(score);
  }, [attempts]);

  // 정재 : questAttempt API 호출
  useEffect(() => {
  if (gamePhase === "helmetEquipped") {
    const sessionId = localStorage.getItem("session_id");
    console.log("session_id : ", sessionId);
    if (!sessionId) return console.error("session_id 없음");

    // questId: URL 파라미터 또는 고정값으로
    const questId = "helmet";

    // payload 구성
    const payload: AttemptPayload = {
      attempt_number: attempts,         // state: 시도 횟수
      score_awarded: finalScore,       // state: 최종 점수
      selected_option: "helmet",       // 정답 혹은 선택값
      is_correct: true,                // 헬멧을 찾았으니 true
      //response_time: Math.floor((Date.now() - questionStartTimeRef.current!) / 1000),
      response_time: 0,
    };

    postQuestAttempt(sessionId, questId, payload)
      .then((res) => {
        console.log("✅ 시도 기록 완료:", res.data.attempt_id);
      })
      .catch((err) => {
        console.error("❌ 시도 기록 실패", err);
      });
  }
}, [gamePhase, attempts, finalScore]);

  // 선물 애니메이션
  useEffect(() => {
    if (gamePhase === 'openGift') {
      if (giftAnimationRef.current != null) clearTimeout(giftAnimationRef.current);
      setGiftAnimationStage(1);
      giftAnimationRef.current = window.setTimeout(() => {
        setGiftAnimationStage(2);
        giftAnimationRef.current = window.setTimeout(() => setGiftAnimationStage(3), 1000);
      }, 500);
    }
    return () => {
      if (giftAnimationRef.current != null) clearTimeout(giftAnimationRef.current);
    };
  }, [gamePhase]);

  // 카드 초기화 함수
  const initializeCards = () => {
    const types = [
      { type: 'helmet', image: helmetCard },
      { type: 'straw-hat', image: strawHatCard },
      { type: 'cap', image: capHatCard },
    ] as const;
    
    const list: Card[] = [];
    types.forEach(({ type, image }) => {
      for (let i = 0; i < 2; i++) {
        list.push({ 
          id: list.length, 
          type, 
          image, 
          isFlipped: true,
          isMatched: false
        });
      }
    });
    
    const shuffled = shuffleCards(list);
    setCards(shuffled);
    setInitialCardOrder(shuffled);

    window.setTimeout(() => {
      setGamePhase('game');
      setCards(prev => prev.map(c => ({ ...c, isFlipped: false })));
    }, 3000);
  };

  // 카드 섞기 함수
  const shuffleCards = (cards: Card[]): Card[] => {
    const shuffled = [...cards];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // 카드 클릭 핸들러
  const handleCardClick = (id: number) => {
    if (gamePhase !== 'game') return;
    const card = cards.find(c => c.id === id);
    if (!card || card.isFlipped || card.isMatched) return;

    setCards(prev =>
      prev.map(c =>
        c.id === id ? { ...c, isFlipped: true } : c
      )
    );
    
    const flipped = [...flippedCards, id];
    setFlippedCards(flipped);

    if (flipped.length === 2) {
      setAttempts(a => a + 1);
      
      const [aId, bId] = flipped;
      const [aCard, bCard] = [aId, bId].map(i =>
        cards.find(c => c.id === i)!
      );

      if (aCard.type === bCard.type) {
        if (aCard.type === 'helmet') {
          // 정답 쌍(헬멧-헬멧) 발견
          window.setTimeout(() => {
            setCards(prev =>
              prev.map(c =>
                c.id === aId || c.id === bId
                  ? { ...c, isMatched: true }
                  : c
              )
            );
            setFlippedCards([]);
            window.setTimeout(() => setGamePhase('foundMatch'), 800);
          }, 800);
        } else {
          // 정답이 아닌 같은 쌍 선택 - 카드 다시 뒤집기
          setFeedbackMessage("앗, 준비한 선물이 아니에요!\n안전모가 그려진 카드 쌍을 찾아주세요!");
          
          window.setTimeout(() => {
            setCards(prev =>
              prev.map(c =>
                c.id === aId || c.id === bId
                  ? { ...c, isFlipped: false }
                  : c
              )
            );
            setFlippedCards([]);
            setGamePhase('wrongMatchFeedback');
          }, 1000);
        }
      } else {
        // 서로 다른 쌍 선택
        setFeedbackMessage("앗, 서로 다른 그림이에요!\n안전모가 그려진 카드 쌍을 찾아주세요");
        setShowHintTitle(false);
        window.setTimeout(() => {
          setGamePhase('wrongPairFeedback');
        }, 800);
      }
    }
  };

  // 홈으로 이동 핸들러
  const handleGoHome = () => navigate('/');

  // 다음 단계로 이동 핸들러
  const handleNextPhase = () => {
    if (gamePhase === 'intro2' && !showMessage) return;
    setShowMessage(false);
    if (gamePhase === 'intro1')      setGamePhase('intro2');
    else if (gamePhase === 'intro2') setGamePhase('intro3');
    else if (gamePhase === 'intro3') setGamePhase('showCards');
  };

  // 배경 흐림 효과 렌더링 함수
  const renderBackdrop = () => {
    if (gamePhase === 'intro1' || gamePhase === 'helmetEquipped') return null;
    return <div className="absolute inset-0 bg-[#FFF9C4]/50  z-0" />;
  };

  // 단계별 버튼 표시 조건
  const showNextButton =
    (gamePhase === 'intro2' && showMessage) ||
    gamePhase === 'intro3';

  // 카드 컨테이너 패딩 조건부 설정
  const gameContentVisible = 
    gamePhase === 'showCards' || 
    gamePhase === 'game' || 
    gamePhase === 'wrongPairFeedback' ||
    gamePhase === 'wrongMatchFeedback'||
    gamePhase === 'tooManyAttempts';

  return (
    <div className="relative w-full h-full">
      {/* 배경 */}
      <img src={gameBackground} alt="게임 배경" className="absolute w-full h-full object-cover" />
      {renderBackdrop()}

      {/* 서서히 페이드인되는 백드롭 */}
      {gamePhase !== 'intro1' && gamePhase !== 'helmetEquipped' && (
        <motion.div
          className="absolute inset-0 bg-[#FFF9C4]/50 z-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        />
      )}

      {/* 헤더 */}
      {(gamePhase === 'intro1' || gamePhase === 'intro2' || gamePhase === 'intro3') && (
        <div className="absolute top-4 right-4 z-50">
          <motion.img 
            src={homeButton} 
            alt="홈" 
            className="w-16 h-16 cursor-pointer" 
            onClick={handleGoHome} 
            whileTap={{scale: 0.9}}
          />
        </div>
      )}
      <div className="absolute top-4 left-4 z-50">
        <BackButton />
      </div>

      {/* intro1 */}
      {gamePhase === 'intro1' && (
        <motion.div className="absolute inset-0 flex flex-col items-center justify-center z-10"
        initial={{opacity: 0}}
        animate={{opacity: 1}}
        transition={{duration: 0.8}}
        >
          <motion.div
            className="mt-24 text-center"
            initial={{y: -20}}
            animate={{y: 0}}
            transition={{duration: 0.8}}
            ><GameTitle text="주행 준비하기" fontSize="text-7xl" strokeWidth="12px" />
          </motion.div>
          <motion.img
            src={gameCharacter}
            alt="캐릭터"
            className="w-80 h-auto mt-2 "
            initial={{scale: 0.8, opacity: 0}}
            animate={{scale: 1, opacity: 1}}
            transition={{duration: 0.8, ease: 'easeOut'}}
            />
        </motion.div>
      )}

      {gamePhase === 'intro2' && (
        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-center z-10 -mt-28"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <motion.img
            src={grandchildren}
            alt="손자손녀"
            className="w-100 h-auto -mb-16 z-20"
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          />

          <motion.div
            className="bg-white/80 border-8 border-green-600 rounded-xl px-8 py-12 w-full max-w-[43rem] text-center"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-4xl font-extrabold text-black">
              할아버지,<br />
              운전하시기 전에 중요한 선물이 있어요!
            </p>
          </motion.div>
        </motion.div>
      )}

      {/* intro3 */}
      {gamePhase === 'intro3' && (
        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-start pt-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="relative z-10 w-4/5 max-w-4xl"
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-5xl font-extrabold text-center text-green-600 mb-8">
              손주가 준비한 선물 찾기
            </h2>
            <div className="bg-white/80 border-8 border-green-600 rounded-xl p-12 text-center">
              <p className="text-4xl font-extrabold text-black mb-6">
                선물은 과연 무엇일까요?<br />같은 그림의 카드 두 개를 찾아주세요!
              </p>
              <p className="text-4xl font-extrabold text-green-600">
                힌트: 이 선물은 머리를 보호해줘요
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* 게임 화면 영역 - 절대 위치로 고정 */}
      {gameContentVisible && (
        <div className="absolute inset-0 z-10 px-6 py-4">
          <div className="w-full h-full flex flex-col items-center justify-start">
            {/* 시도 횟수 - 좌측 상단에 고정 */}
            {gamePhase === 'game' && (
              <div className="absolute bottom-6 right-6 bg-green-600 border-4 border-green-700 px-4 py-2 rounded-lg z-50">
                <p className="text-xl font-extrabold text-white">
                  시도 횟수: {attempts}
                </p>
              </div>
            )}
            
            {/* 타이틀 영역 - 높이 고정 */}
            <div className="h-20 flex items-center justify-center mb-6 mt-4">
              <div className={showHintTitle ? '' : 'invisible'}>
                <GameTitle text="힌트: 머리를 보호해주는 선물은 무엇일까요?" fontSize="text-3xl" strokeWidth="8px" />
              </div>
            </div>
            
            {/* 카드 그리드 - 넓은 간격으로 조정 */}
            <div className="grid grid-cols-3 gap-x-16 gap-y-8 justify-items-center items-center flex-1 content-center">
              {cards.map(card => {
                // 카드 크기 파악
                let cardInfo = { width: 210, height: 265 };
                
                if (card.type === 'straw-hat') {
                  cardInfo = { width: 210, height: 269 };
                } else if (card.type === 'cap') {
                  cardInfo = { width: 210, height: 265 };
                }
                
                const backCardInfo = { width: 210, height: 269 };
                
                // 더 큰 카드 크기로 조정
                const baseScale = Math.min(
                  (window.innerWidth * 0.8) / (cardInfo.width * 3 + 128), // 가로 간격 증가
                  (window.innerHeight * 0.55) / (cardInfo.height * 2 + 32), // 세로 활용도 증가
                  1.2 // 최대 1.2배까지 확대 허용
                );
                
                const containerSize = {
                  width: Math.max(cardInfo.width, backCardInfo.width) * baseScale,
                  height: Math.max(cardInfo.height, backCardInfo.height) * baseScale
                };
                
                return (
                  <div
                    key={card.id}
                    className={`relative cursor-pointer transition-transform duration-300 hover:scale-105`}
                    onClick={() => handleCardClick(card.id)}
                    style={{
                      width: `${containerSize.width}px`,
                      height: `${containerSize.height}px`,
                      transform: card.isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                      transformStyle: 'preserve-3d',
                    }}
                  >
                    {/* 카드 앞면 */}
                    <div 
                      className="absolute inset-0 backface-hidden transform-style-preserve-3d" 
                      style={{
                        backfaceVisibility: 'hidden',
                        transform: 'rotateY(180deg)',
                      }}
                    >
                      <img
                        src={card.image}
                        alt={card.type}
                        className="w-full h-full object-contain"
                        style={{
                          width: `${cardInfo.width * baseScale}px`,
                          height: `${cardInfo.height * baseScale}px`,
                          position: 'absolute',
                          left: '50%',
                          top: '50%',
                          transform: 'translate(-50%, -50%)',
                        }}
                      />
                    </div>
                    
                    {/* 카드 뒷면 */}
                    <div 
                      className="absolute inset-0 backface-hidden transform-style-preserve-3d" 
                      style={{
                        backfaceVisibility: 'hidden',
                      }}
                    >
                      <img
                        src={cardBack}
                        alt="카드 뒷면"
                        className="w-full h-full object-contain"
                        style={{
                          width: `${backCardInfo.width * baseScale}px`,
                          height: `${backCardInfo.height * baseScale}px`,
                          position: 'absolute',
                          left: '50%',
                          top: '50%',
                          transform: 'translate(-50%, -50%)',
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 잘못된 쌍 피드백 - 게임 화면 위에 오버레이 */}
      {gamePhase === 'wrongPairFeedback' && (
        <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
          <div className="bg-white border-8 border-green-600 rounded-xl p-8 max-w-xl w-full mx-auto text-center shadow-lg">
            <p className="text-3xl font-extrabold text-green-600 whitespace-pre-line">
              {feedbackMessage}
            </p>
          </div>
        </div>
      )}

      {/* 정답이 아닌 같은 쌍 피드백 - 게임 화면 위에 오버레이 */}
      {gamePhase === 'wrongMatchFeedback' && (
        <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
          <div className="bg-white border-8 border-green-600 rounded-xl p-8 max-w-xl w-full mx-auto text-center shadow-lg">
            <p className="text-3xl font-extrabold text-green-600 whitespace-pre-line">
              {feedbackMessage}
            </p>
          </div>
        </div>
      )}

      {/* 시도 횟수 초과 피드백 */}
      {gamePhase === 'tooManyAttempts' && shouldShowHintMessage && (
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <div className="bg-white border-8 border-green-600 rounded-xl p-8 max-w-xl w-full mx-auto text-center shadow-lg">
            <p className="text-3xl font-extrabold text-green-600 whitespace-pre-line">
              {feedbackMessage}
            </p>
          </div>
        </div>
      )}

      {/* 정답 보여주기 */}
      {gamePhase === 'showAnswer' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10 mt-24">
          <div className="relative w-4/5 max-w-4xl z-10">
            <img
              src={grandchildren}
              alt="손자손녀"
              className="absolute -top-40 left-1/2 transform -translate-x-1/2 w-76 h-auto z-20"
            />
            <div className="bg-white bg-opacity-90 border-8 border-green-600 rounded-xl p-10 pt-12 w-full max-w-2xl mx-auto text-center">
              <p className="text-4xl font-extrabold text-green-600 mb-6">
                선물을 공개합니다
              </p>
              <p className="text-4xl font-extrabold text-black">
                안전모는 당신을 보호해줄 <br/>소중한 선물이에요.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* foundMatch */}
      {gamePhase === 'foundMatch' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10 mt-24">
          <div className="relative w-4/5 max-w-4xl z-10">
            <img
              src={grandchildren}
              alt="손자손녀"
              className="absolute -top-40 left-1/2 transform -translate-x-1/2 w-76 h-auto z-20"
            />
            <div className="bg-white bg-opacity-90 border-8 border-green-600 rounded-xl p-10 pt-12 w-full max-w-2xl mx-auto text-center">
              <p className="text-4xl font-extrabold text-green-600 mb-6">
                선물을 찾았어요!
              </p>
              <p className="text-4xl font-extrabold text-black">
                안전모는 당신을 보호해줄 <br/>소중한 선물이에요.
              </p>
            </div>
          </div>
        </div>
      )}

      {gamePhase === 'showGift' && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center z-10"
          initial="hidden"
          animate="visible"
          variants={giftBoxVariants}
        >
          <motion.img
            src={giftBox}
            alt="선물 상자"
            className="w-[640px] h-[640px]"
            variants={giftBoxVariants}
          />
        </motion.div>
      )}

      {gamePhase === 'openGift' && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center z-10"
          initial="hidden"
          animate="visible"
          variants={openBoxVariants}
        >
          <div className="relative w-[800px] h-[800px]">
            {/* 열린 상자 */}
            <motion.img
              src={giftOpenHelmet}
              alt="열린 상자"
              className="absolute inset-0 w-full h-full object-contain"
              variants={openBoxVariants}
            />

            {/* 헬멧을 flex로 완전 중앙에 */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <motion.img
                src={helmet}
                alt="헬멧"
                className="w-[320px] h-[320px] object-contain"
                initial="hidden"
                animate="visible"
                variants={helmetVariants}
              />
            </div>
          </div>
        </motion.div>
      )}


      {/* helmetEquipped */}
      {gamePhase === 'helmetEquipped' && (
        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-center z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <div className="mt-24 text-center"><GameTitle text="안전모를 착용했어요" fontSize="text-7xl" strokeWidth="12px" /></div>
          <motion.img
            src={characterWithHelmet}
            alt="캐릭터"
            className="w-80 h-auto mt-6"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8 }}
          />
        </motion.div>
      )}

      {/* 중앙 Next 버튼 */}
      {showNextButton && (
        <div className="absolute bottom-0 left-0 right-0 flex justify-center z-10">
          <img
            src={nextButton}
            alt="다음"
            onClick={handleNextPhase}
            className="w-52 h-auto cursor-pointer hover:scale-105 transition-transform"
          />
        </div>
      )}
    </div>
  );
};

export default MemoryCardQuest;