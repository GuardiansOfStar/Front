import Background from '../../components/ui/Background';
import NextButton from './NextButton';

const PersonalInfo = () => {
  return (
    <div
      className="absolute w-full h-full"
    >
      <div className="absolute inset-0 bg-[#FFF9C4]/70 z-20" />
      <Background />
      <div className="absolute top-[19%] left-1/2 transform -translate-x-1/2 
        w-[740px] h-[125px] 
        bg-[#0DA429] bg-opacity-90
        border-[10px] border-[#0E8E12] border-opacity-80 
        rounded-[40px] 
        p-6 z-50 flex items-center justify-center 
        text-[55px] text-[#FFFAFA] font-extrabold">
        아래의 내용을 입력해주세요
      </div>

      <div className="absolute top-[37%] left-1/2 transform -translate-x-1/2
        flex items-center justify-center w-[70%] h-[45%]
        bg-[#0DA429] bg-opacity-60 
        border-[10px] border-[#0E8E12] border-opacity-80 
        rounded-[25px] 
        p-6 z-50 
        text-[50px]  text-[#FFFAFA] font-extrabold">
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <label className="text-white font-bold w-1/3 text-left pe-1">이름</label>
            <input
              type="text"
              className="w-[350px] h-[61px] bg-[#FFFAFA] rounded-[10px] px-3 text-gray-800"
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="text-white font-bold w-1/3 text-left">나이</label>
            <input
              type="text"
              className="w-[350px] h-[61px] bg-[#FFFAFA] rounded-[10px] px-3 text-gray-800"
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="text-white font-bold w-1/3 text-left mr-5">연락처</label>
            <input
              type="text"
              className="w-[350px] h-[61px] bg-[#FFFAFA] rounded-[10px] px-3 text-gray-800"
            />
          </div>
        </div>
      </div>
      <NextButton to= '/' />
    </div>
  );
};

export default PersonalInfo;