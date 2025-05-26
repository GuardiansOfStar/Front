import { useNavigate } from 'react-router-dom';
import { useScale } from '../../hooks/useScale';
import Background from '../../components/ui/Background';
import NextButton from './NextButton';
import HomeButton from '../../components/ui/HomeButton';

const PersonalInfo = () => {
  const navigate = useNavigate();
  const scale = useScale();

  return (
    <div className="relative w-full h-full">
      <Background />
      <HomeButton />

      {/* 타이틀 */}
      <div 
        className="absolute bg-green-600 border-green-700 z-50"
        style={{
          width: `calc(718px * ${scale})`,
          height: `calc(100px * ${scale})`,
          left: `calc(153px * ${scale})`,
          top: `calc(159px * ${scale})`,
          borderWidth: `calc(10px * ${scale})`,
          borderStyle: 'solid',
          borderColor: '#0E8E12',
          borderRadius: `calc(30px * ${scale})`,
          backgroundColor: '#0DA429',
          boxShadow: 'inset 0px 4px 4px rgba(0, 0, 0, 0.25)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <div
          className="text-center font-bold text-white"
          style={{
            fontSize: `calc(55px * ${scale})`,
            lineHeight: `calc(66px * ${scale})`
          }}
        >
          아래의 내용을 입력해주세요
        </div>
      </div>

      {/* 입력 폼 컨테이너 */}
      <div 
        className="absolute z-40"
        style={{
          width: `calc(732px * ${scale})`,
          height: `calc(321px * ${scale})`,
          left: `calc(146px * ${scale})`,
          top: `calc(286px * ${scale})`,
          borderWidth: `calc(10px * ${scale})`,
          borderStyle: 'solid',
          borderColor: '#0E8E12',
          borderRadius: `calc(20px * ${scale})`,
          backgroundColor: 'rgba(14, 142, 18, 0.5)',
          boxSizing: 'border-box'
        }}
      >
        {/* 이름 필드 */}
        <div 
          className="absolute"
          style={{
            left: `calc(131px * ${scale})`,
            top: `calc(44px * ${scale})`
          }}
        >
          <label 
            className="absolute text-white font-bold"
            style={{
              width: `calc(87px * ${scale})`,
              height: `calc(60px * ${scale})`,
              fontSize: `calc(50px * ${scale})`,
              lineHeight: `calc(60px * ${scale})`,
              left: 0,
              top: 0
            }}
          >
            이름
          </label>
          <input
            type="text"
            className="absolute bg-white text-gray-800"
            style={{
              width: `calc(310px * ${scale})`,
              height: `calc(61px * ${scale})`,
              left: `calc(157px * ${scale})`,
              top: 0,
              borderRadius: `calc(10px * ${scale})`,
              paddingLeft: `calc(16px * ${scale})`,
              paddingRight: `calc(16px * ${scale})`,
              fontSize: `calc(24px * ${scale})`,
              border: 'none',
              outline: 'none'
            }}
            placeholder="이름을 입력하세요"
          />
        </div>

        {/* 나이 필드 */}
        <div 
          className="absolute"
          style={{
            left: `calc(131px * ${scale})`,
            top: `calc(130px * ${scale})`
          }}
        >
          <label 
            className="absolute text-white font-bold"
            style={{
              width: `calc(87px * ${scale})`,
              height: `calc(60px * ${scale})`,
              fontSize: `calc(50px * ${scale})`,
              lineHeight: `calc(60px * ${scale})`,
              left: 0,
              top: 0
            }}
          >
            나이
          </label>
          <input
            type="number"
            className="absolute bg-white text-gray-800"
            style={{
              width: `calc(310px * ${scale})`,
              height: `calc(61px * ${scale})`,
              left: `calc(157px * ${scale})`,
              top: 0,
              borderRadius: `calc(10px * ${scale})`,
              paddingLeft: `calc(16px * ${scale})`,
              paddingRight: `calc(16px * ${scale})`,
              fontSize: `calc(24px * ${scale})`,
              border: 'none',
              outline: 'none'
            }}
            placeholder="나이를 입력하세요"
          />
        </div>

        {/* 전화번호 필드 */}
        <div 
          className="absolute"
          style={{
            left: `calc(91px * ${scale})`,
            top: `calc(216px * ${scale})`
          }}
        >
          <label 
            className="absolute text-white font-bold"
            style={{
              width: `calc(127px * ${scale})`,
              height: `calc(60px * ${scale})`,
              fontSize: `calc(50px * ${scale})`,
              lineHeight: `calc(60px * ${scale})`,
              left: 0,
              top: 0
            }}
          >
            연락처
          </label>
          <input
            type="tel"
            className="absolute bg-white text-gray-800"
            style={{
              width: `calc(310px * ${scale})`,
              height: `calc(61px * ${scale})`,
              left: `calc(197px * ${scale})`,
              top: 0,
              borderRadius: `calc(10px * ${scale})`,
              paddingLeft: `calc(16px * ${scale})`,
              paddingRight: `calc(16px * ${scale})`,
              fontSize: `calc(24px * ${scale})`,
              border: 'none',
              outline: 'none'
            }}
            placeholder="연락처를 입력하세요"
          />
        </div>
      </div>
      
      <NextButton to="/memory" />
    </div>
  );
};

export default PersonalInfo;