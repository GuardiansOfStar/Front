import { useNavigate } from 'react-router-dom';
import { useScale } from '../../hooks/useScale';
import Background from '../../components/ui/Background';

const smiling_grandchildren = '/assets/images/grandchildren_happy.png'
const get_certificate = '/assets/images/get_certificate.png'

const Certificate = () => {
  const navigate = useNavigate();
  const scale = useScale();

  return (
    <div className="relative w-full h-screen overflow-hidden flex flex-col items-center justify-center">
      <Background />
      
      <img
        src={smiling_grandchildren}
        alt="웃는 손주들"
        className="absolute left-1/2 transform -translate-x-1/2 z-50"
        style={{
          top: `calc(10% * ${scale})`,
          width: `calc(15% * ${scale})`,
          height: 'auto'
        }}
      />
      
      <div 
        className="bg-white text-black font-bold z-40 flex flex-col items-center justify-center"
        style={{
          width: `calc(70% * ${scale})`,
          height: `calc(40% * ${scale})`,
          borderWidth: `calc(8px * ${scale})`,
          borderColor: '#16a34a', // green-600
          borderStyle: 'solid',
          borderRadius: `calc(8px * ${scale})`
        }}
      >
        <h2 
          className="mb-2"
          style={{ fontSize: `calc(2xl * ${scale})` }}
        >
          무사히 돌아와줘서 고마워요
        </h2>
        <h3 
          style={{ fontSize: `calc(2xl * ${scale})` }}
        >
          안전운전하는 할머니/할아버지가 자랑스러워요
        </h3>
      </div>

      <img
        src={get_certificate}
        alt="수료증 받기 버튼"
        onClick={() => navigate('/info')}
        className="absolute left-1/2 transform -translate-x-1/2 cursor-pointer z-10 hover:scale-105 transition-transform duration-300"
        style={{
          bottom: `calc(10% * ${scale})`,
          width: `calc(20% * ${scale})`
        }}
      />
    </div>
  );
};

export default Certificate;