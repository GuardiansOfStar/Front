import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Background from '../../components/ui/Background';

const EduScreen = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    console.log("EduScreen - 결과 화면 표시 중");
    // 5초 후 자동으로 수료증 화면으로 이동
    const timer = setTimeout(() => {
      console.log("EduScreen - 수료증 화면으로 이동");
      navigate('/certificate');
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div
      className="relative w-full h-full flex flex-col items-center justify-center"
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