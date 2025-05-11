// src/pages/quest/HarvestQuest.tsx
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import BackButton from '../../components/ui/BackButton';
import HarvestBox from './HarvestBox';
import HarvestBox2 from './HarvestBox2';

// 이미지 임포트
const fieldRoad = '/assets/images/field_road.png';
const fieldHarvestBoxes = '/assets/images/field_harvest_boxes.png';
const accident = '/assets/images/grandfather_field_accident.png';
const dangerWarning = '/assets/images/danger_warning.png';
const successCircle = '/assets/images/success_circle.png';
const homeButton = '/assets/images/home_button.png';
const starCharacter = '/assets/images/star_character.png';
const grandfaSuccess = '/assets/images/mission4_success_grandfather_cart.png';
const motorcycle = '/assets/images/mission4_motorcycle.png'


// 게임 단계 정의
type GamePhase = 
  | 'intro'         // 시작 화면
  | 'driving'       // 오토바이 주행
  | 'harvestDone'   // 수확물 싣기
  | 'selection'     // 선택지 제공
  | 'successResult' // 정답 선택 결과
  | 'fadeOut'       // 오답 페이드아웃
  | 'failResult'    // 오답 선택 결과
  | 'score';        // 점수 화면

const HarvestQuest = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [scenarioId, setScenarioId] = useState<string | null>(null);
  const [questId, setQuestId] = useState<string | null>(null);
  const [gamePhase, setGamePhase] = useState<GamePhase>('intro');
  const [selectedOption, setSelectedOption] = useState<'A' | 'B' | null>(null);
  //const [isAnimating, setIsAnimating] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [fallbackImage, setFallbackImage] = useState(false);
  const [showWarning, setShowWarning] = useState(false);


  // URL 쿼리 파라미터에서 시나리오 ID와 퀘스트 ID 가져오기
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const sId = searchParams.get('scenario');
    const qId = searchParams.get('quest');
    setScenarioId(sId);
    setQuestId(qId || '5');
    
    // 인트로 화면 후 자동으로 드라이빙 시작
    const timer = setTimeout(() => {
      setGamePhase('driving');
      
      // 운전 애니메이션 후 갈림길 발견 화면으로 전환
      const drivingTimer = setTimeout(() => {
        setGamePhase('harvestDone');
        
        // 포트홀 발견 후 선택지 화면으로 전환
        const alertTimer = setTimeout(() => {
          setGamePhase('selection');
        }, 2000);
        
        return () => clearTimeout(alertTimer);
      }, 5000);
      
      return () => clearTimeout(drivingTimer);
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [location]);
  
  // 선택지 선택 핸들러
  const handleOptionSelect = (option: 'A' | 'B') => {
    setSelectedOption(option);
    
    if (option === 'B') {
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
        }, 4000); //성공 메시지가 나오기까지 5초 걸림=성공메시지표시전에 동그라미 나옴
      }, 1000);
    } else {
      // 오답 선택
      setTimeout(() => {
        setGamePhase('fadeOut');
        setTimeout(() => {
          setGamePhase('failResult');
          setTimeout(() => {
            navigate(`/score?scenario=${scenarioId}&quest=${questId}&score=10&correct=false`);
          }, 10000); //오답 결과 유지 시간
        }, 2500);
      }, 1000);
    }
  };
  
  useEffect(() => {
    if (gamePhase === 'failResult') {
      const timer = setTimeout(() => {
        setShowWarning(true);
      }, 4000); // 2초 후 쓰러진 할부지 이미지

      return () => clearTimeout(timer); // 클린업
    } else {
      setShowWarning(false); // 다시 숨기기
    }
  }, [gamePhase]);

  // 홈으로 이동 핸들러
  const handleGoHome = () => {
    navigate('/');
  };

  // 이미지 오류 핸들러
  const handleImageError = () => {
    setFallbackImage(true);
  };

  // 타이틀 텍스트 렌더링 함수 - 고대비 스타일 적용
  const renderTitleText = (text: string, fontSize = "6rem", color = "text-green-600") => (
      <h1 className={`absolute top-[23%] left-1/2 transform -translate-x-1/2 font-extrabold ${color} px-8 py-3 whitespace-nowrap`}
          style={{ 
            fontSize,
            textShadow: '2px 2px 0 #FFF, -2px -2px 0 #FFF, 2px -2px 0 #FFF, -2px 2px 0 #FFF',
            WebkitTextStroke: '1px white'
          }}>
        {text}
      </h1>
  );

  return (
    <div className="w-full h-full">
      {/* 배경 - 게임 단계에 따라 다른 배경 표시 */}
      {(gamePhase !== 'fadeOut') && (
        <img
          src={gamePhase === 'harvestDone' || gamePhase === 'selection' ? fieldHarvestBoxes : fieldRoad}
          alt="갈림길 배경"
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
      
      {/* 인트로 화면 */}
      {gamePhase === 'intro' && <HarvestBox />}

      {/* 주행 화면 */}
      {gamePhase === 'driving' && (
        <div className="absolute inset-0">
          <HarvestBox2 />
          {/* 텍스트 상단에 표시 */}
          <div className="absolute top-20 left-1/2 transform -translate-x-1/2">
            {renderTitleText('작업 완료')}
          </div>
        </div>
      )}
      
      {/* 수확 완료 화면 
      {gamePhase === 'harvestDone' && (
        <div className="absolute inset-0">
          <div className="absolute top-20 left-1/2 transform -translate-x-1/2">
          {renderTitleText('작업 완료')}
          </div>
        </div>
      )}
      */}

      {/* 선택지 화면 - 오토바이 제거 */}
      {gamePhase === 'selection' && (
        <div className="absolute inset-0">
          {/* 배경 불투명도 효과 */}
          <div className="absolute inset-0 bg-white bg-opacity-50 z-0"></div>
          
          <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
            {/* 선택지 제목 및 설명 */}
            <div className="bg-white bg-opacity-80 border-8 border-green-600 rounded-3xl p-6 mb-8 w-[75%]">
              <h2 className="text-5xl font-extrabold text-green-600 text-center mb-4">무거운 짐 싣기</h2>
              <p className="text-4xl font-bold text-black text-center">
                드디어 작업이 끝났어요<br/>
                수확한 농작물을 이륜차에 싣고 싶어요<br/>
                어떻게 옮길까요?
              </p>
            </div>
            
            {/* 선택지 버튼 */}
            <div className="flex justify-center space-x-10 w-4/5">
              <button
                className={`w-[40%] bg-green-600 bg-opacity-70
                border-8 border-green-600 rounded-xl p-4
                text-3xl font-bold text-white 
                transition duration-300 
                ${selectedOption === 'A' ? 
                'bg-green-600 scale-105 bg-opacity-95' : 'hover:bg-green-600'}`}
                onClick={() => handleOptionSelect('A')}
                disabled={!!selectedOption}
              >
                이륜차를 논밭으로<br/> 끌고 내려가 <br/> 짐을 싣고 나온다
              </button>
              
              <button
                className={`w-[40%] bg-green-600 bg-opacity-70
                border-8 border-green-600 rounded-xl p-4
                text-3xl font-bold text-white
                transition duration-300 
                ${selectedOption === 'B' ? 
                'bg-green-600 scale-105 bg-opacity-95' : 'hover:bg-green-600'}`}
                onClick={() => handleOptionSelect('B')}
                disabled={!!selectedOption}
              >
                손수레를 이용해<br/> 이륜차까지<br/> 짐을 옮겨 싣는다
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
                <>
                <img 
                  src={grandfaSuccess}
                  alt="수레 끄시는 할아버지" 
                  className="absolute left-[20%] w-[35%] h-auto object-contain z-40"
                  onError={handleImageError}
                />
                <img 
                  src={motorcycle}
                  alt="오토바이" 
                  className="absolute right-[26%] w-[25%] object-contain z-50"
                  onError={handleImageError}
                />
                </>
              ) : (
                <img 
                  src="/assets/images/character_with_helmet.png"  
                  alt="헬멧 쓴 캐릭터" 
                  className="w-2/5 h-auto object-contain"
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
                어르신의 안전과<br/>
                소중한 자산을 보호하는 <br/> 현명한 선택이에요
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
            src={accident}
            alt="사고 장면"
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* 3초 후에 등장 */}
          {showWarning && (
          <div className="absolute inset-0 bg-white bg-opacity-30 flex flex-col items-center justify-end pb-32 z-10">
            <img 
              src={dangerWarning} 
              alt="위험 경고" 
              className="w-[16%] mb-1" //간격 조절 여기서
            />
            
            <div className="w-[80%] bg-white bg-opacity-80 border-red-600 border-8 rounded-xl p-8 text-center">
              <h2 className="text-6xl font-extrabold text-red-600 mb-4">이륜차에 깔렸어요!</h2>
              <p className="text-4xl font-extrabold text-black">
                논밭에서 이륜차는 전복되기 쉬워요<br />
                도로에 두고 짐을 옮겨야 안전해요
              </p>
            </div>
          </div>
        )}
        </div>
      )}
    </div>
  );
};

export default HarvestQuest;