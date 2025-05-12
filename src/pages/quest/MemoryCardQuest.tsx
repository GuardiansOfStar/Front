// src/pages/quest/MemoryCardQuest.tsx
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import BackButton from '../../components/ui/BackButton';

// 이미지 임포트
const gameBackground = '/assets/images/pre_drive_background.png';
const gameCharacter = '/assets/images/game_character.png';
const helmetCard = '/assets/images/helmet_card.png';
const strawHatCard = '/assets/images/straw_hat_card.png';
const capHatCard = '/assets/images/cap_hat_card.png';
const cardBack = '/assets/images/card_back.png';
const characterWithHelmet = '/assets/images/character_with_helmet.png';
const successCircle = '/assets/images/success_circle.png';
const failX = '/assets/images/fail_x.png';
const homeButton = '/assets/images/home_button.png';
const giftBox = '/assets/images/gift.png';
const giftOpenHelmet = '/assets/images/gift_open.png';
const grandchildren = '/assets/images/grandchildren.png';
const helmet = '/assets/images/helmet.png'
const NextButton = 'assets/images/next_button.png'

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
  | 'intro1'             // 시작 화면
  | 'intro2'             // 손자손녀 메시지 - 선물 소개
  | 'intro3'             // 게임 설명
  | 'showCards'          // 카드 미리보기
  | 'game'               // 카드 게임 진행
  | 'foundMatch'         // 카드 쌍 찾음
  | 'showGift'           // 선물 보여주기
  | 'openGift'           // 선물 열기
  | 'helmetEquipped'     // 헬멧 착용
  | 'score';             // 점수 화면

const MemoryCardQuest = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [scenarioId, setScenarioId] = useState<string | null>(null);
  const [questId, setQuestId] = useState<string | null>(null);
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<string[]>([]);
  const [attempts, setAttempts] = useState(0);
  const [gamePhase, setGamePhase] = useState<GamePhase>('intro1');
  const [isWrongPair, setIsWrongPair] = useState(false);
  
  // URL 쿼리 파라미터에서 시나리오 ID와 퀘스트 ID 가져오기
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const sId = searchParams.get('scenario');
    const qId = searchParams.get('quest');
    setScenarioId(sId);
    setQuestId(qId || '1');
  }, [location]);

  // 카드 초기화 - 섞지 않고 고정된 순서로 생성
  useEffect(() => {
    if (gamePhase === 'showCards' || gamePhase === 'game') {
      initializeCards();
    }
  }, [gamePhase]);

  // 카드 초기화 함수 - 카드를 섞지 않고 고정된 순서로 배치
  const initializeCards = () => {
    // 카드 배열 생성 (2쌍씩 총 6장) - 고정된 순서
    const cardTypes = [
      { type: 'helmet', image: helmetCard },
      { type: 'straw-hat', image: strawHatCard },
      { type: 'cap', image: capHatCard }
    ];
    
    // 각 카드 타입별로 2장씩 생성 (순서 고정)
    const initialCards: Card[] = [];
    cardTypes.forEach((cardType) => {
      for (let i = 0; i < 2; i++) {
        initialCards.push({
          id: initialCards.length,
          type: cardType.type as 'helmet' | 'straw-hat' | 'cap',
          image: cardType.image,
          isFlipped: gamePhase === 'showCards', // 카드 미리보기 단계에서는 모두 앞면
          isMatched: false
        });
      }
    });
    
    // 카드 섞지 않고 그대로 사용
    setCards(initialCards);
    
    // 카드 미리보기 단계에서 3초 후 게임 시작
    if (gamePhase === 'showCards') {
      setTimeout(() => {
        setGamePhase('game');
        setCards(initialCards.map(card => ({...card, isFlipped: false})));
      }, 3000);
    }
  };

  // 단계 진행 핸들러
  const handleNextPhase = () => {
    if (gamePhase === 'intro1') {
      setGamePhase('intro2');
    } else if (gamePhase === 'intro2') {
      setGamePhase('intro3');
    } else if (gamePhase === 'intro3') {
      setGamePhase('showCards');
    } else if (gamePhase === 'foundMatch') {
      setGamePhase('showGift');
    } else if (gamePhase === 'showGift') {
      setGamePhase('openGift');
    } else if (gamePhase === 'openGift') {
      setGamePhase('helmetEquipped');
      setTimeout(() => {
        navigate(`/score?scenario=${scenarioId}&quest=${questId}&score=30&correct=true`);
      }, 2000);
    }
  };
  
  // 카드 뒤집기 핸들러
  const handleCardClick = (cardId: number) => {
    // 이미 뒤집혀 있거나 매치된 카드면 무시
    const clickedCard = cards.find(card => card.id === cardId);
    if (!clickedCard || clickedCard.isFlipped || clickedCard.isMatched) {
      return;
    }
    
    // 이미 2장 뒤집혀 있으면 무시
    if (flippedCards.length === 2) {
      return;
    }
    
    // 카드 뒤집기
    const newCards = cards.map(card => 
      card.id === cardId ? { ...card, isFlipped: true } : card
    );
    setCards(newCards);
    
    // 뒤집힌 카드 추가
    const newFlippedCards = [...flippedCards, cardId];
    setFlippedCards(newFlippedCards);
    
    // 카드 2장 뒤집혔을 경우 검사
    if (newFlippedCards.length === 2) {
      setAttempts(prev => prev + 1);
      
      const firstCard = cards.find(card => card.id === newFlippedCards[0]);
      const secondCard = cards.find(card => card.id === newFlippedCards[1]);
      
      if (firstCard && secondCard && firstCard.type === secondCard.type) {
        // 매치 성공
        setTimeout(() => {
          const updatedCards = cards.map(card => 
            card.id === firstCard.id || card.id === secondCard.id 
              ? { ...card, isMatched: true, isFlipped: true } // isFlipped를 true로 유지해서 뒤집어지지 않게 함
              : card
          );
          setCards(updatedCards);
          setFlippedCards([]);
          
          // 헬멧 카드 쌍을 찾았는지 확인
          if (firstCard.type === 'helmet') {
            setMatchedPairs([...matchedPairs, 'helmet']);
            setTimeout(() => {
              setGamePhase('foundMatch');
            }, 800);
          } else {
            setMatchedPairs([...matchedPairs, firstCard.type]);
          }
        }, 800);
      } else {
        // 매치 실패
        setTimeout(() => {
          if (firstCard && secondCard) {
            setIsWrongPair(true);
            setTimeout(() => {
              setIsWrongPair(false);
              const updatedCards = cards.map(card => 
                (card.id === firstCard.id || card.id === secondCard.id) && !card.isMatched
                  ? { ...card, isFlipped: false } 
                  : card
              );
              setCards(updatedCards);
              setFlippedCards([]);
            }, 1500);
          }
        }, 800);
      }
    }
  };

  // 홈으로 이동 핸들러
  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className="relative w-full h-full">
      {/* 배경 */}
      <img
        src={gameBackground}
        alt="게임 배경"
        className="absolute w-full h-full object-cover"
      />

      {/* 헤더 영역 - 뒤로가기, 홈 버튼 */}
      <div className="absolute top-4 right-4 z-10">
        <img
          src={homeButton}
          alt="홈으로"
          className="w-16 h-16 cursor-pointer"
          onClick={handleGoHome}
        />
      </div>
      <div className="absolute top-4 left-4 z-10">
        <BackButton />
      </div>

      {/* 초기 화면 - 제목과 캐릭터 */}
      {gamePhase === 'intro1' && (
        <div 
          className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer"
          onClick={handleNextPhase}
        >
          <div className="mt-24 text-center">
            <h1 className="text-8xl font-bold">
              <span className="inline-block text-green-600 px-1 rounded [paint-order:stroke] [-webkit-text-stroke:10px_white] [text-stroke:2px_white]">주</span>
              <span className="inline-block text-green-600 px-1 rounded [paint-order:stroke] [-webkit-text-stroke:10px_white] [text-stroke:2px_white]">행</span>
              {' '} {/* Space */}
              <span className="inline-block text-green-600 px-1 rounded [paint-order:stroke] [-webkit-text-stroke:10px_white] [text-stroke:2px_white]">준</span>
              <span className="inline-block text-green-600 px-1 rounded [paint-order:stroke] [-webkit-text-stroke:10px_white] [text-stroke:2px_white]">비</span>
              <span className="inline-block text-green-600 px-1 rounded [paint-order:stroke] [-webkit-text-stroke:10px_white] [text-stroke:2px_white]">하</span>
              <span className="inline-block text-green-600 px-1 rounded [paint-order:stroke] [-webkit-text-stroke:10px_white] [text-stroke:2px_white]">기</span>
            </h1>
          </div>
          
          <img
            src={gameCharacter}
            alt="캐릭터"
            className="w-80 h-auto mt-6" /* Added mt-8 to move character down */
          />
        </div>
      )}

      {/* intro2 */}
      {gamePhase === 'intro2' && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="absolute inset-0 bg-white bg-opacity-30 backdrop-blur-sm"></div>
          <div className="relative z-10 max-w-xl mx-auto mt-64">
            <div className="bg-white border-4 border-green-600 rounded-xl p-6 shadow-lg">
              <p className="text-2xl font-bold text-black text-center mb-4">
                할아버지,<br />
                운전하시기 전에 중요한 선물이 있어요!
              </p>
            </div>
            <img
              src={grandchildren}
              alt="손자손녀"
              className="absolute -top-36 left-1/2 transform -translate-x-1/2 w-48 h-auto z-20"
            />
            <div className="flex justify-center">
              <img
                src={NextButton}
                alt="다음"
                onClick={handleNextPhase}
                className="w-1/2 h-auto cursor-pointer hover:scale-105 transition-transform"
              />
            </div>
          </div>
        </div>
      )}

      {/* 두 번째 단계 - 게임 설명 화면 (첨부 이미지처럼 구성) */}
      {gamePhase === 'intro3' && (
        
        <div 
          className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer"
          onClick={handleNextPhase}
        >

        <div className="absolute inset-0 bg-white bg-opacity-30 backdrop-blur-sm"></div>

          <div className="relative z-10">

          {/* 타이틀 */}
          <h2 className="text-4xl font-bold text-center text-green-600 mb-8">
            손주가 준비한 선물 찾기
          </h2>
          
          {/* 설명 텍스트 */}
          <div className="bg-white bg-opacity-90 border-4 border-green-600 rounded-xl p-8 max-w-3xl mx-auto">
            <p className="text-3xl font-bold text-black text-center mb-6">
              선물은 과연 무엇일까요?<br />
              같은 그림의 카드 두 개를 찾아주세요!
            </p>
            
            <p className="text-2xl text-center text-green-600 font-bold">
              힌트: 이 선물은 머리를 보호해줘요
            </p>
          </div>

          <div className="flex justify-center">
              <img
                src={NextButton}
                alt="다음"
                onClick={handleNextPhase}
                className="w-1/3 h-auto cursor-pointer hover:scale-105 transition-transform"
              />
              </div>
            </div>
        </div>
      )}

      {/* 카드 미리보기 단계 */}
      {gamePhase === 'showCards' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <h2 className="text-3xl font-bold text-green-600 py-4 px-12 rounded-full">
            힌트: 머리를 보호해주는 선물은 무엇일까요?
          </h2>
          
          {/* 카드 그리드 - 카드 크기 키움 */}
          <div className="grid grid-cols-3 grid-rows-2 gap-10 mb-10">
            {cards.map((card) => (
              <div key={card.id} className="relative w-48 h-64">
                <img
                  src={card.image}
                  alt="카드"
                  className="w-full h-full object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 카드 게임 화면 */}
      {gamePhase === 'game' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <h2 className="text-3xl font-bold  text-green-600 py-4 px-12 rounded-full">
            힌트: 머리를 보호해주는 선물은 무엇일까요?
          </h2>
          
          {/* 카드 그리드 - 카드 크기 키움 */}
          <div className="grid grid-cols-3 grid-rows-2 gap-10 mb-10 relative">
            {cards.map((card) => (
              <div 
                key={card.id} 
                className={`relative w-48 h-64 cursor-pointer ${
                  (isWrongPair && flippedCards.includes(card.id) && !card.isMatched) ? 'animate-shake' : ''
                } ${!card.isFlipped && !card.isMatched ? 'hover:scale-105' : ''} transition-transform duration-200`}
                onClick={() => handleCardClick(card.id)}
              >
                <img
                  src={card.isFlipped || card.isMatched ? card.image : cardBack}
                  alt="카드"
                  className="w-full h-full object-contain"
                />
                
                {/* 매치된 카드에 체크 표시 */}
                {card.isMatched && (
                  <div className="absolute top-0 right-0 transform -translate-y-1/4 translate-x-1/4">
                    <img
                      src={successCircle}
                      alt="성공"
                      className="w-16 h-16"
                    />
                  </div>
                )}
              </div>
            ))}
            
            {/* 오답 피드백 팝업 */}
            {isWrongPair && (
              <div className="absolute inset-0 flex items-center justify-center z-30">
                <div className="bg-white bg-opacity-95 border-4 border-green-600 rounded-xl p-6 text-center w-full max-w-xl shadow-lg">
                  <p className="text-3xl text-green-800 font-bold">
                    앗, 서로 다른 그림이에요!<br />
                    안전모가 그려진 카드 쌍을 찾아주세요
                  </p>
                </div>
              </div>
            )}
          </div>
          
          {/* 시도 횟수 */}
          <div className="px-10 py-3 rounded-full">
            <p className="text-2xl font-bold text-white">시도 횟수: {attempts}</p>
          </div>
        </div>
      )}

      {/* 카드 쌍 찾음 - 손자손녀 메시지 바로 표시 */}
      {gamePhase === 'foundMatch' && (
        <div 
          className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer"
          onClick={handleNextPhase}
        >
          {/* 손자손녀 이미지와 메시지 */}
          <div className="flex flex-col items-center">
            <img 
              src={grandchildren} 
              alt="손자손녀" 
              className="w-56 h-auto mb-2"
            />
            
            <div className="bg-green-600 text-white text-3xl font-bold rounded-3xl p-8 max-w-xl text-center">
              선물을 찾았어요!<br/>
              안전모는 당신을 보호해줄<br/>
              소중한 선물이에요
            </div>
          </div>
        </div>
      )}

      {/* 선물 보여주기 */}
      {gamePhase === 'showGift' && (
        <div 
          className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer"
          onClick={handleNextPhase}
        >
          <img 
            src={giftBox} 
            alt="선물 상자" 
            className="w-80 h-auto animate-pulse"
          />
        </div>
      )}

      {/* 선물 열기 */}
      {gamePhase === 'openGift' && (
        <div 
          className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer"
          onClick={handleNextPhase}
        >
          <img 
            src={giftOpenHelmet} 
            alt="열린 선물 상자와 헬멧" 
            className="w-80 h-auto animate-bounce"
          />
        </div>
      )}

      {/* 헬멧 착용 화면 */}
      {gamePhase === 'helmetEquipped' && (
        <div 
          className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer"
          onClick={handleNextPhase}
        >
          <div className="mt-24 text-center">
            <h2 className="text-8xl font-bold">
              <span className="inline-block text-green-600 px-1 rounded [paint-order:stroke] [-webkit-text-stroke:10px_white] [text-stroke:2px_white]">안</span>
              <span className="inline-block text-green-600 px-1 rounded [paint-order:stroke] [-webkit-text-stroke:10px_white] [text-stroke:2px_white]">전</span>
              <span className="inline-block text-green-600 px-1 rounded [paint-order:stroke] [-webkit-text-stroke:10px_white] [text-stroke:2px_white]">모</span>
              <span className="inline-block text-green-600 px-1 rounded [paint-order:stroke] [-webkit-text-stroke:10px_white] [text-stroke:2px_white]">를</span>

              {' '} {/* Space */}
              <span className="inline-block text-green-600 px-1 rounded [paint-order:stroke] [-webkit-text-stroke:10px_white] [text-stroke:2px_white]">착</span>
              <span className="inline-block text-green-600 px-1 rounded [paint-order:stroke] [-webkit-text-stroke:10px_white] [text-stroke:2px_white]">용</span>
              <span className="inline-block text-green-600 px-1 rounded [paint-order:stroke] [-webkit-text-stroke:10px_white] [text-stroke:2px_white]">했</span>
              <span className="inline-block text-green-600 px-1 rounded [paint-order:stroke] [-webkit-text-stroke:10px_white] [text-stroke:2px_white]">어</span>
              <span className="inline-block text-green-600 px-1 rounded [paint-order:stroke] [-webkit-text-stroke:10px_white] [text-stroke:2px_white]">요</span>
            </h2>
          </div>
          
          <img
            src={characterWithHelmet}
            alt="캐릭터"
            className="w-80 h-auto mt-6" /* Added mt-8 to move character down */
          />
        </div>
      
      )}
    </div>
  );
};

export default MemoryCardQuest;
