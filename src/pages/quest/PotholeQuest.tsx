// src/pages/quest/PotholeQuest.tsx
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion'; // framer-motion 추가
import RoadGameComponent from '../../components/game/RoadGameComponent';
import { postQuestAttempt, AttemptPayload } from '../../services/endpoints/attempts';

// 이미지 임포트 (기존과 동일)
const basicRoad = '/assets/images/basic_road.png';
const roadWithPotholes = '/assets/images/road_with_small_pothole.png';
const motorcycle = '/assets/images/motorcycle.png';
const potholeAccident = '/assets/images/pothole_flat_tire.png';
const accidentTurnoff = '/assets/images/accident_turnoff_gfa.png';
const dangerWarning = '/assets/images/danger_warning.png';
const successCircle = '/assets/images/success_circle.png';
const homeButton = '/assets/images/home_button.png';
const starCharacter = '/assets/images/star_character.png';

// 게임 단계 정의 (기존과 동일)
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
  
  // 추가: 경고 메시지 표시 여부
  const [showWarning, setShowWarning] = useState(false);

  // URL 쿼리 파라미터에서 시나리오 ID와 퀘스트 ID 가져오기
  useEffect(() => {
    // 기존 코드 유지
    const searchParams = new URLSearchParams(location.search);
    const sId = searchParams.get('scenario');
    const qId = searchParams.get('quest');
    setScenarioId(sId);
    setQuestId(qId || '2');
  }, [location]);

  // 새로 추가: failResult 단계에서 시간차를 두고 경고 메시지 표시
  useEffect(() => {
    if (gamePhase === 'failResult') {
      const timer = setTimeout(() => {
        setShowWarning(true);
      }, 2000); // 2초 후 경고 메시지 표시

      return () => clearTimeout(timer); // 클린업
    } else {
      setShowWarning(false); // 다시 숨기기
    }
  }, [gamePhase]);

  // 포트홀 충돌 핸들러 (기존과 동일)
  const handlePotholeCollision = () => {
    // 기존 코드 유지
    console.log('PotholeQuest: 포트홀 충돌 핸들러 호출됨');
    
    if (gamePhase !== 'driving') {
      console.log('이미 다른 단계로 전환됨, 무시합니다:', gamePhase);
      return;
    }
    
    setGamePhase('selection');
    console.log('포트홀 충돌 감지: 선택지 화면으로 전환됨');
  };
  
  // 선택지 선택 핸들러 (기존과 동일)
  const handleOptionSelect = (option: 'A' | 'B') => {
    setSelectedOption(option);
    
    // 정재 : 퀘스트 시도 & 점수 반영 API
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
        
        // 첫 번째 성공 메시지 표시
        setTimeout(() => {
          setShowSuccessMessage(true);
          
          // 5초 후 점수 화면으로 이동
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
          }, 5000); // 오답 결과 유지 시간
        }, 1500);
      }, 1000);
    }
  };
  
  // 나머지 함수 (기존과 동일)
  const handleGoHome = () => {
    navigate('/');
  };

  const handleImageError = () => {
    setFallbackImage(true);
  };

  const renderTitleText = (text: string, fontSize = "text-5xl", color = "text-green-600") => (
    <div className="relative inline-block">
      <h1 className={`${fontSize} font-extrabold ${color} px-8 py-3`}
          style={{ 
            textShadow: '2px 2px 0 #FFF, -2px -2px 0 #FFF, 2px -2px 0 #FFF, -2px 2px 0 #FFF',
            WebkitTextStroke: '1px white'
          }}>
        {text}
      </h1>
    </div>
  );

  return (
    <div className="w-full h-full">
      {/* 배경 - 게임 단계에 따라 다른 배경 표시 */}
      {gamePhase === 'driving' ? (
        // Phaser 게임 렌더링 - 전체 화면으로 조정
        <div className="absolute inset-0 w-full h-full">
          <RoadGameComponent onPotholeCollision={handlePotholeCollision} />
        </div>
      ) : (
        // 정적 배경 이미지
        <img
          src={gamePhase === 'potholeAlert' || gamePhase === 'selection' ? roadWithPotholes : basicRoad}
          alt="주행 배경"
          className="absolute w-full h-full object-cover"
        />
      )}
      
      {/* 헤더 영역 */}
      {(gamePhase !== 'fadeOut' && gamePhase !== 'failResult') && (
        <div className="absolute top-4 right-4 z-10">
          <img
            src={homeButton}
            alt="홈으로"
            className="w-16 h-16 cursor-pointer"
            onClick={handleGoHome}
          />
        </div>
      )}
      {(gamePhase !== 'fadeOut' && gamePhase !== 'failResult')}
      
      {/* 포트홀 경고 화면 */}
      {gamePhase === 'potholeAlert' && (
        <div className="absolute inset-0">
          {/* 경고 텍스트만 상단에 표시 */}
          <div className="absolute top-20 left-1/2 transform -translate-x-1/2">
            {renderTitleText('앞에 구덩이가 있어요!')}
          </div>
        </div>
      )}
      
      {/* 선택지 화면 - 오토바이 제거 */}
      {gamePhase === 'selection' && (
        <div className="absolute inset-0">
          {/* 배경 불투명도 효과 */}
          <div className="absolute inset-0 bg-[#FFF9C4]/60 z-0"></div>
          
          <div className="absolute inset-x-0 top-20 bottom-0 flex flex-col items-center justify-center z-10">
            {/* 선택지 제목 및 설명 */}
            <div className="bg-white bg-opacity-90 border-8 border-green-600 rounded-3xl p-6 mb-8 w-[75%]">
              <h2 className="text-5xl font-extrabold text-green-600 text-center mb-4">구덩이 조심</h2>
              <p className="text-[2.2rem] font-extrabold text-black text-center">
                앞에 큰 구덩이가 있어요!<br/>
                구덩이를 지날 때는 핸들 통제가 어려워져요.<br/>
                어떻게 운전할까요?
              </p>
            </div>
            {/* 선택지 버튼 */}
            <div className="flex justify-between w-[75%]">
              <button
                className={`w-[48%] bg-green-600 bg-opacity-80
                border-8 border-green-600 rounded-xl p-4
                text-3xl font-extrabold text-white 
                transition duration-300 focus:outline-none focus:ring-0

                ${selectedOption === 'A' 
                  ? 'bg-green-600 scale-105 bg-opacity-95' 
                  : 'hover:bg-green-600'}`}
                onClick={() => handleOptionSelect('A')}
                disabled={!!selectedOption}
              >
                속도를 줄이고 <br/>구덩이를 피해 <br/>조심히 지나간다
              </button>
              
              <button
                className={`w-[48%] bg-green-600 bg-opacity-80
                border-8 border-green-600 rounded-xl p-4
                text-3xl font-extrabold text-white
                transition duration-300
                focus:outline-none focus:ring-0

                ${selectedOption === 'B' 
                ? 
                'bg-green-600 scale-105 bg-opacity-95' : 'hover:bg-green-600'}`}
                onClick={() => handleOptionSelect('B')}
                disabled={!!selectedOption}
              >
                빨리 지나가면 <br/>덜 흔들릴 것 같아 <br/>속도를 높여 지나간다
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* 정답 결과 화면 - 오토바이 제거 */}
      {gamePhase === 'successResult' && !showSuccessMessage && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {/* 중앙에 큰 success_circle 이미지 */}
          <div className="absolute inset-0 flex items-center justify-center">
            <img
              src={successCircle} 
              alt="성공 원" 
              className="absolute w-[100vw] h-[100vw] object-contain z-10"
            />
            {/* 그 위에 오토바이 운전하는 할아버지 이미지 */}
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
      
      {/* 정답 후 성공 메시지 화면 - 오토바이 제거 */}
      {gamePhase === 'successResult' && showSuccessMessage && (
        <div className="absolute inset-0 bg-[#FFF9C4]/60 flex flex-col items-center justify-center z-10">
          {/* 중앙 상단에 정답입니다! */}
          <div className="absolute top-[20%] text-6xl font-extrabold text-green-700 left-1/2 transform -translate-x-1/2 z-20">
          정답입니다!
          </div>
          
          {/* 중앙에 녹색 박스에 메시지 */}
          <div className="mt-10 bg-green-600 bg-opacity-90 border-green-700 border-8  rounded-3xl p-10 w-[73%] mx-auto text-center relative">
              <p className="text-5xl font-extrabold text-white ">
              휴, 속도를 줄인 덕분에<br />
              구덩이를 잘 피했어요
            </p>
            </div>
            {/* 좌측 하단 별별이 캐릭터 */}
            <img 
            src={starCharacter} 
            alt="별별이" 
            className="absolute bottom-[15%] left-[3%] w-[23%] z-30"
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
      
      {/* 오답 결과 화면 - 수정된 부분 */}
      {gamePhase === 'failResult' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {/* 배경 이미지 - 즉시 표시 */}
          <img
            src={potholeAccident}
            alt="사고 장면"
            className="absolute inset-0 w-full h-full object-cover"
          />
          
          {/* 애니메이션 컨테이너 - showWarning 상태에 따라 표시 */}
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
                className="w-[16%] mb-1" //간격 조절 여기서
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              />
              
              <motion.div 
                className="w-[80%] bg-white bg-opacity-80 border-red-600 border-8 rounded-xl p-8 text-center"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <h2 className="text-6xl font-extrabold text-red-600 mb-4">이륜차가 기우뚱!</h2>
                <p className="text-4xl font-extrabold text-black">
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