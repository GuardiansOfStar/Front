// src/pages/quest/PotholeQuest.tsx
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import BackButton from '../../components/ui/BackButton';
import RoadGameComponent from '../../components/game/RoadGameComponent';

// 이미지 임포트
const basicRoad = '/assets/images/basic_road.png';
const roadWithPotholes = '/assets/images/road_with_small_pothole.png';
const motorcycle = '/assets/images/motorcycle.png';
const potholeAccident = '/assets/images/pothole_flat_tire.png';
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
  
  // URL 쿼리 파라미터에서 시나리오 ID와 퀘스트 ID 가져오기
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const sId = searchParams.get('scenario');
    const qId = searchParams.get('quest');
    setScenarioId(sId);
    setQuestId(qId || '2');
  }, [location]);
  
  // 포트홀 충돌 핸들러 (Phaser 게임에서 호출됨)
  const handlePotholeCollision = () => {
    // 포트홀 발견 후 선택지 화면으로 전환
    setGamePhase('selection');
    
    setTimeout(() => {
      setGamePhase('selection');
    }, 2000);
  };
  
  // 선택지 선택 핸들러
  const handleOptionSelect = (option: 'A' | 'B') => {
    setSelectedOption(option);
    
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
          }, 3000);
        }, 1500);
      }, 1000);
    }
  };
  
  // 홈으로 이동 핸들러
  const handleGoHome = () => {
    navigate('/');
  };

  // 이미지 오류 핸들러
  const handleImageError = () => {
    setFallbackImage(true);
  };

  // 타이틀 텍스트 렌더링 함수 - 고대비 스타일 적용
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
    <div className="relative w-full h-full">
      {/* 게임 단계에 따라 다른 배경 표시 */}
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
      {(gamePhase !== 'fadeOut' && gamePhase !== 'failResult') && <BackButton />}
      
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
          <div className="absolute inset-0 bg-white bg-opacity-50 z-0"></div>
          
          <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
            {/* 선택지 제목 및 설명 */}
            <div className="bg-white bg-opacity-80 border-8 border-green-600 rounded-3xl p-6 mb-8 w-[75%]">
              <h2 className="text-5xl font-extrabold text-green-600 text-center mb-4">구덩이 조심</h2>
              <p className="text-4xl font-bold text-black text-center">
                앞에 큰 구덩이가 있어요!<br/>
                구덩이를 지날 때는 핸들 통제가 어려워져요.<br/>
                어떻게 운전할까요?
              </p>
            </div>
            
            {/* 선택지 버튼 */}
            <div className="flex justify-center space-x-10 w-4/5">
              <button
                className={`w-[40%] bg-green-600 bg-opacity-70
                border-8 border-green-600 rounded-xl p-4
                text-3xl font-bold text-white 
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
                className={`w-[40%] bg-green-600 bg-opacity-70
                border-8 border-green-600 rounded-xl p-4
                text-3xl font-bold text-white
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
              className="absolute w-full h-full object-contain z-10"
            />
            
            {/* 그 위에 오토바이 운전하는 할아버지 이미지 */}
            <div className="absolute inset-0 flex items-center justify-center z-20">
              {!fallbackImage ? (
                <img 
                  src="/assets/images/mission2_success(grandfa).png"  
                  alt="오토바이 운전하는 할아버지" 
                  className="w-1/2 h-auto object-contain z-40"
                  onError={handleImageError}
                />
              ) : (
                <img 
                  src="/assets/images/character_with_helmet.png"  
                  alt="헬멧 쓴 캐릭터" 
                  className="w-1/5 h-auto object-contain"
                />
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* 정답 후 성공 메시지 화면 - 오토바이 제거 */}
      {gamePhase === 'successResult' && showSuccessMessage && (
        <div className="absolute inset-0 bg-white bg-opacity-30 flex flex-col items-center justify-center z-10">
          {/* 중앙 상단에 정답입니다! */}
          <div className="absolute top-[20%] text-6xl font-extrabold text-green-700 left-1/2 transform -translate-x-1/2 z-20">
          정답입니다!
          </div>
          
          {/* 중앙에 녹색 박스에 메시지 */}
          <div className="mt-10 bg-green-600 bg-opacity-60 border-green-700 border-8  rounded-3xl p-10 w-[75%] mx-auto text-center relative">
              <p className="text-4xl font-extrabold text-white">
              휴, 속도를 줄인 덕분에<br />
              구덩이를 잘 피했어요
            </p>
            </div>
            {/* 좌측 하단 별별이 캐릭터 */}
            <img 
            src={starCharacter} 
            alt="별별이" 
            className="absolute bottom-[10%] left-[5%] w-[27%] z-30"
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
          
          <div className="absolute inset-0 bg-white bg-opacity-30 flex flex-col items-center justify-end pb-32 z-10">
            <img 
              src={dangerWarning} 
              alt="위험 경고" 
              className="w-[16%] mb-1" //간격 조절 여기서
            />
            
            <div className="w-[80%] bg-white bg-opacity-80 border-red-600 border-8 rounded-xl p-8 text-center">
              <h2 className="text-6xl font-extrabold text-red-600 mb-4">이륜차가 기우뚱!</h2>
              <p className="text-4xl font-extrabold text-black">
                구덩이는 도로 위 함정과 같아요.<br />
                속도를 줄이고 지나가야 안전해요.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PotholeQuest;