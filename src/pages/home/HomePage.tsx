import { useState, useEffect } from 'react';
import Background from '../../components/ui/Background';
import CharacterAnimation from './CharacterAnimation';
import Setting from '../../components/ui/SettingButton';
import StartButton from '../../components/ui/StartButton';
import RegionBubble from '../../components/ui/RegionBubble';

const title = '/assets/images/title.png';
const team_name = '/assets/images/team_name.png'

const HomePage = () => {
  // 지역 설정 여부 상태 (localStorage에서 확인)
  const [hasRegion, setHasRegion] = useState(() => {
    return localStorage.getItem('selectedRegion') !== null;
  });
  
  // 말풍선 표시 상태
  const [showBubble, setShowBubble] = useState(false);
  // 애니메이션 완료 상태
  const [animationCompleted, setAnimationCompleted] = useState(false);
  
  // 캐릭터 애니메이션 완료 후 호출될 콜백
  const handleAnimationComplete = () => {
    setAnimationCompleted(true);
  };

  // 페이지 로드 후 10초 후에 말풍선 표시, 5초 후에 말풍선 숨김
  useEffect(() => {
    if (!hasRegion) {
      // 10초 후 말풍선 표시
      const showTimer = setTimeout(() => {
        setShowBubble(true);
        
        // 말풍선 표시 5초 후 숨김
        const hideTimer = setTimeout(() => {
          setShowBubble(false);
        }, 5000);
        
        return () => clearTimeout(hideTimer);
      }, 10000);
      
      return () => clearTimeout(showTimer);
    }
  }, [hasRegion]);

  return (
    <div className="w-full h-full">
      {/* 화면 높이에 맞춰서 비율을 유지 */}
      <Background />
      <Setting />

      {/* 말풍선 컴포넌트 */}
      <RegionBubble show={showBubble} />

      <img 
        src={title}
        alt="제목"
        className="absolute top-[10%] left-1/2 transform -translate-x-1/2 w-[65%] drop-shadow-xl z-10"
      />

      <CharacterAnimation onAnimationComplete={handleAnimationComplete} />
      <StartButton />

      <img 
        src={team_name}
        alt="팀이름"
        className="absolute bottom-[7%] right-[10%] w-[30%] z-10"
      />
    </div>
  );
};

export default HomePage;