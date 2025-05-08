import { useNavigate } from 'react-router-dom';
import Background from '../../components/Background';
import smiling_grandchildren from 'assets/images/smiling_grandchildren.png'
import get_certificate from 'assets/images/get_certificate.png'

const Certificate = () => {
  const navigate = useNavigate();

  return (
    <div
      className="relative w-full h-screen overflow-hidden flex flex-col items-center justify-center"
    >
      <Background />
      <img
        src={smiling_grandchildren}
        alt="웃는 손주들"
        className="absolute top-[10%] left-1/2 transform -translate-x-1/2
        w-[15%] h-auto"
        />
      <div className="w-[70%] h-[40%] bg-white border-8 border-green-600 rounded-lg flex flex-col items-center justify-center text-black font-bold z-50">
        <h2 className="text-2xl mb-2">무사히 돌아와줘서 고마워요</h2>
        <h3 className="text-2xl">안전운전하는 할머니/할아버지가 자랑스러워요</h3>
      </div>



      <img
        src={get_certificate}
        alt="수료증 받기 버튼"
        onClick={() => navigate('/info')}
        className="absolute bottom-[10%] left-1/2 transform -translate-x-1/2
        w-[20%] 
        cursor-pointer z-10 
        hover:scale-105 transition-transform duration-300"
      />
    </div>
  );
};

export default Certificate;
