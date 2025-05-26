// StarSurvey.tsx
import { useState } from 'react'; // ⭐ 상태 관리를 위해 useState 추가
import { useNavigate } from 'react-router-dom';
import Background from '../../components/ui/Background';
import NextButton from './NextButton';
import Star from './Star'; 
import GameTitle from '../../components/ui/GameTitle';
import GameContext from '../../components/ui/GameContext';

const starCharacter = '/assets/images/star_character.png';

const StarSurvey = () => {
  const navigate = useNavigate();

  // 5개의 ⭐ 중 몇 개가 선택되었는지를 관리하는 상태 (초기값: 5)
  const [selectedStar, setSelectedStar] = useState(0);

  return (
    <div className="relative w-full h-full overflow-hidden flex flex-col items-center justify-center">
      <div className="absolute inset-0 bg-[#FFF9C4]/70 z-20" />
      <Background />

      {/* 뒤로가기 버튼 */}
      <img
        src="/assets/images/back_button.png"
        alt="뒤로가기 버튼"
        onClick={() => navigate('/memory')}
        className="absolute top-[3%] left-[3%] w-[110px] h-auto z-50 cursor-pointer hover:scale-90 transition-transform duration-300"
      />

      {/* 질문 텍스트 */}
      <GameContext
        text="안전교육 게임이 도움이 되셨나요?"
        fontSize="text-[52px]"
        color="text-[#0DA429]"
        className="absolute top-[23%] z-50 mb-5"
      />

      {/* 별점 박스 */}
      <div className="w-[750px] h-[200px] bg-white border-2 border-green-700 rounded-3xl flex justify-center items-center z-40">
        <div className="flex gap-5">
          {
            // ⭐을 5개 그리되, 선택된 개수에 따라 채워진 상태 전달
            [1, 2, 3, 4, 5].map((i) => (
              <Star
                key={i}                            //내부요소 구별용
                filled={i <= selectedStar}         // i가 선택된 별 수 이하면 채움
                onClick={() => setSelectedStar(i)} // 클릭 시 선택된 별 수 업데이트
              />
            ))
          }
        </div>
      </div>

      {/* 캐릭터 이미지 */}
      <img 
        src={starCharacter} 
        alt="별별이" 
        className="absolute bottom-[12%] left-[3%] w-[250px] z-50"
      />

      {/* 제출 버튼 */}
      <img
        src="/assets/images/submit_button.png"
        alt="제출 버튼"
        onClick={() => navigate('/village')} 
        className="absolute bottom-[7%] left-1/2 transform -translate-x-1/2 
        w-[300px] h-auto z-40 cursor-pointer
        hover:scale-90 transition-transform duration-300"
      />
    </div>
  );
};

export default StarSurvey;
