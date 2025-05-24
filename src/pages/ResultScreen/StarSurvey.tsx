import { useNavigate } from 'react-router-dom';
import Background from '../../components/ui/Background';
import NextButton from './NextButton';
import Star from './Star';
import GameTitle from '../../components/ui/GameTitle';
import GameContext from '../../components/ui/GameContext';

const starCharacter = '/assets/images/star_character.png';

const StarSurvey = () => {
  const navigate = useNavigate();

  return (
    <div
      className="relative w-full h-full overflow-hidden flex flex-col items-center justify-center"
    >
    <div className="absolute inset-0 bg-[#FFF9C4]/70 z-20" />

      <Background />
      <img
        src="/assets/images/back_button.png"
        alt="뒤로가기 버튼"
        onClick={() => navigate('/memory')}
        className="absolute top-[3%] left-[3%] w-[110px] h-auto z-50 cursor-pointer hover:scale-90 transition-transform duration-300"
      />
      <GameContext
      text="안전교육 게임이 도움이 되셨나요?"
      fontSize="text-[52px]"
      color="text-[#0DA429]"
      className="absolute top-[23%] z-50 mb-5"
      />

      <div className="w-[750px] h-[200px] bg-white border-2 border-green-700 rounded-3xl
      flex justify-center items-center z-40">
        <div className="flex gap-5">
        <Star/>
        <Star/>
        <Star/>
        <Star/>
        <Star/>
        </div>
      </div>
      <img 
        src={starCharacter} 
        alt="별별이" 
        className="absolute bottom-[12%] left-[3%] w-[250px] z-50"
      />
      <img
        src="/assets/images/submit_button.png"
        alt="제출 버튼"
        onClick={() => navigate('/rank')} 
        className="absolute bottom-[7%] left-1/2 transform -translate-x-1/2 
        w-[300px] h-auto z-40 cursor-pointer
        hover:scale-90 transition-transform duration-300"
      />
    </div>
  );
};

export default StarSurvey;