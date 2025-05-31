import { useState, useEffect } from 'react';
import Background from '../../components/ui/Background';
import CharacterAnimation from './CharacterAnimation';
import StartButton from '../../components/ui/StartButton';
import RegionBubble from '../../components/ui/RegionBubble';
import SettingButton from '../../components/ui/SettingButton';

const title = '/assets/images/title.png';
const team_name = '/assets/images/team_name.png'

const HomePage = () => {
  // localStorage에 저장했던 session_id, user_id 초기화!
  useEffect(() => {
    localStorage.removeItem("session_id");
    localStorage.removeItem("user_id");
    //마을 정보는 놔둘 예정
  }, []);


  // ✅ 지역 설정 여부 확인 (localStorage에 selectedRegion이 있는지)
  const [hasRegion, setHasRegion] = useState(() => {
    return localStorage.getItem('selectedRegion') !== null;
  });

  // ✅ 실제 지역 이름을 상태로 관리
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);

  // 말풍선 표시 상태
  const [showBubble, setShowBubble] = useState(false);
  // 애니메이션 완료 상태
  const [animationCompleted, setAnimationCompleted] = useState(false);

  // ✅ 컴포넌트 마운트 시 지역 정보 불러오기
  useEffect(() => {
    const region = localStorage.getItem('selectedRegion');
    if (region) {
      setSelectedRegion(region);
    }
  }, []);

  // 캐릭터 애니메이션 완료 후 호출될 콜백
  const handleAnimationComplete = () => {
    setAnimationCompleted(true);
  };

  // 페이지 로드 후 10초 후에 말풍선 표시, 5초 후에 말풍선 숨김
  useEffect(() => {
    if (!hasRegion) {
      const showTimer = setTimeout(() => {
        setShowBubble(true);
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
      <Background />
      <SettingButton />

      {/* ✅ 선택된 지역이 있을 경우 우측 상단에 텍스트 표시 */}
      {selectedRegion && (
        <div>
          {/* ✅ 지역 설정 완료 배경 이미지 */}
          <img
            src='/assets/images/location_settings.png'
            alt='지역설정 완료배경'
            className='absolute top-[54px] right-[140px] w-[175px] z-50'
          />
          {/* ✅ 중앙 위에 올라오는 텍스트 */}
          <div className="absolute top-[63px] right-[15.5%]
          text-[35px] font-black text-green-800 whitespace-nowrap">
            {selectedRegion}
          </div>
        </div>
      )}

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
