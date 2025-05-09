import { useNavigate } from 'react-router-dom';
import Background from '../../components/ui/Background';

const EduScreen = () => {
  const navigate = useNavigate();
  return (
    <div
      className="relative w-full h-screen overflow-hidden flex flex-col items-center justify-center"
      onClick={() => navigate('/certificate')}
    >
      <Background />

      <img
        src="/assets/images/score_background.png"
        alt="점수 이미지"
        className="w-[60%] z-50 mb-5"
      />

      <div className="flex w-[75%] justify-between z-50">
        <div className="w-[48%] h-40 bg-white border-8 border-green-600 rounded-lg flex items-center justify-center text-green-600 font-bold text-xl">
          칭찬해요
        </div>
        <div className="w-[48%] h-40 bg-white border-8 border-green-600 rounded-lg flex items-center justify-center text-green-600 font-bold text-xl">
          기억해요
        </div>
      </div>
    </div>
  );
};

export default EduScreen;