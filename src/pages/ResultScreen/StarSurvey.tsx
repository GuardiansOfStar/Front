import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useScale } from '../../hooks/useScale';
import Background from '../../components/ui/Background';
import Star from './Star'; 
import GameTitle from '../../components/ui/GameTitle';
import BackButton from '../../components/ui/BackButton';

const starCharacter = '/assets/images/star_character.png';
const submitButton = '/assets/images/submit_button.png';

const StarSurvey = () => {
  const navigate = useNavigate();
  const scale = useScale();

  // 5개의 ⭐ 중 몇 개가 선택되었는지를 관리하는 상태 (초기값: 5)
  const [selectedStar, setSelectedStar] = useState(0);

  return (
    <div className="relative w-full h-full">
      <div className="absolute inset-0 bg-[#FFF9C4]/70 z-20" />
      <Background />

      {/* 뒤로가기 버튼 */}
      <BackButton onClick={() => navigate('/memory')} />

      {/* 질문 텍스트 */}
      <div 
        className="absolute z-50"
        style={{
          top: `calc(181px * ${scale})`,
          left: `calc(173px * ${scale})`,
          width: `calc(678px * ${scale})`,
          height: `calc(60px * ${scale})`
        }}
      >
        <GameTitle
          text="안전교육 게임이 도움이 되셨나요?"
          fontSize={`calc(50px * ${scale})`}
          color="text-[#0DA429]"
          strokeWidth={`calc(5px * ${scale})`}
        />
      </div>

      {/* 별점 박스 */}
      <div 
        className="absolute bg-white bg-opacity-70 border-green-700 z-40"
        style={{
          width: `calc(750px * ${scale})`,
          height: `calc(202px * ${scale})`,
          left: `calc(137px * ${scale})`,
          top: `calc(287px * ${scale})`,
          borderWidth: `calc(4px * ${scale})`,
          borderStyle: 'solid',
          borderRadius: `calc(30px * ${scale})`,
          borderColor: '#15803d',
          backgroundColor: 'rgba(255, 250, 250, 0.7)',
          boxShadow: 'inset 0px 4px 4px rgba(0, 0, 0, 0.25)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <div 
          className="flex items-center justify-center"
          style={{ 
            gap: `calc(20px * ${scale})`,
            width: '100%',
            height: '100%'
          }}
        >
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              style={{
                width: `calc(120px * ${scale})`,
                height: `calc(120px * ${scale})`,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              onClick={() => setSelectedStar(i)}
            >
              <Star
                filled={i <= selectedStar}
                onClick={() => setSelectedStar(i)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* 캐릭터 이미지 */}
      <img 
        src={starCharacter} 
        alt="별별이" 
        className="absolute z-50"
        style={{
          bottom: `calc(80px * ${scale})`,
          left: `calc(30px * ${scale})`,
          width: `calc(250px * ${scale})`,
          height: 'auto'
        }}
      />

      {/* 제출 버튼 */}
      <img
        src={submitButton}
        alt="제출 버튼"
        onClick={() => navigate('/rank')} 
        className="absolute cursor-pointer hover:scale-105 transition-transform duration-300 z-50"
        style={{
          bottom: `calc(54px * ${scale})`,
          left: `calc(382px * ${scale})`, // 중앙 정렬: (1024 - 336) / 2
          width: `calc(260px * ${scale})`,
        }}
      />
    </div>
  );
};

export default StarSurvey;