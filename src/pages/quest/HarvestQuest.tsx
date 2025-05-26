// Front/src/pages/quest/HarvestQuest.tsx
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import HarvestBox from './HarvestBox';
import HomeButton from '../../components/ui/HomeButton';
import { postQuestAttempt, AttemptPayload } from '../../services/endpoints/attempts';
import GameTitle from '../../components/ui/GameTitle';
import { useScale } from '../../hooks/useScale';

// 이미지 임포트
const fieldHarvestBoxes = '/assets/images/work_complete_with_applebox.png';
const field = '/assets/images/work_complete_without_applebox.png';
const accident = '/assets/images/grandfather_field_accident.png';
const dangerWarning = '/assets/images/danger_warning.png';
const successCircle = '/assets/images/success_circle.png';
const starCharacter = '/assets/images/star_character.png';
const grandfaSuccess = '/assets/images/mission4_success_grandfather_cart.png';
const motorcycle = '/assets/images/mission4_motorcycle.png';

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
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [fallbackImage, setFallbackImage] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [showIntroText, setShowIntroText] = useState(false);

  const scale = useScale();

  // 스케일 적용된 클릭 영역 크기
  const scaledClickAreaPadding = 20 * scale;
  const scaledHoverScale = 1.05 + (0.02 * scale); // 스케일에 따른 호버 효과 조정

  // URL 쿼리 파라미터에서 시나리오 ID와 퀘스트 ID 가져오기
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const sId = searchParams.get('scenario');
    const qId = searchParams.get('quest');
    setScenarioId(sId);
    setQuestId(qId || '4');
    
    // 스케일에 따른 타이밍 조정 함수
    const getScaledDuration = (baseDuration: number) => {
      return baseDuration * Math.max(0.8, scale);
    };
    
    // 인트로 화면 3초 후 드라이빙 - 스케일 적용
    const timer = setTimeout(() => {
      setGamePhase('driving');
      
      // 드라이빙 1초 후 사과박스 쌓인 정지 화면으로 전환 - 스케일 적용
      const drivingTimer = setTimeout(() => {
        setGamePhase('harvestDone');
        
        // 수확 후 선택지 화면으로 전환
        const alertTimer = setTimeout(() => {
          setGamePhase('selection');
        }, 0);
        
        return () => clearTimeout(alertTimer);
      }, getScaledDuration(0));
      
      return () => clearTimeout(drivingTimer);
    }, getScaledDuration(3000));
    
    return () => clearTimeout(timer);
  }, [location, scale]);
  
  // 선택지 선택 핸들러 - 스케일 적용된 타이밍
  const handleOptionSelect = (option: 'A' | 'B') => {
    setSelectedOption(option);
    
    // API 호출
    const isCorrect = option === 'B';
    const scoreAwarded = isCorrect ? 20 : 10;

    const sessionId = localStorage.getItem('session_id')!;
    const qId = "Harvest";
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

    const getScaledDuration = (baseDuration: number) => {
      return baseDuration * Math.max(0.8, scale);
    };

    if (option === 'B') {
      // 정답 선택 - 스케일 적용된 타이밍
      setTimeout(() => {
        setGamePhase('successResult');
        
        // 첫 번째 성공 메시지 표시
        setTimeout(() => {
          setShowSuccessMessage(true);
          
          // 5초 후 점수 화면으로 이동
          setTimeout(() => {
            navigate(`/score?scenario=${scenarioId}&quest=${questId}&score=20&correct=true`);
          }, getScaledDuration(5000));
        }, getScaledDuration(4000));
      }, getScaledDuration(1000));
    } else {
      // 오답 선택 - 스케일 적용된 타이밍
      setTimeout(() => {
        setGamePhase('fadeOut');
        setTimeout(() => {
          setGamePhase('failResult');
          setTimeout(() => {
            navigate(`/score?scenario=${scenarioId}&quest=${questId}&score=10&correct=false`);
          }, getScaledDuration(15000));
        }, getScaledDuration(2500));
      }, getScaledDuration(1000));
    }
  };
  
  // failResult 단계에서 시간차를 두고 경고 메시지 표시 - 스케일 적용
  useEffect(() => {
    if (gamePhase === 'failResult') {
      const timer = setTimeout(() => {
        setShowWarning(true);
      }, 4000 * Math.max(0.8, scale));

      return () => clearTimeout(timer);
    } else {
      setShowWarning(false);
    }
  }, [gamePhase, scale]);

  // 이미지 오류 핸들러
  const handleImageError = () => {
    setFallbackImage(true);
  };

  // 퀘스트 제목 렌더링 - 스케일 적용
  useEffect(() => {
    if (gamePhase === 'intro') {
      const timer = setTimeout(() => {
        setShowIntroText(true);
      }, 3000 * Math.max(0.8, scale));

      return () => clearTimeout(timer);
    } else {
      setShowIntroText(false);
    }
  }, [gamePhase, scale]);

  return (
    <div className="w-full h-full">
      {/* 배경 */}
      {(gamePhase !== 'intro' && gamePhase !== 'fadeOut' && gamePhase !== 'failResult'&& gamePhase !== 'score' ) && (
        <img
          src={fieldHarvestBoxes}
          alt="수확완료 화면"
          className="absolute w-full h-full object-cover"
        />
      )}

      {/* 배경 흐리게 처리 */}
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
          <img
          src={field}
          alt="수확 전 화면"
          className="absolute w-full h-full object-cover"
        />
          <HarvestBox /> 
          {/*
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
          <div 
            className="absolute inset-0 flex flex-col items-center justify-center z-30"
            style={{ top: `calc(80px * ${scale})` }}
          >
            {/* 선택지 제목 및 설명 */}
            <div 
              className="bg-[#FFFAFA] bg-opacity-75 border-[#0DA429] rounded-[30px] flex flex-col justify-center items-center text-center"
              style={{
                width: `calc(735px * ${scale})`,
                height: `calc(339px * ${scale})`,
                borderWidth: `calc(10px * ${scale})`,
                padding: `calc(24px * ${scale})`,
                marginBottom: `calc(32px * ${scale})`
              }}
            >
              <GameTitle 
                text="무거운 짐 싣기" 
                fontSize={`calc(3.75rem * ${scale})`} 
                color="text-[#0DA429]" 
                strokeWidth="0px"
              />
              <p 
                className="font-black text-black leading-snug"
                style={{ 
                  fontSize: `calc(2.5rem * ${scale})`,
                  marginTop: `calc(8px * ${scale})`
                }}
              >
                작업하는 중에 수확한 농작물을<br/>
                <span className="text-[#B91C1C]">이륜차에 싣고 싶어요</span><br/>
                어떻게 옮길까요?
              </p>
            </div>
            
            {/* 선택지 버튼 - 스케일 적용된 클릭 영역 */}
            <div 
              className="flex justify-between"
              style={{
                width: `calc(750px * ${scale})`,
                padding: 0
              }}
            >
              <button
                className={`rounded-[20px] font-black text-black transition duration-300 cursor-pointer
                  ${selectedOption === 'A' ? 
                    'bg-[#0DA429] bg-opacity-90 border-[#0DA429] scale-105' : 
                    'bg-[#FFFAFA] bg-opacity-70 border-[#0DA429] hover:bg-opacity-90'}
                `}
                style={{
                  width: `calc(355px * ${scale})`,
                  height: `calc(208px * ${scale})`,
                  fontSize: `calc(1.875rem * ${scale})`,
                  borderWidth: `calc(7px * ${scale})`,
                  // 클릭 영역 확장을 위한 패딩
                  padding: `calc(${scaledClickAreaPadding}px)`,
                  transform: selectedOption === 'A' ? `scale(${scaledHoverScale})` : 'scale(1)',
                  boxSizing: 'border-box'
                }}
                onClick={() => handleOptionSelect('A')}
                disabled={!!selectedOption}
              >
                과수원으로<br/><span style={{ color: '#B91C1C' }}>이륜차를 운전해</span><br/> 짐을 싣는다
              </button>
              
              <button
                className={`rounded-[20px] font-black text-black transition duration-300 cursor-pointer
                  ${selectedOption === 'B' ? 
                    'bg-[#0DA429] bg-opacity-90 border-[#0DA429] scale-105' : 
                    'bg-[#FFFAFA] bg-opacity-70 border-[#0DA429] hover:bg-opacity-90'}
                `}
                style={{
                  width: `calc(355px * ${scale})`,
                  height: `calc(208px * ${scale})`,
                  fontSize: `calc(1.875rem * ${scale})`,
                  borderWidth: `calc(7px * ${scale})`,
                  // 클릭 영역 확장을 위한 패딩
                  padding: `calc(${scaledClickAreaPadding}px)`,
                  transform: selectedOption === 'B' ? `scale(${scaledHoverScale})` : 'scale(1)',
                  boxSizing: 'border-box'
                }}
                onClick={() => handleOptionSelect('B')}
                disabled={!!selectedOption}
              >
                <span style={{ color: '#B91C1C' }}>손수레를 이용해</span><br/> 이륜차까지<br/> 짐을 옮겨 싣는다
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* 정답 결과 화면 */}
      {gamePhase === 'successResult' && !showSuccessMessage && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {/* 중앙에 큰 success_circle 이미지 */}
          <div className="absolute inset-0 flex items-center justify-center">
            <img
              src={successCircle} 
              alt="성공 원" 
              className="absolute w-full h-full object-contain z-20"
            />
            
            {/* 그 위에 할아버지와 오토바이 이미지 */}
            <div className="absolute inset-0 flex items-center justify-center z-30">
              {!fallbackImage ? (
                <>
                <motion.img
                  src={grandfaSuccess}
                  alt="수레 끄시는 할아버지" 
                  className="absolute object-contain z-40"
                  style={{
                    left: `calc(20% * ${scale})`,
                    width: `calc(400px * ${scale})`,
                    height: 'auto'
                  }}
                  onError={handleImageError}
                  animate={{ x: [0, `calc(45px * ${scale})`] }}
                  transition={{ 
                    duration: 5 * Math.max(0.8, scale),
                    repeat: 1,
                  }}
                />
                <img 
                  src={motorcycle}
                  alt="오토바이"
                  className="absolute object-contain z-50"
                  style={{
                    right: `calc(26% * ${scale})`,
                    width: `calc(323px * ${scale})`
                  }}
                  onError={handleImageError}
                />
                </>
              ) : (
                <img 
                  src="/assets/images/character_with_helmet.png"  
                  alt="헬멧 쓴 캐릭터" 
                  className="object-contain"
                  style={{
                    width: `calc(40% * ${scale})`,
                    height: 'auto'
                  }}
                />
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* 정답 후 성공 메시지 화면 */}
      {gamePhase === 'successResult' && showSuccessMessage && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
          {/* 중앙 상단에 정답입니다! */}
          <div
            className="text-[#0E8E12] font-black"
            style={{
              fontSize: `calc(4.375rem * ${scale})`,
              WebkitTextStroke: `calc(10px * ${scale}) #FFFFFF`,
              paintOrder: 'stroke',
            }}
          >
            정답입니다!
          </div>

          {/* 중앙에 녹색 박스에 메시지 */}
          <div 
            className="bg-[#0DA429] bg-opacity-50 border-[#0E8E12] border-opacity-80 rounded-[30px] mx-auto text-center relative"
            style={{
              width: `calc(754px * ${scale})`,
              height: `calc(306px * ${scale})`,
              borderWidth: `calc(10px * ${scale})`,
              padding: `calc(16px * ${scale})`,
              marginTop: `calc(40px * ${scale})`,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <p 
              className="font-black text-[#FFFAFA]"
              style={{ fontSize: `calc(3.4375rem * ${scale})` }}
            >
              당신의 안전과<br/> 소중한 자산을 보호하는 <br/> 현명한 선택이에요
            </p>
          </div>

          {/* 좌측 하단 별별이 캐릭터 */}
          <img 
            src={starCharacter} 
            alt="별별이" 
            className="absolute z-30"
            style={{
              bottom: `calc(10% * ${scale})`,
              left: `calc(5% * ${scale})`,
              width: `calc(250px * ${scale})`
            }}
          />
        </div>
      )}
      
      {/* 페이드아웃 화면 */}
      {gamePhase === 'fadeOut' && (
        <motion.img
          src="/assets/images/accident_fadeout.png"
          alt="전환 이미지"
          className="absolute inset-0 w-full h-full object-cover z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 * Math.max(0.8, scale) }}
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

          {/* 애니메이션 컨테이너 - 스케일 적용된 애니메이션 */}
          {showWarning && (
            <motion.div 
              className="absolute inset-0 bg-[#FFF9C4]/60 flex flex-col items-center justify-end z-10"
              style={{ paddingBottom: `calc(128px * ${scale})` }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 * Math.max(0.8, scale) }}
            >
              <motion.img 
                src={dangerWarning} 
                alt="위험 경고" 
                style={{
                  width: `calc(16% * ${scale})`,
                  marginBottom: `calc(4px * ${scale})`
                }}
                initial={{ y: `calc(-20px * ${scale})`, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8 * Math.max(0.8, scale), delay: 0.2 }}
              />
              
              <motion.div 
                className="bg-[#FFFAFA]/75 border-[#EE404C] rounded-[30px] text-center flex flex-col justify-center items-center"
                style={{
                  width: `calc(850px * ${scale})`,
                  height: `calc(353px * ${scale})`,
                  borderWidth: `calc(10px * ${scale})`,
                  padding: `calc(32px * ${scale})`
                }}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8 * Math.max(0.8, scale), delay: 0.4 }}
              >
                <h2 
                  className="font-black text-red-600"
                  style={{ 
                    fontSize: `calc(3.75rem * ${scale})`,
                    marginBottom: `calc(20px * ${scale})`
                  }}
                >
                  덜컹! 넘어졌어요
                </h2>
                <p 
                  className="font-black text-black"
                  style={{ fontSize: `calc(2.5rem * ${scale})` }}
                >
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