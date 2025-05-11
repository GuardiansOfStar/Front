import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import BackButton from '../../components/ui/BackButton';

// 이미지 임포트
const preDriveBackground = '/assets/images/pre_drive_background.png';
const gameCharacter = '/assets/images/game_character.png';
const helmet = '/assets/images/helmet.png';
const strawHat = '/assets/images/straw_hat.png';
const capHat = '/assets/images/cap_hat.png';
const characterWithHelmet = '/assets/images/character_with_helmet.png';
const successCircle = '/assets/images/success_circle.png';
const failX = '/assets/images/fail_x.png';
const homeButton = '/assets/images/home_button.png';
const scoreBackground = '/assets/images/score_background.png';
const oldManWithHelmet = '/assets/images/character_with_helmet.png';

// 퀘스트 타입 정의
interface Quest {
  id: string;
  title: string;
  description: string;
  options: {
    id: string;
    image: string;
    isCorrect: boolean;
    alt: string;
  }[];
}

// Quest 1 데이터
const quest1: Quest = {
  id: '1',
  title: '모자 선택하기',
  description: '이륜차를 운전하기 전, 착용해야 하는 모자는 무엇일까요?',
  options: [
    { id: 'helmet', image: helmet, isCorrect: true, alt: '헬멧' },
    { id: 'straw-hat', image: strawHat, isCorrect: false, alt: '밀짚모자' },
    { id: 'cap', image: capHat, isCorrect: false, alt: '캡모자' }
  ]
};

const QuestPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [scenarioId, setScenarioId] = useState<string | null>(null);
  const [questId, setQuestId] = useState<string | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [showCorrectScreen, setShowCorrectScreen] = useState(false);
  const [remainingOptions, setRemainingOptions] = useState<typeof quest1.options>(quest1.options);
  
  // URL 쿼리 파라미터에서 시나리오 ID와 퀘스트 ID 가져오기
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const sId = searchParams.get('scenario');
    const qId = searchParams.get('quest');
    setScenarioId(sId);
    setQuestId(qId);
  }, [location]);

  // 옵션 선택 핸들러
  const handleOptionSelect = (optionId: string) => {
    setSelectedOption(optionId);
    setAttempts(prev => prev + 1);
    
    // 선택한 옵션이 정답인지 확인
    const option = quest1.options.find(opt => opt.id === optionId);
    if (option) {
      setIsCorrect(option.isCorrect);

      if (!option.isCorrect) {
        // 오답인 경우, 해당 옵션을 목록에서 제거
        setRemainingOptions(prev => prev.filter(opt => opt.id !== optionId));
        
        // 선택 효과 초기화 (다시 선택할 수 있도록)
        setTimeout(() => {
          setSelectedOption(null);
          setIsCorrect(null);
        }, 1500);
      } else {
        // 정답인 경우, 정답 화면 표시
        setTimeout(() => {
          setShowCorrectScreen(true);

          // 4초 후 점수 화면 표시 후 다음 퀘스트로 이동
          setTimeout(() => {
            setShowScore(true);
            
            setTimeout(() => {
              navigate(`/quest?scenario=${scenarioId}&quest=2`);
            }, 3000);
          }, 3000);
        }, 1000);
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
        src={preDriveBackground}
        alt="주행 전 배경"
        className="absolute w-full h-full object-cover"
      />

      {/* 헤더 영역 */}
      <div className="absolute top-4 right-4 z-10">
        <img
          src={homeButton}
          alt="홈으로"
          className="w-16 h-16 cursor-pointer"
          onClick={handleGoHome}
        />
      </div>
      <BackButton />

      {/* 점수 화면 */}
      {showScore && (
        <div className="absolute inset-0 flex items-center justify-center z-30 bg-black bg-opacity-50">
          <div className="relative">
            <img
              src={scoreBackground}
              alt="점수 배경"
              className="w-96 h-auto"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-5xl font-bold text-yellow-400">+50</span>
            </div>
          </div>
        </div>
      )}

      {/* 정답 화면 */}
      {showCorrectScreen ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="bg-green-100 w-full h-full absolute">
            <img
              src={preDriveBackground}
              alt="배경"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="relative z-10 flex flex-col items-center">
            <h2 className="text-4xl font-bold mb-4">정답입니다!</h2>

            <div className="relative">
              <div className="w-64 h-64 rounded-full bg-green-600 flex items-center justify-center">
                <img
                  src={oldManWithHelmet}
                  alt="헬멧을 쓴 노인"
                  className="w-48 h-auto"
                />
              </div>
            </div>
            <div className="mt-8 bg-white bg-opacity-90 rounded-xl p-6 max-w-lg">
              <p className="text-2xl text-center text-green-800">
                이륜차 운전을 할 때는 혹시 모를 사고에 대비해<br />
                안전모를 착용하는 게 좋겠죠?
              </p>
            </div>
          </div>
        </div>
      ) : (
        // 퀘스트 내용
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4/5">
          <div className="bg-white bg-opacity-90 border-4 border-green-600 rounded-xl p-6 shadow-lg">
            <h2 className="text-3xl font-bold text-center text-green-800 mb-2">
              [{quest1.title}]
            </h2>
            <p className="text-2xl text-center mb-8">
              {quest1.description}
            </p>

            {/* 캐릭터 표시 */}
            <div className="flex justify-center mb-8">
              <img
                src={gameCharacter}
                alt="게임 캐릭터"
                className="w-64 h-auto"
              />
            </div>
            
            {/* 선택지 */}
            <div className="flex justify-center space-x-8 mt-4">
              {remainingOptions.map((option) => (
                <div key={option.id} className="relative">
                  <img
                    src={option.image}
                    alt={option.alt}
                    className={`w-28 h-auto cursor-pointer transition-transform duration-200 
                      ${selectedOption === option.id ? 'scale-110' : 'hover:scale-105'}`}
                    onClick={() => handleOptionSelect(option.id)}
                  />
                  
                  {/* 선택 표시 */}
                  {selectedOption === option.id && !option.isCorrect && (
                    <div className="absolute -top-4 -right-4">
                      <img
                        src={failX}
                        alt="오답"
                        className="w-12 h-12"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestPage;