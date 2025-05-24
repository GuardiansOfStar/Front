// src/pages/quest/PotholeQuest.tsx
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import RoadGameComponent from '../../components/game/RoadGameComponent';
import { postQuestAttempt, AttemptPayload } from '../../services/endpoints/attempts';
import { useScale } from '../../hooks/useScale';

// 이미지 임포트
const basicRoad = '/assets/images/basic_road.png';
const roadWithPotholes = '/assets/images/road_with_small_pothole.png';
const motorcycle = '/assets/images/motorcycle.png';
const potholeAccident = '/assets/images/grandfather_pothole_accident.png';
const accidentTurnoff = '/assets/images/accident_turnoff_gfa.png';
const dangerWarning = '/assets/images/danger_warning.png';
const successCircle = '/assets/images/success_circle.png';
const homeButton = '/assets/images/home_button.png';
const starCharacter = '/assets/images/star_character.png';

// 게임 단계 정의
type GamePhase = 
  | 'driving'       // 오토바이 주행 (Phaser 게임)
  | 'potholeAlert'  // 포트홀 발견
  | 'selection'     // 선택지 제공
  | 'successResult' // 정답 선택 결과
  | 'fadeOut'       // 오답 페이드아웃
  | 'failResult'    // 오답 선택 결과
  | 'score';        // 점수 화면

const PotholeQuest = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [scenarioId, setScenarioId] = useState<string | null>(null);
  const [questId, setQuestId] = useState<string | null>(null);
  const [gamePhase, setGamePhase] = useState<GamePhase>('driving');
  const [selectedOption, setSelectedOption] = useState<'A' | 'B' | null>(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [fallbackImage, setFallbackImage] = useState(false);
  const [showWarning, setShowWarning] = useState(false);

  const scale = useScale();

  // URL 쿼리 파라미터에서 시나리오 ID와 퀘스트 ID 가져오기
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const sId = searchParams.get('scenario');
    const qId = searchParams.get('quest');
    setScenarioId(sId);
    setQuestId(qId || '2');
  }, [location]);

  // failResult 단계에서 시간차를 두고 경고 메시지 표시
  useEffect(() => {
    if (gamePhase === 'failResult') {
      const timer = setTimeout(() => {
        setShowWarning(true);
      }, 2000);

      return () => clearTimeout(timer);
    } else {
      setShowWarning(false);
    }
  }, [gamePhase]);

  // 포트홀 충돌 핸들러
  const handlePotholeCollision = () => {
    console.log('PotholeQuest: 포트홀 충돌 핸들러 호출됨');
    
    if (gamePhase !== 'driving') {
      console.log('이미 다른 단계로 전환됨, 무시합니다:', gamePhase);
      return;
    }
    
    setGamePhase('selection');
    console.log('포트홀 충돌 감지: 선택지 화면으로 전환됨');
  };
  
  // 선택지 선택 핸들러
  const handleOptionSelect = (option: 'A' | 'B') => {
    setSelectedOption(option);
    
    // API 호출
    const isCorrect = option === 'A';
    const scoreAwarded = isCorrect ? 20 : 10;

    const sessionId = localStorage.getItem('session_id')!;
    const qId = "pothole";
    const payload: AttemptPayload = {
      attempt_number: 1,
      score_awarded: scoreAwarded,
      selected_option: option,
      is_correct: isCorrect,
      response_time: 0,
    };

    postQuestAttempt(sessionId, qId, payload)
      .then((res) => {console.log('✅ 시도 기록 완료:', res.data.attempt_id);})
      .catch((err) => {console.error('❌ 시도 기록 실패', err);});

    if (option === 'A') {
      // 정답 선택
      setTimeout(() => {
        setGamePhase('successResult');
        
        setTimeout(() => {
          setShowSuccessMessage(true);
          
          setTimeout(() => {
            navigate(`/score?scenario=${scenarioId}&quest=${questId}&score=20&correct=true`);
          }, 5000);
        }, 2000);
      }, 1000);
    } else {
      // 오답 선택
      setTimeout(() => {
        setGamePhase('fadeOut');
        setTimeout(() => {
          setGamePhase('failResult');
          setTimeout(() => {
            navigate(`/score?scenario=${scenarioId}&quest=${questId}&score=10&correct=false`);
          }, 5000);
        }, 1500);
      }, 1000);
    }
  };
  
  const handleGoHome = () => {
    navigate('/');
  };

  const handleImageError = () => {
    setFallbackImage(true);
  };

  const renderTitleText = (text: string) => (
    <div className="relative inline-block">
      <h1 
        className="font-extrabold text-green-600 px-8 py-3"
        style={{ 
          fontSize: `calc(3rem * ${scale})`,
          textShadow: '2px 2px 0 #FFF, -2px -2px 0 #FFF, 2px -2px 0 #FFF, -2px 2px 0 #FFF',
          WebkitTextStroke: '1px white'
        }}
      >
        {text}
      </h1>
    </div>
  );

  return (
    <div className="w-full h-full">
      {/* 배경 */}
      {gamePhase === 'driving' ? (
        <div className="absolute inset-0 w-full h-full">
          <RoadGameComponent onPotholeCollision={handlePotholeCollision} />
        </div>
      ) : (
        <img
          src={gamePhase === 'potholeAlert' || gamePhase === 'selection' ? roadWithPotholes : basicRoad}
          alt="주행 배경"
          className="absolute w-full h-full object-cover"
        />
      )}
      
      {/* 헤더 영역 */}
      {(gamePhase !== 'fadeOut' && gamePhase !== 'failResult') && (
        <div 
          className="absolute z-10"
          style={{
            top: `calc(16px * ${scale})`,
            right: `calc(16px * ${scale})`
          }}
        >
          <img
            src={homeButton}
            alt="홈으로"
            style={{
              width: `calc(64px * ${scale})`,
              height: `calc(64px * ${scale})`
            }}
            className="cursor-pointer"
            onClick={handleGoHome}
          />
        </div>
      )}
      
      {/* 포트홀 경고 화면 */}
      {gamePhase === 'potholeAlert' && (
        <div className="absolute inset-0">
          <div 
            className="absolute left-1/2 transform -translate-x-1/2"
            style={{ top: `calc(80px * ${scale})` }}
          >
            {renderTitleText('앞에 구덩이가 있어요!')}
          </div>
        </div>
      )}
      
      {/* 선택지 화면 */}
      {gamePhase === 'selection' && (
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[#FFF9C4]/60 z-0"></div>
          
          <div 
            className="absolute inset-x-0 bottom-0 flex flex-col items-center justify-center z-10"
            style={{ top: `calc(80px * ${scale})` }}
          >
            {/* 선택지 제목 및 설명 */}
            <div 
              className="bg-white bg-opacity-90 border-8 border-green-600 rounded-3xl w-[75%]"
              style={{ 
                padding: `calc(24px * ${scale})`,
                marginBottom: `calc(32px * ${scale})`
              }}
            >
              <h2 
                className="font-extrabold text-green-600 text-center"
                style={{ 
                  fontSize: `calc(3rem * ${scale})`,
                  marginBottom: `calc(16px * ${scale})`
                }}
              >
                구덩이 조심
              </h2>
              <p
                className="text-black text-center font-extrabold"
                style={{ fontSize: `calc(2.2rem * ${scale})` }}
              >
                앞에 큰 구덩이가 있어요!<br/>
                구덩이를 지날 때는 핸들 통제가 어려워져요.<br/>
                어떻게 운전할까요?
              </p>
            </div>

            {/* 선택지 버튼 */}
            <div className="flex justify-between w-[75%]">
              <button
                className={`w-[48%] bg-green-600 bg-opacity-80
                border-8 border-green-600 rounded-xl
                font-extrabold text-white 
                transition duration-300 focus:outline-none focus:ring-0
                ${selectedOption === 'A' 
                  ? 'bg-green-600 scale-105 bg-opacity-95' 
                  : 'hover:bg-green-600'}`}
                style={{ 
                  fontSize: `calc(1.875rem * ${scale})`,
                  padding: `calc(16px * ${scale})`
                }}
                onClick={() => handleOptionSelect('A')}
                disabled={!!selectedOption}
              >
                속도를 줄이고 <br/>구덩이를 피해 <br/>조심히 지나간다
              </button>
              
              <button
                className={`w-[48%] bg-green-600 bg-opacity-80
                border-8 border-green-600 rounded-xl
                font-extrabold text-white
                transition duration-300
                focus:outline-none focus:ring-0
                ${selectedOption === 'B' 
                ? 'bg-green-600 scale-105 bg-opacity-95' : 'hover:bg-green-600'}`}
                style={{ 
                  fontSize: `calc(1.875rem * ${scale})`,
                  padding: `calc(16px * ${scale})`
                }}
                onClick={() => handleOptionSelect('B')}
                disabled={!!selectedOption}
              >
                빨리 지나가면 <br/>덜 흔들릴 것 같아 <br/>속도를 높여 지나간다
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* 정답 결과 화면 */}
      {gamePhase === 'successResult' && !showSuccessMessage && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="bg-green-100 w-full h-full absolute">
            <img
              src={basicRoad}
              alt="배경"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="absolute inset-0 flex items-center justify-center">
            <img
              src={successCircle} 
              alt="성공 원" 
              className="absolute w-[100vw] h-[100vw] object-contain z-10"
            />
            <div className="absolute inset-0 flex items-center justify-center z-20">
              <img 
                src="/assets/images/mission2_success_grandfather.png"  
                alt="오토바이 운전하는 할아버지" 
                className="object-contain z-40"
                onError={handleImageError}
              />
            </div>
          </div>
        </div>
      )}
      
      {/* 정답 후 성공 메시지 화면 */}
      {gamePhase === 'successResult' && showSuccessMessage && (
        <div className="absolute inset-0 bg-[#FFF9C4]/60 flex flex-col items-center justify-center z-10">
          {/* 중앙 상단에 정답입니다! */}
          <div 
            className="absolute left-1/2 transform -translate-x-1/2 z-20 font-extrabold"
            style={{ 
              top: '20%',
              fontSize: `calc(4rem * ${scale})`
            }}
          >
            정답입니다!
          </div>
          
          {/* 중앙에 녹색 박스에 메시지 */}
          <div 
            className="bg-green-600 bg-opacity-90 border-green-700 border-8 rounded-3xl w-[73%] mx-auto text-center relative"
            style={{ 
              marginTop: `calc(40px * ${scale})`,
              padding: `calc(40px * ${scale})`
            }}
          >
            <p 
              className="font-extrabold text-white"
              style={{ fontSize: `calc(3rem * ${scale})` }}
            >
              휴, 속도를 줄인 덕분에<br />
              구덩이를 잘 피했어요
            </p>
          </div>

          {/* 좌측 하단 별별이 캐릭터 */}
          <img 
            src={starCharacter} 
            alt="별별이" 
            className="absolute z-30"
            style={{
              bottom: `calc(15% * ${scale})`,
              left: `calc(3% * ${scale})`,
              width: `calc(23% * ${scale})`
            }}
          />
        </div>
      )}
      
      {/* 페이드아웃 화면 */}
      {gamePhase === 'fadeOut' && (
        <img
          src="/assets/images/accident_fadeout.png"
          alt="전환 이미지"
          className="absolute inset-0 w-full h-full object-cover z-50 opacity-0 animate-fadein"
        />
      )}
      
      {/* 오답 결과 화면 */}
      {gamePhase === 'failResult' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <img
            src={potholeAccident}
            alt="사고 장면"
            className="absolute inset-0 w-full h-full object-cover"
          />
          
          {showWarning && (
            <motion.div 
              className="absolute inset-0 bg-[#FFF9C4]/60 flex flex-col items-center justify-end z-10"
              style={{ paddingBottom: `calc(128px * ${scale})` }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              <motion.img 
                src={dangerWarning} 
                alt="위험 경고" 
                style={{ 
                  width: `calc(16% * ${scale})`,
                  marginBottom: `calc(4px * ${scale})`
                }}
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              />
              
              <motion.div 
                className="w-[80%] bg-white bg-opacity-80 border-red-600 border-8 rounded-xl text-center"
                style={{ padding: `calc(32px * ${scale})` }}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <h2 
                  className="text-red-600 font-extrabold"
                  style={{ 
                    fontSize: `calc(4rem * ${scale})`,
                    marginBottom: `calc(16px * ${scale})`
                  }}
                >
                  이륜차가 기우뚱!
                </h2>
                <p 
                  className="font-extrabold text-black"
                  style={{ fontSize: `calc(2.5rem * ${scale})` }}
                >
                  구덩이는 도로 위 함정과 같아요.<br />
                  속도를 줄이고 지나가야 안전해요.
                </p>
              </motion.div>
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
};

export default PotholeQuest;