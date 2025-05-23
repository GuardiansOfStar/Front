import { useNavigate } from 'react-router-dom';
import Background from '../../components/ui/Background';
import NextButton from './NextButton';
import Star from './Star';
import GameTitle from '../../components/ui/GameTitle';

const starCharacter = '/assets/images/star_character.png';

const StarSurvey = () => {
  return (
    <div
      className="relative w-full h-full overflow-hidden flex flex-col items-center justify-center gap-6"
    >
      <Background />

      <div className="w-[65%] p-4 text-green-600 text-center font-bold text-3xl z-50">
        안전교육 게임이 도움이 되었나요?
      </div>

      <div className="w-[70%] h-[20%] bg-white border-2 border-green-700 rounded-3xl p-6 z-40">
        <div className="flex gap-6">
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
        className="absolute bottom-[10%] left-[5%] w-[250px] z-50"
      />
      <NextButton to='/'/>
    </div>
  );
};

export default StarSurvey;