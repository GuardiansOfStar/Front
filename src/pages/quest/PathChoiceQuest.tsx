// src/pages/quest/PotholeQuest.tsx
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from "framer-motion";
import RoadSliding from './RoadSliding';
import HomeButton from '../../components/ui/HomeButton';
import GameTitle from '../../components/ui/GameTitle';

// 이미지 임포트
const basicRoad = '/assets/images/basic_road.png';
const twoPathScene = '/assets/images/two_path_scene.png';
const motorcycle = '/assets/images/motorcycle.png';
const accidentTurnoff = '/assets/images/accident_turnoff_gfa.png';
const dangerWarning = '/assets/images/danger_warning.png';
const successCircle = '/assets/images/success_circle.png';
const homeButton = '/assets/images/home_button.png';
const starCharacter = '/assets/images/star_character.png';
const grandfaRushing = '/assets/images/mission5_success_gfa.png';
const successRoad = '/assets/images/success_road.png';
const successBackground = '/assets/images/success_road_background.png';


// 게임 단계 정의
type GamePhase = 
  | 'intro'         // 시작 화면
  | 'driving'       // 오토바이 주행
  | 'twoPathsNotice'// 갈림길 발견
  | 'selection'     // 선택지 제공
  | 'successResult' // 정답 선택 결과
  | 'fadeOut'       // 오답 페이드아웃
  | 'failResult'    // 오답 선택 결과
  | 'score';        // 점수 화면

const PathChoiceQuest = () => {
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
        setGamePhase('twoPathsNotice');
        
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
          }, 5000);
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

  // 이미지 오류 핸들러
  const handleImageError = () => {
    setFallbackImage(true);
  };

  return (
    <div className="w-full h-full">
      {/* 배경 - 게임 단계에 따라 다른 배경 표시 */}
      {(gamePhase !== 'driving' && gamePhase !== 'fadeOut') && (
        <img
          src={gamePhase === 'twoPathsNotice' || gamePhase === 'selection' ? twoPathScene : gamePhase === 'successResult' ? successBackground : basicRoad}
          alt="갈림길 배경"
          className="absolute w-full h-full object-cover"
        />
      )}
      {/*배경 흐리게 처리*/}
      {(gamePhase !== 'intro' && gamePhase !== 'driving' && gamePhase !== 'failResult' ) && (
      <div className="absolute inset-0 bg-[#FFF9C4]/60 z-10"></div>
      )}

      {/* 헤더 영역 */}
      {(gamePhase !== 'fadeOut' && gamePhase !== 'failResult') && (
        <HomeButton />
      )}
      
      {/* 인트로 화면 */}
      {gamePhase === 'intro' && (
        <div className="absolute inset-0 w-full h-full flex flex-col items-center">
          {/* 상단 마진 추가하고 justify-center 제거 */}
          <div className="mt-24">
            <GameTitle text="집 가는 길" fontSize="text-[5.25rem]" strokeWidth="12px" />
          </div>
          
          {/* 오토바이 중앙 하단에 크게 표시 - 변경 없음 */}
          <div className="absolute bottom-0 w-full flex justify-center">
            <img 
              src={motorcycle} 
              alt="이륜차" 
              style={{
                width: '80%', // 60%에서 80%로 확대
                maxHeight: '60vh', // 50vh에서 60vh로 확대
                objectFit: 'contain',
                objectPosition: 'bottom'
              }}
            />
          </div>
        </div>
      )}
      
      {/* 주행 화면 */}
      {gamePhase === 'driving' && <RoadSliding />}

      
      {/* 갈림길 등장 화면 */}
      {gamePhase === 'twoPathsNotice' && (
        <div className="absolute inset-0">
          {/* 갈림길 텍스트를 z-index 높게 설정해 배경보다 앞에 보이도록 함 */}
          <div className="absolute top-24 left-0 right-0 flex justify-center z-20">
            <GameTitle text="앞에 갈림길이 있어요!" fontSize="text-[5.25rem]" strokeWidth="12px" />
          </div>
          
          {/* 오토바이 화면 하단에 크게 배치 - 변경 없음 */}
          <div className="absolute bottom-0 w-full flex justify-center">
            <img
              src={motorcycle}
              alt="이륜차"
              className="w-4/5 max-h-[50vh] object-contain object-bottom z-10"
            />
          </div>
        </div>
      )}
      
      {/* 선택지 화면 - 오토바이 제거 */}
      {gamePhase === 'selection' && (
        <div className="absolute inset-0">
          <div className="absolute inset-0 top-14 flex flex-col items-center justify-center z-10">
            {/* 선택지 제목 및 설명 */}
            <div className="bg-white bg-opacity-80 border-8 border-green-600 rounded-3xl p-4 mb-8 w-[75%]">
              <h2 className="text-5xl font-extrabold text-green-600 text-center mb-4">집 가는 길 선택하기</h2>
              <p className="text-4xl font-extrabold text-black text-center leading-relaxed">
                집에 갈 수 있는 두 개의 길이 있어요<br/>
                지름길과 깔끔한 도로 중<br/>
                어느 쪽으로 갈까요?
              </p>
            </div>
            
            {/* 선택지 버튼 */}
            <div className="flex justify-between w-[75%]">
              <button
                className={`w-[48%] bg-green-600 bg-opacity-70
                border-8 border-green-600 rounded-xl p-4
                text-3xl font-bold text-white 
                transition duration-300
                ${selectedOption === 'A' ? 
                'bg-green-600 scale-105 bg-opacity-95' : 'hover:bg-green-600'}`}
                onClick={() => handleOptionSelect('A')}
                disabled={!!selectedOption}
              >
                집까지 5분,<br/> 울퉁불퉁 비포장 도로 <br/> 지름길로 가기
              </button>
              
              <button
                className={`w-[48%] bg-green-600 bg-opacity-70
                border-8 border-green-600 rounded-xl p-4
                text-3xl font-bold text-white
                transition duration-300 
                ${selectedOption === 'B' 
                ? 'bg-green-600 scale-105 bg-opacity-95' : 'hover:bg-green-600'}`}
                onClick={() => handleOptionSelect('B')}
                disabled={!!selectedOption}
              >
                집까지 10분,<br/> 깔끔하게 정리된<br/> 도로로 가기
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
                <motion.img 
                  src={grandfaRushing}
                  alt="오토바이 질주하는 할아버지" 
                  className="absolute w-[38%] h-auto object-contain z-50"
                  onError={handleImageError}
                  animate={{ x: [5, 55, 5] }} //X축:0→65px
                  transition={{ 
                  duration: 2, // 한 사이클(0→20→0)에 2초 
                  repeat: Infinity, // 무한 반복
                  ease: "easeInOut"  // 부드러운 가속·감속
                }}
                />
                <img 
                  src={successRoad}
                  alt="오토바이 질주할 도로" 
                  className="absolute bottom-[17%] w-[43%] object-contain z-40"
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
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
          {/* 중앙 상단에 정답입니다! */}
          <div className="absolute top-[20%] text-6xl font-extrabold text-green-700 left-1/2 transform -translate-x-1/2 z-20">
            정답입니다!
            </div>
            {/* 중앙에 녹색 박스에 메시지 */}
            <div className="mt-10 bg-green-600 bg-opacity-60 border-green-700 border-8  rounded-3xl p-10 w-[75%] mx-auto text-center relative">
              <p className="text-4xl font-extrabold text-white">
                평탄한 도로로 달린 덕분에<br/>
                무사히 집에 도착했어요
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
            src={accidentTurnoff}
            alt="사고 장면"
            className="absolute inset-0 w-full h-full object-cover"
          />
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
                <h2 className="text-6xl font-extrabold text-red-600 mb-4">이륜차와 넘어졌어요!</h2>
                <p className="text-4xl font-extrabold text-black">
                  5분 아끼려다가 평생 상처가 남아요<br />
                  평탄한 도로로 안전하게 귀가해요
                </p>
              </motion.div>
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
};

export default PathChoiceQuest;