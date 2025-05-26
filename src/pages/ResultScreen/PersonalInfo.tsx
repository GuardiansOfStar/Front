import { useNavigate } from 'react-router-dom';
import { useScale } from '../../hooks/useScale';
import Background from '../../components/ui/Background';
import NextButton from './NextButton';

const PersonalInfo = () => {
  const navigate = useNavigate();
  const scale = useScale();

  return (
    <div className="relative w-full h-screen overflow-hidden flex flex-col items-center justify-center">
      <Background />

      <div 
        className="bg-green-600 text-white text-center font-bold z-50"
        style={{
          width: `calc(65% * ${scale})`,
          borderWidth: `calc(4px * ${scale})`,
          borderColor: '#15803d', // green-700
          borderStyle: 'solid',
          borderRadius: `calc(12px * ${scale})`,
          padding: `calc(16px * ${scale})`,
          fontSize: `calc(3xl * ${scale})`,
          marginBottom: `calc(24px * ${scale})`
        }}
      >
        아래의 내용을 입력해주세요
      </div>

      <div 
        className="bg-green-500 z-50"
        style={{
          width: `calc(70% * ${scale})`,
          borderWidth: `calc(4px * ${scale})`,
          borderColor: '#15803d', // green-700
          borderStyle: 'solid',
          borderRadius: `calc(8px * ${scale})`,
          padding: `calc(24px * ${scale})`
        }}
      >
        <div 
          className="flex flex-col"
          style={{ gap: `calc(24px * ${scale})` }}
        >
          <div className="flex items-center justify-between">
            <label 
              className="text-white font-bold w-1/3 text-left"
              style={{ fontSize: `calc(2xl * ${scale})` }}
            >
              이름
            </label>
            <input
              type="text"
              className="w-2/3 bg-white rounded-md px-3 text-gray-800"
              style={{
                height: `calc(40px * ${scale})`,
                borderRadius: `calc(6px * ${scale})`,
                paddingLeft: `calc(12px * ${scale})`,
                paddingRight: `calc(12px * ${scale})`,
                fontSize: `calc(1rem * ${scale})`
              }}
              placeholder="이름을 입력하세요"
            />
          </div>

          <div className="flex items-center justify-between">
            <label 
              className="text-white font-bold w-1/3 text-left"
              style={{ fontSize: `calc(2xl * ${scale})` }}
            >
              나이
            </label>
            <input
              type="text"
              className="w-2/3 bg-white rounded-md px-3 text-gray-800"
              style={{
                height: `calc(40px * ${scale})`,
                borderRadius: `calc(6px * ${scale})`,
                paddingLeft: `calc(12px * ${scale})`,
                paddingRight: `calc(12px * ${scale})`,
                fontSize: `calc(1rem * ${scale})`
              }}
              placeholder="나이를 입력하세요"
            />
          </div>

          <div className="flex items-center justify-between">
            <label 
              className="text-white font-bold w-1/3 text-left"
              style={{ fontSize: `calc(2xl * ${scale})` }}
            >
              연락처
            </label>
            <input
              type="text"
              className="w-2/3 bg-white rounded-md px-3 text-gray-800"
              style={{
                height: `calc(40px * ${scale})`,
                borderRadius: `calc(6px * ${scale})`,
                paddingLeft: `calc(12px * ${scale})`,
                paddingRight: `calc(12px * ${scale})`,
                fontSize: `calc(1rem * ${scale})`
              }}
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