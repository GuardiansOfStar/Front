import { useNavigate } from 'react-router-dom';
import Background from '../../components/ui/Background';
import NextButton from './NextButton';

const PersonalInfo = () => {
  const navigate = useNavigate();

  return (
    <div
      className="absolute w-full h-full"
    >
      <Background />

      <div className="absolute top-[25%] left-1/2 transform -translate-x-1/2
                w-[70%] bg-green-500 border-4 border-green-700 
                rounded-lg p-6 z-50">
        아래의 내용을 입력해주세요
      </div>

      <div className="absolute top-[35%] left-1/2 transform -translate-x-1/2
      w-[70%] bg-green-500 border-4 border-green-700 rounded-lg p-6 z-50">
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <label className="text-white text-2xl font-bold w-1/3 text-left">이름</label>
            <input
              type="text"
              className="absolute w-2/3 h-10 bg-white rounded-md px-3 text-gray-800"
              placeholder="이름을 입력하세요"
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="text-white text-2xl font-bold w-1/3 text-left">나이</label>
            <input
              type="text"
              className="w-2/3 h-10 bg-white rounded-md px-3 text-gray-800"
              placeholder="나이를 입력하세요"
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="text-white text-2xl font-bold w-1/3 text-left">연락처</label>
            <input
              type="text"
              className="w-2/3 h-10 bg-white rounded-md px-3 text-gray-800"
              placeholder="연락처를 입력하세요"
            />
          </div>
        </div>
      </div>
      <NextButton to= '/' />
    </div>
  );
};

export default PersonalInfo;