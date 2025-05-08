import { useNavigate } from 'react-router-dom';
import Background from '../../components/Background';
import NextButton from './NextButton';

const PersonalInfo = () => {
  const navigate = useNavigate();

  return (
    <div
      className="relative w-full h-screen overflow-hidden flex flex-col items-center justify-center gap-6"
    >
      <Background />

      <div className="w-[65%] bg-green-600 border-4 border-green-700 rounded-xl p-4 text-white text-center font-bold text-3xl z-50">
        아래의 내용을 입력해주세요
      </div>

      <div className="w-[70%] bg-green-500 border-4 border-green-700 rounded-lg p-6 z-50">
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <label className="text-white text-2xl font-bold w-1/3 text-left">이름</label>
            <input
              type="text"
              className="w-2/3 h-10 bg-white rounded-md px-3 text-gray-800"
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
      <NextButton/>
    </div>
  );
};

export default PersonalInfo;