import { useNavigate } from 'react-router-dom';
import Background from '../../components/Background';

const EduScreen = () => {
  const navigate = useNavigate(); // ✅ 추가

  return (
    <div
      className="relative w-full h-screen overflow-hidden flex flex-col items-center justify-center"
      onClick={() => navigate('/certificate')} // ✅ 추가 
    >
      <Background />

      <div className="w-[50%] h-[16%] bg-green-700 bg-opacity-90 rounded-lg p-8 text-white text-center shadow-lg z-10">
        <h2 className="text-4xl font-bold">최종 점수 150점</h2>
      </div>

      <div className="w-[80%] h-[40%] bg-green-700 bg-opacity-90 rounded-lg p-8 text-white text-center mb-8 shadow-lg z-10 mt-4">
        <div className="flex justify-center border-b border-white pt-4">
          <div className="w-[20%] text-white font-bold px-4 py-6 mb-4 mr-4 border-r-2 border-white">
            멋져요
          </div>
          <div className="flex flex-col justify-center">
            <p className="text-lg font-semibold">퀘스트1</p>
            <p className="mt-2">구덩이를 발견하고 서행하는 당신, 멋져요</p>
          </div>
        </div>
        <div className="flex justify-center items-center border-t border-white pt-4">
          <div className="w-[20%] text-white font-bold px-4 py-6 mb-4 mr-4 border-r-2 border-white">
            조심해요
          </div>
          <div className="flex flex-col justify-center">
            <p className="text-lg font-semibold">퀘스트2</p>
            <p className="mt-2">구덩이를 발견하고 서행하는 당신, 멋져요</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EduScreen;
