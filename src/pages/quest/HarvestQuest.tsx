// src/pages/quest/HarvestQuest.tsx
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import HarvestBox from './HarvestBox';
import HarvestBox2 from './HarvestBox2';
import HomeButton from '../../components/ui/HomeButton';
import GameTitle from '../../components/ui/GameTitle';

// 이미지 임포트
const fieldHarvestBoxes = '/assets/images/field_harvest_boxes.png';
const accident = '/assets/images/grandfather_field_accident.png';
const dangerWarning = '/assets/images/danger_warning.png';
const successCircle = '/assets/images/success_circle.png';
const starCharacter = '/assets/images/star_character.png';
const grandfaSuccess = '/assets/images/mission4_success_grandfather_cart.png';
const motorcycle = '/assets/images/mission4_motorcycle.png'


// 게임 단계 정의
type GamePhase = 
  | 'intro'         // 시작 화면 뚜
  | 'driving'       // 오토바이 주행 뚜
  | 'harvestDone'   // 수확물 싣기
  | 'selection'     // 선택지 제공
  | 'successResult' // 정답 선택 결과
  | 'fadeOut'       // 오답 페이드아웃
  | 'failResult'    // 오답 선택 결과 뚜
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
  const [showIntroText, setShowIntroText] = useState(false);

  // URL 쿼리 파라미터에서 시나리오 ID와 퀘스트 ID 가져오기
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const sId = searchParams.get('scenario');
    const qId = searchParams.get('quest');
    setScenarioId(sId);
    setQuestId(qId || '4');
    
    // 인트로 화면 3s후 드라이빙
    const timer = setTimeout(() => {
      setGamePhase('driving');
      
      // 드라이비 1s후 사과박스 쌓인 정지 화면으로 전환
      const drivingTimer = setTimeout(() => {
        setGamePhase('harvestDone');
        
        // 수확 후 선택지 화면으로 전환
        const alertTimer = setTimeout(() => {
          setGamePhase('selection');
        }, 0);
        
        return () => clearTimeout(alertTimer);
      }, 1000);
      
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
          }, 15000); //오답 결과 유지 시간
        }, 2500);
      }, 1000);
    }
  };
  
  useEffect(() => {
    if (gamePhase === 'failResult') {
      const timer = setTimeout(() => {
        setShowWarning(true);
      }, 4000); // 초 후 경고문구

      return () => clearTimeout(timer); // 클린업
    } else {
      setShowWarning(false); // 다시 숨기기
    }
  }, [gamePhase]);

  // 이미지 오류 핸들러
  const handleImageError = () => {
    setFallbackImage(true);
  };

  //퀘스트 제목 랜더링
  useEffect(() => {
  if (gamePhase === 'intro') {
    const timer = setTimeout(() => {
      setShowIntroText(true);
    }, 3000); // 3초 후에 텍스트 보이기

    return () => clearTimeout(timer); // 언마운트 시 타이머 정리
  } else {
    setShowIntroText(false); // intro 상태 벗어나면 다시 숨기기
  }
}, [gamePhase]);

  return (
    <div className="w-full h-full">
      {/* 배경 - 게임 단계에 따라 다른 배경 표시 */}
      {(gamePhase !== 'fadeOut' ) && (
        <img
          src={fieldHarvestBoxes}
          alt="갈림길 배경"
          className="absolute w-full h-full object-cover"
        />
      )}
      {/*배경 흐리게 처리*/}
      {(gamePhase !== 'intro' && gamePhase !== 'driving' && gamePhase !== 'harvestDone' && gamePhase !== 'failResult' ) && (
      <div className="absolute inset-0 bg-[#FFF9C4]/60 z-10"></div>
      )}

      {/* 헤더 영역 */}
      {(gamePhase !== 'fadeOut' && gamePhase !== 'failResult') && (
        <HomeButton />
      )}

      {/* 인트로 화면 */}
      {gamePhase === 'intro' && (
        <>
          
          {/*<HarvestBox /> 
          showIntroText && (
            <div className="absolute inset-0 flex items-center justify-center z-20">
              <GameTitle text="작업 완료" fontSize="text-[5.25rem]" strokeWidth="12px" />
            </div>
          )*/}
        </>
      )}

      {/* 주행 화면 */}
      {gamePhase === 'driving' && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          {/*<HarvestBox2 /> <div className="absolute z-20">
            {renderTitleText('작업 완료')}
          </div> */}
        </div>
      )}
      
      {/* 수확 완료 화면 {gamePhase === 'harvestDone' && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="absolute z-20">
            {renderTitleText('작업 완료')}
          </div>
        </div>
      )} */}
      

      

      {/* 선택지 화면 - 오토바이 제거 */}
      {gamePhase === 'selection' && (
        <div className="absolute inset-0">
          <div className="absolute inset-0 top-20 flex flex-col items-center justify-center z-30">
            {/* 선택지 제목 및 설명 */}
            <div className="w-[735px] h-[339px] 
            bg-[#FFFAFA] bg-opacity-75 border-[10px] border-[#0DA429] rounded-[30px] 
            p-6 mb-8 
            flex flex-col justify-center items-center text-center">
              <GameTitle 
              text="무거운 짐 싣기" 
              fontSize="text-[60px]" 
              color="text-[#0DA429]" 
              strokeWidth="0px"
              />
              <p className="mt-2 text-[40px] font-extrabold text-black leading-snug">
                작업하는 중에 수확한 농작물을<br/>
                <span className="text-[#B91C1C]">이륜차에 싣고 싶어요</span><br/>
                어떻게 옮길까요?
              </p>
            </div>
            
            {/* 선택지 버튼 */}
            <div className="flex justify-between w-[750px] p-0">
              <button
                className={`w-[355px] h-[208px] rounded-[20px] text-3xl font-extrabold text-black transition duration-300 border-[7px]
                  ${selectedOption === 'A' ? 
                    'bg-[#0DA429] bg-opacity-90 border-[#0DA429] scale-105' : 
                    'bg-[#FFFAFA] bg-opacity-70 border-[#0DA429] hover:bg-opacity-90'}
                `}
                onClick={() => handleOptionSelect('A')}
                disabled={!!selectedOption}
              >
                과수원으로<br/><span style={{ color: '#B91C1C' }}>이륜차를 운전해</span><br/> 짐을 싣는다
              </button>
              
              <button
                className={`w-[355px] h-[208px] rounded-[20px] text-3xl font-extrabold text-black transition duration-300 border-[7px]
                  ${selectedOption === 'B' ? 
                    'bg-[#0DA429] bg-opacity-90 border-[#0DA429] scale-105' : 
                    'bg-[#FFFAFA] bg-opacity-70 border-[#0DA429] hover:bg-opacity-90'}
                `}
                onClick={() => handleOptionSelect('B')}
                disabled={!!selectedOption}
              >
                <span style={{ color: '#B91C1C' }}>손수레를 이용해</span><br/> 이륜차까지<br/> 짐을 옮겨 싣는다
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
              className="absolute w-full h-full object-contain z-20"
            />
            
            {/* 그 위에 오토바이 운전하는 할아버지 이미지 */}
            <div className="absolute inset-0 flex items-center justify-center z-30">
              {!fallbackImage ? (
                <>
                <motion.img
                src={grandfaSuccess}
                alt="수레 끄시는 할아버지" 
                className="absolute left-[20%] w-[400px] h-auto object-contain z-40"
                onError={handleImageError}
                animate={{ x: [0, 45] }} //X축: 0→65px
                transition={{ 
                  duration: 5, // 한 사이클(0→20→0)에 2초 
                  repeat: 1, // 반복
                  //ease: "easeInOut"  // 부드러운 가속·감속
                }}
                />
                <img 
                  src={motorcycle}
                  alt="오토바이"
                  className="absolute right-[26%] w-[323px] object-contain z-50"
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
          <div
            className="text-[70px] font-extrabold text-[#0E8E12]"
            style={{
              WebkitTextStroke: '10px #FFFFFF',
              paintOrder: 'stroke',
            }}
          >
            정답입니다!
          </div>

            {/* 중앙에 녹색 박스에 메시지 */}
            <div className="w-[754px] h-[306px] 
            bg-[#0DA429] bg-opacity-50 
            border-[10px] border-[#0E8E12] border-opacity-80 
            rounded-[30px] 
            p-4 mx-auto mt-10 
            flex justify-center items-center text-center relative">
              <p className="text-[55px] font-extrabold text-[#FFFAFA]">
                당신의 안전과<br/> 소중한 자산을 보호하는 <br/> 현명한 선택이에요
              </p>
            </div>
          {/* 좌측 하단 별별이 캐릭터 */}
          <img 
            src={starCharacter} 
            alt="별별이" 
            className="absolute bottom-[10%] left-[5%] w-[250px] z-30"
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
                className="w-[850px] h-[353px] bg-[#FFFAFA]/75 border-[#EE404C] border-[10px] rounded-[30px] p-8 text-center flex flex-col justify-center items-center"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >

                <h2 className="text-6xl font-extrabold text-red-600 mb-5">덜컹! 넘어졌어요</h2>
                <p className="text-4xl font-extrabold text-black">
                  뿌리에 걸려 낙상할 수 있어요<br />
                  이륜차는 도로에 두고 짐을 옮겨요
                </p>
              </motion.div>
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
};

export default HarvestQuest;