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
      <div className="w-[60%] h-[25%] bg-green-600 bg-opacity-90 rounded-lg p-8 text-white text-center shadow-lg z-10 flex flex-col items-center justify-center leading-tight">
        <h2 className="text-3xl font-bold mb-2">잘 다녀 오셨어요?</h2>
        <h3 className="text-2xl font-bold">안전운전하는 할머니/할아버지가 세상에서 제일 멋져요!</h3>
    </div>


      <img
        src={get_certificate}
        alt="수료증 받기 버튼"
        onClick={() => navigate('/')}
        className="absolute bottom-[10%] left-1/2 transform -translate-x-1/2
        w-[20%] 
        cursor-pointer z-10 
        hover:scale-105 transition-transform duration-300"
      />
    </div>
  );
};

export default Certificate;
