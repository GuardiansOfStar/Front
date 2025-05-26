import { useNavigate } from 'react-router-dom';
import { useScale } from '../../hooks/useScale';
import Background from '../../components/ui/Background';
import HomeButton from '../../components/ui/HomeButton';

const smiling_grandchildren = '/assets/images/grandchildren_happy.png'
const get_certificate = '/assets/images/get_certificate.png'

const Certificate = () => {
  const navigate = useNavigate();
  const scale = useScale();

  return (
    <div className="relative w-full h-full">
      <Background />
      <HomeButton />
      
      {/* 손자손녀 이미지 */}
      <img
        src={smiling_grandchildren}
        alt="웃는 손주들"
        className="absolute z-50"
        style={{
          width: `calc(416px * ${scale})`,
          height: `calc(259px * ${scale})`,
          left: `calc(304px * ${scale})`, // 중앙 정렬: (1024 - 416) / 2
          top: `calc(50px * ${scale})`
        }}
      />
      
      {/* 메시지 박스 */}
      <div 
        className="absolute bg-white bg-opacity-75 border-green-700 z-40"
        style={{
          width: `calc(709px * ${scale})`,
          height: `calc(242px * ${scale})`,
          left: `calc(157px * ${scale})`,
          top: `calc(281px * ${scale})`,
          borderWidth: `calc(10px * ${scale})`,
          borderStyle: 'solid',
          borderColor: 'rgba(14, 142, 18, 0.8)',
          borderRadius: `calc(30px * ${scale})`,
          backgroundColor: 'rgba(255, 250, 250, 0.75)',
          boxShadow: 'inset 0px 4px 4px rgba(0, 0, 0, 0.25)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <div
          className="text-center font-black"
          style={{
            width: `calc(614px * ${scale})`,
            fontSize: `calc(40px * ${scale})`,
            lineHeight: `calc(60px * ${scale})`,
            color: '#000000'
          }}
        >
          무사히 돌아와줘서 고마워요<br />
          안전운전하는 할머니/할아버지가 자랑스러워요
        </div>
      </div>

      {/* 수료증 받기 버튼 */}
      <img
        src={get_certificate}
        alt="수료증 받기 버튼"
        onClick={() => navigate('/info')}
        className="absolute cursor-pointer z-50 hover:scale-105 transition-transform duration-300"
        style={{
          width: `calc(293px * ${scale})`,
          height: `calc(126px * ${scale})`,
          left: `calc(365px * ${scale})`, // 중앙 정렬: (1024 - 293) / 2
          bottom: `calc(80px * ${scale})`
        }}
      />
    </div>
  );
};

export default Certificate;