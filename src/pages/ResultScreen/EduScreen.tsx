//import { useEffect } from 'react';
//import { useNavigate } from 'react-router-dom';
import CompleteBackground from '../../components/ui/CompleteBackground';
import NextButton from './NextButton';
import GameTitle from '../../components/ui/GameTitle';

const EduScreen = () => {
  return (
    <div
      className="relative w-full h-full flex flex-col items-center justify-center"
    >
      <div className="absolute inset-0 bg-[#FFF9C4]/70 z-10"></div>
      <CompleteBackground />

      <img
        src="/assets/images/score.png"
        alt="점수 이미지"
        className="absolute top-[120px] w-[65%] z-40"
      />
      <img
        src="/assets/images/clap.png"
        alt="박수"
        className="absolute top-[280px] left-[115px] w-[70px] z-50"
      />
      <img
        src="/assets/images/check.png" 
        alt="박수"
        className="absolute top-[294px] right-[385px] w-[60px] z-50"
      />
      <GameTitle
        text="80"
        fontSize="text-[100px]"
        color="text-green-600"
        strokeWidth="15px"
        className="fixed top-[90px] right-[290px] z-50"
      />

      <div className="flex w-[870px] h-auto justify-between mt-[105px] z-40">
        <div className="w-[410px] h-[395px] bg-[#ffffffe6] border-[10px] border-[#0E8E12] rounded-[30px] flex flex-col items-center justify-center text-green-600 font-extrabold text-[50px]">
          칭찬해요
          <p className="flex items-center justify-center text-center font-extrabold mt-5" style={{ fontSize: '45px', color: '#000000' }}>
            주행 전에 <br /> 안전모 쓰는 모습이 <br /> 멋져요
          </p>
        </div>

        <div className="w-[410px] h-[395px] bg-[#ffffffe6] border-[10px] border-[#0E8E12] rounded-[30px] flex flex-col items-center justify-center text-red-500 font-extrabold text-[50px] ">
          기억해요
          <p className="flex items-center justify-center text-center font-extrabold mt-5" style={{ fontSize: '45px', color: '#000000' }}>
            주행 전에 <br /> 안전모 쓰는 모습이 <br /> 멋져요
          </p>
        </div>
      </div>
      <NextButton to='/certificate' />
    </div>
  );
};

export default EduScreen;