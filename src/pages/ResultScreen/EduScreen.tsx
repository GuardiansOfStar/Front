//import { useEffect } from 'react';
//import { useNavigate } from 'react-router-dom';
import CompleteBackground from '../../components/ui/CompleteBackground';
import NextButton from './NextButton';

const EduScreen = () => {
  return (
    <div
      className="relative w-full h-full overflow-hidden flex flex-col items-center justify-center"
    >
      <div className="absolute inset-0 bg-[#FFF9C4]/70 z-10"></div>
      <CompleteBackground />

      <img
        src="/assets/images/score.png"
        alt="점수 이미지"
        className="w-[65%] z-50 mb-5"
      />

      <div className="flex w-[85%] h-[50%] justify-between z-50">
        <div className="w-[48%] h-1/1 bg-white border-8 border-green-600 rounded-lg flex flex-col items-center justify-center text-green-600 font-extrabold text-4xl">
          칭찬해요
          <p className='flex items-center justify-center text-center text-black font-extrabold text-3xl mt-5'>주행 전에 <br/> 안전모 쓰는 모습이 <br/> 멋져요</p>
        </div>
        <div className="w-[48%] h-1/1 bg-white border-8 border-green-600 rounded-lg flex flex-col items-center justify-center text-red-600 font-extrabold text-4xl">
          기억해요
          <p className='flex items-center justify-center text-center text-black font-extrabold text-3xl mt-5'>주행 전에 <br/> 안전모 쓰는 모습이 <br/> 멋져요</p>
        </div>
      </div>
      <NextButton to="/certificate" />
    </div>
  );
};

export default EduScreen;